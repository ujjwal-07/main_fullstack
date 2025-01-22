const express = require("express");

const emailController = require("../controllers/emailController");
const emailAuthMiddlerware = require("../middleware/emailAuth");
const Router = express.Router();

Router.post("/sendEmail",emailAuthMiddlerware.authEmail,emailController.sendEmail)


module.exports = Router;