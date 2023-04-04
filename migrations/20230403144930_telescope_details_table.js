/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('telescopes', function(table) {
    table.increments("id").primary();
    table.integer("supplier_id").unsigned();
    table
      .foreign("supplier_id")
      .references("id")
      .inTable("users");
    table.string("type");
    table.index('type');
    table.integer("aperture");
    table.integer("focalLength");
    table.string("mount");
    table.json("accessories");
    table.string("condition");
    table.integer("pricePerDay");
    table.index('pricePerDay');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("telescopes");
};