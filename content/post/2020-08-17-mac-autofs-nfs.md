---
author: wade
date: 2020-08-17 02:46:17+00:00
draft: false
title: Mac 使用 autofs 自動掛載 NFS
type: post
url: /post/mac-autofs-nfs/
categories:
- Mac
tags:
- macOS
- NFS
- Server
---

macOS 也可以使用 autofs 來掛載，而且預設已有安裝了，所以我們一樣先編輯 master conf

```bash
sudo vim /etc/auto_master
```

```bash
#
# Automounter master map
#
+auto_master             # Use directory service
/net                     -hosts         -nobrowse,hidefromfinder,nosuid
/home                    auto_home	    -nobrowse,hidefromfinder
/Network/Servers         -fstab
/-                       -static

/Users/Wade/nfs_mount    /etc/auto.nfs
```

Mac 的 auto_master 裡已經有一些預設的路徑了，我們把自己的設定寫在最下面就好

\
接著建立 map file <span class="hl-blue">/etc/auto.nfs</span>

```bash
share -rw,resvport 192.168.199.169:/home/wade
```

\
重啟 autofs daemon


```bash
sudo automount -vc
```

\
重啟後，試著進入剛才指定的目錄 <span class="hl-blue">/Users/Wade/nfs_mount</span>，就會自動掛載 NFS 了

```bash
cd /Users/Wade/nfs_mount/share && ls -al
```

```bash
# 執行結果：

total 9
drwxrwxrwx  3 1000  1000   109  8 14 23:00 .
dr-xr-xr-x  3 root  wheel    2  8 14 23:03 ..
-rw-------  1 1000  1000   665  8 13 23:04 .bash_history
-rw-r--r--  1 1000  1000    18 11  9  2019 .bash_logout
-rw-r--r--  1 1000  1000   141 11  9  2019 .bash_profile
-rw-r--r--  1 1000  1000   312 11  9  2019 .bashrc
drwxrwxr-x  2 1000  1000     6  8 14 23:00 HI
-rw-rw-r--  1 1000  1000     0  8 14 23:00 NFS_test
```

![](https://image.wadeism.net/macnfs01.png)

![](https://image.wadeism.net/macnfs02.png)

![](https://image.wadeism.net/macnfs03.png)

### NFS Server 系列文章：

[Mac 掛載 NFS 與 Operation not permitted 問題](https://notes.wadeism.net/post/mac-nfs-mount-operation-not-permitted/)

[CentOS 8 安裝與設定 NFS Server](https://notes.wadeism.net/post/centos8-nfs-server/)

[Ubuntu 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/ubuntu-autofs-nfs/)

* * *

參考資料：

[Automounting NFS share in OS X into /Volumes](https://coderwall.com/p/fuoa-g/automounting-nfs-share-in-os-x-into-volumes)
