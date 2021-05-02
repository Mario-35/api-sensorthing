import { ParameterizedContext } from "koa";

export const host = (ctx: ParameterizedContext): string => {
    return ctx.request.headers["x-forwarded-host"] ? ctx.request.headers["x-forwarded-host"] : ctx.request.header.host;
};
