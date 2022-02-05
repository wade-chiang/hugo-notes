---
author: wade
date: 2020-08-01 14:43:53+00:00
title: RH124 課堂筆記
type: post
url: /post/rh124-course-notes/
categories:
- Linux
tags:
- CentOS
- RH124
- RHCSA
---

## Chapter 9

### systemd

* systemctl status 預設看 service unit，所以這類的物件不加.service結尾是可以的，但如 socket 之類的就不行了，一定要打上完整的 unit 名稱
* 某些重要的 static daemon 是無法自行啟動或停止的，大多是系統內重要的服務
* 單純執行 systemctl 可以顯示所有的 unit 的 status，但不包括 inactive 的
* 加 -l就可以顯示完整的文字
* systemctl is-active sshd、systemctl is-enabled sshd，好用的觀察指令
* systemctl 預設的 SubCommand 是 list-units
* systemctl restart 會把 daemon 的 PID 改變，但 reload 不會，reload 不一定會成功，restart比較穩
* systemctl list-dependencies graphical.target | grep target
* mask 是無法被手動或自動啟用的，disabled 則可以，所以兩個還是不太一樣，如果要確保 service 不會被意外啟用，就使用 mask
* mask 其實是建 /dev/null 到設定檔


### ssh

* 對稱式加密：演算法較簡單，強度較強，但使用較麻煩，適合用在大量訊息加密
* 非對稱式加密：演算法較複雜，強度較弱，同時產生出公開金鑰與私有金鑰，建議使用較長bit的加密法，但不適合用在大量訊息加密，因為演算法跟加密法複雜，會增加主機的 loading
* SSH Server 的公開金鑰放在 /etc/ssh/*key*
* 每一次 ssh 都會下載金鑰，只是第二次以後不會再問你要不要存，但實際上每次都下載
* ssh 的密碼登入就是對稱式加密、私有金鑰登入則是非對稱式登入
* ssh-keygen 的 passphrase 是一種通關密語，防止私有金鑰外流時被登入，但登入時每次都得輸入通關密語
* 承上，可以使用 ssh-agent 來管理通關密語，這樣又可以不用自行輸入了，不然每次都要輸入通關密語（而不是密碼）
* 再使用 ssh-copy-id 可以將公開金鑰複製到 remote 端，不過這次當然要密碼登入
* ssh-copy-id -i ~/.ssh/id_rsa.pub [root@serverX.example.com](mailto:root@serverX.example.com)
* -i 的意思為指定 key 的路徑，上傳後，金鑰會存在 remote 的 ~/.ssh/authorized.keys 裡
* /etc/ssh/sshd_config：ssh server 端的設定、/etc/ssh/ssh_config：ssh client 端的設定


```bash
# 必考的選項

/etc/ssh/sshd_config：PermitRootLogin
/etc/ssh/sshd_config：PasswordAuthentication
```


```bash
# 啟用 agent 的指令，可以玩玩看

$ ssh-agent bash
$ ssh-add
```

* * *

## Chapter 10

* log 一定要有 Facility，Serverity 的值也一定要有，其值有一個公開標準 (0 ~ 7)
* 設定檔盡量放在 xxx.d/*.conf 裡比較好，不會被覆蓋掉，不然原本的 conf 容易被更新覆蓋
* rsyslog 的 manual.html 檔可以去看一下！


```bash
journalctl --since "2014-0210 20:30:00" --until "2014-0213 12:00"

# 有點廢，但會考的指令！
```

```bash
$ journalctl -b            # 看這次開機的log
$ journalctl -b 1          # 看上次開機的log
$ journalctl -b 2          # 看上上次開機的log
```

* RTC hardware 時間會以世界協調標準時間，local 的時間再去加減
* NTP server 的設定建議加上 iburst指令，p248
* hwclock -w 立即設定硬體的時間
* timedatectl 最好回家練習一下！ p252

* * *

## Chapter 11

* 做好 default gateway 設定，就可以拿到 default route  p261
* eth0 eth1 這些名稱是不固定的，rhel7之 後，改用 enpxx enoxx 這種固定的名稱  p262

必考下列網路設定

* IP address - ping
* Subnet Mask - traceroute
* Default gateway - SS
* DNS Server - nslookup
* use ss instead netstat

NetworkManager.service：

* nm-connection-editor (GUI)
* nmcli (Command Line Utility)
* /etc/sysconfig/network-script/ifcfg-*

* nmcli connection add 時，dns 一定要在之後用 modify 改，add 時不能改！
* 建議一個 interface 設 auto connect 就好
* hostname 指令可以看，也可以暫時的改 hostname
* 如果沒有設定 hostname，Linux 會先去 dns 詢問 ip 是否有對應的 hostname，因此常常不用設定也可以有 hostname，但那是暫時的
* 名稱解析：/etc/hosts．/etc/resolv.conf
* /etc/resolv.conf 不建議直接修改，因為網路組態改過後就會被更動，因此不適合做永遠的設定，建議直接在網路組態裡修改
* getenv 可以拿來抓設定檔裡的內容
* host 指令會避開 host file 檔案，直接去 dns server 裡查
* p283 底下的 important 要看！

* * *

## Chapter 12

### tar and rsync

* tar 會直接覆寫現在資料夾中的同名檔案，所以建立時一定要注意目錄中有沒有同名檔案！
* 檔案如果沒有 r 的權限，或目錄沒有 rx 權限是無法打包的
* Tar 預設不打包 SELinux 的屬性跟 ACL，要包的話需要延伸選項 --xattrs
* 解包前最好去空目錄解
* 只有 root 解包時可以保留檔案原本的屬性，一般使用者解開後就是他自己的，無法保留使用者屬性，但權限可保留
* 一般使用者解檔案時，會被 umask 的權限影響，如果要保留原本的權限，要加選項 p，所以打包時其實有保留原本的權限
* 解壓縮時可以不用加上 x j J的 選項，因為系統已經認得該壓縮檔是哪一種壓縮方式
* scp 無法保留檔案權限（除非加選項？）
* 執行 rsync 前最好先用 -n 的 dry run 測試一遍比較安全
* rsync -a 無法同步 hard link，要同步 hard link 要加上 -H 的選項；也無法同步 ACL 跟 SELinux，如果要同步 ACL要加 -A, 要同步 SELinux 要加 -X
* rsync 的目錄有 / 或沒有 / 差很多，如果只要同步 source 裡面的內容，source 的目錄最後要加 /，最後會把檔案直接複製到 local 資料夾裡，不會另外新建 remote 的目錄，p305 一定要再看一次！

* * *

## Chapter 13

* rpm 檔名中的 noarch 表示不 care 64 or 32 位元
* rpm 安裝時驗證的公開金鑰放在 /etc/pki/rpm-gpg

自訂 yum 容器設定檔： /etc/yum.repos.d/*.repo  
[repo_id]  
name=  
baseurl=


```bash
yum repolist         
yum clean all # 可以清掉 yum download 下的 cache 檔
```

yum （向 yum server 發出 request）


```bash
# 查詢
yum list
yum search
yum info # 以上三個後面都跟套件名稱
yum provides $command name
yum groups list
yum groups info
yum history
yum history info
yum history undo
yum list yum* # 列出 yum 開頭的套件，前面有 @ 符號代表可安裝
yum search "web server" # 查有無相關的套件，只有 metadata
yum search all "web server" # 找更多，包括名稱、簡介、描述檔
yum group list hidden # 顯示所有套件
yum group list id # 顯示套件的 id
yum history undo $number # undo 還是會問 yes/no


# 安裝
yum -y install
yum -y groupinstall
yum install --no-gpg-check
# yum install 如果用 -d 會 download 到本機，套件會放在 /var/cache/yum/XXX中

# 更新
yum -y update

# 移除
yum -y remove

# kernel 更新
yum update kernel 
yum list kernel
```

rpm（查詢已安裝套件或套件安裝檔）


```bash
# 查詢
# 主要查詢已安裝套件名稱
rpm -qa
rpm -ql
rpm -qi
rpm -qd（找文件）
rpm -qc（找conf）
rpm -qp --scripts
rpm -qp --changlog
rpm -qf

# 主要查詢套件安裝檔名
rpm -qpl
rpm -qpi
rpm -qpd
rpm -qpc
rpm -qp --scripts
rpm -qp --changlog
yum localinstall

# 安裝
yum localinstall
rpm -ivh

# 更新
rpm -Uvh

# 移除
rpm -e
```

yum repolist 預設只 show enableyum repolist all 全show  
yum-config-manager --enable rhel-dvd  
yum-config-manager --add-repo="http://dl.fedoraproject.org/pub/epel/xxx/"  
*.repo 檔如果沒寫 enabled 的話，預設為 enabled=1gpgcheck = 0（取消 gpg 金鑰 check）  
p343 rpm cpio 解包看檔案

* * *

## Chapter 14

LVM  
/dev/vgname/lvname

Physical Volume 1   
Volume Group  
Logical Volume

Partition 的管理  
MBR：fdisk、fdisk -l  
GPT：gdisk、gdisk -l

File System 的建立：mkfs  
blkid

File System 的掛載：mount  
df -h、du -h  
du -h / --max-depth=1

* lsof /mount_point

hard link

* 只能建立在檔案上
* 不能跨 file system

Soft Link

* 建立 soft link 最好全部用絕對路徑
* 可建立在檔案與目錄上
* 可跨 File system

P368  

p369找 hard link 大於1的檔案時，一定要指定 type 為 file，不然會列出所有子目錄，因為每個子目錄中都有個隱藏的. 資料夾
