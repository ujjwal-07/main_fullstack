const User = require("../models/userModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json())

exports.getNo = (req,res)=>{
    res.send("Hello Hala Madrid")
}

exports.login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const checkUser = await User.findOne({email})
        console.log(checkUser)
        if(!checkUser){
            res.status(400).send("Invalid Email")
        }

        const passwordCheck = await bcrypt.compare(password, checkUser.password)
        if(!passwordCheck){
            console.log("Incorrect Password")
            res.status(400).send("Invalid credentials")

        }
        
        res.status(200).send("Login Success")
        

    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500)
    }
}

exports.getUser = async (req,res)=>{
    try {
        const allUsers = await User.find(); // Fetch all users
        res.send(allUsers)
        // res.render('index', { users: allUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Add a new user to the database
exports.addUser = async (req, res) => {
    try {
        console.log(req.body)
        const { fname,lname, email, password} = req.body;
        const newUser = new User({ fname,lname, email,password });
        await newUser.save(); // Save the user to the database
        res.send('Data Inserted Successfully');
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Internal Server Error");
    }
};

// DUMMY CODE FOR NOW