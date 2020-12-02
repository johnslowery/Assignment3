class PostCategory{
    categoryId : number = 0;
    postId : number = 0;

    constructor(categoryId: number, postId: number){
        this.categoryId = categoryId;
        this.postId = postId;
    }
}

const PostCatArray:PostCategory[]=[];

export {PostCategory}
export {PostCatArray}