import express from 'express';
import bodyparser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { User, UserArray } from './userObj';
import { Category, CatArray } from './categoryObj';
import { PostCategory, PostCatArray } from './postcategoryObj';
import { Comments, CommentArray } from './commentObj';
import { Post, PostArray } from './postObj';
import * as EmailValidator from 'email-validator';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


let app = express();

app.use(cors({credentials: true, origin: true}));
app.options('*', cors({credentials: true, origin: true}));

app.use(bodyparser.urlencoded({extended : false}));
app.use(cookieParser());

let currentUser = new User('', '', '', '', '');

app.get('/', (req, res, next)=>{
    res.sendFile(path.join(process.cwd(),'views','help.html'));
});

app.get('/Users', (req, res, next)=>{
    res.json(UserArray);
});

app.post('/Users', (req, res, next)=>{
    let newUser = new User(req.body.UserID, req.body.fName, req.body.lName, req.body.emailAddress, req.body.password);
    bcrypt.hash(newUser.password,10,(err,hash)=>{
        newUser.password = hash;
    })
    let comp = 0;
    if(UserArray.length > 0){
        for(let x = 0; x < UserArray.length; x++){
            var string1 = newUser.userId;
            var string2 = UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            res.status(409).send('This User ID is already being used, please try another one');
        }else{
            if(newUser.userId === ""){
                res.status(404).send('There must be a User ID, please try again');
            }else{
                UserArray.push(newUser);
                res.status(201).send(`${newUser.userId} has been added`);
            }
        }
    }else{
        if(newUser.userId === ""){
            res.status(404).send('There must be a User ID, please try again');
        }else if(newUser.fName === ""){
            res.status(404).send('There must be a First Name, please try again');
        }else if(newUser.lName === ""){
            res.status(404).send('There must be a Last Name, please try again');
        }else if(newUser.emailAddress === ""){
            res.status(404).send('There must be an Email Address, please try again');
        }else if(EmailValidator.validate(newUser.emailAddress) === false){
            res.status(404).send('Your Email Address must be a valid email (ex: test@email.com), please try again');
        }else if(newUser.password === ""){
            res.status(404).send('There must be a Password, please try again');
        }else{
            UserArray.push(newUser);
            res.status(201).send(`${newUser.userId} has been added`);
        }
    }
});

app.get('/Users/:userId', (req, res, next)=>{
    let comp = 0;
    let y = 0;
    if(UserArray.length > 0){
        for(let x = 0; x < UserArray.length; x++){
            var string1 = req.params.userId;
            var string2 = UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            res.status(200).send(UserArray[y]);
        }else{
            res.status(404).send('The user you are searching for does not exist');
        }
    }else{
        res.status(404).send('The user you are searching for does not exist');
    }
});

app.patch('/Users/:userId', (req, res, next)=>{
    let comp = 0;
    let y = 0;
    if(UserArray.length > 0){
        for(let x = 0; x < UserArray.length; x++){
            var string1 = req.params.userId;
            var string2 = UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    if(req.body.fName){
                        UserArray[y].fName = req.body.fName;
                    }
                    if(req.body.lName){
                        UserArray[y].lName = req.body.lName;
                    }
                    if(req.body.emailAddress){
                        if(EmailValidator.validate(req.body.emailAddress) === true){
                            UserArray[y].emailAddress = req.body.emailAddress;
                        }else{
                            res.status(404).send('Your Email Address must be a valid email (ex: test@email.com), please try again');
                        }
                    }
                    if(req.body.password){
                        UserArray[y].password = req.body.password;
                        bcrypt.hash(UserArray[y].password,10,(err,hash)=>{
                            UserArray[y].password = hash;
                        })
                    }
                    res.status(200).send(UserArray[y]);
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
        }else{
            res.status(404).send('The user you are trying to patch does not exist');
        }
    }else{
        res.status(404).send('The user you are trying to patch does not exist');
    }
});

app.delete('/Users/:userId', (req, res, next)=>{
    let comp = 0;
    let y = 0;
    if(UserArray.length > 0){
        for(let x = 0; x < UserArray.length; x++){
            var string1 = req.params.userId;
            var string2 = UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    UserArray.splice(y, 1);
                    res.status(204).send();
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
            
        }else{
            res.status(404).send('The user you are trying to delete does not exist');
        }
    }else{
        res.status(404).send('The user you are trying to delete does not exist');
    }
});

