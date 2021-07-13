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
import { testsKeys as datastreams_testsKeys } from "./routes.06_datastreams.spec";
export const testsKeys = ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description"];

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: IEntityProperty = _DBDATAS.Sensors;
let index = 0;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, entity.name));
};

addToApiDoc({
    api: `{infos} /${entity.name} [${++index}] infos.`,
    apiName: `${entity.name} Infos`,
    apiDescription:
        "A Sensor in SensorThings API is an instrument that observes a property or phenomenon with the goal of producing an estimate of the value of the property.",
    result: ""
});

const _PARAMS: string[] = [
    "{String} [name] name of the Thing.",
    "{String} description description of the Thing.",
    "{ValueCode} encodingType encodingType ValueCode.",
    "{metadata} metadata depending on the value of the encodingType"
];

describe("routes : Sensors", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#29

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
        it("should return all sensors", (done) => {
            const infos = {
                api: `{get} /${entity.name} [${++index}] all.`,
                apiName: `GetAll${entity.name}`,
                apiDescription: `Retrieve all ${entity.name}.`,
                apiExample: `/v1.0/${entity.name}`,
                apiSuccess: columns
            };
            db("sensor")
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
                            res.body.value[0].should.include.keys(testsKeys);
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("should respond with a single sensors", (done) => {
            const infos = {
                api: `{get} /${entity.name}(:id) [${++index}] one.`,
                apiName: `Get${entity.name}`,
                apiDescription: "Get a specific sensor.",
                apiExample: `/v1.0/${entity.name}(1)`
            };
            chai.request(server)
                .get(`/v1.0/${entity.name}(1)`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(testsKeys);
                    res.body["@iot.selfLink"].should.contain("/Sensors(1)");
                    res.body["@iot.id"].should.eql("1");
                    res.body["Datastreams@iot.navigationLink"].should.contain("/Sensors(1)/Datastreams");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
        it("should throw an error if the sensor does not exist", (done) => {
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
                    res.body.should.include.keys(testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
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

    describe(`{post} /${entity.name} Create.`, () => {
        const infos = {
            api: `{post} /${entity.name} [${++index}] basic.`,
            apiName: `Post${entity.name}`,
            apiDescription: "Post a new sensor.",
            apiExample: `/v1.0/${entity.name}`,
            apiParam: _PARAMS.slice(0, 4),
            apiParamExample: {
                description: "PM 2.5 sensor",
                name: "PM25sensor",
                encodingType: "application/pdf",
                metadata: "http://particle-sensor.com/"
            }
        };
        it("should return the sensor that was added", (done) => {
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
                .post("/v1.0/Sensors")
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
        it("should return the sensor that was updated", (done) => {
            db("sensor")
                .select("*")
                .then((items) => {
                    const itemObject = items[items.length - 1];
                    const infos = {
                        api: `{patch} /${entity.name} [${++index}] one.`,
                        apiName: `Patch${entity.name}`,
                        apiDescription: "Patch a Datastreams.",
                        apiExample: `/v1.0/${entity.name}(${itemObject.id})`,
                        apiParamExample: {
                            description: "This is a new PM 2.5 sensor"
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
                            const newItems = res.body;
                            newItems.description.should.not.eql(itemObject.description);
                            addToApiDoc({
                                api: `{patch} /${entity.name} [${++index}] one.`,
                                apiName: `Patch${entity.name}`,
                                apiDescription: "Patch a sensor.",
                                apiParam: _PARAMS.slice(0, 4),
                                result: res
                            });
                            done();
                        });
                });
        });
        it("should throw an error if the sensor does not exist", (done) => {
            chai.request(server)
                .patch(`/v1.0/${entity.name}(${BigInt(Number.MAX_SAFE_INTEGER)})`)
                .send({
                    description: "This is a new PM 2.5 sensor"
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
            db("sensor")
                .select("*")
                .then((items) => {
                    const itemObject = items[items.length - 1];
                    const lengthBefore = items.length;
                    chai.request(server)
                        .delete(`/v1.0/${entity.name}(${itemObject.id})`)
                        .end((err: any, res: any) => {
                            should.not.exist(err);
                            res.status.should.equal(204);
                            db("sensor")
                                .select("*")
                                .then((newItems) => {
                                    newItems.length.should.eql(lengthBefore - 1);
                                    addToApiDoc({
                                        api: `{delete} /${entity.name} [${++index}] one.`,
                                        apiName: `Delete${entity.name}`,
                                        apiDescription: "Delete a sensor.",
                                        result: res
                                    });
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
