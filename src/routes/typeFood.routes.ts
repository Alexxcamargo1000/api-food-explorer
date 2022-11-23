import { Router } from "express"

import { TypeFood } from "../controllers/TypeOfFoodController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const typeFoodRouter = Router()

const typeFoodController = new TypeFood()

typeFoodRouter.post("/", ensureAuthenticated, typeFoodController.create)
typeFoodRouter.get("/", ensureAuthenticated, typeFoodController.index)


export default typeFoodRouter