import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ingredients", (table) => {
    table.text("id").primary()
    table.text("name").notNullable()
    table.text("image")
    table.text("food_id").references("id").inTable("foods").onDelete("CASCADE")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("ingredients")
}


