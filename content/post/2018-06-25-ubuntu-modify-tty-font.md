---
author: wade
date: 2018-06-25 04:28:53+00:00
draft: false
title: Ubuntu 設定 tty console 的字體
type: post
url: /post/ubuntu-modify-tty-font/
image: "https://image.wadeism.net/tty_font04.png"
categories:
- Linux
tags:
- Ubuntu
---

Linux 預設有 7 個 terminal，全名叫作「Teletypes」簡稱「tty」，只要按下 Ctrl + Alt + F1 - F7，就可以分別切換這 7 個 terminal，它與一般在 GUI 介面時開的虛擬 Terminal 不一樣，原生的 tty 在顯示上沒有 gui 下面來的美觀，無論顏色、字型…等，預設也無法顯示中文，大概就像我們以前 dos 時代的樣子差不多，但功能是一樣都沒有少。

![](https://image.wadeism.net/tty_font01.png#center)
<div style="text-align: center">tty 預設的 Terminus font</div>

在 tty 模式下，預設的字型是 Terminus，一種比較細瘦的字體，不過懷舊如我還是偏好以前 dos 的那種字型，雖然 Terminus 在多國語言的支援好像比較完整，不過在只看得懂英文的情況下，改掉它是沒什麼差的，所以下面就來說明怎樣把 tty 預設的字體改回傳統字型


編輯 /etc/default/grub 檔案
    
```bash
sudo vim /etc/default/grub
```

\
新增一行 <span class="hl-blue">GRUB_GFXMODE=1280x1024</span>（讓 tty 模式的解析度比較像傳統的樣子）
    
```ini
# The resolution used on graphical terminal
# note that you can use only modes which your graphic card supports via VBE
# you can see them in real GRUB with the command `vbeinfo'
#GRUB_GFXMODE=640x480
GRUB_GFXMODE=1280x1024
```

我們可以直接將原本就有的 GRUB_GFXMODE 註解拿掉並改成自己想要的解析度，也可以直接新增一行。解析度可依個人的螢幕與習慣來調整，1024x768或1280x1024 …等都可以試試看，<span class="hl-red">這個選項是修改解析度用的</span>，讓 tty mode 的解析度變成 4:3 字會大一些，比較復古，看起來也比較舒服，<span class="hl-red">不過在 Ubuntu 16.04 裡面，本項設定好像沒有作用，可能還要額外的設定</span>…

\
更新 grub
    
```bash
sudo update-grub
```

\
執行 console setup 程式
    
```bash
sudo dpkg-reconfigure console-setup
```

\
執行後會出現 console-setup 的 tui 介面，依序選擇下面的選項

![](https://image.wadeism.net/tty_font02.png)
選擇 UTF-8

![](https://image.wadeism.net/tty_font03.png)
選擇 Combined - Latin; Slavic Cyrillic; Greek

![](https://image.wadeism.net/tty_font04.png)
選擇 VGA，也可以依自己的喜歡選擇字型

![](https://image.wadeism.net/tty_font05.png)
選擇合適的字體大小，建議至少要 8x16 以上才不會太小

\
重開機
    
```bash
sudo shutdown -r now
```

\
重開後，再切換到隨便的 tty terminal，你會看到字體已成功變更

![](https://image.wadeism.net/tty_font06.png)
