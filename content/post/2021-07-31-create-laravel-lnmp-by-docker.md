---
author: wade
date: 2021-07-31 04:35:00+00:00
draft: false
title: Docker 建立 Laravel 用的 LNMP 環境
type: post
url: /post/create-laravel-lnmp-by-docker/
image: "https://image.wadeism.net/laravel00.png"
categories:
- Developer
tags:
- Docker
- Laravel
- MYSQL
- Nginx
- PHP
---

雖然標題上是寫 Laravel 用的環境，不過這套環境也適用於 WordPress。

\
LNMP 是一般對 Linux + Nginx + MySQL（MariaDB）+ PHP 的簡稱，不過用 Docker 來做的話應該要稱做 NMP才對。本次的範例在任何的 Linux Distro 底下應該都會有一樣的效果，理論上在 MacOS 也差不多，不過 Mac 也許還是會有此許的不同，這點我就沒有再多做測試。

會寫這篇的原因除了想開始學習 PHP 與 Laravel 之外，也是想多熟練 Docker，畢竟 config 或 yaml 寫好之後，帶到哪都可輕鬆重現環境，這種 IaC（Infrastructure-as-Code）加上版控的作法最近非常吸引我（就是喜歡不刺眼的黑黑畫面！）

扣除建立 Laravel 練習環境這件事，這篇文章其實也等同於用 Docker 建立一個普通的 LNMP Web Server，不過因為是練習用，所以 nginx 或 php 的一些細項設定就不太會提到了。


## 前置作業

首先在系統裡建立一個新資料夾 {{< blue >}}lnmp{{< /blue >}}，裡面再分別建立四個資料夾，這邊將資料夾命名為：{{< blue >}}php{{< /blue >}}、{{< blue >}}ngnix{{< /blue >}}、{{< blue >}}mariadb{{< /blue >}} 與 {{< blue >}}projects{{< /blue >}}。

```bash
mkdir lnmp && cd lnmp
```

```bash
mkdir nginx php mariadb projects
```

```bash
tree
```

```bash
# 執行結果

.
├── mariaDB
├── nginx
├── php
└── projects
```

4 個資料夾的用途如下：

* {{< green >}}{{< mono >}}mariaDB{{< /green >}}{{< /mono >}}：  
給 MariaDB 的 container 掛載用，存放 data base 的資料，也可以選擇不掛載
* {{< green >}}{{< mono >}}nginx{{< /green >}}{{< /mono >}}：  
給 nginx container 掛載用，存放 nginx conf
* {{< green >}}{{< mono >}}php{{< /green >}}{{< /mono >}}：  
放自行 build 的 php Dockerfile
* {{< green >}}{{< mono >}}projects{{< /green >}}{{< /mono >}}：  
統一將 Laravel 或 Wordpress 的資料夾放在這邊

使用 {{< blue >}}tree{{< /blue >}} 指令是為了方便給大家看資料與資料夾間的關聯，這個指令通常不會內建在系統中，也不是很必要，可依個人喜好自行安裝


## 編寫 PHP 的 Dockerfile

PHP 官方的 Docker Image 基底為 Debian，另外也有出基於 Alpine 的版本，Alpine 做出來的 image 會比較輕量，另外我們的 web servce 是使用 nginx，所以就要選 
{{< blue >}}php-fpm{{< /blue >}} 的 image，而不是 php image。

