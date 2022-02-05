---
author: wade
date: 2018-06-23 16:19:57+00:00
draft: false
title: 改變 SKYPE Linux 版的字體大小
type: post
url: /post/linux-change-skype-font-size/
image: "https://image.wadeism.net/skype01.png"
categories:
- Linux
tags:
- Ubuntu
---

將下面的參數加到 {{< blue >}}~/.config/Trolltech.conf{{< /blue >}} 中，即可修改 Skype 的字體與字體大小

```toml
[Qt]
    font="Droid Sans Fallback,20,-1,5,50,0,0,0,0,0"
```

當中的數值 20 也可以改成 16，可依自己的環境與喜好變更

接著將 Clearlooks theme 設定為 Skype 的主題然後重新啟動 Skype

\
不過現在 Linux 上已經有了新版的 Skype，走的好像是網頁 app 的方式，因此本篇的教學設定應該已不適用於最新版的 Skype for Linux …
