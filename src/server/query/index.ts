/**
 * Query Index HTML / JS maker.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/* eslint-disable quotes */

import fs from "fs";

export const queryHtml = (identified: boolean): string => {
    const file = fs
        .readFileSync(__dirname + "/query.html", "utf-8")
        .replace('<link rel="stylesheet" href="./query.css">', "<style>" + fs.readFileSync(__dirname + "/query.css", "utf-8") + "</style>")
        .replace('<script src="query.js"></script>', "<script>" + fs.readFileSync(__dirname + "/query.js", "utf-8") + "</script>");

    return file
        .replace(
            "@Options@",
            identified
                ? `<option value='Post'>Post</option>
                <option value='Patch'>Patch</option>
                <option value='Delete'>Delete</option>`
                : ""
        )
        .replace(',"@array@"', identified ? `,"CreateObservations","createDB"` : "");
};
