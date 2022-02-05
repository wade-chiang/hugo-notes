---
author: wade
date: 2020-08-12 01:46:06+00:00
draft: false
title: Linux 檔案處理批次作業
type: post
url: /post/linux-batch-file-operate/
categories:
- Linux
tags:
- Bash
---

記錄一些我用過的批次處理，基本上都是指令加上迴圈搞定

{{< red >}}處理檔名時，最好保持將檔名用「" "」包起來的習慣！！{{< /red >}}


## 將資料夾分別壓縮成 zip（cbz）檔

如果有很多的漫畫圖檔放在個別的資料夾裡，一個資料夾就是一集，那麼分別把它們壓成 cbz 檔是個很好的選擇

首先用 ls 將目錄底下的所有資料夾名稱匯出到一個 list 檔

```bash
ls > /tmp/list
```

\
接著引用該 list 作為檔名來將資料夾批次壓縮成 *.cbz 檔

```bash
while read file; 
do zip -r "${file}".cbz "${file}";
done < /tmp/list
```

\
最後再刪除 list 檔

```bash
rm /tmp/list
```


## 將目錄中資料夾裡所有圖檔合成一個 pdf 檔

情境同上面，除了把每一集的漫畫壓成 cbz 檔之外，也可以將它們合成 pdf 檔，一集一個 pdf

首先安裝 ImageMagick

```bash
sudo apt install imagemagick
```

\
使用迴圈合成 pdf 檔並且以資料夾名稱作為 pdf 的檔名

```bash
for dir in *
do 
  (cd "${dir}" && convert * /檔案存放路徑/"$(basename "${dir}").pdf")
done
```

\
如果轉換失敗出現下面的訊息：

```bash
convert-im6.q16: attempt to perform an operation not allowed by the security policy `PDF' @ error/constitute.c/IsCoderAuthorized/408.
```

\
可以將下面的內容貼到 {{< blue >}}/etc/ImageMagick-X/policy.xml{{< /blue >}} 的 {{< blue >}}&lt;/policymap&gt;{{< /blue >}} 之前

```xml
<policy domain="coder" rights="read | write" pattern="PDF" />
```


## 將所有檔名中的空白替換為下底線

```bash
for file in *
  do mv "${file}" "$(echo "${file}" | tr ' ' '_')"
done
```


## 批次解壓縮有密碼的 rar 檔

```bash
for file in *.rar
  do rar -p'PASSWORD' x "${file}"
done
```
