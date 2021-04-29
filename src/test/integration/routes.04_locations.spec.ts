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
const entity: IEntityProperty = _ENTITIES.Locations;
let index = 0;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: `The Location entity locates the Thing(s) it associated with.<br>A Thing’s Location entity is defined as the last known location of the Thing.<br>
    A Thing can have multiple Locations if all Locations are different representations of same Location with different encodingType.`,
    result: ""
});

describe("routes : Locations", () => {
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
        it("should return all locations", (done) => {
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

        it("should respond with a single location", (done) => {
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
                    res.body["@iot.selfLink"].should.contain("/Locations(1)");
                    res.body["@iot.id"].should.eql("1");
                    res.body["Things@iot.navigationLink"].should.contain("/Locations(1)/Things");
                    res.body["HistoricalLocation@iot.navigationLink"].should.contain("/Locations(1)/HistoricalLocation");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve Locations of a specific Thing", (done) => {
            const infos = {
                api: `{get} /Things(5)/${entity.name}(:id) [${++index}] specific Thing.`,
                apiName: `GetAllFromThing${entity.name}`,
                apiDescription: "Retrieve Locations of a specific Thing.",
                apiExample: `/v1.0/Things(5)/${entity.name}`,
                apiSuccess: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(5);
                    res.body.should.include.keys("@iot.count", "value");
                    res.body.value[0].should.include.keys(entity.testsKeys);
                    res.body.value = [res.body.value[0], res.body.value[1], "..."];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the thing does not exist", (done) => {
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

    describe(`{post} /${entity.name} Create.`, () => {
        it("should return the simple location that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] basic.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    name: "My Location",
                    description: "Backyard",
                    encodingType: "application/vnd.geo+json",
                    location: {
                        type: "Point",
                        coordinates: [4.913329, 52.343029]
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
                .post("/v1.0/locations")
                .send({})
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(errorKeys);
                    res.body.message.should.eql("Something went wrong.");
                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it("should return the location with existing Thing that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with existing Thing.`,
                apiName: `PostLocationThing${entity.name}`,
                apiDescription: "POST with existing Thing.",
                apiExample: `/v1.0/Things(1)/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    name: "UofC CCIT",
                    description: "University of Calgary, CCIT building",
                    encodingType: "application/vnd.geo+json",
                    location: {
                        type: "Point",
                        coordinates: [-114.133, 51.08]
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
                    const tempSearch = await db.table("thing_location").select("*").where({ thing_id: 1, location_id: res.body["@iot.id"] });
                    tempSearch[0].should.include.keys("location_id", "thing_id");
                    tempSearch[0]["thing_id"].should.eql("1");
                    tempSearch[0]["location_id"].should.eql(res.body["@iot.id"]);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should return the location with existing Thing and FOI default that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] with Thing and new FOI.`,
                apiName: `PostLocationThingFoi${entity.name}`,
                apiDescription: "POST with existing Thing.",
                apiExample: `/v1.0/Things(2)/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    name: "UofC CCIT with New FOI",
                    description: "University of Calgary, CCIT building",
                    encodingType: "application/vnd.geo+json",
                    location: {
                        type: "Point",
                        coordinates: [-114.133, 51.08]
                    },
                    FeatureOfInterest: {
                        name: "Weather New FOI.",
                        description: "This is a weather station create by location.",
                        encodingType: "application/vnd.geo+json",
                        feature: {
                            type: "Point",
                            coordinates: [14.06, 1.05]
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
                    const tempSearch = await db.table("thing_location").select("*").where({ thing_id: 2, location_id: res.body["@iot.id"] });
                    tempSearch[0].should.include.keys("location_id", "thing_id");
                    tempSearch[0]["thing_id"].should.eql("2");
                    tempSearch[0]["location_id"].should.eql(res.body["@iot.id"]);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{patch} /${entity.name} Patch.`, () => {
        it("should return the location that was updated", (done) => {
            db(entity.table)
                .select("*")
                .then((locations) => {
                    const locationObject = locations[locations.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a thing.",
                        apiExample: `/v1.0/${entity.name}(${locationObject.id})`,
                        apiParamExample: {
                            name: "My Location has changed",
                            description: "Backyard",
                            encodingType: "application/vnd.geo+json",
                            location: {
                                type: "Point",
                                coordinates: [4.913329, 52.343029]
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
                            const newLocationObject = res.body;
                            newLocationObject.should.not.eql(locationObject.name);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });
        it("should throw an error if the thing does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    name: "My Location has changed",
                    description: "Backyard",
                    encodingType: "application/vnd.geo+json",
                    location: {
                        type: "Point",
                        coordinates: [4.913329, 52.343029]
                    }
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
