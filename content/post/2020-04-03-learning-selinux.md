---
author: wade
date: 2020-04-03 05:01:10+00:00
draft: false
title: SELinux 教學與設定
type: post
url: /post/learning-selinux/
image: "https://image.wadeism.net/selinux00.jpg"
categories:
- Linux
tags:
- CentOS
- Security
---

以往我們架一個 service，只要注意使用者與資料夾的權限有弄對，防火牆的 port 有開通就好，例如 samba 或 ftp。防火牆一打開，資料夾給予寫入或讀取的權限，就可以讓人連進來上傳下載檔案。

不過現在的 Linux 除了基本的檔案權限與防火牆以外，又多了 SELinux 這個額外的防護機制。以最近除錯的經驗來看，當 service 怎樣都找不出哪裡有問題時，很有可能都是與 SELinux 有關。

相較於常用的檔案目錄權限觀念，SELinux 確實複雜了不少，因此很多人都選擇關掉它，不過個人覺得既然 SELinux 這麼難搞，那就表示它真的可以增加不少安全性，所以可以的話還是先別關閉它吧！


## SELinux 基本概念

SELinux 的全名為 Security Enhanced Linux，顧名思義就是為 Linux 提供了更進一步的安全防護。

在 Linux 中，一個檔案或資料夾能不能查看或是刪除，我們常用 user、group 與讀寫、執行的權限來作最基本的安全管控，而 SELinux 我們可以把它當作一套附加的安全機制，有別於傳統 user group 的管理，{{< red >}}它是針對系統中的物件，例如：資料夾、檔案、process、port，加上一層專有的安全條文來規範什麼可以做什麼不能做{{< /red >}}。

舉例來說，常見的網頁 server Apache 預設都可讀取 /var/www/html 裡的內容，但如果今天我程式寫錯了，讓我的 php 網頁去讀 /tmp 裡的東西，由於 /tmp 在系統裡預設的權限是 777，表示 apache 是可以隨意讀寫 /tmp 的，如果 /tmp 裡有什麼特別的資料，等於全世界連上我的網站的人都有機會看到我的敏感資料了，SELinux 就是在避免這種情況的發生。

>{{< red >}}基本上 SELinux 的安全機制就是在管理 process 是否可以讀寫檔案、資料夾或是使用 port{{< /red >}}。它為每個檔案、資料夾、p  ort 加上了專屬的標籤，稱為 SELinux context（SELinux 安全脈絡），透過這個標籤，可以區分每個程式所能讀寫的檔案、資料夾，或是允許使用的 port 是什麼。

例如我們用 Apache 架網站的內容一般都是放在 /var/www/ 裡面，這個資料夾預設的標籤通常是允許 Apache 來讀取，但如果今天我不想把網頁資料放 /var/www，想放在我的 home 目錄，一般而言 home 目錄預設的標籤是不允許讓 httpd 來存取的，所以瀏覽網頁時一定會失敗，即使 Home 目錄的擁有者是 Apache，權限還設成 777。因此這時要將 home 目錄的 context type 改成與 /var/www 一樣，Apache 才能正常的讀取網頁的資料。


## 關於 SELinux 的 Security Context

前面提到 SELinux context 為每個檔案、資料夾與 port、process 都加上了屬於它的預設標籤，如果這個標籤的 type 不對，就會有無法讀寫的問題。security context 的標籤命名通常是以一串英文最後結尾加上 {{< blue >}}{{< mono >}}_t{{< /blue >}}{{< /mono >}}，這邊我就用 apache 為例來試範如何查詢系統物件（檔案、資料夾、process、port）的標籤。

### 查詢檔案與資料夾的 Security Context

在 ls 的指令中加上參數 Z 即可檢視

```bash 
ls -lZ /var/www/html
```
    
