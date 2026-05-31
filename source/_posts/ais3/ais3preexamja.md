---
title: AIS3 予備試験 2025
date: 2025-07-11 13:32:32
categories:
  - 技術分享
tags:
  - AIS3
cover: /images/ais3/ais3.webp
urlname: AIS3PE
lang: ja
---

# 前書き

これが私の最初のCTFでした。
私はとても下手にプレーし、書き起こしもひどいです。
~~目のために、これ以上読み進めないでください。~~

# web

## tomorin db

### 問題の観察

まず、問題が提示したURLにアクセスします：[http://chals1.ais3.org:30000/](http://chals1.ais3.org:30000/)
![](/images/ais3/tomorin.webp)
次の4つのファイルが見えます：

  - cute.jpg
  - flag
  - is.jpg
  - tomorin.jpg

3つは画像ですが、**`flag`をクリックすると[MyGO\\!\!\!\!'s Yurisenshu](https://www.youtube.com/watch?v=lQuWN0biOBU)にリダイレクトされます** ~~またMyGOだ~~
![](/images/ais3/MyGO.webp)

### 脆弱性の分析

flagファイル自体は存在しますが、`/flag`というパスが特別に処理されています。これをバイパスできるか試してみましょう。

### バイパスのアイデア

試した結果、URLエンコード `%2f` を `flag` の前に付けると、リダイレクトされませんでした。
そのため、ルートURLの後に **`/%2fflag`** を追加しました。
![](/images/ais3/成功訪問.webp)

すると、flagを取得できます：

```
AIS3{G01ang_H2v3_a_c0O1_way!!!_Us3ing_C0NN3ct_M3Th07_L0l@T0m0r1n_1s_cute_D0_yo7_L0ve_t0MoRIN?}
```

## ログイン画面 1

### ページ分析

ページを開くと、ログイン画面が表示されます：
![](/images/ais3/登入畫面.webp)

内容は次の通りです：

  - ユーザー名入力欄
  - パスワード入力欄
  - ログインボタン

### インジェクション攻撃
![](/images/ais3/FLAGG.webp)

そしてFLAGを取得しました：

```
AIS3{1.Es55y_SQL_1nJ3ct10n_w1th_2fa_IuABDADGeP0}
```

# misc

## Ramen CTF

これは私にとって最も面白い問題でした。

### 問題の観察

彼らは画像を提示しました：
![](/images/ais3/chal.webp)
唯一価値があるのは領収書だけだったので、領収書の詳細から情報を探せないか考えました。
![](/images/ais3/發票.webp)
次の情報が得られました：

  - 平和....（Heihwa....）
  - MFプレフィックス
  - 2025/04/13の日付の領収書
  - ランダムコード7095
  - 販売者番号3478592...

次に、QRコードスキャナーを使うと、次が見つかりました：
![](/images/ais3/QRcode.webp)
  - 完全な領収書番号 MF16879911
  - 食事はエビラーメン

### 住所検索

上記の情報を[財政部電子発票整合服務平台](https://www.einvoice.nat.gov.tw/portal/btc/audit/btc601w/search)に入力します。
![](/images/ais3/完整資訊.webp)

すると住所が得られ、Googleマップに入力しました。
「樂山溫泉拉麵（Leshan Hot Spring Ramen）」という店が見つかりました。

その後、flagを取得しました：

```
AIS3{樂山溫泉拉麵:蝦拉麵}
```

## AIS3 Tiny Server - Web / Misc

最初に、問題が与えたURLをクリックし、トークンを取得します。
次に http://chals1.ais3.org:20096/index.html に到達します。
![](/images/ais3/Tiny-server.webp)

一般的な隠しパスを何度も試した結果、**`//`を追加するとファイルディレクトリが表示される**ことがわかりました。
![](/images/ais3/目錄.webp)

多くのファイルがありました。私は`flag`という名前を含むものをクリックしました：**readable_flag_jkO47trw1ctKlOIFC7smx7hivqoCPL8Y**
![](/images/ais3/FLAG.webp)

そして、flagを取得しました：

```
AIS3{tInY_we8_53Rv3R_wi7H_fILe_8R0Ws1nG_AS_@_FeAtURe}
```
