import path from 'path'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

export async function createDatabaseConnection() {
  const database = await open({
    filename: './db/database.db',
    driver: sqlite3.Database,
  })

  return database
}

