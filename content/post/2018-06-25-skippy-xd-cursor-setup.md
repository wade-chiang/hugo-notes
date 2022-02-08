---
author: wade
date: 2018-06-25 06:54:05+00:00
draft: false
title: 設定 Skippy-XD 的滑鼠游標移動問題
type: post
url: /post/skippy-xd-cursor-setup/
image: "https://image.wadeism.net/skippyxd01.png"
categories:
- Linux
tags:
- App
---

如果用過 Mac 的人應該都知道 expose 這個功能，不僅看起來很帥，實際上也真的蠻方便的。Linux 上當然也有，目前 Gnome 2 預設就開啟了 expose 的功能，只要滑鼠游標移到最左上角就會將所有的視窗縮小並排列在螢幕上。但如果不是使用 Gnome 2 的人一樣可以安裝 Skippy-XD 來用這項功能。

{{< youtube dNkkCD2dfG4 >}}
<div style="text-align: center">expose in Mac OSX</div>

Skippy-XD 可以使用快捷鍵觸發，或是搭配每個 Desktop Environment 的 Hot Corner 套件，透過將滑鼠游標移到某個角落來觸發，

因為我現在暫時沒有在使用它，所以 Skippy-XD 的安裝方法與使用方式就暫時先不詳述，不過在觸發Skippy-XD 時，有一個很煩人的問題值得記錄一下。

{{< youtube gVRPCd7OS38 >}}

上面影片的 2:39 秒左右可以看到，在觸發 Skippy-XD 後，滑鼠游標會自動的移動到程式的小縮圖上，而非原來的位置，而且選完程式後，游標的位置也不會變回來, 非常的討厭，因為游標會自動改位置，使得滑鼠最後要一直拿起來重擺才能定位到習慣的位置。

其實這個問題，是可以透過 Skippy-XD 的 config 檔來解決，以下為設定的方法：

\
複製 /etc/xdg/skippy-xd.rc 到 home/.config/skippy-xd/skippy-xd.rc
    
```bash
sudo cp /etc/xdg/skippy-xd.rc ~/.config/skippy-xd/skippy-xd.rc
```

\
修改 skippy-xd.rc 的檔案內容
    
```bash
vim ~/.config/skippy-xd/skippy-xd.rc
```

\
找到下面的參數，並依照下面的註解來調整
    
```vim
movePointerOnStart = false     //設false讓程式啟動時游標不會移動！
movePointerOnSelect = true
movePointerOnRaise = false     //設false讓點縮圖後游標不會移動！

[normal]
opacity = 250     //縮圖的透明度
```

[cover by](http://linuxg.net/how-to-install-skippy-xd-0-5-1-on-ubuntu-14-04-ubuntu-12-04-and-derivative-systems-all-using-either-lxde-or-xfce/)
