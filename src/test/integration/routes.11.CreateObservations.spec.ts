/**
 * TDD for ultime tests API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, IApiInput, prepareToApiDoc, generateApiDoc } from "./constant";

import { server } from "../../server/index";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "CreateObservations"));
};

addToApiDoc({
    api: `{infos} /CreateObservations [${++index}] infos.`,
    apiName: "CreateObservations Infos",
    apiDescription: "Create observations",
    result: ""
});

describe("routes : Create Observations", () => {
    it("should return 3 observations links added that was added", (done) => {
        const infos = {
            api: `{post} /CreateObservations [${++index}] CreateObservations FOI.`,
            apiName: "PostObservationsCreateObservationsFoiCreateObservations",
            apiDescription: "CreateObservations",
            apiExample: "/v1.0/CreateObservations",
            apiParamExample: {
                "Datastream": { "@iot.id": 1 },
                "components": ["phenomenonTime", "result", "FeatureOfInterest/id"],
                "dataArray@iot.count": 3,
                "dataArray": [
                    ["2017-01-13T10:20:00.000Z", 90, 1],
                    ["2017-01-13T10:21:00.000Z", 91, 1],
                    ["2017-01-13T10:22:00.000Z", 92, 1]
                ]
            }
        };

        chai.request(server)
            .post("/v1.0/CreateObservations")
            .send(infos.apiParamExample)
            .end((err: any, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body[0].should.include("/v1.0/Observations(");
                res.body[1].should.include("/v1.0/Observations(");
                res.body[2].should.include("/v1.0/Observations(");
                addToApiDoc({ ...infos, result: res });
                done();
            });
    });

    it("should return 3 observations links added that was added", (done) => {
        const infos = {
            api: `{post} /CreateObservations [${++index}] CreateObservations.`,
            apiName: "PostObservationsCreateObservationsCreateObservations",
            apiDescription: "CreateObservations",
            apiExample: "/v1.0/CreateObservations",
            apiParamExample: {
                "Datastream": { "@iot.id": 1 },
                "components": ["phenomenonTime", "result"],
                "dataArray@iot.count": 3,
                "dataArray": [
                    ["2017-01-13T10:20:00.000Z", 90],
                    ["2017-01-13T10:21:00.000Z", 91],
                    ["2017-01-13T10:22:00.000Z", 92]
                ]
            }
        };

        chai.request(server)
            .post("/v1.0/CreateObservations")
            .send(infos.apiParamExample)
            .end((err: any, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");
                res.body[0].should.include("/v1.0/Observations(");
                res.body[1].should.include("/v1.0/Observations(");
                res.body[2].should.include("/v1.0/Observations(");
                addToApiDoc({ ...infos, result: res });
                done();
            });
    });

    it("should throw an error if datastream does not exist", (done) => {
        chai.request(server)
            .post("/v1.0/CreateObservations")
            .send({
                "Datastream": { "@iot.id": `${BigInt(Number.MAX_SAFE_INTEGER)}` },
                "components": ["phenomenonTime", "result", "FeatureOfInterest/id"],
                "dataArray@iot.count": 3,
                "dataArray": [
                    ["2017-01-13T10:20:00.000Z", 90, 1],
                    ["2017-01-13T10:21:00.000Z", 91, 1],
                    ["2017-01-13T10:22:00.000Z", 92, 1]
                ]
            })
            .end((err: any, res: any) => {
                console.log(res.body);

                should.not.exist(err);
                res.status.should.equal(400);
                res.type.should.equal("application/json");
                docs[docs.length - 1].apiErrorExample = JSON.stringify(res.body, null, 4);
                generateApiDoc(docs, "CreateObservations.js");
                done();
            });
    });
});

// describe("routes : Create Observations", () => {
//     describe("Create Observations", () => {
//         it("should return 3 observations links added that was added", (done) => {
//             chai.request(server)
//                 .post("/v1.0/CreateObservations")
//                 .send({
//                     "Datastream": { "@iot.id": 1 },
//                     "components": ["phenomenonTime", "result", "FeatureOfInterest/id"],
//                     "dataArray@iot.count": 3,
//                     "dataArray": [
//                         ["2017-01-13T10:20:00.000Z", 90, 1],
//                         ["2017-01-13T10:21:00.000Z", 91, 1],
//                         ["2017-01-13T10:22:00.000Z", 92, 1]
//                     ]
//                 })
//                 .end((err: any, res: any) => {
//                     // there should be no errors
//                     should.not.exist(err);
//                     // there should be a 200 status code
//                     res.status.should.equal(201);
//                     // the response should be JSON
//                     res.type.should.equal("application/json");
//                     // the JSON response body should have a
//                     // key-value pair of {"value": 1 thing object}
//                     res.body[0].should.include("/v1.0/Observations(");
//                     res.body[1].should.include("/v1.0/Observations(");
//                     res.body[2].should.include("/v1.0/Observations(");
//                     done();
//                 });
//         });
//     });
// });
