const bookModel = require("../models/booksModel.js")
const reviewModel = require("../models/reviewModel.js")
const userModel = require('../models/userModel')
const {validBookTitle,validExcerpt,validISBN,validCategory,
    validSubCategory,validReviews,validDate,validBody,validId} = require("../validator/validator.js")

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
        if (!validDate(releasedAt)) return res.status(400).send({ status: false, msg: "please provide releasedAt in Date format" })
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
    try{
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
    if(books.length == 0) return res.status(201).send({status:false,message:'No such book exist'})
    res.status(201).send({status:true,message:'Success',data:books})
    }
    catch(err){
        res.status(500).send({message: err.message})
    }
}

const getBookById = async function (req,res){
    let bookId = req.params.bookId
    let book = await bookModel.findById(bookId)
    let reviews = await reviewModel.find({bookId:bookId})
    book.isDeleted = "nothing"
    console.log(book.re)
    res.status(201).send({ status: true,message: 'Success',data:book})
}

const updateBook = async function(req,res){
    let bookId = req.params.bookId
    let data = req.body
    let {title,excerpt,releasedAt,ISBN} = data
    let update = {}
    // ------------ validation start -------------------
    if (!validBody(data)) return res.status(400).send({ status: false, message: "Please provide something to update" })
    if(title){
        if (!validBookTitle(title)) return res.status(400).send({ status: false, msg: "Please provide a valid title" })
        let titleExist = await bookModel.findOne({title:title})
        if(titleExist) return res.status(400).send({ status: false, msg: "Title is already exist" })
        update.title = title
    }
    if(excerpt){
        if (!validExcerpt(excerpt)) return res.status(400).send({ status: false, msg: "please enter valid excerpt" })
        update.excerpt  = excerpt
    }
    if(ISBN){
        if (!validISBN(ISBN)) return res.status(400).send({ status: false, msg: "please provide a valid ISBN" })
        let ISBNExist = await bookModel.findOne({ISBN:ISBN})
        if(ISBNExist) return res.status(400).send({ status: false, msg: "ISBN is already exist"})
        update.ISBN =  ISBN
    }
    if(releasedAt){
        if (!validDate(releasedAt)) return res.status(400).send({ status: false, msg: "please provide releasedAt in Date format" })
        update.releasedAt = releasedAt
    }
    // -------------------- end -------------------
    let updatedBook = await bookModel.findByIdAndUpdate(bookId,{$set:update},{new:true})
    res.status(201).send({ status: true,message: 'Success',data:updatedBook})
}

const deleteBook = async function(req,res){
    let bookId = req.params.bookId
    let deleted = await bookModel.findByIdAndUpdate(bookId,{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})
    res.status(201).send({ status: true,message:'deleted'})
}

module.exports = {createBook,getBooks,getBookById,updateBook,deleteBook}