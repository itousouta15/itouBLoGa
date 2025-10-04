const fs = require('fs');
const path = require('path');

// 內聯關鍵 CSS
hexo.extend.helper.register("inlineCriticalCSS", (cssPath) => {
  try {
    const fullPath = path.join(hexo.theme_dir, 'source', cssPath);
    if (fs.existsSync(fullPath)) {
      const cssContent = fs.readFileSync(fullPath, 'utf8');
      return `<style>${cssContent}</style>`;
    }
  } catch (error) {
    hexo.log.warn(`Failed to inline CSS: ${cssPath}`, error);
  }
  return '';
});

// 延遲載入非關鍵 CSS
hexo.extend.helper.register("deferCSS", (content) => {
  if (!Array.isArray(content)) {
    content = [content];
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        let path = item;
        if (!path.endsWith(".css")) {
          path += ".css";
        }
        return `<link rel="preload" href="${item}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
      } else {
        if (!item.href.endsWith(".css")) item.href += ".css";
        return `<link rel="preload" href="${item.href}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
      }
    })
    .join("\n");
}); 