---
author: wade
date: 2021-10-03 17:52:19+00:00
draft: false
title: Manjaro 安裝晶片讀卡機與玉山銀行 Web ATM 套件
type: post
url: /post/manjaro-esun-web-atm/
image: "https://image.wadeism.net/manjaro_pcsc00.jpg"
categories:
- Linux
tags:
- ESUN
- Manjaro
- SmartCard
- WebATM
- 晶片讀卡機
- 玉山銀行
---

從 Ubuntu 轉換到 Manjaro 的過程中，前面已經搞定中文輸入與列印掃描，接下來只要再把晶片讀卡機與我常用的玉山銀行 Web ATM 給弄好，基本上幾個在 Linux 上比較麻煩的東西就大至解決啦。

會這麼說是因為平常的網頁瀏覽、看影片聽音樂，這些都已是 Linux 的基本功能，唯獨上面這幾樣有點看天吃飯，或是看你的廠商有沒有給驅動程式，算是一個 Linux 桌面使用者比較容易碰壁的地方，所幸 AUR 又在此強大了一次，讓我在這次的安裝上仍然沒有碰到太多的困難，依然輕鬆的搞定了一切。


## 環境說明

系統：Manjaro 21.1.4 Minimal 版本

讀卡機型號：IT-500U（ESUNCAT）

聽說 IT-500U 有分新舊版，舊版讀卡機在新版的 MacOS 上會比較好安裝，Linux 上就不清楚了，應該是都有支援，我的這台是以前玉山銀行送的喵喵讀卡機，所以是舊版的。

