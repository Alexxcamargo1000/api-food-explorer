import { compare } from "bcrypt";
import { auth } from "../config/auth";
import { knexConnection } from "../database/knex";
import { Request, Response } from "express";

import { AppError } from "../utils/AppError";
import { sign } from "jsonwebtoken";
import { z } from "zod";

export class SessionsController {
  async create(request: Request, response: Response) {

    const createSessionBody = z.object({
      email: z.string().email({
        message: "email invalido"
      }),
      password: z.string({
        required_error: "A senha é obrigatória"
      })
    })

    const { email, password } = createSessionBody.parse(request.body)

    const user = await knexConnection("users").where({ email: email.toLowerCase()}).first()
    
    if(!user) {
      throw new AppError("Usuário ou senha invalida", 401)
    }

    const checkPassword = await compare(password, user.password)
    
    if(!checkPassword) {
      throw new AppError("Usuário ou senha invalida", 401)
    }
    

    const {secret, expiresIn} = auth.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    if (user.isAdmin) {
      return response.json({user, token, admin: true});
    }

    return response.json({user, token});

  }
}