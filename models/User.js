const mongoose = require("mongoose");

const CarbonSchema = new mongoose.Schema({
    car: Number,
    electricity: Number,
    gas: Number,
    people: Number,
    total: Number,
    date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    carbonHistory: [CarbonSchema]
});

module.exports = mongoose.model("User", UserSchema);