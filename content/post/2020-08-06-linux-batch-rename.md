---
author: wade
date: 2020-08-06 08:32:05+00:00
draft: false
title: Linux 使用 rename 進行大量檔案批次更名
type: post
url: /post/linux-batch-rename/
categories:
- Linux
tags:
- Bash
---

Linux 的 rename 指令可以做大量的檔案更名，它使用 perl 的正規表式法來訂定格式，也稱為 perl-rename，因此 <span class="hl-blue">prename</span> 與 <span class="hl-blue">rename</span> 兩個指令是相同的。不過在 Ubuntu 20.04 之後，rename 指令已經沒有內建了，必須自行安裝。

在 Ubuntu 20.04 內建有另一款叫 <span class="hl-blue">rename.ul</span> 的更名指令，兩個指令的使用方法並不相同，這邊先以 perl rename 來試範一些我常用的更名方法


## 安裝 rename

Ubuntu 20.04 安裝 <span class="hl-blue">rename</span>（Ubuntu 18.04 以前已內建）

```bash
sudo apt install rename
```

\
如果是 CentOS 的話，則要安裝 <span class="hl-blue">prename</span>（perl-rename）

```bash
sudo yum install prename
```


## rename 基本用法

rename 's/<span class="hl-red">原字串</span>/<span class="hl-green">新字串</span>/'<span class="hl-blue">要改的檔案</span>

* <span class="hl-green mono">-n</span>：僅列出更名後的結果，不會真的進行更名，建議更名前一定要檢查
* <span class="hl-green mono">-d</span>：不對資料夾做更名，僅針對目標路徑下的檔案


## 基本檔名更改

將 A1、A2、A3 改為 B1、B2、B3


```bash
rename 's/A/B/' *
```

如果要更改資料夾底下所有的檔案，最後用 * 號即可，如果碰到要改一些符號如：<span class="hl-blue">(</span>、<span class="hl-blue">[</span>，要在符號前面加上「<span class="hl-blue">\</span>」跳脫字元，詳細說明可 google 搜尋「<span class="hl-green">bash 跳脫字元</span>」


## 在檔名開頭或結尾插入文字

將 A1、A2、A3 改為 ZA1、ZA2、ZA3

```bash
rename 's/^/Z/' *
```

\
將 A1、A2、A3 改為 A10、A20、A30

```bash
rename 's/$/0/' *
```

* <span class="hl-green mono">^</span>：檔名的開頭
* <span class="hl-green mono">$</span>：檔名的結尾


## 批次更改副檔名

將 *.jpeg 改成 *.jpg

```bash
rename 's/\.jpeg$/\.jpg/' *.jpeg
```

「.」的前面要加上跳脫字元，<span class="hl-red">原檔名加上 $ 是因為要改的是結尾的副檔名，沒有加 $ 的話，如果原檔名中也有 jpeg 的字串，會被一併更改</span>。


## 檔名的英文大小寫轉換

將檔名中的英文小寫全部轉為大寫

```bash
rename 'y/a-z/A-Z/' *
```

\
將檔名中的英文大寫全部轉為小寫

```bash
rename 'y/A-Z/a-z/' *
```
