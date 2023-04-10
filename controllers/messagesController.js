const knex = require("knex")(require("../knexfile.js"));
const { findOrCreateNewConversation } = require("./conversationsController.js");

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
  const { conversationId } = req.params;

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

exports.saveMessageToDatabase = async (senderId, receiverId, content) => {
  try {
    const [conversation] = await knex("conversations")
      .where(function () {
        this.where("user1_id", senderId).andWhere("user2_id", receiverId);
      })
      .orWhere(function () {
        this.where("user1_id", receiverId).andWhere("user2_id", senderId);
      })
      .first();

    let conversationId;
    if (conversation) {
      conversationId = conversation.id;
    } else {
      [conversationId] = await knex("conversations").insert({
        user1_id: senderId,
        user2_id: receiverId,
      });
    }

    await knex("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content,
    });
  } catch (error) {
    console.error("Error saving message to database", error);
    throw error;
  }
};


