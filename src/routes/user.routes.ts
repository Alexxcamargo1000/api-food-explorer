import { Router } from "express"
import { UserAdminController } from "../controllers/UserAminController"
import { UserController } from "../controllers/UserController"
import { ensureAuthenticated } from "../middleware/ensureAuthenticated"

const userRouter = Router()

const userController = new UserController()
const userAdminController = new UserAdminController()

userRouter.post("/", userController.create)
userRouter.post("/admin", userAdminController.create)
userRouter.put("/admin", ensureAuthenticated, userAdminController.update)
userRouter.delete("/admin", ensureAuthenticated, userAdminController.delete)


export default userRouter