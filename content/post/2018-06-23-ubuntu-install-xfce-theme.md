---
author: wade
date: 2018-06-23 15:03:59+00:00
draft: false
title: Ubuntu 安裝 xfce 環境的佈景主題
type: post
url: /post/ubuntu-install-xfce-theme/
image: "https://image.wadeism.net/xfce01.png"
categories:
- Linux
tags:
- Ubuntu
- xfce
---

xfce 是我很喜歡的 desktop environment，既簡潔又美觀，它也提供了很多種不同的主題安裝，簡單的紀錄一下安裝的方法

建立放置 theme 的資料夾（如果已經存在的話就不用）
    
```bash
mkdir /home/$USER/.local/share/themes/
```

\
把下載來的主題解壓縮後放到上面的路徑 /home/$USER/.local/share/themes/ 裡面

{{< red >}}注意佈景主題的資料夾裡必須要有「xfwm4」這個目錄，代表該主題有適用於 xfce 的版本{{< /red >}}
