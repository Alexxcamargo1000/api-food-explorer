import { Request, Response } from "express";

interface Food {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  priceInCents: number;
  user_id: string;
  type_of_food_id: string;
  created_at: Date;
  updated_at: Date;
}

//str.replace(/\s+/g, '-').toLowerCase(); slug
export class FoodController {

  async create(request: Request, response: Response){
  const {name, description, priceInCents, typeFood} = request.body


  }
}
