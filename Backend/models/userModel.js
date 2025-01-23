const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    fname:{
        type : String,
        required : true,
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        requied : true
    },
    password:{
        type: String,
        requied: true
    }
   
});

userSchema.pre('save', async function(next){
    try{

        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
})

userSchema.methods.comparePasswords = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("user",userSchema)

module.exports = User