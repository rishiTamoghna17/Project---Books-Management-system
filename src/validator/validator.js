const userModel = require('../models/userModel')

function validBody(data){
    return Object.keys(data).length > 0;     
}

function validTitle(title){
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

module.exports = {validBody,validTitle,validName,validPhone,validMail,validPassword,validAddress}