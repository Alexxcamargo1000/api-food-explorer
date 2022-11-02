import knex from "knex";

import {configKnex} from "../../config/knexConfig"

export const knexConnection = knex(configKnex.development)
