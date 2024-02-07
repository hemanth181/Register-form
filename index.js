const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const {MongoClient} = require("mongodb")

const app = express ();
dotenv.config()
//ASSIGNING  PORT
const PORT = process.env.PORT || 5000;
//DB CONNECTION
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongodb connected");
    })
    .catch((error) => {
        console.log("Error", error);
    });

 
    const Registrationschema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });
    

//REG SCHEMA
const Registration = mongoose.model("Registration", Registrationschema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/register/index.html");
});

app.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;
        //data save in db
        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname +"/register/success.html");
});
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/register/error.html");
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});