```bash
# 執行結果
    
drwxr-xr-x. 4 root   root  system_u:object_r:httpd_sys_content_t:s0          71 Mar 29 03:16 .
drwxr-xr-x. 4 root   root  system_u:object_r:httpd_sys_content_t:s0          33 Mar 28 15:23 ..
-rw-r--r--. 1 apache apacheunconfined_u:object_r:httpd_sys_content_t:s0     287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apacheunconfined_u:object_r:httpd_sys_content_t:s0       6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0   1064 Mar 28 17:10 upload.php
```

{{< blue >}}httpd_sys_content_t{{< /blue >}} 為 /var/www/html 這個資料夾的標籤，同時也是底下三個檔案的標籤。


### 查詢 Process 的 Security Context

在 ps 指令中加上參數 {{< blue >}}-Z{{< /blue >}} 可以看到 process 的 context type
    
```bash
ps -eZ | grep httpd
```
    
```bash
# 執行結果：

system_u:system_r:httpd_t:s0      828 ?        00:00:03 php-fpm
system_u:system_r:httpd_t:s0      829 ?        00:00:03 httpd
```

從上面可以看出 apache 相關的 process：httpd、php-fpm，它們所屬的 context 標籤都是 {{< blue >}}httpd_t{{< /blue >}}

### 查詢 Port 的 Security Context

使用 semanage 這個工具可以查詢有關 port 方面的資訊
    
```bash
semanage port -l | grep http
```
    
```bash
# 執行結果：

http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
http_cache_port_t              udp      3130
http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443,9000
pegasus_http_port_t            tcp      5988
pegasus_https_port_t           tcp      5989
```

上面可以看到 apache 可以使用的 port 為 80、81、443…這些大家常用的 port，這也意味著，如果你的 Apache 想要使用上述以外的 port，在 SELinux 預設規則下是禁止的，因此網頁將無法透過自訂的 port 連上！


## SELinux 常用指令

### 1. 檢查 SELinux 的狀態
    
```bash
getenforce
```

這個指令可以顯示 SELinux 目前的使用情形，一共有三種狀態

* {{< green >}}{{< mono >}}enforcing{{< /green >}}{{< /mono >}}：強制使用，一般正常的啟動都是這個狀態，SELinux 會如實的運作。
* {{< green >}}{{< mono >}}permissive{{< /green >}}{{< /mono >}}：寬容模式，在這個模式下，SELinux 會如 enforcing 模式一樣將各種訊息寫入 log 以供查詢， 但不會真的限制程式的存取，{{< red >}}因此在安全防護上等於沒有{{< /red >}}，可以把它當成 debug 模式。
* {{< green >}}{{< mono >}}disabled{{< /green >}}{{< /mono >}}：停用。

### 2. 切換 SELinux 模式

#### A. 完整切換

SELinux 模式的切換可以在 {{< blue >}}/etc/selinux/config{{< /blue >}} 檔案裡設定，內容如下
    
```bash
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=enforcing
# SELINUXTYPE= can take one of three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processesare protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

{{< blue >}}SELinux={{< /blue >}} 這個選項後面即可調整想要使用的模式

變更模式後，需重開機才會生效

#### B. 快速切換

雖然完整切換方式可以調的東西比較多，但很多時候我們只是想確認問題是不是 SELinux 所引起的，如果用改 config 的方式來調整必須重開機才可以生效，非常麻煩。這時候我們就可以用另一個方法來切換。

```bash
sudo setenforce 0
```
    
```bash
sudo setenforce 1
```

setenforce 指令後面接 0 ，會立即將 SELinux 切到 Permissive 模式，指令後接 1 則切換回 enforcing 模式，而且不用重開機即可生效，很適合即時檢查用！

>{{< red >}}一旦發現有東西無法跑就先用 setenforce 0 來確定是不是 SELinux 在搞鬼！{{< /red >}}

### 3. 查詢應用程式的 SELinux 規則

大多數的應用程式都有它專屬的 SELinux 二元值規則，下面兩個指令都可以用來查看系統中所有 SELinux 規則的啟動與否。

```bash
getsebool -a
```
    
```bash
sestatus -b
```

執行後會列出一大串的規則，由於這邊要看的是 apache 相關的設定，因此我們只查看與  httpd 有關的規則。

```bash
sestatus -b | grep httpd
```

```bash
# 執行結果：

