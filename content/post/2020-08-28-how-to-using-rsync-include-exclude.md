---
author: wade
date: 2020-08-28 01:22:04+00:00
draft: false
title: rsync 的 include 與  exclude 用法
type: post
url: /post/how-to-using-rsync-include-exclude/
categories:
- Linux
tags:
- rsync
---

rsync 除了直接同步兩端的所有檔案以外，還有一個非常實用的功能就是 <span class="hl-blue">include</span>（包含）與 <span class="hl-blue">exclude</span>（排除）。include 可以讓我們只同步特定的檔案，exclude 則是讓我們排除不要同步的檔案。

如果我們要指定或排除的檔案只有一、兩個，那也許直接加在 rsync 指令中就好了，但如果有四、五個以上或是更多的時候，我們可以<span class="hl-red">把指定的檔案寫成一個 list 檔，在 rsync 同步時引用這份清單進行 include 或 exclude 的動作</span>。


## 環境說明

系統：Ubuntu 20.04.1

rsync 版本：3.1.3

範例的 source 資料夾內容如下：


```bash
source/
├── a
│   ├── a1
│   └── a2
├── b
│   ├── b1
│   └── b2
└── c
├── c1
└── c2

3 directories, 6 files
```

source 資料夾中有 a、b、c，三個子目錄，子目錄中各有兩個檔案


## include from file 的用法

目的：只同步 source 中的 a1、a2 與 c2

\
首先把我們要 include 的檔案做成清單，清單檔名為 <span class="hl-blue">includeList</span>（檔名可自取）

檔案內容如下：

```bash
a/a1
a/a2
c/c2
```

<span class="hl-red">includeList 裡面檔案及路徑的格式，必須是以 source 端本身的相對路徑來列舉，不能使用絕對路徑</span>，這是 include 與 exclude list 最重要的部分。

例如我要同步 /home/source 底下的 a 與 b，list file 裡就只要寫 a、b 就好了，不要寫 /home/source/a 與 /home/source/b

\
接下來測試看看同步是否成功

```bash
rsync -avrP --files-from=includeList source/ backup/ --dry-run
```

* <span class="hl-green mono">--file-from=FILE</span>：只同步 FILE 裡面列舉的檔案，<span class="hl-red">雖然 rsync 有 --include-from= 的參數，而且看起來就像是我們要的功能，但幾番測試後發現 --file-from= 才是讀取同步列表！</span>--include-from= 的功用暫時不得而知。
* --dry-run：只顯示模擬同步後的結果，不會真的執行同步


```bash
# 執行結果

building file list ...
5 files to consider
a/
a/a1
a/a2
c/
c/c2

sent 149 bytes  received 31 bytes  360.00 bytes/sec
total size is 0  speedup is 0.00 (DRY RUN)
```

果然只有同步 a1、a2 及 c2，如果沒問題的話，把 <span class="hl-blue">--dry-run</span> 去掉再執行一次 rsync 就完成了！


## exclude from file 的用法

目的：同步時排除 a1、b1、c1，也就是這三個檔案以外的內容都要同步

\
一樣把我們要 exclude 的檔案做成清單，清單檔名為 <span class="hl-blue">excludeList</span>

檔案內容如下：

```bash
a/a1
b/b1
c/c1
```

&nbsp;
<span class="hl-red">再次提醒，list 的檔案路徑寫法必須是 source 資料夾的相對路徑！</span>

\
接著測試同步

```bash
rsync -avP --exclude-from=excludeList source/ backup/ --dry-run
```

* <span class="hl-green mono">--exclude-from=File</span>：同步時排除 FILE 裡面的內容（這次的參數就比較顧名思義了）

```bash
# 執行結果

sending incremental file list
./
a/
a/a2
b/
b/b2
c/
c/c2

sent 205 bytes  received 40 bytes  490.00 bytes/sec
total size is 0  speedup is 0.00 (DRY RUN)
```

a1、b1、c1 都被排除掉啦


## 如果寫成絕對路徑…？

前面都一直強調要用 source 的相對路徑來列清單，那如果我們用絕對路徑來寫 <span class="hl-blue">includeList</span>，內容如下：

```bash
/tmp/source/a/a1
/tmp/source/a/a2
/tmp/source/c/c2
```

\
接著執行 rsync 並讀取這份寫著絕對路徑的清單

```bash
rsync -avP --files-from=includeList /tmp/source/ /tmp/backup/ --dry-run
```

```bash
# 執行結果：

building file list ...
rsync: link_stat "/tmp/source/tmp/source/a/a1" failed: No such file or directory (2)
rsync: link_stat "/tmp/source/tmp/source/a/a2" failed: No such file or directory (2)
rsync: link_stat "/tmp/source/tmp/source/c/c2" failed: No such file or directory (2)
0 files to consider

sent 18 bytes  received 12 bytes  60.00 bytes/sec
total size is 0  speedup is 0.00 (DRY RUN)
rsync error: some files/attrs were not transferred (see previous errors) (code 23) at main.c(1207) [sender=3.1.3]
```

可以看到 rsync 找不到清單裡面的檔案，原因是前綴的完整路徑 rsync 會先幫我們帶上，從這邊就可以判斷出 list file 必須使用相對路徑了。
