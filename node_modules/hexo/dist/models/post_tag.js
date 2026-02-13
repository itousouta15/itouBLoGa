"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const warehouse_1 = __importDefault(require("warehouse"));
module.exports = (ctx) => {
    const PostTag = new warehouse_1.default.Schema({
        post_id: { type: warehouse_1.default.Schema.Types.CUID, ref: 'Post' },
        tag_id: { type: warehouse_1.default.Schema.Types.CUID, ref: 'Tag' }
    });
    PostTag.pre('save', data => {
        ctx._binaryRelationIndex.post_tag.removeHook(data);
        return data;
    });
    PostTag.post('save', data => {
        ctx._binaryRelationIndex.post_tag.saveHook(data);
        return data;
    });
    PostTag.pre('remove', data => {
        ctx._binaryRelationIndex.post_tag.removeHook(data);
        return data;
    });
    return PostTag;
};
//# sourceMappingURL=post_tag.js.map