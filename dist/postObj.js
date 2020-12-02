"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostArray = exports.Post = void 0;
var Post = /** @class */ (function () {
    function Post(postId, createdDate, title, content, userId, headerImage, lastUpdated) {
        this.postId = 0;
        this.title = '';
        this.content = '';
        this.userId = '';
        this.headerImage = '';
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
    return Post;
}());
exports.Post = Post;
var PostArray = [];
exports.PostArray = PostArray;
var UserPostArray = [];
