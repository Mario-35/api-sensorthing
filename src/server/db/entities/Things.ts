/**
 * Things entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { ParameterizedContext } from "koa";
import { requestArgs } from "../../constant";
import { Common } from "./common";
// http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25
export class Things extends Common {
    constructor(ctx: ParameterizedContext, args: requestArgs, level: number, knexInstance?: Knex | Knex.Transaction) {
        super(ctx, args, level, knexInstance);
    }
}
