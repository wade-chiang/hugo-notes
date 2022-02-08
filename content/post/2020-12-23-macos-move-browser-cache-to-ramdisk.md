---
author: wade
date: 2020-12-23 09:18:03+00:00
draft: false
title: macOS 將網頁暫存檔移到 RamDisk
type: post
url: /post/macos-move-browser-cache-to-ramdisk/
image: "https://image.wadeism.net/macRam00.jpg"
categories:
- Mac
tags:
- Mac
- macOS
---

RamDisk 已經是行之有年的技術，我也經常在 Linux 上使用，雖然現在的 SSD 速度已經夠快了，不過為了延長 SSD 的壽命，減少寫入次數，所以新買的筆電還是打算用上 RamDisk（畢竟 Mac 的維修很貴）。即使 SSD 已經快到沒必要用 RamDisk，耐用度也有一定水準，用 RamDisk 就當作裝個心安吧。

<span class="hl-red">本文使用版本為macOS Catalina</span>


## 撰寫建立 RamDisk 的 Script

本次的用途是將記憶體切出一塊 2G 的空間當作 RamDisk，並且把我常用的瀏覽器：Vivaldi、FireFox 與 Chrome 放置暫存 cache 檔的資料夾移到 RamDisk。

Script 內容如下：
    
```bash
#!/bin/zsh

dName="RamDisk"
cPath="/Users/$USER/Library/Caches"

folder=(
Vivaldi
Google
Firefox
)

diskutil partitionDisk $(hdiutil attach -nomount ram://4096000) GPT APFS ${dName} 0

for fName in ${folder}; do
	ln -sf "/Volumes/${dName}/${fName}" "${cPath}/${fName}"
	mkdir "/Volumes/${dName}/${fName}"
done
```

folder 變數內容為瀏覽器的資料夾名稱，下面的 for 迴圈用來將預設的 cache 路徑指向到 RamDisk 裡。實際上建立 RamDisk 的動作則是在 <span class="hl-blue">diskutil</span> 這行，其中 4096000 代表 2G，如果想換成不同的大小可以自行換算。


## 編寫 plist 檔讓 script 開機時自動執行

這邊就是用到[前面](https://notes.wadeism.net/post/macos-running-script-on-boot/)的教學，plist 檔的檔名取為 com.user.ramdisk.plist，內容如下：
    
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>EnvironmentVariables</key>
	<dict>
	<key>PATH</key>
		<string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
	</dict>
	<key>Label</key>
		<string>com.user.ramdisk</string>
	<key>ProgramArguments</key>
	<array>
		<string>/bin/zsh</string>
		<string>Script檔的路徑</string>
	</array>
	<key>RunAtLoad</key>
		<true/>
	<key>StandardErrorPath</key>
		<string>/tmp/ramdisk.err</string>
	<key>StandardOutPath</key>
	<string>/tmp/ramdisk.out</string>
</dict>
</plist>
```

編輯完成後，將 plist 檔移到 ~/Library/LaunchAgents/ 裡
    
```bash
mv com.user.ramdisk.plist ~/Library/LaunchAgents/
```

\
接著切換到該目錄後，使用 launchctl 讀取設定檔

    
```bash
cd ~/Library/LaunchAgents/
```
    
```bash
launchctl load com.user.ramdisk.plist
```

\
接著重開機再打開瀏覽器，應該就可以看到 RamDisk 已成功建立並且瀏覽器的 cache 也連過來了！

![](https://image.wadeism.net/macRam01.png#center)

![](https://image.wadeism.net/macRam02.png)

![](https://image.wadeism.net/macRam03.png)
