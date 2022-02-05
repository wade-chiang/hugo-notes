---
author: wade
date: 2020-08-19 04:46:46+00:00
draft: false
title: 解決 Linux 上 zip 檔解壓縮的中文亂碼問題
type: post
url: /post/linux-zip-mojibake-resolve/
categories:
- Linux
tags:
- Win
- zip
- 亂碼
---

如果資料夾裡的檔案有中文檔名，然後在 Win 上面壓縮這個資料夾並丟到 Linux 上解壓縮，會發現解壓出來的檔案名稱都是亂碼

```bash
unzip test.zip

Archive:  test.zip
creating: test/
extracting: test/╝╓├╨.tab
extracting: test/╡з░O.txt
```

```bash
ls -l test

total 0
-rw-rw-r-- 1 wade wade 0  8月 19 12:11 ╝╓├╨.tab
-rw-rw-r-- 1 wade wade 0  8月 19 12:11 ╡з░O.txt
```

\
這是由於 {{< red >}}Linux 預設是以 utf-8 的編碼來解壓縮，但 Win 上面預設使用 big5 碼來壓縮{{< /red >}}，因此如果要在 Linux 上正確的解開 big5 的 zip 檔，只要在解壓縮時使用參數 {{< blue >}}-O{{< /blue >}} 指定編碼就可以了


```bash
unzip -O big5 test.zip

Archive:  test.zip
creating: test/
extracting: test/樂譜.tab
extracting: test/筆記.txt
```


```bash
ls -l test

total 0
-rw-rw-r-- 1 wade wade 0  8月 19 12:11 樂譜.tab
-rw-rw-r-- 1 wade wade 0  8月 19 12:11 筆記.txt
```

* {{< green >}}{{< mono >}}-O CHARSET{{< /green >}}{{< /mono >}}：為 DOS、Windows 與 OS/2 的壓縮檔指定編碼
* {{< green >}}{{< mono >}}-I CHARSET{{< /green >}}{{< /mono >}}：為 Unix 或其它系統的壓縮檔指定編碼
