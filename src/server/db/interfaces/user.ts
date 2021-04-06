/**
 * User interface.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

export interface IUser {
    id?: number; // integer
    username: string; // character varying
    password: string; // character varying
    email: string; // character varying
    admin: boolean; // boolean
}
