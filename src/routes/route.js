const express = require('express')
const router = express.Router()
const userController= require("../Controller/userController")
const bookController= require("../Controller/bookController")
const mid = require("../middlewares/auth.js")

router.post("/register", userController.createUser)
router.post("/logIn", userController.logIn)

router.post("/books",mid.authentication, bookController.createBook)
router.get("/books",mid.authentication, bookController.getBooks)
router.get("/books/:bookId",mid.authentication, mid.authorisation, bookController.getBookById)

module.exports = router