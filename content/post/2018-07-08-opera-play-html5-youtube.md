---
author: wade
date: 2018-07-08 17:13:02+00:00
draft: false
title: Opera play html5 in youtube
type: post
url: /post/opera-play-html5-youtube/
categories:
- Linux
tags:
- media
- Ubuntu
---

早期 Opera 瀏覽器在 Youtube 全面改用 html5 的時候，會有無法播放影片的問題，因此當時只能選用 flash player，雖然現在已經不用 Opera 了，而且這個問題大概也已經解決，不過還是留一下當時的解決辦法：


安裝 chromium-codecs-ffmpeg-extra
    
```bash
sudo apt install chromium-codecs-ffmpeg-extra
```

\
備份 /usr/lib/x86_64-linux-gnu/opera/lib/libffmpeg.so.3x
    
```bash
sudo mv /usr/lib/x86_64-linux-gnu/opera/lib/libffmpeg.so.3x \
    /usr/lib/x86_64-linux-gnu/opera/lib/libffmpeg.so.3x.bak
```

\
最後將 /usr/lib/chromium-browser/libs/libffmpeg.so 取代 /usr/lib/x86_64-linux-gnu/opera/lib/libffmpeg.so.3x

（檔名後的數字有可能不同，可以用 hard link，可先把原檔更名為 *.backup ）
