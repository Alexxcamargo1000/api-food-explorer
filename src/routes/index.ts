import { Router } from "express";
import sessionRouter from "./sessions.routes";
import userRouter from "./user.routes";
import typeFoodRouter from "./typeFood.route";

const router = Router()

router.use("/users", userRouter)
router.use("/session", sessionRouter)
router.use("/type-food", typeFoodRouter)

export default router