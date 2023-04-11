import "express-async-errors"
import "dotenv/config"
import cors from "cors"
import router from "./routes"
import { ZodError } from "zod"
import express, { Response, Request, NextFunction } from "express"
import { createDatabaseConnection } from "./database/index"
import { AppError } from "./utils/AppError"

import path from "path"


 const TMP_FOLDER = path.resolve(__dirname, "..", "tmp")
 const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads")
 const UPLOAD_FOLDER_INGREDIENTS = path.resolve(
  TMP_FOLDER,
  "uploads",
  "ingredients"
)

const app = express()

app.use(cors())
app.use(express.json())

app.use("/foods/files", express.static(UPLOAD_FOLDER))
app.use("/ingredients/files", express.static(UPLOAD_FOLDER_INGREDIENTS))
app.use(router)

createDatabaseConnection()

app.use(
  (error: Object, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      if (error.issues[0].code === "invalid_type") {
        console.log(error)

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
    console.log(error)

    return response.status(500).json({
      status: "error",
      message: "Internal Server Error",
    })
  }
)

app.listen(3333, () => console.log("server listening on 3333"))
