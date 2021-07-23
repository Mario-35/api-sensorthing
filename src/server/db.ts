/**
 * Knex.js database client and query builder for PostgreSQL.
 *
 * @see https://knexjs.org/
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 */

import knex from "knex";

export const db = knex({
    client: "pg",
    connection: {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    },
    pool: {
        min: 0,
        // min: process.env.NODE_ENV === "prod" ? 1 : 0,
        max: 1
    },
    debug: true
});
