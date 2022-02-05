---
author: wade
date: 2020-12-31 07:59:14+00:00
draft: false
title: 自架音樂串流 Server  - mStream
type: post
url: /post/create-music-stream-server-mstream/
image: "https://image.wadeism.net/mStream00.jpg"
categories:
- Linux
tags:
- CentOS
- CentOS 8
- Docker
- Music
- Server
---

自從出來租屋後，聽音樂成了一大問題。畢竟筆電容量有限，不可能把上萬首的音樂都丟進來，而且如果又複製一份的話，變成有三地要做檔案同步，非常的麻煩。

起初是打算使用 VPN 掛載 NFS，用 Mac 上的 Music Player 來播遠端的檔案，不過 NFS 的外網速度實在差強人意，連音樂檔的 index 都跑不完全，所以就放棄這招了（也許之後可以用 SAMBA 再試一次）。

後來我想到了自架串流 server 的方式，不過串流 server 一些比較細部的功能可能就不會有了。我除了介面要看了順眼之外，最重要是需要{{< blue >}}短秒數前進與倒帶的功能{{< /blue >}}，這個在練琴時非常的實用。因此就以這兩個方向去找，總算找到了一個介面算好看，又有倒帶功能的 [mStream](https://www.mstream.io/)，雖然一次倒帶的單位是30秒，不過總比沒有好的多！


## 環境說明

{{< green >}}Server{{< /green >}}：192.168.199.180，CentOS 8 minimal with Docker installed


## 安裝與啟動 mStream

mStream 官方提供了 Linux、Windows、Mac 的版本，另外也有 [LinuxServer](https://www.linuxserver.io/)[.io](https://www.linuxserver.io/) 團隊維護的 [Docker 版](https://hub.docker.com/r/linuxserver/mstream)本，為求方便所以個人是使用 Docker 版，安裝方式如下：

### 使用 docker-compose（建議）

```bash
version: "2.1"
services:
mstream:
image: ghcr.io/linuxserver/mstream
container_name: mstream
environment:
- PUID=1000
- PGID=1000
- USER=admin
- PASSWORD=password
- USE_JSON=true/false
- TZ=Asia/Taipei
volumes:
- /pathToConfig:/config
- /pathToMusic:/music
ports:
- 3000:3000
restart: unless-stopped
```

將檔案存成 docker-mstream.yml 後，執行下面指令啟動 mstream server

```bash
docker-compose -f docker-mstream.yml up -d
```


### 使用 docker cli

```bash
docker run -d \
--name=mstream \
-e PUID=1000 \
-e PGID=1000 \
-e USER=admin \
-e PASSWORD=password \
-e USE_JSON=true/false \
-e TZ=Asia/Taipei \
-p 3000:3000 \
-v /pathToConfig:/config \
-v /pathToMusic:/music \
--restart unless-stopped \
ghcr.io/linuxserver/mstream
```

\
基本上兩種啟動方式的意思一樣，docker-compose 會比較好管理與修改，下面我用 cli 的選項來做說明

* {{< green >}}{{< mono >}}-e USER{{< /green >}}{{< /mono >}}：登入用的帳號
* {{< green >}}{{< mono >}}-e PASSWORD{{< /green >}}{{< /mono >}}：帳號的登入密碼
* {{< green >}}{{< mono >}}-e TZ{{< /green >}}{{< /mono >}}：Time Zone，在台灣的話就寫 Asia/Taipei
* {{< green >}}{{< mono >}}-p 3000:3000{{< /green >}}{{< /mono >}}：將 Server 上的 3000 port 與 container 裡的 3000 port 做綁定，可視需求調整 Server 上想開的 port
* {{< green >}}{{< mono >}}-v /pathToConfig:/config{{< /green >}}{{< /mono >}}：選一個 server 上的資料夾掛載到 container 裡的 {{< blue >}}/config{{< /blue >}} 上， 例如 {{< blue >}}/etc/opt/mstream{{< /blue >}}，{{< blue >}}/etc/opt{{< /blue >}} 是我習慣拿來統一放置 container 設定檔的地方。掛載後，裡面會存放 mstream 的設定檔與 db 資料
* {{< green >}}{{< mono >}}-v /pathToMusic:/music{{< /green >}}{{< /mono >}}：將 server 裡的存放音樂檔的資料夾掛載到 container 裡的 {{< blue >}}/music{{< /blue >}}

\
開啟防火牆

```bash
sudo firewall-cmd --add-port=3000/tcp --permanent && sudo firewall-cmd --reload
```


## 測試登入與使用

用瀏覽器前往 {{< blue >}}192.168.199.180:3000{{< /blue >}}，應該就可以看到登入畫面

![](https://image.wadeism.net/mStream01.png)

![](https://image.wadeism.net/mStream02.png)

不過要注意一點，{{< red >}}mStream 在 FireFox 會無法正常播放音樂，要改用其它瀏覽器{{< /red >}}


## 將 mStream 的 Artist tag 轉為 Album Artist tag

常用 Mp3Tag 來編輯音樂檔 tag 的朋友們應該都知道，音樂檔的 tag 有 {{< blue >}}Artist{{< /blue >}} 與 {{< blue >}}Album Artist{{< /blue >}} 兩種，一般是使用 Artist，不過碰到一些大合輯的時候就會出現個麻煩的問題，以 {{< green >}}[Who Loves You? A Tribute to Jaco Pastorius]{{< /green >}} 這張專輯為例：

![](https://image.wadeism.net/mStream03.png)

每一首歌的演奏者（Artist）都不同，有的還有多位樂手，這樣的音樂資訊，放到只支援 Artist tag 的播放器中，會無法好好的分類。因為太多樂手了，如果用 Artist 來分類會變得相當凌亂，像 mStream 目前也只有支援 Artist tag 的，自然也不意外

![](https://image.wadeism.net/mStream04.png)
{{< center >}}變成有一大堆的 Artists，非常亂！{{< /center >}}

但這張專輯實際上我會想把它歸到 Jaco 的作品（畢竟是為他致敬之作），同樣的情況在現代很多 feat. 的專輯上也會出現，也因此有了 Album Artist  tag 的誕生。

在前面的圖中可以看到除了 Artist 之外，我在 Album Artist 裡都填上了 [A Tribute to Jaco Pastorius]，這樣一來，只要以 Album Artist 來分類，這些歌就可以歸在同一個 Artist 底下了。

不過 Album Artist 這個 tag 通常這是比較專業的播放軟體如 foobar2000 才有支援，mStream 沒有支援對我來說是非常麻煩的一災難，所幸我的運氣不錯，在進入 container 後被我找到了可以將 artist 改成 album artist 的方法，下面就來示範如何更改

### make Artist tag turn into AlbumArtist tag in mStream server

首先進入 container 內部的 cli

```bash
docker exec -it mstream "/bin/bash"
```

```bash
# 執行結果：

root@d34e21dccb2b:/# 
```

\
接著編輯 {{< blue >}}/opt/mstream/modules/db-write/database-default-loki.js{{< /blue >}} 這個檔案

```bash
vi /opt/mstream/modules/db-write/database-default-loki.js
```

\
找到以下這段設定：

```js
fileCollection.insert({
    "title": song.title ? String(song.title) : null,
    "artist": song.artist ? String(song.artist) : null,
    "year": song.year ? song.year : null,
    "album": song.album ? String(song.album) : null,
    "filepath": song.filePath,
    "format": song.format,
    "track": song.track.no ? song.track.no : null,
    "disk": song.disk.no ? song.disk.no : null,
    "modified": song.modified,
    "hash": song.hash,
    "aaFile": song.aaFile ? song.aaFile : null,
    "vpath": vpath,
    "ts": Math.floor(Date.now() / 1000)
});
```

\
修改 "artist": song.artist ? String(song.artist) : null, 這段如下

```js
fileCollection.insert({
    "title": song.title ? String(song.title) : null,
    "artist": song.albumartist ? String(song.albumartist) : null,
    "year": song.year ? song.year : null,
    "album": song.album ? String(song.album) : null,
    "filepath": song.filePath,
    "format": song.format,
    "track": song.track.no ? song.track.no : null,
    "disk": song.disk.no ? song.disk.no : null,
    "modified": song.modified,
    "hash": song.hash,
    "aaFile": song.aaFile ? song.aaFile : null,
    "vpath": vpath,
    "ts": Math.floor(Date.now() / 1000)
});
```

{{< red >}}主要就是把 artist 字串直接改成  albumartist 字串{{< /red >}}

\
存檔後離開 container，回到 server 並移除 mStream 的 db

```bash
sudo rm /etc/opt/mstream/db/files.loki-v2.db

# /etc/opt/mstream 的路徑部分請依自己掛載的目錄做修改
```

\
最後重啟 mStream，待 db rebuild 後，就可以看到 artist 的分類不再凌亂，變成 album artist 了

```bash
docker container restart mstream
```

![](https://image.wadeism.net/mStream05.png)

可以回頭看一下[修改前](https://image.wadeism.net/mStream04.png)的樣子，是不是差很多呀！
