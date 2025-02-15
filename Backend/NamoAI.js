const express = require("express")
const app = express()
const axios = require("axios")
app.use(express.json())



app.post("/multipleresponse",(req,res)=>{

    

})


app.listen(8000,()=>{
    console.log("Post is running inside Port 8000")
})