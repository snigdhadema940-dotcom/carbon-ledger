const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title:String,
    description:String,
    location:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Event", eventSchema);