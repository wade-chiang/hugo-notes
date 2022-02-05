---
author: wade
date: 2020-08-19 03:23:41+00:00
draft: false
title: 使用 Docker 版 PDFtk 處理 PDF 合併、分割
type: post
url: /post/merge-split-pdf-by-pdftk-docker/
categories:
- Linux
tags:
- Docker
- pdf
- pdftk
---

PDFtk 是個跨平台的 pdf 小工具，可以用來做合併、分割之類的 PDF 編輯，本篇介紹它的 command line tool  - 「PDFtk Server」，下面一樣簡稱為 pdftk。

在 Ubuntu 18.04 之後，pdftk 已經從 apt 的 repo 裡移到 Ubuntu 專屬的 snap store，因此本篇使用 Docker 版本的 pdftk


## Docker 安裝 pdftk

```bash
docker pull mnuessler/pdftk
```


## 自製 pdftk 指令

如果用原生的 pdftk 只要直接打 pdftk 指令就可以了，但現在改用 docker 版本，變成要打下面一大串：

```bash
docker run --rm -u $(id -u):$(id -g) -v $(pwd):/work mnuessler/pdftk
```

每次都要打上這一串實在是很麻煩，所以我們自己做一個 pdftk 的指令，讓它用起來跟原生一樣

\
在 home 目錄建一個放執行檔的資料夾 bin

```bash
mkdir ~/bin
```

使用 {{< blue >}}echo $PATH{{< /blue >}}，查看 {{< blue >}}/home/user/bin{{< /blue >}} 是否有在 PATH 變數裡，沒有的話把下面的指令寫入 {{< blue >}}~/.bash_profile{{< /blue >}}

```bash
# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin
export PATH
```


將下面這段指令存到 {{< blue >}}~/bin/pdftk{{< /blue >}}

```bash
#!/bin/bash

docker run --rm -u $(id -u):$(id -g) -v $(pwd):/work mnuessler/pdftk "$@"
```

給予 {{< blue >}}~/bin/pdftk{{< /blue >}} 執行權限，就可以在任何路徑底下執行 pdftk 指令了

```bash
chmod +x ~/bin/pdftk
```


## pdftk 使用教學

下面介紹幾個常用的 pdf 編輯功能，本次範例的 pdf 檔名為 demo.pdf

\
顯示 pdf 檔的總頁數

```bash
pdftk demo.pdf dump_data | grep NumberOfPages
```

\
將 pdf 檔的每一頁都拆成一個獨立的 pdf 檔

```bash
pdftk demo.pdf burst output page-%03d.pdf
```

* {{< green >}}{{< mono >}}page-{{< /green >}}{{< /mono >}}：檔名的前綴，可以自訂
* {{< green >}}{{< mono >}}%03d{{< /green >}}{{< /mono >}}：數字排序長度，03d 表示第 1 頁的檔名會從 page-001.pdf 開始排序，02d 則表示從 page-01.pdf 開始，建議先用上面的指令查看總頁數來決定數字的長度

\
將資料夾底下的所有 pdf 檔合併成一個檔案

```bash
pdftk *.pdf cat output all2one.pdf
```

\
將 pdf 的第 1 頁輸出成新檔案

```bash
pdftk demo.pdf cat 1 output 1.pdf
```

\
將 pdf 第 1 頁到第 5 頁輸出成新檔案

```bash
pdftk demo.pdf cat 1-5 output 1-5.pdf
```

\
將第 10 頁至最末頁輸出成新檔案

```bash
pdftk demo.pdf cat 10-end output 10-end.pdf
```

\
將第 1 頁至第 10 頁與第 20 頁至最末頁輸出成新檔案

```bash
pdftk demo.pdf cat 1-10 20-end output new.pdf
```

\
將多個 pdf 的不同頁面組合成新的 pdf 

```bash
pdftk A=1.pdf B=2.pdf cat A1-3 B1-4 output combined.pdf

# 先定義 A 為 1.pdf，B 為 2.pdf
# 然後截取 1.pdf 的第 1 - 3 頁與 2.pdf 的第 1 - 4 頁，將這 7 頁合併成新 pdf 檔
```

\
幫 pdf 加上密碼

```bash
pdftk demo.pdf output demo-lock.pdf user_pw abc123
```

\
幫 pdf 加上使用者密碼（可閱讀但禁止複製、列印）

```bash
pdftk 1.pdf output demo-noCopy.pdf owner_pw abc123
```

\
幫 pdf 套用 index 格式檔，讓 pdf 可以用 index（書籤）來檢索瀏覽

```bash
pdftk demo.pdf update_info_utf8 indexFile.txt output new_demo.pdf
```

index file 的格式如下：

```bash
BookmarkTitle: Chapter 1
BookmarkLevel: 1
BookmarkPageNumber: 5
BookmarkBegin
BookmarkTitle: Ch 1-1
BookmarkLevel: 2
BookmarkPageNumber: 6
BookmarkBegin
BookmarkTitle: Ch 1-2
BookmarkLevel: 2
BookmarkPageNumber: 10
BookmarkBegin
BookmarkTitle: Chapter 2
BookmarkLevel: 1
BookmarkPageNumber: 15
BookmarkBegin
BookmarkTitle: Ch 2-1
BookmarkLevel: 2
BookmarkPageNumber: 17
BookmarkBegin
BookmarkTitle: Ch 2-2
BookmarkLevel: 2
BookmarkPageNumber: 20
BookmarkBegin
```

檔案內如果有空行與空欄位，輸出時會有error。

* * *

參考資料：

[mnuessler/pdftk in dockerHub](https://hub.docker.com/r/mnuessler/pdftk)

[Bring PDFtk back to life in a container](https://opensource.com/article/18/6/pdf-merge-tool)
