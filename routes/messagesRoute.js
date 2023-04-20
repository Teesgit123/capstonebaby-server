const express = require("express");
const router = express.Router();
const cors = require("cors");
const messagesController = require("../controllers/messagesController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");
router.use(cors());

router.route("/")
  .get(auth.checkToken, messagesController.messageFromConversation)
  .post(auth.checkToken, messagesController.createMessage);

module.exports = router;
