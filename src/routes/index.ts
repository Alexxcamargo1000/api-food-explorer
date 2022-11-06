import { Router } from "express";
import sessionRouter from "./sessions.routes";
import userRouter from "./user.routes";

const router = Router()

router.use("/users", userRouter)
router.use("/session", sessionRouter)

export default router