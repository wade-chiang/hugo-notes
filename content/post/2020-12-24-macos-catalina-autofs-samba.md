---
author: wade
date: 2020-12-24 16:40:00+00:00
draft: false
title: macOS Catalina 使用 autofs 自動掛載 SAMBA
type: post
url: /post/macos-catalina-autofs-samba/
categories:
- Linux
- Mac
tags:
- Mac
- macOS
- SAMBA
- Server
---

我在 [CentOS 8 安裝與設定 NFS Server](https://notes.wadeism.net/post/centos8-nfs-server/) 一文中提過 NFS 在 Unix 系統中的優點，也提過 NFS 與 SAMBA 的效能比較。由於我都是在家中的內網環境下使用，NFS 與 SAMBA 對我來說是差不多快的，以我最常用的 NFS 為例，用起來的速度與本機硬碟幾乎無異。

最近開始有從外面連回家的需求，發現連上家裡的 NFS 時，光是跑檔案列表都有點慢，特別是有大量圖檔會做 thumbnail 縮圖的資料夾，本來想說畢竟是從外部連回家裡，這種速度可能也正常，不過<span class="hl-red">某一次使用 SAMBA 測試後，發現速度比 NFS 快了非常多，除了讀縮圖之外，連原本 NFS 播不太動的大型影片也可以順利播放了</span>，雖然拉時間軸還是不會有區網來的順（廢話），但基本上已經是完全堪用的程度。

雖然個人喜歡 Unix 原生的 NFS 檔案系統，不過這次使用經驗，SAMBA 不論速度還是相容性（Windows 也通）都屌虐 NFS，因此也只好生出這篇文章了（？

## 環境說明

<span class="hl-green">Server 端</span>：192.168.1.10，CentOS 8 minimal。使用一般 SAMBA 設定即可，無需為 mac 特別調整。

<span class="hl-green">Client 端</span>：macOS Catalina


## Mac Client 端設定

前面已經做過很多次了，所以應該也都知道 autofs 基本上就是編輯 <span class="hl-blue">/etc/auto_master</span> 與裡面所指向的設定檔。不過在 <span class="hl-green">Mac 裡的 autofs 有兩種類似但不太一樣的設定格式</span>，下面就來示範這兩種格式<span class="hl-red">（目前測試 SAMBA 與 NFS 在 Linux 上也都支援這兩種格式）</span>

### 格式 1 - 將掛載的 mount point 寫在指向檔

編輯 <span class="hl-blue">/etc/auto_master</span>，內容如下：

```bash
#
# Automounter master map
#
+auto_master        # Use directory service
#/net           -hosts      -nobrowse,hidefromfinder,nosuid
/home           auto_home   -nobrowse,hidefromfinder
/Network/Servers    -fstab
/-          -static

# SAMBA AutoFS
/-  auto.cifs
```

<span class="hl-blue">/-</span> 表示指向設定檔與 <span class="hl-blue">auto_master</span> 同路徑，<span class="hl-blue">auto.cifs</span> 則是指向檔的名稱，接著編輯設定檔 <span class="hl-blue">/etc/auto.cifs</span>

```bash
sudo vim /etc/auto.cifs
```

```bash
# 內容如下

/System/Volumes/Data/samba_mount/share -fstype=smbfs,soft,noowners,nosuid,rw ://UserName:Password@192.168.1.10:/share
```

### 格式 2 - 將掛載的 mount point 寫在 auto_master

編輯 <span class="hl-blue">/etc/auto_master</span>，內容如下：

```bash
#
# Automounter master map
#
+auto_master        # Use directory service
#/net           -hosts      -nobrowse,hidefromfinder,nosuid
/home           auto_home   -nobrowse,hidefromfinder
/Network/Servers    -fstab
/-          -static

# SAMBA AutoFS
/System/Volumes/Data/samba_mount  /etc/auto.cifs
```

這次先把 mount point 寫在 auto_master 裡，後面一樣編輯指向檔 <span class="hl-blue">/etc/auto.cifs</span>

```bash
sudo vim /etc/auto.cifs
```

```bash
# 內容如下

share  -fstype=smbfs,soft,noowners,nosuid,rw ://UserName:Password@192.168.1.10:/share
```

## 設定說明

兩種格式其實大同小異，個人比較偏好第一種的寫法，讓 auto_master 檔的內容比較清爽，複雜的內容交給各別的指向設定檔，接著下面就設定檔的內容做說明：

* <span class="hl-blue">://UserName:Password@192.168.1.10:/share</span> 是指掛載目標為 192.168.1.10 上面 SAMBA 分享出的 [share]  tag 內容，UserName 與 Password 請自行修改，記得也可以不用把 Password 明碼寫在這邊，不過我還沒試過。
* <span class="hl-blue">/System/Volumes/Data/samba_mount</span> 是 Client 端裡的 mount point，在我自己的測試中，<span class="hl-red">mount point 一定要放在 /System/Volumes/Data 裡，不能用 user home 目錄裡的資料夾當 mount point</span>。這部分記得在其它網站也有人提到過，詳細原因要再查一下

\
設定完成後執行 automount，就可以試著進去資料夾看看有沒有自動掛載成功

```bash
sudo automount -vc
```

```bash
cd /System/Volumes/Data/samba_mount && ls
```
