---
author: wade
date: 2020-08-27 03:04:24+00:00
draft: false
title: Linux 使用 Wine 執行 Windows 程式
type: post
url: /post/linux-run-win-program-by-wine/
image: "https://image.wadeism.net/wine00.jpg"
categories:
- Linux
tags:
- Ubuntu
- Wine
---

Wine 是讓 Linux、macOS 執行 Windows 程式的一個軟體。全名為「Wine Is Not an Emulator」，意指它不是用虛擬機的方式來執行 Win 程式，而是作為一個介面層，導入 Win 底下的函式庫，用它們來執行程式，因此效能會比虛擬機來的好，用起來也像是原生的程式。

在 Wine 的官方網站中，有一個專門搜集軟體相容性的資料庫叫 [Wine Application Database](https://appdb.winehq.org/)，裡面有全世界熱心網友所提供的資訊，例如某個程式能不能用 Wine 執行？是否有 Bug…之類的，並且有 Rating 來評價這些軟體在 Wine 的相容性，非常值得大家參考！

近年來由於 Steam 的推廣與開發，甚至很多大型遊戲都可以透過 Wine 來玩了，例如 The Witcher 3、GTA 5，而且十分的簡單（Steam 都幫你弄好了），有興趣的朋友可以參考 [ProtonDB](https://www.protondb.com/) 這個網頁，不過本篇主要介紹 Wine 的基本安裝、設定及使用。


## 安裝 Wine

前往 [Wine Download](https://wiki.winehq.org/Download) 頁面選擇適用的版本，本篇使用 <span class="hl-green">Ubuntu 20.04.1</span>，安裝步驟建議以官網為主。

如果系統是 64 位元的話（應該大多都是了），先允許安裝 32 位元架構的程式

```bash
sudo dpkg --add-architecture i386
```

\
新增 repo 的 key

```bash
wget -O - https://dl.winehq.org/wine-builds/winehq.key | sudo apt-key add -
```

\
新增套件庫 for Ubuntu 20.04

```bash
sudo add-apt-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ focal main'
```

\
安裝穩定版的 Wine

```bash
sudo apt install --install-recommends winehq-stable
```

也可以選擇安裝 <span class="hl-blue">winehq-staging</span>，可以有更多最新的功能與較好的效能，不過個人偏好穩定版

## 初次設定 Wine


```bash
winecfg
```

執行 <span class="hl-blue">winecfg</span> 可以進行 Wine 的設定，首次執行時會請使用者安裝幾個套件如 wine-mono 及 Gecko，然後會建立初始化的資料夾在 <span class="hl-blue">~/.wine</span> 裡面，接著就可以進入設定畫面

### 應用程式

![](https://image.wadeism.net/wine01.png)

Wine 可以針對不同的程式選擇適合的 Windows 版本，有點類似 Windows 的相容性模式。

### 函式庫

![](https://image.wadeism.net/wine02.png)

某些程式需要另外安裝函式庫，例如 d3dx9_xx.dll 之類的（在 Windows 上這種問題很常見）就需要從這邊安裝，不過個人推薦使用之後會介紹的 [Winetricks](https://wiki.winehq.org/Winetricks) 來安裝這些細部的東西會更方便

### 顯示

![](https://image.wadeism.net/wine03.png)

調整視窗設定與螢幕解析度，通常可以不用動

### 桌面整合

![](https://image.wadeism.net/wine04.png)

設定佈景主題，比較重要的地方是可以設定讓 Windows 的 My Documents 與 Linux 本機的資料夾作連結，例如「我的音樂」連結到「/home/user/Music」

### 儲存裝置

![](https://image.wadeism.net/wine05.png)

設定讓 Windows 的 C 槽、D 槽之類的儲存裝置連結到本機的資料夾或是光碟機等設備，預設 C 槽會連結到 <span class="hl-blue">/home/user/.wine/drive_c</span>，Z 槽會連結到本機的根目錄 <span class="hl-blue">/</span>

### 音效

![](https://image.wadeism.net/wine06.png)

設定輸出或輸入要使用本機的哪項音效裝置，如果有多個音訊輸出裝置時可以調整

## 使用 Wine 安裝 Windows 程式

要安裝或是執行 Windows 的程式方法都一樣，而且非常簡單，下面以我很常用的軟體 mp3tag 為例

首先在安裝檔上按右鍵，選擇「以其他應用程式開啟」

![](https://image.wadeism.net/wine07.png)

\
接著選擇「Wine Windows Program Loader」

![](https://image.wadeism.net/wine08.png)

\
再來就會看到跟 Windows 一樣熟悉的安裝畫面了

![](https://image.wadeism.net/wine09.png)

![](https://image.wadeism.net/wine10.png)

預設的安裝目錄 <span class="hl-blue">C:\users\wade\Mp3tag</span> 其實就是 <span class="hl-blue">~/.wine/drive_c/users/wade</span>，因為 C 槽預設已經跟 <span class="hl-blue">~/.wine/drive_c</span> 做連結了

## 使用 Wine 執行 Windows 程式

安裝完後，通常 Wine 會自動在系統的程式集裡面建立捷徑，如果沒有的話，手動執行的方法也跟安裝一樣，先到 <span class="hl-blue">~/.wine/drive_c/users/wade/Mp3tag</span> 裡找到程式的執行檔 <span class="hl-blue">Mp3tag.exe</span>

![](https://image.wadeism.net/wine11.png)

\
按右鍵點選「以 Wine Windows Program Loader」開啟

![](https://image.wadeism.net/wine12.png)

![](https://image.wadeism.net/wine13.png)

在 Terminal 底下，也可以直接用 wine 指令來執行：


```bash
wine ./Mp3tag
```

<span class="hl-red">建議優先選擇免安裝版本的軟體，通常都可以直接用 Wine 順利執行，省去安裝的麻煩</span>。（但盡量以官方的免安裝版為主）

如果安裝時沒有自動建立捷徑，或是使用免安裝的程式，我們也可以為這些 Windows 程式建一個捷徑來開啟它，在 GUI 的環境中非常的實用，建立的方法可以參考 [Ubuntu 自訂應用程式捷徑](https://notes.wadeism.net/post/ubuntu-custom-app-shortcut/) 這篇文章

### Wine 系列文章：

[Wine 利用 prefix 建立多重環境](https://notes.wadeism.net/post/wine-create-multi-environment/)

[Winetricks – 簡單易用的 Wine 輔助工具](https://notes.wadeism.net/post/easy-using-winetricks/)

[My Personal Wine Setting](https://notes.wadeism.net/post/my-personal-wine-setting/)
