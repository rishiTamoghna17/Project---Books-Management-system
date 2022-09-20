const express = require('express')
const router = express.Router()
const userController= require("../Controller/userController")

router.post("/register", userController.createUser)
router.post("/logIn", userController.logIn)

module.exports = router