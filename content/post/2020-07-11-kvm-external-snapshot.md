---
author: wade
date: 2020-07-11 10:53:59+00:00
draft: false
title: KVM External Snapshot 快照教學
type: post
url: /post/kvm-external-snapshot/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- headless
- KVM
- Virtualization
---

external snapshot 的機制與 internal 有很大的不同。internal snapshot 每一次快照的資料都是存在原始 image 裡（用  qemu-img  檢查 image 時可以看到），而 external snapshot 是在建立快照時，將原本掛載的硬碟 image 變成一個 read only 的 backing file，然後另外建一個 overlay 檔案替換原本虛擬機的掛載硬碟，所有的變動都會在寫在 overlay 裡而不會去影響到原始的 image。

舉例來說，原始 image 就像一張白紙，external snapshot 會做出一張大小相同的透明紙並且疊在原本的白紙上，我可以恣意的加很多張透明紙，或是在透明紙上亂畫都不會影響到原本的白紙，等到我想還原了，把透明片拿掉就是了，但如果畫完的作品很滿意，我也可以把透明片與白紙永久的黏在一起。

external snapshot 的好處在於快速、不易出錯，支援的 image 格式不限於 qcow2（raw、qcow、vmdk 皆可），但 <span class="hl-red">external snapshot 最大的缺點在於 libvirt 對它的支援還不是很完整，雖然可以使用 virsh 來建立 snapshot，但無法用指令還原</span>。要還原 external snapshot 目前唯一的方法只有去手動改虛擬機的掛載磁碟，將 disk 從 overlay 改回原本的 image。


## 建立  external snapshot

檢視虛擬機儲存設備的掛載狀況

```bash
sudo virsh domblklist [VM_Name] --details
```

```bash
# 執行結果：

Type       Device     Target     Source
------------------------------------------------
file       disk       vda        /kvm/test.qcow2

# guest 目前使用 /kvm/test.qcow2 這個 image 
```

\
建立  external snapshot

```bash
sudo virsh snapshot-create-as \
--domain [VM_Name] \
--name [Snapshot_Name] \
--description "first snapshot" \
--disk-only \
--quiesce \
--atomic
```

* <span class="hl-green mono">--disk-only</span>：單純對 disk image 做 snapshot
* <span class="hl-green mono">--quiesce</span>：如果沒有加 quiesce 選項，在做 snapshot 過程中一些記憶體正要寫入磁碟的資料將不會被保存下來，且建 snapshot 過程中的一些變動也可能會毀損，因此該選項一定要加上！

\
檢視虛擬機儲存設備的掛載狀況

```bash
sudo virsh domblklist [VM_Name] --details
```

```bash
# 執行結果：

Type       Device     Target     Source
------------------------------------------------
file       disk       vda        /kvm/test.take-1

# guest 現在使用的 disk 已經自動改成剛才建立的 snapshot 了
```

\
建立  external snapshot 並指定 snapshot 的路徑

```bash
virsh snapshot-create-as \
--domain [VM_Name] \
--name [Snapshot_Name] \
--description "first snapshot" \
--diskspec vda,snapshot=external,file=/kvm/test/test.take-2 \
--disk-only \
--quiesce \
--atomic
```

* <span class="hl-green mono">--diskspec</span>：指定 snapshot 的目錄磁碟（vda）、類型（external）、存放路徑與檔名（/kvm/test/test.take-2）

\
檢視虛擬機的 image 掛載狀況

```bash
sudo virsh domblklist [VM_Name] --details
```

```bash
# 執行結果：

Type       Device     Target     Source
------------------------------------------------
file       disk       vda        /kvm/test/test.take-2

# disk 又從 /kvm/test.take-1 變成 /kvm/test/test.take-2
```

\
檢視 snapshot 的相依性

```bash
sudo qemu-img info --backing-chain /kvm/test/test.take-2 | grep backing
```

```bash
# 執行結果：

backing file: /kvm/test.take-1
backing file format: qcow2
backing file: /kvm/test.qcow2
backing file format: qcow2
```

第二個 snapshot：test.take-2 的 backing file 是 /kvm/test.take-1  
第一個 snapshot：test.take-1 的 backing file 是 /kvm/test.qcow2


## 還原 external snapshot

前面提過還原 external snapshot 是它難搞的地方，因為沒有指令可用，所以只能將硬碟卸載，然後把原本的 backing file 掛回去。

\
檢查 image 狀態（如果 image 使用中，須關機再檢查）

```bash
sudo qemu-img check /kvm/test/test.take-2
```

