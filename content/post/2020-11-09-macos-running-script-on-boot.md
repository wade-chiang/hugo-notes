---
author: wade
date: 2020-11-09 08:22:22+00:00
draft: false
title: macOS 開機自動執行 Script
type: post
url: /post/macos-running-script-on-boot/
image: "https://image.wadeism.net/launchd00.png"
categories:
- Mac
tags:
- Mac
- macOS
---

在 Linux 裡我們很習慣用 rc.local 或是自製 systemd 的 unit 來讓開機時自動執行某個程式或是 script，而在 Mac 上目前我所知道的方法有 {{< blue >}}Launchd{{< /blue >}} 與 {{< blue >}}Automator{{< /blue >}} 兩種，本篇要講的 launchd 就是個類似 Linux systemd 的工具。

Launchd 是 Mac 上用來控制、管理 Daemon 與程序的工具，用 ps 可以看到它的 pid 為 1，表示它是系統第一個執行的 process，而用來控制 launchd 的工具 launchctl，也類似 Linux 的 systemctl，基本上可以用 systemd 的概念來理解它，不過使用的方法當然還是很不一樣，下面就來紀錄這次的使用過程。

{{< red >}}本文使用版本為macOS Catalina{{< /red >}}


## launchd 設定檔種類與路徑

Launchd 設定檔的內容為程式的啟動方式與流程，類似於 systemd 的 unit，分為 {{< blue >}}Agent{{< /blue >}} 與 {{< blue >}}Daemon{{< /blue >}} 兩種，Agent 是使用者登入時載入，而 Daemon 則是系統開機時載入，較屬於常駐型的程式。因不同的使用情況與權限會放到下面不同的路徑中：

* {{< green >}}{{< mono >}}~/Library/LaunchAgents{{< /green >}}{{< /mono >}}：存放各別使用者的 agent 設定
* {{< green >}}{{< mono >}}/Library/LaunchAgents{{< /green >}}{{< /mono >}}：由系統管理者所提供的 agent，每個使用者登入時都會執行
* {{< green >}}{{< mono >}}/Library/LaunchDaemons{{< /green >}}{{< /mono >}}：由系統管理者提供的全域 daemon，不過設定檔中可以用 UserName 這個 tag 來指定要執行的使用者
* {{< green >}}{{< mono >}}/System/Library/LaunchAgents{{< /green >}}{{< /mono >}}：系統 agent 的路徑
* {{< green >}}{{< mono >}}/System/Library/LaunchDaemons{{< /green >}}{{< /mono >}}：系統 daemon 的路徑，建議與前面的系統 agent 一樣都不要去動到！


## launchd 設定檔範例

launchd 的設定檔格式為 xml，副檔名為 {{< blue >}}.plist{{< /blue >}}。

本次的範例是想在{{< blue >}}開機時自動在自己的 home 目錄中建立 AA、BB、CC 三個空資料夾{{< /blue >}}，以下為 agent 的 plist 檔 take1.plist 的內容：


```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>EnvironmentVariables</key>
	<dict>
		<key>PATH</key>
		<string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/bin/zsh</string>
	</dict>
	<key>Label</key>
	<string>com.wade.take1</string>
	<key>ProgramArguments</key>
	<array>
		<string>/Users/wade/mkdir.sh</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>StandardErrorPath</key>
	<string>/Users/wade/take1.err</string>
	<key>StandardOutPath</key>
	<string>/Users/wade/take1.out</string>
</dict>
</plist>
```

{{< blue >}}&lt;key&gt;{{< /blue >}} 用來定義項目名稱，例如{{< blue >}}&lt;key&gt;Label&lt;/key&gt;{{< /blue >}} 就是指這個 agent 在 launchd 裡的名字，而它底下的 {{< blue >}}&lt;string&gt;{{< /blue >}} 則是該項目的值，從上面的例子可以知道，這個 agent 在 launchctl 裡看到的名稱即為「com.wade.take1」，下面簡單介紹幾個比較重要的 key tag：

* {{< green >}}{{< mono >}}EnvironmentVariables{{< /green >}}{{< /mono >}}：底下加入 PATH 的 key值可以定義 PATH 環境變數，這個選項在一些範例中不一定會有，但如果 script 執行上有問題時，可以試著加上這個選項。
* {{< green >}}{{< mono >}}Label{{< /green >}}{{< /mono >}}：agent 的名稱，使用 launchctl list 可以看到。
* {{< green >}}{{< mono >}}ProgramArguments{{< /green >}}{{< /mono >}}：要執行的指令或 script，使用 <array> tag 可以執行複數的物件（執行單一指令時可以改用 <key>Program</key>）
* {{< green >}}{{< mono >}}RunAtLoad{{< /green >}}{{< /mono >}}：下面將該值設定為 <true/>，表示這個 agent 在被 launchd 讀取時就會被執行。
* {{< green >}}{{< mono >}}StandardErrorPath{{< /green >}}{{< /mono >}}：將執行結果的 standard error 訊息存到指定的檔案裡。
* {{< green >}}{{< mono >}}StandardOutPath{{< /green >}}{{< /mono >}}：將執行結果的 standard out 訊息存到指定的檔案裡，{{< red >}}與上面選項都是非必要的，但如果設定檔裡的程式執行有問題時，拿來除錯非常的實用！{{< /red >}}

