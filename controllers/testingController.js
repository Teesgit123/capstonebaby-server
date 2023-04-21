const knex = require("knex")(require("../knexfile.js"));




async function getUserData(req, res) {
  const { userId } = req.params;

  return knex.transaction(async (trx) => {
    try {
      // retrieve the user by id and select only the 'id' and 'name' columns
      const [user] = await trx("users")
        .where("id", userId)
        .select("id", "name");

      // get all telescopes that are associated with this userId and select only the 'id' and 'model' columns
      const telescopes = await trx("telescopes")
        .where("supplier_id", userId)
        .select("id", "model");

      // get all conversations where userId is mentioned
      // join the 'users' table twice to retrieve the name of both users in each conversation
      // include a subquery to retrieve all messages for each conversation
      // Replace this block in the getUserData function
      const conversations = await trx("conversations")
        .join("users as sender", "sender.id", "conversations.user1_id")
        .join("users as receiver", "receiver.id", "conversations.user2_id")
        .where("conversations.user1_id", userId)
        .orWhere("conversations.user2_id", userId)
        .select(
          "conversations.id as conversations_id",
          "sender.id as sender_id",
          "receiver.id as receiver_id",
          "sender.name as sender_name",
          "receiver.name as receiver_name"
        )
        .select(
          trx.raw(
            '(SELECT JSON_ARRAYAGG(JSON_OBJECT("id", id, "content", content, "sender_id", sender_id, "receiver_id", receiver_id, "created_at", created_at)) FROM messages WHERE conversation_id = conversations.id) as messages'
          )
        );

      // return the retrieved data
      return res.json({ user, telescopes, conversations });
    } catch (error) {
      console.log("Error while getting the user data:", error);
      // throw error;
    }
  });
}

module.exports = getUserData;




