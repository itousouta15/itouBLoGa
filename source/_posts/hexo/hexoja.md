---
title: GitHub Pages + Hexoで個人ブログを立ち上げる
date: 2025-08-27 14:32:32
tags:
  - Hexo
cover: /images/Hexo/hexo_github.webp
urlname: Hexo
lang: ja
---

今日の情報過多の時代では、「ブログ」という言葉は時代遅れに感じるかもしれませんが、開発者、研究者、クリエイターにとっては今でも聖域です。ソーシャルメディアに散らばる断片的な情報とは異なり、ブログは体系的な知識の整理や技術共有に適しており、検索可能で保存され、継続的に読み返すことができます。特にプログラミングやサイバーセキュリティを学ぶ人にとって、個人の技術ブログを持つことは成長の記録になるだけでなく、将来のためのパーソナルブランド構築にも役立ちます。

この記事では、Windowsシステムを前提に、**Hexo**（高速で簡潔な静的ブログフレームワーク）と**GitHub Pages**（GitHubの無料静的サイトホスティングサービス）を使って、ゼロからブログを立ち上げる手順を順を追って解説します。

## 環境の準備

始める前に、次のものが揃っていることを確認してください：

* **Node.js**（LTSバージョン推奨。HexoはNode.js 14以上が必要）
* **npm**（Node.jsにバンドルされています）
* **Git**（GitHubのバージョン管理とデプロイに必要）
* **GitHubアカウント**（プロジェクトを保存し、Pagesサイトをホストするため）

### Node.jsのインストール

公式サイトにアクセスします：
[https://nodejs.org/zh-tw/download](https://nodejs.org/zh-tw/download)
![hexo](/images/Hexo/hexo.webp)

Dockerがある場合は上記のコードをターミナルにコピーしてもよいです。そうでなければ、MSIファイルをダウンロードして実行してください。HexoとNode.jsの両方は最新の（少なくともLTS）バージョンをインストールすることをおすすめします。セキュリティパッチとパフォーマンスが最適になるからです。

## Hexoの実装

まず、ターミナルを開いて次を実行します：

```bash
hexo init my-blog
```

これにより、現在のディレクトリに `my-blog` というフォルダが作成され、基本的なHexoプロジェクト構造とファイルが含まれます。

2. このフォルダに移動します：

```bash
cd my-blog
```

3. Hexoの依存関係をインストールします：

```bash
npm install
```

これでHexoプロジェクトのディレクトリが初期化されました。

### 重要なファイル紹介

次に、覚えておくべき重要なファイルとフォルダを紹介します。

#### package.json

Hexoはejsのようなテンプレートエンジンを使い、コンテンツを静的HTMLにレンダリングします。`package.json`には次のような依存関係が含まれています：

```
"dependencies": {
    "hexo": "^5.0.0",
    "hexo-generator-archive": "^1.0.0",
    "hexo-generator-category": "^1.0.0",
    "hexo-generator-index": "^2.0.0",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^4.0.0",
    "hexo-renderer-stylus": "^2.0.0",
    "hexo-server": "^2.0.0",
    "hexo-theme-landscape": "^0.0.3"
  }
```

#### scaffolds/

このフォルダには `draft.md`、`page.md`、`post.md` の3つのファイルが含まれます。

`$ hexo new <type> <name>` を実行すると、Hexoはこれらのテンプレートを使って新しいドラフト、ページ、投稿を作成します。

#### source/

このフォルダはサイトのすべてのリソースを保存します。アンダースコアで始まるディレクトリはHexoが無視しますが、`_posts`は例外で、記事が保存される場所です。MarkdownやHTMLなどの静的ファイルはビルド時に `public` フォルダにコンパイルされます。

#### theme/

このフォルダにはテーマファイルが入ります。デフォルトテーマは **landscape** ですが、テーマを変更するにはテーマをダウンロードして `themes/` に配置します。

*(安定性のために、積極的にメンテナンスされているテーマを選びましょう。)*

#### _config.yml

これはサイト全体の設定ファイルです。ここでサイトの挙動や設定を調整できます。

### テンプレートを使う

次に、Hexoテーマを選びます（例：NexT、Butterfly、Reimu）。テーマは通常GitHubで公開されています。Hexoプロジェクトの `themes` ディレクトリにテーマをダウンロードまたはクローンしてください。

> もっと手早くセットアップしたい場合：
>
> ```bash
git clone https://github.com/D-Sketon/reimu-template
dir reimu-template
npm install
hexo server
```
>
> このリポジトリにはHexo、**hexo-theme-reimu**、その他の必須プラグインが既に含まれており、クローンしてインストールすれば基本サイトをすぐに構築できます。その後、GitHub Pagesへのデプロイに進むこともできます。
>
> 例えばReimuテーマを使う場合：
>
> ```bash
cd themes
git clone https://github.com/D-Sketon/hexo-theme-reimu.git
```
