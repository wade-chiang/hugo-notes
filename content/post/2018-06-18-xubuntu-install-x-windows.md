---
author: wade
date: 2018-06-18 05:29:02+00:00
draft: false
title: Xubuntu 15.04 minimal 安裝 X Window
type: post
url: /post/xubuntu-install-x-windows/
categories:
- Linux
tags:
- Ubuntu
- xfce
---

記錄以前使用 xubuntu 15.04 的 gui 安裝步驟，使用 minimal 版的原因只是覺得預設的東西比較少，但現在看來其實沒有特別的必要…

\
安裝 X Window 的主程式

```bash
sudo apt-get install xorg
```

\
安裝音效控制介面
    
```bash
sudo apt-get install alsa-utils
```

\
重開機
    
```bash
sudo systemctl reboot
```

\
安裝xfce
    
```bash
sudo apt-get install xfce4
```

\
安裝登入介面(之後可選 theme )
    
```bash
sudo apt-get install slim
```

\
重開機
    
```bash
sudo systemctl reboot
```

\
安裝 synaptic package manager
    
```bash
sudo apt-get install synaptic
```
