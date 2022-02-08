---
author: wade
date: 2020-08-19 08:44:37+00:00
draft: false
title: Linux Shell 處理檔名開頭為連字號「-」的檔案
type: post
url: /post/linux-leading-hyphen-issue/
categories:
- Linux
tags:
- Bash
---

在 Bash 裡，如果檔案的檔名開頭是連字號「<span class="hl-blue">-</span>」（hyphen），你會發現對這些檔案下任何指令都會出問題

```bash
ls -l

總計 0
-rw-rw-r-- 1 stanley stanley 0  8月 19 16:02 -a
-rw-rw-r-- 1 stanley stanley 0  8月 19 15:48 --b
```

```bash
rm -a

rm：無效的選項 -- 「a」
Try 'rm ./-a' to remove the file '-a'.
Try 'rm --help' for more information.
```

```bash
cp --b b

cp: 'b' 後缺少了目的地檔案
Try 'cp --help' for more information.
```

這是因為 Bash 基本上都是用一個或兩個連字號作為參數的開頭，例如 -h 與 --help，因此檔名的開頭如果也是連字號 - 或 -- 的時候，就會被誤認為是參數

下面有兩種方法可以解決這個問題


## 在指令後面先加上兩個連字號「--」

```bash
rm -- -a
```

指令後如果先加上兩個連字號，那麼之後檔名開頭的 - 就會正常的被看作是檔名的一部分，而不是參數的引用


## 為檔案加上路徑

<span class="hl-red">推薦</span>

```bash
cp ./--b b
```

```bash
cp /tmp/--b b
```

只要為目標檔案加上絕對路徑或相對路徑，指令都可以正確的解讀檔名，個人是比較推薦這個用法！

* * *

參考資料：

[How do I delete a file whose name begins with “-” (hyphen a.k.a. dash or minus)?](https://unix.stackexchange.com/questions/1519/how-do-i-delete-a-file-whose-name-begins-with-hyphen-a-k-a-dash-or-minus)
