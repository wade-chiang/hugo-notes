---
author: wade
date: 2020-02-17 09:31:50+00:00
draft: false
title: Firewalld 防火牆教學
type: post
url: /post/learning-firewalld/
image: "https://image.wadeism.net/firewall01.jpg"
categories:
- Linux
tags:
- Security
---

在 CentOS 6 以前，說到防火牆幾乎就是 iptables，雖說 iptables 也不是真的有多複雜，不過比較精簡的表示法有時的確不是很一目瞭然。從 CentOS 7 之後，開始用 firewalld 作為預設的防火牆，但嚴格來說 firewalld 比較像是款現代一點的防火牆 cmd 工具，因為其背後還是寫入 iptables，只是整體變得較易讀，並且多了命令補齊的功能，因此在設定上變得簡易許多（但指令也因此變長）


## firewalld 的開啟與停止

查看 firewalld 的狀態

```bash
sudo systemctl status firewalld
```

\
啟動 firewalld

```bash
sudo systemctl start firewalld
```

\
停止 firewalld
    
```bash
sudo systemctl stop firewalld
```


## firewalld Zone 管理模式

firewalld 使用 zone 作為管理連線的框架，舉例來說，有點像手機鈴聲的情境模式，例如在家裡鈴聲要正常，在看電影時調成靜音模式就會靜音只剩下震動，在睡覺時開勿擾模式變成靜音與無震動，只有緊急電話才會響…等等，firewalld 也內建了許多模式（zone），一些 zone 有預設的規則，有的則是需要自己去設定，下面講一下每個 zone 的作用

* <span class="hl-green mono">drop</span>：所有進來的連線都會被丟掉，而且不會有所回應，除了本機發起的 request 以外，外來連線只出不進
* <span class="hl-green mono">block</span>：所有進來的連線會被阻擋（reject），與 drop 不同的是被 reject 的話，對方會知道連線是被阻擋，但 drop 對方只會知道無法連線，但無法得知連線是被封鎖，還是機器掛掉，因此通常在做測試時會用 block，正式防護時會用 drop
* <span class="hl-green mono">external</span>：主要用在內部網路與 NAT 轉址，只有允許的 port 可以連入，external 預設開啟 <span class="hl-blue">masquerade</span>，作為 VPN server 時都會要開啟該選項
* <span class="hl-green mono">trusted</span>：所有的連線都將被允許！
* <span class="hl-green mono">dmz</span>：給置於 dmz zone裡的電腦使用，允許讓特定的連線進入內部網路，但也只接受有被允許的連線

接下來幾個 zone 比較類似，都是只有被允許的連線可以連入，其它的連線都會擋掉，分成這麼多的 zone 可能是讓使用者好作切換，例如說在家裡就切換到 home ，讓家中其它電腦可以連入，到了公司就切換到 work ，只有工作上需要的連線可以連入


* <span class="hl-green mono">public</span>：通常系統預設就是 public zone，是給使用者在公眾場合下使用的，基本上會阻擋所有連入，有設定放行的 port 或服務才可以連入
* <span class="hl-green mono">work</span>：工作環境中使用的 zone
* <span class="hl-green mono">home</span>：給使用者在家中使用的 zone

\
查看目前使用的 zone
    
```bash
sudo firewall-cmd --get-active-zones
```

\
查看系統預設的 zone

```bash
sudo firewall-cmd --get-default-zone
```

\
變更系統預設的 zone
    
```bash
sudo firewall-cmd --set-default-zone=$ZONE_NAME
```


## firewalld 基本使用方式

以 server 用途是網站為例：

\
允許 http 連線
    
```bash
sudo firewall-cmd --add-service=http
```

網站預設的非加密連線 port 為 80，因此執行上面兩個指令的意思也就是讓 server 開啟 80 port，除此之外我們也可以使用允許 port 號的方式來開通連線

\
允許透過 80 port 連線

```bash
sudo firewall-cmd --add-port=80/tcp
```

第一種方法是因為 firewalld 預設了很多的 service 設定檔，所以我們指定 service name，就可以開通它的 port。

\
firewalld 裡預設的 service 我們可以用下面的指令來查看：

```bash
sudo firewall-cmd --get-services
```

\
這些 service 都有一個對應的設定檔，假如我們的網站想使用 8080 port 而非預設的 80 port，那我們有兩種方式，一是上面第二種方法，直接指定開通的 port 號，另一種方法則是變更 http 的 firewall service xml 檔，方法如下：

```bash
sudo vim /lib/firewalld/services/http.xml
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<service>
  <short>WWW (HTTP)</short>
  <description>HTTP is the protocol used to serve Web pages. If you plan to make your Web server publicly available, enable this option. This option is not required for viewing pages locally or developing Web pages.</description>
  <port protocol="tcp" port="80"/>
</service>
```

可以看到 http.xml 裡有個 &lt;port protocol="tcp" port="80"/&gt;，把這邊的 80 改成 8080，再使用第一種方法來開啟 http，那所開通的就會是我們要的 8080 port 了

<span class="hl-red">上面我們開通的方法，在系統上會立即生效，但如果下一次開機設定就失效了，所以如果想讓設定永久有效，要在設定時加入 --permanet 參數</span>：
    
