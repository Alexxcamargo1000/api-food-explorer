import { Router } from "express"
import multer from "multer"
import { MULTER } from "../config/upload"
import { FoodController } from "../controllers/FoodController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const foodRouter = Router()

const foodController = new FoodController()
const uploadFile = multer(MULTER)

foodRouter.post("/",
 ensureAuthenticated, 
 uploadFile.single("image"), 
 foodController.create
)

foodRouter.get("/:slug", ensureAuthenticated, foodController.show)
foodRouter.get("/", ensureAuthenticated, foodController.index)


export default foodRouter