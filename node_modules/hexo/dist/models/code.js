"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const warehouse_1 = __importDefault(require("warehouse"));
const path_1 = require("path");
module.exports = (ctx) => {
    const Code = new warehouse_1.default.Schema({
        _id: { type: String, required: true },
        path: { type: String, required: true },
        slug: { type: String, required: true },
        modified: { type: Boolean, default: true },
        content: { type: String, default: '' }
    });
    Code.virtual('source').get(function () {
        return (0, path_1.join)(ctx.base_dir, this._id);
    });
    return Code;
};
//# sourceMappingURL=code.js.map