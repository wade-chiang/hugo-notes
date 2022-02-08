---
author: wade
date: 2020-12-24 16:10:32+00:00
draft: false
title: macOS Catalina 使用 autofs 自動掛載 NFS
type: post
url: /post/macos-catalina-autofs-nfs/
categories:
- Linux
- Mac
tags:
- CentOS
- CentOS 8
- Mac
- macOS
- NFS
- Server
---

[之前](https://notes.wadeism.net/post/ubuntu-autofs-nfs/)提到過 autofs 是用來自動掛載遠端資料夾的好工具，不過這次在使用 macOS Catalina 掛載 CentOS 8 的 NFS 時碰到了與之前不太一樣的情況，為此做一下記錄。


## 環境說明

<span class="hl-green">Server</span>：192.168.1.10，CentOS 8 minimal with NFS v4

<span class="hl-green">Client</span>：192.168.1.20，macOS Catalina


## Server 端設定

編輯 <span class="hl-blue">/etc/exports</span> 檔案，內容如下：

```bash
# 要分享的目錄     # 允許連線的主機與參數
/home/user/share 192.168.1.20(rw,sync,all_squash,anonuid=1000,anongid=1000)
```

參數的內容都可以參考[前面的教學](https://notes.wadeism.net/post/centos8-nfs-server/)，只是這次要注意：<span class="hl-red">anonuid 與 anongid 一定要指定在 Server 上對該資料夾有權限的 user id</span>。例如我在 server 的使用者 uid、gid 皆為 1000（只有一個使用者的話通常都是 1000），那就要指定 client 端連上之後可以取得 uid、gid 為 1000 的身份，<span class="hl-red">沒有指定的話，會發生掛載成功，但無法進入資料夾的問題（權限不足）</span>，這個是我在之前使用時沒有出現過的問題。

設定完成後，一樣重新掛載即可

```bash
exportfs -arv
```


## Client 端設定

首先，編輯 <span class="hl-blue">/etc/auto_master</span> 檔案

```bash
#
# Automounter master map
#
+auto_master        # Use directory service
#/net           -hosts      -nobrowse,hidefromfinder,nosuid
/home           auto_home   -nobrowse,hidefromfinder
/Network/Servers    -fstab
/-          -static

# NFS AutoFS
/Users/wade/nfs_share    /etc/auto.nfs
```

<span class="hl-blue">/Users/wade/nfs_share</span> 為 client 端用來掛載 NFS 用的資料夾，<span class="hl-blue">/etc/auto.nfs</span> 則是掛載的設定檔，接著我們就來建立 <span class="hl-blue">/etc/auto.nfs</span> 這個設定檔：

```bash
sudo vim /etc/auto.nfs
```

```bash
# 內容如下：

share  -rw,resvport,nfsv4  192.168.1.10:/home/user/share
```

share 為掛載 NFS 用的目錄，resvport 的參數在[前面的文章](https://notes.wadeism.net/post/mac-nfs-mount-operation-not-permitted/)中也提過了，這邊的重點為 <span class="hl-blue">nfsv4</span> 這個參數，<span class="hl-red">由於 CentOS 8 預設的 NFS 是v4 版本，因此這個參數一定要加，不加的話無法掛載</span>。


## 掛載與驗證

設定好並存檔離開後，在 client 端輸入下面的指令即可重新掛載

```bash
sudo automount -vc
```

接著試著進入掛錄的目錄，如果可以順利進入並且看到裡面的內容，就表示掛載成功啦！

```bash
cd /Users/wade/nfs_share/share && ls
```
