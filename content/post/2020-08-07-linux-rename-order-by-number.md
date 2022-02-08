---
author: wade
date: 2020-08-07 07:57:51+00:00
draft: false
title: Linux 以數字順序批次改檔名並前綴補 0
type: post
url: /post/linux-rename-order-by-number/
categories:
- Linux
tags:
- Bash
---

在用數字順序排檔名時，前綴補 0 可以讓檔案排序更整齊方便，也比較好處理，下面範例是之前我有用過的方法，分別使用了 <span class="hl-blue">rename.ul</span> 與 <span class="hl-blue">Shell Script</span>


## 使用 rename.ul

這是 <span class="hl-blue">rename.ul</span> man page 裡的 example，也算是常用到的情況

將 A1、A2… ~ A100 改為 A001、A002… ~ A100

```bash
rename.ul A A0 A?
```

```bash
rename.ul A A0 A??
```

<span class="hl-blue">rename.ul</span> 的用法為：**rename.ul** <span class="hl-red">原字串</span> <span class="hl-green">替換字串</span> <span class="hl-blue">要換的檔案</span>

在第一個指令中，先把 A 後面接一個字元的檔案（A?，如 A1 ~ A9） 的 A 改成 A0，因此 A1 ~ A9 就會變成 A01 ~ A09

接著第二個指令再把 A 後面接兩個字元的檔案（A??，A01 ~ A99）也多個 0，就變成 A001 ~ A099

## 使用 Shell Script

一樣是將 A1 ~ A100 改成 A001 ~ A100，可以用一行 shell script 來處理

```bash
ls -v | cat -n | while read line file; do mv "$file" A$(printf "%03d" $line); done
```

這個方法主要是用了 <span class="hl-blue">cat -n</span> 印出的行號來做迴圈處理，建議先一步一步的測試會比較理解這個方法，最後用 echo 來測試檔案輸出的結果，確定後再正式使用

* <span class="hl-green mono">ls -v</span>：使用正常的數字大小排序
* <span class="hl-green mono">cat -n</span>：將前面排序好的列表加上行號
* <span class="hl-green mono">while read line file</span>：以迴圈分別將行號與檔名存到變數 line 與 file
* <span class="hl-green mono">printf "03d% $line"</span>：檔名如果不到3個字元，前面就用 0 來補齊，如果是 1 ~ 100 最多就是三個字，因此用 "03d%"，如果是 1 ~ 1000 那就是用 "04d%" 了

這邊要注意的是如果 <span class="hl-blue">ls -v</span> 得到的順序不是我們想要的，那就要用 <span class="hl-blue">sort</span> 依自己的需求再做一次排序，後面再接上 <span class="hl-blue">cat -n</span>

本來還想寫用 seq 指令先做出數列的 list，再讀取 list 作為檔名來更名的方法，不過沒有上面用 script 一行搞定來得簡潔，所以類似的方法就之後再提了。

另外我時常會有要將音樂檔重命名的需求，不過目前都用 mp3tag 來做 leading zero 的步驟，使用 shell 的方法暫時還不知道（雖然一張專輯的曲目也沒有多到一定得用批次處理）

這邊就先留下格式，看之後有沒有辦法搞定！

```bash
1 - Third Stone from the Sun
2 - A Remark You Made
3 - Continuum
4 - Jaco
5 - Fall'n Star
6 - Okonkole y Trompa
7 - Come on, Come Over
8 - Three Views of a Secret
9 - Dania
10 - Portrait of Tracy
11 - Song for Jaco - Song for a Friend
```

* * *

參考資料：

[Renaming files in a folder to sequential numbers](https://stackoverflow.com/questions/3211595/renaming-files-in-a-folder-to-sequential-numbers)
