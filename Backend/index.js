const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userRouter = require("./routes/userRouter");
const emailRouter = require("./routes/emailRoutes");
const postRouter = require("./routes/postRoutes");
const bodyParser = require('body-parser')
const socketio = require("socket.io");
const redis = require("ioredis");
const User = require("./models/userModel");
const http = require("http");

const Port = process.env.PORT || 3002

const app = express();
const server = http.createServer(app)
const io = socketio(server,{
  cors:{
    origin:"*"
  }
})
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  Credential: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};
 
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.options('*', cors(corsOptions));

mongoose.connect( "mongodb+srv://employedatsstore:Ujjwal21@cluster0.i81xi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{console.log("Connected to Mongo Atlas")})
.catch((err)=>{console.log("Error occured : ",err)})

// Socket.io connection

io.on("connection",(socket)=>{
  console.log("User connected")

  socket.on("message",(message)=>{
      console.log("Message recived", message)
      io.emit(message)
  })

  socket.on("disconnect",()=>{
      console.log("User Disconnected")
  })

})


app.use("/user",userRouter)
app.use("/email",emailRouter)
app.use("/posts",postRouter)
app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})


server.listen(4000,()=>{
  console.log(`Server is running on port 4000`)
})

app.listen(Port,()=>{
    console.log(`App is running on port ${Port}`)
})



