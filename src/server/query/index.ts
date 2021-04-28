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
import { camelCase } from "../utils";

export const queryHtml = (params: { [key: string]: string }): string => {
    const action = `http://${params.host}/v1.0/CreateObservations`;
    const relations: { [key: string]: string[] } = {};

    Object.keys(_ENTITIES).forEach((key: string) => {
        relations[key] = Object.keys(_ENTITIES[key].relations);
    });

    if (params.user == "true") {
        relations["CreateObservations"] = [];
        relations["createDB"] = [];
    }

    let file = fs
        .readFileSync(__dirname + "/query.html", "utf-8")
        .replace('<link rel="stylesheet" href="./query.css">', "<style>" + fs.readFileSync(__dirname + "/query.css", "utf-8") + "</style>")
        .replace('<script src="query.js"></script>', "<script>" + fs.readFileSync(__dirname + "/query.js", "utf-8") + "</script>");

    const start = params.results ? "jsonObj = JSON.parse(`" + params.results + "`); jsonViewer.showJSON(jsonObj);" : "";

    Object.keys(params).forEach((element: string) => {
        file = file.replace(`,param${camelCase(element, true)}=""`, `,param${camelCase(element, true)}="${params[element]}"`);
    });

    return file
        .replace(`"@relations@"`, JSON.stringify(relations))
        .replace("// @start@", start)
        .replace("@action@", action)
        .replace("@datas@", params.datas ? params.datas : "");
};
