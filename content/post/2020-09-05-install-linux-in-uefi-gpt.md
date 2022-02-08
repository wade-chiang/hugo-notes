---
author: wade
date: 2020-09-05 02:24:17+00:00
draft: false
title: UEFI 與 GPT 的 Linux 安裝心得
type: post
url: /post/install-linux-in-uefi-gpt/
categories:
- Linux
tags:
- BIOS
- GPT
- MBR
- MultiBoot
- UEFI
---

以往我都是用 [Easy2Boot](https://www.easy2boot.com/) 來製作多重開機的系統安裝隨身碟，並且使用傳統的 BIOS & MBR 模式安裝 Linux，不過後來想試試看使用 UEFI 與 GPT 安裝就碰到了一些問題。

如果想要使用 UEFI / GPT 的模式來安裝 Linux，那麼<span class="hl-red">安裝用的 USB 隨身碟本身也必須要支援 UEFI 的開機模式</span>，這樣安裝過程中才能將 partition 設為 efi partition，不然就會看不到這個選項。

由於 Easy2Boot 預設是使用 MBR 開機（如果要改 UEFI 的話製作方法非常麻煩！），因此目前改使用 [MultiBootUSB](http://multibootusb.org/) 來製作多重開機隨身碟，雖然不能像 Easy2Boot 一樣把 iso 檔丟進隨身碟就能用，不過目前用起來還算是簡單了，在官網上也有教學，推薦給大家！

* * *

參考資料：

[MultiBootUSB](http://multibootusb.org/)

[MultiBootUSB on GitHUB](https://github.com/mbusb/multibootusb)

[Easy2Boot](https://www.easy2boot.com/)
