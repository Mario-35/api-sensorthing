/**
 * User dataAccess.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { IUserDataAccess } from "../interfaces";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { IUser } from "../interfaces";

export const userAccess: IUserDataAccess = {
    getAll: async () => {
        return await db.table("users").select("*");
    },

    getSingle: async (id: string) => {
        return await db("users")
            .select("*")
            .where({ id: parseInt(id) });
    },

    add: async (data: IUser) => {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(data.password, salt);
        return await db("users")
            .insert({
                username: data.username,
                email: data.email,
                password: hash
            })
            .returning("*");
    }
};
