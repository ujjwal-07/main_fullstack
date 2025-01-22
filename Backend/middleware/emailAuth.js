const express = require("express");
const emailModel = require("../models/userModel")
const app = express();

app.use(express.json());

exports.authEmail = async (req,res,next)=>{
    try{
    const {sender,receiver} = req.body;
    console.log(req.body , "Inside middleware")
    const checkSender = await emailModel.findOne({email:sender});
    const checkReceiver =  await emailModel.findOne({email :receiver});
    console.log(checkReceiver)

    if(checkSender){
        if(checkReceiver){
            next();
        }
        else{
            res.status(404).send("Receiver not Found Please check again")
        }
    }else{
        res.status(404).send("Sender not Found Please check again")

    }

    }
    catch(err){
        res.staus(500).send("Error while sending email : ", err)
    }



}

