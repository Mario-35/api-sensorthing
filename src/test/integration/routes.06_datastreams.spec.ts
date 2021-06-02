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
import { _DBDATAS, IEntityProperty } from "../../server/constant";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _DBDATAS.Datastreams;
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: "A Datastream groups a collection of Observations measuring the same ObservedProperty and produced by the same Sensor.",
    result: ""
});

let firstID = 0;

describe("routes : Datastream", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#28

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
        it("should return all Datastream", (done) => {
            const infos = {
                api: `{get} /${entity.name} [${++index}] all.`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiSuccess: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
            };
            db("datastream")
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

        it("should respond with a single Datastream", (done) => {
            const id: number = firstID;
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one.`,
                apiName: `Get${entity.name}`,
                apiDescription: `Get a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(${id})`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(entity.testsKeys);
                    res.body["@iot.id"].should.eql(`${id}`);
                    res.body["@iot.selfLink"].should.contain(`/Datastreams(${id})`);
                    res.body["Sensor@iot.navigationLink"].should.contain(`/Datastreams(${id})/Sensor`);
                    res.body["ObservedProperty@iot.navigationLink"].should.contain(`/Datastreams(${id})/ObservedProperty`);
                    res.body["Observations@iot.navigationLink"].should.contain(`/Datastreams(${id})/Observations`);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the Datastream does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/(${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("Retrieve Datastreams of a specific Thing.", (done) => {
            const id = 6;
            const infos = {
                api: `{get} /Things(${id})/${entity.name}(:id) [${++index}] specific Thing .`,
                apiName: `GetThings${entity.name}`,
                apiDescription: `Get ${entity.name}s from Things.`,
                apiExample: `/v1.0/Things(${id})/${entity.name}`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("value");
                    res.body.value[0].should.include.keys(entity.testsKeys);
                    res.body["@iot.count"].should.eql("3");
                    res.body.value.length.should.eql(3);
                    res.body.value[0]["@iot.id"].should.eql("8");
                    res.body.value[0]["@iot.selfLink"].should.contain("/Datastreams(8)");
                    res.body.value[0]["Sensor@iot.navigationLink"].should.contain("/Datastreams(8)/Sensor");
                    res.body.value[0]["ObservedProperty@iot.navigationLink"].should.contain("/Datastreams(8)/ObservedProperty");
                    res.body.value[0]["Observations@iot.navigationLink"].should.contain("/Datastreams(8)/Observations");
                    res.body.value = [res.body.value[0], res.body.value[1], "..."];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the Datastream does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/Things(${BigInt(Number.MAX_SAFE_INTEGER)})/${entity.name}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it(`Retrieve a specific ${entity.name} with inline related entities information using $expand query option.`, (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] Expands.`,
                apiName: `GetExpandObservations${entity.name}`,
                apiDescription: `Get a specific ${entity.name} and expand Observations, and ObservedProperty.`,
                apiExample: `/v1.0/${entity.name}(10)?$expand=Observations,ObservedProperty`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_DBDATAS.Datastreams.testsKeys.filter((elem) => elem !== "Observations@iot.navigationLink"));
                    res.body.should.include.keys("Observations");
                    // res.body.Observations.length.should.eql(9);
                    res.body.Observations[0].should.include.keys(_DBDATAS.Observations.testsKeys);
                    res.body["@iot.id"].should.eql("10");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{post} /${entity.name} Create.`, () => {
        it("should return the Datastream that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with existing Thing.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "unitOfMeasurement": {
                        "symbol": "μg/m³",
                        "name": "PM 2.5 Particulates (ug/m3)",
                        "definition": "http://unitsofmeasure.org/ucum.html"
                    },
                    "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    "description": "Air quality readings",
                    "name": "air_quality_readings",
                    "Thing": { "@iot.id": 1 },
                    "ObservedProperty": { "@iot.id": 1 },
                    "Sensor": { "@iot.id": 1 }
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
                .post("/v1.0/Datastreams")
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return the datastream that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with a Thing.`,
                apiName: `PostLocationThing${entity.name}`,
                apiDescription: "POST with existing Thing.",
                apiExample: `/v1.0/Things(1)/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    name: "Air Temperature DS",
                    description: "Datastream for recording temperature",
                    observationType: "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    unitOfMeasurement: {
                        name: "Degree Celsius",
                        symbol: "degC",
                        definition: "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
                    },
                    ObservedProperty: {
                        name: "Area Temperature",
                        description: "The degree or intensity of heat present in the area",
                        definition: "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
                    },
                    Sensor: {
                        name: "DHT22",
                        description: "DHT22 temperature sensor",
                        encodingType: "application/pdf",
                        metadata: "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
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
                    // const tempSearch = await db.table('thing_location').select('*').where({thing_id: 1, location_id: res.body.value['@iot.id']});
                    // tempSearch[0].should.include.keys('id', 'location_id', 'thing_id');
                    // tempSearch[0]['thing_id'].should.eql('1');
                    // tempSearch[0]['location_id'].should.eql(res.body.value['@iot.id']);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{patch} /${entity.name} Patch.`, () => {
        it("should return the datastream sensor that was updated", (done) => {
            db("datastream")
                .select("*")
                .then((items) => {
                    const itemObject = items[items.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a Datastreams.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            unitOfMeasurement: {
                                name: "Degrees Fahrenheit",
                                symbol: "degF",
                                definition: "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeFahrenheit"
                            },
                            description: "Water Temperature of Bow river"
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
                            newItems.description.should.not.eql(itemObject.description);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });
        it("should throw an error if the datastream does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    unitOfMeasurement: {
                        symbol: "ºC",
                        name: "Celsius",
                        definition: "http://unitsofmeasure.org/ucum.html"
                    },
                    observationType: "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    description: "Temp readings",
                    name: "temp_readings"
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    // the JSON response body should have a

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe(`{delete} /${entity.name} Delete.`, () => {
        it("should return no content with code 204", (done) => {
            db("datastream")
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
                            db("datastream")
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
