/**
 * HistoricalLocations entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { requestArgs } from "../../constant";
import { Common } from "./common";

export class HistoricalLocations extends Common {
    constructor(args: requestArgs, level: number, knexInstance?: Knex | Knex.Transaction) {
        super(args, level, knexInstance);
    }
}
