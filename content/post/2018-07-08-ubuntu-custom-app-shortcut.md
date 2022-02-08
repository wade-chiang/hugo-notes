---
author: wade
date: 2018-07-08 12:00:46+00:00
draft: false
title: Ubuntu 自訂應用程式捷徑
type: post
url: /post/ubuntu-custom-app-shortcut/
image: "https://image.wadeism.net/shortcut02.webp"
categories:
- Linux
tags:
- Ubuntu
---

一般來說，在 Ubuntu 裡安裝軟體時，完成後我們可以在應用程式列表之類的地方看到，點一下該軟體的圖示就可以開啟。不過即使用了一陣子，還是有一些 windows 上軟體是很難被取代的，至少對我來說 foobar2000 與 mp3tag 就是難以替代。倒也不是說 foobar2000 的音質多好還是怎樣的，只是它類似 itunes 的音樂管理方式實在太好用，而對於音樂檔的 tag 編輯，Linux 中是有個 easytag，用了一陣子還是覺得沒有 mp3tag 來得方便穩定。所幸這兩個軟體相容於 Linux Wine 的環境，用 Wine 來跑幾乎是沒有什麼問題，非常的順暢。

即然這些軟體是用 Wine 來跑，表示它們的安裝並不是使用 Ubuntu 的 deb 或是其它的常規方法，通常是使用 Wine 去執行它們的 exe 安裝檔來安裝，因此我們不會在已安裝軟體列表中看到它們，每次要執行的時候，都得在它們的執行檔上點右鍵，再選擇使用 wine 來執行。

