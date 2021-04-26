/**
 * importCsv.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { Pool, PoolClient } from "pg";

/**
 *
 * @param inputFile string of filename
 */

import fs from "fs";
import copyFrom from "pg-copy-streams";

const columns: string[] = ["station", "sensor", "date", "hour", "cumul", "value", "info", "unit"];

export const importCsv = async (knex: Knex | Knex.Transaction, tableName: string, filename: string, sql: string): Promise<string[]> => {
    const results: string[] = [];
    const pool = new Pool({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    });

    const copyCommand = `COPY ${tableName} (${columns.join(",")}) FROM STDIN WITH (FORMAT csv, DELIMITER ';')`;

    const cleanup = () => {
        pool.end();
        // process.exit();
    };

    await knex.schema.createTable(tableName, (table) => {
        table.increments("id").unsigned().notNullable().primary();
        columns.forEach((value) => {
            table.string(value);
        });
    });

    await new Promise<any>((resolve, reject) => {
        pool.connect((err: Error, client: PoolClient) => {
            if (err) {
                console.log("pool.connect error:", err);
                return;
            }

            const stream = client.query(copyFrom.from(copyCommand));
            const fileStream = fs.createReadStream(filename);

            fileStream.on("error", (err) => {
                console.log("fileStream error", err);
                cleanup();
                reject(err);
            });

            fileStream.on("error", (err: Error) => {
                console.log("streamError", err);
                cleanup();
            });
            fileStream.on("end", async () => {
                process.stdout.write(`COPY TO ${tableName}\r`);
                const res = await client.query(sql);
                process.stdout.write("SQL Executing Ok\r");
                // ATTENTION the first value is total lines updated
                results.push(res.rows[0].total);
                res.rows
                    .map((elem: { [key: string]: string }) => elem["id"])
                    .forEach((element: string) => {
                        results.push(element);
                    });
                await knex.schema.dropTable(tableName);
                cleanup();
                resolve(true);
            });

            fileStream.pipe(stream);
        });
    });
    return results;
};
