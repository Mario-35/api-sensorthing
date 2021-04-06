/**
 * Logs.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";

export class logClass {
    silent: boolean;
    level: number;

    constructor(debug: boolean, level: number) {
        this.silent = debug == true ? false : true;
        this.level = level;
    }

    head(input: string): void {
        if (!this.silent) console.log(" ".repeat(this.level * 2) + `${chalk.green("==========")} ${chalk.blue(input)} ${chalk.green("==========")}`);
    }

    info(title: string, value?: any): void {
        if (!this.silent) console.log(" ".repeat(this.level * 2) + `${chalk.magenta(title)} ${value ? ":" : ""} ${value ? chalk.white(value) : ""}`);
    }

    debug(title: string, value?: any): void {
        if (!this.silent) console.log(" ".repeat(this.level * 2) + `${chalk.green(title)} ${value ? ":" : ""} ${value ? chalk.yellow(value) : ""}`);
    }

    error(title: string, value?: any): void {
        if (!this.silent) console.log(" ".repeat(this.level * 2) + `${chalk.red(title)} : ${chalk.yellow(value)}`);
    }
}