httpd_anon_write                            off
httpd_builtin_scripting                     on
httpd_can_check_spam                        off
httpd_can_connect_ftp                       off
httpd_can_connect_ldap                      off
httpd_can_connect_mythtv                    off
httpd_can_connect_zabbix                    off
httpd_can_network_connect                   off
httpd_can_network_connect_cobbler           off
httpd_can_network_connect_db                off
httpd_can_network_memcache                  off
httpd_can_network_relay                     off
...
```

### 4. 查詢資料夾預設的 context 標籤

安裝 semanage
    
```bash
sudo yum install policycoreutils-python-utils
```
    
```bash
sudo semanage fcontext -l
```
    
```bash
# 執行結果：

/var/www(/.*)?                                     all files         system_u:object_r:httpd_sys_content_t:s0 
/var/www(/.*)?/logs(/.*)?                          all files         system_u:object_r:httpd_log_t:s0 
/var/www/[^/]*/cgi-bin(/.*)?                       all files         system_u:object_r:httpd_sys_script_exec_t:s0 
/var/www/git(/.*)?                                 all files         system_u:object_r:git_content_t:s0 
/var/www/html(/.*)?/sites/default/files(/.*)?      all files         system_u:object_r:httpd_sys_rw_content_t:s0 
/var/www/html(/.*)?/sites/default/settings\.php    regular file      system_u:object_r:httpd_sys_rw_content_t:s0 
/var/www/html(/.*)?/uploads(/.*)?                  all files         system_u:object_r:httpd_sys_rw_content_t:s0 
/var/www/html(/.*)?/wp-content(/.*)?               all files         system_u:object_r:httpd_sys_rw_content_t:s0 
...
```

semanage fcontext -l 這個指令會列出系統裡全部的資料夾與所屬檔案的標籤，這邊節錄有關 /var/www 的內容。

### 5. 為檔案與資料夾自訂 context 標籤
    
```bash
sudo semanage fcontext -a -t home_t "/tmp/test(/.*)?"
```

* {{< green >}}{{< mono >}}-a{{< /green >}}{{< /mono >}}：新增
* {{< green >}}{{< mono >}}-t{{< /green >}}{{< /mono >}}：要新增的 type

{{< blue >}}-a{{< /blue >}}、{{< blue >}}-t{{< /blue >}} 的參數可以為資料夾新增標籤，改完後再使用 {{< blue >}}semanage fcontext -l{{< /blue >}} 查詢就可以看到剛才新增的項目，但新增的標籤不會立刻生效，要使用下面的 {{< blue >}}restorecon{{< /blue >}} 指令才會生效。

### 6. 刪除所有自訂的 context 標籤

    
```bash
semanage fcontext -D
```

使用 {{< blue >}}-D{{< /blue >}} 參數會將前一步驟裡所有自訂的標籤全部刪掉，回復成系統原本的預設狀態。刪除後一樣也是要使用 {{< blue >}}restorecon{{< /blue >}} 才會正式生效。

### 7. 重新載入資料夾的預設 context 標籤

{{< blue >}}restorecon{{< /blue >}} 這個指令會依照 {{< blue >}}semanage fcontext -l{{< /blue >}} 所列出的 type ，去重設所有目標資料夾與檔案的標籤，有關這個指令的用法會在後面的實例中提到。
    
```bash
sudo restorecon -Rv /var/www/html
```

* {{< green >}}{{< mono >}}-R{{< /green >}}{{< /mono >}}：將路徑裡所有的檔案、資料夾都一起修改
    
```bash
# 執行結果：
    
