---
author: wade
date: 2019-11-18 04:49:11+00:00
draft: false
title: 解決 PCManFM 無法剪下、貼上的問題
type: post
url: /post/pcmanfm-cut-paste-issue/
categories:
- Linux
tags:
- Ubuntu
---

之前系統改成 Ubuntu 18.04 後，碰到一個很 tricky 的問題，那就是我愛用的檔案管理程式 PCManFM 不能剪下貼上，<span class="hl-red">每次只要將檔案按右鍵剪下後，想右鍵貼上時，貼上的選項會反白無法使用，但複製貼上就很正常</span>，這個問題之前也曾經找了很久，但最後是沒有下文，當時所知道的解法只有改裝 PCManFM-qt，但 qt 的介面我並不是很喜歡，所以最後只好改成使用 Ubuntu 預設的 Nautilus

事隔多時，今天重灌後又想再找一下這個問題，沒想到竟然找到解決的方法了，這個問題奇怪，解決的方法也是蠻詭異的，只有兩個步驟

\
安裝 Gnome Tweak Tool：
    
```bash
sudo apt install gnome-tweak-tool
```

Gnome Tweak Tool 算是 Ubuntu 必裝的軟體，可以對系統做更進一步的設定，像是外觀介面的更改

開啟 Gnome Tweak Tool後（ 程式的名稱為"調校" ），找到「桌面」選項，把「放置圖示於桌面」選項關閉

![](https://image.wadeism.net/gnometweak01.png)

就這樣沒有下一步了，也不知道當初發現的人是怎麼測到的，雖然我的環境是 Ubuntu 18.04，不過這個問題似乎在其它 distro 如 Arch 之類的也有發生，應該是 PCManFM 本身的問題。

另外也發現雖然把顯示圖示關掉後就可以正常使用剪下/貼上，但如果同時也有打開 Nautilus 的時候，一樣又會無法貼上，所以這個問題可能是 PCManFM 與其它 file manager 軟體之間的衝突吧！？
