---
author: wade
date: 2018-06-25 20:26:09+00:00
draft: false
title: Ubuntu 安裝 GIMP 中文化
type: post
url: /post/ubuntu-install-gimp-chinese/
image: "https://image.wadeism.net/gimp01.png"
categories:
- Linux
tags:
- App
---

如果一開始 Linux 使用英文介面的話，之後安裝 GIMP 時可能也不會有中文可用，這時候就要手動安裝 GIMP 的中文套件

安裝前先把 GIMP 關閉，然後執行下面指令
    
```bash
sudo apt-get install language-pack-gnome-zh-hant
```

安裝後重新啟動 GIMP，如果還沒出現中文就重新開機看看。

* * *
備註

* language-pack-gnome-zh 已由 language-pack-gnome-zh-hant 取代。
* 安裝 language-pack-gnome-zh-hant 會同時安裝其相依套件 language-pack-gnome-zh-hant-base。
* Gimp 的中文語言包在 language-pack-gnome-zh-hant-base 套件包，安裝後會在下面的路徑
```bash
/usr/share/locale-langpack/zh_TW/LC_MESSAGES/gimp20-libgimp.mo
/usr/share/locale-langpack/zh_TW/LC_MESSAGES/gimp20-script-fu.mo
/usr/share/locale-langpack/zh_TW/LC_MESSAGES/gimp20-std-plug-ins.mo
/usr/share/locale-langpack/zh_TW/LC_MESSAGES/gimp20.mo
```
