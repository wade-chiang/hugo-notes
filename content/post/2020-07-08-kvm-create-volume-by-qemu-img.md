---
author: wade
date: 2020-07-08 13:50:21+00:00
draft: false
title: KVM 使用 qemu-img 建立與調整虛擬硬碟
type: post
url: /post/kvm-create-volume-by-qemu-img/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- headless
- KVM
- Virtualization
---

在 [KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)一文裡，安裝新的虛擬機是直接在 virt-install 的過程中建立了新的硬碟 image，並指定了存放的路徑、磁碟的大小與格式


```bash
--disk /kvm/test.qcow2,size=8,bus=virtio,format=qcow2
```

其實建立硬碟這個步驟，我們也可以使用 qemu-img 這個指令事先將 image 建好，之後使用 virt-install 指定 disk 就不用另外加其它參數

\
建立一個 5G 的 qcow2 格式 image（qcow2 格式比傳統的 raw 支援更多先進的功能）

```bash
qemu-img create -f qcow2 test.qcow2 5G
```

\
查看 image 的資料

```bash
qemu-img info test.qcow2 
```

```bash
# 執行結果：

image: test.qcow2
file format: qcow2
virtual size: 5.0G (5368709120 bytes)
disk size: 196K
cluster_size: 65536
Format specific information:
compat: 1.1
lazy refcounts: false
refcount bits: 16
corrupt: false
```

\
將 image 的大小增加 1G

```bash
qemu-img resize test.qcow2 +1G
```

\
將 image 大小減少 1G

```bash
qemu-img resize --shrink test.qcow2 -1G
```

\
直接將 image 設為 7G

```bash
qemu-img resize test.qcow2 7G
```

這邊的指令基本上都差不多，特別注意只要是將 image 縮小的動作，不管減少 1G 還是直接指定更小 的 size，resize 的後面都要加上 <span class="hl-blue">--shrink</span>，而且 image 裡已經有資料的話，減少它的容量有可能會導致資料毀損遺失

### KVM 虛擬機系列文章：

[KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)

[KVM 網路設定教學](https://notes.wadeism.net/post/kvm-network-setup/)

[KVM Internal Snapshot 快照教學](https://notes.wadeism.net/post/kvm-internal-snapshot/)

[KVM External Snapshot 快照教學](https://notes.wadeism.net/post/kvm-external-snapshot/)

[KVM 使用 overlay 製作虛擬機 Clone](https://notes.wadeism.net/post/kvm-create-vm-clone-by-overlay/)
