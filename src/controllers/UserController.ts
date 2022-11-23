import { z } from "zod"
import { hash } from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"

import { AppError } from "../utils/AppError"
import { knexConnection } from "../database/knex"


export class UserController {
  async create(request: Request, response: Response) {
    const createUserBody = z.object({
      name: z
        .string({
          required_error: "o nome é obrigatório",
          invalid_type_error: "o nome tem que ser um texto",
        })
        .min(3, { message: "Digite o nome completo" }),
      email: z.string().email({
        message: "Email invalido",
      }),
      password: z
        .string()
        .min(8, { message: "a senha precisa de pelo menos oito dígitos" }),
    })

    const { name, email, password } = createUserBody.parse(request.body)

    const hashPassword = await hash(password, 8)

    const id = uuidv4()
    const created_at = new Date().toISOString()
    const updated_at = new Date().toISOString()

    const checkedEmailUsed = await knexConnection("users").where({ email })

    if (checkedEmailUsed.length > 0) {
      throw new AppError("Email já esta em uso")
    }

    await knexConnection("users").insert({
      id,
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      created_at,
      updated_at,
    })

    response.status(201).json({ message: "usuário criado com sucesso" })
  }
}
