/**
 * DataAccessInterface interfaces.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { logClass } from "../../utils/";
import { Common } from "../entities/common";
import { requestArgs, ReturnResult, keyStrings } from "../../constant";

export interface DataAccessInterface {
    readonly myEntity: Common | undefined;
    readonly logger: logClass;
    readonly args: requestArgs;

    getAll(): Promise<ReturnResult | undefined>;
    getSingle(id: bigint, propertyName?: string, relationName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined>;
    add(dataInput: keyStrings[] | undefined): Promise<ReturnResult | undefined>;
    update(id: bigint, dataInput: keyStrings[] | undefined): Promise<ReturnResult | undefined>;
    delete(id: bigint): Promise<ReturnResult | undefined>;
}
