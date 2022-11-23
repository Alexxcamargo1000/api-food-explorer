interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  created_at: string;
  updated_at: string;

}

interface Food {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  priceInCents: number;
  user_id: string;
  type_of_food_id: string;
  created_at: string;
  updated_at: string;
}


interface Ingredient {
  id: string;
  name: string;
  image: string;
} 

interface TypeOfFood {
  id: string;
  name: string;
}

interface FoodIngredient {
  id: string;
  ingredient_id: string;
  food_id: string;
}