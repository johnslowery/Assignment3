class Post{
    postId: number = 0;
    createdDate: Date | undefined;
    title: string='';
    content: string='';
    userId: string='';
    headerImage: string='';
    lastUpdated: Date | undefined;
    constructor(postId: number, createdDate: Date, title: string, content: string, userId: string, headerImage: string, lastUpdated: Date){
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
}

const PostArray:Post[]=[];
const UserPostArray:Post[]=[];

export {Post}
export {PostArray}