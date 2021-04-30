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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, createListColumns } from "./constant";
import { server } from "../../server/index";
import { db } from "../../server/db";
import { _ENTITIES, IEntityProperty } from "../../server/constant";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _ENTITIES.FeaturesOfInterest;
let index = 0;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: `An Observation results is a value being assigned to a phenomenon.<br>The phenomenon is a property of a feature, the latter being the FeatureOfInterest of the Observation.<br>
    In the context of the Internet of Things, many Observations’ FeatureOfInterest can be the Location of the Thing. For example, the FeatureOfInterest of a wifi-connect thermostat can be the Location of the thermostat (the living room where the thermostat is located in).<br>In the case of remote sensing, the FeatureOfInterest can be the geographical area or volume that is being sensed.`,
    result: ""
});

describe("routes : Features of Interest", () => {
    let columns: string[] = [];

    before((done) => {
        createListColumns(entity.table, (err: any, value: any) => {
            columns = ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...value];
            Object.keys(entity.relations).forEach((elem: string) => {
                columns.push(`{relation} ${elem} ${elem}@iot.navigationLink`);
            });
            done();
        });
    });

    describe(`{get} /${entity.name}.`, () => {
        it("should return all features of interests", (done) => {
            const infos = {
                api: `{get} /${entity.name} [${++index}] all.`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiSuccess: columns
            };
            db("featureofinterest")
                .count()
                .then((result) => {
                    const nb = Number(result[0]["count"]);
                    chai.request(server)
                        .get(`/v1.0/${entity.name}`)
                        .end((err, res) => {
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

        it("should respond with a single Feature of interest", (done) => {
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
                    res.body["@iot.selfLink"].should.contain("/FeaturesOfInterest(1)");
                    res.body["@iot.id"].should.eql("1");
                    res.body["Observations@iot.navigationLink"].should.contain("/FeaturesOfInterest(1)/Observations");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the features of interest does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it(`Retrieve a ${entity.name} using $expand query option.`, (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one and expand.`,
                apiName: `GetExpandObservations${entity.name}`,
                apiDescription: `Get a specific ${entity.name} and expand Observations.`,
                apiExample: `/v1.0/${entity.name}(1)?$expand=Observations`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_ENTITIES.FeaturesOfInterest.testsKeys.filter((elem) => elem !== "Observations@iot.navigationLink"));
                    res.body.should.include.keys("Observations");
                    res.body.Observations[0].should.include.keys(_ENTITIES.Observations.testsKeys);
                    res.body["@iot.id"].should.eql("1");
                    res.body.Observations = [res.body.Observations[0], res.body.Observations[1], "..."];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{post} /${entity.name} Create.`, () => {
        it("should return the sensor that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] basic.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParamExample: {
                    "name": "Weather Station YYC.",
                    "description": "This is a weather station located at the Calgary Airport.",
                    "encodingType": "application/vnd.geo+json",
                    "feature": {
                        "type": "Point",
                        "coordinates": [-114.06, 51.05]
                    }
                }
            };
            chai.request(server)
                .post(infos.apiExample)
                .send(infos.apiParamExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the payload is malformed", (done) => {
            chai.request(server)
                .post("/v1.0/FeaturesOfInterest")
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe("PATCH /v1.0/FeaturesOfInterest", () => {
        it("should return the feature of interest that was updated", (done) => {
            db("featureofinterest")
                .select("*")
                .then((items) => {
                    const itemObject = items[items.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a Feature of interest.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            "name": "My New Name",
                            "feature": {
                                "type": "Point",
                                "coordinates": [-115.06, 55.05]
                            }
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
                            const newItems = res.body;
                            newItems.name.should.not.eql(itemObject.name);
                            addToApiDoc({
                                api: `{patch} /${entity.name} [${++index}] one.`,
                                apiName: `Patch${entity.name}`,
                                apiDescription: "Patch a sensor.",
                                // apiParam: _PARAMS.slice(0, 4),
                                result: res
                            });
                            done();
                        });
                });
        });
        it("should throw an error if the return the feature of interest does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    "name": "My New Name",
                    "feature": {
                        "type": "Point",
                        "coordinates": [-115.06, 55.05]
                    }
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe(`{delete} /${entity.name} Delete.`, () => {
        it("should return no content with code 204", (done) => {
            db(entity.table)
                .select("*")
                .then((items) => {
                    const thingObject = items[items.length - 1];
                    const lengthBeforeDelete = items.length;
                    const infos = {
                        api: `{delete} /${entity.name} [${++index}] one.`,
                        apiName: `Delete${entity.name}`,
                        apiDescription: `Delete a ${entity.name}.`,
                        apiExample: `/v1.0/${entity.name}(${thingObject.id})`
                    };
                    chai.request(server)
                        .delete(infos.apiExample)
                        .end((err: any, res: any) => {
                            should.not.exist(err);
                            res.status.should.equal(204);
                            db(entity.table)
                                .select("*")
                                .then((updatedThings) => {
                                    updatedThings.length.should.eql(lengthBeforeDelete - 1);
                                    addToApiDoc({ ...infos, result: res });
                                    done();
                                });
                        });
                });
        });
        it("should throw an error if the movie does not exist", (done) => {
            chai.request(server)
                .delete(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    generateApiDoc(docs, `apiDoc${entity.name}.js`);
                    done();
                });
        });
    });
});
