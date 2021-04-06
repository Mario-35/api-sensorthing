/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const message = (cle: string, info: any, line?: boolean): void => {
    const str = `${chalk.cyan(cle)} : ${chalk.yellow(info)}`;
    if (line) console.log(`${chalk.green("==== ")} ${str} ${chalk.green(" ====")}`);
    else console.log(str);
};