app.get('/Users/Posts/:userID', (req,res,next)=>{
    let comp = 0;
    let userPostArray : Post[]=[];
    if(PostArray.length > 0){
        for(let x = 0; x < PostArray.length; x++){
            var string1 = req.params.userID;
            var string2 = PostArray[x].userId;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                userPostArray.push(PostArray[x]);
            }
        }
    }else{
        res.status(404).send('The posts you are searching for do not exist');
    }
    res.json(userPostArray);
})

app.get('/Users/:userId/:password', (req,res,next)=>{
    let compUser = 0;
    let y = 0;
    if(UserArray.length > 0){
        for(let x = 0; x < UserArray.length; x++){
            var string1 = req.params.userId;
            var string2 = UserArray[x].userId;
            compUser = string1.localeCompare(string2);
            if(compUser === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(compUser === 0){
            return bcrypt.compare(req.params.password, UserArray[y].password).then((validPwd)=>{
                if(validPwd){
                    currentUser = UserArray[y];
                    let myToken = jwt.sign({user: req.params.userId}, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                    res.cookie('loggedintoken', myToken);
                    res.status(200).send('Logged in!');
                }else{
                    res.status(401).send('Incorrect Login');
                }
                
            })
        }else{
            res.status(401).send('Incorrect Login');
        }
    }
    else{
        res.status(401).send('Incorrect Login');
    }
    
})



app.get('/Posts',(req,res,next)=>
{
    res.json(PostArray);
})

app.get('/Posts/:postID',(req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(PostArray.length > 0){
        for(let x = 0; x < PostArray.length; x++){
            var string1 = req.params.postID;
            var string2 = PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            res.status(200).send(PostArray[y]);
        }else{
            res.status(404).send('The post you are searching for does not exist');
        }
    }else{
        res.status(404).send('The post you are searching for does not exist');
    }
})

let incrementalId = 1;
let updatedDate = new Date();

app.post('/Posts', (req,res,next)=>{
    if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
        let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try{
            let creationDate = new Date();
            let newPost = new Post(incrementalId, creationDate, req.body.title, req.body.content, currentUser.userId, req.body.headerImage, creationDate);
            if(newPost.title === ""){
                res.status(404).send('There must be a Title, please try again');
            }else if(newPost.content === ""){
                res.status(404).send('There must be Content in your Post, please try again');
            }else{
                PostArray.unshift(newPost);
                incrementalId++;
                res.status(201).send(`Your Post has been added`);
            }
        }
        catch{
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }else{
        res.status(401).send("Unauthorized User");
    }
    
})

app.patch('/Posts/:postID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(PostArray.length > 0){
        for(let x = 0; x < PostArray.length; x++){
            var string1 = req.params.postID;
            var string2 = PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    if(req.body.title){
                        PostArray[y].title = req.body.title;
                    }
                    if(req.body.content){
                        PostArray[y].content = req.body.content;
                    }
                    if(req.body.headerImage){
                        PostArray[y].headerImage = req.body.headerImage;
                    }
                    updatedDate = new Date();
                    PostArray[y].lastUpdated = updatedDate;
                    res.status(200).send(PostArray[y]);
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
        }else{
            res.status(404).send('The user you are trying to patch does not exist');
        }
    }else{
        res.status(404).send('The user you are trying to patch does not exist');
    }
})

app.delete('/Posts/:postID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(PostArray.length > 0){
        for(let x = 0; x < PostArray.length; x++){
            var string1 = req.params.postID;
            var string2 = PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    PostArray.splice(y, 1);
                    res.status(204).send();
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
            
        }else{
            res.status(404).send('The post you are trying to delete does not exist');
        }
    }else{
        res.status(404).send('The post you are trying to delete does not exist');
    }
})


app.get('/Categories',(req,res,next)=>
{
    res.json(CatArray);
})

