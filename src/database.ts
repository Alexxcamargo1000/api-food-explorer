import { Knex } from "knex"
import path from 'path'

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/database.db",
    },
    pool: {
      afterCreate: (conn: any, cb: any) => conn.run("PRAGMA foreign_keys = ON", cb),
    },
    migrations: {
      extension: 'ts',
      directory:  "./db/migrations"
    },
    useNullAsDefault: true,
  },
}

 