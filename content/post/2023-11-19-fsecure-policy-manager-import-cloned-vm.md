---
title: 解決 F-Secure Policy Manager 無法納管 cloned VM 的問題
date: 2023-11-19T23:23:38+08:00
type: post
draft: false
url: /post/2023-11-19-fsecure-policy-manager-import-cloned-vm
image: "https://image.wadeism.net/fsecure00.jpg"
categories:
- Linux
tags:
- F-Secure
- Ubuntu
---

公司在導入 F-Secure 時出現了一個不太意外的問題。一般來說 Linux 裝了 f-secure-linux security 之後，該台機器就會出現在 F-Secure Policy Manager（防毒軟體的中控台）的 Pending List 中，等待我們 Import 後正式讓防毒中控台納管這台 Linux。

我們的產品中，有許多 HyperV 的 VM 是用 HyperV Export 出 VM backup 之後，再 Import Virtual Machine 時引用剛才備份的 VM 所建立，當我們在這數十台 clone 出的 VM 安裝 fsls 之後，發現中控台同一時間只能抓到一台 VM，無法辨識出每一台有安裝 fsls 的 VM：

![](https://image.wadeism.net/fsecure01.jpg)

多按幾次 Refresh 後跳出其它台的 VM…

![](https://image.wadeism.net/fsecure02.jpg)

下面就我所找到的解決方法來說明：


## 環境說明
系統：Ubuntu 22.04 Server<br/>
F-Secure Policy Manager Server 版本：15.20.95099<br/>
F-Secure Policy Manager Console 版本：15.20.95099<br/>
f-secure-linuxsecurity 版本：2.0.34（fsls64-2.0.34-exported.zip）<br/>

測試用 VM 名稱：test01、test02


## Process 檢查
首先我們分別在兩台測試 VM 中查看 F-Secure 執行的 process 資料，可以看出一些端倪

```bash
ps aux | grep fsma2 | grep -v auto
```

```sh
# test01 執行結果節錄

fsbg        3718  0.0  0.2 1014100 1988 ?        Ssl  Nov02   0:00 /opt/f-secure/linuxsecurity/bin/lswebserver --fsma2-socket /var/opt/f-secure/fsbg/fsma2/run/socket --unix /var/opt/f-secure/linuxsecurity/webserver/run/socket --update-service-socket /var/opt/f-secure/fsbg/updated/run/socket
fsbg        3784  0.8  0.8  17140  7596 ?        Ss   Nov02   8:19 /opt/f-secure/fsbg/bin/fsma2 --local-schema /opt/f-secure/fsbg/share/mgmt/cosmos.json --mount-point /etc/opt/f-secure/fsbg/mgmt --vardir /var/opt/f-secure/fsbg/fsma2 --uid 998 --gid 999 -o allow_other -o default_permissions --mib=/etc/opt/f-secure/fsbg/policies/fsbg.mib.json --mode pm --address https://192.168.23.50:443 --identity 35f723a7-1542-d875-cc7f-38uifbfyu7 --pubkey /var/opt/f-secure/fsbg/setup/pm-server-key.pub
```

```sh
# test02 執行結果節錄

fsbg        3723  0.0  0.2 1014100 1988 ?        Ssl  Nov02   0:00 /opt/f-secure/linuxsecurity/bin/lswebserver --fsma2-socket /var/opt/f-secure/fsbg/fsma2/run/socket --unix /var/opt/f-secure/linuxsecurity/webserver/run/socket --update-service-socket /var/opt/f-secure/fsbg/updated/run/socket
fsbg        3790  0.8  0.9  17288  9240 ?        Ss   Nov02   9:27 /opt/f-secure/fsbg/bin/fsma2 --local-schema /opt/f-secure/fsbg/share/mgmt/cosmos.json --mount-point /etc/opt/f-secure/fsbg/mgmt --vardir /var/opt/f-secure/fsbg/fsma2 --uid 998 --gid 999 -o allow_other -o default_permissions --mib=/etc/opt/f-secure/fsbg/policies/fsbg.mib.json --mode pm --address https://192.168.23.50:443 --identity 35f723a7-1542-d875-cc7f-38uifbfyu7 --pubkey /var/opt/f-secure/fsbg/setup/pm-server-key.pub
```

從這裡可以看到一個很關鍵的參數，"<span class="hl-green">--identity</span>--identity 35f723a7-1542-d875-cc7f-38uifbfyu7"，以字面上猜測，防毒軟體執行時很可能是用這段 id 作為識別碼，接著我們再進一步驗證這串 id 的來源


## 檢查系統 id
分別在兩台測試機執行下面的指令，應該都會得到一樣的結果

查看 machine-id
```sh
cat /etc/machine-id
```

```sh
#執行結果
3c1721d6a6da53ccba21e35233d70493
```

查看 product_uuid (system-uuid)，兩種指令都是查到一樣的資料

```sh
cat /sys/class/dmi/id/product_uuid
```
```sh
sudo dmidecode -s system-uuid
```
```sh
#執行結果
35f723a7-1542-d875-cc7f-38uifbfyu7
```

從這裡就可以看出 f-secure 的 identity 是引用 <span class="hl-green">system uuid</span> 作為識別碼。

如果想要更進一步的確認，可以直接查看 f-secure 啟動的腳本

```sh
vim /opt/f-secure/fsbg/bin/fsma2_start
```

```sh
#!/bin/bash

DESTDIR=$(dirname "$(dirname "$(readlink -f "$0")")")
ETCDIR=$(readlink -f "$DESTDIR/etc")
VARDIR=$(readlink -f "$DESTDIR/var")
ROOT=$(dirname "$DESTDIR")
BG_DESTDIR=$ROOT/baseguard
BG_VARDIR=$(readlink -f "$ROOT/baseguard/var")

mount_point=$ETCDIR/mgmt

uid=$("$BG_DESTDIR/bin/nstool" 3 uid) || exit 1
gid=$("$BG_DESTDIR/bin/nstool" 3 gid) || exit 1
uuid=$("$BG_DESTDIR/bin/nstool" 3 uuid) || exit 1

options=(
    --local-schema "$DESTDIR"/share/mgmt/cosmos.json
    --mount-point "$mount_point"
    --vardir "$VARDIR"/fsma2
    --uid "$uid"
    --gid "$gid"
    -o allow_other
    -o default_permissions
)

for f in "$ETCDIR"/policies/*; do
    options+=("--mib=$f")
done

setup_mgmt=$DESTDIR/bin/setup-mgmt
management_type=$($setup_mgmt show current)

options+=(--mode "$management_type")

case "$management_type" in
    pm)
        pm_address=$($setup_mgmt show pm address)
        options+=(
            --address "$pm_address"
            --identity "$uuid"
        )

        pm_public_key_path=$($setup_mgmt show pm public-key-path)
        if [[ -n $pm_public_key_path ]]; then
            options+=(
                --pubkey "$pm_public_key_path"
            )
        fi
        ;;
    psb | mdr)
        doormand_socket_path="$BG_VARDIR"/doormand/run/socket
        options+=(
            --doormand-socket "$doormand_socket_path"
        )
        ;;
esac

umount "$mount_point" 2>/dev/null

exec "$DESTDIR"/bin/fsma2 "${options[@]}"
```

第 41 行中寫到 <span class="hl-green">--identify "$uuid"</span>，而 $uuid 的值可從第14行的變數取得，我們就來用它的指令試試看，這邊我先省略變數組成，用絕對路徑執行預設路徑的程式


```sh
/opt/f-secure/baseguard/bin/nstool 3 uuid
```

```sh
# 執行結果
35f723a7-1542-d875-cc7f-38uifbfyu7
```

這樣就可以確定，f-secure 啟動時的 identity 是用 system-uuid 了


## 修改 uid

在這裡其實可以先手動硬改 uuid 的值讓防毒軟體改用自訂的 uuid 啟動作為驗證，驗證過後，可以得知當 f-secure 啟動時代入不同的 identity 時，Policy Manager 就可以正確的辨識兩台不同的機器並一起納管。

確認沒問題之後，就可以針對大量的機器進行修改，不過這裡要先說明，product_uuid 或是 system-uuid 是從主機板的辨別碼而來，因此在系統中是無法修改的，即使硬改也沒用，但 /etc/machine-id 則是可以修改，並且有指令可以產出隨機的序號，因此我們就可以利用 random 的 machine-id 作為 f-secure 的 identity uuid 來讓每一台機器都擁有獨自的 machine-id

以下是修改的腳本內容，存成 shell script 檔後可利用 Ansible 部署到機器中一次執行，若要手工的話，也是可以將多行指令全部組在一起一台一台的貼上執行

```sh
#!/bin/bash

# 清空原有的 machine-id
cat /dev/null | sudo tee /etc/machine-id

# 產生一組新的 machine-id，如果系統中沒有這個指令，也可以用下面指令產出
# sudo dbus-uuidgen --ensure=/etc/machine-id
sudo systemd-machine-id-setup

# 將啟動腳本中原有指定 uuid 的那行註解，並在下一行新增用 machine-id 作為 uuid 的值，最後將內容匯出到暫存檔
sudo bash -c "awk -v new_uuid=\"$(cat /etc/machine-id)\" '/^uuid=/{print \"#\"\$0 RS \"uuid=\" new_uuid; next} 1' /opt/f-secure/fsbg/bin/fsma2_start > /tmp/temp_file"

# 修改暫存檔的權限
sudo chmod --reference=/opt/f-secure/fsbg/bin/fsma2 /tmp/temp_file

# 將暫存檔覆蓋回原本的啟動腳本
sudo mv /tmp/temp_file /opt/f-secure/fsbg/bin/fsma2_start

# 重啟 f-secure
sudo systemctl restart fsma2.service
```

最後我們再回到 F-Secure Policy Manager 上，把原本 Pending 的那台機器先移除，再重新 Refresh ，就會同時出現兩台機器啦！

![](https://image.wadeism.net/fsecure03.jpg)