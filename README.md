const foods: Food[] = await knexConnection("foods").whereLike("name", `%${search}%`)

    const foodWithIngredient = await Promise.all( foods.map(async food => {
      const ingredientsId =  (await knexConnection("foods_ingredients").where({food_id: food.id}).select("ingredient_id as id")).map(ingredient => ingredient.id)
      
      
      const ingredients: Ingredients[] = await knexConnection("ingredients").whereIn("id",ingredientsId )

      return {
        food,
        ingredients
      }
    }))
    

    return response.json(foodWithIngredient)

    ======================================================================================


            const foodWithIngredientsByName = foodWithIngredients.reduce((namedFood: any, food) => {
          namedFood[food.name] = namedFood[food.name] || []
          namedFood[food.name].push(food)
          return namedFood
        }, {})
      
      
      
    response.json(foodWithIngredientsByName)


    =========================================================================


        const  foodWithIngredients: FoodWithIngredients[] = await knexConnection("foods_ingredients")
      .select([
        "foods_ingredients.id as id",

        "foods.id as food_id",
        "foods.name as name",
        "foods.slug as slug",
        "foods.priceInCents as priceInCents",
        "foods.image as food_image",

        "ingredients.id as ingredient_id",
        "ingredients.name as ingredient",
        "ingredients.image as ingredient_image",
      ],)
      .innerJoin("foods", "foods.id", "foods_ingredients.food_id")
      .innerJoin("ingredients", "ingredients.id", "foods_ingredients.ingredient_id")
      .whereLike("foods.name", `%${search}%`)
      .orWhereLike("ingredients.name", `%${search}%`)
      .orderBy("foods.name")

      const foodWithIngredientsByName = foodWithIngredients.reduce((namedFood: any, food) => {
        namedFood[food.name] = namedFood[food.name] || []
        namedFood[food.name].push(food)
        
        return namedFood
      },{})



      return response.json(foodWithIngredients)

      ==========================================================================

       if(!(food.name.includes(search) || ingredient.includes(search)) && food.name.includes(search) || ingredient.includes(search))


       __________________________________________________________________________
       ________________________________________________________________________-_

## update


    food.name = name ?? food.name
    food.slug = name?.replace(/\s+/g, '-').toLowerCase() ?? food.slug
    food.description = description ?? food.description
    food.priceInCents = priceInCents ?? food.priceInCents

    if(imageUpdated) {
      await diskStorage.delete(food.image)

      const filename = await diskStorage.save(imageUpdated)
      food.image = filename
    }
    
    
    
    food.updated_at = new Date().toISOString()
    await knexConnection("foods").where({id: food.id}).update(food)
    
