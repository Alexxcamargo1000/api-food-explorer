import multer from "multer"
import { Router } from "express"

import { MULTER } from "../config/upload"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"
import { IngredientsController } from "../controllers/IngredientsController"

const ingredientsRouter = Router()

const ingredientsController = new IngredientsController()
const uploadFile = multer(MULTER)


ingredientsRouter.get("/", ingredientsController.index)

ingredientsRouter.delete(
  "/:name",
  ensureAuthenticated,
  ingredientsController.delete
)

ingredientsRouter.post(
  "/",
  ensureAuthenticated,
  uploadFile.single("image"),
  ingredientsController.create
)
ingredientsRouter.put(
  "/:id",
  ensureAuthenticated,
  uploadFile.single("imageUpdated"),
  ingredientsController.update
)

export default ingredientsRouter
