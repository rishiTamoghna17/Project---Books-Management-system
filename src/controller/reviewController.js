const bookModel = require("../models/booksModel.js")
const reviewModel = require("../models/reviewModel.js")
const {validId,validBody,validDate,validReviewer,validRating,validReview} = require("../validator/validator")

const createReview = async function (req, res){
    try{
        let bookId= req.params.bookId
        if(!validId(bookId)) return res.status(400).send({status: false, message: "please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(404).send({status:false,message:'No such book exist'})
        let data = req.body
        data.bookId = bookId
        
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Request body can't be empty" })
        let {reviewedBy,reviewedAt,rating,review} = data
        if(!validReviewer(reviewedBy)) return res.status(400).send({status: false, message: "please provide a valid name"})
        if(!validDate(reviewedAt)) return res.status(400).send({status: false, message: "please provide review date in valid format"})
        if(!validRating(rating)) return res.status(400).send({status: false, message: "please provide rating 1 to 5"})
        if(!validReview(review)) return res.status(400).send({status: false, message: "please provide review in valid format"})

        let reviewData = await reviewModel.create(data)
        let updatedBook = await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:1}},{new:true})
        res.status(201).send({ status: true,message: 'Books list',data:updatedBook,reviewsData:[reviewData]})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

const updateReview = async function(req,res){
    try{
        let bookId= req.params.bookId
        let reviewId = req.params.reviewId
        if(!validId(bookId)) return res.status(400).send({status: false, message: "please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(201).send({status:false,message:'No such book exist'})
        if(!validId(reviewId)) return res.status(400).send({status: false, message: "please provide a valid reviewId"}) 
        let condition2 = {isDeleted:false,_id:reviewId}
        let reviewExist = await reviewModel.findOne(condition2)
        if(!reviewExist) return res.status(201).send({status:false,message:'No such review exist'})
        let data = req.body
        let update = {}
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Provide something to update" })
        let {reviewedBy,rating,review} = data
        if(reviewedBy){
            if(!validReviewer(reviewedBy)) return res.status(400).send({status: false, message: "please provide a name"})
            update.reviewedBy = reviewedBy
        }
        if(rating){
            if(!validRating(rating)) return res.status(400).send({status: false, message: "please provide rating 1 to 5"})
            update.rating = rating
        }
        if(review){
            if(!validReview(review)) return res.status(400).send({status: false, message: "please provide review in valid format"})
            update.review = review
        }
        let updatedReview = await reviewModel.findByIdAndUpdate(reviewId,{$set:update},{new:true})
        // let book = await bookModel.findById(bookId)
        //let send = {book,reviewsData:[updatedReview]}
        res.status(201).send({ status: true,message: 'Books list',data:book,reviewsData:[updatedReview]})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

const deleteReview = async function (req, res) {
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if(!validId(bookId)) return res.status(400).send({status: false, message: "please provide a valid bookId"}) 
        let condition = {isDeleted:false,_id:bookId}
        let book = await bookModel.findOne(condition)
        if(!book) return res.status(201).send({status:false,message:'No such book exist'})
        if(!validId(reviewId)) return res.status(400).send({status: false, message: "please provide a valid reviewId"}) 
        let condition2 = {isDeleted:false,_id:reviewId}
        let reviewExist = await reviewModel.findOne(condition2)
        if(!reviewExist) return res.status(201).send({status:false,message:'No such review exist'})
        // let updatedId = await reviewModel.findOneAndUpdate({_id: reviewId},{$set:{isDeleted: true,deleteAt:new Date()}})
        let deletedReview = await reviewModel.findByIdAndUpdate(reviewId,{$set:{isDeleted: true}},{new:true})
        let updatedBook = await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}},{new:true})
        res.status(201).send({ status:true,message:'Deleted'})
    }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}

module.exports = {createReview,updateReview,deleteReview}