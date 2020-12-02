class Comments{
    commentId: number = 0;
    comment: string = '';
    userId: string = '';
    postID: string = '';
    commentDate: Date | undefined;

    constructor(commentId: number, comment: string, userId: string, postID: string, commentDate: Date){
        this.commentId = commentId;
        this.comment = comment;
        this.userId = userId;
        this.postID = postID;
        this.commentDate = commentDate;
    }
}

const CommentArray:Comments[]=[];

export {Comments}
export {CommentArray}