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
import path from "path";
import { createDoc } from "apidoc";

chai.use(chaiHttp);

describe("Create ApiDoc", () => {
    describe(`source ${path.resolve(__dirname, "../../test")}`, () => {
        it(`write : ${path.resolve(__dirname, "../apidoc")}`, async (done) => {
            const doc = createDoc({
                src: path.resolve(__dirname, "../../test"),
                dest: path.resolve(__dirname, "../apidoc"),
                template: path.resolve(__dirname, "../../template")
            });
            doc.should.not.eql("boolean");
            done();
        });
    });
});
