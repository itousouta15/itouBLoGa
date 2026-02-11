---
title: FhCTF 11401
date: 2026-01-01
cover: /images/FhCTF.png
categories:
  - 技術分享
tags:
  - 資安
lang: en
---
Rank 1!!! But all I can say is we finished it.

<!-- more -->

```
2026 FhCTF / Team CTF
01.01 – 01.05

Group - Open group McDonald's reservations, leave a comment +1
Final — Rank 1（Top 1）
```

## Misc

### Sanity Check
![image](/images/FhCTF/1.webp)
```
And to see how prizes are distributed.

    FhCTF{S3n1ty_Ch3ck1ng....😝}

Thanks to ISIP.HS for supporting and sponsoring this event.
```

### Christmas Tree
Classic Huffman encoding problem

The correct answer is
```
FhCTF{Hoffman_is_a_great_Christmas_tree}
```
**Note: The English spelling of Huffman encoding is "Huffman", not "Hoffman"**

### Hacker's Password Recipe

Convert the value of each ingredient to ASCII characters:
```
FhCTF{cooking_is_fun}
```

### Joke Master
**Congratulations this problem was rated as the worst one**
![image](/images/FhCTF/2.webp)

```
FhCTF{thisi_Prompt_Injection}
```

### Image Gallery
When entering, we can see the interface only allows PNG uploads. PNG has a fixed 8-byte header, so we can add PHP code after the header.

```
FhCTF{png_format?Cannot_stop_php!}
```

### Image Gallery Revenge
The problem combines Directory Traversal + JWT Algorithm Confusion. By manipulating the PNG's IDAT chunk, creating special images that retain PHP code even after GD library reprocessing.

```
FhCTF{But_I_CAN_WRITE_PHP_IN_IDAT_CHUNK}
```

### Python Compile

The program shows `Syntax Error` when there is code error, which means the file will still be read when handling errors. This suggests it might be an `LFI` (Local File Inclusion) problem.

By entering code that causes Python syntax errors and modifying the `filename` parameter to `/proc/self/environ`, we can read system environment variables.

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

Client-side SQL injection simulation. Enter in the Username field:
- ' or 1=1--
- ' OR '1'='1
- admin' or 1=1--

```
FhCTF{SQL_1nj_42_}
```

### Web Robots
Check robots.txt and access the disallowed paths:
```
FhCTF{r0b075_4r3_n0t_v15ible_in_tx7}
```

### Doors Open
Check robots.txt and try different door numbers. The solution involves trying negative numbers.
```
FhCTF{N3g4t1v3_numb3r5_in_URLs_4r3_fun}
```

### The Visual Blind Spot
Calculate the correct RGB key and decrypt sys-config data using the formula: charCode = (n / 3) - 13
```
FhCTF{Stn3am_C1ph3p}
```

### SYSTEM ROOT SHELL
Decode ASCII code arrays from the JavaScript source code and trigger RCE with special characters.
```
FhCTF{RCE__v3}
```

### Welcome to Cybersecurity Jungle
Find the encoded cookie name `aXNGbGFnU2hvdzJ1` (isFlagShow2u) and value `44Go44GF44KL44O8` (Japanese "true"), then set them in the browser.
```
FhCTF{Th3_e553nc3_of_pr0gramm1n6_is_ind3p3nden7_of_the_languag3_u53d}
```

### Templating Danger
SSTI vulnerability. Use Unicode encoding to bypass parenthesis filtering:
```
\u007b\u007bcycler.__init__.__globals__.os.environ['FLAG']\u007d\u007d
```
```
FhCTF{T3mpl371ng_n33d_t0_b3_m0r3_c4r3full🥹}
```

### Documents
Check HTTP headers to find "powerby: FastAPI", then access /openapi.json to discover /flag.html endpoint that requires Referer header forgery.
```
FhCTF{URL_encod3d_m337_p47h_d15cl0sure😱😱}
```

### LOG ACCESS
Input must contain more than 3 dots and the word "flag" (case-insensitive) to generate the flag.
```
FhCTF{Path_Tr4v_535}
```

### Pathway-leak
Cross-tenant access allows reading secret_admin/flag.txt without authentication.
```
FhCTF{p4th_tr4v3rs4l_w3_w4n7_t0_av01d}
```

### KID
JWT algorithm confusion attack: Change `alg` to `HS256`, `kid` to `../../../../../../dev/null`, and sign with empty string.
```
FhCTF{Th3_k1d_u53d_JWT_t0_tr4v3rs3_p4th5}
```

### Something You Put Into
Flag is stored in environment variables exposed in Docker configuration.
```
FhCTF{🐷B3_c4r3ful_y0ur_SQL_synt4x🐷}
```

## Reverse

