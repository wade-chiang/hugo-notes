---
author: wade
date: 2018-06-24 03:35:03+00:00
draft: false
title: 網頁前端 課堂筆記
type: post
url: /post/note-for-web-frontend/
image: "https://image.wadeism.net/frontand01.jpg"
categories:
- Developer
tags:
- HTML
---

* div 會佔據一整行，要注意整行的元件


## 表格
    
```html
<table>
．width: 表格寬度
．height: 表格高度
．border: 表格外框
．bgcolor: 背景顏色
<tr>
． width / height / bgcolor
<td>
． width / height / bgcolor
． align: 對齊方式 (center / right)
```


## 表單元件
    
```html
<form method="POST/GET" action="file.php"> </form>
填寫文字欄位
<input type="text" /size/maxlength/name/value>
<input type="password" /size/maxlength/name/value>
<input type="hidden" /name/value>
<textarea cols列寬/rows行高/name> </textarea>
<input type="checkbox" /name/value/checked>
<input type="radio" /name/value/checked> 單選<select /name/size><option /value> </option></select><input type="??" /button（一般）/submit（送出）/reset/value（按鈕上的字）>
```


## JavaScript

```javascript
add = add+1

add += 1
```

上面兩者相等，add+= 為 add=add+1 的簡寫


## BootStrap Navbar 置中

CSS 加入以下 class
    
```css
.navbar .nav.pull-center {
  float: none;
  margin: 0 auto;
  display:inline-block;
  *display:inline; /* ie7 fix */
  *zoom:1; /* hasLayout ie7 trigger */
  vertical-align: top;
}
    
.navbar-inner {
  text-align:center;
}
```

然後建立 navbar 時在 nav class 後額外加個 pull-center 即可

範例：
    
```html
<div class="navbar">
 <div class="navbar-inner">
  <a class="brand" href="#">Title</a>
  <ul class="nav pull-center">
   <li class="active"><a href="#">Home</a></li>
   <li><a href="#">Link</a></li>
   <li><a href="#">Link</a></li>
  </ul>
 </div>
</div>
```


## BootStrap 改變 navbar 裡選項的字型顏色
    
```css
.navbar .nav > li > a {
  float: none;
  line-height: 19px;
  padding: 9px 10px 11px;
  text-decoration: none;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
  color:  #ddd;
}
```

[cover](https://frontendmasters.com/books/front-end-handbook/2017/practice/tech-employed-by-fd.html) [by](https://frontendmasters.com/books/front-end-handbook/2017/practice/tech-employed-by-fd.html)
