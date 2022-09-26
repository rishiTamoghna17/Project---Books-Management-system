// ------- REGEX --------------
const mongoose = require("mongoose")

function validBody(data){
    return Object.keys(data).length > 0;     
}

function validId(id){
    return mongoose.Types.ObjectId.isValid(id)
}

function validDate(date){
    return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date)
}

function validUserTitle(title){
    return title.match(/Mr|Miss|Mrs/)
}

function validName(name){
    return /^[A-Za-z ]{1,20}$/.test(name)
}

function validPhone(phone){
    return /^[0]?[6789]\d{9}$/.test(phone)
}

function validMail(email){
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
}

function validPassword(password){
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)
}

function validAddress(address){
    return /^[a-zA-Z0-9\s\,\''\-]*$/.test(address.street) && /^[A-Za-z ]{1,20}$/.test(address.city) && 
    /^\d{6}$/.test(address.pincode)
}

function validBookTitle(title){
    return /^[A-Za-z ]{1,20}$/.test(title)
}

function validExcerpt(excerpt){
    return /^[A-Za-z ]{1,100}$/.test(excerpt)
}

function validISBN(ISBN){
    return /^\d{13}$/.test(ISBN)
}

function validCategory(category){
    return /^[A-Za-z ]{1,20}$/.test(category)
}

function validReviews(reviews){
    return /^[0-9]{0,20}$/.test(reviews)
}

function validDate(date){
    return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date)
}

function validReviewer(reviewedBy){
    return /^[A-Za-z ]{1,20}$/.test(reviewedBy)
}

function validRating(rating){
    return /^[0-5]{1,5}$/.test(rating)
}

function validReview(review){
    return /^[A-Za-z ]{1,70}$/.test(review)
}


module.exports = {validBookTitle,validExcerpt,validISBN,validCategory,validReviews,validDate,validBody,
                    validId,validUserTitle,validName,validPhone,validMail,validPassword,validAddress,
                validReviewer,validRating,validReview}