### Simple Script Reader
Input "JUMP 0" to restart the script from the beginning.
```
FhCTF{f1l3_10_and_jumb_m4st3r}
```

### OBF
Complex obfuscation using state machine. The key is composed of 4 16-character parts combined from different operations (XOR, character subtraction, Base64, reversal).
```
FhCTF{P0lym0rph1c_Crypt0}
```

### The Lock
Use IDA Pro to reverse engineer: Extract the XOR key array [85, 51, 102, 17] and target array, then reverse the formula.
```
FhCTF{R3v3rs3_Eng1n33r1ng_1s_Ar7}
```

### Broken Decoder
ELF binary with stream cipher: Use LCG generator with rotation and XOR operations. Key: "I_just_afraid_someday_i_will_forget_the_password"
```
FhCTF{Why_not_use_std::string_instead_of_char_arrays?}
```

## Crypto

### Secure Encryption
ECB mode weakness: Same plaintext blocks produce identical ciphertext blocks, revealing data structure through color mapping.
```
FhCTF{3C13_m0d3_1s_z0_S3cur17y_}
```

### Encode By Py 😘
Emoji encryption is reversible using key recovery from repeated patterns. Key: [49, 57, 49, 35, 19, 44, 42, 37, 41, 23, 22, 21]
```
FhCTF{S1mpl3_FL46_We4k_P4ss}
```

### DES Lv.1 - Old Captain's Treasure
Part 1: Fix JPEG height in SOF header. Part 2: DES-ECB brute force with known key prefix "r5K9".
```
FhCTF{D0n7_c0un7_7h3_d4y5_m4k3_7h3_d4y5_c0un7}
```

### DES Lv.2 – Treasure Revisited
Try multiple schemes (CBC/ECB with different IVs) and key structures simultaneously. Key: "r5K9bB2x"
```
FhCTF{23.257735309160896_119.66758643893687}
```

### Admin's Password Onion
3 levels: MD5 hash (qwerty), SHA-1 (admin), Base64 (FsCTF{Happy Day})
```
FhCTF{CrYpt0_W3b_M4st3r_2025}
```

## OSINT

### Art Work
Image search reveals 2022 Pingtung Luoshan Wind Art Festival (2022屏東落山風藝術季)
```
FhCTF{屏東縣_落山風藝術季_1111104-1120205}
```

### Trace the Landmark
Image search identifies Piazza della Rotonda in Rome, Italy
```
FhCTF{Piazza_della_Rotonda_00186_Roma_RM_Italy}
```

### Island 1
Identify restaurant "新大廟口活海鮮" and dish "炒千佛手"
```
FhCTF{新大廟口活海鮮_炒千佛手}
```

### The FH Gift
EML file contains disguised ZIP file (DOCX). Check file signatures (magic bytes).
```
FhCTF{M1M3_Typ3s_C4n_B3_D3c3pt1v3}
```

### Business Time 1
EXIF metadata and GitHub repository leads to T-SCHOOL STUDENTS EXPO 2026 event.
```
FhCTF{T-SCHOOL_STUDENTS_EXPO'26_2026-01-18T09:00_2026-01-19T16:00}
```

### Business Time 2
Event location at 台北市中山區吉林路110號. Convert to coordinates.
```
FhCTF{25.0541_121.5338}
```

### Lithium Exploration
Identify Salar de Uyuni salt flat in Bolivia as major lithium source
```
FhCTF{Bolivia_SalardeUyuni_Lithium}
```

### SRL
Location: Near Giants dome with Taipei 101 and National Sun Yat-sen Mausoleum in background.
```
FhCTF{Nanjing_Fuxing_Road}
```

### Island 2
Jianggong Islet, historical leper colony in Kinmen.
```
FhCTF{Jianggong_Islet_Kinmen}
```

### Beautiful Dome 1
Requires OSINT and deduction to identify location.
```
FhCTF{Blue_Mosque}
```

### Beautiful Dome 2
Turkish Airlines free ferry service in Bosphorus Strait: T06 18:30-23:00 (April 1 - October 31)
```
FhCTF{1830-2300_0401-1031}
```

### Rider without Helmet
Image reverse search identifies 2014 Kymco Many50 motorcycle
```
FhCTF{2014_Kymco_Many50}
```

### EXIF "Photo Coordinates"
Extract GPS coordinates from EXIF metadata
```
FhCTF{Latitude_Longitude_Coordinates}
```

## Blue Team

### Large Order
Hex string encrypted with XOR using key "FhCTF". Decode to get MD5 hash, then query VirusTotal for C2 server.
```
FhCTF{http://171.22.28.221/5c06c05b7b34e8e6.php}
```

### User's Bad Day
LLMNR Poisoning attack. Analyze network traffic to find:
- Hostname: fulesrv
- Username: Bob
- Filename: test
```
FhCTF{fulesrv_Bob_test}
```

