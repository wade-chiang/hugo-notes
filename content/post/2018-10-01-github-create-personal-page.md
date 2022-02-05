---
author: wade
date: 2018-10-01 14:09:39+00:00
draft: false
title: 使用 GitHub 建立個人靜態網頁
type: post
url: /post/github-create-personal-page/
image: "https://image.wadeism.net/github00.png"
categories:
- Developer
tags:
- Git
- Web
---

記得以前在課堂上，老師介紹過兩種免費的方法來放我們的作品，Dropbox 的 Kissr 與 GitHub，一開始我是用 Kissr，不過後來覺得 GitHub 可以學比較多東西，所以就改用 GitHub 了，下面就來介紹一下怎麼使用 GitHub 來當網頁空間

\
首先當然是要有一個 GitHub 的帳號，建立帳號後，點選主頁面右上角的「{{< blue >}}+{{< /blue >}}」，並選擇 {{< blue >}}New repository{{< /blue >}}

![](https://image.wadeism.net/github01.png)

\
幫 repository 取個名，本範例為：「 homepage 」，選 {{< blue >}}Public{{< /blue >}}（ Private 要收費），{{< blue >}}Initialize this repository with a README{{< /blue >}} 可打勾，會產生一個 readme 檔案可以編輯裡面的內容（授權方式亦可自選）

![](https://image.wadeism.net/github02.png)

\
回到我們的系統上，先安裝 git 與建立一個管理 GitHub repository 的資料夾
    
```bash
# for Ubuntu 系統
    
sudo apt install git
```
    
```bash
# for CentOS 系統 
    
sudo yum install git
```
    
```bash
mkdir Git_Project
```

\
進入資料夾後，使用 git clone 把我們剛建立的 homepage repo 給同步下來，位址在 repo 頁面中可以找到
    
```bash
cd Git_Project
```

```git
git clone https://github.com/account/homepage.git

# git clone 這個指令其實就是把目前指定的 repo 上所有的東西都抓下來
```

![](https://image.wadeism.net/github03.png)

中間有個綠色的 「{{< blue >}}Clone or download{{< /blue >}}」，位址就在這邊

\
Git_Project 裡會多出一個「 homepage 」的資料夾，這個資料夾就等於我們網站的根目錄，我們可以把所有的網頁相關檔案都丟進 homepage 裡
    
```bash
cp ~/xxx/index.html ~/Git_Project/homepage/
```
    
```bash
cd ~/Git_Project/homepage && ls ~/Git_Project/homepage
```
    
```bash
ls ~/Git_Project/homepage
```

```bash
# 執行結果：
    
index.html README.md

# 現在可以看到資料夾裡有兩個檔案了，一個就是我們剛才丟過去的 index.html
```

\
在 GitHub 中，只有 {{< blue >}}master{{< /blue >}}、{{< blue >}}gh-pages{{< /blue >}} 這兩個 branch 與 master 底下的 /doc 可以當作靜態網頁空間來使用，這裡我們使用 {{< blue >}}gh-pages{{< /blue >}}，順便可以瞭解切換專案的方法
    
```git
git checkout --orphan gh-pages
```

* {{< green >}}{{< mono >}}checkout{{< /green >}}{{< /mono >}}：切換專案
* {{< green >}}{{< mono >}}orphan{{< /green >}}{{< /mono >}}：獨立出來的意思
* {{< green >}}{{< mono >}}gh-pages{{< /green >}}{{< /mono >}}：github 裡想放網頁一定只能放在這個專案名稱中

\
接下來開始進行把新增檔案上傳回 GitHub 的動作

首先如果還沒設定過 git account 的話，要先設定姓名與 E-mail，否則之後的 commit 不會成功
    
```git
git config --global user.name "YourName"
```
    
```git
git config --global user.email "YourName@gmail.com"
```

\
接著將資料夾裡的檔案全部加入到 git 中，類似加入待上傳檔案的概念
    
```git
git add -A
```

* {{< green >}}{{< mono >}}-A{{< /green >}}{{< /mono >}}：選取全部的檔案

\
也可以使用下面的指令
    
```git
git add *
```

\
再來要為這次上傳的東西新增註解，可以作為辨識版本的依據

```git
git commit -a -m "註解內容"
```

\
最後將檔案 push（上傳）到 GitHub

```git
git push origin gh-pages
```

\
git push 會要求輸入github的帳號密碼，輸入完成後就會正式上傳

網址為：{{< blue >}}http://account.github.io/homepage/index.html{{< /blue >}}

\
回到 GitHub 的頁面中，選點「{{< blue >}}Branch{{< /blue >}}」可以看到我們剛才新建的 {{< blue >}}gh-pages{{< /blue >}}，點選它並切換過去

![](https://image.wadeism.net/github04.png)

\
切換過去後，可以看到我們剛才 push 的 index.html 檔案，表示有上傳成功了，點選該檔案也可以看到裡面的原始碼

![](https://image.wadeism.net/github05.png)

![](https://image.wadeism.net/github06.png)

\
最後在瀏覽器上打入 http://account.github.io/homepage/index.html 就可以看到你的網頁了！（記得把裡面的 account 換成自己的）

![](https://image.wadeism.net/github07.webp)
