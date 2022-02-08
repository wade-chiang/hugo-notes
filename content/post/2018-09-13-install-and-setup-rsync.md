---
author: wade
date: 2018-09-13 08:32:57+00:00
draft: false
title: rsync 的安裝與使用
type: post
url: /post/install-and-setup-rsync/
categories:
- Linux
tags:
- CentOS
- rsync
- Server
---

在不知道有 rsync 之前，我備份檔案的方式就是用人工去檢查檔案並且複製與貼上，常常不知道哪些有備份過或是版本有更動而不斷的在做無意義的檔案覆寫，既笨又耗時間。自從有了 rsync 後，整個都不一樣了，備份變得非常簡單且有效率，雖然以前在 Windows 上也有用過一些同步軟體啦，但都沒什麼深刻的印象…

在記錄 rsync 的安裝與用之前，先提一下效能的部分。我最開始使用 rsync 是在自己的電腦與 Synology 的 NAS 間做同步，當初買的 NAS 是屬於低階款，而 rsync 的傳輸過程是加密的，因此雖然家裡的區域網路速度是 gigalan，但我的 rsync 始終只能跑個 50Mb/s，原因就在於我那台 NAS 的 CPU 太弱了，雖然有研究過 rsync 的非加密傳輸，但試過幾次似乎無法改善這個問題，不知道是 NAS 太爛還是怎麼弄都還是使用加密連線。


## 安裝 rsync
    
```bash
sudo yum install rsync
# 現在一般的 distro 應該都有內建了
```

## rsync 基本參數

* <span class="hl-green mono">-a</span>：最常用的備份模式，等同於 -rlptgoD
* <span class="hl-green mono">-r</span>：--recursive，遞歸模式，備份目錄時必用
* <span class="hl-green mono">-l</span>：--links，單純的以符號連結的樣態來備份符號連結
* <span class="hl-green mono">-p</span>：--perms，維持原檔案的權限屬性
* <span class="hl-green mono">-t</span>：--times，維持檔案的 modification time
* <span class="hl-green mono">-g</span>：--group，維持檔案原本的所屬群組
* <span class="hl-green mono">-o</span>：--owner，維持檔案原本的擁有者
* <span class="hl-green mono">-D</span>：--devices、--specials，允許同步裝置檔案與特殊檔案
* <span class="hl-green mono">-v</span>：--verbose，詳細模式，在 terminal 中列出所有的詳細過程
* <span class="hl-green mono">-P</span>：等同 --partial --progress --partial：當傳輸中斷時，保留不完整的檔案
* <span class="hl-green mono">--progress</span>：讓傳輸過程有進度可看
* <span class="hl-green mono">--dry-run</span>：測試指令的結果，但不會真的進行同步，可用在先檢查哪些檔案會同步，很重要的參數
* <span class="hl-green mono">--delete</span>：沒有加這個參數的時候，來源端只會不斷的把新東西同步到目的端，一旦加了 --delete，rsync 會把來源端沒有但目的端有的檔案刪掉，讓兩個資料夾完完全全的呈現一致的內容
* <span class="hl-green mono">--exclude=PATTERN</span>：排除不想同步的檔案
* <span class="hl-green mono">--exclude-from=FILE</span>：讀取自訂的列表，使用列表的內容來排除不想同步的檔案，在排除多個檔案時較為實用。列表中的路徑必須是以來源端來看的相對路徑，每一行為一個要排除的資料夾或檔案


## 使用方法

本機資料夾 sync，將 A 的內容同步到 B

```bash
rsync -avP /A/ /B/
```

\
將 A 的內容同步到 B，並且刪除 B 裡面 A 所沒有的資料
    
```bash
rsync -avP --delete /A/ /B/

# 加上 --delete 參數後，會讓 B 與 A 的內容完全一樣
```

\
將本機中的 /home 資料夾中的 png 圖檔同步到遠端電腦的 /mnt
    
```bash
rsync -avP /home/*.png user@192.168.x.x:/mnt/
```

基本的遠端同步用法與 scp 類似


### exclude-from 的用法

假設 /home 裡面有a、b、c、d、e，5個檔案，我們可以自訂 /mnt/file 這個檔案來排除 d、e，只將 a、b、c 同步到 /tmp

先檢視一下 /home 的內容
    
```bash
ls /home
```
    
```bash
# 執行結果：
    
a b c d e
```

\
編輯 /mnt/file 檔案
    
```bash
echo -e "d\ne" > /mnt/file
```

\
查看 /mnt/file 內容

    
```bash
cat /mnt/file
```
    
```bash
# 執行結果：
    
d
e
```

