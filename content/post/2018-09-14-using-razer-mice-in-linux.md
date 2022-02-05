---
author: wade
date: 2018-09-14 03:40:32+00:00
draft: false
title: 在 Linux 使用 Razer 滑鼠
type: post
url: /post/using-razer-mice-in-linux/
image: "https://image.wadeism.net/qrazercfg.png"
categories:
- Linux
---

Razer 的滑鼠有許多如調 DPI、Frequency、發光模式與按鍵設定的功能，以往在 Windows 裡都是用它們自己出的 Synapse 來設定，但到了 Linux 上，這些功能就需要其它軟體來調整。

[Razer device configuration tool](https://bues.ch/cms/hacking/razercfg.html) 是由 Michael Büsch 所寫的一個開源驅動程式，可以依據不同型號的 Razer 滑鼠來設定上述的功能（主要是 Razer DA 系列），讓我們在 Linux 就不會浪費了它的屁孩燈。

一開始我們先到上面的網站查看 device support，如果你的滑鼠不在列表裡的話，就請跳過這個程式吧，確定有支援後就下載檔案，解壓後到資料夾中檢閱 readme 檔並依照 readme 裡的說明來安裝。

\
安裝編譯的必要程式
    
```bash
sudo apt-get install python3 libusb-1.0.0-dev python3-pyqt5 cmake
```

\
編譯與安裝
    
```bash
# 請記得先切換到剛下載的原始碼目錄中再執行下面的指令
cmake .
```
    
```bash
make
```
    
```bash
make install
```

\
設定開機時自動執行

Ubuntu 15.04 以後的版本，或使用 systemd 的 Linux，使用下面的指令

```bash
sudo systemctl enable razerd && sudo systemctl start razerd
```

\
如果是使用傳統 init.d 的Linux，請執行下面的指令

```bash
sudo cp ./razerd.initscript /etc/init.d/razerd
```
    
```bash
sudo ln -s /etc/init.d/razerd /etc/rc2.d/S99razerd
```

```bash
sudo ln -s /etc/init.d/razerd /etc/rc5.d/S99razerd
```

```bash
sudo ln -s /etc/init.d/razerd /etc/rc6.d/K01razerd
```
    
```bash
sudo ln -s /etc/init.d/razerd /etc/rc6.d/K01razerd
```

\
其它有關 /etc/razer.conf 的設定，可查閱 README.md ，裡面會有詳細的說明

不過因為 Razer 的滑鼠太容易連點，我買過的三隻不同版本的 DA 幾乎都一年多就得送修，加上它實在太屁太中二，所以目前已經改用 Zowie 的滑鼠了，手感佳、品質目前感覺也比 Razer 好很多，加上不用驅動程式（不少人對 Razer 的 Synapse 很有意見），算是個人蠻推薦的牌子。
