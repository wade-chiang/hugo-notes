---
author: wade
date: 2021-10-01 18:36:17+00:00
draft: false
title: Manjaro Gnome 安裝 Hime 輸入法與嘸蝦米
type: post
url: /post/manjaro-gnome-install-hime-boshiamy/
image: "https://image.wadeism.net/manjaro_hime00.png"
categories:
- Linux
tags:
- Manjaro
---

Hime + 嘸蝦米一直是我在 Linux 用起來最順手的中文輸入，最近打算從 Ubuntu 改到 Manjaro，第一件事就是要先把這個中文輸入給搞定，不然後面什麼的都不用玩了，在參考了網路上許多教學後，總算是成功的安裝，下面就記錄一下我的安裝步驟

> 安裝完 Hime 之後的嘸蝦米設定，參考之前的文章：[Ubuntu 安裝 hime 輸入法、嘸蝦米](https://notes.wadeism.net/post/ubuntu-install-hime-boshiamy/) 即可！


## 環境說明

系統：<span class="hl-blue">Manjaro 21.1.4 Minimal</span> 版本

桌面環境：<span class="hl-blue">Gnome 40.4</span>


## 安裝教學

更新套件庫的區域，將來源指向台灣

```bash
sudo pacman-mirrors --country Taiwan
```

\
安裝 <span class="hl-blue">manjaro-keyring</span>、<span class="hl-blue">manjaro-system</span> 並更新套件

```bash
sudo pacman -Sy manjaro-keyring manjaro-system
```

```bash
sudo pacman -Su
```

\
安裝 yay 套件管理程式

```bash
sudo pacman -S yay
```

原本的 Manjaro 是用 <span class="hl-blue">yaourt</span> 來安裝 AUR (Arch User Repository) 社群套件庫裡的軟體，不過現在已改用 <span class="hl-blue">yay</span>

\
安裝編譯用基礎套件

```bash
sudo pacman -S base-devel
```

這裡我選擇安裝全部的套件，因為看上去都是些編譯時常用到的軟體，不確定一般版的 Manjaro 是否需要這一步驟，我下載的是較為精簡的 minimal 版，所以需要這個步驟

\
安裝 Hime 輸入法

```bash
yay -S hime-git
```

執行後會出現幾個選項，都直接按 Enter 照預設的步驟就可以

\
編輯環境變數設定檔

```bash
cat >> ~/.xprofile << EOF
export XIM_PROGRAM=hime
export XIM=hime
export GTK\_IM\_MODULE=hime
export QT\_IM\_MODULE=hime
export XMODIFIERS=@im=hime
hime &
EOF
```

\
最後重新登入，在畫面的右上角就可以看到熟悉的 Hime 圖示了！

![](https://image.wadeism.net/manjaro_hime01.png)


## 安裝完成也重開機了，但什麼都沒有…

如果沒看到的話，可能是桌面環境不是跑傳統的 X11，而是使用 wayland，這時可以用下面兩個指令來檢查

```bash
echo $XDG_SESSION_TYPE
```

```bash
# 執行結果

wayland
```

```bash
loginctl show-session $(loginctl | grep $(whoami) | awk '{print $1}') -p Type
```

```bash
# 執行結果

Type=wayland
```

\
檢查後如果的確使用 wayland 模式，這時候請登出，然後在登入時點選右下角的小齒輪圖示（齒輪會在點選使用者後出現），選擇 <span class="hl-blue">GNOME 採行 Xorg</span> 就可以用 X11 模式登入，登入後就能看到 Hime 圖示的出現。

![](https://image.wadeism.net/manjaro_hime02.png)

如果想直接關掉 wayland 的話，可以編輯 <span class="hl-blue">/etc/gdm/custom.conf</span> 這個檔案，把 WaylandEnable=true 改成 <span class="hl-blue">WaylandEnable=false</span>。

* * *

參考資料：

[在 Arch Linux 安裝 Hime](https://www.willychen.org/165/install-hime-on-arch-linux/)
