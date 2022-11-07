import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("foods", (table) => {
    table.text("id").primary()
    table.text("name").notNullable()
    table.text("description")
    table.text("image")
    table.integer("priceInCents")
    table.text("user_id").references("id").inTable("users").onDelete("CASCADE")
    table.text("user_id").references("id").inTable("type_of_food").onDelete("CASCADE")
    table.timestamp("created_at")
    table.timestamp("updated_at")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("foods")
}

