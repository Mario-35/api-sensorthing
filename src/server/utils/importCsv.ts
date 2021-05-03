/**
 * importCsv.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { Pool, PoolClient } from "pg";
import fs from "fs";
import copyFrom from "pg-copy-streams";
import { message } from ".";

const columns: string[] = ["date", "hour", "value"];

/**
 *
 * @param knex knex transaction
 * @param tableName tempTableName
 * @param filename csv file to import
 * @param sql SQL request to import
 * @param logger logger instance
 * @returns results infos
 */

export const importCsv = async (knex: Knex | Knex.Transaction, tableName: string, filename: string, sql: string, debug: boolean): Promise<string[]> => {
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
    };

    await knex.schema.createTable(tableName, (table) => {
        table.increments("id").unsigned().notNullable().primary();
        columns.forEach((value) => {
            table.string(value);
        });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    await new Promise<any>((resolve, reject) => {
        pool.connect((err: Error, client: PoolClient) => {
            if (err) {
                message(debug, "ERROR", "pool.connect error:", err);
                return;
            }

            const stream = client.query(copyFrom.from(copyCommand));
            const fileStream = fs.createReadStream(filename);

            fileStream.on("error", (err: Error) => {
                message(debug, "ERROR", "fileStream error", err);
                cleanup();
                reject(err);
            });

            fileStream.on("error", (err: Error) => {
                message(debug, "ERROR", "streamError", err);
                cleanup();
            });
            fileStream.on("end", async () => {
                message(debug, "INFO", `COPY TO ${tableName}`);
                const res = await client.query(sql);
                message(debug, "INFO", "SQL Executing Ok");
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
