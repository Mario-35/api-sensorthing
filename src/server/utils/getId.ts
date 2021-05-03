/**
 * getId.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/**
 *
 * @param input string or number search
 * @returns the bigint extract number
 */

export const getId = (input: string | number): bigint | undefined => {
    try {
        return typeof input == "string" ? BigInt(input.match(/[0-9]/g)?.join("")) : BigInt(input);
    } catch (error) {
        return undefined;
    }
};
