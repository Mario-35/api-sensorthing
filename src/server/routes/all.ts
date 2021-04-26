/**
 * Routes for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Router from "koa-router";
import { apiAccess } from "../db/dataAccess";
import { IErrorApi, _ENTITIES, ReturnResult, formatResult, keyValue, requestArgs, keyString } from "../constant";
import { urlRequestToRequestArgs, createDB, upload } from "../utils/";
import { ParameterizedContext } from "koa";
import { Parser } from "json2csv";
import { queryHtml } from "../query/";
import { helperUsers } from "./_helpers";
import fs from "fs";

const router: Router = new Router();

const _NotExist = "That element does not exist.";

const _STANDARD_PARAMS: IErrorApi = {
    code: 400,
    errno: 777,
    error: "Bad Request",
    message: "Something went wrong."
};

const errorCode = (ctx: ParameterizedContext, code: number, errno?: number, message?: string) => {
    ctx.type = "application/json";
    ctx.status = code;
    ctx.body = {
        code: ctx.status,
        errno: errno ? errno : 777,
        error: "Bad Request",
        message: message ? message : "Something went wrong."
    };
};

const notAuthorized = (ctx: ParameterizedContext) => {
    ctx.type = "text/plain; charset=utf-8";
    ctx.status = 401;
    ctx.body = "/login";
};

const convertToCsv = (inputDatas: keyValue | keyValue[] | undefined): string => {
    const opts = { delimiter: ";" };
    if (inputDatas)
        try {
            const parser = new Parser(opts);
            const csv = parser.parse(inputDatas);
            return csv;
        } catch (err) {
            console.error(err);
        }
    return "";
};

const returnType = (args: requestArgs): string => {
    switch (args.formatResult) {
        case formatResult.CSV: {
            return "text/csv";
        }
        case formatResult.TXT: {
            return "text/plain";
        }
        default: {
            return "application/json";
        }
    }
};

const returnBody = (args: requestArgs, input: string | keyValue | keyValue[]): string | keyValue | keyValue[] => {
    switch (args.formatResult) {
        case formatResult.CSV: {
            return convertToCsv(input as keyValue);
        }
        case formatResult.TXT: {
            return input as string;
        }
        default: {
            return input;
        }
    }
};

router.get("/(.*)", async (ctx) => {
    const host = ctx.request.headers["x-forwarded-host"] ? ctx.request.headers["x-forwarded-host"] : ctx.request.header.host;
    if (ctx.request.url.endsWith(`/${process.env.APIVERSION}/`)) {
        const expectedResponse: Record<string, unknown>[] = [{}];
        Object.keys(_ENTITIES).forEach((value: string) => {
            expectedResponse.push({
                name: _ENTITIES[value].name,
                url: `http://${host}/${process.env.APIVERSION}/${value}`
            });
        });
        ctx.type = "application/json";
        ctx.body = {
            value: expectedResponse.filter((elem) => Object.keys(elem).length)
        };
    } else if (ctx.request.url.toLowerCase().includes("/query")) {
        ctx.type = "html";
        ctx.body = queryHtml({ user: helperUsers.ensureAuthenticated(ctx) ? "true" : "false", host: host, ...ctx.query });
    } else if (ctx.request.url.includes(`/${process.env.APIVERSION}/`)) {
        const args = urlRequestToRequestArgs(ctx);
        if (args && args.ENTITY_NAME != "") {
            const objectAccess = new apiAccess(ctx, args);
            if (args.ENTITY_ID === 0) {
                const results = await objectAccess.getAll();
                if (results) {
                    const temp =
                        args.formatResult == formatResult.JSON
                            ? {
                                  "@iot.count": results.id?.toString(),
                                  "@iot.nextLink": results.nextLink,
                                  value: results["value"]
                              }
                            : (ctx.body = convertToCsv(results["value"]));
                    ctx.type = returnType(args);
                    ctx.body = returnBody(args, temp as keyValue);
                } else {
                    // element does not exist
                    errorCode(ctx, 404, undefined, _NotExist);
                }
            } else if (args.ENTITY_ID && args.ENTITY_ID > 0) {
                const results: ReturnResult | undefined = await objectAccess.getSingle(
                    BigInt(args.ENTITY_ID),
                    args.PROPERTY_NAME,
                    args.RELATION_NAME,
                    args.value
                );
                if (results && results.body) {
                    ctx.type = returnType(args);
                    ctx.body = returnBody(args, results.body);
                } else {
                    // element does not exist:
                    errorCode(ctx, 404, undefined, _NotExist);
                }
            } else {
                errorCode(ctx, 402, undefined, _NotExist);
            }
        } else {
            errorCode(ctx, 404);
        }
    }
});

router.post("/(.*)", async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        notAuthorized(ctx);
    } else if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.request.body).length > 0) {
        const args = urlRequestToRequestArgs(ctx);
        if (args) {
            if (args.ENTITY_NAME == "createDB" && ctx) {
                const results = await createDB(ctx.request.body, ctx);
                ctx.type = "application/json";
                ctx.body = results;
            } else {
                const objectAccess = new apiAccess(ctx, args);
                const result: ReturnResult | undefined | void = await objectAccess.add().catch((error) => console.error(error));
                if (result) {
                    if (result.error) {
                        errorCode(ctx, result.error.code ? result.error.code : 400, result.error.errno, `${result.error.message}`);
                    } else {
                        ctx.type = "application/json";
                        ctx.status = 201;
                        ctx.body = result.result ? result.result : result.value;
                    }
                } else {
                    errorCode(ctx, 400);
                }
            }
        } else {
            errorCode(ctx, 402);
        }
    } else if (ctx.request.type.startsWith("multipart/form-data")) {
        const getDatas = async (): Promise<keyString> => {
            return new Promise(async (resolve, reject) => {
                await upload(ctx)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((data: any) => {
                        reject(data);
                    });
            });
        };

        const data = await getDatas();

        const args = urlRequestToRequestArgs(ctx, data);
        if (args) {
            const objectAccess = new apiAccess(ctx, args);
            const result: ReturnResult | undefined | void = await objectAccess.add().catch((error) => console.error(error));
            if (args.extras) fs.unlinkSync(args.extras.file);

            if (result) {
                if (result.error) {
                    errorCode(ctx, result.error.code ? result.error.code : 400, result.error.errno, `${result.error.message}`);
                } else {
                    if (data["source"] == "query") {
                        ctx.type = "html";
                        ctx.body = queryHtml({
                            user: helperUsers.ensureAuthenticated(ctx) ? "true" : "false",

                            results: JSON.stringify({ added: result.total, value: result.result }),
                            ...ctx.query
                        });
                    } else {
                        ctx.type = "application/json";
                        ctx.status = 201;
                        ctx.body = result.result ? result.result : result.value;
                    }
                }
            } else {
                errorCode(ctx, 400);
            }
        }
    } else {
        // payload is malformed
        errorCode(ctx, 400);
    }
});

router.patch("/(.*)", async (ctx) => {
    try {
        if (!helperUsers.ensureAuthenticated(ctx)) {
            notAuthorized(ctx);
        } else if (Object.keys(ctx.request.body).length > 0) {
            const args = await urlRequestToRequestArgs(ctx);
            if (args) {
                const objectAccess = new apiAccess(ctx, args);
                if (args.ENTITY_ID) {
                    const result: ReturnResult | undefined | void = isNaN(args.ENTITY_ID) ? undefined : await objectAccess.update(BigInt(args.ENTITY_ID));
                    if (result) {
                        if (result.error) {
                            errorCode(ctx, result.error.code ? result.error.code : 400, result.error.errno, `${result.error.message}`);
                        } else {
                            ctx.type = "application/json";
                            ctx.status = 200;
                            ctx.body = result.value;
                        }
                    } else {
                        errorCode(ctx, 404, undefined, _NotExist);
                    }
                }
            } else {
                errorCode(ctx, 404);
            }
        }
    } catch (err) {
        errorCode(ctx, 404);
    }
});

router.delete("/(.*)", async (ctx) => {
    try {
        if (!helperUsers.ensureAuthenticated(ctx)) {
            notAuthorized(ctx);
        } else {
            const args = await urlRequestToRequestArgs(ctx);
            if (args) {
                const objectAccess = new apiAccess(ctx, args);
                if (args && args.ENTITY_ID) {
                    const result = await objectAccess.delete(BigInt(args.ENTITY_ID));
                    if (result && result.id && result.id > 0) {
                        ctx.type = "application/json";
                        ctx.status = 204;
                    } else {
                        errorCode(ctx, 404, undefined, _NotExist);
                    }
                }
            } else {
                errorCode(ctx, 404);
            }
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = _STANDARD_PARAMS;
    }
});

export default router.routes();
