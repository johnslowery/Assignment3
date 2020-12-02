"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentArray = exports.Comments = void 0;
var Comments = /** @class */ (function () {
    function Comments(commentId, comment, userId, postID, commentDate) {
        this.commentId = 0;
        this.comment = '';
        this.userId = '';
        this.postID = '';
        this.commentId = commentId;
        this.comment = comment;
        this.userId = userId;
        this.postID = postID;
        this.commentDate = commentDate;
    }
    return Comments;
}());
exports.Comments = Comments;
var CommentArray = [];
exports.CommentArray = CommentArray;
