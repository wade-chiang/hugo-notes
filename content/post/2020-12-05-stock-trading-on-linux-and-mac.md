---
author: wade
date: 2020-12-05 15:04:52+00:00
draft: false
title: 使用 Linux 或 Mac 下單買賣股票
type: post
url: /post/stock-for-linux-and-mac/
image: "https://image.wadeism.net/esun00.jpg"
categories:
- Linux
- Mac
tags:
- Mac
- Stock
- Ubuntu
---

{{< red >}}本篇內容是我自己使用玉山證券在 Linux 與 Mac 上測試成功的，如果你的劵商有提供類似的憑證工具，也歡迎試試看！{{< /red >}}

Web ATM 與股票下單經常是 Windows 的專利，Linux 與 Mac 的使用者都只能望洋興嘆，主要就是卡在銀行不願意在這邊花功夫（畢竟使用的人不多），加上現在智慧型手機爆炸的普及，銀行就更不願在 Linux 之類的系統上投入時間了。

很多人問我為什麼獨鍾玉山銀行，其實也是因為他們對於 Linux 是相對友善的。印象中在 Ubuntu 8.04 版本時它們就有寫 firefox 的 plugin 讓 Linux 可以使用他們的 Web ATM。直到現在雖然 plugin 已經不能使用了，但是它們仍然有出 Ubuntu 或 Mac 的 WebATM 元件。

![](https://image.wadeism.net/esun01.png)

WebATM 與讀卡機在 Linux 上還算是好解決的東西，不過股票的下單就麻煩了。下單用的憑證匯入幾乎都只支援 Windows 的 IE，不過隨著對瀏覽器支援度的提升，下單也就變得有機會實現。

玉山銀行在前幾年開始，捨棄了原本 silverlight 的 CTS 看盤系統後，在任意的瀏覽器上看盤已經不是問題。最近因為新買 MacBook，又重新研究了憑證的匯入，結果發現憑證問題是有辦法解決的，重點就在於玉山所提供的「{{< blue >}}憑證百寶箱{{< /blue >}}」這個小軟體。


## 玉山「憑證百寶箱」的使用

[憑證百寶箱](https://www.esunsec.com.tw/cus_service/TCEM/index.html)是他們開發用來讓使用者申請、更新、備份與匯入憑證用的小工具，這次的重點就在於它的匯入功能，雖然這個小工具目前只能在 Windows 上跑（或是用 Wine），不過我們還是可以用它來幫助我們將憑證匯到想要使用的瀏覽器中（Linux、Windows、Mac 皆可），使用方法如下：

首先，找一台 Windows 的系統（或是 Wine），下載並開啟憑證百寶箱，接著登入玉山證券的帳戶

![](https://image.wadeism.net/esun02.png)


登入後可以看到 Server 端上的憑證狀態

\
接著找到左邊的「憑證匯入」並且點擊執行

![](https://image.wadeism.net/esun03.png)

![](https://image.wadeism.net/esun04.png)

匯入的功能是針對 Firefox、Chrome、 edge 等瀏覽器使用，我自己測試 Vivaldi 也是沒問題。

\
點擊後，依提示選擇憑證檔的位置，並打上憑證密碼（如果有設的話），再按下確定。如果沒有憑證檔的話，也可以使用百寶箱上面的「憑證備份」功能來匯出

![](https://image.wadeism.net/esun05.png)

\
按下確定後，會自動開啟預設的瀏覽器並且進行匯入作業，等它跑個幾秒後，就會顯示憑證匯入成功。{{< red >}}匯入成功後切記先不要把瀏覽器給關掉{{< /red >}}

![](https://image.wadeism.net/esun06.png)

\
接著最重要的一步，當我們看到瀏覽器的網址列時，可以發現剛才的憑證匯入的動作其實就是開啟一個網頁檔 {{< blue >}}TWCADepCert.xxxx.htm{{< /blue >}}，此時{{< red >}}依照該網址的路徑，在電腦中找到這個網頁檔，並且將這個檔案 copy 到想安裝憑證的 Linux 或 Mac 上{{< /red >}}

![](https://image.wadeism.net/esun07.png)

\
可以看一下該 html 檔，內容其實就是匯入用的 script 與憑證的內容，{{< red >}}所以這個檔案千萬不可外流{{< /red >}}

![](https://image.wadeism.net/esun08.png)


## 匯入憑證

回到我們的 Linux 或 Mac 上，把剛才 Windows 複製來的 htm 檔準備好，接著以想用的瀏覽器開啟該檔案，基本上就匯入成功了

![](https://image.wadeism.net/esun09.png)

由於這個 html 檔是 BIG5 的編碼，所以會有亂碼，但不影響憑證的匯入。


## 測試股票交易下單

進入玉山證券的網站，並且登入 CTS  頁面或是 CTS 看盤頁面（本例使用看盤頁面）

![](https://image.wadeism.net/esun10.png)

\
進入看盤畫面，使用下單 bar 隨便選擇一檔股票買賣，點選「立即下單」後，會跳出「請輸入憑證密碼」的提示

![](https://image.wadeism.net/esun11.png)

![](https://image.wadeism.net/esun12.png)

\
輸入完畢，按下送出後，會跳出關於交易的 Java Script 提示，就代表下單成功了！

![](https://image.wadeism.net/esun13.png)


## 驗證下單是否成功

回到玉山證券的 CTS 系統，找到交易的委托回報頁面（本例為下單美股，所以是複委托交易→委託回報），可以查到剛才下的那筆單，所以剛才的下單有確實的送出。

![](https://image.wadeism.net/esun14.png)


## 後記

記得多年前買第一台 MacBook 時，也是為了股票下單的問題而買了 VMware Fusion 並裝上 Win 7，現在終於可以不用為了下單股票而開一台虛擬機（而且只是個螞蟻戶，根本沒交易過幾次），雖然這個方法可能還是需要準備一台 Winodws 系統會比較好，不過跟以前相比已經是難以想像的進步了。

我後來看了同事的國泰證券，也是有個「{{< blue >}}憑證直通車{{< /blue >}}」的小工具，類似玉山的憑證百寶箱，感覺上應該可以用同樣的方式來匯入憑證，不過我沒有它們的戶頭所以也無從測試了

![](https://image.wadeism.net/esun15.png)

總之 Linux 與 Mac 的 user 如果使用的券商有提供類似的工具，不妨試試看，也希望老媽使用的元大證券可以跟進，這樣就可以省掉虛擬機的資源了XD
