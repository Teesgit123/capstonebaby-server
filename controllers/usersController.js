const knex = require("knex")(require("../knexfile.js"));

exports.getAllUsers = async (req, res) => {
  try {
    const users = await knex.column('name', 'id').select().from('users');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};


