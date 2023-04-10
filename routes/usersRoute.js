const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");


require("dotenv").config();


router.get("/", usersController.getAllUsers);

module.exports = router;