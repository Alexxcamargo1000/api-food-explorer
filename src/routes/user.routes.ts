import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const userRouter = Router()

const userController = new UserController()

userRouter.post("/", userController.create)
userRouter.put("/", ensureAuthenticated, userController.update)


export default userRouter