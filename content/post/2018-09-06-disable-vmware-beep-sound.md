---
author: wade
date: 2018-09-06 11:00:49+00:00
draft: false
title: 關閉 VMWare 虛擬機的 Beep sound
type: post
url: /post/disable-vmware-beep-sound/
categories:
- Linux
---

使用 VMWare 的虛擬機時，它會連主機板上的蜂鳴器都模擬出來，所以常常會聽到嗶來嗶去的聲音

其實只要加上一個設定就可以把這個擾人的聲音給取消

首先找到你的虛擬機設定檔，在我們放虛擬機檔案的資料夾裡，會有個 *.vmx 的檔案

打開 vmx 檔後，加入一行：

    
```bash
mks.noBeep = "TRUE"
```

就可以關閉虛擬機的 PC Speaker 了
