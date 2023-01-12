import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"

import { AppError } from "../utils/AppError"
import { knexConnection } from "../database/knex"
import { DiskStorage } from "../providers/DiskStorage"

export class IngredientsController {
  async create(request: Request, response: Response) {
    const createRequestBody = z.object({
      name: z.string({ required_error: "o nome do ingrediente é obrigatório" }),
    })

    const user_id = request.user.id
    const { name } = createRequestBody.parse(request.body)
    const image = request.file?.filename
    const diskStorage = new DiskStorage()
    const id = uuidv4()

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    if (!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    const ingredientName = await knexConnection("ingredients")
      .select("name")
      .where({ name })
      .first()

    if (ingredientName) {
      throw new AppError("esse ingrediente já está cadastrado")
    }
   
    if (image) {
      const ingredientImage = await diskStorage.saveIngredientsFile(image)

      await knexConnection("ingredients").insert({
        id,
        name: name.toLowerCase(),
        image: ingredientImage,
      })

      response.status(201).json({ id, name, image })
    } else {
      throw new AppError("A imagem é obrigatória")
    }
  }

  async delete(request: Request, response: Response) {
    const { name } = request.params

    const user_id = request.user.id
    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    const ingredient: Ingredient = await knexConnection("ingredients")
      .where({ name })
      .first()

    if (!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    if (!ingredient) {
      throw new AppError("esse ingrediente não existe")
    }

    await knexConnection("foods_ingredients")
      .where({ ingredient_id: ingredient.id })
      .delete()

    await knexConnection("ingredients").where({ name }).delete()

    response.json({ message: "ingrediente deletado" })
  }

  async index(request: Request, response: Response) {
    const {name} = request.query
    const ingredients = await knexConnection("ingredients").whereLike(`name` ,`%${name}%`).orderBy(`name`)
    return response.json(ingredients)
  }

  async update(request: Request, response: Response) {
    const user_id = request.user.id
    const { name, imageUpdated } = request.body
    const { id } = request.params
    const diskStorage = new DiskStorage()

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    if (!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    const ingredient: Ingredient = await knexConnection("ingredients")
      .where({ id })
      .first()

    if (!ingredient) {
      throw new AppError("ingrediente não existe")
    }

    ingredient.name = name ?? ingredient.name

    if (imageUpdated) {
      try {
        await diskStorage.deleteIngredientsFile(ingredient.image)
        const filename = await diskStorage.saveIngredientsFile(imageUpdated)
        ingredient.image = filename
      } catch (err) {
        throw new AppError("erro ao atualizar imagem do ingrediente", 500)
      }
    }

    await knexConnection("ingredients").where({ id: ingredient.id }).update({
      name: ingredient.name,
      Image: ingredient.image,
    })

    response.json({ message: "ingrediente atualizado" })
  }
}
