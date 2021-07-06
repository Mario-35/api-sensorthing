/**
 * Helpers for user admin.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { userAccess } from "../db/dataAccess/";
import { ParameterizedContext } from "koa";

export const helperUsers = {
    ensureAuthenticated: (context: ParameterizedContext): boolean => {
        return process.env.NODE_ENV?.startsWith("test") ? "true" : context.isAuthenticated();
    },

    ensureAdmin: (context: ParameterizedContext): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (context.isAuthenticated()) {
                userAccess
                    .getSingle(context.state.user.id)
                    .then((user) => {
                        if (user && user[0].admin) resolve(true);
                        resolve(false);
                    })
                    .catch(() => {
                        reject(false);
                    });
            }
            return false;
        });
    }
};
