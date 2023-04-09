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

exports.saveMessageToDatabase = async (sender_id, receiver_id, content) => {
  const [conversation] = await knex("conversations")
    .where(function () {
      this.where("user1_id", sender_id).andWhere("user2_id", receiver_id);
    })
    .orWhere(function () {
      this.where("user1_id", receiver_id).andWhere("user2_id", sender_id);
    });

  const conversation_id = conversation ? conversation.id : null;

  const newMessage = {
    conversation_id,
    sender_id,
    content,
  };

  try {
    await knex("messages").insert(newMessage);
  } catch (error) {
    console.error("Error saving message", error);
  }
};


