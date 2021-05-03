/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * renameProp.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const message = (debug: boolean, mode: "HEAD" | "DEBUG" | "INFO" | "ERROR" | "ENV", cle: string, info?: any): void => {
    if (debug) {
        switch (mode) {
            case "HEAD": {
                if (info) process.stdout.write(`${chalk.green("==== ")} ${chalk.cyan(cle)} : ${chalk.yellow(info)} ${chalk.green(" ====")}` + "\n");
                else process.stdout.write(`${chalk.green("==== ")} ${chalk.cyan(cle)} ${chalk.green(" ====")}` + "\n");
                break;
            }
            case "DEBUG": {
                process.stdout.write(`${chalk.green(cle)} : ${chalk.yellow(info)}` + "\n");
                break;
            }
            case "INFO": {
                process.stdout.write(`${chalk.magenta(cle)} : ${chalk.white(info)}` + "\n");
                break;
            }
            case "ERROR": {
                process.stdout.write(`${chalk.red(cle)} : ${chalk.yellow(info)}` + "\n");
                break;
            }
            case "ENV": {
                process.stdout.write(`${chalk.cyan(cle)} : ${chalk.yellow(info)}` + "\n");
                break;
            }
            default: {
                process.stdout.write(`${chalk.whiteBright(cle)} : ${chalk.blueBright(info)}` + "\n");
                break;
            }
        }
    }
};
