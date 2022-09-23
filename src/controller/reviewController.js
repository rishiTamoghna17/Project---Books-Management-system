const bookModel = require("../models/booksModel.js")

const review = async function (req, res){
    try{
        let bookId= req.params.bookId;
        let filter = {bookId,isDeleted:false};
        let ExistingBooks = await bookModel.findOne(filter);
        if(!ExistingBooks){
            return res.status(404).send({message: "Book not found"});
        }
        let data = req.body;
        let savedData = await reviewModel.create(data)
        let updatedBook = await bookModel.findOneAndUpdate(
            {filter},
            {$inc:{reviews:1}},
            {new:true})
            let send = {updatedBook,reviewsData:savedData}
            res.status(201).send({ status: true,message: 'Books list',data:send})
        }
    catch(err){
        res.status(500).send({status:false,message: err.message});
    }
}