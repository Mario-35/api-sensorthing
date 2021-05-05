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

import { DefaultState, Context } from "koa";
import { formatsResult, keyString, returnFormat } from "../constant";
import { db } from "../db";
const router = new Router<DefaultState, Context>();
const css = fs.readFileSync(__dirname + "/views/auth.css", "utf-8");
const formField = ["username", "email", "password", "repeat"];

const mergeFileCss = (file: string): string => {
    const html = fs.readFileSync(file, "utf-8");
    return html.replace("<style></style>", "<style>" + css + "</style>");
};

const emailIsValid = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const checkPassword = (str: string): boolean => {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters that are letters, numbers or the underscore
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/.test(str);
};

router.get(["/register", "/api/register"], async (ctx: Context) => {
    const temp = mergeFileCss(__dirname + "/views/login.html");
    ctx.type = returnFormat[formatsResult.HTML];
    ctx.body = temp.replace("@register@", "checked").replace("@login@", "");
});

router.post(["/register", "/api/register"], async (ctx: Context, next) => {
    const body = ctx.request.body;
    const why: keyString = {};
    // Username
    if (body.username.trim() === "") {
        why["username"] = "Empty username";
    } else {
        const user = await db("users").select("username").where({ username: ctx.request.body.username }).first();
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

    if (Object.keys(why).length === 0) {
        await userAccess.add(ctx.request.body);
        return await passport.authenticate("local", (err, user, info, status) => {
            if (user) {
                ctx.login(user);
                ctx.redirect("/status");
            } else {
                ctx.status = 400;
                ctx.redirect("/register");
            }
        })(ctx, next);
    } else {
        let temp = mergeFileCss(__dirname + "/views/login.html");
        formField.forEach((element: string) => {
            temp = temp.replace(`<b class="@${element}_alert@"></b>`, why[element] ? `<div class='alert'>${why[element]}</div>` : "");
            temp = temp.replace(`@value_${element}@`, ctx.request.body[element] ? ctx.request.body[element] : "");
        });
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = temp.replace("@register@", "checked").replace("@login@", "");
    }
});

router.get(["/login", "/api/login"], async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        let temp = mergeFileCss(__dirname + "/views/login.html");
        formField.forEach((element: string) => {
            temp = temp.replace(`@value_${element}@`, "");
        });
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = temp.replace("@register@", "").replace("@login@", "checked");
    } else {
        ctx.redirect("/status");
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
        const temp = mergeFileCss(__dirname + "/views/status.html");
        const user = await userAccess.getSingle(ctx.state.user.id);
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = temp
            .replace("@username@", user[0].username)
            .replace("@host@", process.env.PGHOST || "")
            .replace("@database@", process.env.PGDATABASE || "")
            .replace("@admin@", user[0].admin == true ? "admin" : "user");
    } else {
        ctx.redirect("/login");
    }
});

router.get(["/admin", "/api/admin"], async (ctx: Context) => {
    if (await helperUsers.ensureAdmin(ctx)) {
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = fs.createReadStream(__dirname + "/views/admin.html");
    } else {
        ctx.redirect("/login");
    }
});

router.get(["/error", "/api/error"], async (ctx: Context) => {
    ctx.type = returnFormat[formatsResult.HTML];
    ctx.body = mergeFileCss(__dirname + "/views/error.html");
});

export default router.routes();
