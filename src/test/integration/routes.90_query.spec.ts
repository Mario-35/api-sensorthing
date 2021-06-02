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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc } from "./constant";
import { server } from "../../server/index";
import { db } from "../../server/db";
import { _DBDATAS } from "../../server/constant";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "Query"));
};

addToApiDoc({
    api: `{infos} Query [${++index}] infos.`,
    apiName: "QueryInfos",
    apiDescription: `The use of query options allows refining the requests to help get the required information about the SensorThings entities in an easy and efficient manner. Each of the listed query options are available for each SensorThings entity, however the options for each may differ.<br>
        SensorThings query options can be categorized to two different groups.<br>
          -  The first group specifies the properties to be returned by the request. $expand and $select are query options of this group.<br>
          -  The second group is limiting, filtering, or re-ordering the request results. This group contains $orderby, $top, $skip, $count, and $filter.`,
    result: ""
});

describe("Query", () => {
    // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25

    describe("{get} /Query", () => {
        it("Retrieve a specific thing and $expand Datastreams.", (done) => {
            const infos = {
                api: `{get} /Things(:id) [${++index}] Expand.`,
                apiName: "GetExpandDatastreamsThings",
                apiDescription: "Use $expand query option to request inline information for related entities of the requested entity collection..",
                apiExample: "/v1.0/Things(6)?$expand=Datastreams"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_DBDATAS.Things.testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                    res.body.should.include.keys("Datastreams");
                    res.body.Datastreams.length.should.eql(3);
                    res.body.Datastreams[0].should.include.keys(_DBDATAS.Datastreams.testsKeys);
                    res.body["@iot.id"].should.eql("6");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve a specific thing and $expand Datastreams and Sensor inside.", (done) => {
            const infos = {
                api: `{get} /Things(:id) [${++index}] Expand sub Entity.`,
                apiName: "GetExpandDatastreamsSensorThings",
                apiDescription: "$expand comma separated list of sub-entity names or sub-entity names separated by forward slash.",
                apiExample: "/v1.0/Things(6)?$expand=Datastreams/Sensor"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_DBDATAS.Things.testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                    res.body["@iot.id"].should.eql("6");
                    res.body.should.include.keys("Datastreams");
                    res.body.Datastreams.length.should.eql(3);
                    // res.body.Datastreams[0].should.include.keys(_DBDATAS.Datastreams.testsKeys);
                    res.body.Datastreams[0].should.include.keys("Sensor");
                    res.body.Datastreams[0].Sensor.should.include.keys(_DBDATAS.Sensors.testsKeys);

                    res.body.Datastreams[1].should.include.keys("Sensor");
                    res.body.Datastreams[1].Sensor.should.include.keys(_DBDATAS.Sensors.testsKeys);

                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve a specific thing and $expand Datastreams, ObservedProperty and Sensor inside.", (done) => {
            const infos = {
                api: `{get} /Things(:id) [${++index}] Expand multi entities.`,
                apiName: "GetExpandDatastreamsSensorObservedPropertyThings",
                apiDescription:
                    "Retrieve a Things with inline related entities using $expand query option. Query options can be used on the entire collection of entities or on individual ones.",
                apiExample: "/v1.0/Things(6)?$expand=Datastreams/Sensor,ObservedProperty"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys(_DBDATAS.Things.testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                    res.body["@iot.id"].should.eql("6");
                    res.body.should.include.keys("Datastreams");
                    res.body.Datastreams.length.should.eql(3);
                    // res.body.Datastreams[0].should.include.keys(_DBDATAS.Datastreams.testsKeys);
                    res.body.Datastreams[0].should.include.keys("Sensor");
                    res.body.Datastreams[0].should.include.keys("ObservedProperty");
                    res.body.Datastreams[0].Sensor.should.include.keys(_DBDATAS.Sensors.testsKeys);
                    res.body.Datastreams[0].ObservedProperty.should.include.keys(_DBDATAS.ObservedProperties.testsKeys);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve description property for a specific Thing.", (done) => {
            const infos = {
                api: `{get} /Things(:id) [${++index}] Select.`,
                apiName: "GetSelect",
                apiDescription: "Retrieve specified properties for a specific Things.",
                apiExample: "/v1.0/Things(1)?$select=description"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.should.include.keys("description");
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve name and description properties from all Things.", (done) => {
            const infos = {
                api: `{get} /Things(:id) [${++index}] Select multi.`,
                apiName: "GetSelectMulti",
                apiDescription: "Retrieve name and description for Things.",
                apiExample: "/v1.0/Things?$select=name,description"
            };
            db("thing")
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
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value[0].should.include.keys("description", "name");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("Retrieve things order by name descending.", (done) => {
            const infos = {
                api: `{get} /Things [${++index}] OrderBy.`,
                apiName: "GetOrderByThings",
                apiDescription:
                    "Use $orderby query option to sort the response based on properties of requested entity in ascending (asc) or descending (desc) order.",
                apiExample: "/v1.0/Things?$orderby=name desc"
            };
            db("thing")
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
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value[0].should.include.keys("description", "name");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("Retrieve Observations limit to 5 results.", (done) => {
            const infos = {
                api: `{get} /Observations [${++index}] Top.`,
                apiName: "GetTopObservations",
                apiDescription: "Use $top query option to limit the number of requested entities.",
                apiExample: "/v1.0/Observations?$top=5"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(5);
                    res.body.should.include.keys("@iot.count", "value");
                    res.body.value = [res.body.value[0], res.body.value[1], "..."];
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });

        it("Retrieve all Observations and skip 3.", (done) => {
            const infos = {
                api: `{get} /Observations [${++index}] Skip.`,
                apiName: "GetSelectMultiThings",
                apiDescription: "Use $skip to specify the number of entities that should be skipped before returning the requested entities.",
                apiExample: "/v1.0/Observations?$skip=3"
            };
            db("observation")
                .count()
                .then((result) => {
                    const nb = Number(result[0]["count"]);
                    chai.request(server)
                        .get(infos.apiExample)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb - 3);
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("Retrieve Observations with result equal 45.", (done) => {
            const infos = {
                api: `{get} /Observations [${++index}] eq.`,
                apiName: "GetEqualObservations",
                apiDescription: "Use $filter query option to perform conditional operations on the property values and filter request result.",
                apiExample: "/v1.0/Observations?$filter=result eq 45"
            };
            db("observation")
                .whereRaw("result = 45")
                .count()
                .then((result) => {
                    const nb = Number(result[0]["count"]);
                    chai.request(server)
                        .get(infos.apiExample)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb);
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });

        it("Retrieve Observations with result less 45.", (done) => {
            const infos = {
                api: `{get} /Observations [${++index}] lt.`,
                apiName: "GetLessObservations",
                apiDescription: "Use $filter query option to perform conditional operations on the property values and filter request result.",
                apiExample: "/v1.0/Observations?$filter=result lt 45"
            };
            db("observation")
                .whereRaw("result < 45")
                .count()
                .then((result) => {
                    const nb = Number(result[0]["count"]);
                    chai.request(server)
                        .get(infos.apiExample)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.equal(200);
                            res.type.should.equal("application/json");
                            res.body.value.length.should.eql(nb);
                            res.body.should.include.keys("@iot.count", "value");
                            res.body.value = [res.body.value[0], res.body.value[1], "..."];
                            addToApiDoc({ ...infos, result: res });
                            done();
                        });
                });
        });
    });

    describe("Save apiDocQuery.", () => {
        it("Do not test only for save apiDoc", (done) => {
            docs[docs.length - 1].apiErrorExample = JSON.stringify("", null, 4);
            generateApiDoc(docs, "apiDocQuery.js");
            done();
        });
    });
});
