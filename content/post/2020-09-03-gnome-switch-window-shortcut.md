---
author: wade
date: 2020-09-03 08:52:02+00:00
draft: false
title: Gnome 切換視窗的快捷鍵設定
type: post
url: /post/gnome-switch-window-shortcut/
categories:
- Linux
tags:
- Gnome
- HotKey
- Ubuntu
---

相信大家都常用 Alt + Tab 這個組合鍵在不同的視窗間做切換，印象中不知道是哪一版的 Ubuntu 好像把這個組合鍵改為「切換程式」，也就是只會在不同程式間做切換，如果同個程式開了很多個視窗（例如資料夾），它也不會在每個資料夾的視窗間切換。因此去找了設定的方法將它弄回來，雖然後來的版本有再改回來，不過還是做個記錄

開啟 {{< blue >}}dconf-editor{{< /blue >}}，沒有的話該程式的話 Ubuntu 安裝方法如下：

```bash
sudo apt install dconf-editor
```

\
找到路徑 {{< green >}}org/gnome/desktop/wm/keybindings{{< /green >}}

![](https://image.wadeism.net/dconf01.png)

\
找到 {{< green >}}<Alt>Tab{{< /green >}}，將它從 {{< blue >}}switch-applicaations{{< /blue >}} 改到 {{< blue >}}switch-windows{{< /blue >}}

![](https://image.wadeism.net/dconf01.png)

\
除此之外，Gnome 的視窗操作熱鍵都可以在這邊做調整

\
另外如果有多個工作區（workspace）想要做跨桌面的視窗切換，可以到 {{< green >}}/gnome/shell/window-switcher{{< /green >}}，將 {{< blue >}}current-workspace-only{{< /blue >}} 給取消

![](https://image.wadeism.net/dconf03.png)

關閉 dconf-editor 後，按 {{< blue >}}Alt + F2{{< /blue >}}，接著輸入 {{< blue >}}r{{< /blue >}}，Gnome 就會重啟並 reload 設定
