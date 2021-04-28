/* eslint-disable quotes */
/**
 * TDD for cases API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = "test";

import { expect } from "chai";
// import { createFilter } from "../../server/utils/odata/index";
import { camelCase } from "../../server/utils";

describe("SnakeCase", () => {
    it("foo-bar ==> fooBar", () => {
        expect(camelCase("foo-bar")).eql("fooBar");
    });
    it("foo_bar ==> fooBar", () => {
        expect(camelCase("foo_bar")).eql("fooBar");
    });

    it("Foo-bar ==> fooBar", () => {
        expect(camelCase("Foo-bar")).eql("fooBar");
    });
    it("--Foo-bar ==> fooBar", () => {
        expect(camelCase("--Foo-bar")).eql("fooBar");
    });
    it("foo bar ==> fooBar", () => {
        expect(camelCase("foo bar")).eql("fooBar");
    });
    it("Foo-bar ==> FooBar pascalCase a true", () => {
        expect(camelCase("foo-bar", true)).eql("FooBar");
    });
    it("Foo-bar ==> FooBar pascalCase a true", () => {
        expect(camelCase(["__foo", "--bar"], true)).eql("FooBar");
    });
});
