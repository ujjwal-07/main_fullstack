const User = require("../models/userModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require("streamifier")


require("dotenv").config()
app.use(express.json())


require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_NAME,
  api_key: process.env.cloudinary_KEY,
  api_secret: process.env.cloudinary_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });


const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject({ message: 'Error uploading file', error });
          } else {
            resolve(result);
          }
        }
      );
  
      // Pipe the file stream to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  };


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.getNo = (req,res)=>{
    res.send("Hello Hala Madrid")
}

exports.login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const checkUser = await User.findOne({email:email})
        console.log(checkUser)
        if(!checkUser){
            res.status(400).send("Invalid Email")
            return
        }

        const passwordCheck = await bcrypt.compare(password, checkUser.password)
        if(!passwordCheck){
            console.log("Incorrect Password")
            return res.status(400).send("Invalid credentials")
            

        }
        
        return  res.status(200).json({ token: generateToken(checkUser.email), email:{email} });
        

    }catch(error){
        console.error("Error fetching users:", error);
        return  res.status(500)
        
    }
}

exports.getUser = async (req,res)=>{
    try {
        const allUsers = await User.find(); // Fetch all users
        return res.send(allUsers)
        
        // res.render('index', { users: allUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send("Internal Server Error");
        
    }
};

// Add a new user to the database
// Add a new user to the database
exports.addUser = async (req, res) => {
  try {
      console.log(req.body)
      const { fname, lname, email, password } = req.body;

      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ email: email });
      console.log(existingUser, "existingUser");

      if (existingUser) {
          // If a user exists with this email, send a conflict response
          return res.status(409).send("User with this email already exists");
      }

      // Create a new user object if email is unique
      const newUser = new User({ fname, lname, email, password });
      await newUser.save(); // Save the user to the database

      // Return a response with the generated token and email
      return res.status(201).json({ token: generateToken(newUser.email), email: newUser.email });
      
  } catch (error) {
      console.error("Error adding user:", error);
      return res.status(500).send("Internal Server Error");
  }
};


// DUMMY CODE FOR NOW