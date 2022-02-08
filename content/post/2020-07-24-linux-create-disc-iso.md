---
author: wade
date: 2020-07-24 05:13:55+00:00
draft: false
title: Linux 建立 iso 光碟映像檔
type: post
url: /post/linux-create-disc-iso/
categories:
- Linux
---

## 從光碟建立 iso 映像檔

現在光碟逐漸勢微，所以想保存的資料光碟我都會把它轉成 iso 檔，使用 Linux 內建的 <span class="hl-blue">dd</span> 指令即可

```bash
dd if =/dev/cdrom of=/mnt/myDisc.iso
```

* <span class="hl-green mono">if=</span>：從檔案讀取（/dev/cdrom，在 Linux 中也是一個檔案）
* <span class="hl-green mono">of=</span>：寫入到指定的檔案

\
檢查 iso 檔

```bash
file /mnt/myDisc.iso
```

```bash
# 執行結果：

myDisc.iso: DOS/MBR boot sector; partition 1 : ID=0x17, active, start-CHS (0x0,2,1), end-CHS (0x123,63,32), startsector 64, 597952 sectors
```

可以看到這是一片可以開機的 iso 檔


## 從檔案建立 iso 映像檔

如果想把資料燒進光碟片，簡單的作法是一個一個資料寫入，不過如果把資料先做成映像檔再來燒錄，通常燒錄的過程會比較穩定（不過這個年頭，應該也不容易有燒錄失敗的情況了）

\
檢視要製做 iso 檔的目錄

```bash
ls /home/user/RICH3
```

```bash
# 執行結果：

16.PAT        CCGAME.MKF   MOB.PVS     NUM8.FON    RICH3.EXE    VOC.MKF
1.SAV         DATE.BLK     MOUSE.MKF   NUM8X.FON   RICH3.JS3    WINDOW.MKF
ACA.PVS       FACE.PCV     MSA.PVS     PLAY.BAT    SAYWIN.MKF   WINPPSAY.MKF
BASE.GOP      INSTALL.EXE  MSB.PVS     PLAYER.DAT  SETUP.DAT    WINTAB.MKF
BB.MKF        INST.TXT     MUSIC.MKF   PPCC.MKF    SHOPGBK.DAT  WOR16.ASC
CALD.A        JS3.EXE      NUM16E.FON  PPG.MKF     SHOUSE.GOP   WOR16.FON
CALD.B        MARK.PVS     NUM16.FON   PPM.MKF     SS16.PVS     WOR24.FON
CARD.BLK      MENU.PIC     NUM16G.FON  PPS.MKF     SS.EXE       WORD.DAT
CARDDATA.DAT  MOA.PVS      NUM32.FON   PPW.MKF     SS.PCX
```

\
將 /home/user 底下的資料夾 RICH3 製作成 iso 檔並放在 /home/user 底下

```bash
mkisofs -R -o /home/user/RICH3.iso /home/user/RICH3/
```

* <span class="hl-green mono">-R</span>：用 Rock Ridge 建立支援完整的 POSIX 檔案系統的內容，例如檔案的權限，<span class="hl-red">如果不加這個選項，英文大寫的檔名都會被改成小寫</span>
* <span class="hl-green mono">-o</span>：指定輸出的檔案路徑


```bash
# 執行結果：

I: -input-charset not specified, using utf-8 (detected in locale settings)
78.35% done, estimate finish Fri Jul 24 12:59:09 2020
Total translation table size: 0
Total rockridge attributes bytes: 4424
Total directory bytes: 0
Path table size(bytes): 10
Max brk space used 0
6389 extents written (12 MB)
```

\
檢查剛才製作的 iso 檔

```bash
file /home/user/RICH3.iso
```

```bash
# 執行結果：

RICH3.iso: ISO 9660 CD-ROM filesystem data 'CDROM'
```

\
將 iso 檔掛載到 /mnt 目錄

```bash
sudo mount -t iso9660 -o loop /home/user/RICH3.iso /mnt
```

```bash
# 執行結果：

mount: /mnt: WARNING: device write-protected, mounted read-only.
```

\
查看掛載目錄 /mnt 的內容

```bash
ls /mnt
```

```bash
# 執行結果：

16.PAT        CCGAME.MKF   MOB.PVS     NUM8.FON    RICH3.EXE    VOC.MKF
1.SAV         DATE.BLK     MOUSE.MKF   NUM8X.FON   RICH3.JS3    WINDOW.MKF
ACA.PVS       FACE.PCV     MSA.PVS     PLAY.BAT    SAYWIN.MKF   WINPPSAY.MKF
BASE.GOP      INSTALL.EXE  MSB.PVS     PLAYER.DAT  SETUP.DAT    WINTAB.MKF
BB.MKF        INST.TXT     MUSIC.MKF   PPCC.MKF    SHOPGBK.DAT  WOR16.ASC
CALD.A        JS3.EXE      NUM16E.FON  PPG.MKF     SHOUSE.GOP   WOR16.FON
CALD.B        MARK.PVS     NUM16.FON   PPM.MKF     SS16.PVS     WOR24.FON
CARD.BLK      MENU.PIC     NUM16G.FON  PPS.MKF     SS.EXE       WORD.DAT
CARDDATA.DAT  MOA.PVS      NUM32.FON   PPW.MKF     SS.PCX
```

iso 檔的內容與 /home/user/RICH3 的內容一致

* * *

參考資料：

[Create an ISO Image File in Linux](https://www.linuxlookup.com/howto/create_iso_image_file_linux)

[How to Create CD ISO Image from Linux](https://linoxide.com/how-tos/how-to-create-cd-iso-image-from-linux/)

[CD-ROM 檔案系統和 UDF 檔案系統](https://www.ibm.com/support/knowledgecenter/zh-tw/ssw_aix_71/devicemanagement/cdromudfs.html)

[鳥哥的 Linux 私房菜 - 製作一般資料光碟映像檔](https://linux.vbird.org/linux_basic/centos7/0240tarcompress.php#mkisofs)
