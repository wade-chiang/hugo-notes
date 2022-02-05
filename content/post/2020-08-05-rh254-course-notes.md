  \* ---
author: wade
date: 2020-08-05 04:10:54+00:00
title: RH254 課堂筆記
type: post
url: /post/rh254-course-notes/
categories:
- Linux
tags:
- CentOS
- RH254
- RHCE
---

## Chapter 1

陳勇勳  
jacky_chen@uuu.com.tw  
www.bulls.idv.tw  
資料加密篇

foundation0/Netfilter.pdf

* /lib/systemd/system/
* .service - standalone 的大多是 .service 結尾
* .path - cups.path，例如 systemd 會幫你盯著一個目錄，當目錄有新檔案才會叫醒 cupd
* .socket - transtion 的大多以 socket 結尾，例如 telnet

盡量使用 systemctl reload *.servier 來替代 restart

iptables.server  
ip6tables.service  
firewalld.service

* * *

## Chapter 2

ip command 一定要會！一台 linux 可以有 256 個 route table

tc  - traffic control

Linux 網路安全技術與實現

ip link show 看網卡名稱


```bash
nmcli connection add con-name home type ethernet ifname eth0
nmcli connection add con-name office type ethernet ifname eth0 ip 4 192.168.0.1/24 gw4 192.168.0.245
```

* 用 nmcli 改 ip , netmask 跟 gateway 時，要三個一起打上，不能單獨改，用 p27  
nmcli 如果要新增一個值，例如，多一個 dns ，那前面要加上 + 號，見 p28
* dhcp 的話把 /etc/hostname 這個檔案刪掉
* mtr 工具，連續追縱一個 trace path 的狀態


```bash
netstat -na |grep -i established
# 來看哪台 host 跟我的主機有連線正在持繼建立中
```

* * *

## Chapter 4

### iptables

xt_geoip  

Filter   

從外面連進來我的 httpd 的就叫 input  
本機要上網，送出去的叫 output  
路過而不入的封包為 forward   
限制防火牆後端的主機應該在意 foward 而不是 output


```bash
iptables -t filter -L -n --line-number

/etc/protocol

iptables -A FORWARD -p 6（tcp） # -p可用數字，定義請查詢/etc/protocol
```

限制內部用 reject，外部用 drop

-i : incoming interface  
-o : outgoing interface


```bash
# 可以看哪條規則的封包數最多
iptables -L -n -v

# 把這行當default policy
iptables -t filter -A INPUT -i eth0 -j DROp
```

xt_state.ko 模組，將連線分為四種狀態

* NEW： 每一條連線（session）的第一個封包的狀態。
* ESTABLISHED：當一條連線無論方向能成功出去或進來，它的狀態就是 ESTABLISHED
* RELATED：RELATED的封包也要讓它回來，它可以告訴你封包為何錯誤的狀態？
* INVALID：不正常狀態的封包

當 ssh 連到某台防火牆有開的 server 時, 常常會碰到很慢才連上的問題，是因為 firewall 把連入的 ip 拿去給 dns server 解析，但是防火牆送給 dns server 的封包是出得去回不來，因為沒有設ESTABLISHED，所以要等 time out 時才讓ssh client連入


```bash
iptables -t filter -A INPUT -m state --state INVALID -j DROP
# INVALID的阻擋規則應該放在最前面比較好！！

iptables -t filter -A INPUT -m multiport -p tcp --dports 22,25,110 -j ACCEPT
# multiport這個模組可以把多個port合成一行指令（這個模組最多可以指定25個port）
```


```bash
/etc/rc.d/rc.local
# 這個檔案預設不存在，可自行建立

#!/bin/bash
/root/firewall.sh

chmod 755
restorecon -Rv /etc/rc.d/rc.local

# 這樣開機就會去執行這個檔案裡的指令了！
```

NAT  
多→1  
多→多  
1→多

把來源端 ip 換掉的 nat 稱為 source nat，簡稱SNAT  
把目的端 ip 換掉的 nat 稱為 destnation nat，簡稱DNAT

prerouting chain 做 dnat 的事  
postroutiong chain 做 snat 的事

output chain 是為了幫本機的封包做 dnat 用  
postrouting or prerouting 的位置要看封包的方向，因此 postrouting 一定要用 -o 來表明封包的來源方向

nat 只要做單一方向設定即可，反方向的封包系統會自動幫你做  

prerouting 用 -i，postrouting 用 -o


```bash
-A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to 172.25.0.11:80
# 將外面連入的8080 port導入我的80port
```

