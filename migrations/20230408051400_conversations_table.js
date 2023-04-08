/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("conversations", function(table) {
    table.increments("id").primary();
    table.integer("user1_id").unsigned();
    table
        .foreign("user1_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.integer("user2_id").unsigned();
    table
        .foreign("user2_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("conversations");
};
