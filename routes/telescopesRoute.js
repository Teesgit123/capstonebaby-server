const express = require("express");
const router = express.Router();
const telescopesController = require("../controllers/telescopesController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");

require("dotenv").config();

router.post("/", auth.checkToken, telescopesController.createTelescope);
router.get("/", auth.checkToken, telescopesController.getTelescopes);


module.exports = router;
