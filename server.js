const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const User = require("./models/User");
const Event = require("./models/Event");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "carbonledger",
    resave: false,
    saveUninitialized: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/carbonDB");



app.post("/signup", async (req,res)=>{

    const {name,email,password} = req.body;

    try{
        const user = new User({name,email,password});
        await user.save();
        res.redirect("/signin.html");
    }
    catch{
        res.send("User already exists");
    }

});



app.post("/login", async (req,res)=>{

    const {email,password} = req.body;

    const user = await User.findOne({email,password});

    if(user){
        req.session.userId = user._id;
        res.redirect("/calculate.html");
    }else{
        res.send("Invalid login");
    }

});



app.post("/save-carbon", async (req,res)=>{

    if(!req.session.userId){
        return res.send("Login required");
    }

    const {car,electricity,gas,people,total} = req.body;

    const user = await User.findById(req.session.userId);

    user.carbonHistory.push({car,electricity,gas,people,total});

    await user.save();
    console.log("Saving for user:", req.session.userId);
    res.send("Saved");

});



app.get("/history", async (req,res)=>{

    if(!req.session.userId){
        return res.send([]);
    }

    const user = await User.findById(req.session.userId);

    res.json(user.carbonHistory);

});

app.post("/post-event", async (req,res)=>{

    if(!req.session.userId){
        return res.status(401).send("Login required");
    }

    const {title,description,location} = req.body;

    const event = new Event({
        title,
        description,
        location,
        createdBy:req.session.userId
    });

    await event.save();

    res.send("Event posted");

});


app.get("/events", async (req,res)=>{

    const events = await Event.find().populate("createdBy","name");

    res.json(events);

});
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin.html");
    });
});
app.get("/check-auth", (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});
app.listen(3000,()=>{
    console.log("Server running on port 3000");
});