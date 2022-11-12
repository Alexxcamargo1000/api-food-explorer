import { Request, Response } from "express";
import { number, z } from "zod";
import { knexConnection } from "../database/knex";
import { AppError } from "../utils/AppError";
import { v4 as uuidv4 } from 'uuid';
import { DiskStorage } from "../providers/DiskStorage";


//str.replace(/\s+/g, '-').toLowerCase(); slug
export class FoodController {



  async create(request: Request, response: Response){
    const createFoodBody  = z.object({
      name: z.string(),
      description: z.string(),
      priceInCents: z.string()
        .transform((price) => Number(price))
        .or(number().nonnegative({message: 'O valor nao pode ser negativo'})),
      typeFood: z.string(),
      ingredients: z.string().transform((ingredient) => ingredient.split(','))
    })

    const createFoodImageFile = z.string({
      required_error: "a imagem e obrigatória",
    })

    const {name, description, priceInCents, typeFood, ingredients} = createFoodBody.parse(request.body)
    const user_id = request.user.id
    const image  = createFoodImageFile.parse(request.file?.filename)
    const id = uuidv4()
    const diskStorage = new DiskStorage()
    const imageFile = await diskStorage.save(image)


    const checkTypeFood: TypeFood = await knexConnection("type_of_food").where({name: typeFood }).first()
    const user: User = await knexConnection("users").where({id: user_id}).first()

    if(!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    if(!checkTypeFood.id) {
      throw new AppError("esse tipo de alimento não esta cadastrado")
    }

    const food ={
      id,
      name,
      description,
      image: imageFile,
      priceInCents,
      user_id,
      type_of_food_id: checkTypeFood.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const createFood = await knexConnection("foods").insert(food)
     
    const ingredientsWithFoodID = ingredients.map(async ingredient => {

      await knexConnection("ingredients").where({name : ingredient}).update('food_id', food.id)
    })

    response.json(food)




  }
}