```bash
sudo firewall-cmd --add-port=80/tcp --permanent
```

要特別注意的是，如果加上了 --permanent 的參數，設定是不會生效的，因此要使用 --reload 參數重新讀取設定

```bash
sudo firewall-cmd --reload
```

執行後 80 port 就開通並且永久生效了

\
如果要取消 service 或 port 的開通也很簡單

關閉 http 的連線
    
```bash
sudo firewall-cmd --remove-service=http
```

\
關閉 80 port
    
```bash
sudo firewall-cmd --remove-port=80/tcp
```


## RichRule 簡易用法

除了上面基本設定之外，還有個再複雜點的 Firewalld RichRule 規則，可以加上一些比較精細的限制，下面幾個例子舉例：

限制 ssh 只能由 192.168.100.1 連線

```bash
sudo firewall-cmd –add-rich-rule="rule family="ipv4" source address="192.168.100.1" service name="ssh" accept"
```

\
允許 192.168.100.1/24 網段的 ip 瀏覽 http 網站
    
```bash
sudo firewall-cmd --add-rich-rule='rule family="ipv4" service name="http" source address="192.168.100.1/24" accept'
```

\
阻擋 192.168.100.1 連線本機
    
```bash
sudo firewall-cmd --add-rich-rule="rule family='ipv4' source address='192.168.100.1' reject"
```

\
取消阻擋 192.168.100.1 連線本機
    
```bash
sudo firewall-cmd --remove-rich-rule="rule family='ipv4' source address='192.168.100.1' reject"
```

\
阻檔任何 172.15.10.0/24 網段的電腦透過 ssh 連線到 172.15.10.1
    
```bash
sudo firewall-cmd --add-rich-rule='rule family="ipv4" port protocol="tcp" port="22" source address="172.15.10.0/24" destination address="172.15.10.1" drop'
```


## 使用 Firewalld 轉 Port

如果 apache 是 listen 8080 port 而非一般使用的 80 port，可以使用下面的指令，將 80 port 轉到 8080，這樣使用者在連線時就不用特意指定 8080 port 也可以如常瀏覽網頁

```bash
sudo firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=8080
```

\
同上面的例子，假設要將 80 port 轉到其它 server（如：192.168.100.3）上的 8080 port，方法如下：
    
```bash
sudo firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=192.168.100.3
```

\
上面指令將本機的 80 port 轉至 192.168.100.3:8080，但光是設定 forward 還不夠，還要再加以下的指令，轉址才會生效：
    
```bash
sudo firewall-cmd --add-masquerade
```

如果 firewalld 的 zone 是 external，那上面的 masquerade 則可以不用設定


## Firewall 規則管理

還記得所有設定一定要加上 --permanent 並且 reload 才會永久生效吧，但如果比較懶得下指令，我們可以將所有想要的規則都放在一個 script 裡，並設定每次開機時執行，這樣除了查看方便以外，管理也會較為容易

首先建立名為 firewall.sh 的檔案在 /root/ 中
    
```bash
sudo touch /root/firewall.sh
```

\
編輯 firewall.sh 的內容，將想要的規則放進去，範例如下：

```bash
#!/bin/bash

# Accept SSH from 192.168.100.2
firewall-cmd --add-rich-rule='rule family="ipv4" service name="ssh" source address="192.168.100.2" accept'

# Accept Rsync from 192.168.100.2 to 192.168.100.50
firewall-cmd --add-rich-rule='rule family="ipv4" service name="rsyncd" source address="192.168.100.2" destination address="192.168.100.50" accept'

# Allow HTTP and HTTPS
firewall-cmd --add-service=http
firewall-cmd --add-service=https
```

\
給予 firewall.sh 可執行的權限

```bash
sudo chmod +x /root/firewall.sh
```

\
將 firewall.sh 放到 /etc/rc.local 中

（rc.local 裡的指令會在每次開機時執行，不過該檔案預設沒有執行權限，要先用 chmod +x 賦予執行權限。如果系統裡沒有 rc.local 的話，可以用 systemd 的 script 來做）

```bash
$ sudo vim /etc/rc.local

#!/bin/bash
# THIS FILE IS ADDED FOR COMPATIBILITY PURPOSES
#
# It is highly advisable to create own systemd services or udev rules
# to run scripts during boot instead of using this file.
#
# In contrast to previous versions due to parallel execution during boot
# this script will NOT be run after all other services.
#
# Please note that you must run 'chmod +x /etc/rc.d/rc.local' to ensure
# that this script will be executed during boot.
```

```bash
bash /root/firewall.sh
```

\
這樣每次開機時，就會自動載入我們寫在 script 裡的防火牆規則了，如果隨時想洗掉並更改，只要 reload 並且修改後重新執行 firewall.sh 就可以了
    
```bash
sudo firewall-cmd --reload
```

\
reload 後會清掉所有的設定，待修改完再執行一次 script 即可
    
```bash
sudo bash /root/firewall.sh
```

<!-- ###### [Cover By](http://www.ipshop.xyz/4333.html) -->
