/**
 * Query Index HTML / JS maker.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/* eslint-disable quotes */

import fs from "fs";
import { _ENTITIES } from "../constant";

export const queryHtml = (params: { [key: string]: string }): string => {
    const entities: string[] = [];
    const methods: string[] = [];
    const arrayEntities = Object.keys(_ENTITIES);
    const entitiesArray = Object.keys(_ENTITIES);
    Object.keys(_ENTITIES).forEach((key: string) => arrayEntities.push(_ENTITIES[key].singular));
    if (params.user == "true") {
        entitiesArray.push("CreateObservations");
        entitiesArray.push("createDB");
    }

    entitiesArray.forEach((elem: string) => {
        entities.push(`<option value="${elem}" ${elem == params.entity ? "selected" : ""}> ${elem} </option>`);
    });

    ["Get", "Post", "patch", "Delete"].forEach((elem: string) => {
        methods.push(`<option value="${elem}" ${elem == params.method ? "selected" : ""}> ${elem} </option>`);
    });

    const file = fs
        .readFileSync(__dirname + "/query.html", "utf-8")
        .replace('<link rel="stylesheet" href="./query.css">', "<style>" + fs.readFileSync(__dirname + "/query.css", "utf-8") + "</style>")
        .replace('<script src="query.js"></script>', "<script>" + fs.readFileSync(__dirname + "/query.js", "utf-8") + "</script>");

    const start = params.results ? "jsonObj = JSON.parse(`" + params.results + "`); jsonViewer.showJSON(jsonObj);" : "setJSON();";

    return file
        .replace("@Options@", params.user == "true" ? methods.join("\n") : '<option value="Get" selected>Get</option>')
        .replace("@entity@", entities.join("\n"))
        .replace("@options@", params.options ? params.options : "")
        .replace("@id@", params.id ? params.id : "")
        .replace("@version@", process.env.APIVERSION ? process.env.APIVERSION : "v1.0")
        .replace('"@array@"', arrayEntities.map((s: string) => `"${s}"`).join(","))
        .replace("// @start@", start)
        .replace("@datas@", params.datas ? params.datas : "");
};
