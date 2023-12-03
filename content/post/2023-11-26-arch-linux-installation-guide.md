---
title: 我的 Arch Linux 安裝手冊
date: 2023-11-26T23:51:59+08:00
type: post
draft: true
url: /post/2023-11-26-arch-linux-installation-guide
image: ""
categories:
- Linux
tags:
- ArchLinux
---

應該有不少人想嘗試 Arch 時，在一開始的安裝步驟就先被勸退了，記得蠻久以前的我也是如此。不過大約兩年前我的 manjaro 初體驗在7個月就突然炸掉之後，我又開始試著安裝 Arch，這次順利的成功了，從此也就成了 Arch 的愛用者。<br/>
<br/>
雖然在 Arch 台灣社群中有提到，「根本就沒有新手，又或者在 Arch 社群裡人人遇到安裝都是新手」，不過只要好好的 follow 官方 wiki 的 installation guide，其實該做該注意的裡面都已經寫上了，只要耐心得閱讀相信多數的問題都可以迎刃而解。<br/>
<br/>
話雖如此，還是想要寫一篇自已的 Arch 安裝手冊，一方面這是屬於我個人的筆記，比較以個人用途為優先（但步驟大都是官方 wiki 的內容），再者這個安裝流程在這兩年多來的幾次 Arch 安裝過程裡都是完全適用，沒有一次需要修改，所以我覺得還算是值得參考與記錄。

## 硬體環境

雖然硬體環境並不是特別重要，不過還是列一下我最近一次安裝 Arch Linux 的電腦配備<br/>
<br/>
CPU:        AMD Ryzen 9 7950X3D 16-Core, 32-Thread<br/>
MainBoard:  ASUS ROG STRIX X670E-F GAMING WIFI<br/>
Memory:     Micron Crucial DDR5 4800 32G * 2<br/>
Graphic:    ASUS TUF Gaming Radeon RX 7900 XTX OC Edition 24GB GDDR6<br/>


Arch Linux 的安裝我把會把它分為兩個部分，pre install 與 post install，pre install 就是類似裝 ubuntu 用 live cd 安裝的過程，其操作並不是在實際安裝的磁區裡，而是在 live cd 的環境中設定電腦，以下幾個就是 pre install 的步驟：

## 硬碟分割與格式化

### 硬碟分割

用 gdisk 操作安裝目標的硬碟
```sh
gdisk /dev/dev/nvme0n1
```

在 gdisk 的介面介面中，可以按 ? 來查看所有的指令，可以很簡單分割出想要的磁區規劃，下面就簡單記一下分割第一個磁區時在 gdisk 裡所需要的操作：

查看硬碟分割區狀態
```sh
Command (? for help): p
```

建立新的磁區
```sh
Command (? for help): n
```

選擇分割區（直接按 enter 選預設的就好）
```sh
Command (? for help): 
```

選擇起始磁區位置（直接按 enter 選預設的就好）
```sh
Command (? for help): 
```

選擇結束磁區位置（可直接用想要切幾G的數字來表示，本例是幫 /boot 切 1G）
```sh
Command (? for help): +1G
```

為磁區加上 partition type codes，習慣上我會切成 /boot、/ 與 /home 三個區，所以這邊列出三種磁區的代碼，雖然代號就算沒照規定設好像也不太會怎樣，但我們就還是先照書走吧：：
```sh
/boot   ef00（EFI）
/       8304（root）
/home   8302（home）
```

```sh
Command (? for help): ef00
```

最後再用 p 看一次目前的狀況，確認無誤就就可以用 w 進行實際的分割。
```sh
Command (? for help): w
```
<br/>
完成後就可以用 blkid 來檢查一下磁區是否有劃好，有劃好的話應該會看到類似下面的訊息

```sh
/dev/sr0: BLOCK_SIZE="2048" UUID="2023-11-01-06-55-57-00" LABEL="ARCH_202311" TYPE="iso9660" PTUUID="fd38acc6" PTTYPE="dos"
/dev/loop0: BLOCK_SIZE="1048576" TYPE="squashfs"
/dev/nvme0n1p2: PARTLABEL="Linux x86-64 root (/)" PARTUUID="2c40c551-cf01-4f6d-b731-058290cc038c"
/dev/nvme0n1p3: PARTLABEL="Linux /home" PARTUUID="3b4e9a75-5c87-111f-87e0-a62ce6ce94d7"
/dev/nvme0n1p1: PARTLABEL="EFI system partition" PARTUUID="c8702579-6dab-4283-adaf-caf98515b01b"
```
<br/>

