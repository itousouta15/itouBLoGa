module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [
        './public/**/*.html', // 產生後的所有 HTML
        './public/**/*.js'    // 若有動態 class
      ],
      safelist: {
        standard: [/^hljs/, /^aos/, /^fa/, /^icon/, /^aplayer/, /^mermaid/], // 依實際需求保留
        deep: [],
        greedy: []
      }
    })
  ]
}