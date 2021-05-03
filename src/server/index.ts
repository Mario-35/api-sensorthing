/**
 * Index of The API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
require("dotenv").config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env" });
process.env.PGDATABASE = process.env.NODE_ENV && process.env.NODE_ENV.trim() == "test" ? "test" : process.env.PGDATABASE || "api";
process.env.PORT = process.env.PORT || "8029";

import Koa, { ParameterizedContext } from "koa";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import logger from "koa-logger";
import json from "koa-json";
import authRoutes from "./routes/auth";
import allRoutes from "./routes/all";
import cors from "@koa/cors";
import { createDB } from "./db/createDB";
import { db } from "./db";
import { message } from "./utils";

const app = new Koa();

// catch error and format result in JSON
app.use(async (ctx: ParameterizedContext, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            code: err.statusCode,
            message: err.message,
            detail: err.detail
        };
    }
});

// body parser
app.use(bodyParser());

// sessions
app.keys = [process.env.KEY ? process.env.KEY : "you shall not pass"];
app.use(session(app));

// logger for koa
if (process.env.NODE_ENV?.trim() != "test") {
    app.use(logger());
}

app.use(json());
app.use(cors());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// authentication
require("./auth");

// routes
app.use(authRoutes);
app.use(allRoutes);

message(true, "HEAD", "env", process.env.NODE_ENV);
message(true, "ENV", "Host", process.env.PGHOST);
message(true, "ENV", "Database", process.env.PGDATABASE);
message(true, "ENV", "Api version", process.env.APIVERSION);
message(true, "ENV", "Port", process.env.PGPORT);
message(true, "ENV", "User", process.env.PGUSER);
message(true, "ENV", "Listen port", process.env.PORT);
message(true, "ENV", "Debug", process.env.DEBUGSQL);

// Test database if not exist create it except if test (TDD for createDB)
db.raw("select 1+1 as result").catch(async (err) => {
    if (err.code == "3D000" && process.env.NODE_ENV && process.env.NODE_ENV.trim() != "test") {
        message(true, "ENV", "create DATABASE", process.env.PGDATABASE);
        await createDB({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE
        });
    }
});

export const server = app.listen(process.env.PORT, () => {
    message(true, "ENV", "Server listening on port", process.env.PORT);
});