劃分好磁區後，接著就來格式化磁區，除了給 /boot 的磁區用 FAT32 的 file system 以外，其它的我們都用 ext4 來格式化（想用其它格式也可以）

```sh
mkfs.fat -F 32 /dev/nvme0n1p1
```
```sh
mkfs.ext4 /dev/nvme0n1p2
```
```sh
mkfs.ext4 /dev/nvme0n1p3
```

格式化結果

```sh
blkid
```

```sh
#

/dev/sr0: BLOCK_SIZE="2048" UUID="2023-11-01-06-55-57-00" LABEL="ARCH_202311" TYPE="iso9660" PTUUID="fd38acc6" PTTYPE="dos"
/dev/loop0: BLOCK_SIZE="1048576" TYPE="squashfs"
/dev/nvme0n1p2: UUID="45e7bd42-c017-4310-8437-6ff3df288e54" BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="Linux x86-64 root (/)" PARTUUID="3dbe7a27-f8a1-4621-8f34-7ef406a39c4b"
/dev/nvme0n1p3: UUID="d17578e3-3eb7-46d4-b042-ae0b4694f764" BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="Linux /home" PARTUUID="ed397706-2bfa-40f3-91e9-cc947ae32703"
/dev/nvme0n1p1: UUID="841A-84AD" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI system partition" PARTUUID="a5aae042-fbc0-47c9-ac88-0240d953827f"
```


### 建立與掛載安裝目錄

接著我們把之後要使用的系統目錄先掛載起來<br/>
因為在使用 gdisk 分割磁區時已經有先定義好不同用途磁區的 PARTLABEL，所以可以利用 label 來幫我們識別磁區的實體路徑
<br/>

掛載根目錄 /
```sh
mount $(blkid | grep root | awk -F ":" '{print $1}') /mnt
```

建立 /boot 與 /home
```sh
mkdir /mnt/boot /mnt/home
```

掛載 /home
```sh
mount $(blkid | grep home | awk -F ":" '{print $1}') /mnt/home
```

掛載 /boot
```sh
mount $(blkid | grep EFI | awk -F ":" '{print $1}') /mnt/home
```


### 額外安裝網卡驅動程式

一般情況下是不需要這步驟的，但我的主機板是垃圾 Intel I225-V 2.5G 網卡，會沒理由的無預警斷線，後來買了Broadcom 10G的網卡，但這張是需要另外裝驅動才能用。<br/>
<br/>
因此這邊我需要先在別台電腦下載網卡的驅動程式，存到隨身碟後，把網卡驅動裝好才能繼續安裝Arch

Broadcom 網卡的驅動檔名應該是長下面的樣子：
```sh
linux-firmware-bnx2x-xxxxx.pkg.tar.zst
linux-firmware-bnx2x-xxxxx.pkg.tar.zst.sig
```

載好放到隨身碟後，再掛載起來安裝

```sh
# 我的隨身碟為 /dev/sde1
mount /dev/sde1 /media && cd /media
```
```sh
sudo pacman -Sy linux-firmware-bnx2x
```

裝完後應該就有網路可用了

### 正式安裝 Arch

```sh
pacstrap /mnt base linux linux-firmware linux-firmware-bnx2x
```

這步就是把 Arch 裝到 /mnt 裡（之後的 /），這裡趁有網路的時候把 Broadcom 的網卡驅動也一併裝上，之後真的進入 Arch 後才不會沒有網路可用。
其實這步也可以把個人常用的套件都一起裝，不過這邊我只選擇安裝最基本需要的系統核心。


### 產生 fstab

```sh
genfstab -U /mnt >> /mnt/etc/fstab
```


### Change root to /mnt

這邊利用 change root /mnt，先進入 Arch 系統中做一些基本設定

```sh
arch-chroot /mnt
```


### 安裝常用套件

```sh
pacman -Sy \
  vim \
  bash-completion \
  sudo \
  openssh \
  networkmanager
```

以上都是我常用的套件，算是基本中的基本，會安裝 networkmanager 是因為它是 Gnome GUI 會用的，不然網路設定也可以直接用預設的 networkctl 或另外安裝如 netplan 之類的套件


### 設定時區、地區、語言

```sh
ln -sf /usr/share/zoneinfo/Asia/Taipei /etc/localtime
```
```sh
hwclock --systohc
```
```sh
sed -i 's/#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen
```
```sh
sed -i 's/#zh_TW.UTF-8/zh_TW.UTF-8/' /etc/locale.gen
```
```sh
locale-gen
```
```sh
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```

