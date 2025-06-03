const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const FormDataModel = require('../models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection (use cloud DB for deployment)
mongoose.connect('mongodb+srv://sreevaishnavibharathdwaja123:<db_password>@tailor-craft-data.yi1t0.mongodb.net/?retryWrites=true&w=majority&appName=tailor-craft-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await FormDataModel.findOne({ email });
    if (user) return res.json("Already registered");
    try {
        const newUser = await FormDataModel.create(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await FormDataModel.findOne({ email });
    if (!user) return res.json("No records found!");
    if (user.password === password) return res.json("Success");
    return res.json("Wrong password");
});

module.exports = app;
module.exports.handler = serverless(app);  // serverless entry
