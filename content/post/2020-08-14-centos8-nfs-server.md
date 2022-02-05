---
author: wade
date: 2020-08-14 14:40:32+00:00
draft: false
title: CentOS 8 安裝與設定 NFS Server
type: post
url: /post/centos8-nfs-server/
categories:
- Linux
tags:
- CentOS 8
- NFS
- Server
---

NFS（Network File System）是很早期就有的網路檔案分享功能，幾乎所有 Unix 類系統如 Linux 與 macOS 都有支援（Windows 上要弄會比較麻煩），而且使用容易，算是相當泛用的 file server。效能部分幾年前看是[比 SAMBA 還要好](https://ferhatakgun.com/network-share-performance-differences-between-nfs-smb/)，不過最近也是有看到文章是 [SMB 與 AFP 屌打 NFS](https://photographylife.com/afp-vs-nfs-vs-smb-performance) 的，這部分就得自己再做測試。

由於它的易用性真的蠻高的，所以家裡如果沒有 Windows 的話蠻建議使用 NFS 取代 SMB or AFP（雖然大多數人家裡應該是 Win + MAC）


## 環境說明

{{< green >}}NFS Server{{< /green >}}：CentOS 8 Minimal install（IP：192.168.199.169）

{{< green >}}Client{{< /green >}}：Ubuntu 20.04.1（IP：192.168.199.168）


## CentOS 8 安裝 NFS-Server

```bash
sudo dnf install nfs-utils
```

\
執行 NFS Server 並設定開機自動啟動

```bash
sudo systemctl start nfs-server.service
```

```bash
sudo systemctl enable nfs-server.service
```

\
檢查 service 啟動狀態

```bash
sudo systemctl status nfs-server.service
```

```bash
# 執行結果：

● nfs-server.service - NFS server and services
   Loaded: loaded (/usr/lib/systemd/system/nfs-server.service; enabled; vendor preset: disabled)
   Active: active (exited) since Thu 2020-08-13 10:24:00 CST; 1min 48s ago
 Main PID: 6088 (code=exited, status=0/SUCCESS)
    Tasks: 0 (limit: 4855)
   Memory: 0B
   CGroup: /system.slice/nfs-server.service

Aug 13 10:24:00 localhost.localdomain systemd[1]: Starting NFS server and services...
Aug 13 10:24:00 localhost.localdomain systemd[1]: Started NFS server and services.
```

\
開啟防火牆

```bash
sudo firewall-cmd --add-service=nfs --permanent
```

```bash
sudo firewall-cmd --add-service=rpc-bind --permanent
```

```bash
sudo firewall-cmd --add-service=mountd --permanent
```

```bash
sudo firewall-cmd --reload
```


## NFS Server 設定

先簡單的讓 NFS server 分享每個使用者在 server 上各自的 home 目錄讓他們遠端存取，要設定 share folder 及權限只要編輯 {{< blue >}}/etc/exports{{< /blue >}} 這個檔案即可

```bash
# 要分享的目錄    # 允許連線的主機與參數
/home/wade      192.168.199.168(rw,sync)
/home/stanley   192.168.199.170(rw,async)
/tmp            192.168.199.168(rw,all_squash)  192.168.199.170(rw,all_squash)
```

允許連線的主機有很多種的格式：  
．主機 IP  
．主機 Hostname  
．網段（如 192.168.199.0/24）  
．網域（可使用 wildcard 「*」字元）

* {{< green >}}{{< mono >}}rw{{< /green >}}{{< /mono >}}：可讀可寫
* {{< green >}}{{< mono >}}ro{{< /green >}}{{< /mono >}}：唯讀
* {{< green >}}{{< mono >}}sync{{< /green >}}{{< /mono >}}：資料會同步寫入到記憶體與硬碟裡，nfs-utils 1.0.0 版之後該選項為預設
* {{< green >}}{{< mono >}}async{{< /green >}}{{< /mono >}}：資料會先暫存在記憶體，不會直接寫入硬碟，該選項可以增加效能，但如果機器突然掛掉可能會導致資料不見，在nfs-utils 1.0.0 以前的版本，該選項為預設
* {{< green >}}{{< mono >}}root_squash{{< /green >}}{{< /mono >}}：如果使用 root 帳號（uid/gid=0）存取資料夾，它的 user 與 groups 會變成 nobody 與 nogroup，安全性上會比較好，該選項為預設
* {{< green >}}{{< mono >}}no_root_squash{{< /green >}}{{< /mono >}}：不要限縮 root 帳號，可以讓遠端使用者以 root 帳號來存取
* {{< green >}}{{< mono >}}all_squash{{< /green >}}{{< /mono >}}：無論使用者的身份，一律將身份限縮成 nobody
* {{< green >}}{{< mono >}}no_all_squash{{< /green >}}{{< /mono >}}：與上面選項相反，一律不限縮為 nobody
* {{< green >}}{{< mono >}}anonuid{{< /green >}}{{< /mono >}}：自訂匿名使用者的 uid，上面有提到像 all_squash 會把所有使用者變成 nobody，anonuid 可以將遠端使用者的身份指定為 server 上現有的使用者，例如 nfsUser 的 uid 是 1002，如果設定 anonuid=1002，那麼 client 建立檔案時，檔案的擁有者就會是 nfsUser
* {{< green >}}{{< mono >}}anongid{{< /green >}}{{< /mono >}}：功能同上，自訂匿名使用者的 gid


編輯完後用 {{< blue >}}exportfs{{< /blue >}} 可以重新掛載 {{< blue >}}/etc/exports{{< /blue >}} 裡的內容而不用重啟 NFS server


```bash
exportfs -arv
```

* {{< green >}}{{< mono >}}-a{{< /green >}}{{< /mono >}}：掛載或卸載 /etc/exports 裡的所有資料夾
* {{< green >}}{{< mono >}}-r{{< /green >}}{{< /mono >}}：重新掛載 /etc/exports 裡的所有資料夾，並同步 /etc/exports  與 /var/lib/nfs/etab
* {{< green >}}{{< mono >}}-u{{< /green >}}{{< /mono >}}：卸載某個資料夾，搭配 -a 參數就是卸載全部的路徑
* {{< green >}}{{< mono >}}-v{{< /green >}}{{< /mono >}}：執行指令時將結果輸出到螢幕

```bash
# 執行結果：

exporting 192.168.199.168:/tmp
exporting 192.168.199.170:/tmp
exporting 192.168.199.170:/home/stanley
exporting 192.168.199.168:/home/wade
```

\
查詢分享目錄完整的掛載參數

```bash
exportfs -v
```

```bash
# 執行結果：

/home/wade      192.168.199.168(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
/home/stanley   192.168.199.170(async,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
/tmp            192.168.199.168(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,all_squash)
/tmp            192.168.199.170(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,all_squash)
```

可以看到分享資料夾的一些預設參數


## 使用 Ubuntu 掛載 NFS Server

安裝 {{< blue >}}nfs-common{{< /blue >}}

```bash
sudo apt install nfs-common
```

\
使用 {{< blue >}}showmount{{< /blue >}} 指令可以列出 nfs server 目前可以掛載的內容及允許的主機

```bash
showmount -e 192.168.199.169
```

```bash
# 執行結果：

Export list for 192.168.199.169:
/tmp          192.168.199.170,192.168.199.168
/home/stanley 192.168.199.170
/home/wade    192.168.199.168
```

\
建立掛載用的空目錄

```bash
cd && mkdir nfs_mount
```

\
掛載 NFS share 目錄到 ~/nfs_mount

```bash
sudo mount -t nfs 192.168.199.169:/home/wade  /home/wade/nfs_mount
```

掛載完可以進去 nfs_mount 目錄建個新檔案來測試

\
NFS Server 有個比較討厭的地方，{{< red >}}如果 clinet 正在掛載中，突然 server 或 client 端死了，或是 service 掛掉，那麼它們其中一邊的連線就會 timeout 並且整個卡死{{< /red >}}，連帶也影響 df 之類的指令，因此下面一篇就要來介紹 autofs 這個好用的工具

### NFS Server 系列文章：

[Ubuntu 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/ubuntu-autofs-nfs/)

[Mac 掛載 NFS 與 Operation not permitted 問題](https://notes.wadeism.net/post/mac-nfs-mount-operation-not-permitted/)

[Mac 使用 autofs 自動掛載 NFS](https://notes.wadeism.net/post/mac-autofs-nfs/)

* * *

參考資料：

[How to Set Up NFS Server and Client on CentOS 8](https://www.tecmint.com/install-nfs-server-on-centos-8/)

鳥哥的 Linux 私房菜 - NFS [伺服器篇](https://linux.vbird.org/linux_server/centos6/0330nfs.php)