### 設定 hostname 與 root 密碼
```sh
# 看你要取啥名都隨意，這邊範例用 archlinux
echo "archlinux" > /etc/hostname
```

```sh
passwd
```

### 安裝 UEFI grub

這邊就直接用 UEFI 的 grub，不用 MBR 了

```sh
pacman -Sy \
  grub \
  efibootmgr \
  dosfstools \
  os-prober \
  mtools
```
```sh
grub-install --target=x86_64-efi --bootloader-id=GRUB --efi-directory=/boot
```
```sh
grub-mkconfig -o /boot/grub/grub.cfg
```

其實到 grub 安裝好後，這是重開機就會正式進入我們的 Arch Linux 了，如果你想在 change root 的模式下多安裝或多設定東西也是 ok，不過個人這邊會選擇先重開機再正式進入 Arch，也就是進入前面提到的 post install（這時 archlinux 的安裝 iso 也可以取出了）

```sh
exit && reboot
```


### 啟動網路

```sh
systemctl enable NetworkManager && systemctl start NetworkManager
```


### 設定時間同步與時區

```sh
sudo timedatectl set-timezone Asia/Taipei
```
```sh
# 192.168.100.1 是我的分享器，上面有 NTP Service
sudo sed -i 's/#NTP/NTP=192.168.100.1/' /etc/systemd/timesyncd.conf
```
```sh
sudo systemctl enable systemd-timesyncd.service && sudo systemctl enable systemd-timesyncd.service
```


### 建立使用者帳號與設定使用者密碼

$USER 請替代成你想用的 user name

```sh
useradd -m $USER
```
```sh
echo "$USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USER
```
```sh
chmod 600 /etc/sudoers.d/$USER
```
```sh
passwd $USER
```


### 改變 Arch 更新與下載的節點
```sh
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
```

備份後，可參照下面的步驟調整

