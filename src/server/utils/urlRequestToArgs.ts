/**
 * urlRequestToArgs.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { requestArgs, _DBDATAS, IEntityProperty, formatsResult, keyString } from "../constant";
import { createQuery } from "./odata";
import { ParameterizedContext } from "koa";
import { message } from "./message";

const excludeColumn: string[] = ["id"];

const getEntityNameFromString = (input: string): string | undefined => {
    const test: string | undefined = input
        .replace("Create", "")
        .match(/[a-zA-Z]/g)
        ?.join("")
        .trim();

    if (test) {
        return _DBDATAS.hasOwnProperty(test)
            ? test
            : Object.keys(_DBDATAS).filter(
                  (elem: string) => _DBDATAS[elem].name.toUpperCase() == test.toUpperCase() || _DBDATAS[elem].singular.toUpperCase() == test.toUpperCase()
              )[0];
    }
    return undefined;
};

export const urlRequestToArgs = (ctx: ParameterizedContext, extras?: keyString): requestArgs | undefined => {
    // URI Pattern: SERVICE_ROOT_URI/ENTITY_NAME(KEY_OF_THE_ENTITY)/LINK_NAME/$ref
    // URI Pattern: SERVICE_ROOT_URI/ENTITY_NAME(ENTITY_ID)/PROPERTY_NAME/$value
    const debug: boolean = ctx.request.url.includes("-debug-") || (extras !== undefined && extras.tab.includes("-debug-"));
    // remove parasites char
    if (extras !== undefined && extras.tab) {
        const temp = extras.tab.replace("-debug-", "");
        const tempSplit = temp.trim().split("&");
        tempSplit.forEach((elem: string) => {
            const elemSplit = elem.split("=");
            extras[elemSplit[0]] = elemSplit[1];
        });
    }

    let cleanStr = unescape(ctx.request.url.replace("-debug-", "")).replace("/Query", "");
    const getOneArg = (input: string): string | undefined => {
        if (ctx.request.url.includes(`${input}=`)) {
            const test = cleanStr.split("$");
            const format = test.filter((word) => word.startsWith(input))[0];
            cleanStr = cleanStr.replace(`$${format}`, "");
            return format.replace(`${input}=`, "");
        }
    };

    const getFormat = (): formatsResult => {
        if (cleanStr.includes("$value")) return formatsResult.TXT;
        if (testFormat == "CSV") return formatsResult.CSV;
        if (testFormat == "TXT") return formatsResult.TXT;
        return formatsResult.JSON;
    };

    const testFormat = getOneArg("resultFormat");

    let splitStr = cleanStr.split("?");

    const entitiesRequest: IEntityProperty[] = [];
    const entities: string[] = [];
    let last_index = 0;
    let version_index = 0;

    try {
        const result: requestArgs = {
            ENTITY_NAME: "",
            ENTITY_ID: undefined,
            PROPERTY_NAME: undefined,
            RELATION_NAME: undefined,
            value: false,
            baseUrl: "",
            version: "",
            entities: [],
            odada:
                ctx.request.querystring && splitStr[1]
                    ? createQuery(splitStr[1].trim())
                    : createQuery(`$top=${process.env.APILIMIT ? Number(process.env.APILIMIT) : 200}`),
            debug: debug,
            formatResult: getFormat(),
            extras: extras
        };

        splitStr = splitStr[0]
            .replace("//", "/")
            .split("/")
            .map((item) => {
                return item.trim();
            });
        // get SERVICE_ROOT_URI
        splitStr[0] = ctx.request.header.host && splitStr[0] === "" ? ctx.request.header.host : "error";

        splitStr.forEach((value: string, index: number) => {
            // get entities
            const input: string | undefined = getEntityNameFromString(splitStr[index]);
            if (input) {
                entitiesRequest.push(_DBDATAS[input]);
                last_index = index;
                entities.push(value.trim());
            }
            // test version
            if (value.match(/v{1}\d\.\d/g)) {
                version_index = index;
            }
        });

        if (last_index > 0) {
            const ENTITY_ID = splitStr[last_index].toUpperCase().match(/[0-9]/g);

            const index = entitiesRequest.length - 1;
            const propertyOrRelation =
                entities[index] === splitStr.slice(3)[0] ? undefined : splitStr.slice(3).filter((word) => !excludeColumn.includes(word))[0];
            const propertyOrRelationTest: boolean = propertyOrRelation
                ? entitiesRequest[0].relations && Object.keys(entitiesRequest[0].relations).includes(propertyOrRelation)
                : false;
            if (entitiesRequest[index] !== undefined) {
                result.ENTITY_NAME = entitiesRequest[index].name;
                result.ENTITY_ID = ENTITY_ID !== null ? BigInt(ENTITY_ID.join("")) : splitStr[splitStr.length - 1].indexOf("(") === -1 ? BigInt(0) : undefined;
                result.PROPERTY_NAME = propertyOrRelationTest ? undefined : propertyOrRelation;
                result.RELATION_NAME = propertyOrRelationTest ? propertyOrRelation : undefined;
                result.baseUrl = ctx.request.headers["x-forwarded-host"] ? ctx.request.headers["x-forwarded-host"][0] : splitStr[0];
                result.version = splitStr[version_index];
                result.entities = entities;
                result.value = ctx.request.url.includes("/$value");
            } else {
                message(true, "ERROR", "Error");
            }
        } else {
            if (splitStr[splitStr.length - 1] == "createDB") {
                result.ENTITY_NAME = "createDB";
            }
        }
        if (debug) {
            Object.keys(result).forEach((elem: string) => message(debug, "ENV", elem, result[elem]));
        }
        return result;
    } catch (error) {
        message(true, "ERROR", error.message);
        return undefined;
    }
};
