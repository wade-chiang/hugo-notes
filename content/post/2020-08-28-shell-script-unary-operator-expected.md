---
author: wade
date: 2020-08-28 01:46:31+00:00
draft: false
title: Shell Script 的 unary operator expected 問題
type: post
url: /post/shell-script-unary-operator-expected/
categories:
- Developer
tags:
- Shell Script
---

以下面的 if script 為例：

```bash
#!/bin/bash

read -p 'please type in "play" : ' INPUT

if [ $INPUT == "play" ];then
     echo "Correct"
else
     echo "Wrong!"
fi
```

\
執行後會請我們輸入 "play" 這個單字，不管輸入正確與否都會有提示，但如果輸入的是空白或是直接 enter，則會跳出一行 unary operator expected 的錯誤

```bash
please type in "play" :

./test.sh: line 5: [: ==: unary operator expected
Wrong!
```

這是因為當我們輸入空白時， $INPUT  這個變數的值會是空值 null，而 null 值無法去做比對

要解決這個問題的方法很簡單，<span class="hl-red">只要將 $INPUT 變數用雙引號 " " 包起來就可以了</span>


```bash
#!/bin/bash

read -p 'please type in "play" : ' INPUT

if [ "$INPUT" == "play" ];then
     echo "Correct"
else
     echo "Wrong!"
fi
```

```bash
please type in "play" :

Wrong!
```
