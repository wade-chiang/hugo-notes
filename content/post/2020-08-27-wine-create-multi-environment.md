---
author: wade
date: 2020-08-27 03:15:00+00:00
draft: false
title: Wine 利用 prefix 建立多重環境
type: post
url: /post/wine-create-multi-environment/
image: "https://image.wadeism.net/wine00.jpg"
categories:
- Linux
tags:
- Ubuntu
- Wine
---

Wine 的設定中，可以針對想要執行的程式來安裝所需的函式庫，我們可以想成是幫程式建立一個專屬的 Wine 容器。

如果我們有很多種程式想執行，而且每個程式都有它自己的特殊需求，例如有的遊戲需要裝 DirectX 9，有的遊戲需要裝日文，有的又是正體中文，這時候我們就可以在 Wine 上面建立多重環境，針對不同的遊戲使用專屬的 Wine 容器來執行

本次的系統環境為 <span class="hl-green">Ubuntu 20.04.1</span>


## 建立 Wine prefix

多重環境的作用方式就是在 Wine 執行時指定 prefix 名稱，每個 prefix 會連結到屬於它的 Wine 設定，也代表一個獨立的容器。

在上一篇文章中有提過，初次執行 Wine 的時候，它會建立一個初始化的資料夾 <span class="hl-blue">~/.wine</span>，這個 ~/.wine 裡面包含 Wine 的環境資料、設定與所需的檔案、函式庫，還有 C:\ 之類的。

從這邊就可以看得出來，只要我們新增幾個類似 <span class="hl-blue">~/.wine</span> 的資料夾，並讓程式執行時使用指定路徑的設定就可以了，建立的方法如下：

\
新增 wineprefix

```bash
export WINEPREFIX=~/.wine-jpn
```

```bash
winecfg
```

```bash
# 執行結果：

wine: created the configuration directory '/home/wade/.wine-jpn'
0012:err:ole:marshal_object couldn't get IPSFactory buffer for interface {00000131-0000-0000-c000-000000000046}
0012:err:ole:marshal_object couldn't get IPSFactory buffer for interface {6d5140c1-7436-11ce-8034-00aa006009fa}
0012:err:ole:StdMarshalImpl_MarshalInterface Failed to create ifstub, hres=0x80004002
0012:err:ole:CoMarshalInterface Failed to marshal the interface {6d5140c1-7436-11ce-8034-00aa006009fa}, 80004002
0012:err:ole:get_local_server_stream Failed: 80004002
```

執行 <span class="hl-blue">winecfg</span> 後，wine 就會建立 <span class="hl-blue">~/.wine-jpn</span> 這個資料夾，並且再一次的進行初始化，新的設定會建在 <span class="hl-blue">~/.wine-jpn</span> 裡面，這時候就可以用它來安裝程式所需的日文環境，並且不會影響到預設的環境

建好之後，我們照平常的方法使用 wine 來執行程式，就會是在 wine-jpn 這個容器下了


## 切換 Wine prefix

如果要切換回預設的 prefix <span class="hl-blue">~/.wine</span>，只要將 <span class="hl-blue">WINEPREFIX</span> 變數給取消即可

```bash
unset WINEPREFIX
```

\
另外一種作法是我們每次用 wine 執行程式時，都先在指令中指定 prefix，例如：

```bash
WINEPREFIX=~/.wine wine XXX.exe

# 使用預設環境執行
```

```bash
WINEPREFIX=~/.wine-jpn wine XXX.exe

# 使用新建的日文環境執行
```


## 建立 32 位元的 prefix

wine 的預設環境是 64 bit，不過還是有很多程式或一些老軟體只能在 32 bit 的環境下執行，這時候就要建立 32 位元的 prefix 來執行它們

```bash
WINEARCH=win32 WINEPREFIX=~/.wine_32bit winecfg 

# wine32：32 位元
# wine64：64 位元
```

上面的指令會建立 prefix，路徑為：<span class="hl-blue">~/.wine_32bit</span>

建好之後，執行程式時只要指定 prefix 就可以，<span class="hl-blue">WINEARCH</span> 這個變數可以不用再指定，因為 <span class="hl-blue">~/.wine_32bit</span> 本身就是 32 位元的架構了


## 心得

使用 wine prefix 可以保持環境的乾淨，也可以讓一些比較麻煩的程式用它專屬的容器，而不會影響到其它程式的執行，算是個人非常推薦的做法。

同樣地，wine prefix 一樣也可以用 [Winetricks](https://wiki.winehq.org/Winetricks) 來做，而且更加容易（雖然原本的方式也很簡單了），下面一篇文章就會來介紹 Winetricks 這個好用的 Wine 輔助工具。


### Wine 系列文章：

[Linux 使用 Wine 執行 Windows 程式](https://notes.wadeism.net/post/linux-run-win-program-by-wine/)

[Winetricks – 簡單易用的 Wine 輔助工具](https://notes.wadeism.net/post/easy-using-winetricks/)

[My Personal Wine Setting](https://notes.wadeism.net/post/my-personal-wine-setting/)

* * *

參考資料：

[Wineprefixes FAQ in WineHQ](https://wiki.winehq.org/FAQ#Wineprefixes)
