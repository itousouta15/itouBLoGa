"use strict";
let NEED_INJECT = true;
let HAS_CHECKED = false;
let META_GENERATOR_TAG;
function hexoMetaGeneratorInject(data) {
    if (!NEED_INJECT)
        return;
    if (!HAS_CHECKED) {
        HAS_CHECKED = true;
        if (!this.config.meta_generator
            || data.match(/<meta\s+(?:[^<>/]+\s)?name=['"]generator['"]/i)) {
            NEED_INJECT = false;
            return;
        }
    }
    META_GENERATOR_TAG = META_GENERATOR_TAG || `<meta name="generator" content="Hexo ${this.version}">`;
    return data.replace('</head>', `${META_GENERATOR_TAG}</head>`);
}
module.exports = hexoMetaGeneratorInject;
//# sourceMappingURL=meta_generator.js.map