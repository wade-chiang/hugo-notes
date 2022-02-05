---
author: wade
date: 2020-07-12 17:07:32+00:00
draft: false
title: Shell Script 截取檔案名稱與副檔名
type: post
url: /post/shell-script-get-filename-and-ext/
categories:
- Developer
tags:
- Bash
- Shell Script
---

在 Shell Script 中經常會需要對檔案做存取，大多數的時候使用絕對路徑會是用來指定檔案的最佳解，因為一定不會出錯。  
常用的指令 {{< blue >}}find  絕對路徑{{< /blue >}} ，找到的檔案也都是帶著完整路徑

```bash
find /tmp -name "*My Project*"
```

```bash
# 執行結果：

/tmp/Documents/My Project.txt
```

\
不過我們也時常需要用到不帶路徑的檔名，或是不帶副檔名的檔名，下面就來介紹怎樣截取檔案名稱

\
截取不含完整路徑的檔名

```bash
#!/bin/bash

fullPath='/tmp/Documents/My Project.txt'

fileName=$(basename "$fullPath")

echo $fileName
```

```bash
# script 執行結果：

My Project.txt
```

fullPath 設值時，檔案的絕對路徑建議都用雙引號 "" 或單引號 '' 包起來，檔名有空白的地方才不會出錯

{{< blue >}}basename $fullPath{{< /blue >}} 這個指令就是在取得非完整路徑的純檔名+副檔名。同樣地 {{< blue >}}$fullPath{{< /blue >}} 這個變數也要用雙引號 "" 包起來這樣才不會出錯（不可用單引號）

\
截取檔名且不含完整路徑與副檔名

```bash
#!/bin/bash

fullPath='/tmp/Documents/My Project.txt'

fileName=$(basename "$fullPath")

name="${fileName%.*}"

echo $name
```

```bash
# script 執行結果：

My Project
```

\
僅截取副檔名

```bash
#!/bin/bash

fullPath='/tmp/Documents/My Project.txt'

fileName=$(basename "$fullPath")

ext="${fileName##*.}"

echo $ext
```

```bash
# script 執行結果：

txt
```

一樣別漏了引號，關於 {{< blue >}}"${fileName%.*}"{{< /blue >}} 與 {{< blue >}}"${fileName##*.}"{{< /blue >}} 的用法可參考[鳥哥網站 Bash 篇的 10.2.8 章](https://linux.vbird.org/linux_basic/centos7/0320bash.php#variable_other)

* * *

參考資料：

[How to Extract Filename & Extension in Shell Script](https://tecadmin.net/how-to-extract-filename-extension-in-shell-script/)
