---
author: wade
date: 2020-09-14 03:00:00+00:00
draft: false
title: Nginx 反向代理多重子目錄
type: post
url: /post/nginx-proxy-pass-multi-subdirectory/
image: "https://image.wadeism.net/nginx00.png"
categories:
- Linux
tags:
- CentOS
- Nginx
- Proxy
- Server
---

## 使用目的

架設一台 reverse proxy server 與一台 web server。當瀏覽不同的域名時，proxy server 反向代理到後端對應的主機與資料夾。

## 環境說明

* Proxy Server：{{< green >}}192.168.199.171{{< /green >}}
* Web Server：{{< green >}}192.168.199.172{{< /green >}}
* 後端網站路徑：  
/www/website/aoi/  
/www/website/miyazaki/
* 自設域名（以 /etc/hosts 新增，對應 proxy 的 192.168.199.171）：  
http://aoi  
http://miyazaki


## Proxy 端設定

防火牆開通

```bash
sudo firewall-cmd --add-service/http --permanent
```

```bash
sudo firewall-cmd --reload
```

\
SELinux 調整

```bash
sudo setsebool -P httpd_can_network_connect on
```

沒開的話，會出現 nginx 502 的錯誤

\
網站 aoi 的 nginx proxy conf 檔內容

```nginx
server {
    listen       80;
    server_name  aoi;
    access_log   /var/log/nginx/${server_name}_access.log;
    error_log    /var/log/nginx/${server_name}_error.log;

    # 底下的 header 設定非必要，視後端 service 需求再使用
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Forwarded $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;

    location / {
        # 一定要設定 Host 的 header，用固定名稱或變數皆可
        proxy_set_header Host $server_name;

        # 用域名導向到後端的同名資料夾中
        proxy_pass http://192.168.199.172/$server_name/;

        # 不指定路徑的話，就改用下面的設定直接導向後端預設路徑
        # proxy_pass http://192.168.199.172/;
    }
}
```

\
網站 miyazaki 的 nginx proxy conf 檔內容

```nginx
server {
    listen       80;
    server_name  miyazaki;
    access_log   /var/log/nginx/${server_name}_access.log;
    error_log    /var/log/nginx/${server_name}_error.log;

    # 底下的 header 設定非必要，視後端 service 需求再使用
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Forwarded $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;

    location / {
        # 一定要設定 Host 的 header，用固定名稱或變數皆可
        proxy_set_header Host $server_name;

        # 用域名導向到後端的同名資料夾中
        proxy_pass http://192.168.199.172/$server_name/;

        # 不指定路徑的話，就改用下面的設定直接導向後端預設路徑
        # proxy_pass http://192.168.199.172/;
    }
}
```


## Web 端設定

防火牆開通

```bash
sudo firewall-cmd --add-service/http --permanent
```

```bash
sudo firewall-cmd --reload
```

\
建立網頁存放的資料夾與網頁檔

```bash
sudo mkdir -p /www/website/aoi /www/website/miyazaki
```

```bash
echo "Aoi" | sudo tee /www/website/aoi/index.html
```

```bash
echo "Miyazaki" | sudo tee /www/website/miyazaki/index.html
```

\
調整網頁路徑的 SELinux

```bash
sudo chcon -R -t httpd_sys_rw_content_t /www/website/
```

如果沒有調的話，網頁會出現找不到檔案的 403 錯誤

\
網站 aoi 的 nginx web conf 檔內容

```nginx
server {
    listen       80;
    server_name  aoi;
    access_log   /var/log/nginx/${server_name}_access.log;
    error_log    /var/log/nginx/${server_name}_error.log;

    location / {
        root /www/website;
    }
}
```

\
網站 miyazaki 的 nginx web conf 檔內容

```nginx
server {
    listen       80;
    server_name  miyazaki;
    access_log   /var/log/nginx/${server_name}_access.log;
    error_log    /var/log/nginx/${server_name}_error.log;

    location / {
        root /www/website;
    }
}
```

## 測試反向代理

打開瀏覽器測試 http://aoi 與 http://miyazaki

![](https://image.wadeism.net/reproxym01.png)

![](https://image.wadeism.net/reproxym02.png)

可以看到網址連到 {{< green >}}192.168.199.171{{< /green >}}，但連線後顯示的是 {{< green >}}192.168.199.172{{< /green >}} 上的網頁檔，表示反向代理設定成功！


## 心得

只要網站資料夾的目錄名稱與 log 名稱都用到域名來命名，nginx config 就可以大量的使用 {{< blue >}}server_name{{< /blue >}} 變數，每個不同 config 只要更改 server_name 即可，在佈署多個網站時可以簡化很多流程。
