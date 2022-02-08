---
author: wade
date: 2020-09-12 03:32:00+00:00
draft: false
title: Nginx 反向代理到 Tomcat
type: post
url: /post/nginx-reverse-proxy-tomcat/
image: "https://image.wadeism.net/nginxtomcat00.png"
categories:
- Linux
tags:
- CentOS
- CentOS 8
- Nginx
- Proxy
- Tomcat
---

本篇以鐵人賽「[用30天來介紹和使用 Docker 系列](https://ithelp.ithome.com.tw/users/20103456/ironman/1320)」的 [Day5: 實作撰寫第一個 Dockerfile](https://ithelp.ithome.com.tw/articles/10191016) 為基礎，記錄我用 nginx 反向代理到 Tomcat 的筆記。

有用過 Docker 的人大概都知道在執行的時候只要指定 port 的 mapping 就可以讓容器與實際 host 的 port 做綁定，這是一般對外 service 類的 container 都會做的設定。

但如果省略掉 port mapping 的步驟，容器中的 Tomcat 就等於是跑在一個內部的環境裡，外部只能透過其它途徑來連線到 Tomcat，某方面來說安全性也會比較高，這邊我就使用最常見的 Nginx 反向代理來連入內部的 Tomcat。

系統環境：CentOS 8.2  
自設域名：http://docker（測試子目錄用）  
　　　　　http://tomcat.docker（測試子網域用，皆以編輯 /etc/hosts 來自訂）


## 檢測 Tomcat 環境

先依照[文章](https://ithelp.ithome.com.tw/articles/10191016)的範例做到第三步驟執行 mytomcat，會發現 Tomcat 執行了，但無法透過本機的 ip 連線，因此必須先查詢容器本身的 ip

\
查詢 container ID

```bash
docker ps -a
```

```bash
# 執行結果：

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
7bdb162641d4        mytomcat            "/apache-tomcat-9.0.…"   6 minutes ago       Up 6 minutes                            musing_gagarin
```

\
進入 container 的 shell 裡查詢 IP

```bash
docker exec -it musing_gagarin /bin/bash
```

```bash
cat /etc/hosts
```

```bash
# 執行結果

127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters:
172.17.0.2      7bdb162641d4

# 172.17.0.2 就是 tomcat container 的 ip
```

接著在 host 上連 <span class="hl-blue">172.17.0.2:8080</span> 就可以看到 tomcat 頁面

## 安裝 Nginx

<span class="hl-blue">172.17.0.2</span> 是只能在本機上連的內部 ip，外部機器如果也想看到 Tomcat 可以用 Nginx 的反向代理來連線

\
首先安裝 Nginx 並啟動

```bash
sudo dnf install nginx
```

```bash
sudo systemctl enable nginx && sudo systemctl start nginx
```

\
開啟防火牆

```bash
sudo firewall-cmd --add-service=http --permanent && sudo firewall-cmd --reload
```

\
調整 SELinux（如果後面反向代理連線出現 nginx 502 錯誤時使用）

```bash
sudo setsebool -P httpd_can_network_connect on
```

## Nginx 反向代理設定

將 nginx 設定檔存到 <span class="hl-blue">/etc/nginx/conf.d/myTomcat.conf</span> 後再重啟 nginx 即可，針對不同的域名型態設定內容也會有所不同

### 使用子網域 http://tomcat.docker

```nginx
server {
    listen      80;
    server_name tomcat.docker;

    location / {
        proxy_pass http://172.17.0.2:8080/;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Forwarded $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

* <span class="hl-blue">proxy_pass</span> 會把 request 轉到 <span class="hl-blue">172.17.0.2:8080/</span>，結尾的 <span class="hl-red">/</span> 不要漏掉
* 幾個 <span class="hl-blue">proxy_set_header</span> 與反向代理沒有直接的關係，還沒有特殊需求時可以不用加，但這些設定會影響後端拿到的  header 變數。

![](https://image.wadeism.net/nginxt01.png)

### 使用子目錄 http://docker/tomcat

```bash
server {
    listen          80;
    server_name     docker;

    location /tomcat/ {
        proxy_pass http://172.17.0.2:8080/;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Forwarded $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    location / {
        if ($http_referer ~ "^https?://[^/]+/tomcat/") {
            rewrite ^/(.*) http://$http_host/tomcat/$1 redirect;
        }
    }
}
```

* <span class="hl-blue">location /tomcat/</span> 這邊要記得在 tomcat 的結尾加上 <span class="hl-red">/</span> ，不能寫成 <span class="hl-blue">/tomcat</span>
* <span class="hl-blue">location /</span> 這段處理子目錄後面的路徑連結，如果沒有加的話，雖然首頁正常，但首頁上的連結點進去還是會失敗

![](https://image.wadeism.net/nginxt02.png)

![](https://image.wadeism.net/nginxt03.png)

\
接著試試看用 http://docker/TomCat 來連

![](https://image.wadeism.net/nginxt04.png)

由於上面的設定是屬於 case sensitive 的，因此大小寫無法混用

### 使用子目錄 http://docker/TomCat


```bash
server {
    listen          80;
    server_name     docker;

    location ~* /tomcat/(.*) {
        proxy_pass http://172.17.0.2:8080/$1$is_args$args;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Forwarded $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    location / {
        if ($http_referer ~* "^https?://[^/]+/tomcat/") {
            rewrite ^/(.*) http://$http_host/tomcat/$1 redirect;
        }
    }
}
```

與前例差在使用了 <span class="hl-red">~*</span> 來做出 case insensitive（無視大小寫）的功能，讓使用者打錯大小寫也可以連到

![](https://image.wadeism.net/nginxt05.png)

參考資料：

* * *

[nginx proxy to subdirectory](https://forum.nginx.org/read.php?11,265620)

[NGINX: Proxy folders to different root](https://raymii.org/s/tutorials/NGINX_proxy_folder_to_different_root.html)

[FORM.IO — nginx reversed proxy under ‘subfolder’ in order to host multiple node.js apps](https://medium.com/@maxtsai/form-io-nginx-reversed-proxy-under-subfolder-in-order-to-host-multiple-node-js-27f97432d2d)

[Nginx reverse proxy subdirectory rewrites for sourcegraph](https://stackoverflow.com/questions/51223293/nginx-reverse-proxy-subdirectory-rewrites-for-sourcegraph)

[Nginx case insensitive proxy_pass](https://stackoverflow.com/questions/46625593/nginx-case-insensitive-proxy-pass)
