import { Router } from "express"
import { SessionsController } from "../controllers/SessionsController"
import { UserController } from "../controllers/UserController"

const sessionRouter = Router()

const sessionController = new SessionsController()

sessionRouter.post("/", sessionController.create)


export default sessionRouter