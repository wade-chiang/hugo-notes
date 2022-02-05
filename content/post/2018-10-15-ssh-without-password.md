---
author: wade
date: 2018-10-15 16:18:40+00:00
draft: false
title: 使用 private key，ssh 免密碼登入
type: post
url: /post/ssh-without-password/
categories:
- Linux
tags:
- Server
---

Linux 除了直接登入以外，我們也可以透過 ssh 協定來遠端登入，這是進入遠端主機最常見的方式，ssh 本身為加密連線，因此安全性也比較高，CentOS 7 剛安裝完後預設就可以透過 ssh 來登入，只要用我們 root 的密碼或是任一個使用者的密碼（如果沒被鎖權限的話）就可以了。

\
使用 ssh 指令，後面加上 使用者名稱@主機 IP or HostName
    
```bash
ssh user@192.168.100.100
```
    
```bash
user@192.168.100.100's password: 
Last login: Sun Oct 14 19:41:43 2018 from gateway
[user@localhost ~]$
```

不過如果是常常需要連入的主機，每次都要打密碼不免有點麻煩，因此除了密碼以外，我們也可以使用金鑰認證來登入，以下是大至上的流程與需要注意的地方：

\
遠端主機（ remote ）：192.168.100.100

首先在 local 端主機執行指令來生成一組公鑰與私鑰
    
```bash
ssh-keygen -t rsa
```
    
```bash
# 執行結果：

Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa): /home/user/.ssh/remote1
Enter passphrase (empty for no passphrase):
Your identification has been saved in /home/user/.ssh/remote1.
Your public key has been saved in /home/user/.ssh/remote1.pub.
The key fingerprint is:
SHA256:igDzKqUasd34t667jdfzgkGLofdfg684FyC23ffg53toVs user@ubuntu
The key's randomart image is:
+---[RSA 2048]----+
| .o.o |
| o... . |
|o .... . |
|oo o .. |
|*o+. .=o . |
|*=..+.o-o E |
|o. o.+...+ |
|x=. .o.. |
|=*o..+o. |
+----[SHA256]-----+
```

{{< green >}}{{< mono >}}ssh-keygen -t rsa{{< /green >}}{{< /mono >}} 會指定使用 RSA 加密演算法來生成金鑰，金鑰預設名稱為 id_rsa 並且會放在使用者 home 目錄底下的 .ssh 目錄中，{{< red >}}如果會有很多組不同的金鑰配對的話，建議在第二步時自訂一個名稱，如本例中的 remote1{{< /red >}}，但路徑最好還是統一放在 ~/.ssh 裡面比較方便。

{{< green >}}{{< mono >}}Enter passphrase{{< /green >}}{{< /mono >}} 則是為這組金鑰再額外設定密碼，之後使用金鑰登入的話，就還是要再輸入這組密碼，算是加強防護，但也很麻煩，可視所需的安全性來設定。

輸入完之後，會顯示這組 private key 與 public key 的路徑與 fingerprint，一組新的金鑰就完成了。

做好金鑰後，我們就可開始將金鑰放到 remote 主機上，剛才生成了一組 public key 與一組 private key，原則上 public key 是公開的，把它放在任何想登入的主機中，只要你擁有與它配對的 private key 就可以登入，因此 private 必須妥善的保存不可外流。

將 public key 導入遠端的方法也很簡單，只要使用 ssh-copy-id 這個指令即可

    
```bash
$ ssh-copy-id -i /home/user/.ssh/remote1 user@192.168.100.100
# ssh-copy-id 加上參數 -i 可指定要使用的 public key
# 導入時仍然需要輸入 remote 的登入的密碼
```
    
```bash
# 執行結果：
    
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/user.ssh/remote1.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), tofilter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you areprompted now it is to install the new keys
wade@192.168.122.231's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'user@192.168.100.100'"
and check to make sure that only the key(s) you wanted were added.
```

\
測試使用 private key 登入，-i 為指定登入用的私鑰
    
```bash
ssh -i .ssh/remote1 user@192.168.100.100
```
    
```bash
Last login: Sun Oct 14 21:18:17 2018 from gateway
[user@localhost ~]$
    
# 這次就直接使用金鑰登入了，不用再輸入密碼
```


## 使用 SSH config 快速登入

目前為止我們每次連線都要指定使用者名稱，還要記 ip 與使用的 key，有時候甚至還要使用不同的 port 來連線，有這麼多的東西要記，如果主機一多就更加頭痛，其實 ssh 有提供了一個設定檔讓我們把常用的主機與需要的參數都記下來，並且簡化連線的指令，下面就來介紹一下這個設定檔

首先編輯 {{< blue >}}~/.ssh/config{{< /blue >}} 這個檔案，沒有的話可以手動新增

```bash
# 檔案的內容格式範例如下

Host         myServer
HostName     192.168.100.100
Port         242
IdentityFile ~/.ssh/remote1
User         stanley
```

* {{< green >}}{{< mono >}}Host{{< /green >}}{{< /mono >}}：自訂連線名稱
* {{< green >}}{{< mono >}}HostName{{< /green >}}{{< /mono >}}：目標主機的 ip 或 domain name
* {{< green >}}{{< mono >}}Port{{< /green >}}{{< /mono >}}：使用的 port，沒有的話預設為22
* {{< green >}}{{< mono >}}IdentityFile{{< /green >}}{{< /mono >}}：使用的金鑰（私鑰）
* {{< green >}}{{< mono >}}User{{< /green >}}{{< /mono >}}：登入的使用者名稱

本例中我們自訂了 Host 的名稱，這也是我們之後唯一需要記的東西，而且使用的方法也很簡單，只要把 ssh 的指令後面接自訂的 Host 名稱， ex. ssh myServer，這樣就會自動的連入 myServer

```bash
ssh myServer
```
    
```bash
Last login: Sun Oct 14 21:18:17 2018 from gateway
[user@localhost ~]$
```
