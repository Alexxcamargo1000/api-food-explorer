import { Knex } from "knex";



export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.text("id").unique().notNullable();
    table.text("name").notNullable()
    table.text("email").notNullable()
    table.text("password").notNullable()
    table.boolean("isAdmin").defaultTo(false)
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}

