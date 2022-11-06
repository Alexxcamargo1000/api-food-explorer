import { Knex } from "knex";
import path from 'path'
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    pool: {
      afterCreate: (conn: any, cb: any) => conn.run("PRAGMA foreign_keys = ON", cb),
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
    },
    useNullAsDefault: true,
  },
};

export default config;
