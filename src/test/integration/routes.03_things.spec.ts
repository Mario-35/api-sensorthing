/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { _ENTITIES, IEntityProperty, errorCode } from "../../server/constant";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _ENTITIES.Things;
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: `A Thing is an object of the physical world (physical Things) or the information world (virtual Things) that is capable of being identified and integrated into communication networks<br>
    Thing is a good starting point to start creating the SensorThings model structure.<br>
    <br>
    A Thing has Locations and one or more Datastreams to collect Observations. A minimal Thing can be created without a Location and Datastream and there are options to create a Things with a nested linked Location and Datastream.`,
    result: ""
});

describe("routes : Thing [8.2.1]", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25

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

    describe(`{get} /${entity.name}`, () => {
        it("should return all things", (done) => {
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
                    const nb = Number(result[0]["count"]) > 200 ? 200 : Number(result[0]["count"]);
                    chai.request(server)
                        .get(infos.apiExample)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb);
                            if (nb >= 200) res.body.should.include.keys("@iot.count", "@iot.nextLink", "value");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should respond with a single thing", (done) => {
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
                    res.body["@iot.id"].should.eql("1");
                    res.body["@iot.selfLink"].should.contain("/Things(1)");
                    res.body["Locations@iot.navigationLink"].should.contain("/Things(1)/Locations");
                    res.body["HistoricalLocation@iot.navigationLink"].should.contain("/Things(1)/HistoricalLocation");
                    res.body["Datastreams@iot.navigationLink"].should.contain("/Things(1)/Datastreams");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the element does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.error.should.eql(errorCode[404].error);
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should respond with a single thing and only name", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] property name.`,
                apiName: `GetName${entity.name}`,
                apiDescription: `Get the name of a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(1)/name`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be JSON
                    res.type.should.equal("application/json");
                    // the JSON response body should have a
                    // key-value pair of {"value": 1 thing object}
                    res.body.should.include.keys("name");
                    Object.keys(res.body).length.should.eql(1);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should respond with a single thing property and only name value", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] value of property name.`,
                apiName: `GetNameValue${entity.name}`,
                apiDescription: `Get the value of the property name of a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(1)/name/$value`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be text plain
                    res.type.should.equal("text/plain");
                    res.text.should.contain("SensorWebThing");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{post} /${entity.name} Create. [10.2.1]`, () => {
        // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#61
        it("should return the thing that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] basic.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "description": "A SensorWeb thing",
                    "name": "SensorWebThing",
                    "properties": {
                        "organization": "Mozilla",
                        "owner": "Mozilla"
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

        it("POST with new Location", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with new Location.`,
                apiName: `Post${entity.name}Location`,
                apiDescription: "A Location entity can be linked to a Thing at its creation time. The Location provided will be a new Location in the system.",
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "name": "Temperature Monitoring System",
                    "description": "Thing (POST with new Location)",
                    "properties": {
                        "Deployment Condition": "Deployed in a third floor balcony",
                        "Case Used": "Radiation shield"
                    },
                    "Locations": [
                        {
                            "name": "UofC (Created new location)",
                            "description": "University of Calgary, CCIT building",
                            "encodingType": "application/vnd.geo+json",
                            "location": {
                                "type": "Point",
                                "coordinates": [-114.133, 51.08]
                            }
                        }
                    ]
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
                    const thingId = res.body["@iot.id"];
                    db("location")
                        .orderBy("id", "desc")
                        .select("id")
                        .first()
                        .then((locationRes) => {
                            db("thing_location")
                                .where({ thing_id: thingId, location_id: locationRes.id })
                                .then((tempSearchNew) => {
                                    if (tempSearchNew && tempSearchNew[0]) {
                                        tempSearchNew[0]["location_id"].should.eql(locationRes.id);
                                        tempSearchNew[0]["thing_id"].should.eql(thingId);
                                        db("historical_location")
                                            .orderBy("id", "desc")
                                            .select("thing_id")
                                            .first()
                                            .then((historical_locationRes) => {
                                                if (historical_locationRes && historical_locationRes) {
                                                    historical_locationRes["thing_id"].should.eql(thingId);
                                                    addToApiDoc({ ...infos, result: res });
                                                    done();
                                                }
                                            })
                                            .catch((e) => console.log(e));
                                    }
                                })
                                .catch((e) => console.log(e));
                        })
                        .catch((e) => console.log(e));
                });
        });

        it("POST with existing Location", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with existing Location.`,
                apiName: "PostThingExistLocation",
                apiDescription: "Create a thing with existing location.",
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "name": "Temperature Monitoring System",
                    "description": "Sensor (POST with existing Location)",
                    "properties": {
                        "Deployment Condition": "Deployed in a third floor balcony",
                        "Case Used": "Radiation shield"
                    },
                    "Locations": [{ "@iot.id": "1" }]
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
                    const thingId = res.body["@iot.id"];
                    db("thing_location")
                        .where({ thing_id: thingId, location_id: 1 })
                        .then((tempSearchNew) => {
                            if (tempSearchNew && tempSearchNew[0]) {
                                tempSearchNew[0]["location_id"].should.eql("1");
                                tempSearchNew[0]["thing_id"].should.eql(thingId);
                                db("historical_location")
                                    .orderBy("id", "desc")
                                    .select("thing_id")
                                    .first()
                                    .then((historical_locationRes) => {
                                        if (historical_locationRes && historical_locationRes) {
                                            historical_locationRes["thing_id"].should.eql(thingId);
                                            addToApiDoc({ ...infos, result: res });
                                            done();
                                        }
                                    })
                                    .catch((e) => console.log(e));
                            }
                        })
                        .catch((e) => console.log(e));
                });
        });

        it("POST with existing Location that don't exist", (done) => {
            chai.request(server)
                .post("/v1.0/things")
                .send({
                    "name": "Temperature Monitoring System",
                    "description": "Sensor (POST with existing Location not exist)",
                    "properties": {
                        "Deployment Condition": "Deployed in a third floor balcony",
                        "Case Used": "Radiation shield"
                    },
                    "Locations": [{ "@iot.id": 1908 }]
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    // res.body.message.should.eql("No id found for Locations : 1908");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("POST with Location and Datastream", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with Location and Datastream.`,
                apiName: "PostThingLocationDatastream",
                apiDescription: "Create a thing with new location & datastream.",
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    "name": "Temperature Monitoring System",
                    "description": "Sensor system monitoring area temperature Hot",
                    "properties": {
                        "Deployment Condition": "Deployed in a third floor balcony",
                        "Case Used": "Radiation shield"
                    },
                    "Locations": [
                        {
                            "name": "UofC CCIT",
                            "description": "University of Calgary, CCIT building",
                            "encodingType": "application/vnd.geo+json",
                            "location": {
                                "type": "Point",
                                "coordinates": [-114.133, 51.08]
                            }
                        }
                    ],
                    "Datastreams": [
                        {
                            "name": "Air Temperature DS",
                            "description": "Datastream for recording temperature",
                            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                            "unitOfMeasurement": {
                                "name": "Degree Celsius",
                                "symbol": "degC",
                                "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
                            },
                            "ObservedProperty": {
                                "name": "Area Temperature",
                                "description": "The degree or intensity of heat present in the area",
                                "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
                            },
                            "Sensor": {
                                "name": "DHT22",
                                "description": "DHT22 temperature sensor",
                                "encodingType": "application/pdf",
                                "metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
                            }
                        }
                    ]
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
                    const thingId = res.body["@iot.id"];
                    db("datastream")
                        .orderBy("id", "desc")
                        .first()
                        .then((datastreamRes) => {
                            db("sensor")
                                .select("id")
                                .orderBy("id", "desc")
                                .first()
                                .then((sensorRes) => {
                                    db("observedproperty")
                                        .select("id")
                                        .orderBy("id", "desc")
                                        .first()
                                        .then((observedpropertyRes) => {
                                            datastreamRes["thing_id"].should.eql(thingId);
                                            datastreamRes["sensor_id"].should.eql(sensorRes.id);
                                            datastreamRes["observedproperty_id"].should.eql(observedpropertyRes.id);
                                            addToApiDoc({ ...infos, result: res });
                                            done();
                                        })
                                        .catch((e) => console.log(e));
                                })
                                .catch((e) => console.log(e));
                        })
                        .catch((e) => console.log(e));
                });
        });

        it("should throw an error if the payload is malformed", (done) => {
            chai.request(server)
                .post("/v1.0/things")
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.error.should.eql(errorCode[400].error);
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });
    });

    describe(`{patch} /${entity.name} one thing.`, () => {
        it("should return the thing that was updated", (done) => {
            db(entity.table)
                .select("*")
                .then((things) => {
                    const thingObject = things[things.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a thing.",
                        apiExample: `/v1.0/${entity.name}(${thingObject.id})`,
                        apiParamExample: {
                            "name": "New SensorWebThing Patch",
                            "properties": {
                                "organization": "Mozilla",
                                "owner": "Mozilla"
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
                            const newThingObject = res.body;
                            newThingObject.name.should.not.eql(thingObject.name);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should throw an error if the element does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    "description": "A SensorWeb thing",
                    "name": "New SensorWebThing",
                    "properties": {
                        "organization": "Mozilla",
                        "owner": "Mozilla"
                    }
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.error.should.eql(errorCode[404].error);
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return the thing that was updated with location change", (done) => {
            db(entity.table)
                .select("*")
                .then((things) => {
                    const thingObject = things[things.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] and change Location.`,
                        apiName: `PatchLocation${entity.name}`,
                        apiDescription: "Patch a thing and location change.",
                        apiExample: `/v1.0/${entity.name}(${thingObject.id})`,
                        apiParamExample: {
                            "name": "New SensorWebThing back",
                            "properties": {
                                "organization": "Mozilla",
                                "owner": "Mozilla"
                            },
                            "Locations": [{ "@iot.id": 10 }]
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
                            const thingId = res.body["@iot.id"];
                            db("thing_location")
                                .where({ thing_id: thingId, location_id: 10 })
                                .then((tempSearchNew) => {
                                    if (tempSearchNew && tempSearchNew[0]) {
                                        tempSearchNew[0]["location_id"].should.eql("10");
                                        tempSearchNew[0]["thing_id"].should.eql(thingId);
                                        db("historical_location")
                                            .orderBy("id", "desc")
                                            .select("thing_id")
                                            .first()
                                            .then((historical_locationRes) => {
                                                if (historical_locationRes && historical_locationRes) {
                                                    historical_locationRes["thing_id"].should.eql(thingId);
                                                    addToApiDoc({ ...infos, result: res });
                                                    done();
                                                }
                                            })
                                            .catch((e) => console.log(e));
                                    }
                                })
                                .catch((e) => console.log(e));
                        });
                });
        });
    });

    describe(`{delete} /${entity.name} Delete.`, () => {
        it("should return no content with code 204", (done) => {
            db(entity.table)
                .select("*")
                .then((things) => {
                    const thingObject = things[things.length - 1];
                    const lengthBeforeDelete = things.length;

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
                                    db("historical_location")
                                        .select("*")
                                        .where({ thing_id: thingObject.id })
                                        .then((hists) => {
                                            hists.length.should.eql(0);
                                            addToApiDoc({ ...infos, result: res });
                                            done();
                                        });
                                });
                        });
                });
        });
        it("should throw an error if the thing does not exist", (done) => {
            chai.request(server)
                .delete(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.error.should.eql(errorCode[404].error);
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    generateApiDoc(docs, `apiDoc${entity.name}.js`);
                    done();
                });
        });
    });
});
