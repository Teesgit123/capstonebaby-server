const knex = require("knex")(require("../knexfile.js"));

const users = [
    {
        name: 'Albert',
        email: 'AB@einstein.com',
        password: '1234',
    }
];

exports.seed = async (knex) => {
  await knex("users").del();

  await knex("users").insert(users);
};
