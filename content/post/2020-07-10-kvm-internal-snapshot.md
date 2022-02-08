---
author: wade
date: 2020-07-10 12:09:00+00:00
draft: false
title: KVM Internal Snapshot 快照教學
type: post
url: /post/kvm-internal-snapshot/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- headless
- KVM
- Virtualization
---

虛擬機最迷人之處大概就是快照功能了，花個幾秒建個快照，有問題馬上就可以還原，可以省下無數的時間。KVM 同樣也支援快照的功能，不過它有兩種不同的建立方式，<span class="hl-blue">Internal Snapshot</span> 與 <span class="hl-blue">External Snapshot</span>，這邊先介紹比較簡單的 internal snapshot

internal snapshot 是 libvirt 預設使用的快照模式，用 virsh 指令就可以建立與還原，算是最簡便的方式，不過 <span class="hl-red">internal snapshot 比起 external snapshot 的劣勢在於建立快照的時間較久，且只支援 qcow2 的 image 格式，不過所有操作都可在 virsh 下完成</span>（用 virt-manager 的預設模式也是 internal）因此在系統不是特別複雜或只是稍微想測試個小東西時很適合使用。

\
建立 internal snapshot

```bash
sudo virsh snapshot-create-as \
--domain [VM_Name] \
--name [Snapshot_Name] \
--description "first snapshot" \
--atomic
```

* <span class="hl-green mono">--domain</span>：虛擬機的名稱
* <span class="hl-green mono">--name</span>：snapshot 的命名
* <span class="hl-green mono">--description</span>：snapshot 的描述
* <span class="hl-green mono">--atomic</span>：加上 atomic 參數，libvirt 會確保 snapshot 可以建立成功，如果不成功的話，就不會對 images 有所變更，可以讓 images 不至於因為 snapshot 建立失敗而損毀

\
查看虛擬機的 snapshot 列表

```bash
sudo virsh snapshot-list --domain [VM_Name]
```

```bash
# 執行結果：

Name                 Creation Time             State
------------------------------------------------------------
take-1               2020-06-29 21:35:46 +0800 shutoff
take-2               2020-06-29 21:38:34 +0800 shutoff
```

\
查看 snapshots 的樹狀關係圖

```bash
sudo virsh snapshot-list --domain [VM_Name] --tree
```

```bash
# 執行結果：

take-1
|
+- take-2
```

\
查看 snapshots 的相依關係

```bash
sudo virsh snapshot-list --domain [VM_Name] --parent
```

```bash
# 執行結果：

Name                 Creation Time             State           Parent
------------------------------------------------------------
take-1               2020-06-29 21:35:46 +0800 shutoff         (null)
take-2               2020-06-29 21:46:03 +0800 running         take-1

# 可以看出 take-2 是以 take-1 為底所建立的
```

\
透過 snapshot 還原虛擬機

```bash
sudo virsh snapshot-revert --domain [VM_Name] --snapshotname [SnapShot_Name]
```

\
刪除 Internal snapshot

```bash
sudo virsh snapshot-delete --domain [VM_Name] --snapshotname [SnapShot_Name]
```

```bash
# 執行結果：

Domain snapshot take-2 deleted

# 把 take-2 刪掉
```

### KVM 虛擬機系列文章：

[KVM External Snapshot 快照教學](https://notes.wadeism.net/post/kvm-external-snapshot/)

[KVM 使用 overlay 製作虛擬機 Clone](https://notes.wadeism.net/post/kvm-create-vm-clone-by-overlay/)

[KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)

[KVM 網路設定教學](https://notes.wadeism.net/post/kvm-network-setup/)

[KVM 使用 qemu-img 建立與調整虛擬硬碟](https://notes.wadeism.net/post/kvm-create-volume-by-qemu-img/)
