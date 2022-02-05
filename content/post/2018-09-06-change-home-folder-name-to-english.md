---
author: wade
date: 2018-09-06 10:51:25+00:00
draft: false
title: 將 /home 底下的資料夾名稱改為英文
type: post
url: /post/change-home-folder-name-to-english/
categories:
- Linux
---

安裝 Linux 時，如果一開始選擇以繁體中文安裝，/home 底下的目錄會變成中文，如「音樂」、「影片」、「下載」…等，但蠻多時候中文的目錄會有很多的麻煩，使用以下方法可將目錄改為英文

打開 terminal，依序輸入指令

```bash
export LANG=en_US
```
    
```bash
xdg-user-dirs-gtk-update
```

執行後彈出的視窗會詢問是否將資料夾轉為英文路徑，選同意並關閉

\
在 terminal 輸入指令:
    
```bash
export LANG=zh_TW.UTF-8
```

關閉 terminal 並重開機，下次進入系統時，會提示是否要把剛才轉換好的目錄改回中文，選擇不要並且勾上不再提示，並取消修改，主資料夾的中文轉英文就完成了