![](https://image.wadeism.net/manjaro_pcsc01.jpg)


## 晶片讀卡機驅動程式安裝教學

這幾年政府在對非 Windows 使用者有了很大的著墨，本次就以 [eMask 口罩預約系統](https://emask.taiwan.gov.tw/msk/index.jsp) 來作為範例。

![](https://image.wadeism.net/manjaro_pcsc02.png#center)

進入預約系統並選擇使用自然人憑證登入後，在沒有執行自然人憑證元件時，應該都會出現「<span class="hl-blue">未安裝客戶端程式或未啟動服務</span>」的提示，此時先照畫面指示去內政部下載相關元件，解壓縮並執行：

![](https://image.wadeism.net/manjaro_pcsc03.png#center)

當憑證元件執行中時，按下重新檢測，這次會出現「<span class="hl-blue">無法載入IC卡函式庫檔案!函式失敗</span>」的字樣，這就代表憑證元件正常，但是讀卡機未安裝，此時我們就來安裝晶片讀卡機的驅動程式吧！

\
安裝驅動程式

```bash
sudo pacman -S ccid pcsc-tools
```

\
啟動讀卡機 service

```bash
sudo systemctl enable pcscd.service && sudo systemctl start pcscd.service
```

\
檢查讀卡機狀態

```bash
pcsc_scan
```

\
執行 <span class="hl-blue">pcsc_scan</span> 指令後，可以看到讀卡機的狀態，當卡片未插入時，狀態如下：

```bash
Using reader plug'n play mechanism
Scanning present readers...
0: Gemalto Gemplus USB SmartCard Reader 433-Swap [CCID Interface] (1-0000:00:02.1:00.0-4) 00 00
1: Alcor Micro AU9520 01 00
 
Sun Oct  3 19:24:28 2021
 Reader 0: Gemalto Gemplus USB SmartCard Reader 433-Swap [CCID Interface] (1-0000:00:02.1:00.0-4) 00 00
  Event number: 0
  Card state: Card removed, 
 Reader 1: Alcor Micro AU9520 01 00
  Event number: 1
  Card state: Card removed,
```

\
卡片插入後，狀態會類似這樣：

```bash
Sun Oct  3 19:32:28 2021
 Reader 1: Alcor Micro AU9520 01 00
  Event number: 4
  Card state: Card inserted, 
  ATR: XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX

ATR: XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX
+ TS = XX --> Direct Convention
+ T0 = XX, Y(1): XX, K: X (historical bytes)
  TA(1) = 96 --> Fi=512, Di=32, 16 cycles/ETU
    250000 bits/s at 4 MHz, fMax for Fi = 5 MHz => 312500 bits/s
  TC(1) = XX --> Extra guard time: 0
  TD(1) = XX --> Y(i+1) = 1000, Protocol T = 1 
-----
  TD(2) = XX --> Y(i+1) = 1011, Protocol T = 1 
-----
  TA(3) = XX --> IFSC: 254
  TB(3) = XX --> Block Waiting Integer: 4 - Character Waiting Integer: 5
  TD(3) = XX --> Y(i+1) = 0001, Protocol T = 15 - Global interface bytes following 
-----
  TA(4) = 07 --> Clock stop: not supported - Class accepted by the card: (3G) A 5V B 3V C 1.8V 
+ Historical bytes: XX XX XX XX XX XX XX XX
  Category indicator byte: XX (proprietary format)
+ TCK = DD (correct checksum)

Possibly identified card (using /usr/share/pcsc/smartcard_list.txt):
XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX XX
	Citizen Digital Certificate, Taiwan (PKI)
	http://moica.nat.gov.tw/
```

看到 <span class="hl-blue">Card state: Card inserted</span> 就表示成功的偵測到卡片插入了，這時候我們再回到 eMask 的網站再做一次檢測。

![](https://image.wadeism.net/manjaro_pcsc04.png#center)

可以看到三項檢測都通過啦，接著就可以進行下一步的身份驗證並預購口罩了！（如果檢測失敗的話，可嘗試重新整理頁面或是重開瀏覽器）。

![](https://image.wadeism.net/manjaro_pcsc05.png#center)


## 玉山銀行 Web ATM 元件安裝教學

雖然這年頭網銀當道，用 Web ATM 的人已經比較少了，但是 Web ATM 可以少去許多註冊網銀、裝手機 App 的麻煩，而且用起來幾乎跟實體 ATM 一樣，所以我覺得還是很有存在的必要。

![](https://image.wadeism.net/manjaro_pcsc06.png#center)
<div style="text-align: center">元件未安裝時，即使讀卡機有驅動，Web ATM 的網頁也一樣認不出讀卡機</div>

玉山銀行對於 Linux 的使用者相對其它銀行算是非常的友善，它們很久以前就開始提供驅動程式給 Linux 的使用者，直到現在也有出 Ubuntu 的套件給 Web ATM 的使用者，本來還有點擔心它們只有出 deb 套件會不會就此不能使用，但果然 AUR 是強大的，關鍵字隨便 tab 兩下還真的有！

\
用 yay 搜尋玉山銀行 Web ATM 元件

```bash
yay -Ss esun
```

```bash
# 執行結果：

aur/racethesun 1.455-1 (+1 0.00) (Out-of-date: 2021-07-17) 
    Hurtle towards the sunset at breakneck speed in a futile race against time.
aur/esunbank-webatm 1.0.0.5-5 (+2 0.00) 
    WebATM service tool for Esun Bank at Taiwan
```

有沒有看到！esunbank-webatm 就是我們的目標啦，感謝熱心的開發者們！

\
安裝 玉山銀行 Web ATM 套件

```bash
yay -S esunbank-webatm
```

如果安裝時失敗，出現「<span class="hl-blue">元件未安裝時，即使讀卡機有驅動，Web ATM 的網頁也一樣認不出讀卡機==> 錯誤： Cannot find the strip binary required for object file stripping.</span>」的話，就先安裝 base-devel 再來重新裝一次 esunbank-webatm。

```bash
sudo pacman -S base-devel
```

```bash
yay -S esunbank-webatm
```

\
安裝完後，打開程式列，應該就會看到 ESunATM 的圖示，這時點選該圖示開啟程式。

![](https://image.wadeism.net/manjaro_pcsc07.png#center)

\
開啟後，系統的工作列會出現玉山銀行的小圖示，就表示 Web ATM 的套件已成功執行

![](https://image.wadeism.net/manjaro_pcsc08.png#center)

\
這時候再回到玉山銀行的 Web ATM 並重整頁面，可以看到讀卡機已被順利找到了！

![](https://image.wadeism.net/manjaro_pcsc09.png#center)


\
試試看，也真的可以登入網銀！

![](https://image.wadeism.net/manjaro_pcsc10.png#center)

\
有關  Manjro 安裝晶片讀卡機與玉山銀行套件的步驟大概就是以上，如果 Manjaro 可以，相信它的媽媽 Arch Linux 一定也是差不多，至於本來就被原生支援的 Ubuntu 就更不用說了。

很感謝這個年頭還有銀行願意為 Linux user 著想，也更感謝那些幫忙打包、移植的開發者們，Respect!!

* * *

參考資料：

[[[Solved] Cannot find the strip binary](https://bbs.archlinux.org/viewtopic.php?id=140055)](https://bbs.archlinux.org/viewtopic.php?id=140055)
