---
author: wade
date: 2018-09-13 12:03:50+00:00
draft: false
title: Linux 與 Mac 使用 sshfs 遠端掛載資料夾
type: post
url: /post/sshfs-mount-remote-folder/
categories:
- Linux
- Mac
tags:
- CentOS
- Mac
- Server
- Ubuntu
---

sshfs 是利用 ssh 協定來掛載遠端資料夾的工具，如果沒記錯的話，我應該是為了讓 Mac 能掛載遠端 Linux 上的目錄才搞的，不過它安裝簡單又易用，也許之後會試著多用！

* * *

[2020/06/15] 文章內容勘誤

隔了一陣子再次使用 sshfs 時，發現之前的文章有兩個錯誤：

1. sshfs 的 server 端不需要安裝 sshfs，畢竟它是走 ssh，所以只要 server 端的 ssh service 有安裝，並且 port 有開就可以了，因此只要 client 端安裝 sshfs 就好
2. 掛載 sshfs 時，並不吃 rsyncd 的 conf 檔，而是讀取 ssh 的 conf

* * *


## Server 端

只要是一台你可以 ssh 進去的 server ，那就可以使用 sshfs 掛載，如果沒有的話，就先在 server 端上安裝 OpenSSH

```bash
# CentOS:
sudo yum install openssh-server
```
    
```bash
# Ubuntu: 
sudo apt install openssh-server
```

\
設定開機自動啟用 ssh server
    
```bash
sudo systemctl enable sshd
```

\
啟動 ssh server

```bash
sudo systemctl start sshd
```

\
sshfs 是走 ssh 的通道，所以 ssh port 要開啟

```bash
firewall-cmd --add-service=ssh --permanent && firewall-cmd --reload
    
# 如果有改 ssh 的預設 port，就視情況更改吧
```


## Client 端

依自己使用的系統來安裝 sshfs
    
```bash
# CentOS 7
sudo yum install fuse-sshfs
```

```bash
# CentOS 8
sudo dnf --enablerepo=PowerTools install fuse-sshfs
```
    
```bash
# Ubuntu
sudo apt install sshfs
```

\
使用完整路徑掛載

```basj
mkdir ~/mount
```

```bash
sshfs [User_ID]@[ServerIP]:/home/user/document ~/mount

# 將遠端的 /home/user/document 資料夾掛載到本機的 /home/user/mount上
# User_ID 為遠端 Server 的使用者帳號
```

\
卸載方式
    
```bash
sudo umount ~/mount
```

\
sshfs 也會去讀取 user 的 ssh config，所以如果 ssh config 有設定的話，掛載時也可以不用輸入密碼或是指定 key，config 的設定方式可以參考 [使用 private key，ssh 免密碼登入](https://notes.wadeism.net/post/ssh-without-password/)

### 設定開機自動掛載

將下面的設定寫入 /etc/fstab 即可讓 sshfs 在開機時自動掛載，不過建議使用 key 登入，如果還沒有使用 key 登入 remote server 的話，先參考上面的連結，注意下面中括號請依自己的需求設定
    
```bash
[User_Name]@[ServerIP]:/[Remote_Dir] /[My_MountDir] fuse.sshfs noauto,x-systemd.automount,_netdev,users,idmap=user,IdentityFile=[SSH_Key_Location],reconnect 0 0
```

## Mac

[FUSE for macOS](http://osxfuse.github.io/)

在 Mac 中先到上面網址下載安裝 OSXFUSE 與 SSHFS，安裝完後，使用方法與上面 Linux 相同！