```bash
# 執行結果：

No errors were found on the image.
500/131072 = 0.38% allocated, 10.80% fragmented, 0.00% compressed clusters
Image end offset: 33685504
```

\
檢視虛擬機儲存設備的掛載狀況

```bash
sudo virsh domblklist [VM_Name] --details
```

```bash
# 執行結果：

Type       Device     Target     Source
------------------------------------------------
file       disk       vda        /kvm/test/test.take-2

# 目前使用的是 take-2 版本的 snapshot
```

\
移除虛擬機的硬碟

```bash
sudo virt-xml [VM_Name] --remove-device --disk target=vda
```

```bash
# 執行結果：

Domain 'test' defined successfully.
WARNING  XML did not change after domain define. You may have changed a value that libvirt is setting by default.
```

\
將想要還原的 image（take-1）掛載到虛擬機上

```bash
sudo virt-xml [VM_Name] --add-device --disk /kvm/test.take-1,format=qcow2,bus=virtio
```

```bash
# 執行結果：

Domain 'test' defined successfully.
WARNING  XML did not change after domain define. You may have changed a value that libvirt is setting by default.
```

\
檢視虛擬機儲存設備的掛載狀況

```bash
sudo virsh domblklist [VM_Name] --details
```

```bash
# 執行結果：

Target     Source
------------------------------------------------
vda        /kvm/test.take-1

# 掛載硬碟改回  take-1 了
```

還原回來後開機就可以看到系統回到 take-1 版本的 snapshot了


## 刪除 external shapshot

以上面的例子來看，虛擬機的版本已從 take-2 還原到 take-1，這時如果我試著用指令刪掉 take-2

```bash
virsh snapshot-delete --domain [VM_Name] take-2

```

```bash
# 執行結果：

error: Failed to delete snapshot take-2
error: unsupported configuration: deletion of 1 external disk snapshots not supported yet
```

這是因為 external snapshot 無法用內建的指令來操作，只能手動刪除，算是非常麻煩的一個地方，下面就來說明一下手動刪除的方法

\
檢查虛擬機的 snapshot 列表

```bash
virsh snapshot-list [VM_Name]
```

```bash
# 執行結果：

Name                 Creation Time             State
------------------------------------------------------------
take-1               2020-07-05 19:39:54 +0800 disk-snapshot
take-2               2020-07-05 19:41:59 +0800 disk-snapshot
```

\
刪除虛擬機 metadata 裡的 take-2 snapshot 資抖

```bash
sudo virsh snapshot-delete --domain [VM_Name] --snapshotname take-2 --metadata
```

\
再次檢查 guest 的 snapshot 列表

```bash
virsh snapshot-list [VM_Name]
```

```bash
# 執行結果：

Name                 Creation Time             State
------------------------------------------------------------
take-1               2020-07-05 19:39:54 +0800 disk-snapshot
```

已把虛擬機 metadata 中的 take-2 刪除

\
刪除 take-2 snapshot 的 image 

```bash
sudo rm /kvm/test/test.take2
```

剛才只是刪除了 metadata，整個 snapshot 的 image 還是在原地，所以另外手動將 image 刪掉


## 合併 external snapshot

一般我們建 snapshot 多是為了測試方便，如果確定測試沒問題的話，可以將 external snapshot 與原始 backing file 合併。

從書上看到<span class="hl-red">建議是盡量不要保留 snapshot ，用不到或測試 ok 的 snapshot 要嘛刪掉要嘛就是合併回去，snapshot 的意義應該是用來保存一個時間下的狀態，讓我們方便快速測試與還原，但不要將 snapshot 當作是一種備份的手段</span>（這跟 Cloud 上 snapshot 的意義不太一樣）

合併 snapshot 與 backing file 也有兩種不同的模式：<span class="hl-blue">blockcommit</span> 與 <span class="hl-blue">blockpull</span>

### 使用 blockcommit 將 snapshop 合併回 backing file

前面提到，snapshot 不宜長期保留，因為過多的 snapshot 可能會影響到系統的資源與效能，畢竟 external snapshot 是一層接一層的都有相依關係，如果中間有一個 overlay 出錯了，後面所有的東西都會不能用，所以建議測試到一個段落，就把所有的 snapshot 合併回 backing file，然後將 snapshot 刪除，以確保系統的乾淨與安全。  

檢視虛擬機的 image 掛載狀況

```bash
sudo virsh domblklist [VM_Name]
```

