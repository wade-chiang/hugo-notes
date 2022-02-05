---
author: wade
date: 2018-06-25 22:51:18+00:00
draft: false
title: 修正 tty console 中的方塊字
type: post
url: /post/fix-tty-tofu/
image: "https://image.wadeism.net/tty_lang01.png"
categories:
- Linux
tags:
- Bash
---

當我們安裝 Linux 時選擇中文語言，安裝完成後的預設環境就會是中文，可以用下面的指令來檢查 LANG 這個環境變數
    
```bash
echo $LANG
```
    
```bash
# 執行結果：
    
zh_TW.UTF-8
```

\
之前的文章有提到，tty console 對非西方的文字支援度並不好，在這種情況下 tty console 會有很多文字顯示會呈現方塊字，因為我們的環境變數是中文，但 tty console 是無法顯示中文的

![](https://image.wadeism.net/tty_lang01.png)

\
下面就來說明如何讓 tty console 正確的顯示英文

編輯 {{< blue >}}~/.bashrc{{< /blue >}} 檔
    
```bash
vim ~/.bashrc
```

\
將下面的 script 加到 {{< blue >}}.bashrc{{< /blue >}} 檔的最底下後存檔離開
    
```bash
for ttyi in 1 2 3 4 5 6
    do
     if [ "$(tty)" = "/dev/tty$ttyi" ]; then
      export LC_ALL="en_US.UTF-8"
      export LANGUAGE="en_US.UTF-8"
      export LANG="en_US.UTF-8"
     fi
    done
```

\
現在切換 tty1 到 tty6 都可以正確顯示英文了。

![](https://image.wadeism.net/tty_lang02.png)

簡單解釋一下原理，我們在開一個新的 bash 時，bash 都會去讀取使用者家目錄下的 .bashrc 檔，而這個 .bashrc 檔裡記載了許多我們想要的初始設定，例如各種的環境變數、alias…等等，切換 tty console 實際上也是新開了一個 bash，而上面 script 的內容則是用一個 for in 廻圈去定義環境變數，讓每次開新的 bash 時都自動將語言的環境變數設定為英文。

不過要注意因為上面是把 script 加在我們 home 目錄底下的 .bashrc，因此如果其它使用者的話就要一一設定，如果不想一個一個設定的話，也可以將 script 直接寫到 /etc/bash.bashrc 裡（Ubuntu）或是 /etc/bashrc（CentOS）


這算是精簡的解釋，bashrc 與 bash.bashrc or bash_profile 之間有著蠻複雜的相依性，之後也會找時間紀錄一下陳勇勳老師上課時的說明。
