---
author: wade
date: 2020-09-02 06:59:41+00:00
draft: false
title: 解決 KVM 滑鼠游標無法切換的問題
type: post
url: /post/fix-kvm-cusor-switch/
categories:
- Linux
tags:
- KVM
- Virtualization
---

不知道在幾個版本前的 KVM 有碰到過一個問題，如果 guest 虛擬機安裝 Ubuntu（或其它的系統），滑鼠游標會無法在 host 與 guest 間做切換，如果想要無縫的使用滑鼠（mouse pointer integration），必須在 guest 裡安裝 spice 的套件。

```bash
sudo apt-get install spice-vdagent
```

這個問題在我使用 Ubuntu 20.04.1 以 KVM 安裝 Ubuntu guest 的測試中已經解決了，可能只是當時的一個 bug，如果之後有類似的問題可以試著裝裝看，在 [Spice 的官網](https://www.spice-space.org/index.html)上也可以看看有沒有相關的資訊。

* * *

參考資料：

[virt-manager KVM mouse pointer integration (client mouse mode) with Ubuntu guest](https://ckirbach.wordpress.com/2016/01/14/kvm-mouse-pointer-integration-with-ubuntu-guest/)