app.get('/Categories/:categoryId',(req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(CatArray.length > 0){
        for(let x = 0; x < CatArray.length; x++){
            var string1 = req.params.categoryId;
            var string2 = CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            res.status(200).send(CatArray[y]);
        }else{
            res.status(404).send('The category you are searching for does not exist');
        }
    }else{
        res.status(404).send('The category you are searching for does not exist');
    }
})

let incrementalCatId = 1;
app.post('/Categories', (req,res,next)=>{
    if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
        let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try{
            let newCat = new Category(incrementalCatId, req.body.name, req.body.description);
            if(newCat.name === ""){
                res.status(404).send('There must be a Name, please try again');
            }else if(newCat.description === ""){
                res.status(404).send('There must be a Description in your Post, please try again');
            }else{
                CatArray.push(newCat);
                incrementalCatId++;
                res.status(201).send(`Your Category has been added`);
            }
        }
        catch{
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }else{
        res.status(401).send("Unauthorized User");
    }
    
})

app.patch('/Categories/:categoryID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(CatArray.length > 0){
        for(let x = 0; x < CatArray.length; x++){
            var string1 = req.params.categoryID;
            var string2 = CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    if(req.body.name){
                        CatArray[y].name = req.body.name;
                    }
                    if(req.body.description){
                        CatArray[y].description = req.body.description;
                    }
                    res.status(200).send(CatArray[y]);
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
        }else{
            res.status(404).send('The category you are trying to patch does not exist');
        }
    }else{
        res.status(404).send('The category you are trying to patch does not exist');
    }
})

app.delete('/Categories/:categoryID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(CatArray.length > 0){
        for(let x = 0; x < CatArray.length; x++){
            var string1 = req.params.categoryID;
            var string2 = CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                y = x;
                break;
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    CatArray.splice(y, 1);
                    res.status(204).send();
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
            
        }else{
            res.status(404).send('The category you are trying to delete does not exist');
        }
    }else{
        res.status(404).send('The category you are trying to delete does not exist');
    }
})

app.get('/PostCategory/:postID',(req,res,next)=>
{
    let comp = 0;
    let postCategoriesArray : PostCategory[]=[];
    if(PostCatArray.length > 0){
        for(let x = 0; x < PostCatArray.length; x++){
            var string1 = req.params.postID;
            var string2 = PostCatArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                postCategoriesArray.push(PostCatArray[x]);
            }
        }
    }else{
        res.status(404).send('This post currently has no categories');
    }
    res.json(postCategoriesArray);
})

app.get('/PostCategory/Posts/:categoryID',(req,res,next)=>{
    let comp = 0;
    let categoryPostsArray : PostCategory[]=[];
    if(PostCatArray.length > 0){
        for(let x = 0; x < PostCatArray.length; x++){
            var string1 = req.params.categoryID;
            var string2 = PostCatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                categoryPostsArray.push(PostCatArray[x]);
            }
        }
    }else{
        res.status(404).send('This category currently has no posts');
    }
    res.json(categoryPostsArray);
})

app.post('/PostCategory/:postID/:categoryID', (req,res,next)=>{
    if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
        let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try{
            let newPostCat = new PostCategory(Number(req.params.categoryID), Number(req.params.postID));
            if(newPostCat.postId.toString() === ''){
                res.status(404).send('The post you are referring to does not exist, please try again');
            }else if(newPostCat.categoryId.toString() === ""){
                res.status(404).send('The category you are referring to does not exist, please try again')
            }else{
                PostCatArray.push(newPostCat);
                incrementalComId++;
                res.status(201).send(`Your Post Category has been created`);
            }
        }
        catch{
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }else{
        res.status(401).send("Unauthorized User");
    }
})

app.delete('/PostCategory/:postID/:categoryID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(PostCatArray.length > 0){
        for(let x = 0; x < PostCatArray.length; x++){
            var string1 = req.params.postID;
            var string2 = PostCatArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                var string1 = req.params.categoryID;
                var string2 = PostCatArray[x].categoryId.toString();
                comp = string1.localeCompare(string2);
                if(comp === 0){
                    y = x;
                    break;
                }else{
                    continue;
                }
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    PostCatArray.splice(y, 1);
                    res.status(204).send();
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
            
        }else{
            res.status(404).send('The post category you are trying to delete does not exist');
        }
    }else{
        res.status(404).send('The post category you are trying to delete does not exist');
    }
})

