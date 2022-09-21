const jwt = require("jsonwebtoken");
const bookModel = require('../models/booksModel');
const {validId} = require("../validator/validator.js")

const authentication = async function (req, res, next) {
    try{
        let token = req.headers["x-api-key"]
        if(!token) return res.status(404).send({ status: false, message: "missing a mandatory token header" });
        try{
            const decodedToken = jwt.verify(token,"group-38-key-for-login")
            req.tokenUserId = decodedToken.userId
            next()
        }
        catch(err){
            res.status(400).send({status:false,message: `${err.message} Please provide valid token`})
        }
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const authorisation = async function(req,res,next){
    try{
        let bookId = req.params.bookId
        if(!validId(bookId)) return res.status(400).send({status: false, message: "please provide a valid bookId"}) 
        let book = await bookModel.findById(bookId)
        if(!book) return res.status(201).send({status:false,message:'No such book exist'})
        let userId = book.userId.toString()
        if(userId !== req.tokenUserId) return res.status(403).send({status: false,message:"Access denied"})
        next()
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports={authentication,authorisation}