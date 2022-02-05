---
author: wade
date: 2018-06-24 03:16:16+00:00
draft: false
title: 設定 SMPlayer 的滑鼠滾輪音量控制
type: post
url: /post/smplayer-wheel-volume-control/
categories:
- Linux
tags:
- media
---

之前 SMPlayer 一直是我在 Linux 上最主要的影片播放軟體，因為它跟以前愛用的 medial player classic 最相近，以往我的習慣是將滑鼠滾輪設成用來調整音量，不過 SMPlayer 有個討人厭的小地方，那就是用滑鼠滾輪調音量的時候，一次好像就是 +4 還是 +5，對我來說有點太多，雖然可以比較快速調到想要的音量，但也比較難微調。

雖然 SMPlayer 的一般選項裡沒有調整這個音量控制的選項，不過其實可以透過修改它的設定檔來達成我要的功能。

\
首先，使用文字編輯器開啟 SMPlayer 的設定檔（這裡以 vim 為例，你也可以用 gedit 或 mousepad 或 pluma 之類的 gui 的文字編輯器）
    
```bash
vim ~/.config/smplayer/smplayer.ini
```

在 [%General]  的標籤底下的任意位置新增選項 min_step
    
```toml
[%General]
    min_step=2
```

這裡設定 min_step=2，表示滑鼠滾輪往上或往下一格就是音量 +2 或 -2，可以隨自己的習慣來設定 step。
