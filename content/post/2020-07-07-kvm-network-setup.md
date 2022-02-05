---
author: wade
date: 2020-07-07 15:30:44+00:00
draft: false
title: KVM 網路設定教學
type: post
url: /post/kvm-network-setup/
image: "https://image.wadeism.net/kvm00.png"
categories:
- Linux
tags:
- headless
- KVM
- Virtualization
---

查看 KVM 預設的網路介面

```bash
sudo virsh net-info --network default
```

```bash
# 執行結果：

Name:           default
UUID:           f53e847a-4e83-4p47-ab75-3f9d020ee453
Active:         yes
Persistent:     yes
Autostart:      yes
Bridge:         virbr0
```

KVM 裝好後會自動新增一個 NAT 的網路，可以看到自動建立的 default 使用的網卡是 virbr0

\
查看目前 remote host 上的網卡資訊

```bash
ip a
```

```bash
# 執行結果：

2: ens3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
link/ether 52:54:00:44:d1:cb brd ff:ff:ff:ff:ff:ff
inet 192.168.122.160/24 brd 192.168.122.255 scope global dynamic noprefixroute ens3
valid_lft 3596sec preferred_lft 3596sec
inet6 fe80::bad7:6118:68ec:3b8a/64 scope link noprefixroute 
valid_lft forever preferred_lft forever
3: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
inet 192.168.199.1/24 brd 192.168.199.255 scope global virbr0
valid_lft forever preferred_lft forever
4: virbr0-nic: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel master virbr0 state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
```

{{< blue >}}ens3{{< /blue >}} 是 host 上的實體網卡，{{< blue >}}virbr0{{< /blue >}} 則是 kvm 自動新增的 NAT 虛擬網卡。  
建立虛擬機預設使用 default 網路，機器會在 192.168.199.1/24 的這個網段當中


## 修改 default 的網段

192.168.199.1/24 這個網段是 KVM 隨機建立的，如果不喜歡可以更改

```bash
sudo virsh net-edit --network default
```

```xml
<network>
  <name>default</name>
  <uuid>b53e847a-4e83-4d47-ab75-3f9d020ee450</uuid>
  <forward mode='nat'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <mac address='52:54:00:fa:15:28'/>
  <ip address='192.168.199.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.199.2' end='192.168.199.254'/>
    </dhcp>
  </ip>
</network>
```

使用 {{< blue >}}virsh net-edit{{< /blue >}} 編輯 defulat 的設定檔，在這裡我把 192.168.199.x 改成 192.168.123.x

```xml
<network>
  <name>default</name>
  <uuid>b53e847a-4e83-4d47-ab75-3f9d020ee450</uuid>
  <forward mode='nat'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <mac address='52:54:00:fa:15:28'/>
  <ip address='192.168.123.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.123.2' end='192.168.123.254'/>
    </dhcp>
  </ip>
</network>
```

\
修改完成後將 default 網路停用

```bash
sudo virsh net-destroy --network default
```

\
接著再重啟 default 網路

```bash
sudo virsh net-start --network default
```

\
可以看到 virbr0 已經變成 192.168.123.1/24 的網段了

```bash
ip a
```

```bash
# 執行結果：

2: ens3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
link/ether 52:54:00:44:d1:cb brd ff:ff:ff:ff:ff:ff
inet 192.168.122.160/24 brd 192.168.122.255 scope global dynamic noprefixroute ens3
valid_lft 3596sec preferred_lft 3596sec
inet6 fe80::bad7:6118:68ec:3b8a/64 scope link noprefixroute 
valid_lft forever preferred_lft forever
3: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
inet 192.168.123.1/24 brd 192.168.123.255 scope global virbr0
valid_lft forever preferred_lft forever
4: virbr0-nic: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel master virbr0 state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
```


## 建立 KVM 虛擬網路範本

KVM 使用虛擬網路來管理與控制 guest 的網路連線，每個虛擬網路有不同的網段與功能，像上面的 default 就是預設的 NAT 網路。

我們可以在虛擬網路中新增許多不同的連線型態來滿足各種需求，例如新的 NAT、local only、bridge…等，在 virsh 中，新增虛擬網路必須先建立 xml 的範本，然後再使用指令匯入

### 建立 NAT 網路

