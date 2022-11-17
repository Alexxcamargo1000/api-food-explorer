import { Request, Response } from "express";
import { any, number, ObjectPair, TypeOf, z } from "zod";
import { knexConnection } from "../database/knex";
import { AppError } from "../utils/AppError";
import { v4 as uuidv4 } from 'uuid';
import { DiskStorage } from "../providers/DiskStorage";


interface FoodWithIngredients {
  id: string;
  food_id: string;
  "name": string;
  slug: string;
  priceInCents: string;
  food_image: string;
  
  ingredient_id: string;
  ingredient: string;
  ingredient_image: string;

}

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

    if(!checkTypeFood) {
      throw new AppError("esse tipo de alimento não esta cadastrado")
    }

    const food :Food ={
      id,
      name,
      slug: name.replace(/\s+/g, '-').toLowerCase().trim(),
      description,
      image: imageFile,
      priceInCents,
      user_id,
      type_of_food_id: checkTypeFood.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }


    await knexConnection("foods").insert(food)


    if(ingredients.length > 0 ) {
      const idIngredients: Ingredients[] = await knexConnection("ingredients")
      .select("id")
      .whereIn("name", ingredients)

      if(idIngredients.length < 1) {
        throw new AppError("o ingredient não existe")
      }
      

      idIngredients.forEach(async ingredientId => {

      try {
        const id = uuidv4()
        await knexConnection("foods_ingredients").insert({
        id,
        ingredient_id: ingredientId.id,
        food_id: food.id
      })
      } catch (err) {
        console.log(err);
        
        throw new AppError("erro do servidor cadastrar",500)
      }
    } )

    return response.json({food, idIngredients})

    }

    

    return response.json({food})




  }

  async show(request: Request, response: Response) {
    const {slug} = request.params

    
    const food: Food = await knexConnection("foods").where({slug}).first()
    console.log(food);

    if(!food) {
      throw new AppError("alimento nao cadastrado")
    }
    const ingredientsId =  (await knexConnection("foods_ingredients").where({food_id: food.id}).select("ingredient_id as id")).map(ingredient => ingredient.id)



    const ingredients = await knexConnection("ingredients").whereIn("id",ingredientsId )
    
    return response.json({
      food,
      ingredients
    })
  }

  async index(request: Request, response: Response) {
    const createQueryParams = z.object({
      search: z.string().optional()
    })
    
    const { search } = createQueryParams.parse(request.query)
    
    const foods: Food[] = await knexConnection("foods")

    const foodWithIngredient = await Promise.all( foods.map(async food => {
      const ingredientsId =  (await knexConnection("foods_ingredients").where({food_id: food.id}).select("ingredient_id as id")).map(ingredient => ingredient.id)
      
      
      const ingredients: Ingredients[] = await knexConnection("ingredients").whereIn("id",ingredientsId )

      return {
        food,
        ingredients
      }
    }))

    if(search) {

     
      const searchFoodWithIngredient = [] as typeof foodWithIngredient
       
      foodWithIngredient.forEach(({food, ingredients}) => {
            
        ingredients.forEach(({name: ingredient}) => {
         if(!(food.name.includes(search) || ingredient.includes(search)) 
            && food.name.includes(search) || ingredient.includes(search) ) {
  
              searchFoodWithIngredient.push({food, ingredients})
          }
        })
      })

      if(searchFoodWithIngredient.length < 1) {
        return response.json({message: "não foi encontrado nada"})
      }

      return response.json(searchFoodWithIngredient)

    }
    

    return response.json(foodWithIngredient)

  }

}

