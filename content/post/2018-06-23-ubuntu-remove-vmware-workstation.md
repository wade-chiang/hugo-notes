---
author: wade
date: 2018-06-23 12:29:19+00:00
draft: false
title: Ubuntu 刪除 VMWare Workstation
type: post
url: /post/ubuntu-remove-vmware-workstation/
categories:
- Linux
tags:
- Ubuntu
---

一般在 Linux 安裝 VMWare 時，不管是 player 還是 workstation 都是下載官網的 <span class="hl-blue">.bundle</span> 檔來安裝，不過安裝完後常常不知道要怎麼移除。其實在安裝過後，系統會多出一個「vmware-installer」的小程式，這個程式就是拿來移除 VMWare 用的，另外也有其它的功能可詳見說明檔（本例為 Ubuntu，其它版本的 Linux 應該也可以使用）

顯示 vmware-installer 的功能

```bash
vmware-installer --help
```
    
```bash
# 執行結果：
    
Usage: vmware-installer [options]

VMware Installer

Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit

  Manage:
    Install or uninstall products

    -i FILE, --install-bundle=FILE
                        Install bundle from FILE
    --install-component=FILE
                        Install a component
    --uninstall-component=NAME
                        Force uninstallation of a component
    -u NAME, --uninstall-product=NAME
                        Uninstall a product
    -r, --resolve-system
                        Force the system to resolve the current state
    --register-file=COMPONENT_NAME (config|regular) FILE
                        Register a file in the database
    -x DIR, --extract=DIR
                        Extract the contents of the bundle into DIR
    -p DIR, --prefix=DIR
                        Set a custom install location

  Information:
    Look up information on installed products

    -l, --list-products
                        List installed products
    -t, --list-components
                        List the installed components
    -L COMPONENT, --list-files=COMPONENT
                        List files for a given component
    -S FILE, --find-file=FILE
                        List components and files matching the given pattern

  Settings:
    Set and retrieve settings

    -g COMPONENT KEY, --get-setting=COMPONENT KEY
                        Get setting
    -s COMPONENT KEY VALUE, --set-setting=COMPONENT KEY VALUE
                        Set setting
    -d COMPONENT KEY, --delete-setting=COMPONENT KEY
                        Delete setting

 Options:
    --gtk               Use the Gtk+ UI (Default)
    --console           Use the console UI
    --custom            Allow customization of the install, including file
                        locations.
    --regular           Displays questions that have no good defaults
                        (Default)
    --required          Displays only questions absolutely required
    -I, --ignore-errors
                        Ignore component script errors
    --eulas-agreed      Agree to the EULA
```

\
顯示目前 VMWare Workstation 的版本
    
```bash
sudo vmware-installer -l
```
    
```bash
# 執行結果：
    
    Product Name Product Version 
    ==================== ====================
    vmware-workstation 14.1.1.7528167 
```

\
移除 VMWare Workstation
    
```bash
sudo vmware-installer -u vmware-workstation
```

\
顯示目前安裝的元件
    
```bash
sudo vmware-installer -t 
```
    
```bash
# 執行結果：
    
Component Name                 Component Long Name                               Component Version   
============================== ================================================= ====================
vmware-installer               VMware Installer                                  2.1.0.7305623       
vmware-player-setup            VMware Player Setup                               14.1.1.7528167      
vmware-vmx                     VMware VMX                                        14.1.1.7528167      
vmware-vix-lib-Workstation1400 VMware VIX Workstation-14.0.0 Library             1.17.0.7528167      
vmware-vix-core                VMware VIX Core Library                           1.17.0.7528167      
vmware-network-editor          VMware Network Editor                             14.1.1.7528167      
vmware-network-editor-ui       VMware Network Editor User Interface              14.1.1.7528167      
vmware-tools-netware           VMware Tools for NetWare                          10.2.0.7528167      
vmware-tools-linuxPreGlibc25   VMware Tools for legacy Linux                     10.2.0.7528167      
vmware-tools-winPreVista       VMware Tools for Windows 2000, XP and Server 2003 10.2.0.7528167      
vmware-tools-winPre2k          VMware Tools for Windows 95, 98, Me and NT        10.2.0.7528167      
vmware-tools-freebsd           VMware Tools for FreeBSD                          10.2.0.7528167      
vmware-tools-windows           VMware Tools for Windows Vista or later           10.2.0.7528167      
vmware-tools-solaris           VMware Tools for Solaris                          10.2.0.7528167      
vmware-tools-linux             VMware Tools for Linux                            10.2.0.7528167      
vmware-usbarbitrator           VMware USB Arbitrator                            17.1.3.7528167      
vmware-player-app              VMware Player Application                         14.1.1.7528167      
vmware-workstation-server      VMware Workstation Server                         14.1.1.7528167      
vmware-ovftool                 VMware OVF Tool comp
```