除了 default 的 NAT 以外，也可以再新增其它的 NAT 網路，測試比較複雜的網路環境可以用得上

建立 NAT 網路的設定範本 new-nat.xml

```xml
<network>
  <name>new-nat</name>
  <bridge name="virbr1"/>
  <forward mode="nat"/>
  <ip address="192.168.133.1" netmask="255.255.255.0">
    <dhcp>
      <range start="192.168.133.2" end="192.168.133.254"/>
      <host mac='12:45:00:b0:ce:15' name='test-1' ip='192.168.133.10'/>
      <host mac='12:45:00:e9:a3:15' name='test-2' ip='192.168.133.20'/>
    </dhcp>
  </ip>
</network>
```

* {{< green >}}{{< mono >}}&lt;name&gt;{{< /green >}}{{< /mono >}}：KVM 中的虛擬網路名稱，也就是 virsh net-list 所列出的名稱
* {{< green >}}{{< mono >}}&lt;forward mode&gt;{{< /green >}}{{< /mono >}}：這邊一樣是選 nat
* {{< green >}}{{< mono >}}&lt;ip address&gt;{{< /green >}}{{< /mono >}}：網段的 gateway（host 上的 ip）與 netmask
* {{< green >}}{{< mono >}}&lt;range start, end&gt;{{< /green >}}{{< /mono >}}：網段的範圍
* {{< green >}}{{< mono >}}&lt;host&gt;{{< /green >}}{{< /mono >}}：這邊可以根據 guest 的網卡 mac address 來綁定 ip，這樣即使是用 dhcp，有設定到的機器都會分派到固定的 ip

\
virsh 透過 xml 檔建立網路

```bash
sudo virsh net-define new-nat.xml
```

\
列出目前的網路介面

```bash
sudo virsh net-list --all
```

```bash
# 執行結果：

Name                 State      Autostart     Persistent
----------------------------------------------------------
default              active     yes           yes
new-nat              inactive   no            yes
```

\
讓 new-nat 自動啟動

```bash
sudo virsh net-autostart --network new-nat
```

\
啟動 new-nat 網路

```bash
sudo virsh net-start --network new-nat
```

### 建立 local only 的隔離網路

local only 的網路可以讓 guest 只能與 host  和同網段的機器連線，其餘外網一律不能連線

建立 local only 的網路設定檔 internal.xml

```xml
<network connections='1'>
    <name>internal</name>
    <bridge name='virbr2' stp='on' delay='0'/>
    <domain name='internal'/>
    <ip address='192.168.100.1' netmask='255.255.255.0'>
    <dhcp>
        <range start='192.168.100.128' end='192.168.100.254'/>
    </dhcp>
    </ip>
</network>
```

\
virsh 建立 internal 網路設定

```bash
sudo virsh net-define internal.xml
```

\
讓 internal 自動啟動

```bash
sudo  virsh net-autostart --network internal
```

\
啟動 internal 網路

```bash
sudo virsh net-start --network internal
```


## 為虛擬機新增網路卡

前面新增了虛擬網路，要使用這些網路就必須幫 guest 掛上一張新的網路卡（或是編輯原有的網卡），並且指定要使用的網路

### 新增網路卡 for new NAT

NAT 網路卡設定範本 new-nic.xml

```xml
<interface type='network'>
  <source network='new-nat'/>
  <model type='virtio'/>
</interface>
```
source network 填上虛擬網路的名稱。用 {{< blue >}}virsh net-list{{< /blue >}} 可以查看

\
為虛擬機掛載新的網路卡

```bash
sudo virsh attach-device --domain [VM_Name] --file new-nic.xml [ --persistent / --config / --live ]
```

* {{< green >}}{{< mono >}}--domain{{< /green >}}{{< /mono >}}：虛擬機的名稱
* {{< green >}}{{< mono >}}--file{{< /green >}}{{< /mono >}}：網卡的設定檔
* {{< green >}}{{< mono >}}--persistenet{{< /green >}}{{< /mono >}}：讓 device 永遠掛載，沒有這個選項的話，用 KVM 重啟虛擬機後新網卡會消失
* {{< green >}}{{< mono >}}--config{{< /green >}}{{< /mono >}}：guest 未啟動時用，掛載會在下次開機時生效
* {{< green >}}{{< mono >}}--live{{< /green >}}{{< /mono >}}：guest 已啟動時用，掛載的設備可在執行中的虛擬機中生效

