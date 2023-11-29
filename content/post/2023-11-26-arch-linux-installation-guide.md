---
title: 我的 Arch Linux 安裝手冊
date: 2023-11-26T23:51:59+08:00
type: post
draft: true
url: /post/2023-11-26-arch-linux-installation-guide
image: ""
categories:
- Linux
tags:
- ArchLinux
---

應該有不少人想嘗試 Arch 時，在一開始的安裝步驟就先被勸退了，記得蠻久以前的我也是如此。不過大約兩年前我的 manjaro 初體驗在7個月就突然炸掉之後，我又開始試著安裝 Arch，這次順利的成功了，從此也就成了 Arch 的愛用者。<br/>
<br/>
雖然在 Arch 台灣社群中有提到，「根本就沒有新手，又或者在 Arch 社群裡人人遇到安裝都是新手」，不過只要好好的 follow 官方 wiki 的 installation guide，其實該做該注意的裡面都已經寫上了，只要耐心得閱讀相信多數的問題都可以迎刃而解。<br/>
<br/>
話雖如此，還是想要寫一篇自已的 Arch 安裝手冊，一方面這是屬於我個人的筆記，比較以個人用途為優先（但步驟大都是官方 wiki 的內容），再者這個安裝流程在這兩年多來的幾次 Arch 安裝過程裡都是完全適用，沒有一次需要修改，所以我覺得還算是值得參考與記錄。

## 硬體環境

雖然硬體環境並不是特別重要，不過還是列一下我最近一次安裝 Arch Linux 的電腦配備<br/>
<br/>
CPU:        AMD Ryzen 9 7950X3D 16-Core, 32-Thread<br/>
MainBoard:  ASUS ROG STRIX X670E-F GAMING WIFI<br/>
Memory:     Micron Crucial DDR5 4800 32G * 2<br/>
Graphic:    ASUS TUF Gaming Radeon RX 7900 XTX OC Edition 24GB GDDR6<br/>


Arch Linux 的安裝我把會把它分為兩個部分，pre install 與 post install，pre install 就是類似裝 ubuntu 用 live cd 安裝的過程，其操作並不是在實際安裝的磁區裡，而是在 live cd 的環境中設定電腦，以下幾個就是 pre install 的步驟：

## 硬碟分割與格式化

### 硬碟分割

用 gdisk 操作安裝目標的硬碟
```sh
gdisk /dev/dev/nvme0n1
```

在 gdisk 的介面介面中，可以按 ? 來查看所有的指令，可以很簡單分割出想要的磁區規劃，下面就簡單記一下分割第一個磁區時在 gdisk 裡所需要的操作：

查看硬碟分割區狀態
```sh
Command (? for help): p
```

建立新的磁區
```sh
Command (? for help): n
```

選擇分割區（直接按 enter 選預設的就好）
```sh
Command (? for help): 
```

選擇起始磁區位置（直接按 enter 選預設的就好）
```sh
Command (? for help): 
```

選擇結束磁區位置（可直接用想要切幾G的數字來表示，本例是幫 /boot 切 1G）
```sh
Command (? for help): +1G
```

為磁區加上 partition type codes，習慣上我會切成 /boot、/ 與 /home 三個區，所以這邊列出三種磁區的代碼，雖然代號就算沒照規定設好像也不太會怎樣，但我們就還是先照書走吧：：
```sh
/boot   ef00（EFI）
/       8304（root）
/home   8302（home）
```

```sh
Command (? for help): ef00
```

最後再用 p 看一次目前的狀況，確認無誤就就可以用 w 進行實際的分割。
```sh
Command (? for help): w
```
<br/>
完成後就可以用 blkid 來檢查一下磁區是否有劃好，有劃好的話應該會看到類似下面的訊息

```sh
/dev/sr0: BLOCK_SIZE="2048" UUID="2023-11-01-06-55-57-00" LABEL="ARCH_202311" TYPE="iso9660" PTUUID="fd38acc6" PTTYPE="dos"
/dev/loop0: BLOCK_SIZE="1048576" TYPE="squashfs"
/dev/nvme0n1p2: PARTLABEL="Linux x86-64 root (/)" PARTUUID="2c40c551-cf01-4f6d-b731-058290cc038c"
/dev/nvme0n1p3: PARTLABEL="Linux /home" PARTUUID="3b4e9a75-5c87-111f-87e0-a62ce6ce94d7"
/dev/nvme0n1p1: PARTLABEL="EFI system partition" PARTUUID="c8702579-6dab-4283-adaf-caf98515b01b"
```
<br/>

劃分好磁區後，接著就來格式化磁區，除了給 /boot 的磁區用 FAT32 的 file system 以外，其它的我們都用 ext4 來格式化

```sh
mkfs.fat -F 32 /dev/nvme0n1p1
```
```sh
mkfs.ext4 /dev/nvme0n1p2
```
```sh
mkfs.ext4 /dev/nvme0n1p3
```



<span class="hl-blue">Content</span>
<span class="hl-red">Content</span>
<div style="text-align: center">Center Content</div>


* <span class="hl-green mono">-Options_1</span>：Content
* <span class="hl-green mono">-Options_2</span>：Content


## title 2

* * *

參考資料：

[Link Text](https://url)

