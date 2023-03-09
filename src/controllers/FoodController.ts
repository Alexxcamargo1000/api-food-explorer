import { number, z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"

import { AppError } from "../utils/AppError"
import { DiskStorage } from "../providers/DiskStorage"
import { knexConnection } from "../database/knex"

export class FoodController {
  async create(request: Request, response: Response) {
    console.log(request.file);

  
    const createFoodBody = z.object({
      name: z.string(),
      description: z.string(),
      priceInCents: z
        .string()
        .transform((price) => Number(price))
        .or(number().nonnegative({ message: "O valor nao pode ser negativo" })),
      typeFood: z.string(),
      ingredients: z.string().transform((ingredient) => ingredient.split(",")),
    })

    const createFoodImageFile = z.string({
      required_error: "a imagem e obrigatória",
    })

    const { name, description, priceInCents, typeFood, ingredients } =
      createFoodBody.parse(request.body)

    const image = createFoodImageFile.parse(request.file?.filename)
    const id = uuidv4()
    const diskStorage = new DiskStorage()
      
    const user_id = request.user.id

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    if (!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }
        

    const checkTypeFood: TypeOfFood = await knexConnection("type_of_food")
      .where({ name: typeFood })
      .first()

    
    if (!checkTypeFood) {
      throw new AppError("esse tipo de alimento não esta cadastrado")
    }

    
    const food: Food = {
      id,
      name,
      slug: name.replace(/\s+/g, "-").toLowerCase(),
      description,
      image: '',
      priceInCents,
      user_id,
      type_of_food_id: checkTypeFood.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const checkSlugExist = await knexConnection("foods").where({slug: food.slug}).first() 
    
    if(checkSlugExist) {
      throw new AppError("essa comida já existe")
    }
    
    const hasIngredients = !!ingredients[0]
    
    if (hasIngredients) {
      const idIngredients: Ingredient[] = await knexConnection("ingredients")
        .whereIn("name", ingredients)

      if (idIngredients.length < 1) {
        throw new AppError("o ingredient não existe")
      }

      const imageFile = await diskStorage.save(image)
      food.image = imageFile

      await knexConnection("foods").insert(food)

      idIngredients.forEach(async ( ingredientId ) => {
        try {
          const id = uuidv4()
          await knexConnection("foods_ingredients").insert({
            id,
            ingredient_id: ingredientId.id,
            food_id: food.id,
          })
        } catch (err) {
          console.log(err)

          throw new AppError(
            "erro do servidor ao cadastrar o ingrediente",
            500
          )
        }
      })

      return response.json({ food, idIngredients })
    } else {
      throw new AppError("não é possível cadastrar uma comida sem o ingrediente")
    }

  }

  async show(request: Request, response: Response) {
    const { slug } = request.params

    const food: Food = await knexConnection("foods").where({ slug }).first()

    if (!food) {
      throw new AppError("alimento nao cadastrado")
    }
    
    const ingredientsId = (
      await knexConnection("foods_ingredients")
        .where({ food_id: food.id })
        .select("ingredient_id as id")
    ).map((ingredient: Ingredient) => ingredient.id)


    const type: TypeOfFood = await knexConnection("type_of_food").where({id: food.type_of_food_id}).first()


    const ingredients: Ingredient[] = await knexConnection("ingredients")
      .whereIn("id", ingredientsId)

    return response.json({
      food,
      ingredients,
      category: type.name
    })
  }

  async index(request: Request, response: Response) {
    const createQueryParams = z.object({
      search: z.string().optional(),
    })

    const { search } = createQueryParams.parse(request.query)

    const foods: Food[] = await knexConnection("foods")

    const foodWithIngredient = await Promise.all(
      foods.map(async (food) => {
        
        const ingredientsId = (
          await knexConnection("foods_ingredients")
            .where({ food_id: food.id })
            .select("ingredient_id as id")
        ).map((ingredient) => ingredient.id)

        const ingredients: Ingredient[] = await knexConnection(
          "ingredients"
        ).whereIn("id", ingredientsId)

        return {
          food,
          ingredients,
        }
      })
    )

    if (search) {
      const searchFoodWithIngredient = [] as typeof foodWithIngredient

      foodWithIngredient.forEach(({ food, ingredients }) => {
        ingredients.forEach(({ name: ingredient }) => {
        
          const hasFood = food.name.toLowerCase().includes(search.toLowerCase())
          const hasIngredient = ingredient.toLowerCase().includes(search.toLowerCase())
          
          
          if (hasFood || hasIngredient) {
            searchFoodWithIngredient.push({ food, ingredients })
          }
        })
      })

      if (searchFoodWithIngredient.length < 1) {
        throw new AppError("essa comida não existe")
      
      }

      let searchWithoutRepeated = [] as typeof searchFoodWithIngredient

      searchFoodWithIngredient.forEach(({food, ingredients}) => {
        let duplicated  = searchWithoutRepeated.findIndex(foodIng => {
            return food.id == foodIng.food.id;
        }) > -1;
    
        if(!duplicated) {
          searchWithoutRepeated.push({food,ingredients });
        }
    });
    

      return response.json(searchWithoutRepeated)
    }

    return response.json(foodWithIngredient)
  }

  async delete(request: Request, response: Response) {
    const user_id = request.user.id

    const { slug } = request.params

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()

    if (!user.isAdmin) {
      throw new AppError("Usuário não autorizado")
    }

    const food: Food = await knexConnection("foods").where({ slug }).first()

    if (!food) {
      throw new AppError("comida não encontrado")
    }

    await knexConnection("foods_ingredients")
      .where({ food_id: food.id })
      .delete()

    await knexConnection("foods").where({ id: food.id }).delete()

    return response.json({ message: `${food.name} foi deletado com sucesso` })
  }

  async update(request: Request, response: Response) {
    const createFoodBody = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      typeFood: z.string().optional(),
      priceInCents: z
        .string()
        .optional()
        .transform((price) => Number(price))
        .or(number().nonnegative({ message: "O valor nao pode ser negativo" })),
      ingredients: z
        .string()
        .optional()
        .transform((ingredient) => {
          if (ingredient) {
            return ingredient.split(",")
          }
        }),
    })

    const user_id = request.user.id
    const { name, description, priceInCents, ingredients, typeFood } =
      createFoodBody.parse(request.body)
    const imageUpdated = request.file?.filename
    const { slug } = request.params
    const diskStorage = new DiskStorage()

    const user: User = await knexConnection("users")
      .where({ id: user_id })
      .first()
    if (!user.isAdmin) {
      throw new AppError("não autorizado", 401)
    }

    const food: Food = await knexConnection("foods").where({ slug }).first()
    const {id:  typeFoodID}: TypeOfFood = await knexConnection("type_of_food").where({ name: typeFood }).first()

    if (!food) {
      throw new AppError("A comida não existe")
    }
    if (priceInCents < 0) {
      throw new AppError("O valor da comida não pode ser negativo")
    }

    food.name = name ?? food.name
    food.slug = name?.replace(/\s+/g, "-").toLowerCase() ?? food.slug
    food.description = description ?? food.description
    food.priceInCents = priceInCents ?? food.priceInCents
    food.type_of_food_id = typeFoodID ?? food.type_of_food_id

    if (imageUpdated) {
      await diskStorage.delete(food.image)

      const filename = await diskStorage.save(imageUpdated)
      food.image = filename
    }

    food.updated_at = new Date().toISOString()
    
    await knexConnection("foods").where({ id: food.id }).update(food)

    if (ingredients) {
      const findIngredients: Ingredient[] = await knexConnection(
        "ingredients"
      ).whereIn("name", ingredients)

      if (findIngredients.length < 1) {
        throw new AppError("adicione pelo menos um ingrediente valido")
      }

      await knexConnection("foods_ingredients")
        .where({ food_id: food.id })
        .delete()

      findIngredients.forEach(async (ingredient) => {
        await knexConnection("foods_ingredients").insert({
          id: uuidv4(),
          food_id: food.id,
          ingredient_id: ingredient.id,
        })
      })
    }

    return response.json({ message: "comida atualizada com sucesso" })
  }
}
