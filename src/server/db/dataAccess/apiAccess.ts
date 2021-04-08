/**
 * Api dataAccess.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { requestArgs, ReturnResult } from "../../constant";
import { DataAccessInterface } from "../interfaces";

import * as entities from "../entities/index";
import { Common } from "../entities/common";
import { logClass } from "../../utils/";
import { db } from "../../db";
import { ParameterizedContext } from "koa";

export class apiAccess implements DataAccessInterface {
    readonly myEntity: Common | undefined;
    readonly args: requestArgs;
    readonly ctx: ParameterizedContext;
    readonly logger: logClass;
    static trxProvider = db.transactionProvider();

    constructor(ctx: ParameterizedContext, args: requestArgs) {
        this.ctx = ctx;
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

    async addTolog(): Promise<bigint> {
        const result = await db
            .table("log_request")
            .insert({ user_id: process.env.USERID, method: this.ctx.request.method, url: this.ctx.request.url, datas: this.ctx.request.body })
            .returning("id");
        return result ? BigInt(result[0]) : BigInt(0);
    }

    async updateLog(id: BigInt, datas: any): Promise<void> {
        await db.table("log_request").update(datas).where({ id: id });
    }

    async getAll(): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass getAll");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                return this.args.RELATION_NAME ? await this.myEntity.getRelation(BigInt(this.args.ENTITY_ID)) : await this.myEntity.getAll();
            } catch (error) {
                this.logger.error("Get All", error.message);
                await this.updateLog(logId, { results: error });
            }
        }
        return undefined;
    }

    async getSingle(id: bigint, propertyName?: string, relationName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass getSingle");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                return relationName ? await this.myEntity.getRelation(id, relationName) : this.myEntity.getSingle(id, propertyName, onlyValue);
            } catch (error) {
                await this.updateLog(logId, { results: error });
                this.logger.error("Get", error.message);
            }
        }
        return undefined;
    }

    async add(): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass add");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                const results = await this.myEntity.add(this.ctx.request.body);
                if (results) {
                    await this.updateLog(logId, { results: results });
                    return results;
                }
            } catch (error) {
                this.logger.error("Add", error.message);
                await this.updateLog(logId, { results: error });
            }
        }
        return undefined;
    }

    async update(id: bigint): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass update");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                const results = await this.myEntity.update(id, this.ctx.request.body);
                await this.updateLog(logId, { results: results });
                if (results) {
                    await this.updateLog(logId, { results: results });
                    return results;
                }
            } catch (error) {
                this.logger.error("Update", error.message);
                await this.updateLog(logId, { results: error });
            }
        }
        return undefined;
    }

    async delete(id: bigint): Promise<ReturnResult | undefined> {
        this.logger.head("class DataAccessClass delete");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                const results = this.myEntity.delete(id);
                await this.updateLog(logId, { results: results });
                if (results) {
                    await this.updateLog(logId, { results: results });
                    return results;
                }
            } catch (error) {
                this.logger.error("Delete", error.message);
                await this.updateLog(logId, { results: error });
            }
        }
        return undefined;
    }
}