本次的 Dockerfile 使用官方的 {{< blue >}}php:7.4-fpm-alpine{{< /blue >}} 為底，如果只是想基本的練練 php，那直接使用官方的 php-fpm image 就可以了，但在 [Laravel 的官網](https://laravel.com/docs/7.x#server-requirements)中有提到，7.x 版的 Laravel 需要許多額外的套件：

```yaml
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
```

這些套件在公版 php image 裡是沒有的，所以我們必須自己寫 Dockerfile，將這些套件包進 image。

另外 [WordPress 的官網](https://make.wordpress.org/hosting/handbook/server-environment/)也有提到所需的套件如下：

```yaml
- curl
- dom
- exif
- fileinfo
- hash
- imagick
- json
- mbstring
- mysqli
- openssl
- pcre
- sodium
- xml
- zip
- bcmath
- filter
- gd
- iconv
- intl
- mcrypt
- simplexml
- xmlreader
- zlib
```

上面大多 module 是預設已經有的，或是與 Laravel 有套件有重覆到，所以這次包的 image 就是以上面的 module 為目標，加上 Laravel 會用到的 composer 把它們全部包起來，Dockerfile 如下：

```bash
vim ./php/Dockerfile
```

```dockerfile
FROM php:7.4-fpm-alpine
# @see https://hub.docker.com/r/jpswade/php7.4-fpm-alpine
MAINTAINER Wade

# Install gd, iconv, mbstring, mysql, soap, sockets, zip, and zlib extensions
# $PHPIZE_DEPS include autoconf, make...etc
# see example at https://hub.docker.com/_/php/
RUN apk add --update \
		$PHPIZE_DEPS \
		freetype-dev \
		git \
		libjpeg-turbo-dev \
		libpng-dev \
		libxml2-dev \
		libzip-dev \
		openssh-client \
		php7-json \
		php7-openssl \
		php7-pdo \
		php7-pdo_mysql \
		php7-session \
		php7-simplexml \
		php7-tokenizer \
		php7-xml \
		imagemagick \
		imagemagick-libs \
		imagemagick-dev \
		php7-imagick \
		php7-pcntl \
		php7-zip \
		sqlite \
	&& docker-php-ext-install iconv soap sockets exif bcmath pdo_mysql pcntl \
	&& docker-php-ext-configure gd --with-jpeg --with-freetype \
	&& docker-php-ext-install gd \
	&& docker-php-ext-install zip

# add mysqli
RUN printf "\n" | docker-php-ext-install mysqli

# add intl
RUN printf "\n" | apk add --update \
		icu-dev \
	&& docker-php-ext-configure intl \
	&& docker-php-ext-install intl

# add mcrypt
RUN printf "\n" | apk add --update \
		libmcrypt-dev \
	&& pecl install \
					mcrypt && \
	docker-php-ext-enable mcrypt

# add imagick
RUN printf "\n" | pecl install \
		imagick && \
		docker-php-ext-enable --ini-name 20-imagick.ini imagick

# add pcov
RUN printf "\n" | pecl install \
		pcov && \
		docker-php-ext-enable pcov

# add composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \
	&& mv composer.phar /usr/bin/composer

# setup timezone
RUN sed -i 's/;date.timezone =/date.timezone = "Asia\/Taipei"/g' /etc/php7/php.ini

# change www-data's uid and gid for laravel folder permisstion
RUN apk --no-cache add shadow && \
    usermod -u 1000 www-data && \
    groupmod -g 1000 www-data

#EOF
```

這份 Dockerfile 是以 GitHub 上，[jpswade](https://gist.github.com/jpswade/4592d98e3596da59b7408c076e1c34db) 的範例為參考再加上缺少的套件。下面用了很多獨立的行來安裝單一的套件，是我在範例外新增的，其實也可以合併成一個，或合併到最上面的 RUN，看個人的偏好（分開寫的好處是比較容易 debug），可以等內容都很確定之後再重寫的乾淨點。

另外最底下把 image 裡 www-data 這個 user 的 uid 改成了 1000，這是為了之後 container 可以正常的存取檔案，而不受到檔案權限的阻擋。


## 新增 Nginx 設定檔

在 nginx 裡建立一個 conf.d 的資料夾，再新增設定檔如下：


```bash
mkdir ./nginx/conf.d
```

```bash
vim ./nginx/conf.d/laravel.conf
```

```nginx
server {
  listen 80;
  server_name my-lab;
  root /my_projects;

  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";

  index index.php;

  charset utf-8;

  location / {
      try_files $uri $uri/ /index.php?$query_string;
  }

  location = /favicon.ico { access_log off; log_not_found off; }
  location = /robots.txt  { access_log off; log_not_found off; }

  error_page 404 /index.php;

  location ~ \.php$ {
      fastcgi_pass php:9000;
      fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
      #fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      include fastcgi_params;
  }

  location ~ /\.(?!well-known).* {
      deny all;
  }
}
```

基本上是直接拿 [Laravel 官網的 conf 檔](https://laravel.com/docs/8.x/deployment#nginx)來改，要注意的地方如下：

* {{< green >}}{{< mono >}}server_name{{< /green >}}{{< /mono >}}：  
自訂網站的域名，即使沒有申請，也建議設一下，之後再修改 hosts 檔就可以模擬真實的情況。
* {{< green >}}{{< mono >}}root{{< /green >}}{{< /mono >}}：  
網頁檔存放的路徑，路徑可自訂，之後啟動 container 時要把本機的 projects 資料夾掛載到這邊。
* {{< green >}}{{< mono >}}fastcgi_pass{{< /green >}}{{< /mono >}}：  
負責解析 php 的 service，一般的 LNMP Server 在這邊可能會是本機 127.0.0.1:9000，不過我們的 php 會放在別的 container 裡，並且會將該 php container 命名為 php，之後 docker-compose 啟動的每個 container 都能互相解析彼此的 host name，所以這邊設 php:9000 即可。


## 編寫 docker-compose

接著用 docker-compose 將所有的 service 都建構出來執行，內容如下：

```bash
vim docker-compose.yml
```

```yaml
services:

  # php-fpm 7.3
  php:
    build:
      context: .
      dockerfile: ./php/Dockerfile
    container_name: php
    restart: unless-stopped
    volumes:
      - ./projects:/my_projects

  # nginx
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: unless-stopped
    ports:
      - 80:80
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./projects:/my_projects
    environment:
      - TZ=Asia/Taipei

  # MariaDB
  mariadb:
    image: mariadb
    container_name: mariadb
    restart: unless-stopped
    ports:
      - 3306:3306
    volumes:
      - ./mariadb:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: abc123
```

* {{< green >}}{{< mono >}}php{{< /green >}}{{< /mono >}}：  
  - {{< blue >}}build{{< /blue >}} 的 dockerfile 裡，指定要用哪個 Dockerfile 來 build php 的 image  
  - 在 {{< blue >}}volumes{{< /blue >}} 這邊，{{< red >}}必須要跟 nginx 一起掛載同個目錄{{< /red >}}，本例為本機上的 projects 資料夾
* {{< green >}}{{< mono >}}nginx{{< /green >}}{{< /mono >}}：  
  - {{< blue >}}ports{{< /blue >}}，基本就是 80:80 的 mapping 或是加個 443:443  
  - {{< blue >}}volumes{{< /blue >}} 部分，將本機上的 conf 與 projects 掛載到 container 中
* {{< green >}}{{< mono >}}mariadb{{< /green >}}{{< /mono >}}：  
  - {{< blue >}}ports{{< /blue >}} 用預設的 3306:3306  
  - {{< blue >}}volumes{{< /blue >}} 可將 container 裡的 DB 資料放到本機上，不設定的話，container 刪除後 DB 的資料也會不見，如果每次都想啟個乾淨環境的話就不用設這個  
  - {{< blue >}}environments{{< /blue >}} 這邊設定 DB 的 root 密碼


## 執行 docker-compose

docker-compose.yml 寫好後，直接執行即可

```bash
docker-compose up -d
```

```bash
# 執行結果

Creating network "lnmp_default" with the default driver
Creating php     ... done
Creating nginx   ... done
Creating mariadb ... done
```

\
第一次執行時，php 的 image 需要 build ，所以要花比較多的時間，完成後可用指令查看 container 是否有成功的執行

```bash
docker ps
```

```bash
# 執行結果

CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS          PORTS                                       NAMES
9860ea671988   nginx:latest   "/docker-entrypoint.…"   About a minute ago   Up 58 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp           nginx
b29ff7a5a9cb   lnmp_php       "docker-php-entrypoi…"   About a minute ago   Up 58 seconds   9000/tcp                                    php
ed9dbd32714f   mariadb        "docker-entrypoint.s…"   About a minute ago   Up 58 seconds   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp   mariadb
```


## 建立資料庫與資料庫使用者

docker-compose 成功啟動後，表示 php、nginx、MariaDB 應該有順利運行了，再我們就建個資料庫給 Laravel 使用

\
首先用 root 登入 container 裡的 DB

```bash
docker exec -it mariadb mysql -u root -p
```

執行後會提示要輸入密碼，打上之前在 docker-compose.yml 裡定義好的 root 密碼

\
建立名為 laravel 的資料庫

```bash
CREATE DATABASE laravel;
```

\
新增使用者 laravel_user，密碼為 abcd1234

```bash
CREATE USER 'laravel_user' IDENTIFIED BY 'abcd1234';
```

\
賦予使用者 laravel_user 存取 laravel 資料庫的權限，最後離開 DB

```bash
GRANT ALL PRIVILEGES ON laravel.* TO 'laravel_user';
```

```bash
FLUSH PRIVILEGES;
```

```bash
quit;
```


## 用 container 裡的 composer 建立 Laravel 專案

Laravel 可以從官網直接下載，也可以使用 composer 來安裝，既然我們有把 composer 這個套件包進 php 的 image 裡，就試試看用這種方式安裝吧！

首先進到 projects 目錄中

```bash
cd projects
```

\
查看 php image 的名稱

```bash
docker images
```

```bash
# 執行結果，lnmp_php 就是剛才自製的 php image 名稱

REPOSITORY   TAG              IMAGE ID       CREATED        SIZE
lnmp_php     latest           e282a489e005   12 hours ago   518MB
php          7.4-fpm-alpine   5ae3ea657944   40 hours ago   82.9MB
mariadb      latest           fd17f5776802   4 days ago     409MB
nginx        latest           08b152afcfae   9 days ago     133MB
```

\
接著用自製的 php image 來執行 composer 指令

```bash
docker run --rm -v $(pwd):/app lnmp_php composer create-project laravel/laravel /app/take1
```

* {{< green >}}{{< mono >}}--rm{{< /green >}}{{< /mono >}}：該 container 執行後就會刪除，因為建立專案是一次性的行為，因此加上自行刪除指令就不會留下多餘的 container
* {{< green >}}{{< mono >}}-v $(pwd):/app{{< /green >}}{{< /mono >}}：將目前的資料夾掛載到 container 裡的 {{< blue >}}/app{{< /blue >}}
* {{< green >}}{{< mono >}}lnmp_php{{< /green >}}{{< /mono >}}：php 的 image 檔
* {{< green >}}{{< mono >}}composer create-project laravel/laravel /app/take1{{< /green >}}{{< /mono >}}：用 composer 在 container 裡的 {{< blue >}}/app/take1{{< /blue >}} 中建立 Laravel 專案，如果 composer 是裝在本機而非 docker image 的話，只需要這一行就夠了。  
另外因為本機的 projects 資料夾已和 container 中的 {{< blue >}}/app{{< /blue >}} 做掛載綁定，因此指令完成後，就會在本機的 projects 裡建立一個名為 take1 的資料夾，裡面的內容即為 Laravel 的檔案


## 開啟 Laravel 的測試頁

還記得之前在 nginx conf 中設的 {{< blue >}}server_name{{< /blue >}}「my-lab」 嗎？我們先給網站指定了域名，但這只是個假域名，所以記得先去 {{< blue >}}/etc/hosts{{< /blue >}} 把 my-lab 這個域名與這台 Docker 主機的 ip 做 mapping。

接著就來試著用瀏覽器打開 Laravel 的首頁 http://my-lab/take1/public/

![](https://image.wadeism.net/laravel00.png)

看到這頁就表示 Laravel 專案建立成功，而且 php、nginx 也正常運作中！


## 測試 Laravel 與 MariaDB 的連線

最後我們來測試 Laravel 是否可正常的與 DB 連線，如果只是想單純測試 php 與 DB 的連線，只要新增一段程式碼到 ./projects/take1/public 裡就可以了

```bash
vim ./projects/take1/public/db_test.php
```

```php
<?php
$servername = "mariadb";
$database = "laravel";
$username = "laravel_user";
$password = "abcd1234";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";
?>
```

再來用 curl 試一下這隻程式

```bash
curl -L 'http://my-lab/take1/public/db_test.php'
```

```bash
# 執行結果

Connected successfully
```

\
不過除了 php 之外，我也想知道 Laravel 能否正常連到 DB，這時我們就先編輯一下 Laravel 的 {{< blue >}}.env{{< /blue >}} 這個檔案

```bash
vim ./projects/take1/.env
```

\
找到下面這段，並把它改成我們的連線資訊

```bash
DB_CONNECTION=mysql
DB_HOST=mariadb
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel_user
DB_PASSWORD=abcd1234
```

\
最後再以 Laravel artisan 指令的 migrate 當作測試

```bash
docker exec -it php php /my_projects/take1/artisan migrate:status
```

```bash
# 執行結果

Migration table not found.
```

有出現 table not found 就表示 Laravel 有連到 DB 了（不然只會出現錯誤的訊息）

* * *

參考資料：

[PHP 7.4 PHP-FPM Alpine with core extensions gd](https://gist.github.com/jpswade/4592d98e3596da59b7408c076e1c34db)

[USE USERMOD AND GROUPMOD IN ALPINE LINUX DOCKER IMAGES](https://cinhtau.net/2017/04/19/usermod-and-groupmod-alpine/)

[composer create-project, the permissions of all directories is 777?](https://github.com/composer/docker/issues/30)

[Using a custom user for PHP-FPM and Nginx configurations in docker containers](http://www.inanzzz.com/index.php/post/hmjt/using-a-custom-user-for-php-fpm-and-nginx-configurations-in-docker-containers)

[Check for database connection, otherwise display message](https://stackoverflow.com/questions/9026630/check-for-database-connection-otherwise-display-message)
