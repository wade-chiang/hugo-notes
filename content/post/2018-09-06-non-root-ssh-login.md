---
author: wade
date: 2018-09-06 11:15:40+00:00
draft: false
title: 讓非 root 的 user 使用 ssh 登入
type: post
url: /post/non-root-ssh-login/
categories:
- Linux
---

有些系統預設 ssh 只有 root 或 admin 帳號可以登入，而一般的使用者因為沒有設定 shell，所以無法登入 ssh，需要做以下的設定

以 root 編輯 /etc/passwd 檔，將 user 後面的 shell 改為 /bin/bash 或 /bin/sh
    
```bash
vim /etc/passwd
```
    
```bash
chrony:x:998:995::/var/lib/chrony:/sbin/nologin
centos:x:1000:1000:Cloud User:/home/centos:/sbin/nologin
joyce:x:1001:1001::/home/joyce:/bin/bash
```

兩者都是 alias 到 BusyBox 這個 shell。

{{< red >}}如果將帳號（例如上面的 centos）的 shell 設為 /sbin/nologin，會禁止該使用者以 ssh 登入，可避免有心人士亂 try{{< /red >}}
