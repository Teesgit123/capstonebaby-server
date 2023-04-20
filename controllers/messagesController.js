const knex = require("knex")(require("../knexfile.js"));

const findOrCreateNewConversation = async (user1_id, user2_id) => {
  try {
    const conversation = await knex("conversations")
      .where(function () {
        this.where("user1_id", user1_id).andWhere("user2_id", user2_id);
      })
      .orWhere(function () {
        this.where("user1_id", user2_id).andWhere("user2_id", user1_id);
      })
      .first();

    if (conversation) {
      return conversation;
    } else {
      const [createdConversationId] = await knex("conversations").insert({
        user1_id,
        user2_id,
      });

      return await knex("conversations")
        .where("id", createdConversationId)
        .first();
    }
  } catch (error) {
    console.error("Error fetching or creating conversation", error);
  }
};



exports.createMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  try {
    const conversation = await findOrCreateNewConversation(
      sender_id,
      receiver_id
    );

    const newMessage = {
      conversation_id: conversation.id,
      sender_id,
      receiver_id,
      content,
    };

    const insertedId = await knex("messages")
      .insert(newMessage)
      .then((response) => {
        return knex("messages").where("id", response[0]).select("*");
      });

    const createdMessage = insertedId[0];

    res.status(201).json(createdMessage);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "There was an error creating this message" });
  }
};


exports.messageFromConversation = async (req, res) => {

  try {
    const messages = await knex("messages")
      .where("conversation_id", conversationId)
      .select("*")
      .orderBy("created_at", "asc");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was an error finding messages" });
  }
};



