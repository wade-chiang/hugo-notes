---
author: wade
date: 2018-06-18 07:55:17+00:00
draft: false
title: CentOS 7 安裝 XFCE、VM Tools
type: post
url: /post/centos7-install-xfce-vmtools/
categories:
- Linux
tags:
- CentOS
- xfce
---

本篇為 CentOS 7 最小安裝版本安裝 xfce 桌面環境與 VM Tools 的筆記，沒記錯的話應該是使用 CentOS 7.2 or 7.3 的版本，當初是用 vmware 安裝的，因此也有寫到 VM Tools 的安裝方法。


## install xfce

安裝額外的 repo

```bash
sudo yum install epel-release
```

\
安裝 X Window 套件

```bash
sudo yum groupinstall "X Window system"
```

\
安裝 xfce

```bash
sudo yum groupinstall xfce
```

\
安裝字型

```bash
sudo yum groupinstall Fonts
```

\
安裝額外字型（好像要裝這個才能支援中文）

```bash
sudo yum insall xorg-x11-fonts-Type1 xorg-x11-fonts-misc
```

\
重開機

```bash
sudo systemctl reboot
```

\
將桌面環境作為系統預設的開機 level

```bash
sudo systemctl set-default graphical.target
```


## install VM Tools

安裝開發者套件

```bash
sudo yum groupinstall "Development Tools"
```

\
安裝必要程式

```bash
sudo yum install net-tools kernel-headers kernel-devel gcc perl
```

\
軟體更新

```bash
sudo yum update
```

\
重開機

```bash
sudo systemctl reboot
```

\
在 vmware 中掛上 vmtools 的光碟檔給 CentOS VM 使用後，將光碟掛載到 /media 資料夾中

```bash
sudo mount /dev/cdrom /media
```

\
將 /media 裡的 VMwareTools-x.x.x.tar.gz 複製到 home 裡，並解壓縮
    
```bash
sudo cp /media/VMwareTools-x.x.x.tar.gz ~/
```

\
進入解壓完的目錄後執行 vmtools 的安裝

```bash
cd vmware-tools-distrib && sudo ./vmware-install.pl -d
```
