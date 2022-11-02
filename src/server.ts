import 'express-async-errors'
import express from 'express'
import router from './routes'
import { createDatabaseConnection } from './database'

const app = express()

app.use(express.json())

app.use(router)

createDatabaseConnection()

app.listen(3333, () => console.log("server listening on 3333"))