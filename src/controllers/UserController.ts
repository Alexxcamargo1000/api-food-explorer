import { Request, Response } from "express";
import { knexConnection } from "../database/knex";
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from "bcrypt";
import { AppError } from "../utils/AppError";
import { z } from "zod";


interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  created_at: Date;
  updated_at: Date;
}
const createUserBody = z.object({
  name: z.string({
    required_error: "o nome é obrigatório",
    invalid_type_error: "o nome tem que ser um texto",
  }).min(3, { message: "Digite o nome completo" }),
  email: z.string().email({
    message: "Email invalido"
  }),
  password: z.string({
    invalid_type_error: "erro de tipo"
  }).min(8, { message: "a senha precisa de pelo menos oito dígitos" }).optional(),
  old_password: z.string()
    .min(8, { message: "a senha precisa de pelo menos oito dígitos" }).optional()

})

export class UserController {
  async create(request: Request, response: Response) {

   

    const { name, email, password } = createUserBody.parse(request.body)

    
    if(password && email ) {
    
      const hashPassword = await hash(password, 8)
      
      const id = uuidv4()
      const created_at = new Date().toISOString()
      const updated_at = new Date().toISOString()

      const checkedEmailUsed = await knexConnection("users").where({ email })


      if (checkedEmailUsed.length > 0) {

        throw new AppError("Email já esta em uso")
      }

      await knexConnection("users").insert({
        id,
        name,
        email: email.toLowerCase(),
        password: hashPassword,
        created_at,
        updated_at
      })


      response.status(201).json({ message: 'usuário criado com sucesso' })

    } else {
      throw new AppError("o email e a senha é obrigatório ")
    }

  }

  async update(request: Request, response: Response) {

    const  user_id  = request.user.id
    const { name, email, password, old_password } = createUserBody.parse(request.body)

    const user: User = await knexConnection("users").where({id: user_id}).first()
    const checkedEmailUsed: User = await knexConnection("users").where({email}).first()

    if(checkedEmailUsed  && checkedEmailUsed.id !== user.id) {
      throw new AppError("esse email já esta em uso")
    }


    if (password && !old_password) {
      throw new AppError("Precisa digitar a senha nova para mudar");
    }

    if(password && old_password) {

      const comparePassword = await compare(old_password, user.password )
     
      if(!comparePassword) {
        throw new AppError("a senha não corresponde com a antiga")
      }
      const hashPassword = await hash(password, 8)


      user.password = hashPassword

    }

    

  
    const userUpdated = await knexConnection("users").where({ id: user_id }).update({
      name,
      email,
      password: user.password,
      updated_at: new Date().toISOString()

    })


    response.json(user)
  }
}