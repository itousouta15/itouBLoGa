"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bluebird_1 = __importDefault(require("bluebird"));
const hexo_fs_1 = require("hexo-fs");
function codeGenerator() {
    return bluebird_1.default.filter(this.model('Code').toArray(), (code) => (0, hexo_fs_1.exists)(code.source).tap(exist => {
        if (!exist)
            return code.remove();
    })).map((code) => {
        const { path } = code;
        const data = {
            modified: code.modified,
            data: code.content
        };
        return { path, data };
    });
}
module.exports = codeGenerator;
//# sourceMappingURL=code.js.map