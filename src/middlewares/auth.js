const usercontroller= require('../controller/usercontroller')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = require('../models/booksModel');

const authentication = async function (req, res, next) {
    try{
        let token = req.headers["x-api-key"];
        if(!token)res.status(404).send({ status: false, msg: "missing a mandatory token" });
        const decodedToken= jwt.verify(token,"group-38-key-for-login");
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
          }
            req.final=decodedToken;
            next();
    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}
const authorization = async function(req,res,next){
    try{
        decodedToken= req.final;
        userLoggedIn= decodedToken.userId;
        let book = req.params.bookId;
    if (!mongoose.isValidObjectId(book)){
      return res.status(400).send({ status: false, msg: 'Please enter correct book Id' })
  }
    bookData=await bookModel.findById(book);
    if (bookData.userId.toString() != userLoggedIn) {
        return res.status(403).send({ status: false, msg: "You are not authrized" });
      }
      next();
    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}
module.exports={authentication,authorization}

