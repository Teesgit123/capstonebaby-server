const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");
const testController = require('../controllers/testingController.js');
require("dotenv").config();


// router.get("/",auth.checkToken, usersController.getAllUsers);

router.get('/:userId', auth.checkToken, testController);

module.exports = router;