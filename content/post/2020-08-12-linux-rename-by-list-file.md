---
author: wade
date: 2020-08-12 01:56:13+00:00
draft: false
title: Linux 用檔名清單批次重新命名檔案
type: post
url: /post/linux-rename-by-list-file/
categories:
- Linux
tags:
- Bash
---

如果我有一張專輯的音樂檔，檔名的格式較複雜，例如：

```bash
Herbie_Hancock-Head_Hunters[11245] - 1 - Chameleon.flac
Herbie_Hancock-Head_Hunters[11243] - 2 - Watermelon Man.flac
Herbie_Hancock-Head_Hunters[11258] - 3 - Sly.flac
Herbie_Hancock-Head_Hunters[11241] - 4 - Vein Melter.flac
```

\
想要把檔名改簡潔一點，我可以一個一個慢慢改，也可以先把想要的檔名做成清單如下：

```bash
01 - Chameleon.flac
02 - Watermelon Man.flac
03 - Sly.flac
04 - Vein Melter.flac
```

將上面的清單存成一個文字檔後，我們就可以用這份清單來重命名原始的音樂檔

```bash
for file in *.flac;
do
  read list
  mv "${file}" "${list}";
done < /PATH/List_File
```

通常音樂檔可以用很多工具如 mp3tag 來批次改檔名，不過這個方法用在影片或電視劇就很方便了，可以從 wiki 或其它地方將每一集的標題與集數貼好整理成清單再來做批次更名
