import { Router } from "express";

import userRouter from "./user.routes";
import foodsRouter from './food.routes'
import sessionRouter from "./sessions.routes";
import typeFoodRouter from "./typeFood.routes";
import ingredientRouter from './ingredients.routes'

const router = Router()

router.use("/users", userRouter)
router.use("/foods", foodsRouter)
router.use("/session", sessionRouter)
router.use("/type-food", typeFoodRouter)
router.use("/ingredients", ingredientRouter)


export default router