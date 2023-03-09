import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ingredients", (table) => {
    table.text("id").primary()
    table.text("name").unique()
    table.text("image")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("ingredients")
}


