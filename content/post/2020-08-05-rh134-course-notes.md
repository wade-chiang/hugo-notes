---
author: wade
date: 2020-08-05 04:07:41+00:00
title: RH134 課堂筆記
type: post
url: /post/rh134-course-notes/
categories:
- Linux
tags:
- CentOS
- RH134
- RHCSA
---

## Chapter 1

IPA Server like light LDAP, can tryout in home

how to generate kickstart file

* system-config-kickstart (GUI)
* /root/anaconda-ks.cfg

* 預設 kickstart 的屬性是 600，如果用 cat 的產生新的話會變成 644，所以要用 cat 產生，如果用 cp 的話，會是 600，還要再改成 o + r
* config 跟 network 指令那些的，安裝完會進到實際的系統設定中，但像 installtion config，設定安裝時要用的 repo 那些的東西，最後系統安裝完後不會實際寫入，（例如不會真的新增 repo）

## Chapter 2

* 一般的 ^ & 是抓行開頭與行結尾，\< 跟 \> 是抓字的開頭跟結尾，一個以行為基準，一個以單字為基準，後者比較常用！
* 反斜線只作用在後面的字元，但 multipilers 則作用在前面的一個字元

* * *

## Chapter 4

at -q 指定佇列的優先等級，後面接 a-z

at （一次性的排程工作）

* atd.service
* /var/spool/at
* 若有 output 會 mail 至 root 的信箱
* at、atq、atrm

cron（週期性的排程工作）→ crontab

* crond.service
* /var/spool/cron
* 若有 output 會 mail 至工作擁有者的信箱
* crontab -e、crontab -l、crontab -r

指令部分，% 後面的文字會被當成前面的 std-in

run-part 執行 anaconda，之後會觸發之後的 daily, monthly…等執行程序（會看時間截記）  
cat /etc/anacrontab  
anacron 的指令也要研究  

