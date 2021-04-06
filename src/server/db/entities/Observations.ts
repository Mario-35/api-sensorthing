/**
 * Observations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { requestArgs, keyStrings, ReturnResult } from "../../constant";
import { Common } from "./common";
import { db } from "../../db";
import { renameProp } from "../../utils/index";

export class Observations extends Common {
    constructor(args: requestArgs, level: number, knexInstance?: Knex | Knex.Transaction) {
        super(args, level, knexInstance);
    }

    async add(dataInput: keyStrings[]): Promise<ReturnResult | undefined> {
        this.logger.head("class Observations add createObservation");

        const results: string[] = [];

        // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#82

        if (this.args.entities[0].startsWith("CreateObservations")) {
            const dataInsert: [Record<string, unknown>] = [{}];

            const result = await db.table("datastream").where({ id: dataInput["Datastream"]["@iot.id"] }).first();

            dataInput["dataArray"].forEach((element: keyStrings) => {
                const temp: keyStrings = {
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
                this.setError(error.message.includes(" - ") ? error.message.split("-")[1].trim() : error.message, error.name);
            }

            if (results) {
                return this.formatReturnResult({
                    result: results
                });
            }
        } else {
            return await super.add(dataInput);
        }
        return undefined;
    }
}
