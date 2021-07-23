/**
 * Common class entity.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import Knex from "knex";
import { requestArgs, IEntityProperty, _DBDATAS, ReturnResult, relationConfig, keyValue } from "../../constant";
import * as entities from "./index";
import { PGVisitor } from "../../utils/odata/visitor";
import { asyncForEach, getEntityName, getId, message, renameProp } from "../../utils/index";
import { ParameterizedContext } from "koa";
export class Common {
    static dbContext: Knex | Knex.Transaction;
    public level: number | undefined;
    public linkBase: string;
    public nextLinkBase: string;
    public entityProperty: IEntityProperty;
    readonly args: requestArgs;
    readonly ctx: ParameterizedContext;

    constructor(ctx: ParameterizedContext, args: requestArgs, level: number, knexInstance?: Knex | Knex.Transaction) {
        this.ctx = ctx;
        this.args = args;
        this.level = level + 1 ? level : 1;
        message(this.args.debug, "HEAD", `class common [${this.constructor.name}] (${this.level})`);

        if (knexInstance) Common.dbContext = knexInstance;

        this.entityProperty = _DBDATAS[this.constructor.name];

        this.nextLinkBase = `http://${this.args.baseUrl}/${this.args.version}/${this.args.entities.join("/")}`;

        this.linkBase =
            process.env.NODE_ENV?.trim() == "test"
                ? `proxy/${this.args.version}/${this.constructor.name}`
                : `http://${this.args.baseUrl}/${this.args.version}/${this.constructor.name}`;
    }

    // stringify can't serialize bigInt
    toJson(data: requestArgs): string {
        return JSON.stringify(data, (_, v) => (typeof v === "bigint" ? `${v}#bigint` : v)).replace(/"(-?\d+)#bigint"/g, (_, a) => a);
    }

    // create a blank ReturnResult
    formatReturnResult(args: Record<string, unknown>): ReturnResult {
        message(this.args.debug, "HEAD", "formatReturnResult");

        const result: ReturnResult = {
            id: undefined,
            entity: this.entityProperty,
            nextLink: args.nextLink ? (args.nextLink as string) : undefined,
            prevLink: args.prevLink ? (args.prevLink as string) : undefined,
            result: undefined,
            value: undefined,
            body: undefined,
            total: undefined
        };

        Object.keys(args).forEach((element: string) => {
            result[element] = args[element];
        });

        return result;
    }

    isObject(test: keyValue): boolean {
        return test && typeof test === "object" && test.length > 0;
    }

    extractMessageError = (input: string): string => {
        const temp = input.split("-");
        return input.length === 0 ? input : temp[temp.length - 1].trim();
    };

    async formatLineResult(input: keyValue): Promise<keyValue | undefined> {
        message(this.args.debug, "HEAD", `class common formatLineResult [${this.constructor.name}]`);
        const linkBaseId = input["id"] ? `${this.linkBase}(${input["id"].toString()})` : undefined;

        input = {
            ...renameProp("id", "@iot.id", input)
        };
        // creation of function for async foreach
        // https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
        const request = async (): Promise<keyValue | undefined> => {
            // hide all relations start with "_"
            const relationsKeys: string[] = this.entityProperty.relations
                ? Object.keys(this.entityProperty.relations).filter((word) => !this.entityProperty.relations[word].columnRelation.startsWith("_"))
                : [];
            const result: keyValue | keyValue[] = {};
            if (linkBaseId) {
                input["@iot.selfLink"] = `${linkBaseId}`;
            }
            Object.keys(input)
                .filter((word) => !word.trim().endsWith("_id"))
                .sort((a: string | number | bigint, b: string | number | bigint) => (a > b ? 1 : -1))
                .forEach((element: string) => {
                    if (this.isObject(input[element] as keyValue)) {
                        const subResult: keyValue = {};
                        Object.keys(input[element])
                            .sort((a: string | number | bigint, b: string | number | bigint) => (a < b ? -1 : a > b ? 1 : 0))
                            .forEach((subElement) => {
                                subResult[subElement] = input[element][subElement];
                            });
                        input[element] = subResult;
                    }
                    result[element] = input[element];
                });

            await asyncForEach(
                relationsKeys.sort((a: string | number | bigint, b: string | number | bigint) => (a > b ? 1 : -1)),
                async (element: string) => {
                    if (this.args.odada.includes.length > 0) {
                        await asyncForEach(this.args.odada.includes, async (expand: PGVisitor, index: number) => {
                            const tempTab: string[] | undefined = expand.navigationProperty.split("/");
                            const expandName: string | undefined = tempTab ? tempTab[0] : undefined;
                            if (expandName && expandName.includes(element)) {
                                message(this.args.debug, "DEBUG", `Expand for ${expandName}`, element);
                                const subEntityName = getEntityName(element);
                                if (subEntityName) {
                                    const newArgs = JSON.parse(this.toJson(this.args));
                                    if (newArgs && newArgs.odada) {
                                        newArgs.odada.includes[index].navigationProperty =
                                            this.args.odada && this.args.odada && tempTab ? tempTab.slice(1).join("/") : "";
                                    }
                                    const subEntity = new entities[subEntityName](this.ctx, newArgs, this.level);
                                    const singular: boolean = element == _DBDATAS[subEntityName].singular;
                                    const relation: relationConfig = this.entityProperty.relations[element];
                                    let myId: bigint[] = [];
                                    let whereRaw = `${relation.columnRelation} = ${BigInt(input["@iot.id"] as string)}`;
                                    if (relation.tableName == this.entityProperty.table) {
                                        myId = [BigInt(input[relation.entityColumn] as string)];
                                        whereRaw = `${relation.columnRelation} = ${myId}`;
                                    } else if (
                                        subEntity.entityProperty.relations &&
                                        subEntity.entityProperty.relations[this.entityProperty.name] &&
                                        relation.tableName == subEntity.entityProperty.relations[this.entityProperty.name].tableName
                                    ) {
                                        try {
                                            const allIds = await Common.dbContext(relation.tableName)
                                                .select(relation.columnRelation)
                                                .whereRaw(`${relation.entityColumn} = ${input["@iot.id"]}`);
                                            allIds.forEach((id) => myId.push(BigInt(id[relation.columnRelation])));

                                            whereRaw = `id IN (${myId})`;
                                        } catch (error) {
                                            whereRaw = "";
                                            this.ctx.throw(400, { detail: error.message });
                                        }
                                    } else if (relation.tableName != this.entityProperty.table && !getEntityName(relation.tableName)) {
                                        message(this.args.debug, "DEBUG", `Table Association for ${expandName} : `, element);
                                        try {
                                            const allIds = await Common.dbContext(relation.tableName)
                                                .select({ id: relation.columnRelation })
                                                .where({ [relation.entityColumn]: input["@iot.id"] });

                                            allIds.forEach((ids) => myId.push(BigInt(ids.id)));

                                            whereRaw = `id IN (${myId})`;
                                        } catch (error) {
                                            whereRaw = "";
                                            this.ctx.throw(400, { detail: error.message });
                                        }
                                    }
                                    const results = await subEntity.getWhereFormat(whereRaw);

                                    result[element] = singular ? results[0] : results;
                                } else {
                                    message(this.args.debug, "ERROR", "No entity for", element);
                                }
                            } else {
                                result[`${element}@iot.navigationLink`] = `${linkBaseId}/${element}`;
                            }
                        });
                    } else {
                        result[`${element}@iot.navigationLink`] = `${linkBaseId}/${element}`;
                    }
                }
            );
            return result;
        };
        return await request();
    }

    async formatResult(input: keyValue[]): Promise<keyValue[] | undefined> {
        message(this.args.debug, "HEAD", `class common formatResult [${this.constructor.name}]`);
        if (typeof input === "object") {
            const values: keyValue[] = [];
            const request = async () => {
                await asyncForEach(input, async (item: keyValue) => {
                    const temp = await this.formatLineResult(item);
                    if (temp) {
                        values.push(temp);
                    }
                });
                return values;
            };
            return await request();
        }
        return undefined;
    }

    async verifyIdExist(idInput: bigint, tableSearch?: string): Promise<boolean> {
        message(this.args.debug, "HEAD", `class common verifyIdExist [${this.constructor.name}]`);
        const result = await Common.dbContext(tableSearch ? tableSearch : this.entityProperty.table)
            .select("id")
            .where({ id: idInput })
            .first();
        return result ? true : false;
    }

    convertSelectOdataToKnex(input: string): string[] {
        const result: string[] | undefined | void = input
            .match(/[a-z,A-Z]/g)
            ?.join("")
            .trim()
            .split(",");
        return result ? result : ["*"];
    }

    makeOdataQuery(query: Knex.QueryBuilder, propertyName?: string): Knex.QueryBuilder {
        const oDatas = this.args.odada;

        if (oDatas) {
            query.limit(oDatas.limit && oDatas.limit > 0 ? oDatas.limit : Number(process.env.APILIMIT));
            query.offset(oDatas.skip && oDatas.skip > 0 ? oDatas.skip : 0);
        }

        query.select(oDatas && oDatas.select ? this.convertSelectOdataToKnex(oDatas.select) : propertyName ? [propertyName] : ["*"]);

        query.orderByRaw(oDatas && oDatas.orderby ? oDatas.orderby.replace(/"/g, "") : "id");

        if (oDatas && oDatas.where) {
            const tempTab = oDatas.where.split(":");
            for (let i = 1; i < tempTab.length; i += 2) {
                tempTab[i] = oDatas.parameters[tempTab[i]];
            }
            query.whereRaw(tempTab.join(" "));
        }
        return query;
    }

    async getAll(propertyName?: string): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class common getAll [${this.constructor.name}]`);
        const query: Knex.QueryBuilder = Common.dbContext(this.entityProperty.table);
        if (this.args.entities.length > 1) {
            const entityName = getEntityName(this.args.entities[0]);
            message(this.args.debug, "DEBUG", "Found entity : ", entityName);
            const entity = entityName ? _DBDATAS[entityName] : undefined;
            const id: bigint | undefined = getId(this.args.entities[0]);
            if (entity && id) {
                // const subEntity = new entities[entity.name]({ ...this.args });
                const subEntity = new entities[entity.name](this.ctx, { ...this.args }, this.level);
                const result: ReturnResult | undefined = await subEntity.getSingle(id, "id", true);
                if (result && result.body && result.id && result.id > 0) {
                    message(this.args.debug, "DEBUG", "Found Id : ", result.id.toString());
                    if (Object.keys(this.entityProperty.columns).includes(`${entity.table.toLowerCase()}_id`)) {
                        query.where({
                            [`${entity.table.toLowerCase()}_id`]: result.body
                        });
                    } else if (Object.keys(this.entityProperty.relations).includes(entity.name)) {
                        const relation: relationConfig = this.entityProperty.relations[entity.name];
                        query.whereRaw(`id in (select ${relation.columnRelation} from ${relation.tableName} where ${relation.entityColumn} = ${result.id})`);
                    } else {
                        message(this.args.debug, "ERROR", "No relation resolving");
                    }
                } else {
                    this.ctx.throw(400, { detail: `No id for : ${this.args.entities[0]}` });
                }
            } else {
                return undefined;
            }
        }

        const results = await this.makeOdataQuery(query, propertyName);

        const limit = this.args.odada.limit ? this.args.odada.limit : Number(process.env.APILIMIT);
        const skip = this.args.odada.skip ? this.args.odada.skip : 0;

        const next = skip + limit;
        const prev = skip - limit;

        return results && results.length > 0
            ? this.formatReturnResult({
                  id: BigInt(results.length),
                  result: results,
                  nextLink:
                      process.env.APILIMIT && results.length >= Number(process.env.APILIMIT) ? `${this.nextLinkBase}?$top=${limit}&$skip=${next}` : undefined,

                  prevLink:
                      process.env.APILIMIT && results.length >= Number(process.env.APILIMIT) && prev >= 0
                          ? `${this.nextLinkBase}?$top=${limit}&$skip=${prev}`
                          : undefined,

                  value: await this.formatResult(results)
              })
            : undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getWhere(condition: string): Promise<any | undefined> {
        message(this.args.debug, "HEAD", `class common getWhere [${this.constructor.name}]`);
        return await Common.dbContext(this.entityProperty.table).whereRaw(condition);
    }

    async getWhereFormat(condition: string): Promise<keyValue[] | keyValue | undefined> {
        message(this.args.debug, "HEAD", `class common getWhereFormat [${this.constructor.name}]`);
        try {
            const results = await Common.dbContext(this.entityProperty.table).whereRaw(condition);
            return results ? await this.formatResult(results) : undefined;
        } catch (error) {
            this.ctx.throw(400, { detail: error.message });
        }
    }

    async getSingle(idInput: bigint, propertyName?: string, onlyValue?: boolean): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class common getSingle [${this.constructor.name}]`);
        const selectColumns: string[] = propertyName ? [propertyName] : this.args.odada.select ? this.convertSelectOdataToKnex(this.args.odada.select) : ["*"];

        const results = await Common.dbContext(this.entityProperty.table).select(selectColumns).where({ id: idInput }).first();

        if (results) {
            return this.formatReturnResult({
                id: results.id ? BigInt(results.id) : undefined,
                body:
                    selectColumns[0] != "*"
                        ? onlyValue && onlyValue === true
                            ? results[selectColumns[0]].replace(/['"]+/g, "")
                            : results
                        : await this.formatLineResult(results)
            });
        }
    }

    async getRelation(idInput: BigInt | undefined, relationName?: string): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class common getRelation [${this.constructor.name}]`);
        message(this.args.debug, "DEBUG", "RelationName ", relationName);

        // get the relation id TODO with another than ID
        const resultId = await Common.dbContext(this.entityProperty.table)
            .select("id")
            .where(idInput && idInput !== undefined ? { id: idInput } : {})
            .first();
        // if found
        if (resultId)
            if (relationName && this.entityProperty.relations) {
                const relations: IEntityProperty = _DBDATAS[relationName];
                if (relations) {
                    const column: string | undefined = relationName;
                    if (column && relationName) {
                        const mySubEntity = new entities[relationName](this.ctx, { ...this.args }, this.level);
                        const column = relationName;
                        const results = await mySubEntity.getWhereFormat(`"${column}"=${resultId.id}`);
                        if (results) {
                            return this.formatReturnResult({
                                body: results
                            });
                        }
                    }
                }
            }
    }

    async add(dataInput: keyValue[] | undefined): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class Common add [${this.constructor.name}]`);
        if (dataInput) {
            const sql = this.creatAddUpdateQuery(dataInput);
            try {
                const results = await Common.dbContext.raw(sql);
                if (results.rows) {
                    const result: keyValue | undefined = await this.formatLineResult(results.rows[0]);
                    if (result) {
                        return this.formatReturnResult({
                            id: result.id ? BigInt(results.id) : undefined,
                            result: result,
                            value: result,
                            body: result
                        });
                    }
                }
            } catch (error) {
                this.ctx.throw(400, { detail: this.extractMessageError(error.message) });
            }
        }
    }

    async update(idInput: bigint, dataInput: keyValue[] | undefined): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class Observations update [${this.constructor.name}]`);

        const testIfId = await this.verifyIdExist(idInput);

        if (testIfId === false) {
            this.ctx.throw(404, { detail: `No id found for : ${idInput}` });
        }

        if (dataInput) {
            const sql = this.creatAddUpdateQuery(dataInput, idInput);
            try {
                const results = await Common.dbContext.raw(sql);

                if (results.rows) {
                    const result: keyValue | undefined = await this.formatLineResult(results.rows[0]);

                    if (result) {
                        return this.formatReturnResult({
                            id: result.id ? BigInt(results.id) : undefined,
                            result: result,
                            value: result,
                            body: result
                        });
                    }
                }
            } catch (error) {
                message(true, "ERROR", error.message);
                this.ctx.throw(400, { detail: error.message });
            }
        }
    }

    async delete(idInput: bigint): Promise<ReturnResult | undefined> {
        message(this.args.debug, "HEAD", `class common delete [${this.constructor.name}]`);

        try {
            const results = await Common.dbContext(this.entityProperty.table).del().where({ id: idInput });
            return this.formatReturnResult({
                id: BigInt(results)
            });
        } catch (error) {
            this.ctx.throw(400, { detail: error.message });
        }
    }

    creatAddUpdateQuery(datas: keyValue[] | keyValue, idInput?: bigint): string {
        enum OperationType {
            Table,
            Relation,
            Association
        }

        const queryMaker: { [key: string]: { type: OperationType; table: string; datas: keyValue[] | keyValue; keyId: string } } = {};
        const names: { [key: string]: string } = { [this.entityProperty.table]: this.entityProperty.table };
        let level = 0;

        const getRelationNameFromEntity = (source: IEntityProperty, from: IEntityProperty): string | undefined => {
            return Object.keys(source.relations).includes(from.name)
                ? from.name
                : Object.keys(source.relations).includes(from.singular)
                ? from.singular
                : undefined;
        };

        /**
         *
         * @param query query for the query not in as
         * @returns
         */
        const queryMakerToString = (query: string): string => {
            const result: string[] = [query];
            const links: { [key: string]: string[] } = {};
            const sorting: string[] = [];

            Object.keys(queryMaker).forEach((element: string) => {
                Object.keys(queryMaker).forEach((elem: string) => {
                    if (JSON.stringify(queryMaker[elem].datas).includes(`select ${element}`)) {
                        if (links[elem]) {
                            links[elem].push(element);
                        } else {
                            links[elem] = [element];
                        }
                    }
                });
            });

            Object.keys(queryMaker).forEach((elem: string) => {
                if (Object.keys(links).includes(elem)) {
                    sorting.push(elem);
                } else {
                    sorting.unshift(elem);
                }
            });

            // LOOP on sorting
            sorting.forEach((element: string) => {
                if (queryMaker[element].datas.hasOwnProperty("@iot.id")) {
                    const searchId = queryMaker[element].datas["@iot.id"];
                    result.push(
                        `, ${element} AS (select coalesce((select "id" from "${queryMaker[element].table}" where "id" = ${searchId}), ${searchId}) AS id)`
                    );
                } else {
                    const query = Common.dbContext(queryMaker[element].table);
                    result.push(`, ${element} AS (`);
                    if (idInput) {
                        if (queryMaker[element].type == OperationType.Association) {
                            result.push(
                                query
                                    .insert(queryMaker[element].datas)
                                    .onConflict(Object.keys(queryMaker[element].datas))
                                    .merge(queryMaker[element].datas)
                                    .whereRaw(`${queryMaker[element].table}.${queryMaker[element].keyId} = ${BigInt(idInput).toString()}`)
                                    .toString()
                            );
                        } else {
                            result.push(
                                query
                                    .update(queryMaker[element].datas)
                                    .whereRaw(`${queryMaker[element].table}.${queryMaker[element].keyId} = ${BigInt(idInput).toString()}`)
                                    .toString()
                            );
                        }
                    } else {
                        result.push(query.insert(queryMaker[element].datas).toString());
                    }
                    result.push(`RETURNING ${this.entityProperty.table == queryMaker[element].table ? "*" : queryMaker[element].keyId})`);
                }
            });
            // We need an insert
            result.push(`SELECT * FROM ${this.entityProperty.table};`);
            // format object quotes
            return result.join("\n").replace(/\'@/g, "").replace(/\@'/g, "");
        };

        /**
         *
         * @param datas datas
         * @param entity entity for the datas if not root entity
         * @param parentEntity parent entity for the datas if not root entity
         * @returns result
         */
        const start = (datas: keyValue | keyValue[], entity?: IEntityProperty, parentEntity?: IEntityProperty): keyValue[] | keyValue | undefined => {
            message(this.args.debug, "HEAD", `start level ${level++}`);

            const result = {};
            entity = entity ? entity : this.entityProperty;
            parentEntity = parentEntity ? parentEntity : this.entityProperty;

            for (const key in datas) {
                if (entity && !Object.keys(entity.relations).includes(key)) {
                    result[key] = typeof datas[key] === "object" ? JSON.stringify(datas[key]) : datas[key];
                    delete datas[key];
                }
            }
            /**
             *
             * @param inputNameEntity {string} name of the entity
             * @returns name of th next entity {inputNameEntity1}
             */
            const createName = (inputNameEntity: string): string => {
                const test = names[inputNameEntity];
                let number = 0;
                if (test) {
                    const numbers = test.match(/[0-9]/g);
                    number = numbers !== null ? Number(numbers.join("")) : 0;
                }
                return `${inputNameEntity}${(number + 1).toString()}`;
            };

            /**
             *  add or make query entry
             * @param name name
             * @param tableName table nae for insert
             * @param datas datas to insert string if key is send or object (mario)
             * @param key key of the value
             */
            const addToQueryMaker = (
                type: OperationType,
                name: string,
                tableName: string,
                datas: string | keyValue[] | keyValue,
                keyId: string,
                key: string | undefined
            ): void => {
                if (queryMaker.hasOwnProperty(name)) {
                    if (key && typeof datas == "string") {
                        queryMaker[name].datas[key] = datas;
                        queryMaker[name].keyId = keyId;
                    } else if (typeof datas != "string") {
                        queryMaker[name].datas = Object.assign(queryMaker[name].datas, datas);
                        queryMaker[name].keyId = keyId;
                    }
                } else {
                    if (key && typeof datas == "string") {
                        queryMaker[name] = {
                            type: type,
                            table: tableName,
                            datas: { [key]: datas },
                            keyId: keyId
                        };
                    } else if (typeof datas != "string") {
                        queryMaker[name] = {
                            type: type,
                            table: tableName,
                            datas: datas,
                            keyId: keyId
                        };
                    }
                }
            };

            /**
             *
             * @param subEntity {IEntityProperty} entity to use
             * @param subParentEntity {IEntityProperty} entity parent
             */
            const addAssociation = (subEntity: IEntityProperty, subParentEntity: IEntityProperty) => {
                message(this.args.debug, "DEBUG", `addAssociation in ${subEntity.name} for parent`, subParentEntity.name);

                const relationName = getRelationNameFromEntity(subEntity, subParentEntity);
                const parentRelationName = getRelationNameFromEntity(subParentEntity, subEntity);

                if (parentRelationName && relationName) {
                    const relation = subEntity.relations[relationName];
                    const parentRelation = subParentEntity.relations[parentRelationName];
                    message(this.args.debug, "DEBUG", `Found a parent relation in ${subEntity.name}`, subParentEntity.name);

                    if (relation.tableName == parentRelation.tableName && relation.tableName == subEntity.table) {
                        message(this.args.debug, "INFO", "Found a relation to do in sub query", subParentEntity.name);
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];

                        addToQueryMaker(
                            OperationType.Relation,
                            tableName,
                            subEntity.table,
                            `@(select ${parentTableName}.id from ${parentTableName})@`,
                            parentRelation.tableKey,
                            parentRelation.columnRelation
                        );
                    } else if (relation.tableName == parentRelation.tableName) {
                        if (relation.tableName == subParentEntity.table) {
                            const tableName = names[subEntity.table];
                            const parentTableName = names[subParentEntity.table];
                            message(this.args.debug, "INFO", `Add parent relation ${tableName} in`, parentTableName);

                            addToQueryMaker(
                                OperationType.Relation,
                                parentTableName,
                                subParentEntity.table,
                                `@(select ${tableName}.id from ${tableName})@`,
                                parentRelation.tableKey,
                                relation.columnRelation
                            );
                        } else if (relation.tableName != subParentEntity.table && relation.tableName != subEntity.table) {
                            const tableName = names[subEntity.table];
                            const parentTableName = names[subParentEntity.table];
                            message(this.args.debug, "INFO", `Add Table association ${tableName} in`, parentTableName);
                            addToQueryMaker(
                                OperationType.Association,
                                relation.tableName,
                                relation.tableName,
                                {
                                    [`${subEntity.table}_id`]: `@(select ${tableName}.id from ${tableName})@`,
                                    // [relation.columnRelation]: `@(select ${tableName}.id from ${tableName})@`,
                                    [`${subParentEntity.table}_id`]: `@(select ${parentTableName}.id from ${parentTableName})@`
                                },
                                relation.tableKey,
                                undefined
                            );
                        }
                    } else {
                        const tableName = names[subEntity.table];
                        const parentTableName = names[subParentEntity.table];
                        message(this.args.debug, "INFO", `Add Relation ${tableName} in`, parentTableName);
                        addToQueryMaker(
                            OperationType.Table,
                            parentTableName,
                            // parentTableName, correction: 9/4/2021
                            subParentEntity.table,
                            {
                                // [`${subEntity.table}_id`]: `@(select ${tableName}.id from ${tableName})@`
                                [relation.columnRelation]: `@(select ${tableName}.id from ${tableName})@`
                            },
                            relation.tableKey,
                            undefined
                        );
                    }
                }
            };

            /**
             *
             * @param key key Name
             * @param value Datas to process
             */
            const subBlock = (key: string, value: keyValue[] | keyValue) => {
                const entityNameSearch = getEntityName(key);
                if (entityNameSearch) {
                    const newEntity = _DBDATAS[entityNameSearch];
                    const name = createName(newEntity.table);
                    names[newEntity.table] = name;
                    const test = start(value, newEntity, entity);

                    if (test) {
                        addToQueryMaker(OperationType.Table, name, newEntity.table, test, "id", undefined);
                        level--;
                    }

                    if (entity) addAssociation(newEntity, entity);
                }
            };

            // Main loop
            if (entity && parentEntity) {
                for (const key in datas) {
                    if (Array.isArray(datas[key])) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        Object.entries(datas[key]).forEach(([_key, value]) => {
                            if (entity && parentEntity && Object.keys(entity.relations).includes(key)) {
                                message(this.args.debug, "INFO", `Found a relation for ${entity.name}`, key);
                                subBlock(key, value as keyValue);
                            } else {
                                message(this.args.debug, "INFO", `data ${key}`, datas[key]);
                                result[key] = datas[key];
                            }
                        });
                    } else if (typeof datas[key] === "object") {
                        if (Object.keys(entity.relations).includes(key)) {
                            message(this.args.debug, "DEBUG", `Found a object relation for ${entity.name}`, key);
                            subBlock(key, datas[key]);
                        }
                    } else {
                        result[key] = datas[key];
                    }
                }
            }
            return result;
        };

        // convert entities to property
        if (this.args.entities.length > 1) {
            const entityName = getEntityName(this.args.entities[0]);
            message(this.args.debug, "DEBUG", "Found entity : ", entityName);
            const callEntity = entityName ? _DBDATAS[entityName] : undefined;
            const id: bigint | undefined = getId(this.args.entities[0]);
            if (entityName && callEntity && id) {
                const relationName = getRelationNameFromEntity(this.entityProperty, callEntity);
                if (relationName) datas[relationName] = { "@iot.id": id.toString() };
            }
        }
        const root = start(datas);
        if (names[this.entityProperty.table] && queryMaker[this.entityProperty.table] && queryMaker[this.entityProperty.table].datas) {
            queryMaker[this.entityProperty.table].datas = Object.assign(root, queryMaker[this.entityProperty.table].datas);
            queryMaker[this.entityProperty.table].keyId = idInput ? "id" : "*";
            return queryMakerToString(`WITH "log" as (insert into "log" ("author") values ('${"ADAM"}') RETURNING id)`);
        } else {
            return queryMakerToString(
                idInput
                    ? `WITH ${this.entityProperty.table} as (${Common.dbContext(this.entityProperty.table)
                          .update(root)
                          // TODO is good conversion ?
                          .where({ id: idInput.toString() })
                          .toString()} RETURNING *)`
                    : `WITH ${this.entityProperty.table} as (${Common.dbContext(this.entityProperty.table).insert(root).toString()} RETURNING *)`
            );
        }
    }
}
