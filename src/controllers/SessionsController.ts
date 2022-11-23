import { z } from "zod"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import { Request, Response } from "express"

import { auth } from "../config/auth"
import { AppError } from "../utils/AppError"
import { knexConnection } from "../database/knex"


export class SessionsController {
  async create(request: Request, response: Response) {
    const createSessionBody = z.object({
      email: z.string().email({
        message: "email invalido",
      }),
      password: z.string({
        required_error: "A senha é obrigatória",
      }),
    })

    const { email, password } = createSessionBody.parse(request.body)

    const user: User = await knexConnection("users")
      .where({ email: email.toLowerCase() })
      .first()

    if (!user) {
      throw new AppError("Usuário ou senha invalida", 401)
    }

    const checkPassword = await compare(password, user.password)

    if (!checkPassword) {
      throw new AppError("Usuário ou senha invalida", 401)
    }

    const { secret, expiresIn } = auth.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    if (user.isAdmin) {
      return response.json({ user, token, admin: user.isAdmin })
    }

    return response.json({ user, token })
  }
}
