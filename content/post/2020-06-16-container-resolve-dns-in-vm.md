---
author: wade
date: 2020-06-16 11:35:03+00:00
draft: false
title: VM 裡的 Docker Container 無法解析域名
type: post
url: /post/container-resolve-dns-in-vm/
categories:
- Linux
tags:
- Docker
- Virtualization
---

最近在看 IT 邦幫忙一篇介紹 docker 的鐵人賽系列文章 「[用30天來介紹和使用 Docker](https://ithelp.ithome.com.tw/users/20103456/ironman/1320)系列 」，在其中 [Day. 5](https://ithelp.ithome.com.tw/articles/10191016) 的建立 Dockerfile 時碰到了一個小問題。  
範例中， Dockerfile 需要先安裝 wget，然後用 wget 去下載 tomcat，不過我的 CentOS 8 虛擬機在 build Dockerfile 時一直失敗，會卡在下載 wget 的部分

```bash
sudo docker build -t mytomcat . --no-cache
```

```bash
# 執行結果：

Sending build context to Docker daemon  190.9MB
Step 1/10 : FROM centos:7
7: Pulling from library/centos
524b0c1e57f8: Pull complete
Digest: sha256:e9ce0b76f29f942502facd849f3e468232492b259b9d9f076f71b392293f1582
Status: Downloaded newer image for centos:7
---> b5b4d78bc90c
Step 2/10 : MAINTAINER wade
---> Running in 9dcd435b159a
Removing intermediate container 9dcd435b159a
---> 48797f4561c3
Step 3/10 : RUN yum install -y wget
---> Running in 379e89f929ad
Loaded plugins: fastestmirror, ovl
Determining fastest mirrors
Could not retrieve mirrorlist http://mirrorlist.centos.org/?release=7&arch=x86_64&repo=o
14: curl#6 - "Could not resolve host: mirrorlist.centos.org; Unknown error"


One of the configured repositories failed (Unknown),
and yum doesn't have enough cached data to continue. At this point the only
safe thing yum can do is fail. There are a few ways to work "fix" this:

1. Contact the upstream for the repository and get them to fix the problem.

2. Reconfigure the baseurl/etc. for the repository, to point to a working
upstream. This is most often useful if you are using a newer
distribution release than is supported by the repository (and the
packages for the previous distribution release still work).

3. Run the command with the repository temporarily disabled
yum --disablerepo=<repoid> ...

4. Disable the repository permanently, so yum won't use it by default. Yum
will then just ignore the repository until you permanently enable it
again or use --enablerepo for temporary usage:

yum-config-manager --disable <repoid>
or
subscription-manager repos --disable=<repoid>

5. Configure the failing repository to be skipped, if it is unavailable.
Note that yum will try to contact the repo. when it runs most commands,
so will have to try and fail each time (and thus. yum will be be much
slower). If it is a very temporary problem though, this is often a nice
compromise:

yum-config-manager --save --setopt=<repoid>.skip_if_unavailable=true

Cannot find a valid baseurl for repo: base/7/x86_64
The command '/bin/sh -c yum install -y wget' returned a non-zero code: 1
```

\
從上面的錯誤訊息中可以看到它說 curl 無法解析 mirrorlist.centos.org 這個域名，所以無法從該網址下載任何東西。字面上來看似乎是 DNS 的問題，因此我另外用 CentOS 的 官方 image 來測試

\
首先 ping 看看 8.8.8.8

```bash
sudo docker run --rm -it centos ping 8.8.8.8
```

```bash
# 執行結果：

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=127 time=3.08 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=127 time=3.80 ms

--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 3ms
rtt min/avg/max/mdev = 3.081/3.438/3.795/0.357 ms
```

8.8.8.8  ping 得通，表示至少網路連外是正常

\
接著再來 ping 看看 google 的網站

```bash
sudo docker run --rm -it centos ping www.google.com
```

```bash
# 執行結果：

ping: www.google.com: Name or service not known
```

果然以域名來 ping 就會失敗

\
從這邊看幾乎要認定就是 DNS 的問題了，所以我開始改 DNS 設定、重設網路，但弄了半天這個問題仍然無法解決。  
後來仔細想想，這個情況並沒有在我的本機上出現，本機連外與域名解析都是正常的，有問題的只有在 container 中，但我的網路環境並沒有特別動過，所以問題可能也不是在 DNS…

\
後來我檢視了防火牆的狀態

```bash
sudo firewall-cmd --list-all
```

```bash
# 執行結果：

public (active)
target: default
icmp-block-inversion: no
interfaces: ens33
sources:
services: cockpit dhcpv6-client ssh
ports:
protocols:
masquerade: no
forward-ports:
source-ports:
icmp-blocks:
rich rules:
```

看到 {{< blue >}}masquerade{{< /blue >}} 這個選項是 no 的時候，突然想到 docker 算是虛擬環境，並且會建立一個自己的 interface，但它的網路流量終究要從實體的網路介面出去。之前我在架設 OpenVPN 與 WireGuard 時，它們也都是有自己的 interface 再透過實體的網卡出去，與 docker 的網路環境是有點類似的，而在架 VPN 的時候，masquerade 這個選項是一定要打開的，因此我試著把 masquerade 打開

```bash
sudo firewall-cmd --add-masquerade --permanent && sudo firewall-cmd --reload
```

```bash
sudo firewall-cmd --list-all
```

```bash
# 執行結果：

public (active)
target: default
icmp-block-inversion: no
interfaces: ens33
sources:
services: cockpit dhcpv6-client ssh
ports:
protocols:
masquerade: yes
forward-ports:
source-ports:
icmp-blocks:
rich rules:
```

\
打開後再次 ping 看看 google 的 domain

```bash
sudo docker run --rm -it centos ping www.google.com
```

```bash
# 執行結果：

PING www.google.com (172.217.24.36) 56(84) bytes of data.
64 bytes from hkg07s23-in-f36.1e100.net (172.217.24.36): icmp_seq=1 ttl=127 time=17.7 ms
64 bytes from hkg07s23-in-f36.1e100.net (172.217.24.36): icmp_seq=2 ttl=127 time=17.9 ms

--- www.google.com ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 3ms
rtt min/avg/max/mdev = 17.668/17.767/17.867/0.166 ms

```

這次成功了！

最後再來重新 build 我的 Dockerfile 果然就順利完成了

## 結論

Docker Host 主機使用 firewalld 防火牆就執行：

```bash
sudo firewall-cmd --add-masquerade --permanent && sudo firewall-cmd --reload
```

\
如果 Host 主機是用傳統的 iptables 則執行：

```bash
sudo iptables -t nat -A POSTROUTING -s [Docker 網段]/16 -o [NIC 代號] -j MASQUERADE
```

\
這個問題目前我只有在虛擬機上面碰到，不管是 VMware 或 KVM，如果 Docker 是裝在一般的 server 上則沒有碰到這個問題
