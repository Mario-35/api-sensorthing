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
import { apiAccess } from "../../server/db/dataAccess";
import { getEntityName } from "../../server/utils/index";
import { createQuery } from "../../server/utils/odata";
import { formatResult } from "../../server/constant";
import { getId } from "../../server/utils";
import { db } from "../../server/db";

const args = {
    SERVICE_ROOT_URI: "localhost:8080/v1.0/",
    ENTITY_NAME: "Datastreams",
    tableName: "datastream",
    ENTITY_ID: 0,
    PROPERTY_NAME: undefined,
    RELATION_NAME: undefined,
    ref: false,
    value: false,
    baseUrl: "localhost:8080",
    version: "v1.0",
    level: -1,
    entities: ["Datastreams"],
    odada: createQuery("$top=200"),
    debug: false,
    formatResult: formatResult.JSON
};

const objectAccess = new apiAccess(args);

describe("entity function", () => {
    describe("getRelationNameFromEntityName", () => {
        it("Return Datastreams relation(s)", () => {
            if (objectAccess && objectAccess.myEntity) {
                expect(getEntityName("Things")).eql("Things");
                expect(getEntityName("Sensor")).eql("Sensors");
                expect(getEntityName("Observations")).eql("Observations");
                expect(getEntityName("Nothing")).eql(undefined);
            }
        });
    });

    describe("getId", async () => {
        it("Return id from string", () => {
            if (objectAccess && objectAccess.myEntity) {
                let test = getId("aaa25");
                if (test) {
                    expect(test.toString()).eql("25");
                }
                test = getId("aaa-50");
                if (test) {
                    expect(test.toString()).eql("50");
                }
                test = getId("none");
                if (test) {
                    expect(test.toString()).eql(undefined);
                }
            }
        });
        await db
            .raw("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity  WHERE pg_stat_activity.datname = ? AND pid <> pg_backend_pid()", [
                "test"
            ])
            .then(() => {
                db.raw("DROP Database IF EXISTS test")
                    .then(() => process.env.PGDATABASE)
                    .catch((e) => e);
            })
            .catch((e) => e);
    });
});
