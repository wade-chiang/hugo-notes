---
author: wade
date: 2020-08-05 04:17:02+00:00
draft: false
title: Shell Script 截取變數中的部分字串
type: post
url: /post/shell-script-get-part-of-variable/
categories:
- Linux
tags:
- Bash
- Shell Script
---

除了常見的  cut、aws、sed…這些字串處理程式以外，bash  其實也有一個簡單的方法來處理字串的截取，在變數內容為字串時頗為實用

\
將字串「I Love Music」賦值給變數 demo

```bash
demo="I Love Music"
```

賦值之後，直接 echo $demo 這個變數就會出現「I Love Music」這段文字

```bash
echo $demo

I Love Music
```

如果只想 print 出特定幾個字，可以在 echo 的後面加上一些參數  
格式為：{{< blue >}}echo ${VAR:Start:Count}{{< /blue >}}

```bash
echo ${demo:2}

Love Music
```

第二個冒號後面沒有數字的話，就代表不限字數（count），所以 echo ${demo:2} 會印出 demo 變數中第三個字元以後的字，在 $demo 中，前兩個字元是「I」與「空格」，因此印出的就是第三個字元 L 之後的所有文字，也就是「Love Music」

>對程式來說，第一個字的位置為 0，第二個字的位置為 1，因此打 2 其實是代表第三個字

不過這邊我發現 echo ${demo:1} 與 echo ${demo:2} 的結果會是一樣的，照理說 ${demo:1} 的結果應該是「 Love Music」，可能是因為第二個字元是空格，所以 bash 自動把開頭的空格也去掉了，但它們只是「看起來」一樣，實際上還是不同的

```bash
echo ${demo:2}
Love Music

echo ${demo:1}
Love Music
```

\
再來試範幾個完整的格式

```bash
echo ${demo:7:5}

Music
```

意思為截取 $demo 變數中，第 8 個字元開始的 5 個字，也就是「Music」


```bash
echo ${demo:6:6}

Music
```

截取 $demo 變數中，第 7 個字元開始的 6 個字，也就是「 Music」，但由於開頭為空格字元，所以看來跟上面的 {demo:7:5} 一樣


```bash
echo ${demo:6:5}

Musi
```

截取 $demo 變數中，第 7 個字元開始的 5 個字，也就是「 Musi」，從這個例子就可以看出前面例子中的「空格」只是沒有被呈現出來，實際上還是有算在內的

參考資料：

[Shell Script 截取部份字串](https://www.opencli.com/linux/shell-script-substring)
