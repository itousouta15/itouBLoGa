// Migrated articles keep the same urlname on itousouta.me.
hexo.extend.helper.register('writing_url', function(post) {
  if (post.link) return post.link;
  return post.urlname
    ? `https://itousouta.me/writing/${encodeURIComponent(post.urlname)}`
    : null;
});
