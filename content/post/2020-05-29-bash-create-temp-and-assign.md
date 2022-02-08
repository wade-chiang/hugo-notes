---
author: wade
date: 2020-05-29 07:26:27+00:00
draft: false
title: Bash 建立暫存檔並賦值給變數
type: post
url: /post/bash-create-temp-and-assign/
categories:
- Linux
tags:
- Bash
- Shell Script
---

我們在寫 Shell Script 的過程中，有時會需要將資料放到一個暫存檔中使用，等到用完後，Script 再把這個暫存檔刪掉。例如使用 ls 把某個目錄底下的 mp4 檔找出來，並把找出的 mp4 檔列表存到一個空白文件裡，之後的程式或迴圈就可以導入這份列表來使用，程式結束後再將該列表給刪除。

通常我們可以自訂檔案的名稱，並將內容寫入這個空白檔案，不過自訂名稱有可能與目的資料夾裡的檔案撞名，或是需要自訂的暫存檔太多，實在懶得想檔名，這時候我們就可以使用 mktemp 這個指令來完成我們的需求。

## mktemp 基本用法

直接執行 mktemp 指令，就會在 /tmp 資料夾裡新增一個暫存檔，預設檔名格式為 tmp.XXXXXXXXXX

```bash
mktemp
```

```bash
# 執行結果：

/tmp/tmp.OVWLPZlo5K
```

### 建立暫存資料夾

加上 -d 參數，就可以在 /tmp 中建立一個暫存資料夾而非檔案

```bash
mktemp -d
```

```bash
# 執行結果：

/tmp/tmp.C8Uhfp3qDJ
```

\
檢查該檔案的格式

```bash
file /tmp/tmp.C8Uhfp3qDJ/
```

```bash
# 執行結果：

/tmp/tmp.C8Uhfp3qDJ/: directory
```

### 建立固定格式的暫存檔

在 mktemp 指令後接上想要的格式，並且檔名格式中必須包含至少三個連續的「X」，例如我希望暫存檔的開頭是 2020-09-07，日期後面再接上三個亂數：

```bash
mktemp 2020-09-07-XXX
```

```bash
# 執行結果：

2020-09-07-MWF
```

```bash
mktemp 2020-09-07-XXX
```

```bash
# 執行結果：

2020-09-07-ygG
```

「X」可以在檔名中的任何地方，只要確保至少有三個連續的 X 即可

### 指定暫存檔的路徑

mktemp 預設會將暫存檔或資料夾放到 /tmp 底下（並且權限為 600  或 700），加上 <span class="hl-blue">-p 參數可指定檔案或目錄要存放的位置</span>

```bash
mktemp -p /home
```

```bash
# 執行結果：

/home/tmp.LikeDj0mCL
```


## 在 Shell Script 中建立暫存檔並賦值給變數

```bash
tmpFile=$(echo $(mktemp))
```

上面的用法會使用 mktemp 建立一個隨機檔名的暫存檔，並且賦值給變數 tmpFile，下面用一個簡單的 script 來做範例，檔名就取作 mktemp.sh


```bash
#!/bin/bash

# 建立兩個亂數的空白檔案，並分別賦值給變數 tmpFile1 與 tmpFile2
tmpFile1=$(echo $(mktemp))
tmpFile2=$(echo $(mktemp))

# 將 Hello 存到變數 tmpFile1、World 存到 tmpfile2，並且讀取兩個變數，檢查是否有正確寫入
echo "Hello" > $tmpFile1
echo "content in tmpFile1: "
cat $tmpFile1

echo -e "\n"

echo "World" > $tmpFile2
echo "content in tmpFile2: "
cat $tmpFile2
```

\
為檔案加上執行權限

```bash
chmod +x mktemp.sh
```

\
最後執行 Script 應該會出現下面的結果：

```bash
bash ./mktemp.sh
```

```bash
# 執行結果：

content in tmpFile1:
Hello


content in tmpFile2:
World
```

看到兩個檔案內容分別為 Hello 與 World，表示 mktemp 建立的隨機檔名有正確的賦值！
