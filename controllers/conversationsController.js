const knex = require("knex")(require("../knexfile.js"));

exports.findOrCreateNewConversation = async (user1, user2) => {
  const users = await knex("users").whereIn("id", [user1, user2]).select("id");

  if (users.length !== 2) {
    throw new Error("One or both users not found");
  }

  const [existingConversation] = await knex("conversations")
    .where({
      user1_id: user1,
      user2_id: user2,
    })
    .orWhere({
      user1_id: user2,
      user2_id: user1,
    })
    .select("*");

  if (existingConversation) {
    return existingConversation;
  } else {
    const [conversationId] = await knex("conversations").insert({
      user1_id: user1,
      user2_id: user2,
    });

    return { id: conversationId };
  }
};

exports.getConversationsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await knex("conversations")
            .where("user1_id", userId)
            .orWhere("user2_id, userId")
            .select("*")
            .orderBy("updated_at", "desc");

        res.json(conversations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving the conversations"});
    }
};

exports.getConversationByUserAndReceiver = async (req, res) => {
  const userId = req.params.userId;
  const receiverId = req.params.receiverId;

  try {
    const conversation = await knex("conversations")
      .where(function () {
        this.where("user1_id", userId).andWhere("user2_id", receiverId);
      })
      .orWhere(function () {
        this.where("user1_id", receiverId).andWhere("user2_id", userId);
      })
      .first();

    if (conversation) {
      res.json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    console.error("Error fetching conversation", error);
    res.status(500).json({ message: "Error fetching conversation" });
  }
};

