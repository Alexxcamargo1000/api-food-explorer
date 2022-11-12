import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("foods_ingredients", (table) => {
    table.text("id").primary()
    table.text("ingredient_id").references("id").inTable("ingredients")
    table.text("food_id").references("id").inTable("foods")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("foods_ingredients")
}


