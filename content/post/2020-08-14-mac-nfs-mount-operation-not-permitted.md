---
author: wade
date: 2020-08-14 15:30:42+00:00
draft: false
title: Mac 掛載 NFS 與 Operation not permitted 問題
type: post
url: /post/mac-nfs-mount-operation-not-permitted/
categories:
- Mac
tags:
- macOS
- NFS
- Server
---

前面提到大多數的 Unix 系統都有支援 NFS，Mac 當然也不例外，在 Mac 中同樣內建掛載 NFS 的 <span class="hl-blue">mount</span> 指令，而且用法與 Linux 相同，但如果掛載時一直出現「<span class="hl-red">Operation not permitted</span>」的錯誤時，需加上參數 <span class="hl-blue">resvport</span>

這是早期大型電腦時期 NFS 的安全限制，只允許 client 端使用小於 1023 的 port 號來連線，但現在家家戶戶都可以使用個人電腦與 Unix 了，所以這項限制已經有點過時。

像 Ubuntu 之類的 Linux clinet 還是有按照這個限制使用特定範圍的 port 來連線，但 macOS 並沒有，所以掛載時必需要加上 <span class="hl-blue">resvport</span> 這個選項強制讓 mac client 使用小於 1023 的 port 來連線，或是更改 NFS server 的設定，讓它允許非特定的 port 來連線也可以解決這個問題。


## Mac 手動掛載 NFS


```bash
sudo mount -t nfs -o resvport 192.168.199.168:/home/wade/ /Users/Wade/nfs_share
```

* <span class="hl-green mono">-o</span>：option
* <span class="hl-green mono">resvport</span>：reserved port，nfs client 會使用限定的 port （小於 1023）來連線
* <span class="hl-green mono">noresvport</span>：non reserved port，上面選項的相反，nfs client 將不會使用限定的 port （小於 1023）來連線，使用非限定的 port 可以增加 NFS mount point 的連線數，不過 NFS server 必需先設定過

### NFS Server 系列文章：

[Mac 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/mac-autofs-nfs/)

[CentOS 8 安裝與設定 NFS Server](https://notes.wadeism.net/post/centos8-nfs-server/)

[Ubuntu 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/ubuntu-autofs-nfs/)

* * *

參考資料：

[nfs(5) - Linux man page](https://linux.die.net/man/5/nfs)

[Why does mounting an nfs share from linux require the use of a privileged port?](https://apple.stackexchange.com/questions/142697/why-does-mounting-an-nfs-share-from-linux-require-the-use-of-a-privileged-port)
