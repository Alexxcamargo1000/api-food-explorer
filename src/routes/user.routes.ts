import { Router } from "express"
import { UserAdminController } from "../controllers/UserAminController"
import { UserController } from "../controllers/UserController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const userRouter = Router()

const userController = new UserController()
const userAdminController = new UserAdminController()

userRouter.post("/", userController.create)
userRouter.post("/admin", userAdminController.create)
userRouter.put("/", ensureAuthenticated, userController.update)
userRouter.delete("/", ensureAuthenticated, userController.delete)


export default userRouter