Relabeled /var/www/html from unconfined_u:object_r:httpd_sys_rw_content_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0
```

### 8. 修改檔案或資料夾的 context 標籤（常用）

```bash
chcon -R -t $context_TYPE /PATH
```

* {{< green >}}{{< mono >}}-R{{< /green >}}{{< /mono >}}：將路徑底下所有的檔案、資料夾都一起修改
* {{< green >}}{{< mono >}}-t{{< /green >}}{{< /mono >}}：想要用的 context type

{{< blue >}}chcon{{< /blue >}} 這個指令可以立即的修改某個檔案或資料夾的 context 標籤，效果等同於前面第 5 步加上第 7步，好處是快速，但可能日後要做總查詢時會比較麻煩，不過 chcon 基本上算是最常用的修改方式。


## 問題排除教學：php 網頁無法上傳檔案

{{< green >}}系統與軟體{{< /green >}}
CentOS 8 with  Apache 2.4.37、PHP 7.2.11、MariaDB 15.1 

{{< green >}}檔案與目錄結構{{< /green >}}
    
```bash
# 檔案所在目錄
/var/www/html
    
# 目錄內容
drwxr-xr-x. 2 apache apache    6 Mar 26 22:34 upload       # 上傳檔案用的資料夾
-rw-r--r--. 1 apache apache  287 Mar 25 18:39 index.html   # 上傳用的 HTML 頁
-rw-r--r--. 1 apache apache 1064 Mar 26 20:14 upload.php   # 執行上傳與檢視的PHP 頁面
```

這個例子是以前練習 php 時碰到的問題

系統上有我寫的 php 網頁，這個網頁可以將檔案上傳到伺服器裡。正常的情況下，瀏覽器連上伺服器後，網頁會讓使用者上傳檔案，選擇檔案並上傳後，upload.php 會執行上傳的動作，上傳後檔案會存放在 /var/www/upload 資料夾中，且上傳成功的話，頁面會顯示出已上傳的檔案連結供下載。

![](https://image.wadeism.net/selinux01.png#center)
{{< center >}}檔案上傳頁面{{< /center >}}

![](https://image.wadeism.net/selinux02.png#center)
{{< center >}}上傳成功{{< / center >}}

\
雖然理想情況是這樣，但我發現每次上傳後，PHP 網頁顯示上傳成功，但點擊連結後，顯示檔案不存在，表示檔案沒有真的上傳成功…

![](https://image.wadeism.net/selinux03.png#center)
{{< center >}}顯示上傳成功但無法開啟圖片{{< /center >}}

### 確認是否為 SELinux 的問題

如果我們伺服器的防火牆開通了、資料夾權限也正確，但怎樣上傳就是失敗，這時候就先使用 getenforce 指令查看 SELinux 的狀態
    
```bash
getenforce
```

如果執行結果為 {{< blue >}}Enforcing{{< /blue >}}，那就執行 {{< blue >}}setenforce 0{{< /blue >}}，將 SELinux 切換到 permissive 模式
    
```bash
sudo setenforce 0
```

確認切換到 Permissive 後，再試一次上傳看是否能夠成功開啟檔案，成功的話，那就可以確定是 SELinux 的問題了。

### 查詢檔案與程式的 SELinux  context 標籤類型
    
```bash
ls  -alZ /var/www/html
```
    
```bash
# 執行結果：

total 8
drwxr-xr-x. 3 root   root   system_u:object_r:httpd_sys_content_t:s0          56 Mar 28 00:03 .
drwxr-xr-x. 4 root   root   system_u:object_r:httpd_sys_content_t:s0          33 Mar 28 00:04 ..
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0  287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0 1064 Mar 28 17:10 upload.php
```

查詢後顯示 /var/www/html 與裡面三個檔案的 context 標籤都是 {{< blue >}}httpd_sys_content_t{{< /blue >}}

### 查詢 process 的 SELinux context type

```bash
ps -eZ | grep httpd
```
    
```bash
# 執行結果：

