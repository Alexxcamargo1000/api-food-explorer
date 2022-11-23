import { verify } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

import { auth } from "../config/auth"
import { AppError } from "../utils/AppError"

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("jwt token não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  try {
    const { sub: user_id } = verify(token, auth.jwt.secret)
    request.user = {
      id: String(user_id),
    }
    next()
  } catch (error) {
    throw new AppError("jwt token invalido", 401)
  }
}
