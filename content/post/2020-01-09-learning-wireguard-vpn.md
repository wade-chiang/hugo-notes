---
author: wade
date: 2020-01-09 09:14:33+00:00
draft: false
title: WireGuard VPN 設定與使用教學
type: post
url: /post/learning-wireguard-vpn/
image: "https://image.wadeism.net/wg02.jpg"
categories:
- Linux
tags:
- CentOS
- Server
---

其實 OpenVPN 我用了好一陣子，也沒碰到什麼問題，頂多是中間曾改版過，安裝與設定的方法有點不太一樣，原本一直有打算記錄下來，但前幾天看到 iTHome 的一篇文章「[WireGuard將併入Linux 5.6成為VPN新標準](https://www.ithome.com.tw/news/134865)」講的一副屌打 OpenVPN 與 IPsec 的樣子所以就來試試看了

<span class="hl-blue">為了操作方便，建議暫時將使用者切到 root 身份再來進行下面的步驟</span>


## 安裝 WireGuard

WireGuard 的[官網](https://www.wireguard.com/install/)有提供許多系統的安裝方式，不管是 Mac、各種 Linux 甚至 OpenWRT 都有，<span class="hl-red">由於官網的安裝步驟有在持續更新，建議安裝前，還是先以官網的步驟為主！</span>而這邊我先由原本的 CentOS 7 改列最近實測過的 CentOS 8 安裝步驟
    
```bash
yum install epel-release
```
    
```bash
yum config-manager --set-enabled PowerTools
```
    
```bash
yum copr enable jdoss/wireguard
```
    
```bash
yum install wireguard-dkms wireguard-tools
```

WireGuard 的軟體是不分 server 與 client 的，所以兩邊安裝的東西都一樣，並且也有提供手機版的 app，只要去 App Store 或 Play Store 搜尋 WireGuard 就可以找到了


## 設定 WireGuard Server

### 1. 建立設定檔資料夾與設定權限
    
```bash
mkdir /etc/wireguard && cd /etc/wireguard
```
    
```bash
umask 077
```

大部分的文章都會下 umask 077 這個指令，主要是確保之後編寫的設定檔權限不會太寬鬆

### 2. 製作 server 端的金鑰

製作 server 端私鑰
    
```bash
wg genkey > server_privateKey
```

製作 server 端公鑰，這個指令會利用剛才製作的私鑰來生成公鑰

```bash
wg pubkey < server_privateKey > server_publicKey
```

上面的指令也可以用一行來完成
    
```bash
wg genkey | tee server_privateKey | wg pubkey > server_publicKey
```

執行後我們會在 /etc/wireguard 裡得到兩個檔案，分別是公鑰 <span class="hl-blue">server_publicKey</span> 與私鑰 <span class="hl-blue">server_privateKey</span>

\
另外也可以再多製作 pre share 的金鑰來加強保護，這部分則是可有可無，server 端與 client 端會使用同一份金鑰，毋需區分
    
```bash
wg genpsk > psk
```

### 3. 製作 server 端的設定檔

首先查詢我們機器的網路介面（網路卡）名稱，請輸入下面的指令：
    
```bash
ip a
```
    
```bash
# 執行結果：

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 22:11:0b:3a:10:22 brd ff:ff:ff:ff:ff:ff
    inet 10.140.0.3/32 brd 10.140.0.3 scope global noprefixroute dynamic eth0
       valid_lft 58812sec preferred_lft 58812sec
    inet6 0:0:0:0:0:ffff:a8c:3/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

上面的資訊中第一個 ip 127.0.0.1 是機器本身的 loop，這裡不用管它，我們看到第二個 ip 10.140.0.3/32，這個 ip 對應的 <span class="hl-blue">eth0</span> 就是主要使用的網路介面代號（一般來說系統預設的名稱經常是 eth0，但現在很多版本如 Ubuntu 都不太用 eth0 作為預設的網卡名稱了，所以一定要先查過）

接著在 /etc/wireguard/ 底下建立設定檔，內容如下，檔名可自訂，這裡取名為 <span class="hl-blue">wg0-server.conf</span>，<span class="hl-blue">wg0-server</span> 這個名稱也會等同 vpn 在機器裡的 network interface 名稱，設定檔分為兩個部分，<span class="hl-blue">Interface</span> 與 <span class="hl-blue">Peer</span>
    
```vim
[Interface]
Address    = 192.168.100.1/24
PrivateKey = server 端的 Private Key
PostUp     = firewall-cmd --zone=public --add-port 51820/udp && firewall-cmd --zone=public --add-masquerade
PostDown   = firewall-cmd --zone=public --remove-port 51820/udp && firewall-cmd --zone=public --remove-masquerade
ListenPort = 51820
    
# client 1
[Peer]
PublicKey    = client 端的 Public Key
PresharedKey = psk 檔裡的內容
AllowedIPs   = 192.168.100.2/32
```
   
#### [ Interface ] 

WireGuard 的主要設定都在裡面，這邊是設定一個新的網路介面，並且指定它的 ip、listen port…等等，server 端與 client 端都會有一個專屬的 interface

* <span class="hl-green mono">Address</span>：設定 server 的 ip，之後的 client 端也要設定與 server 在同網段底下
* <span class="hl-green mono">PrivateKey</span>：這裡貼上剛才做的私鑰「server_privateKey」的內容
* <span class="hl-green mono">PostUp</span>：啟動 vpn 時要連帶執行的指令或 script
* <span class="hl-green mono">PostDown</span>：關閉 vpn 時執行的指定，這邊就是把 NAT 與 port 給關掉，通常是 PostUp 開了什麼，這邊就關掉什麼
* <span class="hl-green mono">ListenPort</span>：WireGuard 要使用的 port，也是你的防火牆或 GCP、AWS…等要開的 UDP port

<span class="hl-blue">PostUp</span>這邊加了兩個指令讓 WireGuard 啟動時也連帶執行，分別是開啟 udp 的 port 與設定 NAT，範例中使用 firewalld，其中 <span class="hl-blue">--zone=public</span> 為非必要，要視自己防火牆的情況來調整，可用「 <span class="hl-blue">sudo firewall-cmd --get-default-zone</span> 」這個指令看目前預設的防火牆是哪個 zone 來自訂，一般大多是 public，另外「 <span class="hl-blue">--add-port 51820/udp</span> 」這段也要看你想讓 WireGuard 用哪個 port 來自訂

另外也有 iptables 的版本可供參考：
    
```vim
PostUp = iptables -A FORWARD -i wg0-server -j ACCEPT && iptables -t nat -A POSTROUTING -s 192.168.100.0/24 -o eth0 -j MASQUERADE && iptables -A INPUT -i wg0-server -p udp --dport 51820 -j ACCEPT
    
PostDown = iptables -D FORWARD -i wg0-server -j ACCEPT && iptables -t nat -D POSTROUTING -s 192.168.100.0/24 -o eth0 -j MASQUERADE && iptables -D INPUT -i wg0-server -p udp --dport 51820 -j ACCEPT
```

iptables 的版本中，PostUp 與 Down 裡面都由 3 個指令以 「&&」符號來連起來，這邊也稍微說明一下：

<span class="hl-blue">iptables -A FORWARD -i wg0-server -j ACCEPT</span>  
允許 wg0-server 這個介面的轉址  
wg0-server 是我們的設定檔名稱，同時也會是 WireGuard 所建立的網路介面名稱

<span class="hl-blue">iptables -t nat -A POSTROUTING -s 192.168.100.0/24 -o eth0 -j MASQUERADE</span>  
允許從 192.168.100.0/24 的來源轉由 eth0 出去  
其中 ip 網段的部分需視上面的設定更改，本例中將 server 的 ip 設為 192.168.100.1，之後client 端的網段就會在 192.168.100.0/24，eth0 的部分則一樣視機器主要連外的網卡名稱來自訂

<span class="hl-blue">iptables -A INPUT -i wg0-server -p udp --dport 51820 -j ACCEPT</span>  
開 port，本例為 51820 port  
如果像 AWS 的機器，統一都用 Security Group管理，系統內部沒有使用防火牆，那這條就不用設定了

\
PostUp 與 PostDown 這兩個選項不一定需要，我們也可以直接在 Linux 防火牆裡處理，在 conf 裡設定的好處是防火牆的開通只在 vpn 開啟時有效，關閉後就沒有了，另外也可以將指令分別寫到 script 裡，PostUp and Down 這個選項除了直接執行指令外，也可以執行 script


#### [ Peer ]

前面的 <span class="hl-blue">[Interface]</span> 在 server 與 client 端都是指設定自己本身的網路介面，而 Peer 的部分在 server 與 client 上則有不同的意義。<span class="hl-red">server 端裡的 Peer 指的是每一個要連進來的節點</span>，因此如果有三台機器想要連入，就必須建立三個 Peer，<span class="hl-red">client 端裡的 Peer 指的則是 server</span>，這邊先說明 server 端的 Peer 內容

* <span class="hl-green mono">PublicKey</span>：這邊填入 client 端生成的 Public Key，這個在等一下的 client 設定裡會建立
* <span class="hl-green mono">PresharedKey</span>：填入剛才生成的 psk 檔內容，該選項非必要，如果 server 有設定，那 client 端也要貼一樣的內容，無論 Peer 有多少個，都會使用與 server 一樣的 psk
* <span class="hl-green mono">AllowedIPs</span>：要賦予 client 端的 IP，本例給 client 的 IP 為 192.168.100.2/32，請注意後面的 netmask 一定要是 32 ，不可以設 24，多個 client 時，每個 Peer 都要有一組自己的 IP，不可重覆


## 設定 sysctl.conf

這個步驟在蠻多原文的教學裡都有提到，但我自己的測試中，即使沒有加上這個設定，VPN 還是可以順利的使用，所以大家可以視情況來調整，如果 VPN 沒辦法連線的話，可以試試加上這段的設定

編輯 /etc/sysctl.conf
    
```bash
cat << EOF >> /etc/sysctl.conf
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
EOF
```

\
重新載入 sysctl.conf 設定
    
```bash
sysctl -p
```


## 啟動 WireGuard Server

建立好 server 的 conf 設定檔後，我們就可以試著啟動 WireGuard 的 server，這邊介紹兩種啟動方式
    
```bash
systemctl start wg-quick@wg0-server
```
    
```bash
wg-quick up wg0-server
```

第一種就是一般 systemd 常用的啟動方式，第二種則是 WireGuard 自己的指令，兩種都可以用，後面的 <span class="hl-blue">wg0-server</span> 就是我們設定檔的名稱，同時也是 WireGuard 建立的網卡代號，我們可以再一次用指令檢查
    
```bash
ip a
```
    
```bash
# 執行結果
    
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 22:11:0b:3a:10:22 brd ff:ff:ff:ff:ff:ff
    inet 10.140.0.3/32 brd 10.138.0.2 scope global noprefixroute dynamic eth0
       valid_lft 82564sec preferred_lft 82564sec
    inet6 fe80::4001:aff:fe8a:2/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
32: wg0-server: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1380 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 192.168.100.1/24 scope global wg0-server
       valid_lft forever preferred_lft forever
    inet6 fe80::e813:3764:1d66:889e/64 scope link flags 800
       valid_lft forever preferred_lft forever
```

可以看到多出了一個 wg0-server 的介面，ip 為我們設定的 192.168.100.1 ， 表示有啟動成功，server 端的設定就算是告一段落


## 設定 WireGuard Client

client 端 WireGuard 的安裝方式與 server 相同，因此我們一樣按照官網的說明就可以了

### 1. 建立設定檔資料夾與設定權限
    
```bash
mkdir /etc/wireguard && cd /etc/wireguard
```
    
```bash
umask 077
```

### 2. 製作 client 端的金鑰
    
```bash
wg genkey | tee client1_privateKey | wg pubkey > client1_publicKey
```

### 3. 製作 client 端的設定檔

一樣在 /etc/wireguard/ 底下建立設定檔，內容如下，本範例檔名為 <span class="hl-blue">client1.conf</span>
    
```vim
[Interface]
Address    = 192.168.100.2/24
PrivateKey = client 1 的 Private Key
DNS = 8.8.8.8

[Peer]
PublicKey    = server 的 Public Key
PresharedKey = server psk 檔裡的內容
AllowedIPs   = 0.0.0.0/0
Endpoint     = 33.33.33.33:51820
PersistentKeepalive = 30
```

#### [ Interface ]

* <span class="hl-green mono">Address</span>：設定 client 的 ip
* <span class="hl-green mono">PrivateKey</span>：這裡貼上剛才做的私鑰「client1_privateKey」的內容
* <span class="hl-green mono">DNS：client</span> 端連線後使用的 DNS，建議要設

#### [ Peer ]

* <span class="hl-green mono">PublicKey</span>：這邊填入 server 端生成的 Public Key
* <span class="hl-green mono">PresharedKey</span>：填入剛才生成的 psk 檔內容，<span class="hl-blue">該選項非必要</span>，但如果 server 有設定，那 client 端也要貼一樣的內容，無論 Peer 有多少個，都會使用與 server 一樣的 psk
* <span class="hl-green mono">AllowedIPs</span>：client 這邊的 allowed ip 設為 0.0.0.0/0 是指將所有的對外連線都透過 WireGuard 的介面出去，也可以設定只有特定的連線要透過 vpn 出去
* <span class="hl-green mono">Endpoint</span>：server 的實體外部 ip 與 WireGuard 所使用的 port
* <span class="hl-green mono">PersistentKeepalive</span>：讓 WireGuard client 每 30 秒就檢查一次連線，可保持與 server 的連線不中斷

上面的內容都設好之後存檔離開，我們就可以來測試 VPN 是否有弄成功了


## 啟動 WireGuard Client

因為本例中 client 端的設定檔名為 client1.conf，因此啟動的指令如下，一樣有兩種方式：
    
```bash
systemctl start wg-quick@client1
```
    
```bash
wg-quick up client1
```

啟動後，我們可以用下面的指令來檢查是否有成功
    
```bash
curl ipinfo.io/ip
```

執行完後，如果顯示的 ip 已更改，變成與 server 的 ip 相同，即表示 VPN 通道已成功建立並啟用


## 手機使用 WireGuard 的方法

如果是想讓手機使用 vpn，方法也很簡單，我們可以直接使用剛才已經在 client 端的電腦上面建立的 conf 設定檔，也可以另外建立一組新的設定檔給手機用，只要先製作一組新的 key，再去 server 端的 conf 裡新增一個 Peer，之後照剛才 client 的設定教學做出另一個設定檔就可以了，再提醒一下：<span class="hl-blue">同一時間，一組 conf 與 key 都只能給一個 client 使用</span>，在這次的範例中，我們直接讓手機使用剛才做好的 client1.conf

手機安裝完 WireGuard 後，開啟就會進入主畫面，這裡有三種方式可以把設定檔加入：

1. 直接把檔案傳到手機上，直接開啟 conf 檔
2. 在電腦上建立 QR Code 讓手機掃瞄
3. 手動輸入 conf 裡的內容

![wg03](https://image.wadeism.net/wg03.png#center)

當然我們不太可能手動去輸入那麼複雜的金鑰內容，所以第三種方式除非萬不得已才會去使用，而第一種方式就只要想辦法把檔案傳到手機上就可以，但個人覺得第二種用 QR Code的方式最為便利，使用方法也很簡單！

首先在我們剛才 client 端的電腦（或是放有 client.conf 的電腦）裡安裝生成 qrcode 的軟體
    
```bash
yum install qrencode
```

再來只要一個指令就可以生成 QR Code
    
```bash
qrencode -t ansiutf8 < /etc/wireguard/client1.conf
```

最後讓手機的 WireGuard 掃瞄一下畫面上的 QR Code 就大功告成啦！

最近剛好碰到朋友需要使用 VPN 下載東西，因此順便檢視我原有的 OpenVPN 與 WireGuard，對於 OVPN 設定的複雜頓時非常的有感。WireGuard 的介紹中提到效能與安全性都更好，雖然這點還不敢確定，不過我想憑藉它簡易的安裝設定與使用方式，未來應該是有機會成為主流的~
