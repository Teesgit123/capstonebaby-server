const knex = require("knex")(require("../knexfile.js"));


const findOrCreateNewConversation = async (user1_id, user2_id) => {
    const conversation = await knex("conversations")
        .where(function() {
            this.where("user1_id", user1_id).andWhere("user2_id", user2_id);
        })
        .orWhere(function () {
            this.where("user1_id", user2_id).andWhere("user2_id", user1_id);
        })
        .first();

    if (conversation) {
        return conversation;
    } else {
        const newConversation = {
            user1_id,
            user2_id,
        };
    
        const [createdConversation] = await knex("conversations").insert(newConversation);

        return createdConversation;
    }
};

exports.findOrCreateNewConversationAPI = async (req, res) => {
    const { userId, receiverId } = req.params;

    try {
        const conversation = await findOrCreateNewConversation(userId, receiverId);

        res.status(conversation.id ? 200 : 201).json(conversation);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error finding or creating the conversation" });
    }
}


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

exports.findOrCreateNewConversation = findOrCreateNewConversation;