![](https://image.wadeism.net/shortcut01.png#center)

這麼常用到的軟體，如果每次都要這樣開實在是非常的麻煩，其實我們可以使用自訂捷徑的方式，將這些非常規的軟體放入 app 列表中，如此一來就會像我們平常在開 native 的程式一樣簡單許多。

首先，在網路上找該軟體的 PNG icon，例如我想要做 foobar2000 與 mp3tag 的捷徑，就去網站上找這兩個軟體的圖示，外型可以隨自己的喜好，但最好是 PNG 檔，下載後請固定放在一個地方，本例的存放位置為 <span class="hl-blue">~/.icons</span>

在 <span class="hl-blue">~/.local/share/applications</span> 目錄底下新增一個捷徑檔，本例為 foobar2000
    
```bash
sudo vim ~/.local/share/applications/foobar2000.desktop
# 在 /usr/share/applications 或 ~/Desktop 建立似乎也可以
```

\
捷徑檔的內容如下（請依自己的需求修改）：
    
```toml
[Desktop Entry]
Encoding=UTF-8
Name=foobar2000
Exec=wine /media/Linux/Application/foobar2000_v1.3.15/foobar2000.exe
Icon=~/.icons/Foobar.png
Type=Application
Categories=Audio;
```

* <span class="hl-green mono">Name</span>：軟體名稱，這個名稱會是之後在軟體列表裡所看到的名字
* <span class="hl-green mono">Exec</span>：軟體的執行方式，上面的例子表示，<span class="hl-red">使用 wine 來執行 foobar 的執行檔</span>
* <span class="hl-green mono">Icon</span>：軟體的圖示，後面接圖示的路徑即可
* <span class="hl-green mono">Type</span>：該物件屬於 Application
* <span class="hl-green mono">Categories</span>：該程式的分類，這個分類似乎是有一個固定規範的，不是隨便亂取就可以，app 列表可能會依照這個來歸類這個軟體


存檔離開後，就可以在 App 列表中找到我們自訂的軟體捷徑了

![](https://image.wadeism.net/shortcut02.webp)


\
使用快速開啟 app 的程式如：albert 之類的也可以看得到自訂的捷徑

![](https://image.wadeism.net/shortcut03.png)


* * *


有關 Categories 的類型，可以參考下面網址，不過就我自己的經驗，使用 Main Categories 就夠了，不用細分到 Additional Categories


[https://specifications.freedesktop.org/menu-spec/latest/apa.html](https://specifications.freedesktop.org/menu-spec/latest/apa.html)


## Main Categories

By including one of the Main Categories in an application's desktop entry file, the application will be ensured that it will show up in a section of the application menu dedicated to this category. If multiple Main Categories are included in a single desktop entry file, the entry may appear more than once in the menu.

Category-based menus based on the Main Categories listed in this specification do not provide a complete ontology for all available applications. Category-based menu implementations SHOULD therefore provide a "catch-all" submenu for applications that cannot be appropriately placed elsewhere.

The table below lists all Main Categories.

||||
|--- |--- |--- |
|**Main Category**|**Description**|**Notes**|
|AudioVideo|Application for presenting, creating, or processing multimedia (audio/video)||
|Audio|An audio application|Desktop entry must include AudioVideo as well|
|Video|A video application|Desktop entry must include AudioVideo as well|
|Development|An application for development||
|Education|Educational software||
|Game|A game||
|Graphics|Application for viewing, creating, or processing graphics||
|Network|Network application such as a web browser||
|Office|An office type application||
|Science|Scientific software||
|Settings|Settings applications|Entries may appear in a separate menu or as part of a "Control Center"|
|System|System application, "System Tools" such as say a log viewer or network monitor||
|Utility|Small utility application, "Accessories"||


## Additional Categories

The Related Categories column lists one or more categories that are suggested to be used in conjunction with the Additional Category. If the Related Categories column is blank, the Additional Category can be used with any Main Category.

The table below describes Additional Categories.

||||
|--- |--- |--- |
|**Additional Category**|**Description**|**Related Categories**|
|Building|A tool to build applications|Development|
|Debugger|A tool to debug applications|Development|
|IDE|IDE application|Development|
|GUIDesigner|A GUI designer application|Development|
|Profiling|A profiling tool|Development|
|RevisionControl|Applications like cvs or subversion|Development|
|Translation|A translation tool|Development|
|Calendar|Calendar application|Office|
|ContactManagement|E.g. an address book|Office|
|Database|Application to manage a database|Office or Development or AudioVideo|
|Dictionary|A dictionary|Office or TextTools|
|Chart|Chart application|Office|
|Email|Email application|Office or Network|
|Finance|Application to manage your finance|Office|
|FlowChart|A flowchart application|Office|
|PDA|Tool to manage your PDA|Office|
|ProjectManagement|Project management application|Office or Development|
|Presentation|Presentation software|Office|
|Spreadsheet|A spreadsheet|Office|
|WordProcessor|A word processor|Office|
|2DGraphics|2D based graphical application|Graphics|
|VectorGraphics|Application for viewing, creating, or processing vector graphics|Graphics;2DGraphics|
|RasterGraphics|Application for viewing, creating, or processing raster (bitmap) graphics|Graphics;2DGraphics|
|3DGraphics|Application for viewing, creating, or processing 3-D graphics|Graphics|
|Scanning|Tool to scan a file/text|Graphics|
|OCR|Optical character recognition application|Graphics;Scanning|
|Photography|Camera tools, etc.|Graphics or Office|
|Publishing|Desktop Publishing applications and Color Management tools|Graphics or Office|
|Viewer|Tool to view e.g. a graphic or pdf file|Graphics or Office|
|TextTools|A text tool utility|Utility|
|DesktopSettings|Configuration tool for the GUI|Settings|
|HardwareSettings|A tool to manage hardware components, like sound cards, video cards or printers|Settings|
|Printing|A tool to manage printers|HardwareSettings;Settings|
|PackageManager|A package manager application|Settings|
|Dialup|A dial-up program|Network|
|InstantMessaging|An instant messaging client|Network|
|Chat|A chat client|Network|
|IRCClient|An IRC client|Network|
|Feed|RSS, podcast and other subscription based contents|Network|
|FileTransfer|Tools like FTP or P2P programs|Network|
|HamRadio|HAM radio software|Network or Audio|
|News|A news reader or a news ticker|Network|
|P2P|A P2P program|Network|
|RemoteAccess|A tool to remotely manage your PC|Network|
|Telephony|Telephony via PC|Network|
|TelephonyTools|Telephony tools, to dial a number, manage PBX, ...|Utility|
|VideoConference|Video Conference software|Network|
|WebBrowser|A web browser|Network|
|WebDevelopment|A tool for web developers|Network or Development|
|Midi|An app related to MIDI|AudioVideo;Audio|
|Mixer|Just a mixer|AudioVideo;Audio|
|Sequencer|A sequencer|AudioVideo;Audio|
|Tuner|A tuner|AudioVideo;Audio|
|TV|A TV application|AudioVideo;Video|
|AudioVideoEditing|Application to edit audio/video files|Audio or Video or AudioVideo|
|Player|Application to play audio/video files|Audio or Video or AudioVideo|
|Recorder|Application to record audio/video files|Audio or Video or AudioVideo|
|DiscBurning|Application to burn a disc|AudioVideo|
|ActionGame|An action game|Game|
|AdventureGame|Adventure style game|Game|
|ArcadeGame|Arcade style game|Game|
|BoardGame|A board game|Game|
|BlocksGame|Falling blocks game|Game|
|CardGame|A card game|Game|
|KidsGame|A game for kids|Game|
|LogicGame|Logic games like puzzles, etc|Game|
|RolePlaying|A role playing game|Game|
|Shooter|A shooter game|Game|
|Simulation|A simulation game|Game|
|SportsGame|A sports game|Game|
|StrategyGame|A strategy game|Game|
|Art|Software to teach arts|Education or Science|
|Construction||Education or Science|
|Music|Musical software|AudioVideo or Education|
|Languages|Software to learn foreign languages|Education or Science|
|ArtificialIntelligence|Artificial Intelligence software|Education or Science|
|Astronomy|Astronomy software|Education or Science|
|Biology|Biology software|Education or Science|
|Chemistry|Chemistry software|Education or Science|
|ComputerScience|ComputerSience software|Education or Science|
|DataVisualization|Data visualization software|Education or Science|
|Economy|Economy software|Education or Science|
|Electricity|Electricity software|Education or Science|
|Geography|Geography software|Education or Science|
|Geology|Geology software|Education or Science|
|Geoscience|Geoscience software, GIS|Education or Science|
|History|History software|Education or Science|
|Humanities|Software for philosophy, psychology and other humanities|Education or Science|
|ImageProcessing|Image Processing software|Education or Science|
|Literature|Literature software|Education or Science|
|Maps|Sofware for viewing maps, navigation, mapping, GPS|Education or Science or Utility|
|Math|Math software|Education or Science|
|NumericalAnalysis|Numerical analysis software|Education;Math or Science;Math|
|MedicalSoftware|Medical software|Education or Science|
|Physics|Physics software|Education or Science|
|Robotics|Robotics software|Education or Science|
|Spirituality|Religious and spiritual software, theology|Education or Science or Utility|
|Sports|Sports software|Education or Science|
|ParallelComputing|Parallel computing software|Education;ComputerScience or Science;ComputerScience|
|Amusement|A simple amusement||
|Archiving|A tool to archive/backup data|Utility|
|Compression|A tool to manage compressed data/archives|Utility;Archiving|
|Electronics|Electronics software, e.g. a circuit designer||
|Emulator|Emulator of another platform, such as a DOS emulator|System or Game|
|Engineering|Engineering software, e.g. CAD programs||
|FileTools|A file tool utility|Utility or System|
|FileManager|A file manager|System;FileTools|
|TerminalEmulator|A terminal emulator application|System|
|Filesystem|A file system tool|System|
|Monitor|Monitor application/applet that monitors some resource or activity|System or Network|
|Security|A security tool|Settings or System|
|Accessibility|Accessibility|Settings or Utility|
|Calculator|A calculator|Utility|
|Clock|A clock application/applet|Utility|
|TextEditor|A text editor|Utility|
|Documentation|Help or documentation||
|Adult|Application handles adult or explicit material||
|Core|Important application, core to the desktop such as a file manager or a help browser||
|KDE|Application based on KDE libraries|QT|
|GNOME|Application based on GNOME libraries|GTK|
|XFCE|Application based on XFCE libraries|GTK|
|GTK|Application based on GTK+ libraries||
|Qt|Application based on Qt libraries||
|Motif|Application based on Motif libraries||
|Java|Application based on Java GUI libraries, such as AWT or Swing||
|ConsoleOnly|Application that only works inside a terminal (text-based or command line application)||
