---
author: wade
date: 2021-03-13 13:35:02+00:00
draft: false
title: Debian 10 安裝 LNMP 與 Wordpress 的 Nginx 設定
type: post
url: /post/debian10-install-lnmp-wordpress-nginx/
image: "https://image.wadeism.net/debian10_logo.png"
categories:
- Linux
tags:
- Debian
- Nginx
- Wordpress
---

自從 Red Hat 宣佈不再會有 CentOS 9，只會有 CentOS Stream，並作為 RHEL 的先期測試，我就對 CentOS 有點失去信心了，雖然還是有不少組織決定 fork 出來做一套如同 CentOS 一樣 free 的 系統，不過之後會怎樣也不知道，不如就先來試試 Debian，因此我開始計劃將目前手邊 CentOS 8 通通換掉，頂多留個 7（CentOS 8 EOL直接被拉到 2021 年…，虧我之前那麼早就改用 8）

本篇主要記錄 Debian 10 安裝 Nginx、MySQL、PHP 及 WordPress 的過程（記得 sudo vim 之類的常用軟體先裝一裝）


## 安裝 Nginx

Debian 10 的套件庫裡已有包含 nginx 了，不過我這次想要裝新版的，因此就使用官方的安裝流程，功能上大同小異，<span class="hl-red">但安裝套件庫的版本或官方的版本在 conf 上會有些設定上的不同！</span>

