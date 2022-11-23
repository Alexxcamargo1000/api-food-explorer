import { Router } from "express"
import multer from "multer"
import { MULTER } from "../config/upload"
import { FoodController } from "../controllers/FoodController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const foodRouter = Router()

const foodController = new FoodController()
const uploadFile = multer(MULTER)

foodRouter.post(
  "/",
  ensureAuthenticated,
  uploadFile.single("image"),
  foodController.create
)

foodRouter.get("/:slug", ensureAuthenticated, foodController.show)
foodRouter.delete("/:slug", ensureAuthenticated, foodController.delete)
foodRouter.get("/", ensureAuthenticated, foodController.index)

foodRouter.put(
  "/:slug",
  ensureAuthenticated,
  uploadFile.single("imageUpdated"),
  foodController.update
)

export default foodRouter
