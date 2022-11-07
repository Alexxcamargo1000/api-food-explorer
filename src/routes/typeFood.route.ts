import { Router } from "express"
import { TypeFood } from "../controllers/TypeOfFoodController"
import { UserController } from "../controllers/UserController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const typeFoodRouter = Router()

const typeFoodController = new TypeFood()

typeFoodRouter.post("/", ensureAuthenticated, typeFoodController.create)


export default typeFoodRouter