system_u:system_r:httpd_t:s0      2308 ?        00:00:09 php-fpm
system_u:system_r:httpd_t:s0      8469 ?        00:00:06 httpd
```

從上面指令得知 httpd 與 php-fpm 這兩個程序的 context type 為 {{< blue >}}httpd_t{{< /blue >}}，接著我們來查詢 httpd_t 這個標籤對於讀寫資料的權限

### 查詢 httpd_t 對於檔案讀寫權限的 context type

首先，安裝 sesearch，這是一個 SELinux 規則的查詢程式

```bash
sudo yum install setools-console
```
    
```bash
sudo sesearch -A -s httpd_t -c file -p read -p write
```

上面指令的意思為：{{< blue >}}尋找所有允許 httpd_t 讀寫檔案或目錄的規則{{< /blue >}}

* {{< green >}}{{< mono >}}-A{{< /green >}}{{< /mono >}}：搜尋所有 allow 的規則
* {{< green >}}{{< mono >}}-s{{< /green >}}{{< /mono >}}：指定搜尋的來源類型，即本例的 httpd_t
* {{< green >}}{{< mono >}}-c{{< /green >}}{{< /mono >}}：指定規則所作用的對象，本例為 file，表示想搜尋對於檔案存取權限的規則
* {{< green >}}{{< mono >}}-p{{< /green >}}{{< /mono >}}：選擇作用於對象的行為，本例為 read 與write
    
```bash
# 執行結果

allow httpd_t dspam_rw_content_t:file { append create getattr ioctl link lock open read rename setattr unlink write }; [ httpd_builtin_scripting ]:True
allow httpd_t fusefs_t:file { append create getattr ioctl link lock open read rename setattr unlink write }; [ httpd_use_fusefs ]:True
allow httpd_t git_rw_content_t:file { append create getattr ioctl link lock open read rename setattr unlink write }; [ httpd_builtin_scripting ]:True
allow httpd_t httpd_cache_t:file { append create getattr ioctl link lock map open read rename setattr unlink write };
allow httpd_t httpd_lock_t:file { append create getattr ioctl link lock open read rename setattr unlink write };
allow httpd_t httpd_squirrelmail_t:file { append create getattr ioctl link lock map open read rename setattr unlink write };
allow httpd_t httpd_sys_rw_content_t:file { append create getattr ioctl link lock open read rename setattr unlink write }; [ ( httpd_builtin_scripting && httpd_unified && httpd_enable_cgi ) ]:True
```

搜尋後，我們會發現 upload 資料夾所屬的 httpd_sys_content_t 並沒有出現，這就表示標籤為 httpd_t 的 httpd 這個 process 是無法對 upload 資料夾做寫入動作的！ 因此會發生我們網頁顯示正常，但上傳檔案會失敗的問題。

接著注意到這行：

{{< green >}}allow httpd_t httpd_sys_rw_content_t{{< /green >}}

allow 後面接主體程序以及檔案的 SELinux 標籤，上面這行的意思是指：{{< blue >}}httpd_t{{< /blue >}} 可以讀寫標籤為 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}} 的檔案 or 目錄，所以如果希望 upload 可以被 apache 讀寫，好讓我們上傳檔案，可以將該目錄的標籤設為 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}}

上面 {{< blue >}}sesearch{{< /blue >}} 指令的結果只是節錄，實際上的條目更多，以 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}} 為例是因為光從字面上看也大概猜得到它是與 Apache 的讀寫權限有關，實際上只要資料夾改成上面搜尋到的任何一個 label 都是可以讓 apache 讀寫的。

### 修改檔案或目錄的 SELinux context 標籤

既然知道我們 upload 資料夾預設是不給 httpd 寫入的，接下來我們就要將它的標籤換成可以寫入的標籤，修改檔案或目錄的 SELinux context 標籤有三種方法：

#### 1. 使用 chcon 指令直接修改
    
```bash
chcon -R -t httpd_sys_rw_content_t /var/www/html/upload
```

* {{< green >}}{{< mono >}}-R{{< /green >}}{{< /mono >}}：將路徑底下所有的檔案、資料夾都一起修改
* {{< green >}}{{< mono >}}-t{{< /green >}}{{< /mono >}}：想要用的 context type，，例如 httpd_sys_rw_content_t

{{< blue >}}chcon{{< /blue >}} 這個指令，可以將 /var/www/html/upload 及它裡面檔案、目錄的 context 標籤立即改掉，算是最簡單快速的修改方法。接著再次檢查，確認是否已修改完成
    
```bash
ls -lZ /var/www/html/
```
    
```bash
# 執行結果：

