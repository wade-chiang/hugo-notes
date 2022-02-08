---
author: wade
date: 2020-09-12 03:32:30+00:00
draft: false
title: 讓反向代理的 Tomcat 取得用戶的真實 IP
type: post
url: /post/tomcat-behind-nginx-get-real-ip/
image: "https://image.wadeism.net/tomcat00.png"
categories:
- Linux
tags:
- CentOS
- Nginx
- Proxy
- Server
- Tomcat
---

在[前一篇文章](https://notes.wadeism.net/post/nginx-reverse-proxy-tomcat/)裡，我們用 Docker 架了一個內網限定的 Tomcat，並且用 Nginx 的反向代理讓外部可以連到。不過在查看 Tomcat 的 access log 時會發現，明明是從外部的連線，但 log 中的連線 IP 永遠都是 Nginx 反向代理的那台機器。

這算是反向代理的後端都會碰到的問題，因為使用者的連線都是先透過 Nginx 再往後送到實際的 server 裡，所以對 server 來看就只是 Nginx 對它連線。

下面就來試範如何讓後端的 Tomcat 拿到用戶的實際 IP，而不是 Nginx 代理伺服器的 IP

## 環境說明

* <span class="hl-green mono">User</span>：192.168.199.1
* <span class="hl-green mono">Nginx</span>：172.17.0.1
* <span class="hl-green mono">Tomcat</span>：172.17.0.2

## 查看 Tomcat access log

```bash
tail -f /apache-tomcat-9.0.37/logs/localhost_access_log.2020-09-14.txt

172.17.0.1 - - [14/Sep/2020:02:01:56 +0000] "GET / HTTP/1.0" 200 11196
172.17.0.1 - - [14/Sep/2020:02:01:56 +0000] "GET /tomcat.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-nav.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /asf-logo-wide.svg HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-upper.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-button.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-middle.png HTTP/1.0" 304 -
```

可以看到連線進來的 IP 都是 Nginx 的 IP 172.17.0.1，而非我測試的實際機器 192.168.199.1


## 調整 Nginx 設定

```bash
vim /etc/nginx/conf.d/myTomcat.conf
```

```bash
server {
    listen          80;
    server_name     docker;

    location /tomcat/ {
        proxy_pass http://172.17.0.2:8080/;


        proxy_set_header X-Real-IP $remote_addr;
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

在 <span class="hl-blue">proxy_set_header</span> 中，我們賦予了幾種 IP 變數到 HTTP 的 header 裡

<span class="hl-blue">X-Real-IP</span>、<span class="hl-blue">X-Forwarded-For</span>、<span class="hl-blue">Forwarded</span> 這些就是 HTTP 的 header

<span class="hl-blue">$remote_addr</span>、<span class="hl-blue">$proxy_add_x_forwarded_for</span> 這些變數則代表 IP

但 <span class="hl-blue">$proxy_add_x_forwarded_for</span> 這類的變數是 Nginx 的 IP 還是用戶端的 IP，並沒有一定，必須看網路的連線過程，是否有經過 CDN、中間的 header 有沒有再變過之類的，這部分頗為複雜，想深入了解的話可以搜尋有關 HTTP header 的資料

總之，我們就先以上面的設定來做測試


## 調整 Tomcat 的 log 格式

我們可以修改 Tomcat 的 log 格式，加上前面由 Nginx 所後送的 http  header 值

```bash
vi /apache-tomcat-9.0.37/conf/server.xml
```

\
在 xml 檔的最後可以看到一段 <span class="hl-blue">pattern=</span>，這邊就是更改 log 格式的地方


```xml
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
              prefix="localhost_access_log" suffix=".txt"
              pattern="%h %l %u %t "%r" %s %b" />

     </Host>
   </Engine>
 </Service>
</Server>
```

\
將 pattern 改成下面的格式

```xml
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
            prefix="localhost_access_log" suffix=".txt"
            pattern="%{FORWARDED}i %l %u %t %r %s %b %D %q %{User-Agent}i %T" resolveHosts="false"/>

   </Host>
 </Engine>
</Service>
</Server>
```

存檔離開後，重啟 Tomcat 然後瀏覽一次


## 再次查看 Tomcat access log

```bash
tail -f /apache-tomcat-9.0.37/logs/localhost_access_log.2020-09-14.txt

172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-nav.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /asf-logo-wide.svg HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-upper.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-button.png HTTP/1.0" 304 -
172.17.0.1 - - [14/Sep/2020:02:02:39 +0000] "GET /bg-middle.png HTTP/1.0" 304 -
192.168.199.1 - - [14/Sep/2020:02:53:59 +0000] GET / HTTP/1.0 200 11196 411  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.411
192.168.199.1 - - [14/Sep/2020:02:54:22 +0000] GET /docs/config/ HTTP/1.0 200 6827 15  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.015
192.168.199.1 - - [14/Sep/2020:02:54:22 +0000] GET /docs/images/docs-stylesheet.css HTTP/1.0 200 5780 4  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.004
192.168.199.1 - - [14/Sep/2020:02:54:22 +0000] GET /docs/images/tomcat.png HTTP/1.0 200 5103 4  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.004
192.168.199.1 - - [14/Sep/2020:02:54:23 +0000] GET /docs/images/asf-logo.svg HTTP/1.0 200 20486 2  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.002
192.168.199.1 - - [14/Sep/2020:02:54:23 +0000] GET /docs/images/fonts/fonts.css HTTP/1.0 200 1943 1  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.001
192.168.199.1 - - [14/Sep/2020:02:54:30 +0000] GET / HTTP/1.0 200 11196 4  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.004
192.168.199.1 - - [14/Sep/2020:02:54:30 +0000] GET /favicon.ico HTTP/1.0 200 21630 3  Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 0.003
```

log 已顯示正確的使用者 ip，並且調成比較多資訊的格式！


## 心得

修改 Tomcat log 格式時，<span class="hl-blue">pattern="%{FORWARDED}i</span> 這邊就是指將 FORWARDED 的 header 值放入格式中，當然也可以改其它 header 值例如 <span class="hl-blue">pattern="%{X-FORWARDED-FOR}i</span> 之類的，看自己要怎麼用。

FORWARDED 的 header 值是什麼？這部分是由前端的 Nginx 設定檔所決定。在本例中，前端 Nginx 設定了 Forwarded 的值為 <span class="hl-blue">$proxy_add_x_forwarded_for</span>，至於 <span class="hl-blue">$proxy_add_x_forwarded_for</span> 又是指什麼 ip，就要看網路的連線過程了。

由於這次的環境並不複雜，所以變數 <span class="hl-blue">$remote_addr</span> 與 <span class="hl-blue">$proxy_add_x_forwarded_for</span> 裡面都是使用者的 ip 192.168.199.1，因此本例中的 tomcat log 格式，不管是 <span class="hl-blue">pattern="%{FORWARDED}i</span>、<span class="hl-blue">pattern="%{X-FORWARDED-FOR}i</span>、<span class="hl-blue">pattern="%{X-REAL-IP}i</span>，都可以取得正確的 ip，但如果是其它複雜一點的環境就得多做幾次測試了。

* * *

參考資料：

[Nginx: reverse proxy passing client IP to the server](//serverfault.com/questions/920030/nginx-reverse-proxy-passing-client-ip-to-the-serverclient IP to the server)

[X-Forwarded-For 和 X-Real-IP 的區別](https://blog.csdn.net/weiyuefei/article/details/78687545)