\
{{< blue >}}/Users/wade/mkdir.sh{{< /blue >}} 的內容如下：

```bash
#!/bin/zsh

cPath="/Users/wade"

folder=(
AA
BB
CC
)

for fName in ${folder}; do
  mkdir "${cPath}/${fName}"
done
```

script 的內容就是在 /User/wade 裡建立 AA、BB、CC 三個空資料夾，因為 Catalina 開始的預設 shell 是 zsh，因此前面的 shell 宣告使用 {{< blue >}}#!/bin/zsh{{< /blue >}}

有了 plist 檔與 script 後，接著我們就要用 launchctl 這個操作工具來讓設定檔生效。


## 以 launchctl 啟用 agent

因為這次的範例只是在自己的 home 目錄建資料夾，因此我們將 take1.plist 檔放到 {{< blue >}}~/Library/LaunchAgents{{< /blue >}} 裡。

```bash
mv take1.plist ~/Library/LaunchAgents/
```

\
接著切換到該目錄後，使用 launchctl 讀取設定檔

```bash
cd ~/Library/LaunchAgents/
```

```bash
launchctl load take1.plist
```

\
如果 plist 有錯，要修改的話需要先將設定給移除，待改完後再次讀取

```bash
launchctl remove com.wade.take1
```

\
查看 plist 的讀取與執行狀態

```bash
launchctl list | grep wade.take1
```

```bash
# 執行結果

PID   Status   Label
-     127      com.wade.take1
```

一般來說，執行中的 daemon 會有 PID，這次的 script 並非常駐型的 daemon 程式，所以沒有 PID 很正常，而執行成功的 agent，Status Code 應該要是 0，Status 127 表示執行有錯誤。

這時候我們可以去 google 搜尋 launchd 有關 127 code 的資訊，另外也可以用我們在 plist 中指定輸出的 standard error file 去查看錯誤的資訊

查看錯誤訊息

```bash
cat ~/take1.err
```

```bash
# 執行結果

/bin/zsh: can't open input file: /Users/wade/mkdir.sh
```

出現類似上面的訊息時，可能是檔案權限的問題，這時候可以先檢查檔案與資料夾是否有 rx 的權限，如果都正確的話，可能就是 Mac 的安全限制。


## 允許 zsh 存取檔案

為了允許 zsh 存取檔案，我們首先打開 {{< blue >}}系統偏好設定{{< /blue >}}，接著選取 {{< blue >}}安全性與隱私權{{< /blue >}} → {{< blue >}}隱私權{{< /blue >}}

![](https://image.wadeism.net/launchd01.png)

![](https://image.wadeism.net/launchd02.png)

\
在左邊視窗中找到 {{< blue >}}完全取用磁碟{{< /blue >}}

![](https://image.wadeism.net/launchd03.png)

接著點選右邊的 + 號（記得先點擊下面的小鎖頭解開修改限制）

![](https://image.wadeism.net/launchd04.png)

預設我們是無法在 Finder 裡看到 /bin 資料夾的，這時按組合鍵「{{< blue >}}Shift{{< /blue >}}」+「{{< blue >}}Command{{< /blue >}}」+「{{< blue >}}.{{< /blue >}}」就會跳出隱藏的系統檔案

![](https://image.wadeism.net/launchd05.png)

找到 {{< blue >}}Macintosh HD{{< /blue >}} → {{< blue >}}bin{{< /blue >}} 裡面的 zsh，將它打開就可以把 zsh 加入「完全取用磁碟」的權限。

![](https://image.wadeism.net/launchd06.png)

![](https://image.wadeism.net/launchd07.png)

如果 script 的宣告是用 /bin/bash，那這邊就選 /bin/bash


## 再次啟用 launchd 設定檔

```bash
launchctl start take1.plist
```

\
查看 plist 的讀取與執行狀態

```bash
launchctl list | grep wade.take1
```

```bash
# 執行結果

PID   Status   Label
-     0        com.wade.take1
```

這次看起來設定檔有執行成功了，接著看看 home 目錄裡是否有 AA、BB、CC 三個資料夾，有的話將它們刪掉並且重開機測試

重開機後如果空資料夾有建起來，就算是大成告成啦！

## 後記

由於對 mac 還不是很熟，所以這次 debug 的時間比較久，幾個地方之後需要注意：

* 務必先單獨測試 script 是否能執行，不能執行的話 launchtd 這邊也會出錯
* 找不到問題時，可以裝 LaunchControl 這個 app 來 debug，基本上它就是教你新增 PATH、或是用它的小工具來除錯，不過這是個付費軟體，所以用它來修改的 plist 得另存再來試
* 很多出錯的地方都是在權限的問題，就算 script 直接執行沒問題，使用 launchd 還是有可能出錯，所以上面的 允許 zsh  存取檔案那邊非常重要

* * *

參考資料：

[A launchd Tutorial](https://www.launchd.info/)
