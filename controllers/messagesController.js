const knex = require("knex")(require("../knexfile.js"));

exports.createMessage = async (req, res) => {

    const { conversation_id, sender_id, receiver_id, content } = req.body;

    try {
        const newMessage = {
            conversation_id,
            sender_id,
            content,
        };

        const [ createdMessage ] = await knex("messages").insert(newMessage);
        
        res.status(201).json(createdMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "There was an error creating this message" });
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
        res.status(500)/json({ message: "There was an error finding messages" });
    }
};