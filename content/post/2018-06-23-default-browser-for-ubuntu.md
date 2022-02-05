---
author: wade
date: 2018-06-23 20:00:45+00:00
draft: false
title: 解決 Ubuntu 無法設定預設瀏覽器
type: post
url: /post/default-browser-for-ubuntu/
image: "https://image.wadeism.net/xubuntu01.png"
categories:
- Linux
tags:
- Ubuntu
- xubuntu
---

一般的情況下以 Xubuntu 15.04 為例，要改變預設的瀏覽器只要前往

Settings → Prefferd Applications 即可設定

![](https://image.wadeism.net/xubuntu01.png#center)
{{< center >}}雖然圖中顯示 Chromium，但實際上應該是 Vivaldi{{< /center >}}

\
但即使做了上面的設定，我的 Xubuntu 預設瀏覽器仍然是 Firefox，而非我設定的 Vivaldi。這時候必須做用下面的指令來做設定：
    
```bash
sudo update-alternatives --config x-www-browser
```
    
```bash
# 執行結果：

There are 3 choices for the alternative x-www-browser (providing /usr/bin/x-www-browser).
    
      Selection    Path                           Priority   Status
    ------------------------------------------------------------
    * 0            /usr/bin/vivaldi-stable         200       auto mode
      1            /usr/bin/firefox                40        manual mode
      2            /usr/bin/google-chrome-stable   200       manual mode
      3            /usr/bin/vivaldi-stable         200       manual modeXubuntu 15.04
```

\
這時候再以數字選擇想要的預設瀏覽器即可（本例為選擇 Vivaldi 的編號0）

\
update-alternatives 這個指令，主要是用來管理套件的版本 ，在 debian 系的 Linux 似乎都有這個指令，之後有機會可以再多研究一下…