下一代的netfilter叫作nffilter

* * *

## Chapter 6

mailq  
postqueue -p

看有多少 mail 正要外送 or 送進來（視 server 端不同）

外寄 server 不用密碼就可以寄信，只有外送的pop3要密碼

relate control，標明哪些 ip 是自己人，若 ip 不在這個範圍內，就不幫它寄信（因為外寄不用帳密，所以設計了這個功能，以免幫別人寄垃圾mail）

外送 outbound server 設定（server35）：

* 讓 postfix 可以接受外部的 ip：inet_interfaces = all
* 填上自己的 ip：mynetworks = 127.0.0.0/8,172.25.x.0/24
* 郵件地址偽裝，可以把 mail 位址弄得好看點，只會接上 domain name: myorigin = example.com


內送 server設定（desktop35）

* inet_interfaces = all
* mydestnation = XXXX XXX,desktopX.example.com（收信時，@ 後面地址長得像這個設定的才收）
* 開防火牆 25 port

null client設定（kiosk）

* relayhost = [serverX.example.com]
* myorigin = example.com

* * *

## Chapter 7

### iSCSI

內部主機連接iscsi的線路最好跟對外的線路切開，用專門的線路來連比較好！

* * *

## Chapter 8 & 9

### NFS & SAMBA

* NFS 4.0 沒有 showmount 指令，在純 4.0 的情況下只能先掛載主機的根目錄
* klist 可以看 ticket
* client 端不能用 root 來測，因為一定可以成功進去，要用 ldapuser

samba 4.0已經可以完整模擬windows ad

writable = yes：所有經過帳號驗證的使用者都有讀寫的權  
writable = no：所有經過帳號驗證的使用者都只有讀的權力

writable = no  
write list = user 1  
所有通過驗證的使用者都沒有寫的權限，除了 write list 裡的 user

* valid users：只有裡面的人有存取權限
* mount 要能 mount 網芳要裝 cifs-utils
* credentials 單字必背！！！

* * *

## Chapter 10 & 11

* 資料錄
* mariadb and mysql 裡的任意字元不是 *，而是%
* select會考！！

httpd.conf 裡的相對路徑都是以 server root 的目錄為 root  

httpd.apache.org/docs/2.4/mod/mod_log_config.html#formats  

doc:  /usr/share/doc/httpdxxx  

chcon -Rv --reference /var/www  /opt/www  

semanage fsontext -a -t httpd_sys_content_t 'dir/'

自建 CA  
cd /etc/pki/tls/misc/  
./CA -newca 生成的內容：/etc/pki/CA/ 

public key: /etc/pki/CA/cacert.pem,  
private key:  /etc/pki/CA/private/cakey.pem

還原 base 64 encode  
openssl req -in newreq.pem -noout -text

* 把 newreq.pem 的內容貼到網路上的 CA 商就可以申請
* CA server 得到的 newreq.pem一定要放在 /etc/pki/misc/pwd/

HTTPS  

public key : 1024, 2048, 4096  
session key: 64, 128, 256

* 產生憑證申請書（server）  cd /etc/pki/tls/misc/
* ./CA -newreq  (get newkey.pem, newreq.pem)
* 申請書送給 CA
* CA 對申請書進行簽章：./CA -sign 中間會詢問ca的private key 密碼
* 得到 newcert.pem，把它丟還給 client 端即可，還給 client 後，CA 端的 newcert.pem 與 newreq.pem 就不需要了，可刪除


```bash
# 拿掉 private key 上的對稱式加密
mv www0.key www0.key.es3
openssl rsa -in www0.key.es3 -out www0.key
```

* * *

## Chapter 12

### Shell Script

* normal user 可以存檔的路徑千萬不要加進 $PATH 裡
* 在 sh 裡，用 >&2 把 std err 輸出，例如輸出成 log
* $VAR++，變數用完再加 1
* ++$VAR，變數先加1再拿來用
* seq 好用！
* $* 跟 $@ 都是所有參數的加總數目
* 盡量用 case 代替 if...than
* case 的每一個 case 用 ;;來結束區塊


```bash
LESS="-m"
export LESS

export LESS="-m"



login shell & non login shell


shell function就像比較多行的alias
```

* * *

## Chapter 14

### Docker and Container

* Docker is a Container Manager Tool
* container 是個應用程式，因此應用程式一結束，該 container 就會從記憶體裡消失
* yum clean all 可以把暫存檔刪除，以維持 container 最小化
