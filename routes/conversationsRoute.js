/*
Define a route to fetch the conversation history between 2 users

GET /api/conversations/:userId/:receiverId


*/

const express = require("express");
const router = express.Router();
const conversationsController = require("../controllers/conversationsController.js");
const auth = require("../authenticateJWT/authenticateJWT.js");



// to find or to make a conversation between 2 users,
router.get("/:userId/:receiverId", auth.checkToken, conversationsController.findOrCreateNewConversationAPI);


// to find all conversations that a user has been apart of

// router.route("/:userId")
//     .get(auth.checkToken, conversationsController.getConversationsForUser);


module.exports = router;