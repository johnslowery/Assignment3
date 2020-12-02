"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var userObj_1 = require("./userObj");
var categoryObj_1 = require("./categoryObj");
var postcategoryObj_1 = require("./postcategoryObj");
var commentObj_1 = require("./commentObj");
var postObj_1 = require("./postObj");
var EmailValidator = __importStar(require("email-validator"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var app = express_1.default();
app.use(cors_1.default({ credentials: true, origin: true }));
app.options('*', cors_1.default({ credentials: true, origin: true }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
var currentUser = new userObj_1.User('', '', '', '', '');
app.get('/', function (req, res, next) {
    res.sendFile(path_1.default.join(process.cwd(), 'views', 'help.html'));
});
app.get('/Users', function (req, res, next) {
    res.json(userObj_1.UserArray);
});
app.post('/Users', function (req, res, next) {
    var newUser = new userObj_1.User(req.body.UserID, req.body.fName, req.body.lName, req.body.emailAddress, req.body.password);
    bcrypt_1.default.hash(newUser.password, 10, function (err, hash) {
        newUser.password = hash;
    });
    var comp = 0;
    if (userObj_1.UserArray.length > 0) {
        for (var x = 0; x < userObj_1.UserArray.length; x++) {
            var string1 = newUser.userId;
            var string2 = userObj_1.UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            res.status(409).send('This User ID is already being used, please try another one');
        }
        else {
            if (newUser.userId === "") {
                res.status(404).send('There must be a User ID, please try again');
            }
            else {
                userObj_1.UserArray.push(newUser);
                res.status(201).send(newUser.userId + " has been added");
            }
        }
    }
    else {
        if (newUser.userId === "") {
            res.status(404).send('There must be a User ID, please try again');
        }
        else if (newUser.fName === "") {
            res.status(404).send('There must be a First Name, please try again');
        }
        else if (newUser.lName === "") {
            res.status(404).send('There must be a Last Name, please try again');
        }
        else if (newUser.emailAddress === "") {
            res.status(404).send('There must be an Email Address, please try again');
        }
        else if (EmailValidator.validate(newUser.emailAddress) === false) {
            res.status(404).send('Your Email Address must be a valid email (ex: test@email.com), please try again');
        }
        else if (newUser.password === "") {
            res.status(404).send('There must be a Password, please try again');
        }
        else {
            userObj_1.UserArray.push(newUser);
            res.status(201).send(newUser.userId + " has been added");
        }
    }
});
app.get('/Users/:userId', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (userObj_1.UserArray.length > 0) {
        for (var x = 0; x < userObj_1.UserArray.length; x++) {
            var string1 = req.params.userId;
            var string2 = userObj_1.UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            res.status(200).send(userObj_1.UserArray[y]);
        }
        else {
            res.status(404).send('The user you are searching for does not exist');
        }
    }
    else {
        res.status(404).send('The user you are searching for does not exist');
    }
});
app.patch('/Users/:userId', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (userObj_1.UserArray.length > 0) {
        for (var x = 0; x < userObj_1.UserArray.length; x++) {
            var string1 = req.params.userId;
            var string2 = userObj_1.UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    if (req.body.fName) {
                        userObj_1.UserArray[y].fName = req.body.fName;
                    }
                    if (req.body.lName) {
                        userObj_1.UserArray[y].lName = req.body.lName;
                    }
                    if (req.body.emailAddress) {
                        if (EmailValidator.validate(req.body.emailAddress) === true) {
                            userObj_1.UserArray[y].emailAddress = req.body.emailAddress;
                        }
                        else {
                            res.status(404).send('Your Email Address must be a valid email (ex: test@email.com), please try again');
                        }
                    }
                    if (req.body.password) {
                        userObj_1.UserArray[y].password = req.body.password;
                        bcrypt_1.default.hash(userObj_1.UserArray[y].password, 10, function (err, hash) {
                            userObj_1.UserArray[y].password = hash;
                        });
                    }
                    res.status(200).send(userObj_1.UserArray[y]);
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The user you are trying to patch does not exist');
        }
    }
    else {
        res.status(404).send('The user you are trying to patch does not exist');
    }
});
app.delete('/Users/:userId', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (userObj_1.UserArray.length > 0) {
        for (var x = 0; x < userObj_1.UserArray.length; x++) {
            var string1 = req.params.userId;
            var string2 = userObj_1.UserArray[x].userId;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    userObj_1.UserArray.splice(y, 1);
                    res.status(204).send();
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The user you are trying to delete does not exist');
        }
    }
    else {
        res.status(404).send('The user you are trying to delete does not exist');
    }
});
app.get('/Users/Posts/:userID', function (req, res, next) {
    var comp = 0;
    var userPostArray = [];
    if (postObj_1.PostArray.length > 0) {
        for (var x = 0; x < postObj_1.PostArray.length; x++) {
            var string1 = req.params.userID;
            var string2 = postObj_1.PostArray[x].userId;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                userPostArray.push(postObj_1.PostArray[x]);
            }
        }
    }
    else {
        res.status(404).send('The posts you are searching for do not exist');
    }
    res.json(userPostArray);
});
app.get('/Users/:userId/:password', function (req, res, next) {
    var compUser = 0;
    var y = 0;
    if (userObj_1.UserArray.length > 0) {
        for (var x = 0; x < userObj_1.UserArray.length; x++) {
            var string1 = req.params.userId;
            var string2 = userObj_1.UserArray[x].userId;
            compUser = string1.localeCompare(string2);
            if (compUser === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (compUser === 0) {
            return bcrypt_1.default.compare(req.params.password, userObj_1.UserArray[y].password).then(function (validPwd) {
                if (validPwd) {
                    currentUser = userObj_1.UserArray[y];
                    var myToken = jsonwebtoken_1.default.sign({ user: req.params.userId }, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                    res.cookie('loggedintoken', myToken);
                    res.status(200).send('Logged in!');
                }
                else {
                    res.status(401).send('Incorrect Login');
                }
            });
        }
        else {
            res.status(401).send('Incorrect Login');
        }
    }
    else {
        res.status(401).send('Incorrect Login');
    }
});
app.get('/Posts', function (req, res, next) {
    res.json(postObj_1.PostArray);
});
app.get('/Posts/:postID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (postObj_1.PostArray.length > 0) {
        for (var x = 0; x < postObj_1.PostArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = postObj_1.PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            res.status(200).send(postObj_1.PostArray[y]);
        }
        else {
            res.status(404).send('The post you are searching for does not exist');
        }
    }
    else {
        res.status(404).send('The post you are searching for does not exist');
    }
});
var incrementalId = 1;
var updatedDate = new Date();
app.post('/Posts', function (req, res, next) {
    if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
        var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try {
            var creationDate = new Date();
            var newPost = new postObj_1.Post(incrementalId, creationDate, req.body.title, req.body.content, currentUser.userId, req.body.headerImage, creationDate);
            if (newPost.title === "") {
                res.status(404).send('There must be a Title, please try again');
            }
            else if (newPost.content === "") {
                res.status(404).send('There must be Content in your Post, please try again');
            }
            else {
                postObj_1.PostArray.unshift(newPost);
                incrementalId++;
                res.status(201).send("Your Post has been added");
            }
        }
        catch (_a) {
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }
    else {
        res.status(401).send("Unauthorized User");
    }
});
app.patch('/Posts/:postID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (postObj_1.PostArray.length > 0) {
        for (var x = 0; x < postObj_1.PostArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = postObj_1.PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    if (req.body.title) {
                        postObj_1.PostArray[y].title = req.body.title;
                    }
                    if (req.body.content) {
                        postObj_1.PostArray[y].content = req.body.content;
                    }
                    if (req.body.headerImage) {
                        postObj_1.PostArray[y].headerImage = req.body.headerImage;
                    }
                    updatedDate = new Date();
                    postObj_1.PostArray[y].lastUpdated = updatedDate;
                    res.status(200).send(postObj_1.PostArray[y]);
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The user you are trying to patch does not exist');
        }
    }
    else {
        res.status(404).send('The user you are trying to patch does not exist');
    }
});
app.delete('/Posts/:postID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (postObj_1.PostArray.length > 0) {
        for (var x = 0; x < postObj_1.PostArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = postObj_1.PostArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    postObj_1.PostArray.splice(y, 1);
                    res.status(204).send();
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The post you are trying to delete does not exist');
        }
    }
    else {
        res.status(404).send('The post you are trying to delete does not exist');
    }
});
app.get('/Categories', function (req, res, next) {
    res.json(categoryObj_1.CatArray);
});
app.get('/Categories/:categoryId', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (categoryObj_1.CatArray.length > 0) {
        for (var x = 0; x < categoryObj_1.CatArray.length; x++) {
            var string1 = req.params.categoryId;
            var string2 = categoryObj_1.CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            res.status(200).send(categoryObj_1.CatArray[y]);
        }
        else {
            res.status(404).send('The category you are searching for does not exist');
        }
    }
    else {
        res.status(404).send('The category you are searching for does not exist');
    }
});
var incrementalCatId = 1;
app.post('/Categories', function (req, res, next) {
    if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
        var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try {
            var newCat = new categoryObj_1.Category(incrementalCatId, req.body.name, req.body.description);
            if (newCat.name === "") {
                res.status(404).send('There must be a Name, please try again');
            }
            else if (newCat.description === "") {
                res.status(404).send('There must be a Description in your Post, please try again');
            }
            else {
                categoryObj_1.CatArray.push(newCat);
                incrementalCatId++;
                res.status(201).send("Your Category has been added");
            }
        }
        catch (_a) {
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }
    else {
        res.status(401).send("Unauthorized User");
    }
});
app.patch('/Categories/:categoryID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (categoryObj_1.CatArray.length > 0) {
        for (var x = 0; x < categoryObj_1.CatArray.length; x++) {
            var string1 = req.params.categoryID;
            var string2 = categoryObj_1.CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    if (req.body.name) {
                        categoryObj_1.CatArray[y].name = req.body.name;
                    }
                    if (req.body.description) {
                        categoryObj_1.CatArray[y].description = req.body.description;
                    }
                    res.status(200).send(categoryObj_1.CatArray[y]);
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The category you are trying to patch does not exist');
        }
    }
    else {
        res.status(404).send('The category you are trying to patch does not exist');
    }
});
app.delete('/Categories/:categoryID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (categoryObj_1.CatArray.length > 0) {
        for (var x = 0; x < categoryObj_1.CatArray.length; x++) {
            var string1 = req.params.categoryID;
            var string2 = categoryObj_1.CatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                y = x;
                break;
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    categoryObj_1.CatArray.splice(y, 1);
                    res.status(204).send();
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The category you are trying to delete does not exist');
        }
    }
    else {
        res.status(404).send('The category you are trying to delete does not exist');
    }
});
app.get('/PostCategory/:postID', function (req, res, next) {
    var comp = 0;
    var postCategoriesArray = [];
    if (postcategoryObj_1.PostCatArray.length > 0) {
        for (var x = 0; x < postcategoryObj_1.PostCatArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = postcategoryObj_1.PostCatArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                postCategoriesArray.push(postcategoryObj_1.PostCatArray[x]);
            }
        }
    }
    else {
        res.status(404).send('This post currently has no categories');
    }
    res.json(postCategoriesArray);
});
app.get('/PostCategory/Posts/:categoryID', function (req, res, next) {
    var comp = 0;
    var categoryPostsArray = [];
    if (postcategoryObj_1.PostCatArray.length > 0) {
        for (var x = 0; x < postcategoryObj_1.PostCatArray.length; x++) {
            var string1 = req.params.categoryID;
            var string2 = postcategoryObj_1.PostCatArray[x].categoryId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                categoryPostsArray.push(postcategoryObj_1.PostCatArray[x]);
            }
        }
    }
    else {
        res.status(404).send('This category currently has no posts');
    }
    res.json(categoryPostsArray);
});
app.post('/PostCategory/:postID/:categoryID', function (req, res, next) {
    if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
        var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try {
            var newPostCat = new postcategoryObj_1.PostCategory(Number(req.params.categoryID), Number(req.params.postID));
            if (newPostCat.postId.toString() === '') {
                res.status(404).send('The post you are referring to does not exist, please try again');
            }
            else if (newPostCat.categoryId.toString() === "") {
                res.status(404).send('The category you are referring to does not exist, please try again');
            }
            else {
                postcategoryObj_1.PostCatArray.push(newPostCat);
                incrementalComId++;
                res.status(201).send("Your Post Category has been created");
            }
        }
        catch (_a) {
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }
    else {
        res.status(401).send("Unauthorized User");
    }
});
app.delete('/PostCategory/:postID/:categoryID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (postcategoryObj_1.PostCatArray.length > 0) {
        for (var x = 0; x < postcategoryObj_1.PostCatArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = postcategoryObj_1.PostCatArray[x].postId.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                var string1 = req.params.categoryID;
                var string2 = postcategoryObj_1.PostCatArray[x].categoryId.toString();
                comp = string1.localeCompare(string2);
                if (comp === 0) {
                    y = x;
                    break;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    postcategoryObj_1.PostCatArray.splice(y, 1);
                    res.status(204).send();
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The post category you are trying to delete does not exist');
        }
    }
    else {
        res.status(404).send('The post category you are trying to delete does not exist');
    }
});
app.get('/Comments/:postID', function (req, res, next) {
    var comp = 0;
    var postCommentsArray = [];
    if (commentObj_1.CommentArray.length > 0) {
        for (var x = 0; x < commentObj_1.CommentArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = commentObj_1.CommentArray[x].postID;
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                postCommentsArray.push(commentObj_1.CommentArray[x]);
            }
        }
    }
    else {
        res.status(404).send('This post currently has no comments');
    }
    res.json(postCommentsArray);
});
var incrementalComId = 1;
app.post('/Comments/:postID', function (req, res, next) {
    if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
        var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
        try {
            var currentDate = new Date();
            var newCom = new commentObj_1.Comments(incrementalComId, req.body.comment, currentUser.userId, req.params.postID, currentDate);
            if (newCom.comment === "") {
                res.status(404).send('Your Comment must have Content, please try again');
            }
            else if (newCom.postID === "") {
                res.status(404).send('You must select a Post to leave a comment on, please try again');
            }
            else {
                commentObj_1.CommentArray.push(newCom);
                incrementalComId++;
                res.status(201).send("Your Comment has been added");
            }
        }
        catch (_a) {
            res.cookie('loggedintoken', undefined);
            res.status(401).send("Unauthorized User");
        }
    }
    else {
        res.status(401).send("Unauthorized User");
    }
});
app.patch('/Comments/:postID/:commentID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (commentObj_1.CommentArray.length > 0) {
        for (var x = 0; x < commentObj_1.CommentArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = commentObj_1.CommentArray[x].postID.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                var string1 = req.params.commentID;
                var string2 = commentObj_1.CommentArray[x].commentId.toString();
                comp = string1.localeCompare(string2);
                if (comp === 0) {
                    y = x;
                    break;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    if (req.body.comment) {
                        commentObj_1.CommentArray[y].comment = req.body.comment;
                    }
                    res.status(200).send(commentObj_1.CommentArray[y]);
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The comment you are trying to patch does not exist');
        }
    }
    else {
        res.status(404).send('The post you are looking for does not exist');
    }
});
app.delete('/Comments/:postID/:commentID', function (req, res, next) {
    var comp = 0;
    var y = 0;
    if (commentObj_1.CommentArray.length > 0) {
        for (var x = 0; x < commentObj_1.CommentArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = commentObj_1.CommentArray[x].postID.toString();
            comp = string1.localeCompare(string2);
            if (comp === 0) {
                var string1 = req.params.commentID;
                var string2 = commentObj_1.CommentArray[x].commentId.toString();
                comp = string1.localeCompare(string2);
                if (comp === 0) {
                    y = x;
                    break;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        if (comp === 0) {
            if (req.cookies.loggedintoken && req.cookies.loggedintoken != undefined) {
                var token = jsonwebtoken_1.default.verify(req.cookies.loggedintoken, '9B1113D0BC528FFCA165D9DED295A53B5BBEF5DF1A76FA18851106442CFDF331');
                try {
                    commentObj_1.CommentArray.splice(y, 1);
                    res.status(204).send();
                }
                catch (_a) {
                    res.cookie('loggedintoken', undefined);
                    res.status(401).send('Unauthorized User');
                }
            }
            else {
                res.status(401).send('Unauthorized User');
            }
        }
        else {
            res.status(404).send('The comment you are trying to delete does not exist');
        }
    }
    else {
        res.status(404).send('The post you are looking for does not exist');
    }
});
app.get('/Comments/:postID/:commentID', function (req, res, next) {
    var compPost = 0;
    var compComm = 0;
    var y = 0;
    if (commentObj_1.CommentArray.length > 0) {
        for (var x = 0; x < commentObj_1.CommentArray.length; x++) {
            var string1 = req.params.postID;
            var string2 = commentObj_1.CommentArray[x].postID;
            compPost = string1.localeCompare(string2);
            if (compPost === 0) {
                var string1 = req.params.commentID;
                var string2 = commentObj_1.CommentArray[x].commentId.toString();
                compComm = string1.localeCompare(string2);
                if (compComm === 0) {
                    y = x;
                    break;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        if (compComm === 0) {
            res.status(200).send(commentObj_1.CommentArray[y]);
        }
        else {
            res.status(404).send('The comment you are searching for does not exist');
        }
    }
    else {
        res.status(404).send('The comment you are searching for does not exist');
    }
});
app.use('/', function (req, res, next) {
    res.redirect('/');
});
app.listen(3000);
