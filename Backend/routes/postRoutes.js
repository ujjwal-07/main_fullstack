const express = require("express");
const postController = require("../controllers/postController")
const bodyParser = require("body-parser")
const multer = require("multer")
const { addPost, getPosts, upload } = require('../controllers/postController');



const Router = express.Router();

Router.get("/getpost",postController.getPosts)
Router.post('/userpost', upload.single('image'), postController.addPost);
Router.post("/delete",postController.deletePost);
Router.post("/update",postController.updatePost);

module.exports = Router