---
author: wade
date: 2018-06-18 09:02:58+00:00
draft: false
title: Ubuntu 安裝 hime 輸入法、嘸蝦米
type: post
url: /post/ubuntu-install-hime-boshiamy/
image: "https://image.wadeism.net/hime07.png"
categories:
- Linux
tags:
- Ubuntu
---

在試過 scim、fcitx 與 hime 之後，覺得 hime 配上嘸蝦米還是最順手的組合，稍微紀錄一下安裝的方法，之後如果重灌時有保留 {{< blue >}}~/.confg/hime{{< /blue >}} 資料夾的話基本上是不用重新設定的，只要安裝輸入法與選擇 hime 為預設輸入法即可。

\
安裝 hime 輸入法
    
```bash
sudo apt-get install hime
```

\
執行{{< blue >}}語言支援{{< /blue >}}，設定 hime 為預設輸入法  
（找不到的話可在 terminal 中執行 {{< blue >}}gnome-language-selector{{< /blue >}}）

![](https://image.wadeism.net/hime08.png)

\
![](https://image.wadeism.net/hime01.png)

\
官網下載 嘸蝦米表格檔

![](https://image.wadeism.net/hime02.png#center)

\
解壓縮 boshiamy-gcin.tar.gz 並將 boshiamy-t.gtab 改名為 noseeing.gtab
    
```bash
cd [下載目錄]  && tar zxvf boshiamy-gcin.tar.gz
```
    
```bash
cd boshiamy-gcin/
```
    
```bash
mv boshiamy-t.gtab noseeing.gtab
```
    
```bash
mv boshiamy-t.png noseeing.png
```

\
啟動 hime 輸入法 (要先登出再登入)

\
將表格檔置入 hime 中（也可以用檔案管理員剪下貼上，但要先開啟顯示隱藏檔的功能）
    
```bash
mv noseeing.gtab /home/$USER/.config/hime/
```
    
```bash
mv noseeing.png /home/$USER/.config/hime/
```

\
在工具列上會看到 hime 的圖示，在圖示上按右鍵然後開始設定輸入法，工具列沒有的話，也可以在程式列表裡面找到「hime 輸入法設定」

![](https://image.wadeism.net/hime03.png)

在「開啟/關閉/預設輸入法」中，將不用的輸入法取消，僅保留嘸蝦米，「輸入視窗 (開啟/關閉) 切換」選擇 Control-Space，會比較像傳統 windows 的用法

![](https://image.wadeism.net/hime04.png#center)

\
外觀設定與輸入法設定（嘸蝦米的設定位置是放在倉頡、大易這邊）依自己的喜好設定就可以了，裡面也有同音字查詢的功能！

![](https://image.wadeism.net/hime05.png#center)

![](https://image.wadeism.net/hime06.png#center)
