---
author: wade
date: 2020-09-14 03:04:43+00:00
draft: false
title: CentOS 8 建立 Time Machine Server 備份 Mac
type: post
url: /post/centos8-create-time-machine/
image: "https://image.wadeism.net/timemachine00.jpg"
categories:
- Mac
tags:
- Mac
---

Time Machine 是 Mac 上的備份功能，以往要買貴貴的 AirPort Time Capsule 才能使用，後來市售的 NAS 也多半有這項功能，現在也可以用外接硬碟來做，不過其實家裡如果有台 Linux Server 的話也是可以搞一台 custom 的 Time Machine Server 來玩，不僅便宜，而且容量也可以弄比較充裕。

大家應該多少聽過 [SAMBA ](https://notes.wadeism.net/post/learning-samba/)這個 Windows 與 Linux 通用的 File Server，Mac 則是有它專屬的協定叫 {{< blue >}}AFP{{< /blue >}}，基本上 Time Machine 就是利用 AFP File Server 來做備份檔的 storage，現在似乎也可以用 SAMBA 來做 Time Machine 的 Server，不過這邊還是先介紹用 Linux 建一個 AFP Server 來給 macOS 使用。


## 環境說明

系統：{{< green >}}CentOS 8 minimal install{{< /green >}}

Time Machine 使用的備份目錄：{{< blue >}}/media/tmBackup{{< /blue >}}（已掛載一顆 200G  的空白磁區到該目錄）


## Server side

### 安裝 Netatalk、Avahi

Netatalk 是一個開源的專案，可以在 Unix-Like 的系統建立 AFP Service 來給 Mac 使用，avahi 則是可以讓 macOS 可以自動抓到遠端 server 的程序。

在 CentOS 7 之前的 netatalk 需要自己編譯才能安裝，不過在 8 版已經變得相當容易了

```bash
sudo dnf install epel-release
```

```bash
sudo dnf install netatalk avahi
```

### Netatalk 與 Avahi 設定

為 avahi 新增 afpd 的設定檔


```xml
cat << EOF | sudo tee -a /etc/avahi/services/afpd.service
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name replace-wildcards="yes">%h</name>
  <service>
    <type>_afpovertcp._tcp</type>
    <port>548</port>
  </service>
  <service>
    <type>_device-info._tcp</type>
    <port>0</port>
    <txt-record>model=Xserve</txt-record>
  </service>
</service-group>
EOF
```

\
編輯 netatalk 的設定檔

```bash
sudo cp /etc/netatalk/afp.conf /etc/netatalk/afp.conf.bak
```

```bash
cat << EOF | sudo tee -a /etc/netatalk/afp.conf

[My Time Machine]
path = /media/tmBackup
valid users = tmUser
time machine = yes

EOF
```

* {{< green >}}{{< mono >}}[My Time Machine]{{< /green >}}{{< /mono >}}：AFP 的 share name，也是 macOS 裡顯示的磁碟名稱
* {{< green >}}{{< mono >}}path{{< /green >}}{{< /mono >}}：備份檔存放的目錄
* {{< green >}}{{< mono >}}valid users{{< /green >}}{{< /mono >}}：可使用的 user，這邊新增一個叫 {{< blue >}}tmUser{{< /blue >}} 的使用者
* {{< green >}}{{< mono >}}time machine = yes{{< /green >}}{{< /mono >}}：宣告該目錄可被 Time Machine 使用

{{< red >}}/etc/netatalk/afp.conf，這個設定檔就跟 SAMBA 的 config 一樣，裡面可以定義許多不同的 share point 讓 macOS 來掛載{{< /red >}}

\
新增 netatalk 的 afpd 設定檔

```bash
cat << EOF | sudo tee -a /etc/netatalk/afpd.conf
- -transall -uamlist uams_randnum.so,uams_dhx.so,uams_dhx2.so -nosavepassword -advertise_ssh
EOF
```

\
新增 netatalk 的 Time Machine 目錄設定值

```bash
cat << EOF | sudo tee -a /etc/netatalk/AppleVolumes.default
/media/tmBackup TimeMachine allow:tmUser options:usedots,upriv,tm dperm:0775 fperm:0660 cnidscheme:dbd volsizelimit:200000
EOF
```

* {{< green >}}{{< mono >}}/media/tmBackup{{< /green >}}{{< /mono >}}：備份檔存放的目錄，請依環境自訂
* {{< green >}}{{< mono >}}allow{{< /green >}}{{< /mono >}}： 要使用的 user，本例為 {{< blue >}}tmUser{{< /blue >}}

\
編輯 {{< blue >}}/etc/nsswitch.conf{{< /blue >}} 檔

```bash
cat << EOF | sudo tee -a /etc/nsswitch.conf
hosts:  files mdns4_minimal dns mdns mdns4

EOF
```

\
為 Time Machine 新增使用者並設定密碼

```bash
sudo useradd tmUser
```

```bash
sudo passwd tmUser
```

\
調整 Time Machine 備份路徑 {{< blue >}}/media/tmBackup{{< /blue >}} 的權限

```bash
sudo chown tmUser: /media/tmBackup
```

\
設定防火牆，開啟 {{< blue >}}tcp 548 port{{< /blue >}} 給 afpd、{{< blue >}}udp 5353 port{{< /blue >}} 給 avahi

```bash
sudo firewall-cmd --add-port=548/tcp --permanent
```

```bash
sudo firewall-cmd --add-port=5353/udp --permanent
```

```bash
sudo firewall-cmd --reload
```

\
設定讓 netatalk 與 avahi 於開機時自動執行並且啟動它們


```bash
sudo systemctl enable avahi-daemon netatalk
```

```bash
sudo systemctl start avahi-daemon netatalk
```


## macOS side

Server 設定好之後，要在 macOS 上開啟 Time Machine 基本上就是照一般的流程即可

首先開啟 {{< blue >}}系統偏好設定{{< /blue >}} 接著選 {{< blue >}}Time Machine{{< /blue >}}

![](https://image.wadeism.net/tm01.png)

\
接著點選 {{< blue >}}選擇備份磁碟{{< /blue >}}

![](https://image.wadeism.net/tm02.png)

\
選擇 {{< blue >}}My Time Machine{{< /blue >}}

![](https://image.wadeism.net/tm03.png)

\
選完後會跳出輸入使用者名稱與密碼，用剛才另外建立的 {{< blue >}}tmUser{{< /blue >}}

![](https://image.wadeism.net/tm04.png)

\
登入後，Time Machine 就可以開始使用了，第一次備份會比較久，在選項中可以排除不要備份的目錄

![](https://image.wadeism.net/tm05.png)

![](https://image.wadeism.net/tm06.png)

![](https://image.wadeism.net/tm07.png)

\
回到 Server 上看，{{< blue >}}/media/tmBackup{{< /blue >}} 裡出現 Time Machine 的檔案了，記得先切換到 tmUser

```bash
ls -al /media/tmBackup/
```

```bash
# 執行結果

total 8
drwxr-xr-x. 3 tmUser tmUser  45 Jul 31 03:59  .
drwxr-xr-x. 3 root   root    22 Jul 31 03:03  ..
drwx--S---. 3 tmUser tmUser 209 Jul 31 03:44 'Wade的MacBook Pro.sparsebundle'
```

```bash
ls -al /media/tmBackup/Wade的MacBook\ Pro.sparsebundle
```

```bash
# 執行結果

total 68
drwx--S---. 3 tmUser tmUser  209 Jul 31 03:44 .
drwxr-xr-x. 3 tmUser tmUser   45 Jul 31 04:00 ..
drwx--S---. 2 tmUser tmUser 8192 Jul 31 04:00 bands
-rw-r--r--. 1 tmUser tmUser  515 Jul 31 03:49 com.apple.TimeMachine.MachineID.bckup
-rw-r--r--. 1 tmUser tmUser  515 Jul 31 03:49 com.apple.TimeMachine.MachineID.plist
-rw-r--r--. 1 tmUser tmUser  220 Jul 31 03:49 com.apple.TimeMachine.SnapshotHistory.plist
-rw-r--r--. 1 tmUser tmUser  498 Jul 31 03:49 Info.bckup
-rw-r--r--. 1 tmUser tmUser  498 Jul 31 03:49 Info.plist
-rwx------. 1 tmUser tmUser    0 Jul 31 03:49 token
```

* * *

參考資料：

[AFP and SMB File Sharing on CentOS 7](https://zitseng.com/archives/6182)

[[CentOS 7] Mac 最強大的後盾，Time Machine 自動備份的實作](http://blog.itist.tw/2016/02/building-time-machine-service-for-mac-on-centos-7.html)

[GitHub / hrabiamiod / centos7_timechine.sh](https://gist.github.com/hrabiamiod/d3627fe53ec18a288263313f15ebd2c2)
