---
author: wade
date: 2018-10-01 18:20:31+00:00
draft: false
title: SAMBA 設定教學與遠端存取 web 資料夾
type: post
url: /post/learning-samba/
categories:
- Linux
tags:
- CentOS
- Server
- Ubuntu
- Web
---

SAMBA 是一個很好用的檔案伺服器，優點在於可以讓 Windows 與 Linux 互通有無，在 Windows 上透過我們熟悉的「 網路上的芳鄰 」就可以直接連到遠端的 SAMBA Server 上存取檔案，Linux 亦然。詳細的介紹可以參考[鳥哥的網站](https://linux.vbird.org/linux_server/centos6/0370samba.php)

以下就來介紹它的安裝與使用方法

文章中如果看到 <span class="hl-red">[IP_Address]</span> ，請替換成自己需要的 IP


## 安裝 SAMBA

以 CentOS 為例，安裝所需要的套件

```bash
sudo yum install samba samba-client samba-common
```

\
安裝完之後，先將原始的 samba 設定檔作備份以確保安全
    
```bash
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

\
在這邊使用 vim 來編輯設定檔

```bash
sudo vim /etc/samba/smb.conf
```
    
```toml
# See smb.conf.example for a more detailed config file or
# read the smb.conf manpage.
# Run 'testparm' to verify the config is correct after
# you modified it.

[global]
    workgroup = SAMBA
    security = user

    passdb backend = tdbsam

    printing = cups
    printcap name = cups
    load printers = yes
    cups options = raw

[homes]
    comment = Home Directories
    valid users = %S, %D%w%S
    browseable = No
    read only = No
    inherit acls = Yes

[printers]
    comment = All Printers
    path = /var/tmp
    printable = Yes
    create mask = 0600
    browseable = No

[print$]
    comment = Printer Drivers
    path = /var/lib/samba/drivers
    write list = @printadmin root
    force group = @printadmin
    create mask = 0664
    directory mask = 0775
```

<span class="hl-blue">[ global ]</span> 標籤裡是一些基本的設定，先照預設的就好。下面的每一個標籤代表著一個 SAMBA share 的設定，我們先仿照其中一個標籤來新增設定，基本上格式都要一樣，有關 SAMBA share 的意思在後面的指令中可以看得更明白。

<span class="hl-red">本次範例中，我們要讓 Client 端用 SAMBA 存取 Host 的 Web Server 根目錄</span>：  
<span class="hl-blue">/var/www/html</span>

新增下面的內容到 /etc/samba/smb.conf 的最底下
    
```toml
[Web]
    comment = My WebSite Directory
    browseable = Yes      
    read only = No
    writable = yes       
    path = /var/www/html
    write list = @users
```

* <span class="hl-green mono">[Web]</span>：SAMBA share 的 tag 名稱
* <span class="hl-green mono">comment</span>：有關這個 SAMBA share 的敘述
* <span class="hl-green mono">browseable</span>：該 tag 是否可以在列表中出現，後面會有範例
* <span class="hl-green mono">read only</span>：該資料夾是否為「唯讀」狀態，意即無法寫入與修改裡面的資料
* <span class="hl-green mono">writable</span>：該資料夾是否可寫入，與上面的選項功能相同，但意義相反
* <span class="hl-green mono">path</span>：要分享的資料夾
* <span class="hl-green mono">write list</span>：可存取這個 tag 的使用者，@users 表示SAMBA 帳號內的人員都可以，另外也可以指定單一對象


## 建立帳號與密碼

SAMBA 有自己的帳號密碼系統，但可以使用 SAMBA 的帳號必須是 Linux server 本身已經有的帳號，不然無法在 SAMBA 的系統裡建立，例如：想建立一個 samba user 為 wade，那麼 Linux 裡就得先有 wade 的帳號。

建立 SAMBA 的使用者 wade

```bash
sudo pdbedit -a -u wade
```

```bash
new password:
retype new password:
```

\
在輸入指令與設定密碼後，出現下面訊息代表已成功建立帳號
    
```bash
Unix username:        wade
NT username:          
Account Flags:        [U          ]
User SID:             S-1-5-21-2728752839
Primary Group SID:    S-1-5-21-2728752839
Full Name:            Wade
Home Directory:       \\localhost\wade
HomeDir Drive:        
Logon Script:         
Profile Path:         \\localhost\wade\profile
Domain:               LOCALHOST
Account desc:         
Workstations:         
Munged dial:          
Logon time:           0
Logoff time:          三, 06  2月 2036 23:06:39 CST
Kickoff time:         三, 06  2月 2036 23:06:39 CST
Password last set:    二, 02 10月 2018 00:13:13 CST
Password can change:  二, 02 10月 2018 00:13:13 CST
Password must change: never
Last bad password   : 0
Bad password count  : 0
Logon hours         : FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
```


## 啟動 SAMBA 與設定防火牆

讓 SAMBA 開機時自動啟動
    
```basj
sudo systemctl enable smb && sudo systemctl enable nmb
```

\
啟動 SAMBA Server
    
```bash
sudo systemctl start smb && sudo systemctl start nmb
```


## 設定防火牆允許連入 SAMBA
    
```bash
sudo firewall-cmd --add-service=samba --permanent && sudo firewall-cmd --reload
```


## Client 端的檢視與使用

使用 smbclient 指令來檢視遠端 SAMBA Server 的分享內容

```bash
sudo smbclient -U wade -L $IP_Address
```
    
```bash
"Enter wade's password": 
```

* <span class="hl-green mono">-U</span>：使用者的名稱，記得要用剛剛以 pdbedit 建立的帳號
* <span class="hl-green mono">-L</span>：list，將遠端的 share 資料列表出來

    
```bash
# 執行結果：

Domain=[SAMBA] OS=[Windows 6.1] Server=[Samba 4.7.1]

 Sharename       Type      Comment
 ---------       ----      -------
 print$          Disk      Printer Drivers
 Web             Disk      My WebSite Directory
 IPC$            IPC       IPC Service (Samba 4.7.1)
 wade            Disk      Home Directories
Domain=[SAMBA] OS=[Windows 6.1] Server=[Samba 4.7.1]

 Server               Comment
 ---------            -------
 LOCALHOST            Samba 4.7.1

 Workgroup            Master
 ---------            -------
 SAMBA                LOCALHOST
```

smbclient 雖然也可以拿來存取 SAMBA 的分享內容，但用掛載的方式會是比較好用的方法，下面說明掛載為遠端資料夾的方法

安裝必要套件

```bash
sudo apt install cifs-utils
```

\
掛載遠端的 Web 到本機的 /tmp 目錄底下
    
```bash
sudo mount -t cifs -o username="wade" //[IP_Address]/Web /tmp
```
    
```bash
$ sudo mount -t cifs -o username="wade" //[IP_Address]/Web /tmp

[sudo] password for wade:
Password for wade@//[IP_Address]/Web: ***
```

\
檢查是否有掛載成功
    
```bash
ls -la /tmp
```
    
```bash
# 執行結果：

ls: 正在讀取 '/tmp' 目錄: 拒絕不符權限的操作
總計 0
```

當我們用 ls 來檢查 /tmp 目錄時，發現權限不足，這代表著已經掛載成功了，但 Server 上一定有設定的問題使我們 Client 端無法正確的存取 /var/www/html 中的內容，因為 /var/www 並不是一個普通的資料夾，它是與 Web service 有關的系統資料夾，所以這時候我們先來設定 SELinux 的部分


## SAMBA Server 的 SELinux 設定

先檢視 /var/www 的 SELinux context

```bash
ls -dZ /var/www
```
    
```bash
drwxr-xr-x. root root system_u:object_r:httpd_sys_content_t:s0 /var/www
```

\
接下來我們有兩種方法可以讓 SAMBA 與 Apache 存取相同的資料夾，第一種最簡單的方法就是讓 SAMBA 擁有權限讀寫任何的資料夾：

```bash
sudo setsebool -P samba_export_all_rw 1
```

\
設定好之後，我們回到 Client 端再檢視一次 /tmp 就可以看到裡面的資料了。

這個方法相當單純且容易，不會有任何奇怪的 SELinux 問題發生，但如果你不希望 SAMBA 有這麼高的權限，而只希望它能存取 /var/www 資料夾的話，使用下面的方法可以只針對 /var/www 資料夾的權限來做設定
    
```bash
chcon -t public_content_rw_t /var/www
```
    
```bash
setsebool -P allow_smbd_anon_write 1
```
    
```bash
setsebool -P allow_httpd_anon_write 1
```

這個指令可讓 SAMBA 與 Apache 對任何帶 <span class="hl-blue">public_content_rw_t</span> 屬性的資料夾擁有存取的權限，但注意 chcon 這個指令只修改 /var/www 這個資料夾，之後在這裡面新建的檔案或資料夾也會是 <span class="hl-blue">public_content_rw_t</span> 的屬性，但如果是本來就在 /var/www 裡面的資料夾並不會被改到，因此如果我們想要修改 /var/www 與它底下所有東西的權限，要使用參數 -R
    
```bash
sudo chcon -R -t public_content_rw_t /var/www
```

指令輸入後，再次回到 Client 端的資料夾，會發現掛載到 /tmp 的 SAMBA share [ Web ] ，裡面的東西都可以看到了
    
```bash
ls /tmp
```

```bash
# 執行結果：
    
Hello.html
```

不過當我們想編輯裡面的檔案時，還是會發現檔案無法修改、無法寫入，這時請不要灰心，仔細想想 /var/www/html 的 owner 是 root，我們的使用者帳號本來就無法寫入這個資料夾底下的東西！因此還需要設定基本的檔案權限


## 使用 ACL 設定權限

首先，我們先讓使用者對 /var/www/html 這個資料夾擁有 rwx 的權限
    
```bash
sudo setfacl -m u:wade:rwx /var/www/html
```

\
這時候會發現 Client 端已經可以在 /tmp 中建立新檔案了，但要加上 sudo 才可以，接著我們如果想要修改 /var/www/html/Hello.html 這個檔案，同樣的要對它添加權限

    
```bash
sudo setfacl -m u:wade:rwx /var/www/html/Hello.html
```

\
權限改好後，回到 Client 端再來試一次

將 「 Hello~ 」這個字串寫到 /tmp/Hello.html 檔案的最後

```bash
echo "Hello~" | sudo tee --append /tmp/Hello.html
```

\
查看 Hello.html 的檔案內容

```bash
cat /tmp/Hello.html
```
    
```bash
# 執行結果：
    
Hello~
```

檔案寫入確定有成功了，我們使用 SAMBA 來掛載 Web 資料夾的目標也完成啦！

* * *

參考資料：[How do I get SELinux to allow Apache and Samba on the same folder?](https://serverfault.com/questions/131105/how-do-i-get-selinux-to-allow-apache-and-samba-on-the-same-folder)
