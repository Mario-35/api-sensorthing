/**
 * Routes for user administration.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Router from "koa-router";
import passport from "koa-passport";

import { userAccess } from "../db/dataAccess/";
import { helperUsers } from "./_helpers";

import { DefaultState, Context } from "koa";
import { formatsResult, keyString, returnFormat } from "../constant";
import { db } from "../db";
import { CreateHtml } from "./views";

const router = new Router<DefaultState, Context>();

const emailIsValid = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const checkPassword = (str: string): boolean => {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters that are letters, numbers or the underscore
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/.test(str);
};

router.get(["/register", "/api/register"], async (ctx: Context) => {
    const createHtml = new CreateHtml();
    ctx.type = returnFormat[formatsResult.HTML];
    ctx.body = createHtml.login({ login: false });
});

router.post(["/register", "/api/register"], async (ctx: Context, next) => {
    const body = ctx.request.body;
    const why: keyString = {};
    // Username
    if (body.username.trim() === "") {
        why["username"] = "Empty username";
    } else {
        const user = await db("user").select("username").where({ username: ctx.request.body.username }).first();
        if (user) why["username"] = "Already present";
    }
    // Email
    if (body.email.trim() === "") {
        why["email"] = "Empty email";
    } else {
        if (emailIsValid(body.email) === false) why["email"] = "Invalid email";
    }
    // Password
    if (body.password.trim() === "") {
        why["password"] = "Empty password";
    }
    // Repeat password
    if (body.repeat.trim() === "") {
        why["repeat"] = "Empty repeat password";
    } else {
        if (body.password != body.repeat) {
            why["repeat"] = "Password are different";
        } else {
            if (checkPassword(body.password) === false) why["password"] = "Invalid password";
        }
    }
    console.log(why);
    if (Object.keys(why).length === 0) {
        try {
            await userAccess.add(ctx.request.body);
            return await passport.authenticate("local", async (err, user, info, status) => {
                if (user) {
                    ctx.status = 200;
                    ctx.login(user);
                    ctx.redirect("/status");
                } else {
                    ctx.status = 400;
                    ctx.redirect("/register");
                }
            })(ctx, next);
        } catch (error) {
            ctx.redirect("/error");
        }
    } else {
        const createHtml = new CreateHtml();
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = createHtml.login({ login: false, body: ctx.request.body, why: why });
    }
});

router.get(["/login", "/api/login"], async (ctx) => {
    if (helperUsers.ensureAuthenticated(ctx)) {
        ctx.redirect("/status");
    } else {
        const createHtml = new CreateHtml();
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = ctx.body = createHtml.login({ login: true });
    }
});

router.post(["/login", "/api/login"], async (ctx: Context, next) => {
    return await passport.authenticate("local", (err, user) => {
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
        const user = await userAccess.getSingle(ctx.state.user.id);
        const createHtml = new CreateHtml();
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = createHtml.status({
            username: user[0]["username"],
            host: process.env.PGHOST || "",
            database: process.env.PGDATABASE || "",
            admin: user[0]["admin"] == true ? "admin" : "user"
        });
    } else {
        ctx.redirect("/login");
    }
});

router.get(["/error", "/api/error"], async (ctx: Context) => {
    const createHtml = new CreateHtml();
    ctx.type = returnFormat[formatsResult.HTML];
    ctx.body = createHtml.error("what ?");
});

export default router.routes();
