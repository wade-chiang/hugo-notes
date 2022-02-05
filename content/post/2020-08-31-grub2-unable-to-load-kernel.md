---
author: wade
date: 2020-08-31 05:51:22+00:00
title: GRUB2 無法讀取 Kernel 的問題
type: post
url: /post/grub2-unable-to-load-kernel/
categories:
- Linux
tags:
- Boot
- GRUB2
---

如果換硬碟之類的動作，造成 Linux 在開機時無法讀取 Kernel，可以在開機時的 GRUB 2 選單按下小寫的 e，進入 edit 模式，然後在 set root= 這邊改成正確的硬碟與分區，對 GRUB2 而言， 第一顆碟碟的代號是 0，第一個磁區則是 1。

![](https://image.wadeism.net/grub2_01.png)

在 linux16 這邊指定 kernel 版本名稱與 root 路徑

```bash
linux6 /vmlinuz-3.10.x.x.x.el7.x86_64 root=/dev/sdXY ro
```

\
在 initrd16 這邊指定 kernel 的 image 檔

```bash
initrd16 /initramfs-3.10.x.x.x.el7.x86_64.img
```

* * *

參考資料：

[Load kernel and boot your system with GRUB2](https://www.markomedia.com.au/load-kernel-and-boot-your-system-with-grub2/)
