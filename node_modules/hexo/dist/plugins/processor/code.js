"use strict";
const hexo_util_1 = require("hexo-util");
const path_1 = require("path");
module.exports = (ctx) => {
    let codeDir = ctx.config.code_dir;
    if (!codeDir.endsWith('/'))
        codeDir += '/';
    return {
        pattern: new hexo_util_1.Pattern(path => {
            return path.startsWith(codeDir);
        }),
        process: function codeProcessor(file) {
            const id = (0, path_1.relative)(ctx.base_dir, file.source).replace(/\\/g, '/');
            const slug = (0, path_1.relative)(ctx.config.source_dir, id).replace(/\\/g, '/');
            const Code = ctx.model('Code');
            const doc = Code.findById(id);
            if (file.type === 'delete') {
                if (doc) {
                    return doc.remove();
                }
                return;
            }
            if (file.type === 'skip' && doc) {
                return;
            }
            console.log("=== hoge fuga");
            return file.read().then(content => {
                return Code.save({
                    _id: id,
                    path: file.path,
                    slug,
                    modified: file.type !== 'skip',
                    content
                });
            });
        }
    };
};
//# sourceMappingURL=code.js.map