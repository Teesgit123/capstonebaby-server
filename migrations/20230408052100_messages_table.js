/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("messages", function (table) {
    table.increments("id").primary();
    table.integer("conversation_id").unsigned();
    table
        .foreign("conversation_id")
        .references("id")
        .inTable("conversations")
        .onDelete("CASCADE");
    table.integer("sender_id").unsigned();
    table
        .foreign("sender_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.integer("receiver_id").unsigned();
    table
      .foreign("receiver_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("content");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("messages");
};
