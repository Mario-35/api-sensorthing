/**
 * TDD for auth API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const should = chai.should();

import { server } from "../../server/index";

describe("routes : auth", () => {
    before((done) => {
        process.env.NODE_ENV == "prod";
        done();
    });

    after((done) => {
        process.env.NODE_ENV == "test";
        done();
    });

    describe("GET /register", () => {
        it("should render the register view", (done) => {
            chai.request(server)
                .get("/register")
                .end((err, res) => {
                    should.not.exist(err);
                    res.redirects.length.should.eql(0);
                    res.status.should.eql(200);
                    res.type.should.eql("text/html");
                    res.text.should.contain('<form action="/register" method="post">');
                    res.text.should.contain('<input type="submit" class="button" value="Sign Up">');
                    done();
                });
        });
    });

    describe("POST /register", () => {
        it("should register a new user", (done) => {
            chai.request(server)
                .post("/register")
                .send({
                    username: "new",
                    password: "pass",
                    email: "new@test.com"
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.redirects[0].should.contain("/status");
                    done();
                });
        });
    });

    describe("GET /login", () => {
        it("should render the login view", (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    // should.not.exist(err);
                    res.redirects.length.should.eql(1);
                    res.status.should.eql(200);
                    res.type.should.eql("text/html");
                    res.text.should.contain("<h2>You are authenticated.</h2>");
                    done();
                });
        });
    });

    describe("POST /login", () => {
        it("should login a user", (done) => {
            chai.request(server)
                .post("/login")
                .send({
                    username: "new",
                    password: "pass"
                })
                .end((err, res) => {
                    res.redirects[0].should.contain("/status");
                    process.env.USERID = "1";
                    done();
                });
        });
    });
});