### 新增網路卡 for internal local only

internal 網路卡設定範本 nic-internal.xml

```xml
<interface type='network'>
  <source network='internal' bridge='virbr2'/>
  <model type='virtio'/>
</interface>
```

\
為虛擬機掛載新的網路卡

```bash
sudo virsh attach-device --domain [VM_Name] --file nic-internal.xml [--persistent / --config / --live ]
```


## 為虛擬機移除網路卡

查看虛擬機目前使用的網卡

```bash
sudo virsh domiflist --domain [VM_Name]
```

```bash
# 執行結果：

Interface  Type       Source     Model       MAC
-------------------------------------------------------
vnet0      network    default    virtio      52:54:00:99:6c:c8
macvtap0   direct     ens3       virtio      52:54:00:a6:ce:f2
vnet1      network    new-nat    virtio      52:54:00:ef:0a:1e
```

用 domiflist 可以看到虛擬機目前有三張網卡，如果 new-nat 這張不想用了，可以把它移除

```bash
sudo virsh detach-interface --domain [VM_Name] --mac 52:54:00:ef:0a:1e --type network
```

用 mac address 來指定要移除的網卡，type 部分也是參考 domiflist 裡的資訊即可


## 為虛擬機新增 MacVTap 橋接網卡

MacVTap 是一種 bridge 的技術，可以讓 guest 拿到與 host 同網段的 ip，而且相較傳統的 bridge 效能比較好，不過缺點是 {{< red >}}MacVTap bridge 的網卡，會讓 guest 無法與 host 連線，只能和 host 以外的同網段機器相通{{< /red >}}。所以設定 MacVTap 網卡的 guest 通常都會再配一張 local only 的網卡讓 host 與 guest 互連。

在[安裝虛擬機的文章](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)裡，我都是直接在建新機器時就把 MacVTap 的網卡也一併裝上，如果一開始沒有設定，之後想裝時只要建一個 bridge 的網路卡設定檔，然後再掛載給虛擬機就可以，不需要為 bridge 新增虛擬網路（但傳統的 bridge 就需要）

一樣先查詢 host 的網卡資訊

```bash
ip a
```

```bash
# 執行結果：

2: ens3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
link/ether 52:54:00:44:d1:cb brd ff:ff:ff:ff:ff:ff
inet 192.168.122.160/24 brd 192.168.122.255 scope global dynamic noprefixroute ens3
valid_lft 3596sec preferred_lft 3596sec
inet6 fe80::bad7:6118:68ec:3b8a/64 scope link noprefixroute 
valid_lft forever preferred_lft forever
3: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
inet 192.168.199.1/24 brd 192.168.199.255 scope global virbr0
valid_lft forever preferred_lft forever
4: virbr0-nic: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel master virbr0 state DOWN group default qlen 1000
link/ether 52:54:00:fa:15:28 brd ff:ff:ff:ff:ff:ff
```
ens3 為 host 的主要連外網卡

\
新增 MacVTap 的網路卡設定檔 macvtap.xml，並將 dev 設成主要網卡的名稱。

```xml
<interface type='direct'>
  <source dev='ens3' mode='vepa'/>
  <model type='virtio'/>
</interface>
```

\
為虛擬機新增 MacVTap bridge 網卡

```bash
sudo virsh attach-device [VM_Name] --file macvtap.xml --persistent [ --config / --live ]
```

### KVM 虛擬機系列文章：

[KVM 純文字環境下的虛擬機安裝教學](https://notes.wadeism.net/post/kvm-create-vm-in-terminal/)

[KVM 使用 qemu-img 建立與調整虛擬硬碟](https://notes.wadeism.net/post/kvm-create-volume-by-qemu-img/)

[KVM Internal Snapshot 快照教學](https://notes.wadeism.net/post/kvm-internal-snapshot/)

[KVM External Snapshot 快照教學](https://notes.wadeism.net/post/kvm-external-snapshot/)

[KVM 使用 overlay 製作虛擬機 Clone](https://notes.wadeism.net/post/kvm-create-vm-clone-by-overlay/)

* * *

參考資料：

[Guest can reach outside network, but can't reach host (macvtap)](https://wiki.libvirt.org/page/TroubleshootMacvtapHostFail)