每小時會執行的排程工作  
/etc/cron.d/0hourly  
→ run-parts /etc/cron.hourly （shell script）  
其中有一個檔案 0anacron  會執行 anacon -s 的指令，設定檔在 /etc/anacrontab → 會檢查 /var/spool/anacorn/* 的時間戳記  

決定要不要執行  
run-parts /etc/cron.daily   
run-parts /etc/cron.weekly  
run-parts /etc/cron.monthly

暫存檔的管理  
systemd-tmpfile-setup.service → systemd-tmpfile --create --remove  
systemd-tmpfile-clean.service  → systemd-tmpfile --clean → /etc/tmpfiles.d/*.conf  
systemd-tmpfile-clean.timer          /run/tmpfiles.d/*.conf                                  /usr/lib/tmpfiles.d/*.conf

* * *

## Chapter 5

設定 user capabiliby 後，其實 user 也可以降低 nice 值了

ps axo pid,comm,nice,cls --sort=-nice

cls 欄位，裡的 ts 代表 run 在 normal priroity 另外有個狀態叫 FF，means fast in fast out，優先權比較高，無法改其 nice 值？

* * *

## Chapter 6

newgrp command

有了 ACL 設定後，群組權限就變成了 ACL mask 設定，不再是原本的 group 權限了  
getfacl  
setfacl

* mask 代表該檔案的最大權限，mask 只影響 name user 跟 name group，不影響實際的擁有者
* mask 代表可能的最大權限，如果本來name user 設的權限就小於該權限，那就不會影響
* mask 設定不會影響 file owner 跟 others 的權限，但擁有群組（group owner）、name user、name group 都會被 mask 影響
* default acl：該目錄新建的檔案和子目錄所使用的權限規則，該屬性只能設在目錄上，檔案不行
* acl mask 最後再定，因為權限還是會以先設定好的為主，mask 會自己判斷該給的權限
* user > name user > group > name group
* setfacl 加 -n 表示不要改 mask
* 加 -R 的 p108 那邊考試會用到！！！ -b 是把 acl blank 掉，就不再有 acl 屬性
* mask 要在其它 acl 的屬性都清掉才能刪，刪掉後該檔案就不再擁有 acl 屬性
* x 權限如果不用大寫，會套用在檔案上，所以盡量用大寫 X，default acl 的話用小 x 就可以，因為針對未來新增的，不是設定原本的檔案

* * *

## Chapter 7

### SELinux

* outside → Firewall → Service conf → Permission → SELinux
* ps C 可看 command
* SELinux 也會管到 port，也許 openvpn 不能隨便改 port 跟這個有關？
* 用 mv 或 cp -a 的話，檔案會保留原本的 selinux context
* restorecon 比較建議使用，相較於chcon，restorecon 不用指定context type，會直接以預設規定來修改
* chcon 改過後，如果重開機有做 relabel 的話, 自訂的規則會被洗回預設！所以建議用 fcontext 修改資料夾本身的規則
* p134 必考
* semanage fcontext -a -t $context
* semanage fcontext -a -l $folder
* yum install selinux-policy-devel
* mandb
* man -k 
* 瀏覽網頁只需要 x 的權限，不用 r

troubleshooting （P141 超實用！）


```bash
sealert -l $UUID
# 可以看該id的錯誤訊息，在 log/message 裡看得到！可以用 grep sealert
```


```bash
semanage fcontext -a -t $context '$folder(/.*)?'

ex semanage fcontext -a -t httpd_sys_content_t '/var/www/html/my_index_folder'

# 修改該資料夾的預設 context，後面的意思是資料夾的 / 底下的所有檔案
```


```bash
restorecon -Rv $folder

# reset 資料夾的 selinux context，參數R為資料夾底下的所有檔案也要 reset，參數 v 為囉嗦模式
```


```bash
ls -d -Z $context 正確的資料夾 $想改的資料夾

# 可以用來看該怎麼設定 context
```

* * *

## Chapter 8

* LDAP，需安裝 sshd、krb5-workstation、autoconfig-gtk
* 本章重點在 how to connect，還不用去 build
* 單純驗證只要 LDAP
* ldap 提供 user information, kerberos 負責驗證，來驗證做到 single sigh on
* ssh -X，加大 X 可以把遠端 x window 的視窗在本機打開


```bash
ssh -X root@desktop35 system-config-authentication &
```

[www.freeIPA.org](http://www.freeIPA.org)

p160要再多練習，但每次練習前要 reset desktop

* * *

## Chapter 9

cat /proc/partitions  
裡面有記載 partitions 的訊息，來了解 kernel 是否知道有該 partition

partprobe /dev/vdb

fstab 的最後一個欄位fsck, 是有順序的，需要的話，照順序往下延伸  
例如：  
/dev/sda1  /  ext4  defaults  1  1  
/dev/sda2  /mnt1  ext4  defaults  1  2  
/dev/sda2  /mnt2  ext4  defaults  1  3

swapon  
swapon -a (掛載)  
swapoff  
swap -s （看狀態）  
free

* * *

## Chapter 10

LVM (Logical Volume Management)

pvcreate：pvs  
：pvdisplay

vgcreate：vgs  
：vgdisplay

lvcreate：lvs  
：lvdisplay

LVM 就像一個虛擬化的 partition

/boot 一定要放在實體的 partition 裡，不能建在 lvm 之類的上面

預設每一個 LE 可以對應到一個 pv，但也可以對應到兩個以上用 mirror 對應


```bash
# PV

# Create
pvcreate

# Verify
pvdisplay
pvs

# Reduce
pvmove

# Remove
pvremove
```


```bash
# VG

# Create
vgcreate
vgname

# Verify
vgdisplay
vgs

# Extend
vgextend
vgname

# Reduce
vgreduce
vgname

# Remove
vgremove
```


```bash
# LV

# Create
lvcreate -n
lvname -L
lvsize vgname

# Verify
lvdisplay
lvs

# Extend
lvextend -l
lvsize

+lvsize /dev/vgname/lvname

xfs.grufs
resize2fs

lvextend -r # 可以不用再打 xfs.grufs

# Reduce
lvreduce

# Remove
lvremove /dev/vgname/lvname
```

* * *

## Chapter 11

### NFS Direct mount

* Master file：  
/etc/autofs.master/  
/etc/auto.master.d/*.autofs
* Mapping file content：fullPath  Option  Source
* Base Directory：/-
* Mapping Files：/FilePath
* 通常使用時機：使用者存取已存在的目錄時，自動掛載

### NFS Indirect mount

* Master file：  
/etc/autofs.master/  
/etc/auto.master.d/*.autofs
* Mapping file content：Subdirectory  Option  Source -rw,..
* Base Directory：/path
* Mapping Files：/FilePath
* 通常使用時機：搭配集中驗證掛載使用者家目錄