[mirrorlist](https://archlinux.org/mirrorlist/)


### 建立 home 目錄底下的資料夾、給其它磁區的掛載點、ramdisk 掛載點

這部分就是個人向的設定，因為我是日常生活在用的，所以一些 Music、Documents 的基本資料夾都會建起來，也有其它顆硬碟會掛到 /mnt 裡的資料夾，劃出 ramdisk 的資料夾則是個人的使用習慣<br/>
<br/>

利用 xdg-user-dir 來建立 Music…等資料夾（也可以不用這個套件，手動建立）
```sh
sudo pacman -Sy xdg-user-dir && xdg-user-dirs-update
```

建立硬碟與 ramdisk 掛載點
```sh
sudo mkdir /ramdisk /mnt/data /mnt/workshop
```

建立放瀏覽器 cache 的資料夾
```sh
mkdir -p /home/$USER/.cache/mozilla \
         /home/$USER/.cache/vivaldi \
         /home/$USER/.cache/google-chrome
```

賦予權限
```sh
sudo chown $USER:$USER /mnt/data /mnt/workshop /ramdisk
```


### 修改 fstab 

這步就是完全個人向的設定了，主要是把其它的硬碟掛載到剛才建立的掛載點裡，另外就是設定剛才的 ramdisk 與 瀏覽器 cache，讓它們吃 Ram 的空間，不寫入 ssd裡。最後就是把個人的資料掛進 /home/$USER 裡的各分類資料夾

```sh
# /dev/sda1 workshop on MX500 500G
UUID=5e9c524a-fefe-46c2-ad72-b364851efda0   /mnt/workshop   ext4        rw,relatime 0 2

# /dev/sdb1 data on MX500 2T
UUID=ef0b6183-05e5-495b-85f6-1c7b36d7bd50   /mnt/data   ext4        rw,relatime 0 2

# RamDisk
tmpfs /ramdisk tmpfs rw,nodev,nosuid 0 0

# Firefox cache
tmpfs /home/$USER/.cache/mozilla tmpfs rw,nodev,nosuid 0 0

# Vivaldi cache
tmpfs /home/$USER/.cache/vivaldi tmpfs rw,nodev,nosuid 0 0

# Chrome cache
tmpfs /home/$USER/.cache/google-chrome tmpfs rw,nodev,nosuid 0 0

/mnt/data/Documents /home/$USER/Documents none defaults,bind 0 0

/mnt/data/Downloads /home/$USER/Downloads none defaults,bind 0 0

/mnt/data/Music /home/$USER/Music none defaults,bind 0 0

/mnt/data/Pictures /home/$USER/Pictures none defaults,bind 0 0

/mnt/data/Videos /home/$USER/Videos none defaults,bind 0 0

/mnt/data/Desktop /home/$USER/Desktop none defaults,bind 0 0
```


### 安裝 timeshift

timeshift 是 Linux 上一個類似 Mac Time Machine 的工具，非常的好用，建議系統有任何大變動或是想試裝軟體之前都要做一次 snapshot（尤其是更新 Gnome 前）

```sh
sudo pacman -Sy git base-devel
```
```sh
git clone https://aur.archlinux.org/timeshift.git
```
```sh
cd timeshift && makepkg -si
```


### 安裝 yay

yay 是用來安裝 AUR packages 的輔助工具，必裝！

```sh
git clone https://aur.archlinux.org/yay.git
```
```sh
cd yay && makepkg -si
```


## 安裝 Gnome

個人習慣偏 MacOS 的操作方式，因此選用 Gnome


### 安裝 Gnome 核心套件

gnome-shell 是最核心的組件，gdm 則是 Gnome 的 graphical display servers 並且提供了的 login 畫面

```sh
sudo pacman -Sy gnome-shell gdm
```
```sh
sudo systemctl enable gdm
```

enable 後，重開機就可以看到 Gnome 的登入畫面啦

```sh
sudo reboot
```

### 安裝 Gnome 常用套件

底下幾個是我常用的套件，除了 evince、gedit、nautilus 可依個人習慣選用，其它的都建議要裝
* <span class="hl-green mono">evince</span>：PDF 閱讀器
* <span class="hl-green mono">gedit</span>：輕量的文字編輯器
* <span class="hl-green mono">nautilus</span>：檔案管理程式
* <span class="hl-green mono">gnome-control-center</span>：Gnome 設定中心
* <span class="hl-green mono">gnome-tweaks</span>：Gnome 調校程式
* <span class="hl-green mono">gnome-shell-extensions</span>：外掛程式管理
* <span class="hl-green mono">gnome-terminal</span>：終端機程式

```sh
sudo pacman -Sy \
evince \
gedit \
nautilus \
gnome-control-center \
gnome-tweaks \
gnome-shell-extensions \
gnome-terminal
```


### 安裝 Gnome 瀏覽器整合套件

安裝整合套件後，Gnome 的外掛 plugins 就可以使用瀏覽器在它們的網站上進行開啟關閉等功能，不用再另外手動下載，非常方便

```sh
git clone https://aur.archlinux.org/gnome-browser-connector.git
```
```sh
cd gnome-browser-connector && makepkg -si
```

也可以使用 yay 安裝

```sh
yay -Sy gnome-browser-connector-git
```


### 個人常用的 Gnome extensions
- [AppIndicator and KStatusNotifierItem Support](https://extensions.gnome.org/extension/615/appindicator-support/)
- [Arch Linux Updates Indicator](https://extensions.gnome.org/extension/1010/archlinux-updates-indicator/)
- [Input Method Panel](https://extensions.gnome.org/extension/261/kimpanel/)
- [Gnome 4x UI Improvements](https://extensions.gnome.org/extension/4158/gnome-40-ui-improvements/)

<br/>

另外下面幾個也可以試試看
- [Dash to Dock](https://extensions.gnome.org/extension/307/dash-to-dock/)
- [User Themes](https://extensions.gnome.org/extension/19/user-themes/)
- [V-Shell (Vertical Workspaces)](https://extensions.gnome.org/extension/5177/vertical-workspaces/)
- [X11 Gestures](https://extensions.gnome.org/extension/4033/x11-gestures/)


### 額外的 Gnome 套件

這些就看個人喜好，有需要的時候再裝

```sh
sudo pacman -S \
gnome-backgrounds \
gnome-color-manager \
gnome-disk-utility 
gnome-font-viewer \
gnome-logs \
gnome-screenshot #(if necessary)
```


## 安裝常用工具

這些都是個人覺得蠻必要裝的工具

```sh
sudo pacman -Sy \
  pavucontrol \
  qt5-wayland \
  man-db \
  gnome-keyring
```

下面這些則是一些老基礎指令的強化版本

```sh
sudo pacman -Sy eza bat ncdu fd duf
```
```

<span class="hl-blue">Content</span>
<span class="hl-red">Content</span>
<div style="text-align: center">Center Content</div>


* <span class="hl-green mono">-Options_1</span>：Content
* <span class="hl-green mono">-Options_2</span>：Content


## title 2

* * *

參考資料：

[Link Text](https://url)

