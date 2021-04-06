/**
 * Api dataAccess.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { requestArgs, keyStrings, ReturnResult } from "../../constant";
import { DataAccessInterface } from "../interfaces";

import * as entities from "../entities/index";
import { Common } from "../entities/common";
import { logClass } from "../../utils/";
import { db } from "../../db";

export class apiAccess implements DataAccessInterface {
    readonly myEntity: Common | undefined;
    readonly args: requestArgs;
    readonly logger: logClass;
    static trxProvider = db.transactionProvider();

    constructor(args: requestArgs) {
        this.logger = new logClass(args.debug, 0);

        this.logger.head(`class ${this.constructor.name}`);
        if (args.ENTITY_NAME in entities) {
            this.myEntity = new entities[args.ENTITY_NAME](args, 0, db);
            if (this.myEntity === undefined) {
                this.logger.error(`Entity Error : ${args.ENTITY_NAME}`);
            } else {
                this.logger.head(`class ${this.myEntity.constructor.name}`);
            }
        } else {
            this.logger.error(`Entity Error : ${args.ENTITY_NAME}`);
        }
        this.args = args;
    }

    async getAll(): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass getAll");
        if (this.myEntity) {
            try {
                return this.args.RELATION_NAME !== undefined ? await this.myEntity.getRelation(BigInt(this.args.ENTITY_ID)) : await this.myEntity.getAll();
            } catch (error) {
                this.logger.error("Get All", error.message);
            }
        }
        return undefined;
    }

    async getSingle(id: bigint, propertyName?: string, relationName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass getSingle");
        if (this.myEntity) {
            try {
                return relationName ? this.myEntity.getRelation(id, relationName) : this.myEntity.getSingle(id, propertyName, onlyValue);
            } catch (error) {
                this.logger.error("Get", error.message);
            }
        }
        return undefined;
    }

    async add(dataInput: keyStrings[] | undefined): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass add");
        if (this.myEntity) {
            try {
                const results = this.myEntity.add(dataInput);
                if (results) {
                    return results;
                }
            } catch (error) {
                this.logger.error("Add", error.message);
            }
        }
        return undefined;
    }

    async update(id: bigint, dataInput: keyStrings[]): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass update");
        if (this.myEntity) {
            try {
                return await this.myEntity.update(id, dataInput);
            } catch (error) {
                this.logger.error("Update", error.message);
            }
        }
        return undefined;
    }

    async delete(id: bigint): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass delete");
        if (this.myEntity) {
            try {
                return this.myEntity.delete(id);
            } catch (error) {
                this.logger.error("Delete", error.message);
            }
        }
        return undefined;
    }
}
