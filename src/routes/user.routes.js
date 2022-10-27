const { Router } = require("express");
const UserController = require("../controllers/UserController")

const userRouter = Router()
const userController = new UserController()

userRouter.get("/", (request,  response) => {

  response.json({message:"user"})
})

userRouter.post("/", userController.create)

module.exports = userRouter