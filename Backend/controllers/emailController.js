const express = require("express");
const emailModel = require("../models/emailModel");


const app = express();

app.use(express.json());

exports.sendEmail = async (req,res,next)=>{
    try{
    const {sender, receiver, subject, body, date} = req.body;
    const newEmail = new emailModel({sender, receiver, subject, body, date});
    await newEmail.save();
    res.status(200).send("Email Sent Successfully")


    }catch(err){
        res.status(500).send("Error when sending email");
    }

}
