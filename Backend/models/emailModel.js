const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    sender : {
        type : String,
        required: true
    },
    receiver : {
        type : String,
        required: true
    },
    subject : {
        type : String,
        required: true
    },
    body : {
        type : String,
        required: true
    },
    // attachement : {
    //     type : String,
    //     required: true
    // },  Need to Figure this one out

    date : {
        type : Date,
        default: Date.now()
    }

})

const emailModel = mongoose.model("email", emailSchema);

module.exports = emailModel