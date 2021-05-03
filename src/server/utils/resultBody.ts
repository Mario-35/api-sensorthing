import { Parser } from "json2csv";
import { message } from ".";
import { formatsResult, keyValue, requestArgs } from "../constant";

const convertToCsv = (inputDatas: keyValue | keyValue[] | undefined): string => {
    const opts = { delimiter: ";", includeEmptyRows: true, escapedQuote: "" };
    if (inputDatas)
        try {
            const parser = new Parser(opts);
            const csv = parser.parse(inputDatas);
            return csv;
        } catch (error) {
            message(true, "ERROR", error.message);
            return error.message;
        }
    return "No datas";
};

export const resultBody = (args: requestArgs, input: string | keyValue | keyValue[]): string | keyValue | keyValue[] => {
    switch (args.formatResult) {
        case formatsResult.CSV: {
            return convertToCsv(input as keyValue);
        }
        case formatsResult.TXT: {
            return input as string;
        }
        default: {
            return input;
        }
    }
};
