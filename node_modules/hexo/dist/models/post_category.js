"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const warehouse_1 = __importDefault(require("warehouse"));
module.exports = (ctx) => {
    const PostCategory = new warehouse_1.default.Schema({
        post_id: { type: warehouse_1.default.Schema.Types.CUID, ref: 'Post' },
        category_id: { type: warehouse_1.default.Schema.Types.CUID, ref: 'Category' }
    });
    PostCategory.pre('save', data => {
        ctx._binaryRelationIndex.post_category.removeHook(data);
        return data;
    });
    PostCategory.post('save', data => {
        ctx._binaryRelationIndex.post_category.saveHook(data);
        return data;
    });
    PostCategory.pre('remove', data => {
        ctx._binaryRelationIndex.post_category.removeHook(data);
        return data;
    });
    return PostCategory;
};
//# sourceMappingURL=post_category.js.map