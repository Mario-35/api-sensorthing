/**
 * createDB.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import knex from "knex";
import { asyncForEach, message } from "../utils/index";
import { triggers } from "./triggers";
import { ParameterizedContext } from "koa";
import { IUser } from "./interfaces";
import { userAccess } from "./dataAccess";
import { _DBDATAS, connectionParams } from "../constant";
import Knex from "knex";

/**
 *
 * @param argsParams pg connection params
 * @param ctx context with user connection (ctx.state.user) for reconnect user
 * @returns log results
 */

const admin = (): Knex => {
    return knex({
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
};

export const destroyDB = async (argsParams: connectionParams): Promise<void> => {
    if (!argsParams || !argsParams.database || !argsParams.host || !argsParams.password || !argsParams.user) {
        return;
    }

    const dbAdmin = admin();

    await dbAdmin
        .raw("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity  WHERE pg_stat_activity.datname = ? AND pid <> pg_backend_pid()", [
            argsParams.database
        ])
        .then(async () => {
            await dbAdmin.raw(`DROP Database IF EXISTS ${argsParams.database}`).catch((err: Error) => {
                message(true, "ERROR", err.message);
            });
        });
};

export const createDB = async (argsParams: connectionParams, ctx?: ParameterizedContext): Promise<{ [key: string]: string }> => {
    if (!argsParams || !argsParams.database || !argsParams.host || !argsParams.password || !argsParams.user) {
        return {};
    }
    const results: { [key: string]: string } = { "Create Database": argsParams.database };
    const dbAdmin = admin();

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

    await db
        .raw("CREATE EXTENSION IF NOT EXISTS postgis;")
        .then(() => {
            results["Create postgis"] = "Ok";
        })
        .catch((err: Error) => {
            message(true, "ERROR", err.message);
        });

    await asyncForEach(Object.keys(_DBDATAS), async (keyName: string) => {
        const tabInsertion: string[] = [];
        const tabComment: string[] = [];
        let insertion = "";
        Object.keys(_DBDATAS[keyName].columns).forEach((column) => {
            tabInsertion.push(`"${column}" ${_DBDATAS[keyName].columns[column].create}`);
            tabComment.push(`comment on column "${_DBDATAS[keyName].table}"."${column}" is '${_DBDATAS[keyName].columns[column].comment}';`);
        });
        const constraints = _DBDATAS[keyName].constraints;

        if (constraints) {
            const tabTemp: string[] = [];
            Object.keys(constraints).forEach((constraint) => {
                tabTemp.push(`CONSTRAINT "${constraint}" ${constraints[constraint]}`);
            });
            insertion = `${tabInsertion.join(", ")}, ${tabTemp.join(", ")}`;
        } else {
            insertion = `${tabInsertion.join(", ")}`;
        }
        await db
            .raw(`CREATE TABLE public.${_DBDATAS[keyName].table} (${insertion});`)
            .then(() => {
                results[`Create table ${_DBDATAS[keyName].table}`] = "Ok";
            })
            .catch((err: Error) => {
                results[`Create table ${_DBDATAS[keyName].table}`] = err.message;
                message(true, "ERROR", err.message);
            });

        const indexes = _DBDATAS[keyName].indexes;
        const tabTemp: string[] = [];
        if (indexes)
            Object.keys(indexes).forEach((index) => {
                tabTemp.push(`CREATE INDEX "${index}" ${indexes[index]}`);
            });

        await db
            .raw(tabTemp.join(";"))
            .then(() => {
                results[`Create indexes for ${keyName}`] = "Ok";
            })
            .catch((err: Error) => {
                results[`Create indexes for ${keyName}`] = "Error";
                message(true, "ERROR", err.message);
            });

        await db
            .raw(tabComment.join(" "))
            .then(() => {
                results[`Create comments for ${_DBDATAS[keyName].table}`] = "Ok";
            })
            .catch((err: Error) => {
                message(true, "ERROR", err.message);
            });

        const after = _DBDATAS[keyName].after;
        if (after) {
            await db
                .raw(after)
                .then(() => {
                    results[`Something to do after for ${_DBDATAS[keyName].table}`] = "Ok";
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
