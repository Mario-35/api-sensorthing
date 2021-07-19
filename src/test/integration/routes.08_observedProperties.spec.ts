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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, createListColumns } from "./constant";
import { server } from "../../server/index";
import { db } from "../../server/db";
import { _DBDATAS, IEntityProperty } from "../../server/constant";
import { testsKeys as sensors_testsKeys } from "./routes.07_sensors.spec";
import { testsKeys as datastreams_testsKeys } from "./routes.06_datastreams.spec";

export const testsKeys = ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description", "definition"];

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _DBDATAS.ObservedProperties;
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription: "An ObservedProperty specifies the phenomenon of an Observation.",
    result: ""
});

describe("routes : ObservedProperties", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#30

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
        it(`{get} /${entity.name}.`, (done) => {
            const infos = {
                api: `{get} /${entity.name} [${++index}] all.`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiSuccess: ["{number} id @iot.id", "{relation} selfLink @iot.selfLink", ...success]
            };
            db("observedproperty")
                .count()
                .then((result) => {
                    const nb = Number(result[0]["count"]) > 200 ? 200 : Number(result[0]["count"]);
                    chai.request(server)
                        .get(`/v1.0/${entity.name}`)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb);
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value[0].should.include.keys(testsKeys);
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should respond with a single observed property", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one.`,
                apiName: `Get${entity.name}`,
                apiDescription: `Get a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(2)`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.selfLink"].should.contain("/ObservedProperties(2)");
                    res.body["@iot.id"].should.eql("2");
                    res.body["Datastreams@iot.navigationLink"].should.contain("/ObservedProperties(2)/Datastreams");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the observed properties does not exist", (done) => {
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

        it("Retrieve the ObservedProperty of a specific Datastream.", (done) => {
            const id = 8;
            const infos = {
                api: `{get} /Datastream(10/${entity.name} [${++index}] specific Datastream .`,
                apiName: `GetDatastream${entity.name}`,
                apiDescription: `Get ${entity.name}s from Datastream.`,
                apiExample: `/v1.0/Datastream(${id})/${entity.name}`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("value");
                    res.body.value[0].should.include.keys(testsKeys);
                    res.body["@iot.count"].should.eql("1");
                    res.body.value.length.should.eql(1);
                    res.body.value[0]["@iot.id"].should.eql(id.toString());
                    res.body.value[0]["@iot.selfLink"].should.contain(`/ObservedProperties(${id})`);
                    res.body.value[0]["Datastreams@iot.navigationLink"].should.contain(`/ObservedProperties(${id})/Datastreams`);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("should throw an error if the Datastream does not exist", (done) => {
            chai.request(server)
                .get(`/v1.0/Datastream(${BigInt(Number.MAX_SAFE_INTEGER)})/${entity.name}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    res.type.should.equal("application/json");

                    docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                    done();
                });
        });

        it(`Retrieve a ${entity.name} with inline related entities using $expand query option.`, (done) => {
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
                    res.body.should.include.keys(sensors_testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                    res.body.should.include.keys("Datastreams");
                    res.body.Datastreams[0].should.include.keys(datastreams_testsKeys);
                    res.body["@iot.id"].should.eql("1");
                    res.body.Datastreams = [res.body.Datastreams[0], res.body.Datastreams[1], "..."];

                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it(`Retrieve specified properties for a specific ${entity.name}.`, (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] Select.`,
                apiName: `GetSelectDescription${entity.name}`,
                apiDescription: `Retrieve specified properties for a specific ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}(1)?$select=description`
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    Object.keys(res.body).length.should.eql(1);
                    res.body.should.include.keys("description");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe(`{post} /${entity.name} Create,`, () => {
        it("should return the ObservedProperty that was added", (done) => {
            const infos = {
                api: `{post} /${entity.name} [${++index}] basic.`,
                apiName: `Post${entity.name}`,
                apiDescription: `Post a new ${entity.table}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiParam: params,
                apiParamExample: {
                    name: "Area Temperature",
                    description: "The degree or intensity of heat present in the area",
                    definition: "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
                }
            };
            chai.request(server)
                .post(infos.apiExample)
                .send(infos.apiParamExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
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
    });

    describe(`{patch} /${entity.name} Patch.`, () => {
        it("should return the historical sensor that was updated", (done) => {
            db("observedproperty")
                .select("*")
                .then((items) => {
                    const itemObject = items[items.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a thing.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            name: "New PM 2.5 Observation"
                        }
                    };
                    chai.request(server)
                        .patch(infos.apiExample)
                        .send(infos.apiParamExample)
                        .end((err: any, res: any) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.should.include.keys(testsKeys);
                            res.body.name.should.not.eql(itemObject.name);
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });
        it("should throw an error if the sensor does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    name: "New PM 2.5 Observation"
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
            db("observedproperty")
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
                            db("observedproperty")
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
