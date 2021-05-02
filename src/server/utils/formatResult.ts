import { formatsResult, requestArgs } from "../constant";

export const formatResult = (args: requestArgs): string => {
    switch (args.formatResult) {
        case formatsResult.CSV: {
            return "text/csv";
        }
        case formatsResult.TXT: {
            return "text/plain";
        }
        default: {
            return "application/json";
        }
    }
};
