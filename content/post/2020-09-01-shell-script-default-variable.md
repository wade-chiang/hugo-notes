---
author: wade
date: 2020-09-01 00:07:36+00:00
draft: false
title: Shell Script 內建變數介紹
type: post
url: /post/shell-script-default-variable/
categories:
- Developer
tags:
- Shell Script
---

在 Shell 中常使用 <span class="hl-blue">$?</span> 來判斷前一個指令執行的失敗與否，<span class="hl-blue">echo $?</span> 為 0 代表成功，非 0 就代表失敗，其實還有幾個類似的內建變數也是相當的實用，下面就來介紹幾個常用的內建變數

* <span class="hl-green mono">$?</span>：指令或程式執行的回傳值，0 代表執行成功，0 以外的數字表示失敗
* <span class="hl-green mono">$1</span>：script 的第一個參數
* <span class="hl-green mono">$2</span>：script 的第二個參數
* <span class="hl-green mono">$3</span>：script 的第三個參數，以此類推
* <span class="hl-green mono">$#</span>：script 的參數數量
* <span class="hl-green mono">$$</span>：shell 執行的 PID

\
我們用一個簡單的 script 來做試範

```bash
#!/bin/bash

echo -e "The \$? =" $(echo $?)

echo -e "\nThe \$1 =" $(echo $1)

echo -e "\nThe \$2 =" $(echo $2)

echo -e "\nThe \$3 =" $(echo $3)

echo -e "\nThe \$# =" $(echo $#)

echo -e "\nThe \$\$ =" $(echo $$)
```

執行 test1.sh 並且加上三個參數 a、b、c


```bash
./test1.sh a b c
```

```bash
# 執行結果：

The $? = 0     # 執行成功

The $1 = a     # 第一個參數

The $2 = b     # 第二個參數

The $3 = c     # 第三個參數

The $# = 3     # 參數的總量

The $$ = 1962  # 執行時的 PID
```

再來介紹兩個比較容易搞混的變數

* <span class="hl-green mono">$@</span>：代表參數的值
* <span class="hl-green mono">$*</span>：代表參數的值

這兩個變數雖然都是參數的值，但當它們被雙引號 " " 包起來時會有所不同，下面一樣用個 script 做例子

```bash
#!/bin/bash

echo "The \$* : "
for a in $*; do
    echo \ $a;
done

echo -e "\nThe \"\$*\" : "
for a in "$*"; do
    echo \ $a;
done

echo -e "\n====================\n"

echo "The \$@ : "
for a in $@; do
    echo \ $a;
done

echo -e "\nThe \"\$@\" : "
for a in "$@"; do
    echo \ $a;
done
```

\
執行 test2.sh 並且加上三個參數 a、b、<span class="hl-green">"c d"</span>

```bash
./test2.sh a b "c d"
```

```bash
# 執行結果：

The $* :
a
b
c
d

The "$*" :
a b c d

====================

The $@ :
a
b
c
d

The "$@" :
a
b
c d

```

上面的執行結果可以觀察到：

* <span class="hl-blue">$*</span> 與 <span class="hl-blue">$@</span> 得到的結果是一樣的，都是 <span class="hl-green">a</span>、<span class="hl-green">b</span>、<span class="hl-green">c</span>、<span class="hl-green">d</span> 四個參數
* <span class="hl-blue">"$*"</span> 在這邊是把所有的參數視為一個被雙引號包起來的變數 <span class="hl-green">"a b c d"</span>
* <span class="hl-blue">"$@"</span> 則是被視為三個參數 <span class="hl-green">a</span>、<span class="hl-green">b</span> 與 <span class="hl-green">"c d"</span>

<span class="hl-red">基本上 "$@" 才是符合實際上所輸入的參數情況，因此我們比較常使用的也是 "$@"</span>

* * *

參考資料：

[What's the difference between $@ and $*](https://unix.stackexchange.com/questions/129072/whats-the-difference-between-and)
