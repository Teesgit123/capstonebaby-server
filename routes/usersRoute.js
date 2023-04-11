const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");

require("dotenv").config();


router.get("/",auth.checkToken, usersController.getAllUsers);

module.exports = router;