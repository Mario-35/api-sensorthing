/**
 * hostName.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { ParameterizedContext } from "koa";

export const hostName = (ctx: ParameterizedContext): string => {
    return ctx.request.headers["x-forwarded-host"] ? ctx.request.headers["x-forwarded-host"][0] : ctx.request.header.host ? ctx.request.header.host : "";
};
