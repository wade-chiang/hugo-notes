---
author: wade
date: 2020-09-14 03:03:43+00:00
draft: false
title: Ubuntu 解決老遊戲沒有音樂的問題
type: post
url: /post/ubuntu-old-game-sound-setup/
image: "https://image.wadeism.net/ogsound00.png"
categories:
- Linux
tags:
- Old Game
- Sound
- Ubuntu
- Vintage
- Wine
---

早期的電腦遊戲，音樂部分通常是 CD 音軌或是 MIDI 音效檔。在我的經驗裡使用 CD 音軌或是 DOS 的遊戲在音效方面都不會有什麼問題，因為 CD 音軌相對單純，而 DOS 遊戲用 [DOSBox](https://www.dosbox.com/) 就可以完全模擬，無痛的玩那些 DOS Game。

不過如果 Windows 的老遊戲沒有用 CD 音軌而是用 MIDI 音效，在 Ubuntu 用 Wine 玩的時候就會沒有音樂，玩起來很沒 fu，下面就來講一下怎樣用 Ubuntu 玩老遊戲並且正常聽到音樂。

下面以我自己的使用環境 Ubuntu 18.04 為例


## 檢查音效的 output 狀態

```bash
aconnect -o
```

```bash
# 執行結果：

client 14: 'Midi Through' [type=內核]
    0 'Midi Through Port-0'
```

{{< blue >}}aconnect -o{{< /blue >}} 可以查看目前 ALSA 音訊的 output 狀態，這邊只是先看一次狀態，之後設定完再來做比較。


## 測試遊戲音樂

用 Wine 開啟這次要測試的遊戲「大富翁 4」

{{< youtube id="yi9gs36cCMA?start=24" autoplay="false" >}}

可以聽到滑鼠的音效與人物的聲音，但少了最重要的背景音樂


## 安裝與使用 TiMidity

安裝 TiMidity，它是一套可以將 MIDI 轉換成 WAVE 並且播放的程式

```bash
sudo apt install timidity
```
接著執行 timidity 進行 MIDI 轉換與音訊 output 設定

```bash
timidity -iA -Os
```

* {{< green >}}{{< mono >}}-iA{{< /green >}}{{< /mono >}}：以 ALSA sequencer client 的方式啟動 timidity
* {{< green >}}{{< mono >}}-Os{{< /green >}}{{< /mono >}}：將音訊輸出到 ALSA

通常 Ubuntu 裡預設是用 ALSA 處理音訊，如果改用 JACK 或 PortAudio 的話就去 timidity 的 man page 查一下相應的參數

\
再次檢查音效的 output 狀態

```bash
aconnect -o
```

```bash
# 執行結果：

client 14: 'Midi Through' [type=內核]
    0 'Midi Through Port-0'
client 128: 'TiMidity' [type=用戶,pid=5449]
    0 'TiMidity port 0 '
    1 'TiMidity port 1 '
    2 'TiMidity port 2 '
    3 'TiMidity port 3 '
```

可以看到多了 TiMidity 的設定


## 再次測試遊戲音樂

重新開啟我們的大富翁 4

{{< youtube id="yi9gs36cCMA?start=152" autoplay="false" >}}

懷念的音樂都回來啦！


## 關閉 TiMidity

TiMidity 開啟後就會常駐在背景執行，不用的時候可以把它關掉。

剛才開啟 TiMidity 時有一組 pid 5449，直接把它 kill 掉就可以了，如果不確定的話，也可以先用 ps 查一下

```bash
ps aux | grep timidity
wade        5449  0.0  0.3 370400 15764 pts/2    Sl+  17:34   0:00 timidity -iA -Os
wade        3707  0.0  0.0  17688   724 pts/1    S+   17:40   0:00 grep --color=auto timidity
```

```bash
kill 5449
```

* * *

完整 Youtube 影片

{{< youtube id="yi9gs36cCMA" >}}

參考資料：

[Wine: MIDI sounds for Age of Empires](https://cweiske.de/tagebuch/wine-midi-age-of-empires.htm)
