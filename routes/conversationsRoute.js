const express = require("express");
const router = express.Router();
const cors = require("cors");
const conversationsController = require("../controllers/conversationsController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");

router.use(cors());

router.get(
  "/:userId",
  auth.checkToken,
  conversationsController.getConversationsByUser
);
router.get(
  "/:userId/:receiverId",
  auth.checkToken,
  conversationsController.getConversationByUserAndReceiver
);

module.exports = router;
