class Category{
    categoryId : number = 0;
    name : string = '';
    description : string = '';

    constructor(categoryId: number, name: string, description: string){
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
    }
}

const CatArray:Category[]=[];

export {Category}
export {CatArray}