# @reimujs/hexo-renderer-markdown-it-plus

This renderer plugin uses Markdown-it as a render engine on Hexo.

This renderer plugin is forked from [hexo-renderer-markdown-it-plus](https://github.com/CHENXCHEN/hexo-renderer-markdown-it-plus), designed for [hexo-theme-reimu](https://github.com/D-Sketon/hexo-theme-reimu).

The highlight.js has been removed, the KaTeX version has been upgraded, and the client-side rendering of LaTeX formulas is supported.

## Main Features
+ Support for Markdown
+ Extensive configuration
+ Faster than the default renderer | hexo-renderer-marked
+ [sub](https://www.npmjs.com/package/markdown-it-sub), `H~2~0` H<sub>2</sub>0
+ [sup](https://www.npmjs.com/package/markdown-it-sup), `x^2^` x<sup>2</sup>
+ [ins](https://www.npmjs.com/package/markdown-it-ins), `++Inserted++` <ins>Inserted</ins>, `~~Del~~` <s>Del</s>
+ [Katex](https://www.npmjs.com/package/@vscode/markdown-it-katex), [referer](https://github.com/Khan/KaTeX)
+ [emoji](https://www.npmjs.com/package/markdown-it-emoji), [referer](https://www.webpagefx.com/tools/emoji-cheat-sheet/)
+ [toc&anchor](https://www.npmjs.com/package/markdown-it-toc-and-anchor) `@[toc]`
+ [deflist](http://pandoc.org/MANUAL.html#definition-lists)
+ [abbr](https://www.npmjs.com/package/markdown-it-abbr)
+ [footnote](https://www.npmjs.com/package/markdown-it-footnote)
+ [mark](https://www.npmjs.com/package/markdown-it-mark)
+ [container](https://www.npmjs.com/package/markdown-it-container)

## Install
```shell
npm un hexo-renderer-marked --save
npm i @reimujs/hexo-renderer-markdown-it-plus --save
```

## Options
Configuring the renderer is a fairly simple task because all the settings are in the main hexo `_config.yml` file. You just need to open it in your favourite text editor and write down your configuration.

```yml
markdown_it_plus:
    html: true
    xhtmlOut: true
    breaks: true
    langPrefix:
    linkify: true
    typographer:
    quotes: “”‘’
    rawLaTeX: false # newly added
```

## Katex

Katex plugin is enabled by default. However, this renderer alone does not work out of the box for mathematical formulas to display correctly on your website. Therefore, you do not need to do anything if you do not want to use Katex. Otherwise, if you want to use katex, you must add this css style to your website:
`https://npm.webcache.cn/katex@0.16.11/dist/katex.min.css`

## Advanced Options
The markdown-it plugins listed above is enabled by default. If you want to disable any plugin, see the configuration example below:
```yml
markdown_it_plus:
    html: true
    xhtmlOut: true
    breaks: true
    langPrefix:
    linkify: true
    typographer:
    quotes: “”‘’
    rawLaTeX: false
    plugins:
        - plugin:
            name: markdown-it-mark
            enable: false
```
plugins enabled by default:
 + `markdown-it-emoji`  
 + `markdown-it-sub`  
 + `markdown-it-sup`  
 + `markdown-it-deflist`  
 + `markdown-it-abbr`  
 + `markdown-it-footnote`  
 + `markdown-it-ins`  
 + `markdown-it-mark`  
 + `@vscode/markdown-it-katex`  
 + `markdown-it-toc-and-anchor`  
 + `markdown-it-container`

## Add other `markdown-it` Plugins
If you want to add a plugin named as `markdown-it-something`:  

1.Install this plugin
```javascript
npm install markdown-it-something --save
```

2.config main hexo `_config.yml`
```yml
markdown_it_plus:
    # ...
    plugins:
        - plugin:
            name: markdown-it-something
            enable: true
            options:
                # this is plugin option
```
