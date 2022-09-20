const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')

const createUser = async function (req , res) {
    try{
        let data = req.body
        let savedDAta = await userModel.create(data)
        res.status(201).send({status : false , data : savedDAta})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const logIn = async function(req,res){
    try{
        let body = req.body
        let user = await userModel.findOne({email:body.email,password:body.password}).select({"_id":1})
        let token = jwt.sign({"id":user._id},"ritik's-key-for-login",{ expiresIn: '1h' })
        res.status(201).send({status : false , data:token})
    }   
    catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={createUser,logIn}