const { htmlTag } = require("hexo-util");

// DNS 預解析
hexo.extend.helper.register("dnsPrefetch", (domains) => {
  if (!Array.isArray(domains)) {
    domains = [domains];
  }

  return domains
    .map((domain) => {
      return htmlTag("link", {
        rel: "dns-prefetch",
        href: domain,
      });
    })
    .join("\n");
});

// 預連接
hexo.extend.helper.register("preconnect", (domains) => {
  if (!Array.isArray(domains)) {
    domains = [domains];
  }

  return domains
    .map((domain) => {
      return htmlTag("link", {
        rel: "preconnect",
        href: domain,
        crossorigin: "anonymous",
      });
    })
    .join("\n");
});

// 關鍵資源預載入
hexo.extend.helper.register("preloadCritical", (resources) => {
  if (!Array.isArray(resources)) {
    resources = [resources];
  }

  return resources
    .map((resource) => {
      const { href, as, type, crossorigin } = resource;
      return htmlTag("link", {
        rel: "preload",
        href,
        as,
        type,
        crossorigin,
      });
    })
    .join("\n");
}); 