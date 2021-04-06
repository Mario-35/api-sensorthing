/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TDD for Format API.
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

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
let index = 10;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "Formats"));
};

addToApiDoc({
    api: `{infos} /Format [${++index}] infos.`,
    apiName: "FormatInfos",
    apiDescription: "Format result JSON as default, CSV with comma separator, note that $value return result as text.",
    result: ""
});

describe("Formats", () => {
    describe("{get} /resultFormat CSV", () => {
        it("Return result in CSV format.", (done) => {
            const infos = {
                api: `{get} /Things(:id)?resultFormat=CSV [${++index}].`,
                apiName: "GetFormatCsv",
                apiDescription: "Use $resultFormat to determine return result format.",
                apiExample: "/v1.0/Things(10)?$resultFormat=CSV"
            };
            chai.request(server)
                .get(infos.apiExample)
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("text/csv");
                    res.text.startsWith(`"@iot.${"id"}";`);
                    addToApiDoc({ ...infos, result: res });
                    done();
                });
        });
    });

    describe("Save apiDocFormat.", () => {
        it("Do not test only for save apiDoc", (done) => {
            docs[docs.length - 1].apiErrorExample = JSON.stringify("", null, 4);
            generateApiDoc(docs, "apiDocFormat.js");
            done();
        });
    });
});
