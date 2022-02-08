---
author: wade
date: 2020-09-09 16:12:51+00:00
draft: false
title: VLC Player 用滑鼠點擊影片控制暫停/播放
type: post
url: /post/vlcplayer-play-pause-by-click-video/
categories:
- Linux
tags:
- media
- Ubuntu
- VLC
---

早期 Media Player Classic 或現在的 MPV，用滑鼠在影片上面點一下就可以暫停 or 播放，是個很常見又實用的功能，但在 Linux 最常見的 VLC Player 裡這個功能必須安裝外掛才會有，下面就來介紹如何安裝與設定 VLC Player 的 click pause 外掛。

本篇文章將以 Ubuntu 20.04.1 為範例，如果是 Windows 或 Mac 的使用者，在[官網](https://github.com/nurupo/vlc-pause-click-plugin)也有詳細的說明（snap 版的 VLC 暫時還無法使用）


## 下載外掛原始碼：

外掛的名稱為 [vlc-pause-click-plugin](https://github.com/nurupo/vlc-pause-click-plugin)，是由 nurupo 在 GitHub 維護的專案

GitHub 下載連結：  
[https://github.com/nurupo/vlc-pause-click-plugin/archive/master.zip](https://github.com/nurupo/vlc-pause-click-plugin/archive/master.zip)


## 安裝 vlc-pause-click-plugin

安裝相依性套件

```bash
sudo apt-get install build-essential pkg-config libvlccore-dev libvlc-dev
```

\
解壓縮 zip 檔

```bash
unzip vlc-pause-click-plugin-master.zip && cd vlc-pause-click-plugin-master
```

\
編譯並安裝 plugin

```bash
make
```

```bash
sudo make install
```


## 設定 vlc-pause-click-plugin

先重啟 VLC Player ，接著在主畫面中選擇「<span class="hl-blue">工具</span>」→「<span class="hl-blue">偏好設定</span>」，然後下面的「<span class="hl-blue">顯示設定</span>」點選「<span class="hl-blue">全部</span>」

![](https://image.wadeism.net/vlc01.png)

在進階偏好設定裡選擇「<span class="hl-blue">介面</span>」→「<span class="hl-blue">控制介面</span>」，將右邊的 <span class="hl-green">Pause/Play video on mouse click</span> 打勾

![](https://image.wadeism.net/vlc02.png)

選擇「<span class="hl-blue">視訊</span>」→「<span class="hl-blue">過濾器</span>」，將右邊的 <span class="hl-green">Pause/Play video on mouse click</span> 打勾

![](https://image.wadeism.net/vlc03.png)

接著重啟 VLC Player 設定就完成了，試著播放一部影片然後在影片上按一下滑鼠左鍵確認是否可以暫停/播放

\
有關這個外掛的自定義設定（如左鍵改右鍵）可以在「<span class="hl-blue">視訊</span>」→「<span class="hl-blue">過濾器</span>」→「<span class="hl-blue">Pause click</span>」裡面調整

![](https://image.wadeism.net/vlc04.png)
