---
author: wade
date: 2018-06-25 19:24:43+00:00
draft: false
title: systemctl 與 runlevel
type: post
url: /post/systemctl-and-runlevel/
categories:
- Linux
---

在 CentOS 7 與 Ubuntu 15.04 之後，有關 system process 與 system runlevel 的控制從早期的 init.d 換成了 systemd，因此以前的 runlevel 與 init $N 指令也改成了使用 systemctl 來操作。
    
內部架構改了，但不代表以前的指令就不能使用，所以我們仍然可以使用舊的指令來查詢當前的 runlevel，也可以用 init $N 來切換 runlevel，不知道這算不算是 Linux 的優點？就像現在的檔案結構不建議使用 /bin，而是將以前 /bin 的東西移到 /usr/bin，但你仍然可以在 /bin 底下找到你要的東西（因為 CentOS 7 預設會把 /bin 連結到 /usr/bin，所以使用者幾乎不會感到有什麼不同），算是兼顧新架構與相容性的好方法。

下面就來介紹幾個關於 runlevel 的指令，範例中會把 init.d 與 systemd 的指令都儘量呈現：

\
顯示目前的 runlevel
    
```bash
systemctl get-default
```
    
```bash
# 執行結果：
    
multi-user.target
```
  
```bash
runlevel
```
    
```bash
# 執行結果：
    
1 3
```

multi-user 也就是傳統上的 runlevel 3，而打 runlevel 指令所輸出的兩個數字是<span class="hl-blue">前一個 runlevel</span> 與 <span class="hl-blue">當前的 runlevel</span>，所以範例中看得出來系統目前是 runlevel 3，前一次則是 runlevel 1

\
將系統切換到一般的文字模式

```bash
sudo systemctl isolate multi-user.target
```
    
```bash
sudo init 3
```

\
將系統切換到圖形介面模式
    
```bash
sudo systemctl isolate graphical.target
```
    
```bash
sudo init 5
```

\
設定開機時預設的 runlevel
    
```bash
# 指定一般文字介面作為開機的預設模式
sudo systemctl set-default multi-user.target
```
    
```bash
# 指定GUI介面作為開機的預設模式
sudo systemctl set-default multi-user.target
```

\
init 的 指定預設 runlevel 則是編輯 /etc/inittab 這個檔案，不過如果嘗試開啟它，你會發現檔案裡載明 inittab 已不再使用了，想玩的話可以安裝舊一點的版本。

\
列出可用的 runlevel
    
```bash
systemctl list-units --type target
```
    
```bash
# 執行結果：
    
UNIT                  LOAD   ACTIVE SUB    DESCRIPTION
basic.target          loaded active active Basic System
cryptsetup.target     loaded active active Local Encrypted Volumes
getty.target          loaded active active Login Prompts
local-fs-pre.target   loaded active active Local File Systems (Pre)
local-fs.target       loaded active active Local File Systems
multi-user.target     loaded active active Multi-User System
network-online.target loaded active active Network is Online
network-pre.target    loaded active active Network (Pre)
network.target        loaded active active Network
paths.target          loaded active active Paths
remote-fs.target      loaded active active Remote File Systems
slices.target         loaded active active Slices
sockets.target        loaded active active Sockets
swap.target           loaded active active Swap
sysinit.target        loaded active active System Initialization
timers.target         loaded active active Timers

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
SUB    = The low-level unit activation state, values depend on unit type.

16 loaded units listed. Pass --all to see loaded but inactive units, too.
To show all installed unit files use 'systemctl list-unit-files'.
```
