---
author: wade
date: 2019-03-04 15:21:14+00:00
draft: false
title: 使用 find 在 Linux 搜尋檔案
type: post
url: /post/linux-find-file/
categories:
- Linux
---

在 Linux 裡，可以使用 {{< blue >}}find{{< /blue >}} 這個指令來搜尋檔案，另外還可以搭配其它複合指令來達成一些批次工作，非常的方便。

\
從全系統尋找特定檔案
    
```bash
sudo find / -name "檔案名稱"
```

\
在特定目錄搜尋特定檔案
    
```bash
cd /目錄名稱
```
    
```bash
sudo find . -name "檔案名稱"
```

\
從全系統中尋找含有某個關鍵字的檔案
    
```bash
sudo find / -name "*檔案名稱*"
```

在檔案名稱的頭尾加上 * 號，表示關鍵字的前後有任意字元也會被找出來

\
找出當前目錄底下，所有的資料夾

```bash
find . -type d
```

\
找出當前目錄底下，所有的檔案（不包含資料夾）
    
```bash
find . -type f
```

\
找出全系統中的某個特定檔案，並且將它刪除

這個功能在刪除一些系統自動建立的垃圾檔案特別有用，例如 .Thumb.db，這個系統自動建立的縮圖檔，它可能會在任何有圖片的資料夾裡，使用 find 加上複合指令可以輕易的將電腦裡所有的 Thumb.db 檔案刪掉

```bash
sudo find / -name "Thumb.db" -exec rm {} \;
```

在上面指令中，{{< red >}}{} 代表的意義為前面 find 所找出來的東西，因此是一個變數，任何找到的Thumb.db檔案都會被 rm 所刪除{{< /red >}}
