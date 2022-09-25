const bookModel = require("../models/booksModel.js")
const reviewModel = require("../models/reviewModel.js")
const {validId,validBody,validDate,validReviewer,validRating,validReview} = require("../validator/validator")

const createReview = async function (req, res){
    try{
        let bookId= req.params.bookId
        // -------------- validations start --------------------
        if(!validId(bookId)) return res.status(400).send({status: false, message: "Please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(201).send({status:false,message:'No such book exist'})
        let data = req.body
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Request body can't be empty" })
        data.bookId = bookId
        let {reviewedBy,reviewedAt,rating,review} = data
        if(!validReviewer(reviewedBy)) return res.status(400).send({status: false, message: "Please provide name in valid format"})
        if(!validDate(reviewedAt)) return res.status(400).send({status: false, message: "Please provide review date in valid format"})
        if(!validRating(rating)) return res.status(400).send({status: false, message: "Please provide rating between 1 to 5"})
        if(review){
            if(!validReview(review)) return res.status(400).send({status: false, message: "Please provide review in valid format"})
        }
        // -------------------- end -------------------------------
        let reviewData = await reviewModel.create(data)
        let updatedBook = await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:1}},{new:true})
        let savedData = {updatedBook,reviewsData:[reviewData]}
        res.status(201).send({ status: true,message: 'Success',data:savedData})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

const updateReview = async function(req,res){
    try{
        let bookId= req.params.bookId
        let reviewId = req.params.reviewId
        // ---------------------- validations start -------------------- 
        if(!validId(bookId)) return res.status(400).send({status: false, message: "Please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(404).send({status:false,message:'No such book exist'})
        if(!validId(reviewId)) return res.status(400).send({status: false, message: "Please provide a valid reviewId"}) 
        let condition2 = {isDeleted:false,_id:reviewId}
        let reviewExist = await reviewModel.findOne(condition2)
        if(!reviewExist) return res.status(404).send({status:false,message:'No such review exist'})
        let data = req.body
        let update = {}
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Provide something to update" })
        let {reviewedBy,rating,review} = data
        if(reviewedBy){
            if(!validReviewer(reviewedBy)) return res.status(400).send({status: false, message: "Please providename in valid format"})
            update.reviewedBy = reviewedBy
        }
        if(rating){
            if(!validRating(rating)) return res.status(400).send({status: false, message: "Please provide rating 1 to 5"})
            update.rating = rating
        }
        if(review){
            if(!validReview(review)) return res.status(400).send({status: false, message: "please provide review in valid format"})
            update.review = review
        }
        // ------------------------ end ---------------------------
        let updatedReview = await reviewModel.findByIdAndUpdate(reviewId,{$set:update},{new:true})
        let updatedData = {book,reviewsData:[updatedReview]}
        res.status(200).send({ status: true,message: 'Success',data:updatedData})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

const deleteReview = async function (req, res) {
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        // -------------------- validation start -------------------
        if(!validId(bookId)) return res.status(400).send({status: false, message: "Please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(404).send({status:false,message:'No such book exist'})
        if(!validId(reviewId)) return res.status(400).send({status: false, message: "Please provide a valid reviewId"}) 
        let condition2 = {isDeleted:false,_id:reviewId}
        let reviewExist = await reviewModel.findOne(condition2)
        if(!reviewExist) return res.status(404).send({status:false,message:'No such review exist'})
        // --------------------- end -------------------------------
        await reviewModel.findByIdAndUpdate(reviewId,{$set:{isDeleted: true}})
        await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}})
        res.status(200).send({ status:true,message:'Review deleted'})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

module.exports = {createReview,updateReview,deleteReview}