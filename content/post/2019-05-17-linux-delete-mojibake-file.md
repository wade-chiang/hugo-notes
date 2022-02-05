---
author: wade
date: 2019-05-17 15:04:56+00:00
draft: false
title: Linux 刪除亂碼的檔案與資料夾
type: post
url: /post/linux-delete-mojibake-file/
categories:
- Linux
---

有時候難免會從網路下載到一些系統認不得的亂碼檔案，在 GUI 介面裡可以直接用滑鼠點選刪除，在 terminal emulators 裡面，我們也可以去複製亂碼的檔名或是用 tab 鍵來選擇要刪除的檔案，但如果在沒有滑鼠可用，或是檔案太多 tab 不完的時候該怎麼辦呢？

在 Linux 中，每一個檔案與資料夾都有一個專屬的 inode 編號，這個東西記得是與檔案系統有關，不過先簡單把它想成每個檔案獨一無二的身份證字號就好了，既然每個檔案都有這個 inode 編號，我們就可以很容易的使用這個號碼來做檔案處理。


## 刪除檔案或空資料夾

ls 加上 {{< blue >}}-i{{< /blue >}} 的參數就可以顯示出資料夾底下所有檔案、資料夾的 inode
    
```basj
ls -i
```
    
```bash
820565 haha
1191340 ABC
1180042 CBA
```

\
假設「 haha 」就是我們想刪掉的空資料夾或檔案，上面的指令讓我們已得知「 haha 」的 inode 是820565，接下來我們只要再使用 find 指令就可以用 inode 來搜尋檔案並刪除：

```bash
find . -inum 820565 -delete
```

在上一篇文章裡有稍微介紹過 find 這個指令，但這次我們選擇不以檔名（ -name ）作為搜尋條件，而是以 inode（ -inum ）來搜尋，這樣就可以找到想刪除的檔案，另外再加上 -delete 的參數，就可以把 inode 編號 820565 的這個檔案或資料夾 haha 給刪掉了（記得 find 的路徑別設錯）


## 刪除內含檔案的資料夾

如果我們現在要刪的「 haha 」是個裡面有檔案的資料夾，那上面的指令就不能用了，因為無論如何，在 Linux 裡想刪除內有檔案的資料夾，都是需要小心確認的，這時候上一篇最後所提到的 find 指令用法就可以拿出來了：

```bash
find . -inum 820565 -exec rm -rf {} \;
```


## 批次刪除檔案

如果要刪除的檔案有一個以上，我們可以使用迴圈來快速的刪除檔案

```bash
for i in 111 222 333 do find . -inum $i -delete; done
```

\
同理，要刪除資料夾也是一樣的方法

```bash
for i in 444 555 666 do find . -inum $i -exec rm -rf {} \;; done
```
