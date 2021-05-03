/**
 * DataAccessInterface interfaces.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { Common } from "../entities/common";
import { requestArgs, ReturnResult, keyValue } from "../../constant";
import { ParameterizedContext } from "koa";

export interface DataAccessInterface {
    readonly myEntity: Common | undefined;
    readonly args: requestArgs;
    readonly ctx: ParameterizedContext;

    getAll(): Promise<ReturnResult | undefined>;
    getSingle(id: bigint, propertyName?: string, relationName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined>;
    add(): Promise<ReturnResult | undefined>;
    update(id: bigint, dataInput: keyValue[] | undefined): Promise<ReturnResult | undefined>;
    delete(id: bigint): Promise<ReturnResult | undefined>;
    addTolog(): Promise<BigInt>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    updateLog(id: BigInt, datas: any): Promise<void>;
}
