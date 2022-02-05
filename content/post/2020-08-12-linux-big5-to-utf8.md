---
author: wade
date: 2020-08-12 07:17:44+00:00
draft: false
title: Linux 將 BIG5 文字檔轉成 UTF-8 格式
type: post
url: /post/linux-big5-to-utf8/
categories:
- Linux
tags:
- Bash
---

自從日常的桌面環境從 Windows 轉到 Linux 後，時常會發現原本的文字檔在 terminal 裡變成亂碼，這是因為以前使用 Windows 沒有養成把檔案存成 unicode 的習慣，因此下面就來說明如何將大量的 BIG5 文字檔轉成 UTF-8 格式的文字檔


## 將 BIG5 文字檔批次轉成 UTF-8 格式

首先檢查資料夾底下的文字檔格式

```bash
file *.txt
```

```bash
# 執行結果：

a.txt:            UTF-8 Unicode (with BOM) text, with no line terminators
BG1校正-Big5.txt:  ISO-8859 text, with very long lines
b.txt:            UTF-8 Unicode (with BOM) text, with very long lines, with no line terminators
c.txt:            UTF-8 Unicode (with BOM) text, with very long lines
e.txt:            ASCII text, with very long lines
readme.txt:       ISO-8859 text
work.txt:         ISO-8859 text
多重安裝BG2.txt:   ISO-8859 text, with very long lines
翻譯 readme.txt:   ISO-8859 text
```

使用 {{< blue >}}file{{< /blue >}} 指令可以看到檔案的格式，這邊顯示 {{< blue >}}ISO-8859{{< /blue >}} 的就是 {{< blue >}}BIG5{{< /blue >}} 編碼的檔案（也可以用 {{< blue >}}cat{{< /blue >}} 看一下檔案內容，有亂碼的話就是了）

\
接著將這幾個 BIG5 的檔案存成一個列表，供等一下的轉檔使用

```bash
file *.txt | grep "ISO-8859" | awk 'BEGIN {FS=": "};{print $1}' > list
```

\
使用 while loop 與 {{< blue >}}iconv{{< /blue >}} 將列表中的檔案轉換成 UTF-8 格式

```bash
while read file; 
do
  iconv -f BIG5 -t UTF-8 "${file}" > "${file}.new" && 
  mv -f "${file}.new" "${file}"; 
done < list
```

\
再次檢查檔案格式

```bash
file *.txt
```

```bash
# 執行結果：

a.txt:            UTF-8 Unicode (with BOM) text, with no line terminators
BG1校正-Big5.txt: UTF-8 Unicode text
b.txt:            UTF-8 Unicode (with BOM) text, with very long lines, with no line terminators
c.txt:            UTF-8 Unicode (with BOM) text, with very long lines
e.txt:            ASCII text, with very long lines
list:             UTF-8 Unicode text
readme.txt:       UTF-8 Unicode text
work.txt:         UTF-8 Unicode text
多重安裝BG2.txt:  UTF-8 Unicode text, with very long lines
翻譯 readme.txt:  UTF-8 Unicode text
```


## 去掉檔案中的BOM

在上面的執行結果中，會看到有些檔案是帶有 BOM 的，BOM 是 Windows 裡特有的檔案記號，用來區別 UTF-8、UTF-16 與 UTF-32，如果用不到的話，也可以把 BOM 給刪掉

\
一樣先將帶有 BOM 的檔案存成列表

```bash
file *.txt | grep "with BOM" | awk 'BEGIN {FS=": "};{print $1}' > list
```

\
將帶有 BOM 的檔案批次刪除 BOM

```bash
while read file;
do
  sed -i '1s/^\xEF\xBB\xBF//' "${file}";
done < list
```

\
再次檢查檔案格式

```bash
file *.txt
```

```bash
# 執行結果：

a.txt:            UTF-8 Unicode text, with no line terminators
BG1校正-Big5.txt: UTF-8 Unicode text
b.txt:            ASCII text, with very long lines, with no line terminators
c.txt:            UTF-8 Unicode text, with very long lines
e.txt:            ASCII text, with very long lines
list:             UTF-8 Unicode text
list_bom:         ASCII text
readme.txt:       UTF-8 Unicode text
work.txt:         UTF-8 Unicode text
多重安裝BG2.txt:  UTF-8 Unicode text, with very long lines
翻譯 readme.txt:  UTF-8 Unicode text
```


## 解決「no line terminators」的問題

一般的文字檔在每一行的最後都會有個分行符號，如果在檔案的最末端沒有分行符號的話，用 {{< blue >}}cat{{< /blue >}} 查看檔案後，shell prompt 不會顯示在下一行，而是會接在查看的檔案後面，從上面的執行結果可以看到 a.txt 與 b.txt 顯示了 {{< red >}}with no line terminators{{< /red >}}，接著我們用 {{< blue >}}cat -A{{< /blue >}} 來查看：

```bash
cat -A b.txt
```

```bash
# 執行結果：

This is file b.txt Enjoy!!wade@ubuntu:~$
```

可以看到 {{< blue >}}wade@ubuntu:~${{< /blue >}} 這個 shell prompt 果然沒有出現在下一行

因此最後我們再把 line terminator 給加回來，這樣文字檔案的轉檔與整理就算是告一段落了（雖然這個步驟不加也不影響）

\
將沒有 line terminators 的檔案匯出列表供之後使用

```bash
file *.txt | grep "with no line terminators" | awk 'BEGIN {FS=": "};{print $1}' > list
```

\
將這些檔案加上 line terminator

```bash
while read file;
do
  awk '{printf("%s\n",$0)}' "${file}" > "${file}.new" &&
  mv -f "${file}.new" "${file}";
done < list
```

\
重新檢查檔案，確定 line terminator 已被加上

```bash
cat -A b.txt
```

```bash
# 執行結果：

This is file b.txt Enjoy!!
wade@ubuntu:~$
```

```bash
file *.txt
```

```bash
# 執行結果：

a.txt:            UTF-8 Unicode text
BG1校正-Big5.txt: UTF-8 Unicode text
b.txt:            ASCII text, with very long lines
c.txt:            UTF-8 Unicode text, with very long lines
e.txt:            ASCII text, with very long lines
readme.txt:       UTF-8 Unicode text
work.txt:         UTF-8 Unicode text
多重安裝BG2.txt:  UTF-8 Unicode text, with very long lines
翻譯 readme.txt:  UTF-8 Unicode text

# b.txt 與 e.txt 內容為全英文數字，不一定要使用 Unicode
```

* * *

參考資料：

[How can I make iconv replace the input file with the converted output?](https://unix.stackexchange.com/questions/10241/how-can-i-make-iconv-replace-the-input-file-with-the-converted-output)

[“file” command yields “ASCII text, with no line terminators”, unless I first edit the file in vim](https://superuser.com/questions/987929/file-command-yields-ascii-text-with-no-line-terminators-unless-i-first-edi)
