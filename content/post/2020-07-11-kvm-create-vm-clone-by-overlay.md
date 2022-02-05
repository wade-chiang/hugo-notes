---
author: wade
date: 2020-07-11 11:01:30+00:00
draft: false
title: KVM 使用 overlay 製作虛擬機 Clone
type: post
url: /post/kvm-create-vm-clone-by-overlay/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- headless
- KVM
- Virtualization
---

[前面的文章](https://notes.wadeism.net/post/kvm-external-snapshot/)裡介紹了 external snapshot 的使用方法與優缺點，雖然穩定快速、效率佳，但由於目前的 libvirt 對它的支援度還不是很好，不管是快照的還原或刪除都相對麻煩，所以我不太會拿它來做快照，反而它的 backing file 與 overlay 技術時常被我拿來當作虛擬機的 clone 來用。

舉例來說，通常我新建一個乾淨的系統，例如 CentOS 8 minimal，裝完後這個虛擬機（image）就不會去動了，實際要使用虛擬機的時候，我會用這個乾淨的 image 去做一個相依於它的 overlay，再以這個 overlay 去建一台新的機器。

雖然 virsh 也有內建 clone 的選項，但用 overlay 當作 clone 的好處在於使用的空間小，畢竟大多的內容都是在 backing file 裡，特別是在建立多個虛擬機時，所有 overlay 都共用一個 backing file，空間可以省更多。使用 overlay 建立機器的速度也快，只要注意原始的 image（backing file）不要去動到就好。

\
檢查虛擬機使用的硬碟

```bash
sudo virsh domblklist --domain CentOS_8-Initial
```

```bash
# 執行結果：

Target     Source
------------------------------------------------
vda        /kvm/centos8-initial.qcow2
```

本次範例系統中已存在一台虛擬機，虛擬機名稱 {{< blue >}}CentOS_8-Initial{{< /blue >}}，該虛擬機使用的 image 為 {{< blue >}}/kvm/centos8-initial.qcow2{{< /blue >}}

\
為 disk image 建立 overlay

```bash
cd /kvm
```

```bash
sudo qemu-img create -b centos8-initial.qcow2 -F qcow2 centos8-docker.ovl -f qcow2
```

```bash
# 執行結果：

Formatting 'centos8-docker.ovl', fmt=qcow2 size=8589934592 backing_file=centos8-initial.qcow2 cluster_size=65536 lazy_refcounts=off refcount_bits=16
```

* {{< green >}}{{< mono >}}-b{{< /green >}}{{< /mono >}}：指定要當來源的 backing file
* {{< green >}}{{< mono >}}-F{{< /green >}}{{< /mono >}}：表明來源 image 的格式，本例為 qcow2（非必須，但有些版本的 qemu-img 需要此項目才能成功建立）
* {{< green >}}{{< mono >}}-f{{< /green >}}{{< /mono >}}：指定 disk image 的格式，這邊使用與來源相同的 qcow2

上面的指令會以 {{< blue >}}centos8-initial.qcow2{{< /blue >}} 為基底 backing file，去做出相依於它的 overlay，本例中 overlay 檔名取為 {{< blue >}}centos8-docker.ovl{{< /blue >}}

\
使用 overlay 新建虛擬機

```bash
sudo virt-install \
--name CentOS_8-Docker \
--memory 1024 \
--vcpus 1 \
--cpu host-model-only \
--os-variant=centos8 \
--import \
--disk /kvm/centos8-docker.ovl \
--network network=default,model=virtio \
--network type=direct,source=ens3,model=virtio \
--graphics spice,listen=0.0.0.0,password=1234
```

```bash
# 執行結果：

WARNING  Requested memory 1024 MiB is less than the recommended 1536 MiB for OS centos8
WARNING  Graphics requested but DISPLAY is not set. Not running virt-viewer.
WARNING  No console to launch for the guest, defaulting to --wait -1

Starting install...
Domain installation still in progress.
Waiting for installation to complete.
```

使用 overlay 新建虛擬機的方法就跟[之前的教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)一樣，只要注意 {{< green >}}--disk{{< /green >}} 部分改為指定的 overlay 檔然後不要漏掉 {{< green >}}--import{{< /green >}} 參數即可。

指令輸入後，螢幕上的內容會是等待虛擬機的安裝，但因為這是一台 clone 出來的虛擬機，系統早就已經安裝好了，所以開啟之後並不會有安裝的過程，因此這時候我們可以用之前教的方式 vnc 遠端連進機器裡去做一次手動關機，或是用 arp 指令看一下虛擬機的 ip 是多少，再 ssh 連進去手動關機

```bash
Domain has shutdown. Continuing.
Domain creation completed.
You can restart your domain by running:
virsh --connect qemu:///system start CentOS_8-Docker
```

手動關機後，出現上面的訊息，就表示虛擬機已建立成功了。

\
我的習慣是每次要實驗一個新東西時，會讓它在一個初始的乾淨環境來跑。external snapshot 除了操作麻煩以外，太多層 snapshot 造成複雜的相依性也是我不喜歡的地方，如果用這種 backfing file 與 overlay 的關係去做虛擬機的 clone，不但可以快速建立出最乾淨的環境。而且建很多台不同功能的虛擬機也只需要少少的硬碟空間，算是一個得不會浪費這項技術的做法！

### KVM 虛擬機系列文章：

[KVM External Snapshot 快照教學](https://notes.wadeism.net/post/kvm-external-snapshot/)

[KVM 使用 qemu-img 建立與調整虛擬硬碟](https://notes.wadeism.net/post/kvm-create-volume-by-qemu-img/)

[KVM Internal Snapshot 快照教學](https://notes.wadeism.net/post/kvm-internal-snapshot/)

[KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)

[KVM 網路設定教學](https://notes.wadeism.net/post/kvm-network-setup/)
