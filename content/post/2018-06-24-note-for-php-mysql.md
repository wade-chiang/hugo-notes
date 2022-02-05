---
author: wade
date: 2018-06-24 03:28:48+00:00
draft: false
title: PHP & MYSQL 課堂筆記
type: post
url: /post/note-for-php-mysql/
image: "https://image.wadeism.net/php01.png"
categories:
- Developer
tags:
- PHP
---

* php 經過轉換變成 html
* ;（分號）為一行字串的結束，重要！
* 引號 cover 字串
* 變數開頭不可為數字
* \t →縮排
* 變數 $ 後的值為數字時，不用加' '
* 邏輯判斷如果不加大括號，就只會處理第一行


## 運算子

++ 遞增運算子 (每次遞增整數 1)  

```php
$price = 100;  
$price++;  
echo $price; // 會印出 101
```

\
-- 遞減運算子 (每次遞減整數 1)  

```php
$price = 100;  
$price--;  
echo $price; // 會印出 99
```


## 流程控制

* 如果合乎條件就執行
* 若條件判斷成立的話，就執行相關的程式碼，若不成立則執行警告訊息或做不同的處理

### 流程控制的種類

* 邏輯判斷
* 迴圈


## 邏輯判斷 語法：

```php
if (條件)  
{  
  條件成立時執行的敘述;  
}
```

```php
# 範例：  
if ($x == 10)  
{  
  echo "變數x的值是10喔！";  
}
```


## 遠端登入SQL：

* 帳號不能是 root，需建立一個非 root 但有 root 權限的帳號
* 在安裝 sql 時不要移除 remote root login

[cover by](http://www.developersacademy.org/blog/php-language-not-others/)
