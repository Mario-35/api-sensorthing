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
import { csvFile } from "../constant";

let columns: string[] = [];

/**
 *
 * @param knex knex transaction
 * @param tableName tempTableName
 * @param filename csv file to import
 * @param sql SQL request to import
 * @param logger logger instance
 * @returns results infos
 */

const readline = require("readline");

async function prepareImportFile(paramsFile: csvFile): Promise<string | undefined> {
    const createSql = (params: string): string => {
        return `with updated as (insert into "observation" ("datastream_id", "featureofinterest_id", "phenomenonTime", "result")
                                select ${paramsFile.dataStreamId}, 1, 
                                ${params},
                                CASE "${paramsFile.tempTable}".value${paramsFile.column}
                                WHEN '---' THEN
                                NULL
                                ELSE
                                cast(REPLACE(value${paramsFile.column},',','.') as float)
                                END
                                from "${paramsFile.tempTable}" returning id) select count(*) over () as total, updated.id from updated limit ${
            process.env.APILIMIT ? Number(process.env.APILIMIT) : 200
        }`;
    };
    const fileStream = fs.createReadStream(paramsFile.filename);
    const regexDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
    const regexHour = /^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/g;
    const regexDateHour = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4} [0-9]{2}[:][0-9]{2}$/g;

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in filename as a single line break.

    for await (const line of rl) {
        const splitColumns = line.split(";");
        if (regexDateHour.test(splitColumns[0]) == true) {
            const nbCol = (line.match(/;/g) || []).length;
            message(paramsFile.debug, "INFO", "Date Hour");
            columns = ["datehour"];
            for (let i = 0; i < nbCol; i++) {
                columns.push(`value${i + 1}`);
            }
            fileStream.destroy();
            return createSql(`TO_TIMESTAMP("${paramsFile.tempTable}".datehour, 'DD/MM/YYYY HH24:MI:SS')`);
        } else if (regexDate.test(splitColumns[0]) == true && regexHour.test(splitColumns[1]) == true) {
            message(paramsFile.debug, "INFO", "date ; hour");
            const nbCol = (line.match(/;/g) || []).length;

            columns = ["date", "hour"];
            for (let i = 0; i < nbCol - 1; i++) {
                columns.push(`value${i + 1}`);
            }
            fileStream.destroy();
            return createSql(`TO_TIMESTAMP(concat("${paramsFile.tempTable}".date, "${paramsFile.tempTable}".hour), 'DD/MM/YYYYHH24:MI:SS:MS')`);
        }
    }
    return undefined;
}

export const importCsv = async (knex: Knex | Knex.Transaction, paramsFile: csvFile): Promise<string[]> => {
    const results: string[] = [];
    const pool = new Pool({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    });

    const sql = await prepareImportFile(paramsFile);

    if (sql) {
        await knex.schema.createTable(paramsFile.tempTable, (table) => {
            table.increments("id").unsigned().notNullable().primary();
            columns.forEach((value) => {
                table.string(value);
            });
        });

        const copyCommand = `COPY ${paramsFile.tempTable} (${columns.join(",")}) FROM STDIN WITH (FORMAT csv, DELIMITER ';'${paramsFile.header})`;

        const cleanup = () => {
            pool.end();
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        await new Promise<any>((resolve, reject) => {
            pool.connect((err: Error, client: PoolClient) => {
                if (err) {
                    message(paramsFile.debug, "ERROR", "pool.connect error:", err);
                    return;
                }

                const stream = client.query(copyFrom.from(copyCommand)).on("error", (err: Error) => {
                    reject(err);
                });

                const fileStream = fs.createReadStream(paramsFile.filename);

                fileStream.on("error", (err: Error) => {
                    message(paramsFile.debug, "ERROR", "fileStream error", err);
                    cleanup();
                    reject(err);
                });

                fileStream.on("error", (err: Error) => {
                    message(paramsFile.debug, "ERROR", "streamError", err);
                    cleanup();
                });
                fileStream.on("end", async () => {
                    message(paramsFile.debug, "INFO", "COPY TO ", paramsFile.tempTable);

                    const res = await client.query(sql);
                    message(paramsFile.debug, "INFO", "SQL Executing", "Ok");
                    // ATTENTION the first value is total lines updated
                    results.push(res.rows[0].total);
                    res.rows
                        .map((elem: { [key: string]: string }) => elem["id"])
                        .forEach((element: string) => {
                            results.push(element);
                        });
                    await knex.schema.dropTable(paramsFile.tempTable);
                    cleanup();
                    resolve(true);
                });

                fileStream.pipe(stream);
            });
        });
    }
    return results;
};
