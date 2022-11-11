import { Router } from "express"
import multer from "multer"
import { MULTER } from "../config/upload"
import { IngredientsController } from "../controllers/IngredientsController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const ingredientsRouter = Router()

const ingredientsController = new IngredientsController()
const uploadFile = multer(MULTER)

ingredientsRouter.post("/",
 ensureAuthenticated, 
 uploadFile.single("image"), 
 ingredientsController.create
)

ingredientsRouter.delete("/:name", ensureAuthenticated, ingredientsController.delete) 


export default ingredientsRouter