/* eslint-disable quotes */
/**
 * TDD for cases API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

process.env.NODE_ENV = "test";

import { destroyDB } from "../../server/db/createDB";

describe("Delete test Database", () => {
    it("Destroy", async () => {
        await destroyDB({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: "test"
        });
    });
});
