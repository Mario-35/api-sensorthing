/* eslint-disable quotes */
/**
 * TDD for auth API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = "test";

import { expect } from "chai";
// import { createFilter } from "../../server/utils/odata/index";
import { createFilter } from "odata-v4-pg";

describe("oData [9.3.3.5.]", () => {
    describe("Opérators", () => {
        /**
         * minor extension to return parameters as an object, for knex.js named parameters
         * http://knexjs.org/#Builder-whereRaw
         */
        it("Equal (eq) string", () => {
            const filter = "name eq 'fred' or name eq 'sam'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.parameters.length).eql(2);
            expect(sql.parameters[0]).eql("fred");
            expect(sql.parameters[1]).eql("sam");
        });

        it("Greater than (gt) AND Less than (lt) (between) date string", () => {
            const filter = "(completedDate gt '2019-09-01' and completedDate lt '2019-10-01')";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('("completedDate" > $1 AND "completedDate" < $2)');
            expect(sql.parameters.length).eql(2);
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Greater than (gt) date string", () => {
            const filter = "completedDate gt '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" > $1');
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Greater than or equal (ge) date string", () => {
            const filter = "completedDate ge '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" >= $1');
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Less than or equal (le) date string", () => {
            const filter = "completedDate le '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" <= $1');
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("isnull (null) date", () => {
            const filter = "completedDate eq null";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" = $1');
            expect(sql.parameters[0]).to.be.null;
        });
        it("isnotnull (ne null) date", () => {
            const filter = "completedDate ne null";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" <> $1');
            expect(sql.parameters[0]).to.be.null;
        });

        it("Not equal (ne) string", () => {
            const filter = "completedDate ne 'fred'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" <> $1');
            expect(sql.parameters[0]).eql("fred");
        });

        it("Equal (eq) string (or)", () => {
            const filter = "completedDate eq 'fred' or completedDate eq 'sam'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"completedDate" = $1 OR "completedDate" = $2');
            expect(sql.parameters.length).eql(2);
            expect(sql.parameters[0]).eql("fred");
            expect(sql.parameters[1]).eql("sam");
        });

        it("startswith", () => {
            const filter = "startswith(status,'Cus')";
            const sql = createFilter(filter);
            expect(sql.where).eql('"status" like $1');
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("Cus%");
        });

        it("contains", () => {
            const filter = "contains(status,'Cus')";
            const sql = createFilter(filter);
            expect(sql.where).eql('"status" like $1');
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("%Cus%");
        });

        it("substringof-simple", () => {
            const filter = "substringof('10.20.0.220', ip_address)";
            const sql = createFilter(filter);
            expect(sql.where).eql('"ip_address" like $1');
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("%10.20.0.220%");
        });

        it("substringof", () => {
            // for table.column names, fails parser, replace . with double underscore __,  and __ will be be replaced with '.',
            // and the table.column will be correctly double-quoted in where clause.
            const filter = "alarmCount ne null and ( substringof('220', name)  or substringof('120', bms_hardware_asset__ip_address) )";
            const sql = createFilter(filter);
            expect(sql.where).eql('"alarmCount" <> $1 AND ("name" like $2 OR "bms_hardware_asset__ip_address" like $3)');
            expect(sql.parameters.length).eql(3);
            expect(sql.parameters[0]).eql(null);
            expect(sql.parameters[1]).eql("%220%");
            expect(sql.parameters[2]).eql("%120%");
        });

        it("table-column", () => {
            const filter = "ticket__status eq 'Pending Customer'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"ticket__status" = $1');
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("Pending Customer");
        });

        it("table-column_snake", () => {
            const filter = "bmsTicket__status eq 'Pending Customer'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql('"bmsTicket__status" = $1');
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("Pending Customer");
        });
    });

    // describe("Math", () => {
    //     it("Addition (add) TODO", () => {
    //         const filter = "'result' add 5 gt 10";
    //         const sql = createFilter(filter); // map $filter OData to pgSql statement
    //         expect(sql).eql(sql);
    //     });

    //     it("Subtraction (sub) TODO", () => {
    //         const filter = "'result' add 5 gt 10";
    //         const sql = createFilter(filter); // map $filter OData to pgSql statement
    //         expect(sql).eql(sql);
    //     });

    //     it("Multiplication (mul) TODO", () => {
    //         const filter = "'result' add 5 gt 10";
    //         const sql = createFilter(filter); // map $filter OData to pgSql statement
    //         expect(sql).eql(sql);
    //     });

    //     it("Division (div) TODO", () => {
    //         const filter = "'result' add 5 gt 10";
    //         const sql = createFilter(filter); // map $filter OData to pgSql statement
    //         expect(sql).eql(sql);
    //     });

    //     it("Modulo (mod) TODO", () => {
    //         const filter = "'result' add 5 gt 10";
    //         const sql = createFilter(filter); // map $filter OData to pgSql statement
    //         expect(sql).eql(sql);
    //     });
    // });
});
