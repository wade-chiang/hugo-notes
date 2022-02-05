---
author: wade
date: 2020-09-10 15:06:29+00:00
draft: false
title: Shell Script 判斷檔案狀態的 if 條件句
type: post
url: /post/shellscript-file-status/
categories:
- Linux
tags:
- Bash
- Shell Script
---

在 Bash 或 Shell Script 裡，可以用下面幾個參數來判斷檔案的狀態，在 if statement 中非常的實用

* {{< green >}}{{< mono >}}-e{{< /green >}}{{< /mono >}}：當檔案存在時為真
* {{< green >}}{{< mono >}}-d{{< /green >}}{{< /mono >}}：當檔案類型是資料夾時為真
* {{< green >}}{{< mono >}}-f{{< /green >}}{{< /mono >}}：當檔案存在且類型是普通檔案時為真（非連結、資料夾、device node）
* {{< green >}}{{< mono >}}-h{{< /green >}}{{< /mono >}}：當檔案存在且類型是符號連結時為真
* {{< green >}}{{< mono >}}-s{{< /green >}}{{< /mono >}}：當檔案大小不等於 0 時為真
* {{< green >}}{{< mono >}}-u{{< /green >}}{{< /mono >}}：當檔案有 suid 時為真
* {{< green >}}{{< mono >}}-g{{< /green >}}{{< /mono >}}：當檔案有 sgid 時為真
* {{< green >}}{{< mono >}}-r{{< /green >}}{{< /mono >}}：當檔案可讀時為真
* {{< green >}}{{< mono >}}-w{{< /green >}}{{< /mono >}}：當檔案可寫時為真
* {{< green >}}{{< mono >}}-x{{< /green >}}{{< /mono >}}：當檔案可執行時為真


## 用法

檢查 /etc/passwd 這個檔案是否存在

```bash
#!/bin/bash

if [[ -e '/etc/passwd' ]]; then
  echo "passwd exist "
else
  echo "file not found"
fi
```

詳細的參數可參考 {{< blue >}}man 1 test{{< /blue >}}
