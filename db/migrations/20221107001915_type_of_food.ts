import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("type_of_food", (table) => {
    table.text("id").primary()
    table.text("name").unique()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("type_of_food")
}