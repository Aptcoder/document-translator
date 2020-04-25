var User = require('../models/users')
var bcrypt = require('bcrypt')


//controller function to create user
var createUser = function(req,res,next){
    var username = req.body.username;
    console.log(username,password)
    var password = req.body.password
//create new user
    var newUser = new User({
        username : username,
        password : password
    })
    //save new User
    newUser.save().then((user) => {
        // console.log('user successfully created :' + user.username);
        user.generateToken().then((token) => {
            // console.log("token :" + token)
            res.set('x-auth',token.authToken).status(200).send({
                message : "User Created",
                username : user.username,
                passcode : user.passcode,
                success : true,
                status : 200
            })
        })
        .catch((err) => {
            console.log('Error creating token' + err)
            res.status(500).send({
                status : 500,
                message : "something went Wrong",
                success : false
            })
        })
    })
    .catch(err => {
        console.log('Error creating user :')
        res.status(401).send({
            message : "Username already exists" ,
            status : 401,
            success : false
        })
    })
}

//controller function for login
var userLogin = function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username : username})
        .then((user) =>{
        bcrypt.compare(password,user.password,(err,result) => {
            if(err) {
                return res.status(500).send({
                    message : "something went wrong"
                })
            }
            if(!result){
               res.status(401).send({
                message : "wrong password or username",
                status : 401
            })
            return ;
            }
            user.generateToken().then((token) => {
                console.log("token :" + token)
                res.set('x-auth',token.authToken).status(200).send({
                    username ,
                    status : 200,
                    message : "login successful"
                })
            })
            .catch((err) => {
                console.log('Error creating token' + err)
                res.status(500).send({
                    status : 500,
                    ErrorMessage : "something went Wrong"
                })
            })
        })
    })
        .catch((err) => {
            res.status(401).send({
                message : "wrong password or username",
                status : 401
            })
    })
}

//TODO - write controller to get user with authentication;
//TODO2 - 
module.exports = {
    createUser ,
    userLogin
}