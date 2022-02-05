---
author: wade
date: 2020-07-29 15:46:49+00:00
draft: false
title: BootStrap 3 Navbar 置中方法
type: post
url: /post/bootstrap3-navbar-aligh-center/
categories:
- Developer
tags:
- BootStrap
- CSS
- Frontend
- HTML
---

先於 CSS 中加入以下 class

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

\
然後建立 navbar 時在 nav class 後額外加個 pull-center 即可

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

參考資料：

[Bootstrap Navbar 置中](https://rettamkrad.blogspot.com/2012/11/bootstrap-navbar.html)
