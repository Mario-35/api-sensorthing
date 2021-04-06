/**
 * TDD for auth API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = "test";

import { expect } from "chai";
import { createFilter } from "../../server/utils/odata/index";

describe("oData [9.3.3.5.]", () => {
    describe("Opérators", () => {
        /**
         * minor extension to return parameters as an object, for knex.js named parameters
         * http://knexjs.org/#Builder-whereRaw
         */
        it("Equal (eq) string", () => {
            const filter = "name eq 'fred' or name eq 'sam'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"name\" = :0 OR \"name\" = :1");
            expect(sql.parameters.length).eql(2);
            expect(sql.parameterObject()).eql({ 0: "fred", 1: "sam" });
        });

        it("Greater than (gt) AND Less than (lt) (between) date string", () => {
            const filter = "(completedDate gt '2019-09-01' and completedDate lt '2019-10-01')";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("(\"completed_date\" > :0 AND \"completed_date\" < :1)");
            expect(sql.parameters.length).eql(2);
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Greater than (gt) date string", () => {
            const filter = "completedDate gt '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" > :0");
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Greater than or equal (ge) date string", () => {
            const filter = "completedDate ge '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" >= :0");
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("Less than or equal (le) date string", () => {
            const filter = "completedDate le '2019-09-01'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" <= :0");
            expect(sql.parameters[0]).eql("2019-09-01");
        });

        it("isnull (null) date", () => {
            const filter = "completedDate eq null";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" IS NULL");
            expect(sql.parameters[0]).to.be.null;
        });
        it("isnotnull (ne null) date", () => {
            const filter = "completedDate ne null";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" IS NOT NULL");
            expect(sql.parameters[0]).to.be.null;
        });

        it("Not equal (ne) string", () => {
            const filter = "completedDate ne 'fred'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" <> :0");
            expect(sql.parameters[0]).eql("fred");
        });

        it("Equal (eq) string (or)", () => {
            const filter = "completedDate eq 'fred' or completedDate eq 'sam'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            expect(sql.where).eql("\"completed_date\" = :0 OR \"completed_date\" = :1");
            expect(sql.parameters.length).eql(2);
            expect(sql.parameters[0]).eql("fred");
            expect(sql.parameters[1]).eql("sam");
        });

        it("startswith", () => {
            const filter = "startswith(status,'Cus')";
            const sql = createFilter(filter);
            expect(sql.where).eql("\"status\" ILIKE :0");
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("Cus%");
        });

        it("contains", () => {
            const filter = "contains(status,'Cus')";
            const sql = createFilter(filter);
            expect(sql.where).eql("\"status\" ~* :0");
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("Cus");
        });

        it("substringof-simple", () => {
            const filter = "substringof('10.20.0.220', ip_address)";
            const sql = createFilter(filter);
            expect(sql.where).eql("\"ip_address\" ILIKE :0");
            expect(sql.parameters.length).eql(1);
            expect(sql.parameters[0]).eql("%10.20.0.220%");
            expect(sql.parameterObject()).eql({ "0": "%10.20.0.220%" });
        });

        it("substringof", () => {
            // for table.column names, fails parser, replace . with double underscore __,  and __ will be be replaced with '.',
            // and the table.column will be correctly double-quoted in where clause.
            const filter = "alarmCount ne null and ( substringof('220', name)  or substringof('120', bms_hardware_asset__ip_address) )";
            const sql = createFilter(filter);
            expect(sql.where).eql("\"alarm_count\" IS NOT NULL AND (\"name\" ILIKE :1 OR \"bms_hardware_asset\".\"ip_address\" ILIKE :2)");
            expect(sql.parameters.length).eql(3);
            expect(sql.parameters[0]).eql(null);
            expect(sql.parameters[1]).eql("%220%");
            expect(sql.parameters[2]).eql("%120%");
            /*
      console.log(sql.parameterObject());
      const where = raw(sql.where,sql.parameterObject());
      console.log(sql.parameterObject());
      */
        });

        it("table-column", () => {
            const filter = "ticket__status eq 'Pending Customer'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            // console.log(sql.where);
            expect(sql.where).eql("\"ticket\".\"status\" = :0");
            expect(sql.parameters.length).eql(1);
            expect(sql.parameterObject()).eql({ 0: "Pending Customer" });
        });

        it("table-column_snake", () => {
            const filter = "bmsTicket__status eq 'Pending Customer'";
            const sql = createFilter(filter); // map $filter OData to pgSql statement
            // console.log(sql.where);
            expect(sql.where).eql("\"bms_ticket\".\"status\" = :0");
            expect(sql.parameters.length).eql(1);
            expect(sql.parameterObject()).eql({ 0: "Pending Customer" });
        });
    });

    // describe('Math', () => {
    //   it('Addition (add) TODO', () => {
    //     let filter = "'result' add 5 gt 10";
    //     let sql = createFilter(filter); // map $filter OData to pgSql statement
    //     expect(sql).eql(sql);
    //   });

    //   it('Subtraction (sub) TODO', () => {
    //     let filter = "'result' add 5 gt 10";
    //     let sql = createFilter(filter); // map $filter OData to pgSql statement
    //     expect(sql).eql(sql);
    //   });

    //   it('Multiplication (mul) TODO', () => {
    //     let filter = "'result' add 5 gt 10";
    //     let sql = createFilter(filter); // map $filter OData to pgSql statement
    //     expect(sql).eql(sql);
    //   });

    //   it('Division (div) TODO', () => {
    //     let filter = "'result' add 5 gt 10";
    //     let sql = createFilter(filter); // map $filter OData to pgSql statement
    //     expect(sql).eql(sql);
    //   });

    //   it('Modulo (mod) TODO', () => {
    //     let filter = "'result' add 5 gt 10";
    //     let sql = createFilter(filter); // map $filter OData to pgSql statement
    //     expect(sql).eql(sql);
    //   });
    // })
});
