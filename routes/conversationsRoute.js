/*
Define a route to fetch the conversation history between 2 users

GET /api/conversations/:userId/:receiverId


*/

const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");
const cors = require("cors");
router.use(cors());


router.get("/:userId", auth.checkToken, conversationsController.getConversationsForUser)
// to find or to make a conversation between 2 users,
router.get(
  "/:userId/:receiverId",
  auth.checkToken,
  conversationsController.getConversationByUserAndReceiver
);


module.exports = router;