---
author: wade
date: 2020-09-07 14:31:25+00:00
draft: false
title: Win 10 與 Ubuntu 多重開機安裝筆記
type: post
url: /post/win10-ubuntu-multiboot/
categories:
- Linux
tags:
- Boot
- Ubuntu
- Win
- Win10
---

安裝環境：兩顆 SSD，分別安裝 Win 10 與 Ubuntu

1. 以 GParted 格式化兩顆 SSD，裝 Win 10 的 SSD 也用 GParted 格式化成 NTFS。

2. 在沒有更動 BIOS 或 UEFI 開機設定的情況下安裝 Win 10，安裝時不再做格式化，裝完後發現 Win 10 似乎把 efi 的 partition 放在要拿來裝 Linux 的那顆  SSD 的第一個磁區，也就是我切給 Linux UEFI 用的那個 partition。

3. 一樣在不動 BIOS 設定的情況下安裝 Ubuntu 18.04，開機啟動區選擇一開始 GParted 切給 Linux 的 UEFI 那槽（應該會是 sdx1）

4. 多重開機完成！

&nbsp;
* 步驟 2 的部分，如果在裝完 Win 10 之後，去 BIOS 裡把 Linux 那顆 SSD 隱藏起來，Win 10 會無法啟動，由此可見 Win 10 應該是有把開機啟動區放在要 Linux 的那顆 SSD 上！

* 在 PTT 的文章裡，網友 waakye 提到：灌 Windows 的時候，Win 會把第一顆硬碟當作開機碟，但第一顆硬碟未必是我們打算作為 Win 10 系統碟的那顆硬碟

* * *

參考資料：

[Win 10 更換資料碟](https://www.ptt.cc/bbs/Storage_Zone/M.1548039729.A.A40.html)
