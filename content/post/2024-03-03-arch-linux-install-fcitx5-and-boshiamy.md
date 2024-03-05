---
title: Arch Linux Gnome 安裝 fcitx5 與嘸蝦米輸入法
date: 2024-03-03T01:20:17+08:00
type: post
draft: false
url: /post/2024-03-03-arch-linux-install-fcitx5-and-boshiamy
image: "https://image.wadeism.net/fcitx5-boshiamy-07.webp"
categories:
- Linux
tags:
- ArchLinux
---

Hime 一直是我覺得 Linux 裡最順手的中文輸入法，可惜它目前不相容 Wayland，但雙螢幕的一些使用情境上實在無法使用 X11，因此只好改用 fcitx5，以下就來說明一下我的安裝過程：

## 環境說明

系統：Arch Linux

桌面環境：GNOME Shell 45.4

顯示協定：Wayland


## 安裝 fcitx5 與嘸蝦米輸入法

```sh
sudo pacman -Sy fcitx5-im fcitx5-table-extra
```

安裝時會問你需不需要裝以下的套件

```sh
1) fcitx5  2) fcitx5-configtool  3) fcitx5-gtk  4) fcitx5-qt
```

選擇 default=all 即可，接下來的選項可依自已的系統或喜好來選項


## 設定環境變數

以下是我測試蠻多設定後覺得比較穩定的參數，在 telegram、與一些 QT base 的程式中都可正常使用，不過要特別注意我是使用 wayland，而且大多數的程式都有盡量改成跑 native wayland，使用 X11 的朋友在後兩個選項可能要再修改。

```sh
echo "export INPUT_METHOD=fcitx5
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS=@im=fcitx5
export MOZ_ENABLE_WAYLAND=1
export QT_QPA_PLATFORM=wayland" | sudo tee /etc/environment
```

設定完後重開機

```sh
sudo reboot
```


## 設定 fcitx5 與新增嘸蝦米輸入法

fcitx5 預設是只有英文的，因此要先把嘸蝦米加進去，首先點選 fcitx5 Configuration。

![](https://image.wadeism.net/fcitx5-boshiamy-01.webp)

在 <span class="hl-blue">Input Medhod</span> tab 的右邊搜尋 <span class="hl-blue">boshiamy</span> 即可找到嘸蝦米輸入法，接著選擇它並點選左箭頭按鈕將它加入 <span class="hl-blue">Current Input Method</span>，最後按下 Apply 即可，其它的選項我都沒有去動，有興趣的人可自行研究，但基本上這樣就夠用了。

![](https://image.wadeism.net/fcitx5-boshiamy-02.webp)

![](https://image.wadeism.net/fcitx5-boshiamy-03.webp)


## 安裝 Input Method Panel

Input Method Panel 是使用 KDE's kimpanel protocol 做成的 Gnome extension，可以讓輸入法在桌面 panel 的外觀更好看，下面介紹一下它比較簡單的裝法：

### 安裝 gnome-browser-connector

Gnome extension 有個很特別且好用的安裝方式，只要先裝上這個 browser-connector 的瀏覽器外掛之後，就可以在 Gnome Extension 的網頁中直接安裝與開啟、關閉外掛

```sh
sudo pacman -Sy gnome-browser-connector
```

接著在 Extension 的頁面中，會引導你去安裝瀏覽器上相關的擴充套件

![](https://image.wadeism.net/fcitx5-boshiamy-04.webp)

安裝完成後，重新回到 Input Method Panel 的頁面中，就會顯示啟用的按鈕了，這裡切換到 On 即可開啟該外掛。

![](https://image.wadeism.net/fcitx5-boshiamy-05.webp)

完成後，我們按下預設的輸入法切換鍵：<span class="hl-blue">Ctrl + Space</span> 就可以快樂的使用嘸蝦米打中文啦！注意右上角的「嘸」這個就是 Input Method Panel 的顯示效果，毫無違和對吧！

![](https://image.wadeism.net/fcitx5-boshiamy-06.webp)

![](https://image.wadeism.net/fcitx5-boshiamy-07.webp)