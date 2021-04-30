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
const entity: IEntityProperty = _ENTITIES.Observations;
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: `An Observation is the act of measuring or otherwise determining the value of a property.<br>
    An Observation in SensorThings represents a single Sensor reading of an ObservedProperty.<br>A physical device, a Sensor, sends Observations to a specified Datastream.<br>An Observation requires a FeatureOfInterest entity, if none is provided in the request, the Location of the Thing associated with the Datastream, will be assigned to the new Observation as the FeatureOfInterest.`,
    result: ""
});

let firstID = 0;

describe("routes : Observations", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#31

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
        it("should return all observations", (done) => {
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
                            firstID = res.body.value[0]["@iot.id"];
                            done();
                        });
                });
        });

        it("should respond with a single Observation", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one.`,
                apiName: `Get${entity.name}`,
                apiDescription: `Get a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(${firstID})`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    res.body["@iot.selfLink"].should.contain(`/Observations(${firstID})`);
                    res.body["@iot.id"].should.eql(firstID);
                    res.body["Datastream@iot.navigationLink"].should.contain(`/Observations(${firstID})/Datastream`);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the observations does not exist", (done) => {
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

        it(`should returns all the Observations in the Datastream that holds the id ${firstID}`, (done) => {
            const infos = {
                api: `{get} /Datastreams(10)/${entity.name} [${++index}] from Datastream.`,
                apiName: `GetDatastreams${entity.name}`,
                apiDescription: `Get ${entity.name}s from Datastreams.`,
                apiExample: `/v1.0/Datastreams(10)/${entity.name}`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("value");

                    res.body.value = [res.body.value[0], res.body.value[1], "..."];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    it(`Retrieve a ${entity.name} with inline related enities using $expand query option.`, (done) => {
        const infos = {
            api: `{get} /${entity.name}(:id) [${++index}] Expands.`,
            apiName: `GetExpandDatastreams${entity.name}`,
            apiDescription: `Get a specific ${entity.name} and expand Datastreams.`,
            apiExample: `/v1.0/${entity.name}(1)?$expand=Datastreams`
        };
        chai.request(server)
            .get(infos.apiExample)
            .end((err: any, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.should.include.keys(_ENTITIES.Observations.testsKeys.filter((elem) => elem !== "Datastream@iot.navigationLink"));
                res.body.should.include.keys("Datastream");
                res.body.Datastream.should.include.keys(_ENTITIES.Datastreams.testsKeys);
                res.body["@iot.id"].should.eql("1");
                addToApiDoc({ ...infos, result: res });
                done();
            });
    });

    it(`Retrieve specified properties for a specific ${entity.name}.`, (done) => {
        const infos = {
            api: `{get} /${entity.name}(:id) [${++index}] Select.`,
            apiName: `GetSelectPhenomenonTime${entity.name}`,
            apiDescription: `Retrieve specified phenomenonTime, result for a specific ${entity.name}.`,
            apiExample: `/v1.0/${entity.name}(1)?$select=phenomenonTime,result`
        };
        chai.request(server)
            .get(infos.apiExample)
            .end((err: any, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                Object.keys(res.body).length.should.eql(2);
                res.body.should.include.keys("phenomenonTime");
                res.body.should.include.keys("result");
                addToApiDoc({ ...infos, result: res });
                done();
            });
    });

    describe(`{post} /${entity.name} Create.`, () => {
        it("should return the Observation that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with existing FOI.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    phenomenonTime: "2017-02-07T18:02:00.000Z",
                    resultTime: "2017-02-07T18:02:05.000Z",
                    result: 21.6,
                    Datastream: { "@iot.id": 10 }
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
                .post(`/v1.0/${entity.name}`)
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return the Observation with FeatureOfInterest that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with FOI.`,
                apiName: `PostNewFoi${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "phenomenonTime": "2017-02-07T18:02:00.000Z",
                    "resultTime": "2017-02-07T18:02:05.000Z",
                    "result": 21.6,
                    "FeatureOfInterest": {
                        "name": "UofC CCIT",
                        "description": "University of Calgary, CCIT building",
                        "encodingType": "application/vnd.geo+json",
                        "feature": {
                            "type": "Point",
                            "coordinates": [-114.133, 51.08]
                        }
                    },
                    "Datastream": { "@iot.id": 6 }
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
                .post(`/v1.0/${entity.name}`)
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return the Observation from Datastream that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] from Datastream.`,
                apiName: `PostObservationsDatastreams${entity.name}`,
                apiDescription: "POST with existing Datastream.",
                apiExample: `/v1.0/Datastreams(10)/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "phenomenonTime": "2017-02-07T18:02:00.000Z",
                    "resultTime": "2017-02-07T18:02:05.000Z",
                    "result": 21.6
                }
            };
            chai.request(server)
                .post(infos.apiExample)
                .send(infos.apiParamExample)
                .end(async (err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should return the Observation from Datastream with FeatureOfInterest that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] from Datastream and FOI.`,
                apiName: `PostObservationsDatastreamsFOI${entity.name}`,
                apiDescription: "POST with existing Datastream.",
                apiExample: `/v1.0/Datastreams(10)/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "phenomenonTime": "2017-02-07T18:02:00.000Z",
                    "resultTime": "2017-02-07T18:02:05.000Z",
                    "result": 21.6,
                    "FeatureOfInterest": {
                        "name": "UofC CCIT",
                        "description": "University of Calgary, CCIT building",
                        "encodingType": "application/vnd.geo+json",
                        "feature": {
                            "type": "Point",
                            "coordinates": [-114.133, 51.08]
                        }
                    }
                }
            };
            chai.request(server)
                .post(infos.apiExample)
                .send(infos.apiParamExample)
                .end(async (err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    const observationId = res.body["@iot.id"];
                    db.raw("select id from observation where featureofinterest_id = (select id from featureofinterest order by id desc limit 1);")
                        .then((testRes) => {
                            testRes.rows[0].id.should.eql(observationId);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        })
                        .catch((e) => console.log(e));
                });
        });
    });

    describe(`{patch} /${entity.name} Patch.`, () => {
        it("should return the Observation that was updated", (done) => {
            db("observation")
                .select("*")
                .then((items) => {
                    const itemObject = items[0];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `PatchObservation${entity.name}`,
                        apiDescription: "Patch an Observation.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            "phenomenonTime": "2016-11-18T11:04:15.790Z",
                            "resultTime": "2016-11-18T11:04:15.790Z"
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
                            newItems.resultTime.should.not.eql(itemObject.resultTime);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should return the Observation that was updated", (done) => {
            db("observation")
                .select("*")
                .then((items) => {
                    const itemObject = items[0];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] with Datastream.`,
                        apiName: `PatchObservationDatastream${entity.name}`,
                        apiDescription: "Patch an Observation with datastream.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            "phenomenonTime": "2016-11-18T11:04:15.790Z",
                            "resultTime": "2016-11-18T11:04:15.790Z",
                            "result": 20.4,
                            "Datastream": { "@iot.id": 6 }
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
                            newItems.result.should.not.eql(itemObject.result);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should throw an error if the Observation does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    phenomenonTime: "2016-11-18T11:04:15.790Z",
                    resultTime: "2016-11-18T11:04:15.790Z",
                    result: 20.4,
                    Datastream: { "@iot.id": 1 }
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
            db("observation")
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
                            db("observation")
                                .select("*")
                                .then((newItems) => {
                                    newItems.length.should.eql(lengthBeforeDelete - 1);
                                    addToApiDoc({ ...infos, result: res });
                                    done();
                                });
                        });
                });
        });
        it("should throw an error if the sensor does not exist", (done) => {
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
