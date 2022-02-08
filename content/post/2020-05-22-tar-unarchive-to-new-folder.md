---
author: wade
date: 2020-05-22 08:30:15+00:00
draft: false
title: 使用 tar 解壓縮到新增的資料夾
type: post
url: /post/tar-unarchive-to-new-folder/
categories:
- Linux
---

[前一篇文章](https://notes.wadeism.net/post/tar-for-absolute-path/)中的第一種做法，我們壓縮了資料夾 /home/user ，去掉它的完整路徑，但是在解壓後，user 裡面所有的東西都會被放在當前的目錄中，因此接著的第二種方法留下了 user 資料夾本身，讓解壓的目標資料夾比較乾淨。

其實在解壓縮的時候，我們可以自訂一層路徑，將檔案解到這個資料夾中，這樣即使我們使用第一種方法去掉了所有的完整路徑，在解壓完也不至於弄亂目標資料夾。

/opt/ 中有個 /home/user 的備份壓縮檔「home.tgz」

```bash
ls /opt
```
    
```bash
# 執行結果：
    
home.tgz
```

\
直接把 /opt/home.tgz 解到 /tmp，它裡面的東西會與 /tmp 裡原有的內容混在一起
    
```basj
tar -zxvf /opt/home.tgz -C /tmp
```
    
```bash
# 執行結果：

./
./fileA.txt
./fileB.wav
./Music/
./Music/Miles Davis - So What.flac
./Photo/
./Photo/Aoi.jpg
./Video/
./Video/Vinteage_Jazz_Bass.mp4
```

```bash
ls /tmp
```
    
```bash
# 執行結果：

fileA.txt
fileB.wav
Music
Photo
systemd-private-34874381fd65e7-nginx.service-yGAZ7
Video
vmware-root_830-2999133150
vmware-root_832-2730693535
```

\
<span class="hl-blue">使用 --one-top-level 參數解壓縮，會在目的地裡建一個資料夾，並將檔案全部放在該資料夾底下</span>

```bash
tar -zxvf /opt/home.tgz -C /tmp --one-top-level="homeBackup"
```
    
```bash
# 執行結果：

./
./fileA.txt
./fileB.wav
./Music/
./Music/Miles Davis - So What.flac
./Photo/
./Photo/Aoi.jpg
./Video/
./Video/Vinteage_Jazz_Bass.mp4
```

指令解釋：在 /tmp 中建一個叫 homeBackup 的資料夾，並將 /opt/home.tgz 裡的內容全部解到該資料夾中

\
再次查看 /tmp 的內容

```bash
ls /tmp
```
    
```bash
# 執行結果：

homeBackup
systemd-private-34874381fd65e7-nginx.service-yGAZ7
vmware-root_830-2999133150
vmware-root_832-2730693535
```
    
```bash
ls /tmp/homeBackup/
```
    
```bash
# 執行結果：
    
fileA.txt  fileB.wav  Music  Photo  Video
```

可以看到多了一個 homeBackup  資料夾，解壓完的檔案也都存在這裡了
