"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCatArray = exports.PostCategory = void 0;
var PostCategory = /** @class */ (function () {
    function PostCategory(categoryId, postId) {
        this.categoryId = 0;
        this.postId = 0;
        this.categoryId = categoryId;
        this.postId = postId;
    }
    return PostCategory;
}());
exports.PostCategory = PostCategory;
var PostCatArray = [];
exports.PostCatArray = PostCatArray;
