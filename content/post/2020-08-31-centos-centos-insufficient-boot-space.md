---
author: wade
date: 2020-08-31 13:53:04+00:00
draft: false
title: CentOS 解決 /boot 空間不足的問題
type: post
url: /post/centos-insufficient-boot-space/
categories:
- Linux
tags:
- CentOS
- CentOS 8
---

安裝系統時，如果 <span class="hl-green">/boot</span> 分區給的空間太少，在更新時可能就會顯示 /boot 空間不足的 error，因為 Linux 更新時會保留近幾次更新的 kernel，因此出現錯誤時，我們可以把一些比較舊的 kernel 刪掉，幫 /boot 釋放空間

以下方法適用於 CentOS 7 與 CentOS 8

\
開機時可以看到目前系統裡有 4 個版本的 kernel（rescue 不算）

![](https://image.wadeism.net/deboot01.png)

\
編輯 <span class="hl-blue">/etc/yum.conf</span>，並將下面的參數更改為 2 或 3

```bash
installonly_limit=2
```

這個參數表示讓 package manager 保留多少個 kernel 檔，一般的使用者保留目前的與前一、兩個版本其實就夠了

\
安裝 yum-utils

```bash
sudo yum install yum-utils
```

\
清除舊的 kernels

```bash
sudo package-cleanup --oldkernels --count=2
```

完成後，系統就只會留下近兩個版本的 kernel，/boot 的空間也就釋放出來啦！  
（個人建議 /boot 空間最好大於 500MB，就不太會碰到這個問題了）

\
重開機看一下

![](https://image.wadeism.net/deboot02.png)

剩下兩個 kernel 了

* * *

參考資料：

[boot partition is almost full in CentOS](https://unix.stackexchange.com/questions/105026/boot-partition-is-almost-full-in-centos)
