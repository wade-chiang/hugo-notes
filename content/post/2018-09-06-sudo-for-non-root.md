---
author: wade
date: 2018-09-06 11:11:35+00:00
draft: false
title: 讓非 root 的 user 使用 sudo
type: post
url: /post/sudo-for-non-root/
categories:
- Linux
---

以 root 登入、增加文件的 write 屬性

```bash
sudo chmod u+w /etc/sudoers
```

\
編輯 /etc/sudoers 文件，找到這一行
    
```bash
root ALL=(ALL) ALL
```

\
在文件下面添加以下這行，然後儲存退出
    
```bash
xxx ALL=(ALL) ALL
# 這裡的 xxx 是你的用戶名
```

\
取消文件的 write 屬性。
    
```bash
sudo chmod u-w /etc/sudoers
```
