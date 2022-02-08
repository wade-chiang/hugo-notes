---
author: wade
date: 2020-08-27 03:39:04+00:00
draft: false
title: Winetricks - 簡單易用的 Wine 輔助工具
type: post
url: /post/easy-using-winetricks/
image: "https://image.wadeism.net/wine00.jpg"
categories:
- Linux
tags:
- Ubuntu
- Wine
---

雖然 Wine 的基本設定與操作並不難，但使用 [Winetricks](https://github.com/Winetricks/winetricks) 這個半官方的輔助程式可以讓它操作變得更容易。

尤其一些對 Wine 環境有特殊要求的軟體，例如需要 <span class="hl-blue">.NET Framework</span> 這類套件的軟體，使用 Winetricks 安裝 <span class="hl-blue">.NET Framework</span> 會比自己下載套件手動安裝要來的方便且容易成功，算是個人覺得它最值得使用之處。

\
下載與執行 Winetricks

```bash
wget https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
```

```bash
chmod +x winetricks
```

```bash
./winetricks
```

\
基本上就是下載 script、給予執行權限然後同 script 一樣執行就可以，執行後應該會看到 Winetricks 的 GUI 畫面如下：

![](https://image.wadeism.net/wtricks01.png)

如果沒有正常執行的話，也可以使用 apt、yum 、aur、Homebrew…這類套件安裝的方式來安裝，詳細內容可以看 Winetricks 的 [GitHub Page](https://github.com/Winetricks/winetricks) 或 [官方 Wiki](https://wiki.winehq.org/Winetricks)


## 懶人安裝軟體與遊戲

在主畫面中，有三項的軟體安裝項目，分別是安裝 <span class="hl-green">Windows 應用程式</span>、<span class="hl-green">測試軟體</span>、<span class="hl-green">遊戲</span>

![](https://image.wadeism.net/wtricks01.png)

它會在預設的容器 <span class="hl-blue">~/.wine</span> 中安裝所選的項目，這種安裝方式相當的簡單，可以看到它預設已經提供了很多的選項，同時也告訴我們安裝使用的媒介是下載檔還是光碟，光碟的話需要自備光碟或 iso 檔

![](https://image.wadeism.net/wtricks02.png)
<div style="text-align: center">程式安裝列表</div>

![](https://image.wadeism.net/wtricks03.png)
<div style="text-align: center">遊戲安裝列表</div>

安裝完後，還會自動在應用程式選單裡建立捷徑

![](https://image.wadeism.net/wtricks04.png)
<div style="text-align: center">以 Winamp 為例</div>

\
不過如果刪除程式後這些捷徑可能需要手動移除，捷徑的路徑如下：

```bash
~/.local/share/applications/wine/Programs/
```

用這種預設的方式安裝軟體或遊戲雖然無腦又方便，不過你會發現上面的軟體版本通常比較舊，<span class="hl-red">如果只是要使用軟體的基本功能，或是遊戲本身就很老了，那就可以用這種方式來安裝，不然想要使用最新版本的話，建議還是進入容器裡手動安裝</span>。


## 建立新容器

Winetricks 預設會直接使用初始化的容器也就是 <span class="hl-blue">~/.wine</span>。它也可以用來建立新的容器（prefix）就如同上一篇文章所講的內容，不過用 Winetricks 建立比較簡單直覺

![](https://image.wadeism.net/wtricks05.png)
選取「建立新的 Wine 容器」

\
![](https://image.wadeism.net/wtricks06.png)
\
選擇系統架構

待出現以下的畫面表示新的容器建立成功

![](https://image.wadeism.net/wtricks07.png)

用 Winetricks 建立的新容器會統一放在 <span class="hl-blue">~/.local/share/wineprefixes/</span> 裡，要刪除的話也是直接到目錄中刪掉該容器的資料夾即可

## 容器管理與設定

選擇想使用的容器後，就會進入它的設定選單

![](https://image.wadeism.net/wtricks07.png)

\
基本上是把 Wine 的設定與一些模擬的 Windows 系統程式拉出來讓我們可以直接執行

* <span class="hl-green mono">安裝 Windows DLL 或套件</span>：  
要安裝 .NET Framework 或是 Visual C++ 之類的套件都建議從這裡安裝，<span class="hl-red">算是個人覺得 Winetricks 最實用的部分</span> 
![](https://image.wadeism.net/wtricks08.png)

* <span class="hl-green mono">安裝字型</span>：  
如果需要使用日文軟體之類的，可以在這邊安裝適用的字型，也可以手動安裝的方式將字型檔丟到 <span class="hl-blue">$PREFIX/drive_c/windows/Fonts</span>  
![](https://image.wadeism.net/wtricks09.png)

* <span class="hl-green mono">修改設定</span>：  
修改 Wine 容器的細部設定  
![](https://image.wadeism.net/wtricks10.png)

* <span class="hl-green mono">執行 Wine 設定程式</span>：  
同 <span class="hl-blue">winecfg</span> 指令，也就是 Wine 最基本的設定介面

* <span class="hl-green mono">執行登錄編輯程式</span>：  
同指令 <span class="hl-blue">wine regedit</span>，模擬 Windows 的 登錄檔編輯器（regedit）  
![](https://image.wadeism.net/wtricks11.png)

* <span class="hl-green mono">執行工作管理員</span>：  
同指令 <span class="hl-blue">wine taskmgr</span>，模擬 Windows 工作管理員（Task Manager）  
![](https://image.wadeism.net/wtricks12.png)

* <span class="hl-green mono">執行檔案總管</span>：  
同指令 <span class="hl-blue">wine explorer</span>，模擬 Windwos 的檔案總管（File Manager），用起來就像真的 Windows，一些沒有建捷徑的程式也可以從這邊來開啟  
![](https://image.wadeism.net/wtricks13.png)

* <span class="hl-green mono">執行解除安裝程式</span>：  
模擬 Windows 控制台裡的新增移除程式  

* <span class="hl-green mono">執行命令提示視窗</span>：  
以 Linux terminal 開啟容器的 <span class="hl-blue">C:\</span>

* <span class="hl-green mono">瀏覽容器中的檔案</span>：  
以 Linux 的 File Manager 開啟容器的 <span class="hl-blue">C:\</span>

* <span class="hl-green mono">刪除容器中所有資料和應用程式</span>：  
就是將容器的資料夾，連同建立的軟體捷徑全部刪掉

Wine 搭配 Winetricks 來使用算是相當的簡單直覺了，只要記得多多利用不同的容器（prefix）來安裝或測試就可以不用擔心玩壞，推薦大家使用！

### Wine 系列文章：

[Linux 使用 Wine 執行 Windows 程式](https://notes.wadeism.net/post/linux-run-win-program-by-wine/)

[Wine 利用 prefix 建立多重環境](https://notes.wadeism.net/post/wine-create-multi-environment/)

[My Personal Wine Setting](https://notes.wadeism.net/post/my-personal-wine-setting/)
