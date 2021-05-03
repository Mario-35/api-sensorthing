/**
 * createDB.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import knex from "knex";
import { asyncForEach, message } from "../utils/index";
import { triggers, databaseDatas } from "../utils/datas";
import { ParameterizedContext } from "koa";
import { connectionDB } from "../constant";
import { IUser } from "./interfaces";
import { userAccess } from "./dataAccess";

/**
 *
 * @param argsParams pg connection params
 * @param ctx context with user connection (ctx.state.user) for reconnect user
 * @returns log results
 */

export const createDB = async (argsParams: connectionDB, ctx?: ParameterizedContext): Promise<{ [key: string]: string }> => {
    if (!argsParams || !argsParams.database || !argsParams.host || !argsParams.password || !argsParams.user) {
        return {};
    }
    const results: { [key: string]: string } = { "Create Database": argsParams.database };

    const dbAdmin = knex({
        client: "pg",

        connection: {
            host: process.env.PGHOST,
            user: "postgres",
            password: process.env.PGADMIN,
            database: "postgres"
        },

        pool: {
            min: 0,
            max: 1
        },
        debug: false
    });

    const db = knex({
        client: "pg",

        connection: argsParams,

        pool: {
            min: 0,
            max: 1
        },
        debug: false
    });
    await dbAdmin
        .raw(`DROP Database IF EXISTS ${argsParams.database}`)
        .then(async () => {
            results["DROP Database"] = "Ok";
            await dbAdmin
                .raw(`CREATE Database ${argsParams.database}`)
                .then(async () => {
                    results["Create Database"] = `${argsParams.database} OK`;
                    await dbAdmin.raw(`select count(*) FROM pg_user WHERE usename = '${argsParams.user}';`).then(async (res) => {
                        if (res.rowCount < 1) {
                            await dbAdmin
                                .raw(`CREATE ROLE ${argsParams.user} WITH PASSWORD '${argsParams.password}' SUPERUSER;`)
                                .then(() => {
                                    results["Create ROLE"] = `${argsParams.user} Ok`;
                                })
                                .catch((e) => e);
                        } else {
                            await dbAdmin
                                .raw(`ALTER ROLE ${argsParams.user} WITH PASSWORD '${argsParams.password}' SUPERUSER;`)
                                .then(() => {
                                    results["Create/Alter ROLE"] = `${argsParams.user} Ok`;
                                    dbAdmin
                                        .destroy()
                                        .then(() => {
                                            results["Admin connection destroy"] = "Ok";
                                        })
                                        .catch((err: Error) => {
                                            message(true, "ERROR", err.message);
                                        });
                                })
                                .catch((err: Error) => {
                                    message(true, "ERROR", err.message);
                                });
                        }
                    });
                })
                .catch((err: Error) => {
                    message(true, "ERROR", err.message);
                });
        })
        .catch((err: Error) => {
            message(true, "ERROR", err.message);
        });

    await db
        .raw("CREATE EXTENSION IF NOT EXISTS postgis;")
        .then(() => {
            results["Create postgis"] = "Ok";
        })
        .catch((err: Error) => {
            message(true, "ERROR", err.message);
        });

    await asyncForEach(Object.keys(databaseDatas), async (tableName: string) => {
        const tabInsertion: string[] = [];
        const tabComment: string[] = [];
        let insertion = "";
        Object.keys(databaseDatas[tableName].columns).forEach((element) => {
            tabInsertion.push(`"${element}" ${databaseDatas[tableName].columns[element].create}`);
            tabComment.push(`comment on column "${tableName}"."${element}" is '${databaseDatas[tableName].columns[element].comment}';`);
        });

        if (databaseDatas[tableName].hasOwnProperty("constraints") && databaseDatas[tableName].constraints) {
            const tabTemp: string[] = [];
            Object.keys(databaseDatas[tableName].constraints).forEach((constraint) => {
                tabTemp.push(`CONSTRAINT "${constraint}" ${databaseDatas[tableName].constraints[constraint]}`);
            });
            insertion = `${tabInsertion.join(", ")}, ${tabTemp.join(", ")}`;
        } else {
            insertion = `${tabInsertion.join(", ")}`;
        }

        await db
            .raw(`CREATE TABLE public.${tableName} (${insertion});`)
            .then(() => {
                results[`Create table ${tableName}`] = "Ok";
            })
            .catch((err: Error) => {
                message(true, "ERROR", err.message);
            });

        if (databaseDatas[tableName].hasOwnProperty("indexes")) {
            const tabTemp: string[] = [];
            Object.keys(databaseDatas[tableName].indexes).forEach((index) => {
                tabTemp.push(`CREATE INDEX "${index}" ${databaseDatas[tableName].indexes[index]}`);
            });

            await db
                .raw(tabTemp.join(";"))
                .then(() => {
                    results[`Create indexes for ${tableName}`] = "Ok";
                })
                .catch((err: Error) => {
                    message(true, "ERROR", err.message);
                });
        }

        await db
            .raw(tabComment.join(" "))
            .then(() => {
                results[`Create comments for ${tableName}`] = "Ok";
            })
            .catch((err: Error) => {
                message(true, "ERROR", err.message);
            });

        if (databaseDatas[tableName].hasOwnProperty("after")) {
            await db
                .raw(databaseDatas[tableName].after)
                .then(() => {
                    results[`Something to do after for ${tableName}`] = "Ok";
                })
                .catch((err: Error) => {
                    message(true, "ERROR", err.message);
                });
        }
    });

    const user: IUser =
        ctx && ctx.state.user
            ? {
                  username: ctx.state.user.username,
                  email: ctx.state.user.email,
                  password: ctx.state.user.password,
                  admin: ctx.state.user.admin
              }
            : {
                  username: argsParams.user,
                  email: "default@email.com",
                  password: argsParams.password,
                  admin: false
              };

    await userAccess.add(user);
    results["Create functions & trigger"] = await db
        .raw(triggers)
        .then(() => "Ok")
        .catch((e) => e);

    await db.raw(`select count(*) FROM pg_user WHERE usename = '${argsParams.user}';`).then(() => {
        results["Create DB"] = "Ok";
    });
    return results;
};
