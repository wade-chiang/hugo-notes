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

在 Shell 中常使用 {{< blue >}}$?{{< /blue >}} 來判斷前一個指令執行的失敗與否，{{< blue >}}echo $?{{< /blue >}} 為 0 代表成功，非 0 就代表失敗，其實還有幾個類似的內建變數也是相當的實用，下面就來介紹幾個常用的內建變數

* {{< green >}}{{< mono >}}$?{{< /green >}}{{< /mono >}}：指令或程式執行的回傳值，0 代表執行成功，0 以外的數字表示失敗
* {{< green >}}{{< mono >}}$1{{< /green >}}{{< /mono >}}：script 的第一個參數
* {{< green >}}{{< mono >}}$2{{< /green >}}{{< /mono >}}：script 的第二個參數
* {{< green >}}{{< mono >}}$3{{< /green >}}{{< /mono >}}：script 的第三個參數，以此類推
* {{< green >}}{{< mono >}}$#{{< /green >}}{{< /mono >}}：script 的參數數量
* {{< green >}}{{< mono >}}$${{< /green >}}{{< /mono >}}：shell 執行的 PID

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

* {{< green >}}{{< mono >}}$@{{< /green >}}{{< /mono >}}：代表參數的值
* {{< green >}}{{< mono >}}$*{{< /green >}}{{< /mono >}}：代表參數的值

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
執行 test2.sh 並且加上三個參數 a、b、{{< green >}}"c d"{{< /green >}}

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

* {{< blue >}}$*{{< /blue >}} 與 {{< blue >}}$@{{< /blue >}} 得到的結果是一樣的，都是 {{< green >}}a{{< /green >}}、{{< green >}}b{{< /green >}}、{{< green >}}c{{< /green >}}、{{< green >}}d{{< /green >}} 四個參數
* {{< blue >}}"$*"{{< /blue >}} 在這邊是把所有的參數視為一個被雙引號包起來的變數 {{< green >}}"a b c d"{{< /green >}}
* {{< blue >}}"$@"{{< /blue >}} 則是被視為三個參數 {{< green >}}a{{< /green >}}、{{< green >}}b{{< /green >}} 與 {{< green >}}"c d"{{< /green >}}

{{< red >}}基本上 "$@" 才是符合實際上所輸入的參數情況，因此我們比較常使用的也是 "$@"{{< /red >}}

* * *

參考資料：

[What's the difference between $@ and $*](https://unix.stackexchange.com/questions/129072/whats-the-difference-between-and)
