import { Request, Response } from "express";
import { knexConnection } from "../database/knex";

export class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body

    
    response.status(201).json({ name, email })
  }
}