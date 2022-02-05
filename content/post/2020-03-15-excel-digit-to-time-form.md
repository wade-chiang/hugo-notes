---
author: wade
date: 2020-03-15 15:12:36+00:00
draft: false
title: '[Excel] 將四位數字自動轉為時間格式'
type: post
url: /post/excel-digit-to-time-form/
image: "https://image.wadeism.net/excel012.jpg"
categories:
- Office
tags:
- Excel
- LibreOffice
- Office
- Sheet
---

最近在幫忙處理一些 Excel 的工作時數表，碰到了幾個需求。正常的時間格式如：15:00，大家都很懶得多按 Shift 打那個冒號，所以記錄個人工作時數的時候，通常都只用 4 位數字，例如：「0800 - 1700」，這個情況下，會讓彙整工時的人員有點麻煩，因為 Excel 似乎還是要需是正規的時間格式，才能去做時間計算或時數的加總，因此辛苦的行政人員總是人工計算時數…

下面就來說明一下 Excel 在這個問題上的處理方法


## 輸入 4 位數字自動顯示為時間格式

想要輸入 {{< blue >}}1500{{< /blue >}} 就自動變成 {{< blue >}}15:00{{< /blue >}}，只要在格子上按右鍵，點選「儲存格格式」

![](https://image.wadeism.net/excel001.png)

在左邊的「類別」中選擇「自訂」並在「類型」中填上：{{< blue >}}00":"00{{< /blue >}}

![](https://image.wadeism.net/excel002.png)

按下確定後，在該格內輸入 1500，就會自動顯示為 15:00 了

![](https://image.wadeism.net/excel003.png)


## 計算時數

格式為時間的時候，Excel  可以直接用儲存格相減來算出時數，但由於前一步驟裡，儲存格的格式是自訂的，因此它並不是 Excel 所認識的正規時間格式。  
儲存格表面上看是時間格式的「15:00」，但我們只要點擊該儲存格，在上面的值欄位裡面顯示的其實是我們偷懶下所輸入的「1500」

因此在上面的例子中，C2 的 16:00 減去 B2 的 15:00 ，如果 D2 的格式為通用格式，最後得到的數值會是 100，也就是 1600-1500 的結果

![](https://image.wadeism.net/excel004.png)

如果將 D2 設為時間格式，出現的結果也會是 00:00，完全不是我們想要的工時

![](https://image.wadeism.net/excel005.png)

既然我們輸入的時間並非正規的 time form，因此在計算上也得用到其它的函式來達成我們想要的時間計算，下面函式即可把四位數字換算為時間格式：

    
```excel-formula
(ROUNDDOWN(INPUT,-2)/2400 + MOD(INPUT,100)/1440)
```

以上面的例子來看，我們希望時數 D2 是結束時間 C2 減去開始時間 B2 的相減結果，那麼首先我們先將 D2 的儲存格格式設為「時間」，至於時間的呈現方式就依自己的需求，本例中時間的格式使用「13:00」

![](https://image.wadeism.net/excel006.png)

接著在 D2 中，填入下面的函式就可以達到我們想要的時間相減
    
```excel-formula
=(ROUNDDOWN(C2,-2)/2400 + MOD(C2,100)/1440)-(ROUNDDOWN(B2,-2)/2400 + MOD(B2,100)/1440)
```

![](https://image.wadeism.net/excel007.png)


## 時數的加總計算

以下圖為例，橙色的格子是我們的工時加總，函式為：

```excel-formula
SUM(D2:D9)
```
    
![](https://image.wadeism.net/excel008.png)

在 3/1 ~ 3/3 日，每天的工作時間為 9 小時，因此總工時應為 27 小時，但橙色的加總欄位呈現的卻是「3:00」，這是因為現實中，並不存在「27:00」這種時間，因此 Excel 自動將該時間除與 24，將計算後的餘數作為結果，因此我們如果想要算的是時數的加總，必需要在時數加總的格子中另外自訂格式

首先，一樣在時數加總的格子中按右鍵，點選「儲存格格式」

![](https://image.wadeism.net/excel009.png)

左邊的類別選擇「自訂」，接著右邊的類型填入：{{< blue >}}[hh]:mm;@{{< /blue >}}

![](https://image.wadeism.net/excel010.png)

按下確認離開後，欄位即可確實的將所有的時數加總計算

![](https://image.wadeism.net/excel011.png)

{{< red >}}本文可同時適用於 LibreOffice Calc 與 Google Sheet{{< /red >}}

* * *

參考資料：  
[Excel-輸入時間不輸入「：」(MID,TIME)](https://isvincent.pixnet.net/blog/post/47608206-excel-%e8%bc%b8%e5%85%a5%e6%99%82%e9%96%93%e4%b8%8d%e8%bc%b8%e5%85%a5%e3%80%8c%ef%bc%9a%e3%80%8d%28mid%2ctime%29)  
  
[Time Conversion – How to convert 24hr input as 4-digit number into TIME in Excel?](https://wmfexcel.com/2014/01/25/time-conversion-how-to-convert-24hr-input-as-4-digit-number-into-time-in-excel/)
