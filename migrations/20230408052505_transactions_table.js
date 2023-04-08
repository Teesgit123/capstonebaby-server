/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("transactions", function (table) {
    table.increments("id").primary();
    table.integer("supplier_id").unsigned();
    table
        .foreign("supplier_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.integer("buyer_id").unsigned();
    table
        .foreign("buyer_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.integer("telescope_id").unsigned();
    table
        .foreign("telescope_id")
        .references("id")
        .inTable("telescopes")
        .onDelete("CASCADE");
    table.decimal("amount", 10, 2);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("transactions");
};
