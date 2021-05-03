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
    static line: string;
    static count = 0;
    silent: boolean;
    level: number;

    constructor(debug: boolean, level: number) {
        this.silent = debug == true ? false : true;
        this.level = level;
    }

    head(input: string): void {
        const temp = " ".repeat(this.level * 2) + `${chalk.green("==========")} ${chalk.blue(input)} ${chalk.green("==========")}`;
        if (!this.silent) {
            if (temp == logClass.line) {
                process.stdout.write(`\r${temp} (${logClass.count++})`);
            } else {
                process.stdout.write("\n" + temp);
                logClass.count = 0;
            }
            logClass.line = temp;
        }
    }

    info(title: string, value?: any): void {
        if (!this.silent)
            process.stdout.write(" ".repeat(this.level * 2) + `${chalk.magenta(title)} ${value ? ":" : ""} ${value ? chalk.white(value) : ""}` + "\n");
    }

    debug(title: string, value?: any): void {
        if (!this.silent)
            process.stdout.write(" ".repeat(this.level * 2) + `${chalk.green(title)} ${value ? ":" : ""} ${value ? chalk.yellow(value) : ""}` + "\n");
    }

    error(title: string, value?: any): void {
        if (!this.silent) process.stdout.write(" ".repeat(this.level * 2) + `${chalk.red(title)} : ${chalk.yellow(value)}` + "\n");
    }
}