-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0     287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apache unconfined_u:object_r:httpd_sys_rw_content_t:s0    6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    1064 Mar 28 17:10 upload.php
    
```

upload 資料夾已更改成功，接著再重新測一次網頁的上傳 ，應該就可以上傳成功並開啟檔案了！

#### 2. 為檔案或目錄新增自訂標籤

前面有提過 restorecon 這個指令的用途是將檔案、目錄的 SELinux context 標籤還原成系統預設的標籤。在上面的方法中，我們用 {{< blue >}}chcon{{< /blue >}} 將 upload 的標籤改成了 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}}，但如果我們對這個目錄用了 restorecon，你會發現 upload 的標籤從 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}} 又還原成原本的 {{< blue >}}httpd_sys_content_t{{< /blue >}} 了

    
```bash
sudo restorecon -Rv /var/www/html/upload
```
    
```bash
# 執行結果：

Relabeled /var/www/html/upload from unconfined_u:object_r:httpd_sys_rw_content_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0
```

\
從這裡可以看得出來，用 chcon 來改其實還蠻有彈性的，因為隨時可以還原，但如果我們不希望檔案的 context 標籤可以被輕易的還原，這時候我們可以用 semanage 來為檔案或資料夾新增一個自訂的 context 標籤

```bash
semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/html/upload(/.*)?"
```

上面指令的意思是為將 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}} 設定為 /var/www/html/upload 與它裡面東西的預設 context 標籤

這行指令執行完後，可以用上面試過的 semsnage fcontext -l 來查詢規則是否已建立

```bash
sudo semanage fcontext -l | grep '/var/www/html' | grep 'upload'
```
    
```bash
# 執行結果：

/var/www/html(/.*)?/uploads(/.*)?                  all files          system_u:object_r:httpd_sys_rw_content_t:s0 
/var/www/html/upload(/.*)?                         all files          system_u:object_r:httpd_sys_rw_content_t:s0 
```

可以看到預設的規則裡多了一條專屬於 /var/www/html/upload 目錄的規則了

{{< blue >}}semanage fcontext -a -t{{< /blue >}} 的指令只是為資料夾新增了規則，但目前資料夾的狀態並沒有因為規則的建立而讓 apache 可讀寫，這時要用上面提到的 restorecon 指令將資料夾重整成它應有的標籤
    
```bash
sudo restorecon -Rv /var/www/html/upload
```

```bash
# 執行結果：

Relabeled /var/www/html/upload from unconfined_u:object_r:httpd_sys_content_t:s0 to unconfined_u:object_r:httpd_sys_rw_content_t:s0
```

接著檢查 upload 資料夾目前的狀態

```bash
ls -lZ /var/www/html/
```
    
```bash
# 執行結果：

-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0     287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apache unconfined_u:object_r:httpd_sys_rw_content_t:s0    6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    1064 Mar 28 17:10 upload.php
```

我們會發現，同樣是執行 restorecon  -Rv 的指令，但這次 upload  的標籤變成了可讀寫的 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}}，而不是剛才的 {{< blue >}}httpd_sys_content_t{{< /blue >}}，這就是由於我們先使用 semanage 為 upload 新增了自訂規則的綠故！

#### 3. 套用其它資料夾的設定

前面我們使用 semanage fcontext -l 查詢時，有看到一個預設的規則
    
```bash
sudo semanage fcontext -l | grep '/var/www/html' | grep 'upload'
```
    
```bash
# 執行結果：
    
/var/www/html(/.*)?/uploads(/.*)?                  all files          system_u:object_r:httpd_sys_rw_content_t:s0 
```

這邊的意思是如果在 /var/www/html/ 裡有一個叫 uploads 的資料夾， 那麼系統會自動預設它的 context 標籤會是 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}}，也就是允許 apache 讀寫的 type。

為了驗證這點，我們先在 /var/www/html 裡建一個 uploads 的資料夾

```bash
sudo mkdir /var/www/html/uploads
```
    
```bash
ls -lZ /var/www/html
```
    
```bash
# 執行結果：

