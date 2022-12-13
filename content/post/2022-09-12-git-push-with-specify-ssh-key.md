---
author: wade
title: 使用多組 SSH Key 讓不同 GitHub 帳號免密碼執行 git push
date: 2022-09-12T12:57:23+08:00
type: post
draft: false
url: /post/2022-09-12-git-push-with-specify-ssh-key
image: "https://image.wadeism.net/github00.png"
categories:
- Developer
tags:
- Git
- Linux
---

開始用 Hugo 與 md 檔來寫文章後（雖然這是今年的第一篇），很多東西都改用 GitHub 來版控順便當備份，加上最近前端課程也都是用 GitHub pull request 來交作業，頻繁 push 之下，原本習慣 push 後手動輸入密碼，頓時覺得有夠麻煩，所以就來筆記一下使用 ssh key 免輸入密碼來 git push 的方法。

本例環境使用 ArchLinux，一般的 Linux 與 MacOS 應該都可以照做，Windows 的話可能要先想辦法裝 sshkey-gen 之類的東西，由於我不只一組的 GitHub 帳號，所以範例會是用兩組不同的 ssh key 分別對應它們分屬的 GitHub 帳號。


## 建立 SSH key pair

```bash
ssh-keygen \
  -t rsa \ 
  -b 4096 \
  -C "XXX@gmail.com"
```

* <span class="hl-green mono">-b</span>：指定用 4096 bits 的密碼長度會更安全些，預設是2048。
* <span class="hl-green mono">-C</span>：編寫註釋，這行字將會顯示在 public key 的最後面，通常是寫自己的 email，不過這個選項其實可有可無，沒寫的話預設會是自己的系統帳號 + hostname。

執行後會出現下面的提示：

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa):
```

預設會把 key 放在 <span class="hl-blue">~/home/.ssh</span> 裡，並且命名為 <span class="hl-blue">id_rsa</span>、<span class="hl-blue">id_rsa.pub</span>，不過我有兩組 GitHub 帳號在用，需要分別使用不同的 key push 到各自帳號的 repo 裡，因此這邊必須做兩次 ssh-keygen 並且指定個檔名，這裡我就先輸入 ~/.ssh/github-user-1 與 ~/.ssh/github-user-2 表示第一組與第二組帳號的 key。


## 將 public key 存入 GitHub帳號

登入 GitHub 的[設定頁面](https://github.com/settings/keys) 點選右上的 <span class="hl-blue">New SSH key</span>

![](https://image.wadeism.net/ssh_git_push01.webp)

依自己喜好填寫 Title，Key type 用預設的 <span class="hl-blue">Authentication Key</span>，最下面 Key 的部分請依照所登入的 GitHub 帳號，接著用文字編輯器或 cat 打開剛才做好的 <span class="hl-blue">~/.ssh/github-user-X.pub</span>，將裡面的內容複製到 Key 欄位裡，填好後按下 <span class="hl-blue">Add SSH key</span> 即可。

![](https://image.wadeism.net/ssh_git_push01.webp)


## 設定 ssh config 檔

編輯 <span class="hl-blue">~/.ssh/config</span> 並加入下面的內容

```bash
Host            wade-github
HostName        github.com
User            git
IdentityFile    ~/.ssh/github-user-1
IdentitiesOnly  yes

Host            michael-github
HostName        github.com
User            git
IdentityFile    ~/.ssh/github-user-2
IdentitiesOnly  yes
```

<span class="hl-blue">Host</span> 可以依需求自訂，它是之後 repo 的 ssh url 會用到的名字，<span class="hl-blue">IdentityFile</span> 填上剛才做的私鑰路徑即可，加入<span class="hl-blue">IdentitiesOnly yes</span> 選項則是避免連線時使用預設的 key（id_rsa）


## 檢查 ssh 設定

執行下面指令

```sh
ssh -T git@wade-github
ssh -T git@michael-github

# 執行結果
Hi wade! You've successfully authenticated, but GitHub does not provide shell access.
Hi michael! You've successfully authenticated, but GitHub does not provide shell access.
```

如果兩次執行結果都顯示 You've successfully authenticated，而且分別看到不同帳號的 user name 就表示 ssh 的部分已設定成功！


## 切換 local repo 的 url

在終端機裡先把目錄切到 repo 裡，執行下面的指令

```bash
git remote -v

# 帳號一執行結果
origin	https://github.com/wade/test.git (fetch)
origin	https://github.com/wade/test.git (push)

# 帳號二執行結果
origin	https://github.com/michael/test.git (fetch)
origin	https://github.com/michael/test.git (push)
```

可以看到 repo test.git 的 url 是走 https 的，而不是 ssh，因此我們要執行下面的指令把 url 切換成 ssh 模式

```bash
git remote set-url origin git@wade-github:wade/test.git
git remote set-url origin git@michael-github:michael/test.git
```

格式說明：
```bash
git remote set-url 版本名 git@[Host]:[GitHub帳號]/[Repo名稱].git
```

<span class="hl-blue">git remote set-url</span> 之後所帶的東西基本上是照剛才 <span class="hl-blue">git remove -v</span> 的內容帶入，如果你的版本庫不是 origin 的話，origin那邊帶的就會是你的版本，後面則是 ssh 用的 url，要注意 <span class="hl-red">@wade-github 這邊後面指的是 ~/.ssh/config 裡 Host 選項的值</span>


就這樣將兩位使用者的 repo 裡更新好各自的 ssh url 後，他們在自己的 repo 裡直接 git push 就可以透過 ssh 協定而不用輸入密碼啦！


* * *

參考資料：

[Push to github without re-entering password (connect SSH key)](https://blog.corsego.com/aws-cloud9-github-ssh)
[Specify an SSH key for git push for a given domain](https://stackoverflow.com/questions/7927750/specify-an-ssh-key-for-git-push-for-a-given-domain)

