process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import path from "path";
import { IApiDoc, prepareToApiDoc, generateApiDoc } from "./constant";

chai.use(chaiHttp);

const should = chai.should();

import { server } from "../../server/index";

const docs: IApiDoc[] = [];

describe("routes : index", () => {
    describe("GET /v1.0/ [9.2.1]", () => {
        // http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#36

        it("should return json", (done) => {
            const infos = {
                api: "{get} / [0] resource path.",
                apiName: "GetPaths",
                apiDescription: "Access to all resources begins at the base resource path.",
                apiExample: "/v1.0/",
                apiSuccess: [
                    "{relation} Datastreams Get all datastreams.",
                    "{relation} MultiDatastreams Get all multidatastreams.",
                    "{relation} FeaturesOfInterest Get all features of interest.",
                    "{relation} HistoricalLocation Get all historical locations.",
                    "{relation} Locations Get all locations.",
                    "{relation} Observations Get all observations.",
                    "{relation} ObservedProperties Get all observed property.",
                    "{relation} Sensors Get all sensors.",
                    "{relation} Things Get all things."
                ]
            };

            chai.request(server)
                .get(infos.apiExample)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.value[0].url.should.contain("/Datastreams");
                    res.body.value[1].url.should.contain("/Multidatastreams");
                    res.body.value[2].url.should.contain("/MultiDatastreamObservedproperties");
                    res.body.value[3].url.should.contain("/FeaturesOfInterest");
                    res.body.value[4].url.should.contain("/HistoricalLocation");
                    res.body.value[5].url.should.contain("/Locations");
                    res.body.value[6].url.should.contain("/Observations");
                    res.body.value[7].url.should.contain("/ObservedProperties");
                    res.body.value[8].url.should.contain("/Sensors");
                    res.body.value[9].url.should.contain("/Things");
                    fs.mkdirSync(path.resolve(__dirname, "../apiDocs/"), {
                        recursive: true
                    });
                    let filename = "../header.md";

                    fs.writeFileSync(path.resolve(__dirname, filename), "Introduction", {
                        encoding: "utf-8"
                    });
                    filename = "../footer.md";
                    fs.writeFileSync(path.resolve(__dirname, filename), "The SensorThings API uses the following error codes :", {
                        encoding: "utf-8"
                    });
                    docs.push(prepareToApiDoc({ ...infos, result: res }, "Root"));
                    generateApiDoc(docs, "apiDocRoot.js");

                    done();
                });
        });
    });
});
