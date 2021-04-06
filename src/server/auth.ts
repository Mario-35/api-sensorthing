/**
 * auth API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import passport from "koa-passport";
const LocalStrategy = require("passport-local").Strategy;
import bcrypt from "bcryptjs";
import { db } from "./db";

const options = {};

function comparePass(userPassword: string, databasePassword: string) {
    return bcrypt.compareSync(userPassword, databasePassword);
}

passport.serializeUser((user: any, done: any) => {
    done(null, user ? user.id : false);
});

passport.deserializeUser((id, done) => {
    return db("users")
        .where({ id })
        .first()
        .then((user: any) => {
            done(null, user ? user : false);
        })
        .catch((err: any) => {
            done(err, undefined);
        });
});

passport.use(
    new LocalStrategy(options, (username: string, password: string, done: any) => {
        db("users")
            .where({ username })
            .first()
            .then((user: any) => {
                if (!user) return done(null, false);
                if (!comparePass(password, user.password)) {
                    return done(null, false);
                } else {
                    process.env.USERID = user.id;
                    return done(null, user);
                }
            })
            .catch((err: any) => {
                return done(err);
            });
    })
);
