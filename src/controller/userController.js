const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const {validBody,validUserTitle,validName,validPhone,validMail,validPassword,validAddress} = require('../validator/validator.js')

const createUser = async function (req,res) {
    try{
        let data = req.body
        // ----- validation start -----------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Request body can't be empty" })
        let {title,name,phone,email,password,address} = data
        if(!title) return res.status(400).send({ status: false, message: "Please provide title"})
        if(!validUserTitle(title)) return res.status(400).send({ status: false, message: "Please provide title from these [Mr,Mrs,Miss]"})
        if(!name) return res.status(400).send({ status: false, message: "Please provide name of user"})
        if(!validName(name)) return res.status(400).send({ status: false, message: "Please provide name in valid format" })
        if(!phone) return res.status(400).send({ status: false, message: "Please provide phone"})
        if(!validPhone(phone)) return res.status(400).send({ status: false, message: "Please provide phone in valid format" })
        let phoneExist = await userModel.findOne({phone:phone})
        if(phoneExist) return res.status(400).send({ status: false, message: "Phone is already registered" })
        if(!email) return res.status(400).send({ status: false, message: "Please provide mail"})
        if(!validMail(email)) return res.status(400).send({ status: false, message: "Please provide mail in valid format" })
        let mailExist = await userModel.findOne({email:email})
        if(mailExist) return res.status(400).send({ status: false, message: "Email is already registered" })
        if(!password) return res.status(400).send({ status: false, message: "Please provide password"})
        if(!validPassword(password)) return res.status(400).send({ status: false, message: "Please provide password in valid format" })
        if(address){
            if(typeof address !== "object") return res.status(400).send({ status: false, message: "Please provide address in object form"})
            if(!address.street) return res.status(400).send({ status: false, message: "Please provide street in address"})
            if(!address.city) return res.status(400).send({ status: false, message: "Please provide city in address"})
            if(!address.pincode) return res.status(400).send({ status: false, message: "Please provide pincode in address"})
            if(!validAddress(address)) return res.status(400).send({ status: false, message: "Please provide all valid field in address"})
        }
        // --------- End ------------
        console.log(typeof address)
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
        if(!email || !password) return res.status(400).send({ status: false, message: "Please provide email and password"})
        if(!validMail(email)) return res.status(400).send({ status: false, message: "Please provide mail in valid format" })
        if(!validPassword(password)) return res.status(400).send({ status: false, message: "Please provide password in valid format" })
        let user = await userModel.findOne({email:email,password:password}).select({"_id":1})
        if(!user) res.status(400).send({status : false , message : "Invailid mail or password"})
        // ------ End -------------
        let token = jwt.sign({userId:user._id.toString()},"group-38-key-for-login",{ expiresIn: '10m'})
        res.status(201).send({status:true,message:'Success',data:token})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

module.exports={createUser,logIn}