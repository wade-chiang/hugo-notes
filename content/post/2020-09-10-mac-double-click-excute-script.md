---
author: wade
date: 2020-09-10 15:17:00+00:00
draft: false
title: 如何在 Mac 雙擊執行Shell Script
type: post
url: /post/mac-double-click-excute-script/
categories:
- Mac
tags:
- Mac
- macOS
- Shell Script
---

雖然 macOS 一樣有 bash 並且支援 shell script，不過與 Linux 的桌面環境還是有些許的不同，下面就來講一下怎樣在 macOS 裡用滑鼠點兩下來執行 shell script。


## 更改副檔名

macOS 的 bash 一樣是認 xxx.sh 的副檔名，不過要在 macOS 的桌面環境中用滑鼠執行，必須將副檔名從 .sh 改為 {{< blue >}}.command{{< /blue >}}。

也別忘了用 {{< blue >}}chmod +x{{< /blue >}} 幫 script 加上可執行的權限。


## 設定自動關閉

{{< red >}}將 shell script 的副檔名改成 .command 就可以用滑鼠雙擊執行{{< /red >}}，但執行完後  terminal 的視窗並不會自動關閉，這時必須到「{{< green >}}終端機{{< /green >}}」→「{{< green >}}偏好設定{{< /green >}}」，在描述檔設定中的 「{{< green >}}Shell{{< /green >}}」 頁籤裡，找到「{{< green >}}當 shell 結束時{{< /green >}}」的選項，可以設定 shell script 執行完後的動作，在這裡改成「{{< blue >}}Shell 完全結束時才關閉視窗{{< /blue >}}」，這樣跑完 script 就不用手動關閉 terminal  視窗了。

![](https://image.wadeism.net/macscript01.png)

## 設定切換至當前目錄

macOS 有個很特殊的地方，那就是它 {{< red >}}shell script 的當前工作目錄，一定會是使用者的 home 目錄，而不是 scritp 所在的目錄{{< /red >}}。

以一個簡單的 script，test.command 為例：

```bash
#!/bin/bash

mkdir hihi
```

如果將 test.command 放到使用者的桌面 {{< blue >}}~/Desktop{{< /blue >}}，並且雙擊執行，按照 Linux 的經驗，應該會在使用者的桌面上建立一個名為 hihi 的資料夾。

但如同上面所述，macOS 的 shell script 會將 home 目錄當成預設的工作目錄，因此 hihi 資料夾會被建立在使用者的 home 目錄 {{< blue >}}~/{{< /blue >}} 裡，而非 scritp 所在的使用者桌面 {{< blue >}}~/Desktop{{< /blue >}} 中

如果 script 裡用到的都是一些絕對路徑的話可能沒差，不過蠻多時候我們是用 script 處理所在目錄的東西，因此這邊要在 script 裡加入下面兩種指令（二擇一就好），讓 script 切換到它的所在目錄

```bash
cd -- "$(dirname "$BASH_SOURCE")"
```

```bash
cd -- "$(dirname "$0")"
```

\
只要將上面任何一條指令加到 script 的 #!/bin/bash 下面即可，寫法如下：


```bash
#!/bin/bash

cd -- "$(dirname "$BASH_SOURCE")"

mkdir hihi
```

```bash
#!/bin/bash

cd -- "$(dirname "$0")"

mkdir hihi
```

* * *

參考資料：

[How to run a shell script in OS X by double-clicking?](https://stackoverflow.com/questions/5125907/how-to-run-a-shell-script-in-os-x-by-double-clicking)
