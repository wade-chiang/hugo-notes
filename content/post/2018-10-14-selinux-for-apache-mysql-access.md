---
author: wade
date: 2018-10-14 12:05:23+00:00
draft: false
title: 讓 Apache 存取 MySQL 的 SELinux 設定
type: post
url: /post/selinux-for-apache-mysql-access/
categories:
- Developer
- Linux
tags:
- PHP
- Web
---

在自己的虛擬機裡練習 PHP and MariaDB 時，曾經碰過一個問題，已確定防火牆開通了 mysql，而且連入 DB 的帳號也是允許從 127.0.0.1 以外的 ip 登入，但練習 php 網頁還是無法成功的連入 DB，後來終於找到了原因，果然又是 SELinux 的關係，在這邊記錄一下解決的方法：

\
檢查 SELinux 的狀態
    
```bash
sudo sestatus
```
    
```bash
# 執行結果：

SELinux status: enabled
SELinuxfs mount: /sys/fs/selinux
SELinux root directory: /etc/selinux
Loaded policy name: targeted
Current mode: enforcing
Mode from config file: enforcing
Policy MLS status: enabled
Policy deny_unknown status: allowed
Max kernel policy version: 31
```

\
檢查 Apache 與 DB 有關的 SELinux 參數

```bash
sudo getsebool -a | grep httpd_can_network_connect
```
    
```bash
# 執行結果：

httpd_can_network_connect --> off
httpd_can_network_connect_cobbler --> off
httpd_can_network_connect_db --> off # 這項參數就是與無法連線有關
```

\
允許 Apache 連線到遠端的 DB
    
```bash
sudo setsebool -P httpd_can_network_connect_db 1
# 如果沒有加 -P 的話，下次重開機後這次的設定就無效了
```
