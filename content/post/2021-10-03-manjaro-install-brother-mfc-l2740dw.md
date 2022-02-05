---
author: wade
date: 2021-10-03 09:48:00+00:00
draft: false
title: Manjaro 安裝 Brother MFC-L2740DW 雷射複合機
type: post
url: /post/manjaro-install-brother-mfc-l2740dw/
image: "https://image.wadeism.net/manjaro_l2740dw_07.png"
categories:
- Linux
tags:
- Brother
- Manjaro
- 印表機
- 掃瞄器
- 複合機
---

我家有台 Brother 的 MFC-L2740DW 雷射複合機。是台不算太新，但功能齊全、CP值又高的黑白雷射複合機，可影印、掃瞄、傳真、列印，基本上想拿 Manjaro 來當日常環境的話，掃瞄跟列印算是很必要的功能。

在 [Brother 的官網](https://support.brother.com/g/b//downloadtop.aspx?branch=apweb&c=tw&lang=zh&prod=mfcl2740dw_us_eu_as)裡一直都有提供 Linux 的驅動程式，分別是 deb 與 rpm 的安裝包，也算是涵蓋了兩大陣營，但並沒有 Arch 系的安裝方法，初入 Arch 體系的我雖然一開始有點不知所措，但在 {{< blue >}}yay{{< /blue >}} 的指令下去之後，真的是被 AUR 的完整度嚇到了，下面就來介紹我的安裝過程：


## 環境說明

系統：{{< blue >}}Manjaro 21.1.4 Minimal{{< /blue >}} 版本

複合機連接方式：內部網路 IP 連線

（本例事務機的 IP 為 {{< blue >}}192.168.1.210{{< /blue >}}）


## 列印功能安裝教學

安裝 MFC-L2740DW 的驅動程式

```bash
yay -S brother-mfc-l2740dw
```

沒錯！AUR 的 repo 裡已經有這台型號的驅動程式套件了，如果用 tab 查看，可以看到幾乎大多數的型號都有，看到用 tab 補出那一大排 brother-mfc-xxxxx 真的讓我嚇了一大跳，這比以前在 Ubuntu 裡下載官方的驅動簡單多了。

安裝過程的訊息如下：

```bash
正在解決依賴關係…
正在檢查衝突的軟體包…

軟體包 (4) cups-1:2.3.3op2-3  cups-filters-1.28.10-1  liblouis-3.19.0-1  qpdf-10.3.2-1

總計下載大小：   9.15 MiB
總計安裝大小：  29.29 MiB

:: 進行安裝嗎？ [Y/n] 
:: 正在接收軟體包…
 cups-1:2.3.3op2-3-x86_64                                                       5.1 MiB  19.4 MiB/s 00:00 [###############################################################] 100%
 liblouis-3.19.0-1-x86_64                                                       2.0 MiB  23.8 MiB/s 00:00 [###############################################################] 100%
 qpdf-10.3.2-1-x86_64                                                        1159.9 KiB  18.9 MiB/s 00:00 [###############################################################] 100%
 cups-filters-1.28.10-1-x86_64                                                883.4 KiB  24.0 MiB/s 00:00 [###############################################################] 100%
 總共 (4/4)                                                                     9.2 MiB  18.9 MiB/s 00:00 [###############################################################] 100%
(4/4) 正在檢查鑰匙圈中的鑰匙                                                                              [###############################################################] 100%
(4/4) 正在檢查軟體包完整性                                                                                [###############################################################] 100%
(4/4) 正在載入軟體包檔案                                                                                  [###############################################################] 100%
(4/4) 正在檢查檔案衝突                                                                                    [###############################################################] 100%
(4/4) 正在檢查可用磁碟空間                                                                                [###############################################################] 100%
:: 正在處理軟體包變更…
(1/4) 正在安裝 qpdf                                                                                       [###############################################################] 100%
(2/4) 正在安裝 liblouis                                                                                   [###############################################################] 100%
(3/4) 正在安裝 cups-filters                                                                               [###############################################################] 100%
cups-filters 的可選依賴
    ghostscript: for non-PostScript printers to print with CUPS to convert PostScript to raster images [已安裝]
    foomatic-db: drivers use Ghostscript to convert PostScript to a printable form directly
    foomatic-db-engine: drivers use Ghostscript to convert PostScript to a printable form directly
    foomatic-db-nonfree: drivers use Ghostscript to convert PostScript to a printable form directly
    antiword: to convert MS Word documents
    docx2txt: to convert Microsoft OOXML text from DOCX files
(4/4) 正在安裝 cups                                                                                       [###############################################################] 100%
>> If you use an HTTPS connection to CUPS, the first time you access
>> the interface it may take a very long time before the site comes up.
>> This is because the first request triggers the generation of the CUPS
>> SSL certificates which can be a very time-consuming job.
cups 的可選依賴
    ipp-usb: allows to send HTTP requests via a USB connection on devices without Ethernet or WiFi connections
    xdg-utils: xdg .desktop file support [已安裝]
    colord: for ICC color profile support [已安裝]
    logrotate: for logfile rotation support [已安裝]
:: 正在執行後置作業掛鉤…
(1/7) Creating system user accounts...
Creating group cups with gid 209.
Creating user cups (cups helper user) with uid 209 and gid 209.
(2/7) Reloading system manager configuration...
(3/7) Arming ConditionNeedsUpdate...
(4/7) Reloading system bus configuration...
(5/7) Updating icon theme caches...
(6/7) Updating the info directory file...
(7/7) Updating the desktop file MIME type cache...
==> 製作軟體包中：brother-mfc-l2740dw 3.2.0-1 (西元2021年10月03日 (週日) 16時15分10秒)
==> 擷取來源中...
  -> 正在下載 mfcl2740dwlpr-3.2.0-1.i386.rpm...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 39240  100 39240    0     0  90306      0 --:--:-- --:--:-- --:--:-- 90414
  -> 正在下載 mfcl2740dwcupswrapper-3.2.0-1.i386.rpm...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 24514  100 24514    0     0   212k      0 --:--:-- --:--:-- --:--:--  213k
==> 正在驗證 source 檔案 (使用 md5sums)...
    mfcl2740dwlpr-3.2.0-1.i386.rpm ... 已通過
    mfcl2740dwcupswrapper-3.2.0-1.i386.rpm ... 已通過
 -> cups not satisfied, flushing install queue
==> 製作軟體包中：brother-mfc-l2740dw 3.2.0-1 (西元2021年10月03日 (週日) 16時15分11秒)
==> 正在檢查執行時期依賴關係...
==> 正在檢查建置時期依賴關係...
==> 擷取來源中...
  -> 找到 mfcl2740dwlpr-3.2.0-1.i386.rpm
  -> 找到 mfcl2740dwcupswrapper-3.2.0-1.i386.rpm
==> 正在驗證 source 檔案 (使用 md5sums)...
    mfcl2740dwlpr-3.2.0-1.i386.rpm ... 已通過
    mfcl2740dwcupswrapper-3.2.0-1.i386.rpm ... 已通過
==> 正在移除既有的 $srcdir/ 目錄...
==> 正在解開來源...
  -> 正在解壓縮 mfcl2740dwlpr-3.2.0-1.i386.rpm (使用 bsdtar)
  -> 正在解壓縮 mfcl2740dwcupswrapper-3.2.0-1.i386.rpm (使用 bsdtar)
==> 正在啟動 prepare()...
==> 來源檔案準備就緒。
==> 製作軟體包中：brother-mfc-l2740dw 3.2.0-1 (西元2021年10月03日 (週日) 16時15分14秒)
==> 正在檢查執行時期依賴關係...
==> 正在檢查建置時期依賴關係...
==> 警告： 使用既有的 $srcdir/ 樹
==> 正在進入 fakeroot 環境...
==> 正在啟動 package()...
==> 正在整理安裝...
  -> 正在移除 libtool 的檔案…
  -> 正剷除不要的檔案...
  -> 正從靜態函式庫檔案中移除…
  -> 正從二進位檔與函式庫中去除不需要的符號連結...
  -> 正在壓縮 man 與 info 頁面...
==> 正在檢查軟體包問題……
==> 正在建立「brother-mfc-l2740dw」軟體包...
  -> 正在生成 .PKGINFO 檔...
  -> 正在生成 .BUILDINFO 檔...
  -> 正在加入 install 檔案...
  -> 正在生成 .MTREE 檔...
  -> 正在壓縮軟體包...
==> 正離開 fakeroot 環境。
==> 製作完成：brother-mfc-l2740dw 3.2.0-1 (西元2021年10月03日 (週日) 16時15分16秒)
==> 正在清理...
正在載入軟體包…
正在解決依賴關係…
正在檢查衝突的軟體包…

軟體包 (1) brother-mfc-l2740dw-3.2.0-1

總計安裝大小：  0.18 MiB

:: 進行安裝嗎？ [Y/n] 
(1/1) 正在檢查鑰匙圈中的鑰匙                                                                              [###############################################################] 100%
(1/1) 正在檢查軟體包完整性                                                                                [###############################################################] 100%
(1/1) 正在載入軟體包檔案                                                                                  [###############################################################] 100%
(1/1) 正在檢查檔案衝突                                                                                    [###############################################################] 100%
(1/1) 正在檢查可用磁碟空間                                                                                [###############################################################] 100%
:: 正在處理軟體包變更…
(1/1) 正在安裝 brother-mfc-l2740dw                                                                        [###############################################################] 100%
Restart CUPS (org.cups.cupsd.service) in order to load the new files.
Register the new print at "http://localhost:631/".

  To avoid errors like "Unable to locate printer..." when printing via network:
  Add the printer with its socked address "socket://<printer ip>:9100"
:: 正在執行後置作業掛鉤…
(1/1) Arming ConditionNeedsUpdate...
```

仔細看安裝過程的訊息，可以看到有個叫 {{< blue >}}mfcl2740dwlpr-3.2.0-1.i386.rpm{{< /blue >}} 與 {{< blue >}}mfcl2740dwcupswrapper-3.2.0-1.i386.rpm{{< /blue >}} 的東東，感覺很像是 Brother 官網裡的 rpm 包，也許這代表 Arch 是可以安裝 deb 或 rpm？可能之後有機會可以再來研究。

\
安裝印表機的設定套件

```bash
sudo pacman -S  system-config-printer
```

\
啟動印表機的服務

```bash
sudo systemctl enable cups.service && sudo systemctl start cups.service
```

\
開啟列印設定值

![](https://image.wadeism.net/manjaro_l2740dw_01.png#center)

\
開啟後先點選右上的解除鎖定，輸入密碼後再點選畫面正中央的「{{< blue >}}加入{{< /blue >}}」

![](https://image.wadeism.net/manjaro_l2740dw_02.png#center)

![](https://image.wadeism.net/manjaro_l2740dw_03.png#center)

\
在選取裝置的畫面中的「{{< blue >}}網路印表機{{< /blue >}}」→「{{< blue >}}尋找網路印表機{{< /blue >}}」裡打上印表機的 IP 就可以找到 Brother MFC-L2740DW

![](https://image.wadeism.net/manjaro_l2740dw_04.png#center)

![](https://image.wadeism.net/manjaro_l2740dw_05.png#center)

\
選取後，進到下一步可以設定印表機的名稱

![](https://image.wadeism.net/manjaro_l2740dw_06.png#center)

設定完成後，會詢問要不要印張測試頁，如果是第一次安裝的話還是印一下吧！

\
最後在設定的畫面裡就可以看到我們的事務機了，大功告成！

![](https://image.wadeism.net/manjaro_l2740dw_07.png#center)


## 掃瞄功能安裝教學

剛才只是安裝了印表機的部分，但掃瞄功能還沒完成，接下來一樣使用強大的 AUR 套件庫來安裝驅動程式

```bash
yay -S brscan4
```

```bash
# 安裝訊息節錄如下：

正在載入軟體包…
正在解決依賴關係…
正在檢查衝突的軟體包…

軟體包 (1) brscan4-0.4.10_1-5

總計安裝大小：  0.33 MiB

:: 進行安裝嗎？ [Y/n] 
(1/1) 正在檢查鑰匙圈中的鑰匙                                                                              [###############################################################] 100%
(1/1) 正在檢查軟體包完整性                                                                                [###############################################################] 100%
(1/1) 正在載入軟體包檔案                                                                                  [###############################################################] 100%
(1/1) 正在檢查檔案衝突                                                                                    [###############################################################] 100%
(1/1) 正在檢查可用磁碟空間                                                                                [###############################################################] 100%
:: 正在處理軟體包變更…
(1/1) 正在安裝 brscan4                                                                                    [###############################################################] 100%
Find additional documentation about scanner driver install at:
http://welcome.solutions.brother.com/bsc/public_s/id/linux/en/instruction_scn1.html
For a network installation run the following as root:
brsaneconfig4 -a name="Brother" model="YOURMODELHERE" ip=YOUR.SCANNER.IP.HERE
:: 正在執行後置作業掛鉤…
(1/2) Updating udev hardware database...
(2/2) Arming ConditionNeedsUpdate...
```

在安裝訊息的最後，有一段設定掃瞄器的指令「{{< blue >}}brsaneconfig4 -a name="Brother" model="YOURMODELHERE" ip=YOUR.SCANNER.IP.HERE{{< /blue >}}」

我們就按照上面的指令，改成事務機的型號與 IP 即可

```bash
sudo brsaneconfig4 -a name="Brother" model="MFC-L2740DW" ip=192.168.1.210
```

\
安裝掃瞄軟體

```bash
sudo pacman -S simple-scan
```

\
搜尋剛裝好的掃瞄軟體 Simple Scan 並打開

![](https://image.wadeism.net/manjaro_l2740dw_08.png#center)

\
等 Simple Scan 搜尋掃瞄器，並找到「Brother」就完成了，之後就可以用 Simple Scan 與我們的事務機來掃瞄文件啦！

![](https://image.wadeism.net/manjaro_l2740dw_09.png#center)

![](https://image.wadeism.net/manjaro_l2740dw_10.png#center)

* * *

參考資料：

[https://wiki.manjaro.org/index.php/Printing](https://wiki.manjaro.org/index.php/Printing)

{{< youtube id="FRj9Vm90UFg" >}}
