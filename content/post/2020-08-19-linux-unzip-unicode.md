---
author: wade
date: 2020-08-19 07:46:25+00:00
draft: false
title: Linux 使用 unzip 與萬用字元解壓 zip 檔
type: post
url: /post/linux-unzip-unicode/
categories:
- Linux
tags:
- unzip
---

如果想要把資料夾底下所有的 zip 檔全部解壓縮，我們一定會想用 unzip 加 wildcard 字元 * 來處理

```bash
unzip *.zip
```

```bash
# 執行結果：

Archive:  a.zip
caution: filename not matched:  b.zip
caution: filename not matched:  c.zip
```

不過從上面可以看到，使用 <span class="hl-blue">unzip *.zip</span> 來解壓縮只會顯示 <span class="hl-red">filename not matched</span>

\
這是因為對 unzip 而言，<span class="hl-blue">unzip *.zip</span> 的意思是指：


```bash
unzip a.zip b.zip c.zip
```

這段指令解釋為：<span class="hl-red">將 a.zip 這個壓縮檔裡面的 b.zip 與 c.zip 給解壓出來</span>，因此會出現 b.zip 與 c.zip filename not matched

如果想要用 wildcard 字元來解壓縮，必須在檔案的前後用引號包起來，單引號或雙引號皆可

```bash
unzip '*.zip'
```

```bash
# 執行結果

Archive:  a.zip
creating: a/
inflating: a/this_a

Archive:  b.zip
creating: b/
inflating: b/this_b

Archive:  c.zip
creating: c/
inflating: c/this_c

3 archives were successfully processed.
```

這次就成功的解壓縮全部的 zip 檔了！

* * *

參考資料：

[Unzip Multiple Files from Linux Command Line](https://chrisjean.com/unzip-multiple-files-from-linux-command-line/)
