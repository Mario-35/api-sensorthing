import Busboy from "busboy";
import path from "path";
import util from "util";
import fs from "fs";
import { ParameterizedContext } from "koa";
import { keyString } from "../constant";

export const upload = (ctx: ParameterizedContext): Promise<keyString> => {
    const data: keyString = {};
    return new Promise(async (resolve, reject) => {
        const uploadPath = "./upload";
        const allowedExtName = ["csv", "txt", "json"];
        if (!fs.existsSync(uploadPath)) {
            const mkdir = util.promisify(fs.mkdir);
            await mkdir(uploadPath).catch((error) => {
                data.state = "ERROR";
                reject(error);
            });
        }

        const busboy = new Busboy({ headers: ctx.req.headers });

        busboy.on("file", (fieldname, file, filename) => {
            const extname = path.extname(filename).substr(1);
            if (!allowedExtName.includes(extname)) {
                data.state = "UPLOAD UNALLOWED FILE";
                file.resume();
                reject(data);
            } else {
                file.pipe(fs.createWriteStream(uploadPath + "/" + filename));
                data["file"] = uploadPath + "/" + filename;
                file.on("data", (chunk) => {
                    data.state = `GET ${chunk.length} bytes`;
                });
                file.on("error", (error: Error) => {
                    console.error(error);
                });
                file.on("end", () => {
                    data.state = "UPLOAD FINISHED";
                    data[fieldname] = uploadPath + "/" + filename;
                });
            }
        });
        busboy.on("field", (fieldname, value) => {
            data[fieldname] = value;
        });
        busboy.on("error", (error: Error) => {
            console.error(error);
            data.state = "ERROR";
            reject(error);
        });
        busboy.on("finish", () => {
            data.state = "DONE";
            resolve(data);
        });
        ctx.req.pipe(busboy);
    });
};
