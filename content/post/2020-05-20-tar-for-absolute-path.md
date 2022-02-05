---
author: wade
date: 2020-05-20 06:50:47+00:00
draft: false
title: 使用 tar 以絕對路徑壓縮資料夾並去除完整路徑
type: post
url: /post/tar-for-absolute-path/
categories:
- Linux
---

在 Linux 中經常使用 tar 來壓縮資料夾，不過 tar 有個蠻討厭又貼心的地方，就是它在使用絕對路徑來壓縮資料夾時，會將資料夾的完整路徑給一起打包進來，這邊以我的家目錄 /home/user 為例：

先看一下 /home/user  裡的完整內容與裡面的結構
    
```bash
ls -R /home/user/
```
    
```bash 
# 執行結果：
    
/home/user/:
fileA.txt  fileB.wav  Music  Photo  Video

/home/user/Music:
'Miles Davis - So What.flac'

/home/user/Photo:
Aoi.jpg

/home/user/Video:
Vintage_Jazz_Bass.mp4
```

我的 home 目錄中有兩個檔案 fileA、fileB 與三個資料夾分別為 Music、Photo、Video，資料夾中也都有檔案

\
使用 tar 來壓縮資料夾 /home/user，檔名取作 home.tgz 並且存在 /tmp
    
```bash
tar -zcvf /tmp/home.tgz /home/user/
```
    
```bash
# 執行結果：

tar: Removing leading `/' from member names
/home/user/
/home/user/fileA.txt
/home/user/fileB.wav
/home/user/Music/
/home/user/Music/Miles Davis - So What.flac
/home/user/Photo/
/home/user/Photo/Aoi.jpg
/home/user/Video/
/home/user/Video/Vinteage_Jazz_Bass.mp4
```

\
接著 tar 使用 -t 參數來查看剛才做好的壓縮檔內容
    
```bash
tar -ztvf /tmp/home.tgz
```
    
```bash
# 執行結果：

drwxr-xr-x wade/wade         0 2020-05-21 11:22 home/user/
-rw-rw-r-- wade/wade         0 2020-05-21 09:20 home/user/fileA.txt
-rw-rw-r-- wade/wade         0 2020-05-21 09:20 home/user/fileB.wav
drwxrwxr-x wade/wade         0 2020-05-21 09:21 home/user/Music/
-rw-rw-r-- wade/wade         0 2020-05-21 09:21 home/user/Music/Miles Davis- So What.flac
drwxrwxr-x wade/wade         0 2020-05-21 09:21 home/user/Photo/
-rw-rw-r-- wade/wade         0 2020-05-21 09:21 home/user/Photo/Aoi.jpg
drwxrwxr-x wade/wade         0 2020-05-21 09:22 home/user/Video/
-rw-rw-r-- wade/wade         0 2020-05-21 09:22 home/user/VideoVinteage_Jazz_Bass.mp4
```

從上面可以看到 home.tgz 裡面的檔案與資料夾前面都帶有完整路徑，因此如果在 /tmp 裡解壓縮之後，得到的檔案會是像 /tmp/home/user/fileA.txt 這樣一大串。

雖然這種做法很貼心，可以讓任何人都知道這個檔案所屬的位置，但如果這個資料夾的路徑很長很深的時候，為了完整路徑而建的一堆資料夾就會顯得非常累贅

很多時候我們只想單純的壓縮某個資料夾，不想要它的完整路徑，以上面的例子來說，通常我們只想要「user」與裡面的東西，而不需要上層的「/home」，這時候就要用到 tar 的 {{< green >}}-C{{< /green >}} 參數，-C 參數用途為在執行操作時，先切換到指定的路徑。下面介紹兩種不同的做法


## 壓縮資料夾且不含資料夾本身

切換到 /home/user/ 目錄，並將裡面所有東西壓縮到 /tmp/home.tgz 裡面
    
```bash
tar -zcvf /tmp/home.tgz -c /home/user/ .
```

\
接著在 /tmp 裡解開這個檔案
    
```bash
tar -zxvf /tmp/home.tgz
```

\
解壓後 home.tgz 裡面的檔案會全部放在 /tmp 下面
    
```bash
$ ls /tmp
```
    
```bash
# 執行結果：

fileA.txt
fileB.wav
home
home.tgz
Music
Photo
systemd-private-c03584-nginx.service-iQ3u6U
Video
```

\
另外我們也可以選擇不要壓縮 /home/user 裡的所有東西，只挑幾個檔案或資料夾來壓縮
    
```bash
tar -zcvf /tmp/home.tgz -C /home/ user/fileA.txt user/Music user/Video
```


## 壓縮資料夾中並包含資料夾本身

在前面的範例中，會看到我們在 /tmp 底下將 home.tgz 解壓後，原本 user 裡的檔案全部都四散在 /tmp 裡面，但原本 /tmp 裡已經有其它檔案了，因此也顯得零亂。

大部分的情況是我們比較希望壓縮後也保持原本的單層資料夾結構，例如壓縮檔 home.tgz 解開後會是一個名為 user 的資料夾，裡面包含所有的檔案，這時指令就要改個路徑，範例如下：

切換到 /home 目錄中，並將裡面的 user 資料夾打包壓縮到 /tmp，壓縮檔的檔名為 home.tgz

```bash
tar -zcvf /tmp/home.tgz -C /home user
```

\
接著在 /tmp 裡解開這個檔案

```bash
tar zxvf home.tgz
```
    
```bash
# 執行結果：

user/
user/fileA.txt
user/fileB.wav
user/Music/
user/Music/Miles Davis - So What.flac
user/Photo/
user/Photo/Aoi.jpg
user/Video/
user/Video/Vinteage_Jazz_Bass.mp4
```

\
再次檢查 /tmp 的內容
    
```bash
ls /tmp
```
    
```bash
# 執行結果：

home.tgz
systemd-private-6c6dd52da74c43efbee7c931f4c03584-nginx.service-iQ3u6U
user
vmware-root_830-2999133150
vmware-root_832-2730693535
```

可以看到解開後得到  user 的資料夾，而不是將裡面檔案直接解到 /tmp 中
