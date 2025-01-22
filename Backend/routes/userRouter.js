const express = require("express");
const userController = require("../controllers/userController")

const Router = express.Router();

Router.get("/",userController.getUser);

Router.post("/adduser",userController.addUser)

Router.get("/hello", userController.getNo)

Router.post("/login",userController.login)
module.exports = Router