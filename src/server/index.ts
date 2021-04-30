/**
 * Index of The API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
require("dotenv").config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env" });
process.env.PGDATABASE = process.env.NODE_ENV && process.env.NODE_ENV.trim() == "test" ? "test" : process.env.PGDATABASE || "api";

import Koa, { ParameterizedContext } from "koa";
import favicon from "koa-favicon";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import passport from "koa-passport";
import logger from "koa-logger";
import json from "koa-json";
import authRoutes from "./routes/auth";
import allRoutes from "./routes/all";
import cors from "@koa/cors";
import { createDB } from "./utils";
import { db } from "./db";
import { message } from "./utils";

const PORT = process.env.PORT || 8029;

const app = new Koa();

// favicon
app.use(favicon(__dirname + "/favicon.ico"));

app.use(async (ctx: ParameterizedContext, next) => {
    try {
        await next();
    } catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            code: err.statusCode,
            message: err.message,
            detail: err.detail
        };
    }
});

// Apply Koa-Body To All Routes

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

// server
message("env", process.env.NODE_ENV, true);
message("Host", process.env.PGHOST);
message("Database", process.env.PGDATABASE);
message("Api version", process.env.APIVERSION);
message("Port", process.env.PGPORT);
message("User", process.env.PGUSER);
message("Listen port", process.env.PORT);
message("Debug", process.env.DEBUGSQL);

// Test database if not exist create it except if test (TDD for createDB)
db.raw("select 1+1 as result").catch(async (err) => {
    if (err.code == "3D000" && process.env.NODE_ENV && process.env.NODE_ENV.trim() != "test") {
        // if (err.code == "3D000") {
        message("create DATABASE", process.env.PGDATABASE);
        await createDB({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE
        });
    }
});

export const server = app.listen(PORT, () => {
    message("Server listening on port", PORT, true);
});
