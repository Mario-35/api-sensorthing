/**
 * Observations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { ParameterizedContext } from "koa";
import { Common } from "./common";
import { db } from "../../db";
import { importCsv, message, renameProp } from "../../utils/index";
import { csvFile, keyValue, requestArgs, ReturnResult } from "../../constant";

export class Observations extends Common {
    constructor(ctx: ParameterizedContext, args: requestArgs, level: number, knexInstance?: Knex | Knex.Transaction) {
        super(ctx, args, level, knexInstance);
    }

    async add(dataInput: keyValue[]): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class Observations add createObservation");

        const results: string[] = [];
        let total = 0;
        if (this.args.entities[0].startsWith("CreateObservations")) {
            if (this.args.extras) {
                const extras = this.args.extras;
                if (extras["entity"] == "Datastreams" && Number(extras["nb"]) > 0) {
                    message(this.args.debug, "INFO", "addFromCsv");
                    const paramsFile: csvFile = {
                        tempTable: `temp${Date.now().toString()}`,
                        filename: extras["file"],
                        column: extras["column"] ? Number(extras["column"]) : 1,
                        header: extras["header"] ? ", HEADER" : "",
                        dataStreamId: BigInt(extras["nb"]),
                        debug: this.args.debug
                    };

                    const testIfId = await this.verifyIdExist(paramsFile.dataStreamId);

                    if (testIfId === false) {
                        this.ctx.throw(404, { detail: `No id found for : ${paramsFile.dataStreamId}` });
                    }

                    const importDatas = await importCsv(Common.dbContext, paramsFile);

                    message(this.args.debug, "INFO", "importCsv", "OK");
                    total = Number(importDatas.shift());

                    importDatas.forEach((element: string) => {
                        results.push(this.linkBase + "(" + element + ")");
                    });
                }
            } else {
                const dataInsert: [Record<string, unknown>] = [{}];

                const result = await db.table("datastream").where({ id: dataInput["Datastream"]["@iot.id"] }).first();

                if (!result) {
                    this.ctx.throw(404, { detail: `No id found for : ${dataInput["Datastream"]["@iot.id"]}` });
                }

                dataInput["dataArray"].forEach((element: keyValue) => {
                    const temp: keyValue = {
                        datastream_id: Number(result["id"])
                    };
                    dataInput["components"].forEach((title: string, index: number) => {
                        temp[title] = element[index];
                    });
                    // TODO FeatureOfInterest/id search engine
                    dataInsert.push(renameProp("FeatureOfInterest/id", "featureofinterest_id", temp));
                });

                try {
                    const resultQuery = await db
                        .table("observation")
                        .insert(dataInsert.filter((elem) => Object.keys(elem).length))
                        .returning("*");

                    const resultsId = resultQuery.map((elem: { [key: string]: number }) => elem["id"]);
                    resultsId.forEach((element: number) => {
                        results.push(this.linkBase + "(" + element + ")");
                    });
                } catch (error) {
                    this.ctx.throw(400, { detail: error.message });
                }
            }
            if (results) {
                return this.formatReturnResult({
                    total: total,
                    result: results
                });
            }
        } else {
            return await super.add(dataInput);
        }
        return undefined;
    }
}
