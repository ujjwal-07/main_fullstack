const express = require("express");
const postController = require("../controllers/postController")
const bodyParser = require("body-parser")
const multer = require("multer")
const { addPost, getPosts,updatePost, updateLike, upload } = require('../controllers/postController');



const Router = express.Router();

Router.get("/getpost",postController.getPosts)
Router.post('/userpost', upload.single('image'), postController.addPost);
Router.post("/delete",postController.deletePost);
Router.post("/update",updatePost);
Router.post("/getyourpost",postController.getYourPost);
Router.post("/updateLike", postController.updateLike)



module.exports = Router