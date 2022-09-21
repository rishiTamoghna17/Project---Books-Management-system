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
        let titleExist = await findOne({title:title})
        if(titleExist) return res.status(400).send({ status: false, msg: "Title is already exist" })
        if (!validExcerpt(excerpt)) return res.status(400).send({ status: false, msg: "please enter valid excerpt" })
        if (!validId(userId)) return res.status(400).send({ status: false, msg: "please provide a valid userId" })
        let user = await userModel.findById(userId)
        if(!user) return res.status(400).send({ status: false, message: "User not exist" })
        if (!validISBN(ISBN)) return res.status(400).send({ status: false, msg: "please provide a valid ISBN" })
        let ISBNExist = await findOne({ISBN:ISBN})
        if(ISBNExist) return res.status(400).send({ status: false, msg: "ISBN is already exist"})
        if (!validCategory(category)) return res.status(400).send({ status: false, msg: "please provide a valid category" })
        if (!validSubCategory(subcategory)) return res.status(400).send({ status: false, msg: "please provide valid subcategory" })
        if (!validReviews(reviews)) return res.status(400).send({ status: false, msg: "please provide number of reviews" })
        if (!validReleasedAt(releasedAt)) return res.status(400).send({ status: false, msg: "please provide releasedAt in Date format" })
        // -------- end --------------
        let savedData = await bookModel.create(data)
        res.status(201).send({ status: true,message: 'Success',data:savedData})
        }
    catch(err){
        res.status(500).send(err.messsage)
    }
    
    }
    
const getBooks = async function(req,res){
    let data = req.body
    let condition = {isDeleted:false}
    // ---------- Validations start -------------
    let {userId,category,subcategory} = data
    if(userId){
        if(!validId(userId)) return res.status(400).send({status: false, msg: "please provide a valid userId"})
        condition.authorId = userId
    }
    if(category){
        if(!validCategory(category)) return res.status(400).send({ status: false, msg: "please provide a valid category"})
        condition.category = category
    }
    if(subcategory){
        if (!validSubCategory(subcategory)) return res.status(400).send({ status: false, msg: "please provide valid subcategory" })
        condition.authorId = subcategory
    }
    // ------------- end -----------------
    let books = await find(condition).select({"title":1,"excerpt":1,"userId":1,"category":1,"releasedAt":1,"reviews":1})
    if(!books) return res.status(201).send({ status: true,message: 'No such blog exist'})
    res.status(201).send({ status: true,message: 'Success',data:books})
}

const getBookById = async function (req, res) {
    let bookId = req.params.bookId
    if(!validId(bookId)) return res.status(400).send({status: false, message: "please provide a valid userId"})    
    let book = await bookModel.findbyId(bookId)
    if(!book) return res.status(201).send({ status: true,message: 'No such blog exist'})
    res.status(201).send({ status: true,message: 'Success',data:book})
}

module.exports = {createBook,getBooks,getBookById}