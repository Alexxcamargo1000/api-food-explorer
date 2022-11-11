import 'express-async-errors'
import express, {  Response, Request, NextFunction } from 'express'
import router from './routes'
import { createDatabaseConnection } from './database'
import { AppError } from './utils/AppError'
import { ZodError } from 'zod'

const app = express()

app.use(express.json())

app.use(router)

createDatabaseConnection()

app.use((error: Object, request: Request, response: Response, next: NextFunction) => {

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  if (error instanceof ZodError) {

    if(error.issues[0].code === 'invalid_type') {
      console.log(error);
      
      return response.status(400).json({
        code: error.issues[0].code,
        status: "error",
        message: error.issues[0].message,
      })
    }
    
    
    return response.status(400).json({
      code: error.issues[0].code,
      status: "error",
      message: error.issues[0].message,
    })
  }
  console.log(error);
  
  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  })
})


app.listen(3333, () => console.log("server listening on 3333"))