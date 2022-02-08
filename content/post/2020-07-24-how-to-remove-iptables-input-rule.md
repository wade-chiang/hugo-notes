---
author: wade
date: 2020-07-24 16:07:33+00:00
draft: false
title: 如何刪除 Iptables 的 input 規則
type: post
url: /post/how-to-remove-iptables-input-rule/
categories:
- Linux
tags:
- Firewall
- iptables
---

一開始我先加入三個 input 規則來做 demo，本例為開啟防火牆的 80、443 與 22 port

```bash
sudo iptables -A INPUT -i eth0 -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -i eth0 -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -i eth0 -p tcp --dport 22 -j ACCEPT
```

* <span class="hl-green mono">-A</span>：對某條 iptable 的 chain 進行規則加入或插入
* <span class="hl-green mono">-i</span>：封包進入的網路介面，本例為 eth0，也是主機上的連線網卡名稱
* <span class="hl-green mono">-p</span>：規則適用的網路協定，例如 tcp、udp，本例的 service 都是用 tcp 協定
* <span class="hl-green mono">--dport</span>：目標 ip
* <span class="hl-green mono">-j</span>：本條規則的作動行為，例如 ACCEPT、DROP、REJECT

\
查看 iptables 的 INPUT chain 規則

```bash
sudo iptables -L INPUT -n --line-number
```

* <span class="hl-green mono">-L</span>：列出
* <span class="hl-green mono">-n</span>：不進行 ip 與 hostname 的反查
* <span class="hl-green mono">--line-number</span>：顯示規則的行號

```bash
# 執行結果：

Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:80
2    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:443
3    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22
```

\
有了每條規則的 line number，要刪除就很容易了，下面試範刪除第二條 443 port 的規則

```bash
sudo iptables -D INPUT 2
```

* <span class="hl-green mono">-D</span>：刪除
* <span class="hl-green mono">INPUT 2</span>： input chain 裡的第二條規則，數字代表該規則的行號

\
再次查看，443 port 的規則確實刪掉了，其它行也可以如法炮製，<span class="hl-red">注意，每做一次刪除，行號就會有所變動！</span>

```bash
sudo iptables -L INPUT -n --line-number
```

```bash
# 執行結果：

Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:80
2    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22
```

* * *

參考資料：

[iptables 刪除某行規則](https://blog.longwin.com.tw/2016/07/iptables-delete-rule-by-line-2016/)

[鳥哥的 Linux 私房菜 - Linux 防火牆與 NAT  伺服器](https://linux.vbird.org/linux_server/centos6/0250simple_firewall.php)
