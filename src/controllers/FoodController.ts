import { Request, Response } from "express";
import { number, z } from "zod";
import { knexConnection } from "../database/knex";
import { AppError } from "../utils/AppError";



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
      ingredients: z.string().transform((ingredient) => ingredient.split(',') )
    })

    const createFoodImageFile = z.string({
      required_error: "a imagem e obrigatória",
    })

    const {name, description, priceInCents, typeFood, ingredients} = createFoodBody.parse(request.body)

    const image  = createFoodImageFile.parse(request.file?.filename)


    const ca = ingredients.map( async ingredient =>  {
      const existIngredient = await knexConnection("ingredients").where({ name: ingredient }).first()
      
      if (!existIngredient) {
        throw new AppError("esse ingrediente não existe")
      }

      // await knexConnection("ingredients").where({ name: ingredient}).update({food_id: foood.id})
    
    })


    response.json({name, description, priceInCents, typeFood, ingredients})




  }
}

