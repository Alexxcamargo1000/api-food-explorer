import knex from "knex";
import knexConfig from "../../../knexfile"


export const knexConnection = knex(knexConfig)
