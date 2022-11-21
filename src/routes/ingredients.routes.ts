import { Router } from "express"
import multer from "multer"
import { MULTER } from "../config/upload"
import { IngredientsController } from "../controllers/IngredientsController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const ingredientsRouter = Router()

const ingredientsController = new IngredientsController()
const uploadFile = multer(MULTER)

ingredientsRouter.get("/", ensureAuthenticated, ingredientsController.index)
ingredientsRouter.delete("/:name", ensureAuthenticated, ingredientsController.delete) 

ingredientsRouter.post("/",
 ensureAuthenticated, 
 uploadFile.single("image"), 
 ingredientsController.create
)
ingredientsRouter.put("/:id", 
  ensureAuthenticated,
  uploadFile.single("imageUpdated"),
  ingredientsController.update
)



export default ingredientsRouter