---
author: wade
date: 2018-10-01 10:19:45+00:00
draft: false
title: 使用 mp3fs 自動將 flac 檔轉為 mp3
type: post
url: /post/auto-transfer-flac-to-mp3/
image: "https://image.wadeism.net/mp3fs.png"
categories:
- Linux
tags:
- Ubuntu
---

[mp3fs](https://khenriks.github.io/mp3fs/) 是個相當特別的軟體，它主要的功能是將 flac 轉換為 mp3，因為使用了 fuse 檔案系統，所以可以做到大量檔案的處理。

舉例來說，我有一個名為 Music 的資料夾裡有 100 個 flac 的音樂檔，在一般的情形下，我們都是用轉檔軟體來處理，但使用 mp3fs 的話就是完全不同的做法，變成我們將 Music 這個資料夾利用 mp3fs 掛載到一個我們指定的資料夾中，掛載完後我們就會直接在指定資料夾中看到轉好的 mp3 檔了。

當初是為了 iPod 才發現這個東西，不過我現在其實也沒在用這個功能…就寫給可能用得到的朋友吧！

<span class="hl-blue">系統環境：Ubuntu 18.04</span>

\
安裝 mp3fs
    
```bash
sudo apt install mp3fs
```

\
檢視目前 Home 目錄底下的 Music 資料夾內容
    
```bash
ls -lh ~/Music
```
    
```bash
# 執行結果：

總計 1.2G
-rw-rw-r-- 1 User User 136M  'Suchmos - A.G.I.T..flac'
-rw-rw-r-- 1 User User 119M  'Suchmos - ARE WE ALONE.flac'
-rw-rw-r-- 1 User User 102M  'Suchmos - BODY.flac'
-rw-rw-r-- 1 User User  74M  'Suchmos - DUMBO.flac'
-rw-rw-r-- 1 User User  76M  'Suchmos - INTERLUDE S.G.S.4.flac'
-rw-rw-r-- 1 User User  97M  'Suchmos - MINT.flac'
-rw-rw-r-- 1 User User 109M  'Suchmos - PINKVIBES.flac'
-rw-rw-r-- 1 User User 116M  'Suchmos - SEAWEED.flac'
-rw-rw-r-- 1 User User 101M  'Suchmos - SNOOZE.flac'
-rw-rw-r-- 1 User User 114M  'Suchmos - STAY TUNE.flac'
-rw-rw-r-- 1 User User 117M  'Suchmos - TOBACCO.flac'
```

\
建立存放 mp3 檔的資料夾
    
```bash
mkdir ~/mp3_output
```

\
將 Music 利用 mp3fs 掛載到 mp3_output 資料夾，並且使用 320k 的轉碼率
    
```bash
mp3fs ~/Music -b 320 ~/mp3_output
```

\
檢視 mp3_output 資料夾
    
```bash
ls -lh ~/mp3_output
```
    
```bash
# 執行結果：

總計 125M
-rw-rw-r-- 1 User User  14M  'Suchmos - A.G.I.T..mp3'
-rw-rw-r-- 1 User User  14M  'Suchmos - ARE WE ALONE.mp3'
-rw-rw-r-- 1 User User  11M  'Suchmos - BODY.mp3'
-rw-rw-r-- 1 User User 7.7M  'Suchmos - DUMBO.mp3'
-rw-rw-r-- 1 User User 9.1M  'Suchmos - INTERLUDE S.G.S.4.mp3'
-rw-rw-r-- 1 User User  11M  'Suchmos - MINT.mp3'
-rw-rw-r-- 1 User User  12M  'Suchmos - PINKVIBES.mp3'
-rw-rw-r-- 1 User User  13M  'Suchmos - SEAWEED.mp3'
-rw-rw-r-- 1 User User  12M  'Suchmos - SNOOZE.mp3'
-rw-rw-r-- 1 User User  12M  'Suchmos - STAY TUNE.mp3'
-rw-rw-r-- 1 User User  14M  'Suchmos - TOBACCO.mp3'
```

\
從上面的步驟可以看到我們已經把 Music 利用 mp3fs 掛載到 mp3_output 資料夾了，因此在檢視該資料夾時，裡面全部都是 mp3 檔，<span class="hl-red">其實這個時候 flac 檔還沒有真正的轉成 mp3 檔，而是當我們對裡面的 mp3 進行播放或複製、編輯的時候，編碼器才會在後面即時的轉檔</span>。

\
最後如果我們不想玩了，卸載的方法也很簡單
    
```bash
sudo fusermount -u ~/mp3_output
```
