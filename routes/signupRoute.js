const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const knex = require('knex')(require('../knexfile.js'));

require("dotenv").config();

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check that the request is not missing any fields, just 2 for now but could be more, e.g username, firstname, lastname
        if(!email || !password) {
            return res.status(400).json({
                message: 'Seems like you left a field empty. Please submit both your email and a password!'});
        };

        const userExists = await knex('users').where('email', email).first();

        // check if the user already exists
        if(userExists) {
            return res.status(409).json({ message: "Sorry that email is already in use!"});
        };

        // create a new user, and put them in the database
        const newUser = await knex('users').insert({email, password });

        // create a JWT token, send it back to user
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET_KEY);

        
        // send the response back with the JWT token
        return res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;