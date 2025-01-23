const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userRouter = require("./routes/userRouter");
const emailRouter = require("./routes/emailRoutes");
const postRouter = require("./routes/postRoutes");
const bodyParser = require('body-parser')
const User = require("./models/userModel");

const app = express();
app.use(express.json())
const corsOptions = {
  origin: 'https://main-fullstack-frontend.vercel.app', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json())

app.use("/user",userRouter)
app.use("/email",emailRouter)
app.use("/posts",postRouter)
app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})

app.post("/user/login",async (req,res)=>{
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
})
 mongoose.connect(process.env.DB)
.then(()=>{console.log("Connected to Mongo Atlas")})
.catch((err)=>{console.log("Error occured : ",err)})


app.listen(3002,()=>{
    console.log("App is running on port 3002")
})


// using smtp server

