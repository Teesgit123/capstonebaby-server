const express = require('express');
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js"));

require("dotenv").config();

router.post('/login', async (req, res) =>{

    const { email, password } = req.body;

    try {

        // query our user's table to see if the email exists
        const user = await knex('users').where('email', email).first();
        
        if (user) {
            console.log(user);
        }

        // If the user cannot be found or the password is incorrect, return an error
        if(!user || !await argon2.verify(user.password, password)) {
            return res.status(401).json({ message: "Invalid email or password, please try again!"});
        }

        // If the combination is correct, generate a jwt token and send it to our user
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

        // send the response back with the JWT
        return res.status(201).json({ token, userId: user.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "there was an error with our server, please try again later!" })
    }
});


module.exports = router;