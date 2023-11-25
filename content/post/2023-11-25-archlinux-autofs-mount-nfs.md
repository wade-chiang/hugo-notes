---
title: Arch Linux 使用 AutoFS 掛載 NFS
date: 2023-11-25T01:52:34+08:00
type: post
draft: false
url: /post/2023-11-25-archlinux-autofs-mount-nfs
image: ""
categories:
- Linux
tags:
- ArchLinux
- AutoFS
- NFS
---

記錄一下 Arch Linux 上用 AutoFS 掛載 NFS 的步驟，看過 Arch Wiki 後才知道現在只是想無腦掛載個 NFS 竟然如此容易！<br/>
<br/>
系統環境<br/>
NFS Client：Arch Linux (192.168.1.5)<br/>
NFS Server：Ubuntu 22.04 (192.168.1.10)


## 安裝 NFS
```sh
sudo pacman -Sy nfs-utils
```

接著可以驗證一下遠端的 NFS Server 是否有通

```sh
showmount -e 192.168.1.10

# 執行結果
Export list for 192.168.1.10:
/mnt/music 192.168.1.0/24
/mnt/video 192.168.1.0/24
```


## 安裝 AutoFS
```sh
yay -Sy autofs
```

設定 auto restart
```sh
sudo systemctl enable autofs && sudo systemctl start autofs
```


## 使用 AutoFS 掛載 NFS

以往都要去編輯 <span class="hl-green">/etc/autofs/auto.master</span> 之類的檔案，現在也是可以這樣用，但又多了一個更簡便的方法，只要直接 cd 到 <span class="hl-green">/net/$NFS_Server</span> 就可以看到 share 出來的資料夾了！

```sh
cd /net/192.168.1.10/mnt/music
```


* * *

參考資料：

[archlinux wiki](https://wiki.archlinux.org/title/autofs#NFS_network_mounts)

