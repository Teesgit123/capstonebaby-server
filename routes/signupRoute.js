const express = require("express");
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const knex = require("knex")(require("../knexfile.js"));

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = {
      email,
      password: hashedPassword,
    };

    const user = await knex("users").insert(newUser);

    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({ token, userId: user[0].id });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

module.exports = router;
