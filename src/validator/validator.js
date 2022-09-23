// ------- REGEX --------------
const mongoose = require("mongoose")

function validBody(data){
    return Object.keys(data).length > 0;     
}

function validId(id){
    if(!id) return false
    return mongoose.Types.ObjectId.isValid(id)
}

function validUserTitle(title){
    if(!title) return false
    if(title.match(/Mr|Miss|Mrs/)) return true
    return false
}

function validName(name){
    if(!name) return false
    if(/^[A-Za-z]{1,20}/.test(name)) return true
    return false
}

function validPhone(phone){
    if(!phone) return false
    if (/^[0]?[6789]\d{9}$/.test(phone)) return true
    return false
}

function validMail(email){
    if(!email) return false
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) return true
    return false
}

function validPassword(password){
    if(!password) return false
    if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)) return true
    return false
}

function validAddress(address){
    if(/^[a-zA-Z0-9\s\,\''\-]*$/.test(address.street) && /^[A-Za-z]{1,20}/.test(address.city) && 
    /^\d{6}$/.test(address.pincode)) return true
    return false
}

function validBookTitle(title){
    if(!title) return false
    if(/^[A-Za-z]{1,20}/.test(title)) return true
    return false
}

function validExcerpt(excerpt){
    if(!excerpt) return false
    if(/^[A-Za-z]{1,100}/.test(excerpt)) return true
    return false
}

function validISBN(ISBN){
    if(!ISBN) return false
    if(/^\d{13}$/.test(ISBN)) return true
    return false
}

function validCategory(category){
    if(!category) return false
    if(/^[A-Za-z]{1,20}/.test(category)) return true
    return false
}

function validSubCategory(subcategory){
    if(!subcategory) return false
    if(/^[A-Za-z]{1,20}/.test(subcategory)) return true
    return false
}

function validReviews(reviews){
    if(/^[0-9]{0,20}$/.test(reviews)) return true
    return false
}

function validDate(date){
    if(!date) return false
    if(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return true
    return false
}

function validReviewer(reviewedBy){
    if(!reviewedBy) return false
    if(/^[A-Za-z]{1,20}/.test(reviewedBy)) return true
    return false
}

function validRating(rating){
    if(!rating) return false
    if(/^[0-9]{1,5}$/.test(rating)) return true
    return false
}

function validReview(review){
    if(/^[A-Za-z]{1,70}/.test(review)) return true
    return false
}


module.exports = {validBookTitle,validExcerpt,validISBN,validCategory,validSubCategory,validReviews,validDate,
                    validBody,validId,validUserTitle,validName,validPhone,validMail,validPassword,validAddress,
                validReviewer,validRating,validReview}