import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.text("id").primary()
    table.text("name").notNullable()
    table.text("email").unique()
    table.text("password").notNullable()
    table.boolean("isAdmin").defaultTo(false)
    table.timestamp("created_at")
    table.timestamp("updated_at")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}

