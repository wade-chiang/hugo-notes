---
author: wade
date: 2020-09-09 01:34:31+00:00
draft: false
title: 修改 Ubuntu-Mate 的預設 menu-bar icon
type: post
url: /post/modify-ubuntu-mate-default-menu-bar-icon/
categories:
- Linux
tags:
- Mate
- Ubuntu
---

{{< blue >}}gsettings{{< /blue >}} 指令可以查詢 menu-bar icon 的名字

```bash
gsettings get org.mate.panel.menubar icon-name
```

```bash
# 執行結果：
'start-here'
```

知道名稱後，可以去 {{< blue >}}Control Center{{< /blue >}} 裡的 {{< blue >}}Appearance Preferences{{< /blue >}} 裡看目前使用的 theme 是哪一款，再去 {{< blue >}}/usr/share/icons{{< /blue >}} 裡找 current theme 的資料夾

只要找得到目前使用的 start-here.svg 這個 icon 檔，就可以替換掉，換完後記得重開機即可

在我舊的筆記中，是使用 {{< blue >}}gsettings set org.mate.panel.menubar icon-name{{< /blue >}} 去改 icon-name 的值，改成想要的即可，用這樣的方式應該就可以不用替換檔案，直接指定其它 icon name 就好，不過在 Ubuntu-Mate 20.04 中，指定 icon name 的方式好像沒有作用
