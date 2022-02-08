---
author: wade
date: 2018-06-23 09:34:50+00:00
draft: false
title: Linux 的 RamDisk 應用
type: post
url: /post/ramdisk-in-linux/
image: "https://image.wadeism.net/macRam00.jpg"
categories:
- Linux
tags:
- Ubuntu
---

RamDisk，顧名思義就是將實體記憶體拿來當硬碟使用，大家都知道記憶體的特性就是速度超快但裡面的資料只要關機後就會消失，因此 ramdisk 適合拿來存放網頁瀏覽器的暫存檔或是tmp file，我自己則是習慣將所有的下載檔案都先存在 ramdisk 裡，或是將一些小程式或 VM 放在裡面來跑，速度上會快很多。

以往在 windows 裡，免費的 SoftPerfect RAM Disk 就已經很好用了，只是現在的瀏覽器要將快取移到 ram disk 並不是那麼的容易。不過在 Linux 裡這些都只是非常基本的功能。其實 Linux 預設會將實體記憶體的一半當作 ramdisk 使用，以我自己的電腦總共 16G 的實體記憶體為例：
    
```bash
sudo df -h
```
    
```bash
# 執行結果：
    
Filesystem      Size  Used Avail Use% Mounted on
udev            7.8G     0  7.8G   0% /dev
tmpfs           1.6G  9.7M  1.6G   1% /run
/dev/sda2        25G   13G   11G  56% /
tmpfs           7.9G  1.3G  6.6G  17% /dev/shm    <---RamDisk
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           7.9G     0  7.9G   0% /sys/fs/cgroup
/dev/sda3       197G   79G  108G  43% /home
/dev/sda1       511M  3.5M  508M   1% /boot/efi
```

<span class="hl-green">/dev/shm 這個目錄就是 Linux 預設 ramdisk 的位置</span>，這個分區的 Size 7.9G 也剛好是 16G 記憶體的一半。進去這個目錄看，會發現已經有很多的暫存檔放在這裡了，如果試著丟一些檔案在這裡，每次重開機過後檔案都會消失，因此也可以確定這個目錄就是 ramdisk。

雖然 /dev/shm 預設是實體記憶體的一半大小，但不代表你的電腦永遠只有一半的記憶體可用。基本上當沒有用到 /dev/shm 的時候，系統還是會儘量的使用實體記憶體，並不會為了 ramdisk 而保留一半的記憶體不去使用。只是當 ramdisk 裡塞好塞滿的話，系統就會開始使用 SWAP，如此一來效能就會有所打折，因此建議儘量不要把 /dev/shm 裡塞到太滿，除非實體記憶體真的夠大。


## 建立乾淨的資料夾與設定瀏覽器快取

上面有提到因為系統本身也會將很多快取檔放在 /dev/shm，所以如果要當作乾淨的資料夾使用，建議在裡面另外建立一個資料夾，現在就以 Ubuntu 為例說明如何在開機時自動建立一個乾淨的 RamDisk 資料夾。

特別要注意 Ubuntu 在 15.04 版後改用了systemd 來管理 process 而非以往的 init.d，因此下面會對不同的版本分別說明


### before Ubuntu 14.10

在 /etc/init.d/ 建立一個 script 檔，檔名可自取
    
```bash
sudo vim /etc/init.d/ramdisk.sh
```

\
將下面的內容寫入 script 檔
    
```bash
#!/bin/sh
PATH=/bin:/usr/bin:/sbin:/usr/sbin; export PATH
    
# ---------- create RamDisk Folder ---------- #

mkdir /dev/shm/RamDisk
chmod 1777 /dev/shm/RamDisk

# ---------- Browser Cache Mount   ---------- #

# for Google Chrome

mkdir /dev/shm/Chrome
chmod 1777 /dev/shm/Chrome
mount --bind /dev/shm/Chrome /home/$USER/.cache/google-chrome

# for Firefox

mkdir /dev/shm/Mozilla
chmod 1777 /dev/shm/Mozilla
mount --bind /dev/shm/Mozilla /home/$USER/.cache/mozilla

# for Vivaldi

mkdir /dev/shm/Vivaldi
chmod 1777 /dev/shm/Vivaldi
mount --bind /dev/shm/Vivaldi /home/$USER/.cache/vivaldi
```

請注意將裡面的 $USER 改為自己的使用者名稱，另外下面有三種瀏覽器的快取設定，可自行選擇。

mount --bind 指令的功能則是將原本放在 /home 目錄下面的快取檔位置改變到自訂的目錄

\
更改 script 檔的權限
    
```bash
sudo chmod 755 /etc/init.d/ramdisk.sh
```

\
建立 symbolic link 讓 script 可以在開機時自動執行
    
```bash
sudo ln -s /etc/init.d/ramdisk.sh /etc/rcS.d/S50_ramdisk.sh
```

\
在 /etc/rcS.d/ 裡的 script 都會在開機時自動處理，<span class="hl-red">S 開頭的檔案會自動執行</span>，而 <span class="hl-red">K 開頭的檔案則會停止</span>，因此這邊的檔名取作 S50_ramdisk.sh 如果改成 K50_ramdisk.sh 的話就不會自動執行了，另外後面的數字則是決定執行的順序，在 /etc/rcS.d 資料夾中的檔案，若檔名數字越小則越早被執行。


### After Ubuntu 15.04

在 /etc/systemd/system/ 建立一個 service 檔，檔名可自取

```bash
sudo cat > /etc/systemd/system/ramdisk.service <<EOF
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/ramdisk.sh

[Install]
WantedBy=default.target
EOF
```

這次換了一個方式，使用了 cat 與文字重新導向來建立與寫入檔案，有興趣的話可搜尋 cat EOF 會有相關資料。

service 檔為 systemd 用來控制程序啟動相關的物件。

\
更改 ramdisk.service 檔案的權限
    
```bash
sudo chmod 664 /etc/systemd/system/ramdisk.service
```

\
在 /usr/local/bin/ 裡建立一個 script 檔，並將下面的內容寫入該檔案中
    
```bash
sudo vim /usr/local/bin/ramdisk.sh
```

```bash
#!/bin/sh
PATH=/bin:/usr/bin:/sbin:/usr/sbin; export PATH

# ---------- create RamDisk Folder ---------- #

mkdir /dev/shm/RamDisk
chmod 1777 /dev/shm/RamDisk

# ---------- Browser Cache Mount ---------- #

# Google Chrome

mkdir /dev/shm/Chrome
chmod 1777 /dev/shm/Chrome
mount --bind /dev/shm/Chrome /home/$USER/.cache/google-chrome

# Firefox

mkdir /dev/shm/Mozilla
chmod 1777 /dev/shm/Mozilla
mount --bind /dev/shm/Mozilla /home/$USER/.cache/mozilla

# Vivaldi

mkdir /dev/shm/Vivaldi
chmod 1777 /dev/shm/Vivaldi
mount --bind /dev/shm/Vivaldi /home/$USER/.cache/vivaldi
```

\
更改 /usr/local/bin/ramdisk.sh 的檔案權限

```bash
sudo chmod 744 /usr/local/bin/ramdisk.sh
```

\
重新載入 systemd 的 service 檔
    
```bash
sudo systemctl daemon-reload
```

\
設定開機時自動執行 ramdisk 這個 service

```bash
sudo systemctl enable ramdisk.service
```
