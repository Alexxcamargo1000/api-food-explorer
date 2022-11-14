interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  created_at: Date;
  updated_at: Date;

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


interface Ingredients {
  id: string;
  name: string;
  image: string;
} 

interface TypeFood {
  id: string;
  name: string;
}

interface FoodsIngredients {
  id: string;
  ingredient_id: string;
  food_id: string;
}