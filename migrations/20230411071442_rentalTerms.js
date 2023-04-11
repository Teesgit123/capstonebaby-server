/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("rentalTerms", function(table) {
    table.increments("id").primary();
    table.integer("supplier_id").unsigned();
    table.foreign("supplier_id").references("id").inTable("users");
    table.integer("telescope_id").unsigned();
    table.foreign("telescope_id").references("id").inTable("telescopes");
    table.integer("max_period").unsigned();
    table.integer("price_per_day").unsigned();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("telescopes");
};
