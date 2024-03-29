import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { compare, hash } from "bcrypt"
import { Request, Response } from "express"

import { AppError } from "../utils/AppError"
import { knexConnection } from "../database/knex"

export class UserAdminController {
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

    const created_at = new Date().toISOString()
    const updated_at = new Date().toISOString()

    const checkedEmailUsed = await knexConnection("users").where({ email })

    if (checkedEmailUsed.length > 0) {
      throw new AppError("Email já esta em uso")
    }

    await knexConnection("users").insert({
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      isAdmin: true,
      created_at,
      updated_at,
    })

    response.status(201).json({ message: "admin criado com sucesso" })
  }

  async update(request: Request, response: Response) {
    const updateUserBody = z.object({
      name: z
        .string({
          required_error: "O nome é obrigatório",
        })
        .min(3, { message: "Digite o nome completo" }),
      email: z
        .string({
          required_error: "O email é obrigatório",
        })
        .email({
          message: "Email invalido",
        }),
      newPassword: z
        .string()
        .min(8, { message: "a senha precisa de pelo menos oito dígitos" }),
      old_password: z
        .string()
        .min(8, { message: "a senha precisa de pelo menos oito dígitos" })
        .nullish(),
    })

    const user_id = request.user.id
    const { name, email, newPassword, old_password } = updateUserBody.parse(
      request.body
    )

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    const checkedEmailUsed: User = await knexConnection("users")
      .where({ email })
      .first()

    if (checkedEmailUsed && checkedEmailUsed.id !== user.id) {
      throw new AppError("esse email já esta em uso")
    }

    if (newPassword && !old_password) {
      throw new AppError("Precisa digitar a senha antiga para mudar")
    }

    if (newPassword && old_password) {
      const comparePassword = await compare(old_password, user.password)

      if (!comparePassword) {
        throw new AppError("a senha não corresponde com a antiga")
      }
      const hashNewPassword = await hash(newPassword, 8)

      user.password = hashNewPassword
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    await knexConnection("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: new Date().toISOString(),
    })

    response.json({ message: "usuário atualizado com sucesso" })
  }

  async delete(request: Request, response: Response) {
    const user_id = request.user.id

    await knexConnection("users").where({ id: user_id }).delete()
    response.json({
      message: "Usuário deletado com sucesso",
    })
  }
}
