---
author: wade
date: 2020-07-23 18:08:31+00:00
draft: false
title: Ubuntu 將 cue、bin 光碟映像檔轉為 iso 格式
type: post
url: /post/ubuntu-cue-bin-to-iso/
categories:
- Linux
tags:
- Ubuntu
---

在 Ubuntu 裡可以用 {{< blue >}}bchunk{{< /blue >}} 這個軟體來轉檔，方法很簡單

\
安裝 bchunk

```bash
sudo apt install bchunk
```

\
以預設模式轉檔

```bash
bchunk Rich3.bin Rich3.cue Rich3-
```

```bash
# 執行結果：

Reading the CUE file:

Track  1: MODE1/2352    01 00:00:00
Track  2: AUDIO         01 03:18:32
Track  3: AUDIO         00 05:05:13 01 05:07:12
Track  4: AUDIO         00 06:51:17 01 06:53:16
Track  5: AUDIO         00 09:05:43 01 09:07:42
Track  6: AUDIO         00 12:43:20 01 12:45:19

Writing tracks:

1: Rich3-01.iso   29/29   MB  [********************] 100 %
2: Rich3-02.cdr   17/17   MB  [********************] 100 %
3: Rich3-03.cdr   17/17   MB  [********************] 100 %
4: Rich3-04.cdr   22/22   MB  [********************] 100 %
5: Rich3-05.cdr   36/36   MB  [********************] 100 %
6: Rich3-06.cdr   17/17   MB  [********************] 100 %
```

程式後的第一個選項為 *.bin，第二個選項為 *.cue，最後一個選項則是轉檔出來的 iso 檔名，{{< red >}}建議在檔名最後加個「 - 」，這樣轉出來的檔名也會比較整齊{{< /red >}}

如果 cue 與 bin 的映像檔裡沒有 cd 音軌的話，應該只會轉出一個 iso 檔，但由於這次我要轉的是有 cd 音軌的映像檔，所以轉檔後資料部分在 .iso，音軌部分會照軌數轉成 .cdr 檔（原生的 CD 音源格式，可以用來燒錄成 Audio CD，也可以轉成 wav 檔）

\
如果不喜歡 cdr 檔的話，也可以轉成常見的 wav 檔

```bash
bchunk -s -w Rich3.bin Rich3.cue Rich3-
```

```bash
# 執行結果：

Reading the CUE file:

Track  1: MODE1/2352    01 00:00:00
Track  2: AUDIO         01 03:18:32
Track  3: AUDIO         00 05:05:13 01 05:07:12
Track  4: AUDIO         00 06:51:17 01 06:53:16
Track  5: AUDIO         00 09:05:43 01 09:07:42
Track  6: AUDIO         00 12:43:20 01 12:45:19

Writing tracks:

1: Rich3-01.iso   29/29   MB  [********************] 100 %
2: Rich3-02.wav   17/17   MB  [********************] 100 %
3: Rich3-03.wav   17/17   MB  [********************] 100 %
4: Rich3-04.wav   22/22   MB  [********************] 100 %
5: Rich3-05.wav   36/36   MB  [********************] 100 %
6: Rich3-06.wav   17/17   MB  [********************] 100 %
```

不過說真的，把 cue & bin 轉成 iso 檔其實是蠻沒必要的行為，畢竟會用這種格式的 cd 很多都是有 audio track 的，轉換後檔案還被分的更多，感覺並沒有比較方便。

就我的印象中，可以將帶 audio track 的 cd 轉成唯一單檔 image 的格式好像是 {{< blue >}}.img{{< /blue >}} 與 {{< blue >}}.nrg{{< /blue >}}，不過一般最常用的還是  cue + bin，純 audio cd 的話則是  cue + wav

* * *

參考資料：

[How can I convert a .cue / .bin ( with cdr tracks) image into a single .iso file?](https://unix.stackexchange.com/questions/29671/how-can-i-convert-a-cue-bin-with-cdr-tracks-image-into-a-single-iso-file)

[How to really convert cue/bin files to ISO format?](https://superuser.com/questions/314554/how-to-really-convert-cue-bin-files-to-iso-format)
