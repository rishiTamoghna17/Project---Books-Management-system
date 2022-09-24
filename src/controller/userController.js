
const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const { validBody, validUserTitle, validName, validPhone, validMail, validPassword, validAddress } = require('../validator/validator.js')


// ________________________________________POST USER_________________________________________//

const createUser = async function (req, res) {
    try {
        let data = req.body
        // ----- validation start -----------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Please provide Details " })
        let { title, name, phone, email, password, address } = data

        if (!title) {
            return res.status(400).send({ status: false, msg: "Please provide Title.." })
        }
        if (!validUserTitle(title)) return res.status(400).send({ status: false, message: "please Enter valid Title" })

        if (!validName(name)) return res.status(400).send({ status: false, message: "Please Enter valid Name " })
        if (!name) {
            return res.status(400).send({ status: false, msg: "Please provide Name......" })
        }

        if (!validPhone(phone)) return res.status(400).send({ status: false, message: "Please Enter Valid Mobile Number" })
        if (!phone) {
            return res.status(400).send({ status: false, msg: "Please provide Mobile Number" })
        }

        let phoneExist = await userModel.findOne({ phone: phone })
        if (phoneExist) return res.status(400).send({ status: false, message: "Phone is already Exist" })


        if (!validMail(email)) return res.status(400).send({ status: false, message: "Enter mail in valid format" })
        if (!email) {
            return res.status(400).send({ status: false, msg: "Please provide E-mail" })
        }

        let mailExist = await userModel.findOne({ email: email })
        if (mailExist) return res.status(400).send({ status: false, message: "Email is already Exist" })

        if (!password) { return res.status(400).send({ msg: "please provode password" }) }
        if (!validPassword(password)) return res.status(400).send({ status: false, message: "password must contain At least capital letter small letter special caracter and number" })

        if (address) {
            if (!validAddress(address)) return res.status(400).send({ status: false, message: "Please Enter valid Address" })
        }

        // --------- End ------------
        let savedData = await userModel.create(data)
        res.status(201).send({ status: false, data: savedData })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}




// ________________________________________LOGIN USER___________________________________________//

const logIn = async function (req, res) {
    try {
        let data = req.body
        // ---------- validations start -----------------
        if (!validBody(data)) return res.status(400).send({ status: false, message: "Please Provide Id and Password " })
        let { email, password } = data


        if (!email) {
            return res.status(400).send({ status: false, msg: "Please provide Id" })
        }


        if (!password) {
            return res.status(400).send({ status: false, msg: "Please provide password " })
        }

        let user = await userModel.findOne({ email: email ,  password: password })
        if (!user) return res.status(400).send({ status: false, message: "credintial not match" })

        // let Password = await userModel.findOne({})
        // if (!Password) return res.status(400).send({ status: false, message: "Please Provide correct Login Password" })


        // ------ End -------------
        let token = jwt.sign({ userId: user._id.toString() }, "group-38-key-for-login", { expiresIn: '1h' })
        res.status(201).send({ status: true, data: token })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = { createUser, logIn }