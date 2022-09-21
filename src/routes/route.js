const express = require('express')
const router = express.Router()
const userController= require("../Controller/userController")
const bookController= require("../Controller/bookController")

router.post("/register", userController.createUser)
router.post("/logIn", userController.logIn)
router.post("/books", bookController.createBook)
router.get("/books", bookController.getBooks)
router.get("/books/:bookId", bookController.getBookById)

module.exports = router