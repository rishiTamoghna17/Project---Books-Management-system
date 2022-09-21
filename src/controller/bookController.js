const bookModel = require("../models/booksModel.js")
const userModel = require('../models/userModel')
const {validBookTitle,validExcerpt,validISBN,validCategory,
    validSubCategory,validReviews,validReleasedAt,validBody,validId} = require("../validator/validator.js")

const createBook = async function (req,res) {
    try {
        let data = req.body

        // ---------- validation start -----------------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Request body can't be empty" })
        let {title,excerpt,userId,ISBN,category,subcategory,reviews,releasedAt} =  data
        if (!validBookTitle(title)) return res.status(400).send({ status: false, msg: "Please provide a valid title" })
        let titleExist = await bookModel.findOne({title:title})
        if(titleExist) return res.status(400).send({ status: false, msg: "Title is already exist" })
        if (!validExcerpt(excerpt)) return res.status(400).send({ status: false, msg: "please enter valid excerpt" })
        if (!validId(userId)) return res.status(400).send({ status: false, msg: "please provide a valid userId" })
        let user = await userModel.findById(userId)
        if(!user) return res.status(400).send({ status: false, message: "User not exist" })
        if (!validISBN(ISBN)) return res.status(400).send({ status: false, msg: "please provide a valid ISBN" })
        let ISBNExist = await bookModel.findOne({ISBN:ISBN})
        if(ISBNExist) return res.status(400).send({ status: false, msg: "ISBN is already exist"})
        if (!validCategory(category)) return res.status(400).send({ status: false, msg: "please provide a valid category" })
        if (!validSubCategory(subcategory)) return res.status(400).send({ status: false, msg: "please provide valid subcategory" })
        if(reviews){
            if (!validReviews(reviews)) return res.status(400).send({ status: false, msg: "please provide number of reviews" })
        }
        if (!validReleasedAt(releasedAt)) return res.status(400).send({ status: false, msg: "please provide releasedAt in Date format" })
        // --------------- end ------------------------
        // --------------- authorization --------------
        if(userId.toString() !== req.tokenUserId) return res.status(403).send({status: false,message:"Access denied"})
        // --------------- end ------------------------
        let savedData = await bookModel.create(data)
        res.status(201).send({ status: true,message: 'Success',data:savedData})
        }
    catch(err){
        res.status(500).send({message: err.message})
    }
    
    }
    
const getBooks = async function(req,res){
    let data = req.query
    let condition = {isDeleted:false}
    // ---------- Validations start -------------
    let {userId,category,subcategory} = data
    if(userId){
        if(!validId(userId)) return res.status(400).send({status: false, msg: "please provide a valid userId"})
        condition.userId = userId
    }
    if(category){
        if(!validCategory(category)) return res.status(400).send({ status: false, msg: "please provide a valid category"})
        condition.category = category
    }
    if(subcategory){
        if (!validSubCategory(subcategory)) return res.status(400).send({ status: false, msg: "please provide valid subcategory" })
        condition.subcategory = subcategory
    }
    // ------------- end -----------------
    let books = await bookModel.find(condition).select({"title":1,"excerpt":1,"userId":1,"category":1,"releasedAt":1,"reviews":1}).sort({title:1})
    if(books.length == 0) return res.status(201).send({status:false,message:'No such blog exist'})
    res.status(201).send({status:true,message:'Success',data:books})
}

const getBookById = async function (req,res){
    let bookId = req.params.bookId
    let book = await bookModel.findById(bookId)
    res.status(201).send({ status: true,message: 'Success',data:book})
}

module.exports = {createBook,getBooks,getBookById}