const knex = require("knex")(require("../knexfile.js"));

exports.getConversationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await knex("conversations")
      .where("user1_id", userId)
      .orWhere("user2_id", userId)
      .select("*")
      .orderBy("updated_at", "desc");



    res.json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving the conversations" });
  }
};





exports.getConversationByUserAndReceiver = async (req, res) => {
  const userId = req.params.userId;
  const receiverId = req.params.receiverId;

  try {
    const conversation = await knex("messages")
      .where(function () {
        this.where("sender_id", userId).andWhere("receiver_id", receiverId);
      })
      .orWhere(function () {
        this.where("sender_id", receiverId).andWhere("receiver_id", userId);
      })
      .first();

    if (conversation) {
      console.log(conversation);
      res.json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    console.error("Error fetching conversation", error);
    res.status(500).json({ message: "Error fetching conversation" });
  }
};
