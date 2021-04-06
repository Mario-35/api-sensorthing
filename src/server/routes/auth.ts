/**
 * Routes for user administration.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Router from "koa-router";
import passport from "koa-passport";

import fs from "fs";

import { userAccess } from "../db/dataAccess/";
import { helperUsers } from "./_helpers";

// const router = new Router();
import { DefaultState, Context } from "koa";
const router = new Router<DefaultState, Context>();
const css = fs.readFileSync(__dirname + "/views/auth.css", "utf-8");

const mergeFileCss = (file: string): string => {
    const html = fs.readFileSync(file, "utf-8");
    return html.replace("<style></style>", "<style>" + css + "</style>");
};

router.get(["/register", "/api/register"], async (ctx: Context) => {
    const temp = mergeFileCss(__dirname + "/views/login.html");
    ctx.type = "html";
    ctx.body = temp.replace("@register@", "checked").replace("@login@", "");
});

router.post(["/register", "/api/register"], async (ctx: Context, next) => {
    await userAccess.add(ctx.request.body);
    return passport.authenticate("local", (err, user, info, status) => {
        if (user) {
            ctx.login(user);
            ctx.redirect("/status");
        } else {
            ctx.status = 400;
            ctx.redirect("/register");
        }
    })(ctx, next);
});

router.get(["/login", "/api/login"], async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        const temp = mergeFileCss(__dirname + "/views/login.html");
        ctx.type = "html";
        ctx.body = temp.replace("@register@", "").replace("@login@", "checked");
    } else {
        ctx.redirect("/status");
    }
});

router.post(["/login", "/api/login"], async (ctx: Context, next) => {
    return passport.authenticate("local", (err, user) => {
        if (user) {
            ctx.login(user);
            ctx.redirect("/status");
        } else {
            ctx.status = 400;
            ctx.redirect("/login");
        }
    })(ctx, next);
});

router.get(["/logout", "/api/logout"], async (ctx: Context) => {
    if (helperUsers.ensureAuthenticated(ctx)) {
        ctx.logout();
        ctx.session = null;
        ctx.redirect("/login");
    } else {
        ctx.body = { success: false };
        ctx.throw(401);
    }
});

router.get(["/status", "/api/status"], async (ctx: Context) => {
    if (helperUsers.ensureAuthenticated(ctx)) {
        const temp = mergeFileCss(__dirname + "/views/status.html");
        ctx.type = "html";
        ctx.body = mergeFileCss(__dirname + "/views/status.html");
        ctx.body = temp
            .replace("@username@", process.env.PGUSER || "")
            .replace("@username@", process.env.PGUSER || "")
            .replace("@database@", process.env.PGDATABASE || "")
            .replace("@host@", process.env.PGHOST || "");
    } else {
        ctx.redirect("/login");
    }
});

router.get(["/admin", "/api/admin"], async (ctx: Context) => {
    if (await helperUsers.ensureAdmin(ctx)) {
        ctx.type = "html";
        ctx.body = fs.createReadStream(__dirname + "/views/admin.html");
    } else {
        ctx.redirect("/login");
    }
});

router.get(["/error", "/api/error"], async (ctx: Context) => {
    ctx.type = "html";
    ctx.body = mergeFileCss(__dirname + "/views/error.html");
});

export default router.routes();
