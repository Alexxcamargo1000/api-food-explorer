import { Request, Response } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { knexConnection } from "../database/knex";
import { DiskStorage } from "../providers/DiskStorage";
import { AppError } from "../utils/AppError";

export class IngredientsController {
  async create(request: Request, response: Response) {
    const createRequestBody = z.object({
      name: z.string({required_error: "o nome do ingrediente é obrigatório"})
    })

    const { name } = createRequestBody.parse(request.body)
    const image = request.file?.filename
    const user_id = request.user.id
    const diskStorage = new DiskStorage()
    const id = uuidv4()

    const user: User = await knexConnection("users").where({id: user_id}).first()
    const ingredientName = await knexConnection("ingredients").select("name").where({name}).first()

    if(ingredientName) {
      throw new AppError("esse ingrediente já está cadastrado")
      
    }

    if(!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    if(image) {
      const ingredientsImage = await diskStorage.saveIngredientsFile(image)

      await knexConnection("ingredients").insert({
        id,
        name: name.toLowerCase(),
        image: ingredientsImage,
      })
  
      response.json({id, name, image })
    } else {
      throw new AppError("A imagem é obrigatória")
    }

   
  }

  async delete(request: Request, response: Response) {
    const { name } = request.params
    
    const user_id = request.user.id
    const user: User = await knexConnection("users").where({id: user_id}).first()
    
    const ingredientName: Ingredients = await knexConnection("ingredients").select("name").where({name}).first()
    
    if(!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    if(!ingredientName) {
      throw new AppError("esse ingrediente não existe", 401)
    }

   await knexConnection("ingredients").where({name}).delete()
    
    response.json({message: "ingredient deletado"})
  }

  async index(request: Request, response: Response) {

    const ingredients = await knexConnection("ingredients")
    return response.json(ingredients)
  }

}