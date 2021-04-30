import { IErrorApi } from "../../server/constant";
import fs from "fs";
import path from "path";
import { db } from "../../server/db";

const pjson = require("../../../package.json");

const temp: IErrorApi = {
    code: 0,
    message: "null"
};

export const errorKeys = Object.keys(temp);

export interface IApiInput {
    api: string;
    apiName: string;
    apiDescription: string;
    apiExample?: string;
    apiError?: string[];
    apiParam?: string[];
    apiSuccess?: string[];
    apiParamExample?: Record<string, unknown>;
    result: any;
}

export interface IApiDoc {
    api: string;
    apiDescription: string;
    apiVersion: string;
    apiName: string;
    apiGroup: string;
    apiParam?: string[];
    apiError?: string[];
    apiSuccess?: string[];
    apiExample?: string;
    apiParamExample?: string;
    apiSuccessExample?: string;
    apiErrorExample?: string;
    apiUse?: string;
    text?: string;
    apiSampleRequest?: string;
}

const _HEADERS: { [key: string]: string } = {
    apiParamExample: "{json} Request-Example:",
    apiSuccessExample: "{json} Success-Response:",
    apiErrorExample: "{json} Error-Response:"
};

export const prepareToApiDoc = (input: IApiInput, Entity: string): IApiDoc => {
    return {
        api: input.api,
        apiVersion: "1.0.0",
        apiName: input.apiName,
        apiGroup: Entity,
        apiDescription: input.apiDescription,
        apiExample: input.apiExample,
        apiError: input.apiError,
        apiParam: input.apiParam,
        apiSuccess: input.apiSuccess,
        apiParamExample: input.result && input.result.request && input.result.request._data ? JSON.stringify(input.result.request._data, null, 4) : undefined,
        apiSampleRequest: input.api.startsWith("{get}") && input.apiExample ? `proxy${input.apiExample.replace(")", "")}` : "",
        apiSuccessExample:
            input.result.type === "text/plain" || input.result.type === "text/csv"
                ? input.result.text
                : input.result && input.result.body
                ? JSON.stringify(input.result.body, null, 4)
                : undefined
    };
};

export const generateApiDoc = (input: IApiDoc[], filename: string): boolean => {
    const proxy = pjson.apidoc.proxy;

    const lines: string[] = [];

    input.forEach((element: IApiDoc) => {
        lines.push("/**");
        for (const [key, value] of Object.entries(element)) {
            if (key === "apiSuccess" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiSuccess ${tab.replace("[", "").replace("]", "")}`);
                });
            } else if (key === "apiParam" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiParam ${tab}`);
                });
            } else if (key === "apiExample" && value) {
                lines.push(`*    @${key} {js} Example usage:`);
                lines.push(`*          ${value}`);
            } else if (key === "apiError" && value) {
                value.forEach((tab: string) => {
                    lines.push(`*    @apiError ${tab}`);
                });
            } else if (Object.keys(_HEADERS).includes(key) && value) {
                lines.push(`*    @${key} ${_HEADERS[key]}`);
                const successLines: string[] = value.split("\n");
                successLines.forEach((successLine: string) => {
                    lines.push(`*    ${successLine}`);
                });
            } else if (value) {
                lines.push(`*    @${key} ${value}`);
            }
        }

        lines.push("*/\n");
    });
    lines.forEach((element, index) => {
        lines[index] = element.replace("proxy", proxy);
    });
    filename = "../apiDocs/" + filename;
    fs.writeFileSync(path.resolve(__dirname, filename), `${lines.join("\n")}`, {
        encoding: "utf-8"
    });

    return true;
};

export const createListColumns = async (table: string, fn: any): Promise<void> => {
    const resultSuccess: string[] = [];
    const resultParam: string[] = [];

    const columns = await db.raw(`
  select c.table_schema, st.relname as TableName, c.column_name, c.data_type, c.is_nullable, pgd.description
  from pg_catalog.pg_statio_all_tables as st
  inner join information_schema.columns c
  on c.table_schema = st.schemaname
  and c.table_name = st.relname
  left join pg_catalog.pg_description pgd
  on pgd.objoid=st.relid
  and pgd.objsubid=c.ordinal_position
  where st.relname = '${table}';`);

    columns["rows"].forEach((element: { [key: string]: string }) => {
        const type = ["integer", "bigint", "numeric", "decimal"].includes(element["data_type"])
            ? "number"
            : element["data_type"] === "boolean"
            ? "boolean"
            : element["data_type"] === "jsonb"
            ? "JSONObject"
            : element["data_type"] === "ARRAY" && element.udt === "_text"
            ? "string[]"
            : element["data_type"].startsWith("timestamp") || element["data_type"] === "date"
            ? "Date"
            : element["data_type"] === "USER-DEFINED"
            ? "Enum"
            : "string";

        if (element["column_name"] != "id" && !element["column_name"].trim().endsWith("_id")) {
            resultSuccess.push(`{${type}} ${element["column_name"]} ${element["description"]}`);
            resultParam.push(
                element["is_nullable"].toString() === "NO"
                    ? `{${type}} ${element["column_name"]} ${element["description"]}`
                    : `{${type}} [${element["column_name"]}] ${element["description"]}`
            );
        }
    });
    fn(null, resultSuccess, resultParam);
};
