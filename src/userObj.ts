class User{
    userId: string="";
    fName: string="";
    lName: string="";
    emailAddress: string="";
    password: string="";
    constructor(userId:string, fName:string, lName:string, emailAddress:string, password:string){
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
}

const UserArray:User[]=[];

export {User}
export{UserArray}