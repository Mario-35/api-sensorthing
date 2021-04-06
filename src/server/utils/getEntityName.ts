/**
 * getEntityName.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { _ENTITIES } from "../constant";

/**
 *
 * @param search search string
 * @returns name of the entity name or undefined if not found
 */

export function getEntityName(search: string): string | undefined {
    const testString: string | undefined = search
        .match(/[a-zA-Z]/g)
        ?.join("")
        .trim();
    return testString
        ? _ENTITIES.hasOwnProperty(testString)
            ? testString
            : Object.keys(_ENTITIES).filter((elem: string) => _ENTITIES[elem].table == testString.toLowerCase() || _ENTITIES[elem].singular == testString)[0]
        : undefined;
}
