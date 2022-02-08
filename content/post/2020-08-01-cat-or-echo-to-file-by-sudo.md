---
author: wade
date: 2020-08-01 10:54:16+00:00
draft: false
title: 使用 sudo 權限 cat 或 echo 文字到檔案
type: post
url: /post/cat-or-echo-to-file-by-sudo/
categories:
- Linux
tags:
- Bash
---

有時候不想切換到 root 帳號，但又想把文字寫入沒有權限的檔案時，可以使用 <span class="hl-blue">tee</span> 這個指令


## 使用 sudo 權限 echo 一行文字

```bash
echo 'I Love Music' | sudo tee -a /etc/demo
```

* <span class="hl-green mono">-a</span>：append，文字會以附加的方式插入，<span class="hl-red">沒有加 -a 的話檔案會被清空只剩下你 echo 的文字！</span>

tee 會將文字導入檔案同時也會輸出到螢幕，如果不想在螢幕上看到，再用 <span class="hl-blue">> /dev/null</span> 就可以

```bash
echo 'I Love Music' | sudo tee -a /etc/demo > /dev/null
```


## 使用 sudo 權限 cat 一段文字

如果想寫入的不是一行字，而是一整段的內容如下：

```bash
[空行]
Hello~
I Love Music
[空行]
```

一樣可以使用 tee 再搭配 <span class="hl-blue">EOF</span>（End of File）來寫入

```bash
cat << EOF | sudo tee -a /etc/demo

Hello~
I Love Music

EOF
```

這段指令會將 EOF 以前的所有內容都寫入 /etc/demo，但不包括 EOF
