/**
 * TDD for things API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import { errorKeys, IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, createListColumns } from "./constant";
import { server } from "../../server/index";
import { db } from "../../server/db";
import { _ENTITIES, IEntityProperty } from "../../server/constant";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _ENTITIES.HistoricalLocations;
let index = 0;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: "A Thing’s HistoricalLocation entity set provides the times of the current (last known) and previous locations of the Thing.",
    result: ""
});

describe("routes : HistoricalLocations", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#26
    let success: string[] = [];
    let params: string[] = [];

    before((done) => {
        createListColumns(entity.table, (err: any, valueSuccess: any, valueParam: any) => {
            success = valueSuccess;
            params = valueParam;
            Object.keys(entity.relations).forEach((elem: string) => {
                success.push(`{relation} [${elem}] ${elem}@iot.navigationLink`);
                params.push(`{relation} [${elem}] ${elem}@iot.navigationLink`);
            });

            done();
        });
    });

    describe(`{get} /${entity.name}.`, () => {
        it("should return all HistoricalLocations", (done) => {
            const infos = {
                api: `{get} /${entity.name} [${++index}] all.`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiSuccess: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
            };

            db(entity.table)
                .count()
                .then((result) => {
                    chai.request(server)
                        .get(infos.apiExample)
                        .end((err, res) => {
                            const nb = Number(result[0]["count"]) > 200 ? 200 : Number(result[0]["count"]);
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb);
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value[0].should.include.keys(entity.testsKeys);
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should respond with a single HistoricalLocations", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one.`,
                apiName: `Get${entity.name}`,
                apiDescription: `Get a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(1)`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    res.body["@iot.selfLink"].should.contain("/HistoricalLocations(1)");
                    res.body["@iot.id"].should.eql("1");
                    res.body["Thing@iot.navigationLink"].should.contain("/HistoricalLocations(1)/Thing");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve a specific HistoricalLocations and $expand Locations.", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] Expand.`,
                apiName: `GetExpandLocations${entity.name}`,
                apiDescription: `Get a specific ${entity.name} and expand location.`,
                apiExample: `/v1.0/${entity.name}(6)?$expand=Locations`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_ENTITIES.HistoricalLocations.testsKeys.filter((elem) => elem !== "Locations@iot.navigationLink"));
                    res.body.should.include.keys("Locations");
                    res.body.Locations.length.should.eql(1);
                    res.body.Locations[0].should.include.keys(_ENTITIES.Locations.testsKeys);
                    res.body["@iot.id"].should.eql("6");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve specified time for a specific HistoricalLocation.", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] Select.`,
                apiName: `GetSelectTime${entity.name}`,
                apiDescription: `Retrieve time for a specific ${entity.name} .`,
                apiExample: `/v1.0/${entity.name}(6)?$select=time`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("time");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the HistoricalLocations does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.message.should.eql("That element does not exist.");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe(`{patch} /${entity.name} Patch.`, () => {
        it("should return the HistoricalLocations that was updated", (done) => {
            db(entity.table)
                .select("*")
                .then((locations) => {
                    const locationObject = locations[locations.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a HistoricalLocations.",
                        apiExample: `/v1.0/${entity.name}(${locationObject.id})`,
                        apiParamExample: {
                            "time": "2015-02-07T19:22:11.297Z"
                        }
                    };
                    chai.request(server)
                        .patch(infos.apiExample)
                        .send(infos.apiParamExample)
                        .end((err: any, res: any) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.should.include.keys(entity.testsKeys);
                            const newLocationObject = res.body;
                            newLocationObject.should.not.eql(locationObject.time);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });
        it("should throw an error if the thing does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    "time": "2015-02-07T19:22:11.297Z"
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.message.should.eql("That element does not exist.");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe(`{delete} /${entity.name} Delete.`, () => {
        it("should return no content with code 204", (done) => {
            db(entity.table)
                .select("*")
                .then((locations) => {
                    const locationObject = locations[locations.length - 1];
                    const lengthBeforeDelete = locations.length;
                    const infos = {
                        api: `{delete} /${entity.name} [${++index}] one.`,
                        apiName: `Delete${entity.name}`,
                        apiDescription: `Delete a ${entity.name}.`,
                        apiExample: `/v1.0/${entity.name}(${locationObject.id})`
                    };
                    chai.request(server)
                        .delete(infos.apiExample)
                        .end((err: any, res: any) => {
                            should.not.exist(err);
                            res.status.should.equal(204);
                            db(entity.table)
                                .select("*")
                                .then((updatedLocations) => {
                                    updatedLocations.length.should.eql(lengthBeforeDelete - 1);
                                    addToApiDoc({ ...infos, result: res });
                                    done();
                                });
                        });
                });
        });
        it("should throw an error if the location does not exist", (done) => {
            chai.request(server)
                .delete(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.message.should.eql("That element does not exist.");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    generateApiDoc(docs, `apiDoc${entity.name}.js`);
                    done();
                });
        });
    });
});
