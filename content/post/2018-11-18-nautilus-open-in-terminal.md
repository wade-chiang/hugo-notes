---
author: wade
date: 2018-11-18 14:35:08+00:00
draft: false
title: 為 Nautilus 新增「以終端機開啟」熱鍵
type: post
url: /post/nautilus-open-in-terminal/
image: "https://image.wadeism.net/nautilus01.png"
categories:
- Linux
tags:
- Ubuntu
---

使用檔案管理軟體時，很常會使用到「以終端機開啟(當前目錄)」這個功能，基本上多數的 file manager 也都有這個功能，像 PCManFM 就是按右鍵或是直接按 F4。Ubuntu 內建的 Nautilus 雖然也可以在滑鼠右鍵選單中找到，但並沒有使用鍵盤熱鍵開啟的方式，因此在網路上找瞭解決的方法，方法如下：

<span class="hl-red">本例適用於 Ubuntu 18.04、Ubuntu 20.04、Ubuntu 21.10、GNOME nautilus 45.2.1 on Arch Linux(2023/12)，但可能不適用於每一種 Nautilus 版本</span>

在 <span class="hl-blue">~/.local/share/nautilus/scripts</span> 新增 script 檔，檔名為：Terminal（不可有副檔名）

script檔內容：

```bash
#! /bin/sh
gnome-terminal
```

\
給予 terminal 檔執行的權限
    
```bash
chmod +x ~/.local/share/nautilus/scripts/Terminal
```

\
編輯或新增 <span class="hl-blue">~/.config/nautilus/scripts-accels</span>，並插入下面的內容
    
```vim
F4 Terminal
 
; Commented lines must have a space after the semicolon
; Examples of other key combinations:
; <Control>F12 Terminal
; <Alt>F12 Terminal
; <Shift>F12 Terminal
```

\
關閉 nautilus
    
```bash
nautilus -q
```

\
再重啟 nautilus 之後，就可以使用按鍵 F4 來使用 open in terminal 的功能了


* * *


參考資料：

[https://askubuntu.com/questions/68078/keyboard-shortcut-for-open-a-terminal-here](https://askubuntu.com/questions/68078/keyboard-shortcut-for-open-a-terminal-here)
