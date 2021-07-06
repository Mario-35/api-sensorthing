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
import { message } from "../../utils/";
import { db } from "../../db";
import { ParameterizedContext } from "koa";

export class apiAccess implements DataAccessInterface {
    readonly myEntity: Common | undefined;
    readonly args: requestArgs;
    readonly ctx: ParameterizedContext;
    static trxProvider = db.transactionProvider();

    constructor(ctx: ParameterizedContext, args: requestArgs) {
        this.ctx = ctx;
        this.args = args;
        message(this.args.debug, "HEAD", `class ${this.constructor.name}`);

        if (args.ENTITY_NAME in entities) {
            this.myEntity = new entities[(this.ctx, args.ENTITY_NAME)](ctx, args, 0, db);
            if (this.myEntity === undefined) {
                message(this.args.debug, "ERROR", `Entity Error : ${args.ENTITY_NAME}`);
            } else {
                message(this.args.debug, "HEAD", `class ${this.myEntity.constructor.name}`);
            }
        } else {
            message(this.args.debug, "ERROR", `Entity Error : ${args.ENTITY_NAME}`);
        }
    }

    async addTolog(): Promise<bigint> {
        const result = await db
            .table("log_request")
            .insert({ user_id: process.env.USERID, method: this.ctx.request.method, url: this.ctx.request.url, datas: this.ctx.request.body })
            .returning("id");
        return result ? BigInt(result[0] as string) : BigInt(0);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    async updateLog(id: BigInt, datas: any): Promise<void> {
        await db.table("log_request").update(datas).where({ id: id });
    }

    async getAll(): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class DataAccessClass getAll");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                return this.args.RELATION_NAME ? await this.myEntity.getRelation(this.args.ENTITY_ID) : await this.myEntity.getAll();
            } catch (error) {
                message(this.args.debug, "ERROR", "Get All", error.message);
                await this.updateLog(logId, { results: error });
            }
        }
        return undefined;
    }

    async getSingle(id: bigint, propertyName?: string, relationName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class DataAccessClass getSingle");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            try {
                return relationName ? await this.myEntity.getRelation(id, relationName) : this.myEntity.getSingle(id, propertyName, onlyValue);
            } catch (error) {
                await this.updateLog(logId, { results: error });
                message(this.args.debug, "ERROR", "Get", error.message);
            }
        }
        return undefined;
    }

    async add(): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class DataAccessClass add");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            // try {
            const results = await this.myEntity.add(this.ctx.request.body);
            if (results) {
                await this.updateLog(logId, { results: results });
                return results;
            }
        }
    }

    async update(id: bigint): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class DataAccessClass update");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            const results = await this.myEntity.update(id, this.ctx.request.body);
            await this.updateLog(logId, { results: results });
            if (results) {
                await this.updateLog(logId, { results: results });
                return results;
            }
        }
        return undefined;
    }

    async delete(id: bigint): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", "class DataAccessClass delete");
        const logId: bigint = await this.addTolog();
        if (this.myEntity) {
            const results = this.myEntity.delete(id);
            await this.updateLog(logId, { results: results });
            if (results) {
                await this.updateLog(logId, { results: results });
                return results;
            }
        }
        return undefined;
    }
}