-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0     287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    1064 Mar 28 17:10 upload.php
drwxr-xr-x. 2 root   root   unconfined_u:object_r:httpd_sys_rw_content_t:s0    6 Mar 29 02:39 uploads
```

可以看到剛才建的 uploads 資料夾果然是可讀寫的 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}}

由於我上傳的資料夾是命名為 upload，而非 uploads，因此預設為不可讀寫，這時我們可以用參照現有檔案的方式來新增資料夾的預設格式

```bash
sudo semanage fcontext -a -e /var/www/html/uploads /var/www/html/upload
```

意思是：新增一條規則，規則為：將 /var/www/html/uploads 的 context type 套用到 /var/www/html/upload 上面，因此 /var/www/html/upload 的規則就會與 uploads 一樣，都是可被 apache 讀寫的 type。

接著一樣再用 restorecon -R -v 重新整理一次 /var/www/html

```bash
sudo restorecon -R -v /var/www/html
```
    
```bash
# 執行結果：
    
Relabeled /var/www/html/upload from unconfined_u:object_r:httpd_sys_content_t:s0 to unconfined_u:object_r:httpd_sys_rw_content_t:s0
```
    
```bash
ls -lZ /var/www/html
```
    
```bash
# 執行結果：

-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0     287 Mar 28 16:50 index.html
drwxr-xr-x. 2 apache apache unconfined_u:object_r:httpd_sys_rw_content_t:s0    6 Mar 28 17:11 upload
-rw-r--r--. 1 apache apache unconfined_u:object_r:httpd_sys_content_t:s0    1064 Mar 28 17:10 upload.php
drwxr-xr-x. 2 root   root   unconfined_u:object_r:httpd_sys_rw_content_t:s0    6 Mar 29 02:39 uploads
```

可以看到 upload 與 uploads 一樣都是可讀寫的 {{< blue >}}httpd_sys_rw_content_t{{< /blue >}} 了，最後再次驗證 php 網頁，就可以順利上傳成功啦！

![](https://image.wadeism.net/selinux04.png#center)


## 問題排除教學 ：PHP 無法連線 MariaDB 資料庫

這個問題在 [SELinux 設定 for Apache 存取 DataBase](https://notes.wadeism.net/post/selinux-for-apache-mysql-access/) 這篇文章裡也有教學，不過這篇全部講 SELinux 的文章裡再拿來騙一下字數（又沒錢…）

這次碰到的是 PHP 的網頁無法連接資料庫，已確定在 MariaDB 裡是有允許本機的連線，在使用 setenforce 關閉 SELinux 後，發現果然又是它在作怪，下面為解決的方法：

### 查詢 Apache 與連線相關的 SELinux 二元值規則

```bash
sestatus -b | grep 'httpd' | grep 'connect'
```

```bash
# 執行結果：

httpd_can_connect_ftp                       off
httpd_can_connect_ldap                      off
httpd_can_connect_mythtv                    off
httpd_can_connect_zabbix                    off
httpd_can_network_connect                   off
httpd_can_network_connect_cobbler           off
httpd_can_network_connect_db                off
```

從上面大概就可以看到許多端倪，有的是允許 apache 連線 ftp，有的是允許連 zabbix，而我們這邊的重點就在最後一行，httpd_can_network_connect_db，這個怎麼看都跟與 DB 的連線有關，但它竟然是 off，因此我們可以試著將它打開

```bash
sudo setsebool -P httpd_can_network_connect_db 1
```
    
```bash
sudo setsebool -P httpd_can_network_connect_db on
```

這兩個指令是一樣的，打開這個選項後，PHP 就可以順利的連線到 MariaDB 了！


## 問題排除教學 ：Apache 無法使用自訂 Port 號

一般的情況下，web server 通常使用 80、81、443 之類的 port

![](https://image.wadeism.net/selinux05.png#center)
{{< center >}}81 也是 httpd 常用的 port{{< /center >}}

但如果我的 web server 想使用個比較特別的 port 號，例如 808 port，在更改 port 並重啟 httpd 後，會發現無法正常的啟動 apache：

```bash
sudo systemctl restart httpd
```

```bash
# 執行結果：

