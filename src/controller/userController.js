const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const {validBody,validUserTitle,validName,validPhone,validMail,validPassword,validAddress} = require('../validator/validator.js')

const createUser = async function (req,res) {
    try{
        let data = req.body
        // ----- validation start -----------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Request body can't be empty" })
        let {title,name,phone,email,password,address} = data
        if(!validUserTitle(title)) return res.status(400).send({ status: false, message: "Please provide title in valid format" })
        if(!validName(name)) return res.status(400).send({ status: false, message: "Please provide name in valid format" })
        if(!validPhone(phone)) return res.status(400).send({ status: false, message: "Please provide phone in valid format" })
        let phoneExist = await userModel.findOne({phone:phone})
        if(phoneExist) return res.status(400).send({ status: false, message: "Phone is already registered" })
        if(!validMail(email)) return res.status(400).send({ status: false, message: "Please provide mail in valid format" })
        let mailExist = await userModel.findOne({email:email})
        if(mailExist) return res.status(400).send({ status: false, message: "Email is already registered" })
        if(!validPassword(password)) return res.status(400).send({ status: false, message: "Please provide password in valid format" })
        if(address){
            if(!validAddress(address)) return res.status(400).send({ status: false, message: "Please provide valid address" })
        }
        // --------- End ------------
        let savedData = await userModel.create(data)
        res.status(201).send({status :true,message: 'Success', data : savedData})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const logIn = async function(req,res){
    try{
        let data = req.body
        // ---------- validations start -----------------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Please provide email and password" })
        let {email,password} = data
        if(!validMail(email)) return res.status(400).send({ status: false, message: "Please provide mail in valid format" })
        if(!validPassword(password)) return res.status(400).send({ status: false, message: "Please provide password in valid format" })
        let user = await userModel.findOne({email:email,password:password}).select({"_id":1})
        if(!user) res.status(400).send({status : false , message : "Invailid mail or password"})
        // ------ End -------------
        let token = jwt.sign({userId:user._id.toString()},"group-38-key-for-login",{ expiresIn: '1h' })
        res.status(201).send({status:true,message:'Success',data:token})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={createUser,logIn}