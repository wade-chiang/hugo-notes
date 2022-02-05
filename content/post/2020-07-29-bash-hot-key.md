---
author: wade
date: 2020-07-29 13:30:15+00:00
draft: false
title: Bash 快捷鍵介紹
type: post
url: /post/bash-hot-key/
categories:
- Linux
- Mac
tags:
- Bash
---

介紹一些 Bash 上實用的快捷鍵，雖然有的人會覺得不順手，但如果試過 [HHKB](https://happyhackingkb.com/jp/products/hybrid_types/) 或一些可以把 Ctrl 鍵換到 Caps Lock 位置的鍵盤，就能體會這些快捷鍵真正的好處了，大家有機會都應該試試看！

快捷鍵的使用不分英文大小寫

## 超好用必學快捷鍵

* {{< green >}}{{< mono >}}Ctrl + J{{< /green >}}{{< /mono >}}

  同 {{< blue >}}Enter{{< /blue >}}，用 HHKB 的話手可以不用離開鍵盤！

* {{< green >}}{{< mono >}}Ctrl + L{{< /green >}}{{< /mono >}}

  將畫面清除乾淨，同 {{< blue >}}clear{{< /blue >}} 指令

* {{< green >}}{{< mono >}}Ctrl + R{{< /green >}}{{< /mono >}}

  搜尋指令的 history 並自動補齊，按下 {{< blue >}}Ctrl + R{{< /blue >}} 後再打上指令會就最近的相同指令補齊

* {{< green >}}{{< mono >}}Alt + .{{< /green >}}{{< /mono >}}

  自動貼上最後輸入的文字，例如上次執行了 cat abc，按 {{< blue >}}Alt + .{{< /blue >}} 後就會出現 abc

* {{< green >}}{{< mono >}}Tab{{< /green >}}{{< /mono >}}

  鼎鼎大名的自動補齊，可以補齊指令與檔案，配上 {{< blue >}}bash-completion{{< /blue >}} 更是如虎添翼


## 程式切換與停止

* {{< green >}}{{< mono >}}Ctrl + Z{{< /green >}}{{< /mono >}}

  將目前的程式丟到背景執行，有點類似 Windows 裡的縮到最小

* {{< green >}}{{< mono >}}fg{{< /green >}}{{< /mono >}}

  把剛才丟到背景執行的程式叫回來

* {{< green >}}{{< mono >}}Ctrl + C{{< /green >}}{{< /mono >}}

  關閉目前的程式，同 {{< blue >}}kill -2{{< /blue >}}


## 取代方向鍵

* {{< green >}}{{< mono >}}Ctrl + P{{< /green >}}{{< /mono >}}

  同方向鍵 ↑，找前面的指令

* {{< green >}}{{< mono >}}Ctrl + N{{< /green >}}{{< /mono >}}

  同方向鍵 ↓，找後面的指令

* {{< green >}}{{< mono >}}Ctrl + B{{< /green >}}{{< /mono >}}

  同方向鍵 ←，游標往左移一格

* {{< green >}}{{< mono >}}Ctrl + F{{< /green >}}{{< /mono >}}

  同方向鍵 →，游標左右移一格

## 快速移動游標

* {{< green >}}{{< mono >}}Ctrl + A{{< /green >}}{{< /mono >}}

  同 {{< blue >}}Home{{< /blue >}} 鍵，移到該行的最前面

* {{< green >}}{{< mono >}}Ctrl + E{{< /green >}}{{< /mono >}}

  同 {{< blue >}}End{{< /blue >}} 鍵，移到該行的最後面

* {{< green >}}{{< mono >}}Alt + B{{< /green >}}{{< /mono >}}

  將游標往左移動一個單字

* {{< green >}}{{< mono >}}Alt + F{{< /green >}}{{< /mono >}}

  將游標往右移動一個單字


## 字元刪除

* {{< green >}}{{< mono >}}Ctrl + W{{< /green >}}{{< /mono >}}

  刪除游標前面的最後一個單字

* {{< green >}}{{< mono >}}Alt + D{{< /green >}}{{< /mono >}}

  刪除游標後面的一個單字

* {{< green >}}{{< mono >}}Ctrl + H{{< /green >}}{{< /mono >}}

  同 {{< blue >}}Backspace{{< /blue >}}，刪除游標前的一個字元

* {{< green >}}{{< mono >}}Ctrl + D{{< /green >}}{{< /mono >}}

  移除游標後的一個字元，{{< red >}}在沒有任何的字元的空行狀態下，會變成離開 shell{{< /red >}}

* {{< green >}}{{< mono >}}Ctrl + K{{< /green >}}{{< /mono >}}

  刪除游標之後的所有文字

* {{< green >}}{{< mono >}}Ctrl + U{{< /green >}}{{< /mono >}}

  刪除游標之前的所有文字


## 字元互換

* {{< green >}}{{< mono >}}Ctrl + T{{< /green >}}{{< /mono >}}

  相鄰的兩個字元會互換位置，例如打 ih，再打 Ctrl + T 會變成 hi

* {{< green >}}{{< mono >}}Esc + T{{< /green >}}{{< /mono >}}

  相鄰的兩個單字會互換位置，例如打 take one，再打 ESC + T 會變成 one take
