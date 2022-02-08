---
author: wade
date: 2020-08-20 06:19:50+00:00
draft: false
title: Tarball 原始碼程式安裝教學
type: post
url: /post/install-by-tarball/
categories:
- Linux
tags:
- Tarball
---

現在的 Linux 我們已經很習慣使用 yum 、apt、aur 這類的套件管理程式來安裝軟體，不過有時候如果軟體太舊沒有放到套件庫時，可能就要使用別人編譯好的套件或是直接用原始碼來安裝。

Tarball 其實就是把原始碼等文件打包而成的 tar 壓縮檔，使用 tarball 安裝程式的過程需要自行編譯原始碼，成功後會產生程式的執行檔與 man page 文件

[megatools](https://megatools.megous.com/) 是用來下載與管理知名免費空間 [Mega.nz](https://mega.nz) 的 cli 程式，除了方便之外，它的 tarball 安裝也算是簡單容易，下面就用 [megatools](https://megatools.megous.com/) 的安裝來做範例


## 環境說明

系統：Ubuntu 20.04.1

軟體版本：megatools-1.10.3


## tarball 原始碼安裝 megatools

首先下載 tarball 安裝檔（建議可以從[官網](https://megatools.megous.com/)下載最新版本）

```bash
wget "https://megatools.megous.com/builds/megatools-1.10.3.tar.gz"
```

\
解壓縮檔案到 <span class="hl-blue">/usr/local/src</span>

```bash
sudo tar zxvf megatools-1.10.3.tar.gz -C /usr/local/src
```

\
在鳥哥的教學中<span class="hl-red">建議只要是自行安裝的程式，都統一放在 /usr/local 裡比較好</span>，所以原始碼的部分就放在 <span class="hl-blue">/usr/local/src</span>，這樣日後管理會比較方便

\
進入資料夾並檢視檔案

```bash
cd /usr/local/src/megatools-1.10.3 && ls
```

```bash
# 執行結果

aclocal.m4   configure.ac  HACKING     LICENSE      NEWS
compile      contrib       INSTALL     Makefile.am  README
config.h.in  depcomp       install-sh  Makefile.in  TODO
configure    docs          lib         missing      tools
```

通常原始資料裡都會有個 <span class="hl-blue">INSTALL</span> 的文件，裡面會說明安裝的方式，基本上都大同小異，我們就按照裡面的步驟來安裝

\
執行 <span class="hl-blue">configure</span> 建立編譯用的 makefile 

```bash
./configure
```

<span class="hl-blue">configure</span> 這個 script 會去檢測系統的環境，當所有必要的套件都已經安裝好後，就會生成 makefile。

<span class="hl-red">通常執行 configure 時會出現 error 告訴我們缺少什麼東西需要先安裝，裝好之後再次執行 configure ，如果又再跳出 error，就再去安裝所需套件，所以在這邊我們會不斷的執行 configure ，直到所有的必要套件都安裝好</span>

\
<span class="hl-red">執行 configure 時出現的 error 不一定都會告訴我們要安裝什麼套件，有時只會告訴我們缺少的元件是什麼，所以如果沒有明確指示要安裝哪個套件包，就用 google 搜尋元件名稱 + 系統（Ubuntu），通常都會有答案</span>

印象中之前看過的文章有建議加 <span class="hl-blue">--prefix</span> 參數來指定程式安裝的路徑，雖然這樣比較有彈性，但自訂路徑之後還得自行修改 $PATH 與 $MANPATH，有點麻煩，因此我覺得只要原始檔有統一管理好其實就夠了

```cmake
checking for ANSI C header files... yes
checking for pkg-config... /usr/bin/pkg-config
checking pkg-config is at least version 0.9.0... yes
checking for GLIB... no
configure: error: Package requirements (gio-2.0 >= 2.32.0) were not met:

No package 'gio-2.0' found

Consider adjusting the PKG_CONFIG_PATH environment variable if you
installed software in a non-standard prefix.

Alternatively, you may set the environment variables GLIB_CFLAGS
and GLIB_LIBS to avoid the need to call pkg-config.
See the pkg-config man page for more details.

```

以上面為例，顯示 <span class="hl-blue">No package 'gio-2.0' found</span>，拿去 google 後就會知道要安裝 <span class="hl-blue">libglib2.0-dev</span>

\
在這邊我先把所有需要的套件先安裝好，不過建議大家可以試著用 configure 一次一次的慢慢裝會比較有感覺

```bash
sudo apt install make gcc libglib2.0-dev libssl-dev libcurl4-openssl-dev asciidoc
```
<span class="hl-blue">make</span> 與 <span class="hl-blue">gcc</span>  通常是 tarball 安裝的必要程式！

\
再次執行 <span class="hl-blue">configure</span>

```bash
./configure
```

```cmake
# 執行結果：

checking for GLIB... yes
checking for OPENSSL... yes
checking for LIBCURL... yes
checking for a2x... /usr/bin/a2x
checking that generated files are newer than configure... done
configure: creating ./config.status
config.status: creating Makefile
config.status: creating config.h
config.status: config.h is unchanged
config.status: executing depfiles commands

Configured features:

docs build: yes
warnings: no

Run make now.

NOTE: On FreeBSD, you need to use GNU make (gmake)
```

出現這樣的結果，就表示相依性都沒問題了，在最後也有提示可以執行 make 來正式編譯

\
清除編譯時產生的檔案

```bash
make clean
```

\
開始編譯及安裝程式

```bash
sudo make install
```

```cmake
# 執行結果：

...
CCLD     megarm
CC       tools/copy.o
CCLD     megacopy
/usr/bin/mkdir -p '/usr/local/bin'
/usr/bin/install -c megadf megadl megaget megals megamkdir megaput megareg megarm megacopy '/usr/local/bin'
/usr/bin/mkdir -p '/usr/local/share/doc/megatools'
/usr/bin/install -c -m 644 LICENSE NEWS TODO README INSTALL HACKING '/usr/local/share/doc/megatools'
/usr/bin/mkdir -p '/usr/local/share/man/man1'
/usr/bin/install -c -m 644 docs/megadf.1 docs/megadl.1 docs/megaget.1 docs/megals.1 docs/megamkdir.1 docs/megaput.1 docs/megareg.1 docs/megarm.1 docs/megacopy.1 '/usr/local/share/man/man1'
/usr/bin/mkdir -p '/usr/local/share/man/man5'
/usr/bin/install -c -m 644 docs/megarc.5 '/usr/local/share/man/man5'
/usr/bin/mkdir -p '/usr/local/share/man/man7'
/usr/bin/install -c -m 644 docs/megatools.7 '/usr/local/share/man/man7'
```

看到像上面的訊息就表示程式已經編譯完成了

編譯完成的執行檔會被放在 <span class="hl-blue">/usr/local/bin</span> 裡面，而它的 man page 則會放在 <span class="hl-blue">/usr/local/man</span> 裡

這幾個路徑通常也是 $PATH 裡有的，所以我們就可以在任何地方執行 megatools 了（ex：<span class="hl-blue">megadl</span> 這個下載用的程式）

\
移除程式的方法

安裝完後 <span class="hl-blue">/usr/local/src/</span> 裡面的原始檔資料夾也務必保留，以 megatools 為例，在看過 <span class="hl-blue">INSTALL</span> 裡的說明後，有提到用以下指令即可移除程式

```bash
sudo make uninstall
```

```cmake
# 執行結果

( cd '/usr/local/bin' && rm -f megadf megadl megaget megals megamkdir megaput megareg megarm megacopy )
( cd '/usr/local/share/doc/megatools' && rm -f LICENSE NEWS TODO README INSTALL HACKING )
( cd '/usr/local/share/man/man1' && rm -f megadf.1 megadl.1 megaget.1 megals.1 megamkdir.1 megaput.1 megareg.1 megarm.1 megacopy.1 )
( cd '/usr/local/share/man/man5' && rm -f megarc.5 )
( cd '/usr/local/share/man/man7' && rm -f megatools.7 )

```

可以看出 <span class="hl-blue">make uninstall</span> 把執行檔與 man page、doc file 都刪除了

## 心得

tarball 安裝算是一種萬用的安裝方式，可以無視 Linux 的 distribution，不過現在多數的程式都要相依於其它的套件，所以手動安裝在處理相依性時非常麻煩，也因此現在多使用套件管理程式來安裝軟體。

而且以[鳥哥文章範例](https://linux.vbird.org/linux_basic/centos7/0520source_code_and_tarball.php#tarball_exntp)中的 ntp 為例，它是有 daemon 的程式，這類的程式使用 apt  或 yum 來安裝時，會自動建立 systemd 的腳本，方便我們用 systemctl 控制它的啟動與自動執行，但如果使用 tarball 安裝的話就只會得到它的執行檔，想要自動執行還得另外去設定。

所以基本上個人還是建議沒事不要用 tarball 來安裝軟體，不過當作是練習也算是很好的課題（不被相依性搞死的話）

* * *

參考資料：

[鳥哥的 Linux 私房菜 - 軟體安裝：原始碼與 Tarball](https://linux.vbird.org/linux_basic/centos7/0520source_code_and_tarball.php)
