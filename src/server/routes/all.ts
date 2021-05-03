/**
 * Routes for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Router from "koa-router";
import { apiAccess } from "../db/dataAccess";
import { _ENTITIES, ReturnResult, formatsResult, keyValue, keyString, returnFormat } from "../constant";
import { urlRequestToArgs, upload, hostName, resultBody, message } from "../utils/";
import { ParameterizedContext } from "koa";
import { queryHtml } from "../query/";
import { helperUsers } from "./_helpers";
import fs from "fs";
import { createDB } from "../db/createDB";

const router: Router = new Router();

const minimal = (ctx: ParameterizedContext): keyString => {
    return {
        user: helperUsers.ensureAuthenticated(ctx) ? "true" : "false",
        host: hostName(ctx),
        version: process.env.APIVERSION || "v1.0",
        ...ctx.query
    };
};

router.get("/(.*)", async (ctx) => {
    if (ctx.request.url.endsWith(`/${process.env.APIVERSION}/`)) {
        const expectedResponse: Record<string, unknown>[] = [{}];
        Object.keys(_ENTITIES).forEach((value: string) => {
            expectedResponse.push({
                name: _ENTITIES[value].name,
                url: `http://${hostName(ctx)}/${process.env.APIVERSION}/${value}`
            });
        });
        ctx.type = returnFormat[formatsResult.JSON];
        ctx.body = {
            value: expectedResponse.filter((elem) => Object.keys(elem).length)
        };
    } else if (ctx.request.url.toLowerCase().includes("/query")) {
        ctx.type = returnFormat[formatsResult.HTML];
        ctx.body = queryHtml(minimal(ctx));
    } else if (ctx.request.url.toLowerCase().endsWith("favicon.ico")) {
        try {
            const icon = fs.readFileSync(__dirname + "/favicon.ico");
            const cacheControl = `public, max-age=${8640}`;
            ctx.set("Cache-Control", cacheControl);
            ctx.type = returnFormat[formatsResult.ICON];
            ctx.body = icon;
        } catch (error) {
            message(true, "ERROR", error.message);
        }
    } else if (ctx.request.url.includes(`/${process.env.APIVERSION}/`)) {
        const args = urlRequestToArgs(ctx);
        if (args && args.ENTITY_NAME != "") {
            message(args.debug, "HEAD", `GET ${process.env.APIVERSION}`);
            const objectAccess = new apiAccess(ctx, args);
            if (objectAccess) {
                if (Number(args.ENTITY_ID) === 0) {
                    const results = await objectAccess.getAll();
                    if (results) {
                        const temp =
                            args.formatResult == formatsResult.JSON
                                ? {
                                      "@iot.count": results.id?.toString(),
                                      "@iot.nextLink": results.nextLink,
                                      "@iot.prevLink": results.prevLink,
                                      value: results["value"]
                                  }
                                : (ctx.body = results["value"]);
                        ctx.type = returnFormat[args.formatResult];
                        ctx.body = resultBody(args, temp as keyValue);
                    } else {
                        // element does not exist
                        ctx.throw(404);
                    }
                } else if (args.ENTITY_ID && args.ENTITY_ID > 0) {
                    const results: ReturnResult | undefined = await objectAccess.getSingle(
                        BigInt(args.ENTITY_ID),
                        args.PROPERTY_NAME,
                        args.RELATION_NAME,
                        args.value
                    );

                    if (results && results.body) {
                        ctx.type = returnFormat[args.formatResult];
                        ctx.body = resultBody(args, results.body);
                    } else {
                        ctx.throw(404, { detail: `id : ${args.ENTITY_ID} not found` });
                    }
                } else {
                    ctx.throw(400);
                }
            }
        } else {
            ctx.throw(400, { detail: "No entity found" });
        }
    } else {
        returnNoRoute();
    }
});

router.post("/(.*)", async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        ctx.throw(401);
    } else if (ctx.request.type.startsWith("application/json") && Object.keys(ctx.request.body).length > 0) {
        const args = urlRequestToArgs(ctx);
        if (args) {
            if (args.ENTITY_NAME == "createDB" && ctx) {
                message(args.debug, "HEAD", "POST createDB");
                const results = await createDB(ctx.request.body, ctx);
                returnFormat[formatsResult.JSON];
                ctx.body = results;
            } else {
                message(args.debug, "HEAD", "POST JSON");
                const objectAccess = new apiAccess(ctx, args);
                const result: ReturnResult | undefined | void = await objectAccess.add();
                if (result) {
                    returnFormat[formatsResult.JSON];
                    ctx.status = 201;
                    ctx.body = result.result ? result.result : result.value;
                }
            }
        } else {
            ctx.throw(400);
        }
    } else if (ctx.request.type.startsWith("multipart/form-data")) {
        const getDatas = async (): Promise<keyString> => {
            return new Promise(async (resolve, reject) => {
                await upload(ctx)
                    .then((data) => {
                        resolve(data);
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
                    .catch((data: any) => {
                        reject(data);
                    });
            });
        };
        const data = await getDatas();
        const args = urlRequestToArgs(ctx, data);

        if (args) {
            message(args.debug, "HEAD", "POST FORM");
            const objectAccess = new apiAccess(ctx, args);
            const result: ReturnResult | undefined | void = await objectAccess.add();
            if (args.extras) fs.unlinkSync(args.extras.file);
            if (result) {
                if (data["source"] == "query") {
                    ctx.type = "html";
                    ctx.body = queryHtml({
                        ...minimal(ctx),
                        results: JSON.stringify({ added: result.total, value: result.result })
                    });
                } else {
                    returnFormat[formatsResult.JSON];
                    ctx.status = 201;
                    ctx.body = result.result ? result.result : result.value;
                }
            } else {
                ctx.throw(400);
            }
        }
    } else {
        // payload is malformed
        ctx.throw(400, { details: "Payload is malformed" });
    }
});

router.patch("/(.*)", async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        ctx.throw(401);
    } else if (Object.keys(ctx.request.body).length > 0) {
        const args = await urlRequestToArgs(ctx);
        if (args) {
            message(args.debug, "HEAD", "PATCH");
            const objectAccess = new apiAccess(ctx, args);
            if (args.ENTITY_ID) {
                const result: ReturnResult | undefined | void = isNaN(Number(args.ENTITY_ID)) ? undefined : await objectAccess.update(BigInt(args.ENTITY_ID));
                if (result) {
                    returnFormat[formatsResult.JSON];
                    ctx.status = 200;
                    ctx.body = result.value;
                }
            } else {
                ctx.throw(400, { detail: "Id is required" });
            }
        } else {
            ctx.throw(404);
        }
    }
});

router.delete("/(.*)", async (ctx) => {
    if (!helperUsers.ensureAuthenticated(ctx)) {
        ctx.throw(401);
    } else {
        const args = await urlRequestToArgs(ctx);
        if (args) {
            message(args.debug, "HEAD", "DELETE");
            const objectAccess = new apiAccess(ctx, args);
            if (args && args.ENTITY_ID) {
                const result = await objectAccess.delete(BigInt(args.ENTITY_ID));
                if (result && result.id && result.id > 0) {
                    returnFormat[formatsResult.JSON];
                    ctx.status = 204;
                } else {
                    ctx.throw(404);
                }
            } else {
                ctx.throw(400, { detail: "Id is required" });
            }
        } else {
            ctx.throw(404);
        }
    }
});

function returnNoRoute(): void {
    throw new Error("Function not implemented.");
}

export default router.routes();
