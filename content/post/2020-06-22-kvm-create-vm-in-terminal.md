---
author: wade
date: 2020-06-22 16:20:10+00:00
draft: false
title: KVM 純文字環境下的虛擬機安裝教學
type: post
url: /post/kvm-create-vm-in-terminal/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- CentOS
- headless
- KVM
- Virtualization
---

KVM 是款基於 Linux 核心的虛擬化技術，搭配 gui 操作介面後就等同於 VMware Workstation 或是 VirtualBox 這類的軟體。雖然它們也有 Linux 版本，但我覺得 KVM 在效能上是更勝一籌（畢竟是用核心在處理）

用過 KVM 的人應該都知道 Virt-Manager 這套功能完整又簡單的 gui 虛擬機管理程式

![](https://image.wadeism.net/kvm01.png)

\
我的 server 為了簡潔所以通常不裝 gui，但因為 Virt-Manager 實在太好用，再加上 KVM 裝虛擬機時用預設的 gui 安裝會比較方便，所以我還是裝了肥大的 Gnome 3 只為了用 Virt-Manager 來管理我的虛擬機。

前陣子因為讀到[這篇文章](https://blog.gtwang.org/linux/kvm-qemu-virt-install-command-tutorial/)，裡頭提到了在 KVM 中可以使用 VNC 來看到虛擬機的畫面，有了這個方法 server 似乎就不需要裝 gui 也可以順利安裝虛擬機，剛好最近想為家裡的 server 升到 CentOS 8，所以就決定來試試看，打造一個沒有 gui 也可以簡單安裝與使用虛擬機的 home server


## 檢查環境

<span class="hl-green">本機</span>：Ubuntu 18.04  
<span class="hl-green">Remote Host</span>：CentOS 8 Minimal Install （headless）

這次的目標就是在沒有 gui 的 CentOS 8 上面安裝 KVM 並且使用 KVM 來安裝虛擬機。

首先檢查 server 的系統是否支援虛擬化

```bash
cat /proc/cpuinfo | grep -Eoi "vmx|svm"
```

```bash
# 執行結果：

svm
svm
svm
svm
svm
svm
svm
svm
```

如果使用 AMD 的 cpu 出現 svm、Intel cpu 出現 vmx 就表示 cpu 的虛擬化有打開，現在一般的 cpu 都有支援，如果沒有出現的話記得先去 BIOS 把相關的選項打開。

上面指令的結果出現 8 個 svm，表示這台電腦最多可以開到 7 台虛擬機（一台機器分配一個 cpu 的情況，扣掉本機一顆）

另外也可以用 lscpu 來檢查

```bash
lscpu | grep Virtual
```

```bash
# 執行結果：

Virtualization:        AMD-V        # AMD-V 即 AMD 的虛擬化技術
```


## 安裝 KVM 與相關套件

安裝 KVM

```bash
sudo dnf module install virt
```

\
安裝相關套件

```bash
sudo dnf install virt-install
```

\
檢查 KVM mod 是否有載入

```bash
lsmod | grep kvm
```

```bash
# 執行結果：

kvm_amd       111304  0 
kvm                   636965  1 kvm_amd
irqbypass          13503  1 kvm
```

\
檢驗 KVM 的 driver 是否完備

```bash
virt-host-validate
```

```bash
# 執行結果：

setlocale: No such file or directory
QEMU: Checking for hardware virtualization                                : PASS
QEMU: Checking if device /dev/kvm exists                                     : PASS
QEMU: Checking if device /dev/kvm is accessible                       : PASS
QEMU: Checking if device /dev/vhost-net exists                          : PASS
QEMU: Checking if device /dev/net/tun exists                              : PASS
QEMU: Checking for cgroup 'cpu' controller support                : PASS
QEMU: Checking for cgroup 'cpuacct' controller support        : PASS
QEMU: Checking for cgroup 'cpuset' controller support          : PASS
QEMU: Checking for cgroup 'memory' controller support       : PASS
QEMU: Checking for cgroup 'devices' controller support         : PASS
QEMU: Checking for cgroup 'blkio' controller support               : PASS
QEMU: Checking for device assignment IOMMU support          : WARN (No ACPI DMAR table found, IOMMU either disabled in BIOS or not supported by this hardware platform)
```

\
啟動 KVM service

```bash
sudo systemctl enable libvirtd.service && sudo systemctl start libvirtd.service
```


## 設定虛擬機的網路

KVM 裝好後，它會自動新增一個 NAT 的網路介面，名為 default，如果想要使用不同的連線方式或是修改 default 裡的網段，可以參考 這篇 文章

## 安裝虛擬機

先將防火牆打開 5900 port，之後 vnc 連線時會用到

```bash
sudo firewall-cmd --add-port=5900/tcp --permanent && sudo firewall-cmd --reload
```

\
使用<span class="hl-blue">virt-install</span> 指令來安裝一個新的虛擬機

```bash
sudo virt-install \
--name test \
--memory 1024 \
--vcpus 1 \
--cpu host-model-only \
--os-variant=centos8 \
--cdrom /tmp/CentOS-8.2.2004-x86_64-dvd1.iso \
--disk /kvm/test.qcow2,size=8,bus=virtio,format=qcow2 \
--network network=default,model=virtio \
--network type=direct,source=ens3,model=virtio \
--graphics vnc,listen=0.0.0.0,password=1234
```

* <span class="hl-green mono">--name</span>：虛擬機的名稱
* <span class="hl-green mono">--memory</span>：虛擬機的記憶體大小，單位為 MB
* <span class="hl-green mono">--vcpus</span>：要使用的 cpu 核心數，沒有特殊用途的話 1 顆就夠
* <span class="hl-green mono">--cpu</span>：cpu 的類型，使用 host-model-only 讓虛擬機也使用與本機相同的 cpu，可以有較好的效能
* <span class="hl-green mono">--os-variant</span>（選填）：要安裝的 os 範本，有指定的話效能表現會比較好，可以用 osinfo-query os 這個指令來查看支援的範本，將查到的 os Short ID 填在這個項目即可，如果想裝的 os 沒有在裡面，可以參考[這個網站](https://askubuntu.com/questions/1070500/why-doesnt-osinfo-query-os-detect-ubuntu-18-04) 來更新 os 列表
* <span class="hl-green mono">--cdrom</span>：指定系統 iso 光碟檔的路徑
* <span class="hl-green mono">--disk</span>：設定虛擬機硬碟的存放位置及大小，size 的單位為 GB，format 一般常用 qcow2
* <span class="hl-green mono">--network</span>：配給虛擬機的網路卡及其設定，這邊我給虛擬機裝了兩張網卡，<span class="hl-blue">network=default,model=virto</span> 這個設定就是使用剛才提到的 default NAT，<span class="hl-blue">type=direct,source=ens3,source_mode=bridge,model=virtio</span> 則是設定了 MacVTap 的橋接方式，可以讓 guest 與 host 拿到同一個網段的 ip，詳細說明可以看[這篇](https://notes.wadeism.net/post/kvm-network-setup/)
* <span class="hl-green mono">--graphics</span>：虛擬機要使用的遠端螢幕設定，vnc 是比較普遍的選項，另外也可以改用 spice，listen 部分是允許連入這台虛擬機的網段，password 則是 vnc 連線時所需的密碼

```bash
# 執行結果：

WARNING  Requested memory 1024 MiB is less than the recommended 1536 MiB for OS centos8
WARNING  無法連至圖形介面主控臺：尚未安裝 virt-viewer。請安裝 'virt-viewer' 套件。
WARNING  No console to launch for the guest, defaulting to --wait -1

正在開始進行安裝...
分配「test.qcow2」中                                                                                                                               | 8.0 GB  00:00:00     
Domain installation still in progress.
Waiting for installation to complete.
```

根據自己想要的設定執行 virt-install，出現上面的畫面時，從<span class="hl-red">本機</span>打開任何可以遠端連 vnc 的軟體，並將連線位址打上 <span class="hl-blue">vnc://Remote_Host_IP:5900</span>，就可以看到安裝畫面了

![](https://image.wadeism.net/kvm02.png)

安裝完成後，本次的課題也就大功告成了！

另外再次提醒，這台虛擬機上設了兩張網卡：  
1. server NAT 網卡  
2. MacVTap 橋接網卡

如果本機要連這台虛擬機，請使用與自身同網段的 192.168.122.x 來連線。remote server 想連虛擬機的話則必須使用 NAT 的 192.168.123.x 來連，而不能用實體網段的 192.168.122.x，這是 MacVTap 的限制。

另外如果虛擬機是安裝像 Windows 這類有 gui 的系統，那就只能在本機以 vnc 或 spice 來連入了（記得 vnc 的位址一樣是用 server 的 ip 而不是去直連虛擬機的 ip，除非虛擬機有 xrdp 之類的 service）


## 以現有的硬碟映像檔建立虛擬機

上面的步驟透過光碟 iso 檔來建立虛擬機，算是從無到有最基本的方法，不過如果我們已經有一個裝好系統的硬碟 image 檔，也可以直接用這個 image 來建立虛擬機，可以省掉安裝系統的步驟。

用 image 建立虛擬機也一樣是使用 <span class="hl-blue">virt-install</span>，不過執行 virt-install 前，我們先多開一個 terminal-2 然後 ssh 連進我們的 remote hot，接著回到原本的 terminal 執行 virt-install import 的指令

```bash
sudo virt-install \
--name take-1 \
--memory 1024 \
--vcpus 1 \
--cpu host-model-only \
--os-variant=centos8 \
--import \
--disk /kvm/take-1.ovl \
--network network=default,model=virtio \
--network type=direct,source=ens3,model=virtio \
--graphics spice,listen=0.0.0.0,password=asdf
```

* <span class="hl-green mono">--import</span>：跳過 os 的安裝步驟，直接以現有的 disk image 來建立虛擬機
* <span class="hl-green mono">--disk</span>：指定 disk image 的位置，如果有多個 --disk 參數，則第一個 disk 將會是虛擬機的開機碟

```bash
# 執行結果：

WARNING  Requested memory 1024 MiB is less than the recommended 1536 MiB for OS centos8
WARNING  Graphics requested but DISPLAY is not set. Not running virt-viewer.
WARNING  No console to launch for the guest, defaulting to --wait -1

Starting install...
Domain installation still in progress.
Waiting for installation to complete.
```

執行完出現上面畫面後，切換到 terminal-2 查詢 listen port 的資訊

```bash
sudo netstat -tlnup | grep qemu-kvm
```

```bash
# 執行結果：

tcp        0      0 0.0.0.0:5900            0.0.0.0:*               LISTEN      6439/qemu-kvm
tcp        0      0 0.0.0.0:5901            0.0.0.0:*               LISTEN      6599/qemu-kvm
```

<span class="hl-red">注意</span>：  
KVM 的 vnc 或 spice service 預設的 listen port 是 5900，所以如果我們已經有一台啟動中主機，那麼再新增虛擬機時，第二台虛擬機的 vnc listen port 就不會是 5900，因為系統已經把 5900 port 給了第一台虛擬機使用，這時 KVM 會將 5900 +1 的 port 開給新的虛擬機 vnc service，因此想用 vnc 看第二台虛擬機的畫面，就必須使用 5901 port

以上面的輸出結果來看 0.0.0.0: 5900 是第一台虛擬機的 listen port，第二行的 5901 就是我們新建第二台虛擬機的 vnc listen port

此時 vnc 連線軟體就要改用 <span class="hl-blue">vnc://Remote_Host_IP:5901</span> 來看第二台虛擬機的畫面

如果再開啟第三台基本上就是使用 5902 port 了。記得防火牆要打開這些 port ！

    
## KVM 虛擬機的基本操作

安裝完後，就可以用下面幾個最基本的指令來操控虛擬機

\
顯示所有虛擬機的狀態

```bash
sudo virsh list --all
```

\
啟動虛擬機

```bash
sudo virsh start [VM_Name]
```

\
關閉虛擬機

```bash
sudo virsh shutdown [VM_Name]
```

\
重啟虛擬機

```bash
sudo virsh reboot [VM_Name]
```

### KVM 虛擬機系列文章：

[KVM 網路設定教學](https://notes.wadeism.net/post/kvm-network-setup/)

[KVM 使用 qemu-img 建立與調整虛擬硬碟](https://notes.wadeism.net/post/kvm-create-volume-by-qemu-img/)

[KVM Internal Snapshot 快照教學](https://notes.wadeism.net/post/kvm-internal-snapshot/)

[KVM External Snapshot 快照教學](https://notes.wadeism.net/post/kvm-external-snapshot/)

[KVM 使用 overlay 製作虛擬機 Clone](https://notes.wadeism.net/post/kvm-create-vm-clone-by-overlay/)

* * *

參考資料：

[How to Install KVM on CentOS/RHEL 8](https://www.tecmint.com/install-kvm-in-centos-8/)

[How To Install KVM on RHEL 8 / CentOS 8 Linux](https://computingforgeeks.com/how-to-install-kvm-on-rhel-8/)

[KVM/QEMU 以 virt-install 指令建立虛擬機器、VNC 顯示畫面教學](https://blog.gtwang.org/linux/kvm-qemu-virt-install-command-tutorial/)

[Why doesn't “osinfo-query os” detect Ubuntu 18.04?](https://askubuntu.com/questions/1070500/why-doesnt-osinfo-query-os-detect-ubuntu-18-04)
