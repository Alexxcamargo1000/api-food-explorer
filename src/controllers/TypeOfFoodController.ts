import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { knexConnection } from "../database/knex";
import { AppError } from "../utils/AppError";

export class TypeFood  {


  async create(request: Request, response: Response) {
    const { name } = request.body
    const user_id = request.user.id

    const id = uuidv4()

    const user = await knexConnection("users").where({ id: user_id }).first()

    if(!user.isAdmin) {
      throw new AppError("Não autorizado")
    }

    await knexConnection("type_of_food").insert({
      id,
      name
    })

    return response.status(201).json({
      message: "Criado"
    })
  }
}