```bash
# 執行結果：

Target     Source
------------------------------------------------
vda        /kvm/test.take-2

# guest 目前使用 take-2 的 snapshot
```

\
檢查 snapshot 的相依性

```bash
sudo qemu-img info --backing-chain /kvm/test.take-2  | grep backing
```

```bash
# 執行結果：

backing file: /kvm/test.take-1
backing file format: qcow2
backing file: /kvm/test.qcow2
backing file format: qcow2

# take-2 相依於 test.take-1、take-1 相依於 test.qcow2
```

\
將所有的 snapshot 合併回最初始的 backing file

```bash
virsh blockcommit \
--domain [VM_Name] \
--path vda \
--verbose --pivot --active
```

```bash
# 執行結果：

Block commit: [100 %]
Successfully pivoted
```

如果合併失敗出現「error: Requested operation is not valid: domain is not running」，可能是因為這個步驟 guest 需要開啟才能執行

\
檢視虛擬機的 image 掛載狀況

```bash
sudo virsh domblklist [VM_Name]
```

```bash
# 執行結果：

Target     Source
------------------------------------------------
vda        /kvm/test.qcow2

# guest 用回了最早的 test.qcow2 了
```

\
列出虛擬機的 snapshot

```bash
sudo virsh snapshot-list [VM_Name]
```

```bash
# 執行結果：

Name                 Creation Time             State
------------------------------------------------------------
take-1               2020-07-05 19:41:54 +0800 disk-snapshot
take-2               2020-07-06 00:10:33 +0800 shutoff
```

既然 snapshot 都已經合併回最原始的 image 裡，那麼這兩個 snapshot 也就可以功成身退了

\
一次刪除虛擬機所有的 snapshot

```bash
virsh snapshot-delete \
--domain [VM_Name] \
--snapshotname [The_First_Snapshot] \
--children --metadata
```

```bash
# 執行結果：

Domain snapshot take-1 deleted
```

加上 --children 會把底下所有的 son snapshot 一起刪除，也別忘了刪掉 snapshot 的 image

\
列出虛擬機的 snapshot

```bash
sudo virsh snapshot-list test
```

```bash
# 執行結果：

Name                 Creation Time             State
------------------------------------------------------------

# 所有的 snapshot 都刪光了
```

### 使用 blockpull 將 backing file 合併至 snapshot

剛才的 blockcommit 是把所有的 snapshot 併回 backing file，blockpull 則是反過來將 backing file 的內容通通寫入當前的 snapshot 中，最後 snapshot 就會變成一個完整獨立的 image ，不再需要 backing file 的相依，其實最後的結果與 blockcommit 非常類似，但意義上不太一樣，且執行速度也會比較慢

\
檢視虛擬機的 image 掛載狀況

```bash
sudo virsh domblklist [VM_Name]
```

```bash
# 執行結果：

Target     Source
------------------------------------------------
vda        /kvm/test.take-1

# guest 目前使用 take-1 的 snapshot
```

\
檢查 snapshot 的相依性

```bash
sudo qemu-img info --backing-chain /kvm/test.take-1  | grep backing
```

```bash
# 執行結果：

backing file: /kvm/test.qcow2
backing file format: qcow2

# take-1 相依於 test.qcow2
```

\
將 backing file 合併到 snapshot 中，這邊以第一個 snapshot「take-1」為例

```bash
sudo virsh blockpull \
--domain [VM_Name] \
--path /kvm/test.take-1 \
--wait --verbose
```

\
檢查 take-1 的 image

```bash
sudo qemu-img info --backing-chain /kvm/test.take-1
```

```bash
# 執行結果：

image: /kvm/test.take-1
file format: qcow2
virtual size: 8.0G (8589934592 bytes)
disk size: 1.5G
cluster_size: 65536
Format specific information:
compat: 1.1
lazy refcounts: false
refcount bits: 16
corrupt: false
```

可以看到 take-1 的 image size 變大，且沒有相依的 backing file，已整合成一個完整獨立的 image

### KVM 虛擬機系列文章：

[KVM 使用 overlay 製作虛擬機 Clone](https://notes.wadeism.net/post/kvm-create-vm-clone-by-overlay/)

[KVM Internal Snapshot 快照教學](https://notes.wadeism.net/post/kvm-internal-snapshot/)

[KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)

[KVM 網路設定教學](https://notes.wadeism.net/post/kvm-network-setup/)

[KVM 使用 qemu-img 建立與調整虛擬硬碟](https://notes.wadeism.net/post/kvm-create-volume-by-qemu-img/)