app.get('/Comments/:postID',(req,res,next)=>{
    let comp = 0;
    let postCommentsArray : Comments[]=[];
    if(CommentArray.length > 0){
        for(let x = 0; x < CommentArray.length; x++){
            var string1 = req.params.postID;
            var string2 = CommentArray[x].postID;
            comp = string1.localeCompare(string2);
            if(comp === 0){
                postCommentsArray.push(CommentArray[x]);
            }
        }
    }else{
        res.status(404).send('This post currently has no comments');
    }
    res.json(postCommentsArray);
})

let incrementalComId = 1;

app.post('/Comments/:postID',(req,res,next)=>{
    if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
        let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try{
            let currentDate = new Date();
            let newCom = new Comments(incrementalComId, req.body.comment, currentUser.userId, req.params.postID, currentDate);
            if(newCom.comment === ""){
                res.status(404).send('Your Comment must have Content, please try again');
            }else if(newCom.postID === ""){
                res.status(404).send('You must select a Post to leave a comment on, please try again')
            }else{
                CommentArray.push(newCom);
                incrementalComId++;
                res.status(201).send(`Your Comment has been added`);
            }
        }
        catch{
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }else{
        res.status(401).send("Unauthorized User");
    }
})

app.patch('/Comments/:postID/:commentID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(CommentArray.length > 0){
        for(let x = 0; x < CommentArray.length; x++){
            var string1 = req.params.postID;
            var string2 = CommentArray[x].postID.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                var string1 = req.params.commentID;
                var string2 = CommentArray[x].commentId.toString();
                comp = string1.localeCompare(string2);
                if(comp === 0){
                    y = x;
                    break;
                }else{
                    continue;
                }
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    if(req.body.comment){
                        CommentArray[y].comment = req.body.comment;
                    }
                    res.status(200).send(CommentArray[y]);
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
        }else{
            res.status(404).send('The comment you are trying to patch does not exist');
        }
    }else{
        res.status(404).send('The post you are looking for does not exist');
    }
})

app.delete('/Comments/:postID/:commentID', (req,res,next)=>{
    let comp = 0;
    let y = 0;
    if(CommentArray.length > 0){
        for(let x = 0; x < CommentArray.length; x++){
            var string1 = req.params.postID;
            var string2 = CommentArray[x].postID.toString();
            comp = string1.localeCompare(string2);
            if(comp === 0){
                var string1 = req.params.commentID;
                var string2 = CommentArray[x].commentId.toString();
                comp = string1.localeCompare(string2);
                if(comp === 0){
                    y = x;
                    break;
                }else{
                    continue;
                }
            }else{
                continue;
            }
        }
        if(comp === 0){
            if(req.cookies.loggedintoken && req.cookies.loggedintoken != undefined){
                let token = jwt.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try{
                    CommentArray.splice(y, 1);
                    res.status(204).send();
                }
                catch{
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
                
            }else{
                res.status(401).send('Unauthorized User');
            }
            
        }else{
            res.status(404).send('The comment you are trying to delete does not exist');
        }
    }else{
        res.status(404).send('The post you are looking for does not exist');
    }
})

app.get('/Comments/:postID/:commentID',(req,res,next)=>{
    let compPost = 0;
    let compComm = 0;
    let y = 0;
    if(CommentArray.length > 0){
        for(let x = 0; x < CommentArray.length; x++){
            var string1 = req.params.postID;
            var string2 = CommentArray[x].postID;
            compPost = string1.localeCompare(string2);
            if(compPost === 0){
                var string1 = req.params.commentID;
                var string2 = CommentArray[x].commentId.toString();
                compComm = string1.localeCompare(string2);
                if(compComm === 0){
                    y = x;
                    break;
                }else{
                    continue;
                }
            }else{
                continue;
            }
        }
        if(compComm === 0){
            res.status(200).send(CommentArray[y]);
        }else{
            res.status(404).send('The comment you are searching for does not exist');
        }
    }else{
        res.status(404).send('The comment you are searching for does not exist');
    }
})

app.use('/',(req,res,next)=>
{
    res.redirect('/');
});



app.listen(3000);