Job for httpd.service failed because the control process exited with errorcode.
See "systemctl status httpd.service" and "journalctl -xe" for details.
```

\
更改 port 號為 808 後重啟 httpd，會啟動失敗
    
```bash
sudo systemctl status httpd
```

    
```bash
# 執行結果：

● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)
  Drop-In: /usr/lib/systemd/system/httpd.service.d
           └─php-fpm.conf
   Active: failed (Result: exit-code) since Wed 2020-04-01 23:23:39 CST; 24s ago
     Docs: man:httpd.service(8)
  Process: 1851 ExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND (code=exited, status=1/FAILURE)
 Main PID: 1851 (code=exited, status=1/FAILURE)
   Status: "Reading configuration..."

Apr 01 23:23:38 lamp systemd[1]: Starting The Apache HTTP Server...
Apr 01 23:23:39 lamp httpd[1851]: AH00558: httpd: Could not reliably determine the server's fully qualified domain name>
Apr 01 23:23:39 lamp httpd[1851]: (13)Permission denied: AH00072: make_sock: could not bind to address [::]:808
Apr 01 23:23:39 lamp httpd[1851]: (13)Permission denied: AH00072: make_sock: could not bind to address 0.0.0.0:808
Apr 01 23:23:39 lamp httpd[1851]: no listening sockets available, shutting down
Apr 01 23:23:39 lamp httpd[1851]: AH00015: Unable to open logs
Apr 01 23:23:39 lamp systemd[1]: httpd.service: Main process exited, code=exited, status=1/FAILURE
Apr 01 23:23:39 lamp systemd[1]: httpd.service: Failed with result 'exit-code'.
Apr 01 23:23:39 lamp systemd[1]: Failed to start The Apache HTTP Server.
```

error log 會直接告訴你有權限上的問題

前面我們有提過，SELinux 除了管理程式對檔案與資料夾的存取以外，也會管理程式對於 Port 的使用。基本上我們常見或不常見的幾個 service，都是有固定使用的 port 號，例如 ssh 用 22 port，httpd 就是 80 與 443 port。

```bash
sudo semanage port -l | grep http
```

```bash
# 執行結果：

http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
http_cache_port_t              udp      3130
http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443,9000
pegasus_http_port_t            tcp      5988
pegasus_https_port_t           tcp      5989
```
    
使用 {{< blue >}}semanage port -l{{< /blue >}}，可以列出所有應用程式在 SELinux 中被允許使用的 port。從上面的結果可以得知 apache 預設可以使用 80、81、443…等 port 號。而 808 這個 port 號是我自己爽用的，所以當然不可能會是 SELinux 允許的 httpd port 號。

這種情況下，我們必須在 {{< blue >}}http_port_t{{< /blue >}} 這個 context 中額外加上 808，這樣才可以順利的使用 808 port 來瀏覽我的網站。

### 為 Port 相關的 context 新增額外 Port 號

下面的指令可以將 http_port_t 新增 808 port
    
```bash
sudo semanage port -a -t http_port_t -p tcp 808
```
    
```bash
sudo semanage port -l | grep http
```
    
```bash
# 執行結果：

http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
http_cache_port_t              udp      3130
http_port_t                    tcp      808, 80, 81, 443, 488, 8008, 8009, 8443, 9000
pegasus_http_port_t            tcp      5988
pegasus_https_port_t           tcp      5989
```

查詢後可以看到 httpd_port_t 新增了一個 808 port，最後啟動 httpd，就可以成功開啟了！

![](https://image.wadeism.net/selinux06.png#center)
{{< center >}}成功的使用 808 port 開啟網頁！{{< /center >}}

[Cover By](https://www.lynda.com/CentOS-training-tutorials/5745-0.html)