雖然我還是會列出安裝的方式，因為大概不會有什麼變動，但可以的話還是建議大家先看一下[官網的流程](https://nginx.org/en/linux_packages.html#Debian)。

\
安裝必要的相依套件

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release
```

\
新增 nginx mainline 版套件庫

```bash
echo "deb http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" \
| sudo tee /etc/apt/sources.list.d/nginx.list
```

nginx 官方建議安裝 mainline 版本，但如果會擔心最新版可能與一些舊有第三方 module 會有相容性的問題，也可以安裝較穩定的 stable 版本，

\
新增 nginx stable 版套件庫

```bash
echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" \
| sudo tee /etc/apt/sources.list.d/nginx.list
```

\
將官方套件庫的安裝優先權改為高於預設套件庫

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
| sudo tee /etc/apt/preferences.d/99nginx
```

\
下載 gpg key

```bash
curl -o /tmp/nginx_signing.key https://nginx.org/keys/nginx_signing.key
```

\
驗證下載的 key

```bash
gpg --dry-run --quiet --import --import-options import-show /tmp/nginx_signing.key
```

```bash
# 執行結果：

pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

\
將 key 放到正式的資料夾中
```bash

sudo mv /tmp/nginx_signing.key /etc/apt/trusted.gpg.d/nginx_signing.asc
```

\
安裝 nginx

```bash
sudo apt update && sudo apt install nginx
```


## 安裝 MySQL

Debian 10 的套件庫裡預設已有 MariaDB 10.3 的版本，是[相容 MySQL 5.7 的最後一版](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)，10.4 之後的版本就會是 MySQL 8 了，因此直接安裝即可

```bash
sudo apt install mariadb-server
```

\
執行初始化，設定 SQL Server 的 root 密碼與其它設定

```bash
sudo /usr/bin/mysql_secure_installation
```


## 安裝 PHP 7

Debian 10 的套件庫裡預設為 PHP 7.3 的版本，如果想要用更新一點的版本（本例為 PHP 7.4），簡單一點的方法是使用第三方的套件庫（當然想自己編譯也是可以）

\
安裝相依套件

```bash
sudo apt install lsb-release apt-transport-https ca-certificates
```

\
下載 gpg key

```bash
sudo wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
```

\
新增第三方套件庫

```bash
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/php.list
```

\
安裝 php 7.4 with php-fpm

```bash
sudo apt update && sudo apt install php7.4-fpm
```

因為我們使用 nginx，所以直接安裝 php7.4-fpm 就會把基本的套件都裝好

\
安裝額外的 php module

```bash
sudo apt-get install php7.4-{curl,mbstring,mysql,imagick,xml,zip,gd}
```

上面這些是建議安裝的 module，詳細的內容可以參考 [WordPress 的官網](https://make.wordpress.org/hosting/handbook/handbook/server-environment/)

\
到這邊 LNMP 就算是安裝完成了，不過 nginx 與 php 之間的設定還沒有弄好，下面就會一邊介紹一下 WordPress 與 Nginx 還有 PHP 的一些設定


## 權限設定

Debian 與 CentOS 比較不一樣的地方是預設了一個名為 <span class="hl-blue">www-data</span> 的 user 與 group，php-fpm 預設的執行者就是 www-data，因此建議將 nginx 放網頁的資料夾 owner 做為更改，以 nginx 預設的資料夾為例：

```bash
sudo chown -R www-data:www-data /usr/share/nginx/html
```

\
另外也要將 nginx 這個 user 加入 www-data 這個群組裡，這樣 nginx 才可以對網頁檔案做存取

```bash
sudo usermoad -aG www-data nginx
```

\
最後重啟 nginx 讓設定生效

```bash
sudo systemctl restart nginx
```


## 為 PHP 建立 nginx 的 conf 檔

LNMP 裝完後，<span class="hl-red">如果不做設定，php 網頁是不會經過 php 引擎的，所以打開 php 網頁只會變成下載網頁，而看不到實際的內容</span>，這是因為 nginx 與 php 之間的關係類似反向代理，因此我們要先寫一個設定檔，告訴 nginx 要把 php 檔送到 php-fpm 去做解析

\
建立 snippets 資料夾

```bash
sudo mkdir /etc/nginx/conf.d/snippets
```

這個資料夾用來放一些常重覆用到的 nginx 設定檔，例如 php 的解析，<span class="hl-green">如果是使用 Debian 內建的 repo 裝 nginx 的話，這個資料夾會在 /etc/nginx 裡，但如果是使用官方的 repo 最新版安裝，就不會有這個資料夾，需要自己建立</span>，我放在 /etc/nginx/conf.d 裡只是為了備份方便。

\
建立解析 php 的 conf

```bash
sudo vim /etc/nginx/conf.d/snippets/php.conf
```

```nginx
# 內容如下：

fastcgi_intercept_errors on;
fastcgi_index  index.php;
include        fastcgi_params;
fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
fastcgi_param  PATH_INFO $fastcgi_path_info;
fastcgi_pass   unix:/run/php/php7.4-fpm.sock;
```

這段內容就是將 php 檔送到 <span class="hl-blue">unix:/run/php/php7.4-fpm.sock</span> 去解析，之後 nginx 設定裡如果有 php 的部分，都要引入這一塊內容，因此寫成 snippets 會比較方便，注意<span class="hl-red">如果不是裝 7.4 版的 php、php-fpm，要把最後一行的 sock 版本改掉。</span>


## WordPress 的 nginx conf 檔

將下面的設定檔依自己的需求，放到 <span class="hl-blue">/etc/nginx/conf.d/</span> 裡面即可

```nginx
server{
    listen          443 ssl;
    server_name     網站的域名;
    root            /usr/share/nginx/html; # 網站的根目錄位置
    index           index.php;
    server_tokens   off;
    # 如果網站是放在反向代理的後面，想拿到 client 真實的 ip 必需設下面這兩行
    set_real_ip_from x.x.x.x;           
    real_ip_header  X-Forwarded-For;
    access_log      /var/log/nginx/web-access.log;
    error_log       /var/log/nginx/web-error.log;

    location /{
            try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
            root    /usr/share/nginx/html;
            include /etc/nginx/conf.d/snippets/php.conf;
    }
}
```

<span class="hl-blue">location ~ .php${}</span> 這段裡面 include 了剛才寫好的 php.conf，全部的意思就是將 root 底下所有檔名為 php 結尾的檔案都要使用 php.conf 裡的設定，也就是送往 php-fpm 做解析，雖然 php.conf 裡的內容我們也可以直接貼到這段裡面，不過如果之後想針對其它後綴的網址做特別的處理，直接 include 一個檔案會比每次都重貼一大段來的簡潔。

* * *

參考資料：

[How To Install PHP 7.4 on Debian 10 / Debian 9](https://computingforgeeks.com/how-to-install-latest-php-on-debian/)

[How to Install Nginx and PHP 7.4 on Debian 10](https://hostup.org/blog/how-to-install-nginx-and-php-7-4-on-debian-10/)

[WordPress Hosting Handbook / Server Environment](https://make.wordpress.org/hosting/handbook/handbook/server-environment/)

[MariaDB versus MySQL: Compatibility](https://mariadb.com/kb/en/mariadb-vs-mysql-compatibility/)
