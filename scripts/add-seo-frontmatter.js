/**
 * Hexo Script: 自動為文章添加 SEO 相關的 Front Matter
 * 
 * 使用方法：
 * 1. 將此檔案放在 scripts/ 目錄下
 * 2. Hexo 會在生成網站時自動執行
 * 3. 為沒有 description 的文章自動生成描述
 */

hexo.extend.filter.register('before_post_render', function(data) {
  // 如果文章沒有 description，從內容中提取前 160 字元
  if (!data.description && data.content) {
    // 移除 Markdown 語法和 HTML 標籤
    let plainText = data.content
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除圖片
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除連結，保留文字
      .replace(/#{1,6}\s/g, '') // 移除標題符號
      .replace(/[*_~`]/g, '') // 移除格式符號
      .replace(/<[^>]+>/g, '') // 移除 HTML 標籤
      .replace(/\n+/g, ' ') // 將換行替換為空格
      .trim();
    
    // 提取前 160 字元作為描述
    data.description = plainText.substring(0, 160);
    if (plainText.length > 160) {
      data.description += '...';
    }
  }
  
  // 如果沒有 keywords，從 tags 生成
  if (!data.keywords && data.tags && data.tags.length > 0) {
    data.keywords = data.tags.map(tag => tag.name).join(',');
  }
  
  // 確保有 canonical URL
  if (!data.canonical && hexo.config.url) {
    data.canonical = hexo.config.url + '/' + data.path;
  }
  
  return data;
});

/**
 * 為頁面添加結構化數據（JSON-LD）
 */
hexo.extend.filter.register('after_render:html', function(str, data) {
  // 只處理文章頁面
  if (data.page && data.page.layout === 'post') {
    const config = hexo.config;
    const page = data.page;
    
    // 構建結構化數據
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": page.title,
      "description": page.description || page.excerpt || '',
      "author": {
        "@type": "Person",
        "name": config.author || "Unknown"
      },
      "datePublished": page.date ? page.date.toISOString() : '',
      "dateModified": page.updated ? page.updated.toISOString() : page.date.toISOString(),
      "publisher": {
        "@type": "Organization",
        "name": config.title || "Blog",
        "logo": {
          "@type": "ImageObject",
          "url": config.url + "/images/avatar.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": config.url + '/' + page.path
      }
    };
    
    // 如果有封面圖片，添加到結構化數據
    if (page.cover) {
      structuredData.image = config.url + page.cover;
    }
    
    // 如果有關鍵字，添加到結構化數據
    if (page.keywords) {
      structuredData.keywords = Array.isArray(page.keywords) 
        ? page.keywords.join(',') 
        : page.keywords;
    }
    
    // 將結構化數據插入到 </head> 之前
    const jsonLd = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
    str = str.replace('</head>', jsonLd + '\n</head>');
  }
  
  return str;
});

console.log('SEO Front Matter Script Loaded!');
