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

* <span class="hl-green mono">Ctrl + J</span>

  同 <span class="hl-blue">Enter</span>，用 HHKB 的話手可以不用離開鍵盤！

* <span class="hl-green mono">Ctrl + L</span>

  將畫面清除乾淨，同 <span class="hl-blue">clear</span> 指令

* <span class="hl-green mono">Ctrl + R</span>

  搜尋指令的 history 並自動補齊，按下 <span class="hl-blue">Ctrl + R</span> 後再打上指令會就最近的相同指令補齊

* <span class="hl-green mono">Alt + .</span>

  自動貼上最後輸入的文字，例如上次執行了 cat abc，按 <span class="hl-blue">Alt + .</span> 後就會出現 abc

* <span class="hl-green mono">Tab</span>

  鼎鼎大名的自動補齊，可以補齊指令與檔案，配上 <span class="hl-blue">bash-completion</span> 更是如虎添翼


## 程式切換與停止

* <span class="hl-green mono">Ctrl + Z</span>

  將目前的程式丟到背景執行，有點類似 Windows 裡的縮到最小

* <span class="hl-green mono">fg</span>

  把剛才丟到背景執行的程式叫回來

* <span class="hl-green mono">Ctrl + C</span>

  關閉目前的程式，同 <span class="hl-blue">kill -2</span>


## 取代方向鍵

* <span class="hl-green mono">Ctrl + P</span>

  同方向鍵 ↑，找前面的指令

* <span class="hl-green mono">Ctrl + N</span>

  同方向鍵 ↓，找後面的指令

* <span class="hl-green mono">Ctrl + B</span>

  同方向鍵 ←，游標往左移一格

* <span class="hl-green mono">Ctrl + F</span>

  同方向鍵 →，游標左右移一格

## 快速移動游標

* <span class="hl-green mono">Ctrl + A</span>

  同 <span class="hl-blue">Home</span> 鍵，移到該行的最前面

* <span class="hl-green mono">Ctrl + E</span>

  同 <span class="hl-blue">End</span> 鍵，移到該行的最後面

* <span class="hl-green mono">Alt + B</span>

  將游標往左移動一個單字

* <span class="hl-green mono">Alt + F</span>

  將游標往右移動一個單字


## 字元刪除

* <span class="hl-green mono">Ctrl + W</span>

  刪除游標前面的最後一個單字

* <span class="hl-green mono">Alt + D</span>

  刪除游標後面的一個單字

* <span class="hl-green mono">Ctrl + H</span>

  同 <span class="hl-blue">Backspace</span>，刪除游標前的一個字元

* <span class="hl-green mono">Ctrl + D</span>

  移除游標後的一個字元，<span class="hl-red">在沒有任何的字元的空行狀態下，會變成離開 shell</span>

* <span class="hl-green mono">Ctrl + K</span>

  刪除游標之後的所有文字

* <span class="hl-green mono">Ctrl + U</span>

  刪除游標之前的所有文字


## 字元互換

* <span class="hl-green mono">Ctrl + T</span>

  相鄰的兩個字元會互換位置，例如打 ih，再打 Ctrl + T 會變成 hi

* <span class="hl-green mono">Esc + T</span>

  相鄰的兩個單字會互換位置，例如打 take one，再打 ESC + T 會變成 one take
