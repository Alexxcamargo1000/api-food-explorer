import { Router } from "express";
import sessionRouter from "./sessions.routes";
import userRouter from "./user.routes";
import typeFoodRouter from "./typeFood.routes";
import foodsRouter from './food.routes'
import ingredientRouter from './ingredients.routes'

const router = Router()

router.use("/users", userRouter)
router.use("/session", sessionRouter)
router.use("/type-food", typeFoodRouter)
router.use("/foods", foodsRouter)
router.use("/ingredients", ingredientRouter)


export default router