\
進行同步並加上 exclude 參數

```bash
rsync -avP --exclude-from=/mnt/file /home /tmp
```

\
查看 /tmp 的資料夾內容

```bash
ls /tmp
```

```bash
# 執行結果：
    
a b c
```


## Daemon 模式

rsync 另外還有一種 daemon 模式，用起來跟 samba 與 nfs 類似，必須先在 server 端做設定，之後 client 端與 server 端同步時就可以不用輸入完整的路徑。

### Server 端設定

首先要在 server 與 client 都安裝 rsync，然後編輯 server 端的 <span class="hl-blue">/etc/rsyncd.conf</span>

```bash
vim /etc/rsyncd.conf
```
    
```bash
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log
use chroot = no

# 在範例中，我們建立一個名為 music 的 module，
# 之後 rsync 只要指定 module name 就可以同步了

[music]
comment = "Fox's Music"
path = /home/Fox/Music
uid = Fox ( 該目錄的使用者 )
gid = Fox ( 該目錄的群組 )
# uid 與 gid 關係到檔案複製過去後的所屬，用 root 的話 owner 會變 1000，
# 所以 uid 跟 gid 一定要設遠端使用者的所屬，
# 如 Fox:Fox，權限不對可能造成傳送失敗
read only = no
list = yes
# list 設為 no 的話，client 端使用 --list-only會看不到這個 module
charset = utf-8
hosts allow = 192.168.x.x  # 允許的 ip
auth users= fox  # 允許的使用者
secrets file = /etc/rsyncd.secrets
```

有關 uid 與 gid，<span class="hl-green">可以的話最好是 server 端與 client 的使用者都要同一個 uid 與 gid ，然後 server 的帳號大小寫一定要正確</span>！！不然 uid gid 即使設為 server 使用者的所屬，一樣會有問題。以我自己用 NAS 的例子，原本用 root 讓 NAS 裡的同步檔案全變成 1000:1000 是因為在 clinet 裡我的帳號 fox 的 uid 與 gid 就是1000，所以同步上傳後，那些檔案的擁有者也改變了，而因為NAS裡沒有 fox，Fox 的 uid 也不是1000

auth users 必須參照 secrets file，file 裡面沒有的帳號無法使用，例如當 secrets file 裡的帳號是 acid :111，那 clinet 端使用 rynsc 時就要用 acid 來登入，ex. acid@192.168.122.xx::backup，這裡跟 samba 很類似，不看 server 端的帳號而是看 rsync 自己的帳號密碼系統。

新增 <span class="hl-blue">/etc/rsyncd.secrets</span> 檔，格式為：「<span class="hl-blue">使用者：密碼</span>」，並將該文件權限設為600  (必要！)

```bash
echo "fox:123" | sudo tee /etc/rsyncd.secrets
```

```bash
sudo chmod 600 /etc/rsyncd.secrets
```

\
確認 rsyncd.conf 中的 path 有效，建立需要的資料夾。如果是用 root 建立資料夾的話，可能需要參考rsyncd.conf 中的 uid 與 gid 將資料夾更改擁有者與群組
    
```bash
sudo systemctl start rsyncd && sudo systemctl enable rsyncd
```


### 修改 Selinux 權限

讓無權限的使用者可以寫入
    
```bash
sudo setsebool -P allow_rsync_anon_write=1
```

\
設定目錄寫入權限
    
```bash
sudo chcon -t public_content_rw_t /path/folder
```

\
以這份筆記為例，有兩個路徑要設
    
```bash
sudo chcon -t public_content_rw_t /home/[UserName]/Music
```
    
```bash
sudo chcon -t public_content_rw_t /home/[UserName]
```

* <span class="hl-red">chcon 加上參數 -R 可以連同該目錄下的次目錄也同時修改</span>
* <span class="hl-red">target 資料夾與它上一層的資料夾都必須設定！！</span>

\
如果有開啟 firewalld，檢查防火牆的狀態
    
```bash
# 新增允許 rsync 服務指令：
sudo firewall-cmd --add-service rsyncd --permanent
```
    
```bash
sudo firewall-cmd --reload
```


### Client 端的使用

Server 端設定好後，就可以來使用 daemon 模式的 rsync 了，基本用法如下

\
列出 Server 端可供同步的 target
    
```bash
rsync --list-only $ServerIP::
```
    
```bash
# 執行結果：
    
music      "User's Music"
```

\
同步 client 的 music 資料夾到 server 端的 music 裡

```bash
rsync -avP /home/[UserName]/music/ [UserName]@$ServerIP::music/
```
