const { htmlTag } = require("hexo-util");

hexo.extend.helper.register("criticalCss", (content) => {
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
        return `<link rel="preload" href="${item}" as="style" onload="this.onload=null;this.rel='stylesheet'" media="print" onload="this.media='all'">`;
      } else {
        if (!item.href.endsWith(".css")) item.href += ".css";
        return htmlTag("link", {
          rel: "preload",
          as: "style",
          onload: "this.onload=null;this.rel='stylesheet';this.media='all'",
          media: "print",
          ...item,
        });
      }
    })
    .join("\n");
});

// 為 JavaScript 禁用時提供備用方案
hexo.extend.helper.register("criticalCssFallback", (content) => {
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
        return `<link rel="stylesheet" href="${item}">`;
      } else {
        if (!item.href.endsWith(".css")) item.href += ".css";
        return htmlTag("link", {
          rel: "stylesheet",
          ...item,
        });
      }
    })
    .join("\n");
}); 