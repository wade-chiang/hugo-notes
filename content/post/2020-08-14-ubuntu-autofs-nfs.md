---
author: wade
date: 2020-08-14 14:49:52+00:00
draft: false
title: Ubuntu 使用 autofs 自動掛載 NFS
type: post
url: /post/ubuntu-autofs-nfs/
categories:
- Linux
tags:
- NFS
- Server
- Ubuntu
---

autofs 是自動掛載用的工具，它會偵測<span class="hl-red">當使用者進入要掛載的目錄時，才會把 nfs 給掛載起來，一段時間不用的時候就自動卸載掉</span>，可以讓我們在需要使用時才連線，用完也不用手動 umount，可以相當程度上的避免突然的連線中斷導致無限 timeout


安裝 autofs

```bash
sudo apt install autofs
```

autofs 有兩個設定檔要編輯，首先在 <span class="hl-blue">/etc/auto.master.d</span> 裡建立一個新的 master conf，副檔名一定要用 <span class="hl-blue">.autofs</span>

```bash
sudo vim /etc/auto.master.d/nfs.autofs
```

```bash
# Mount Point           # Map File
/home/wade/nfs_mount    /etc/auto.nfs
```

* <span class="hl-green mono">Mount Point</span>：nfs server 在本機的掛載目錄，<span class="hl-red">這個目錄不需要存在，當 autofs 啟動時會自動建立並且持續的監控該資料夾</span>
* <span class="hl-green mono">Map File</span>：autofs 會根據 map file 的內容來掛載遠端目錄到本機的 mount point，該設定檔名稱可以自訂

將 master conf 放在 <span class="hl-blue">/etc/auto.master.d</span> 裡是比較建議的做法，不過<span class="hl-red">在 Ubuntu 18.04 以前，並沒有這個資料夾</span>，所以也可以直接把 master conf 的內容寫到 <span class="hl-blue">/etc/auto.master</span> 裡

接著建立 Map File


```bash
sudo vim /etc/auto.nfs
```

```bash
share        -rw,sync        192.168.199.169:/home/wade
```

* <span class="hl-green mono">share</span>：子目錄名稱，指的是剛才 master conf 裡 mount point 底下的子目錄，名稱可以自訂，當我們進入 /home/wade/nfs_mount/share 的同時，autofs 就會幫我們把遠端目錄掛載到該處。  
<span class="hl-red">因此實際上 192.168.199.169:/home/wade 會掛載到 /home/wade/nfs_mount/share，而不是 /home/wade/nfs_mount</span>
* <span class="hl-green mono">-rw,sync</span>：nfs 的掛載參數
* <span class="hl-green mono">192.168.199.169:/home/wade</span>：NFS server 裡 /etc/exports 所設定的分享目錄，

\
<span class="hl-blue">master conf</span> 與 <span class="hl-blue">map file</span> 都設定好之後，啟動 autofs 並設定自動開啟

```bash
sudo systemctl start autofs && sudo systemctl enable autofs
```

\
測試 autofs 掛載

```bash
cd /home/wade/nfs_mount/share && ls -l
```

```bash
總計 16
drwxrwxrwx 3 wade wade  109  8月 14 11:54 .
drwxr-xr-x 3 root root    0  8月 14 11:53 ..
-rw------- 1 wade wade 2059  8月 13 16:41 .bash_history
-rw-r--r-- 1 wade wade   18 11月  9  2019 .bash_logout
-rw-r--r-- 1 wade wade  141 11月  9  2019 .bash_profile
-rw-r--r-- 1 wade wade  312 11月  9  2019 .bashrc
drwxrwxr-x 2 wade wade    6  8月 14 11:35 HI
-rw-rw-r-- 1 wade wade    0  8月 14 11:36 NFS_test
```

可以看到這些都是 NFS server 上的 home 目錄的內容

比較方便的做法是在 File Manager 裡把掛載目錄加到書籤，這樣只要點一下就掛載起來了！

![](https://image.wadeism.net/autofs01.png)

![](https://image.wadeism.net/autofs02.png)

![](https://image.wadeism.net/autofs03.png)

### NFS Server 系列文章：

[CentOS 8 安裝與設定 NFS Server](https://notes.wadeism.net/post/centos8-nfs-server/)

[Mac 掛載 NFS 與 Operation not permitted 問題](https://notes.wadeism.net/post/mac-nfs-mount-operation-not-permitted/)

[Mac 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/mac-autofs-nfs/)
