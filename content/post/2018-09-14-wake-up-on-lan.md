---
author: wade
date: 2018-09-14 02:10:38+00:00
draft: false
title: Wake Up on Lan
type: post
url: /post/wake-up-on-lan/
categories:
- Linux
---

Wake Up on Lan，簡稱 WOL，透過網路來開機是蠻早就有的東西，很適合懶鬼與騙騙不懂的人，它的安裝與使用都很簡單，不過要玩之前請先確認主機板與網路卡都有支援這個功能，並且在 BIOS 開啟 WOL。


## Remote 端

安裝 ethtool 來檢查與設定網卡
    
```bash
sudo yum install ethtool
# for CentOS like
```
    
```bash
sudo apt install ethtool
# for Ubuntu like
```

\
使用 ethtool 檢查網路卡的設定，本例的網路卡名稱為 eno1
    
```bash
sudo ethtool eno1
```
    
```bash
# 執行結果：

Settings for eno1:
Supported ports: [ TP ]
Supported link modes: 10baseT/Half 10baseT/Full
100baseT/Half 100baseT/Full
1000baseT/Full
Supported pause frame use: No
Supports auto-negotiation: Yes
Advertised link modes: 10baseT/Half 10baseT/Full
100baseT/Half 100baseT/Full
1000baseT/Full
Advertised pause frame use: No
Advertised auto-negotiation: Yes
Speed: 1000Mb/s
Duplex: Full
Port: Twisted Pair
PHYAD: 1
Transceiver: internal
Auto-negotiation: on
MDI-X: on (auto)
Supports Wake-on: pumbg
Wake-on: d
Current message level: 0x00000007 (7)
drv probe link
Link detected: yes
```

注意「 Wake-on 」這一項，要設成 g 才會開啟 WOL 的功能

\
設定wol

```bash
sudo ethtool -s eno1 wol g
```

\
再重新檢查一次

```bash
sudo ethtool eno1
```
    
```bash
# 執行結果：

Settings for eno1:
Supported ports: [ TP ]
Supported link modes: 10baseT/Half 10baseT/Full
100baseT/Half 100baseT/Full
1000baseT/Full
Supported pause frame use: No
Supports auto-negotiation: Yes
Advertised link modes: 10baseT/Half 10baseT/Full
100baseT/Half 100baseT/Full
1000baseT/Full
Advertised pause frame use: No
Advertised auto-negotiation: Yes
Speed: 1000Mb/s
Duplex: Full
Port: Twisted Pair
PHYAD: 1
Transceiver: internal
Auto-negotiation: on
MDI-X: on (auto)
Supports Wake-on: pumbg
Wake-on: g
Current message level: 0x00000007 (7)
drv probe link
Link detected: yes
```


## Host 端

以 Ubuntu 為例，想要喚醒遠端的電腦可以用 etherwake 這個程式

安裝 etherwake

```bash
sudo apt-get install etherwake
```

\
執行 etherwake 後面加上 remote 端的 MAC Address 就可以遠端開機了
    
```bash
sudo etherwake $MAC_ADD
```

\
不過 MAC Address 實在不是很好記的東西，如果有很多台要 WOL 的話，下面的做法會比較方便

新增檔案 /etc/ethers，檔案的內容格式如下：
    
```bash
$MAC_ADD $Hostname
$MAC_ADD $IP_ADD
```

* {{< blue >}}$MAC_ADD{{< /blue >}} 代表要被喚醒的電腦的 MAC 位置
* {{< blue >}}$Hostname{{< /blue >}} 及 {{< blue >}}$IP_ADD{{< /blue >}} 則分別為你想用的機器名稱或 IP 位置，要用 Hostname 的話可以在 {{< blue >}}/etc/hosts{{< /blue >}} 裡先做設定

Hostname 與 IP 可以擇一就好。

設定好後，用 etherwake 時就不用接 MAC Address 了，可直接用 Hotname 或 IP 來取代。

另外要注意 etherwake 指令預設是從 client 端的 eth0 網卡送出訊號，在 CentOS 7 與 Ubuntu 16.04 中，預設的網卡代碼並非 eth0，因此要先用 arp 或 ifconfig 來查看網卡代號，並使用參數 -i，例如：

    
```bash
sudo etherwake -i eno1 centos
# 指令的意思為：指定由 eno1 這張網卡送出訊號來對 centos 這個 hostname 的機器進行網路開機
```
