const mongoose = require("mongoose");

const userPostSchema = new mongoose.Schema({
    title: { type : String, required : true},
    description: { type : String, required : true},
    imageName: { type : String},
    imageUrl: { type : String},
    email:{type: String},
})

const Post = mongoose.model("userPost",userPostSchema)

module.exports = Post;