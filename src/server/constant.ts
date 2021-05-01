/**
 * Constants of API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

/* eslint-disable quotes */

export interface keyString {
    [key: string]: string;
}

import { PGVisitor } from "./utils/odata/visitor";
export interface connectionDB {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
    database: string | undefined;
}

export type promiseArray = () => Promise<unknown>;
export interface keyValue {
    [key: string]: string | number | bigint | keyValue | keyValue[] | ReturnResult;
}

export enum formatResult {
    JSON,
    CSV,
    TXT
}

export interface requestArgs {
    ENTITY_NAME: string;
    ENTITY_ID?: number;
    PROPERTY_NAME?: string | undefined;
    RELATION_NAME?: string | undefined;
    value?: boolean;
    baseUrl: string;
    version: string;
    entities: string[];
    odada: PGVisitor;
    debug: boolean;
    formatResult: formatResult;
    extras: keyString | undefined;
}

export interface ResultType {
    result: string[] | string | number | bigint | keyValue[] | keyValue | undefined;
}
export interface ReturnResult extends ResultType {
    id: bigint | undefined;
    nextLink: string | undefined;
    prevLink: string | undefined;
    entity: IEntityProperty | undefined;
    value: keyValue[] | keyValue | undefined;
    body: keyValue[] | keyValue | string | undefined;
    total: bigint | undefined;
}

export interface relationConfig {
    entityName: string; // table name
    tableName: string; // table reference
    columnRelation: string; // column name
    entityColumn: string; // column name
    tableKey: string; // index key column name
}
export interface IEntityProperty {
    name: string;
    singular: string;
    table: string;
    columns: string[];
    excludeColumn: string[];
    relations: { [key: string]: relationConfig };
    constraints?: string[];
    testsKeys: string[];
}

export interface IEntityPropertyCreate {
    columns: { [key: string]: { create: string; comment: string } };
    constraints?: { [key: string]: string };
    indexes?: { [key: string]: string };
    after?: string;
}

export interface IEntityProperties {
    [key: string]: IEntityProperty;
}

export const _ENTITIES: IEntityProperties = {
    Datastreams: {
        name: "Datastreams",
        singular: "Datastream",
        table: "datastream",
        columns: [
            "id",
            "name",
            "description",
            "unitOfMeasurement",
            "observationType",
            "observedArea",
            "phenomenonTime",
            "resultTime",
            "thing_id",
            "observedproperty_id",
            "sensor_id",
            "properties"
        ],
        excludeColumn: ["id"],
        relations: {
            Thing: {
                entityName: "Things",
                tableName: "datastream",
                columnRelation: "id",
                entityColumn: "thing_id",
                tableKey: "id"
            },
            Sensor: {
                entityName: "Sensors",
                tableName: "datastream",
                columnRelation: "id",
                entityColumn: "sensor_id",
                tableKey: "id"
            },
            ObservedProperty: {
                entityName: "ObservedProperties",
                tableName: "datastream",
                columnRelation: "id",
                entityColumn: "observedproperty_id",
                tableKey: "id"
            },
            Observations: {
                entityName: "Observations",
                tableName: "observation",
                columnRelation: "datastream_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Observations"],
        testsKeys: [
            "@iot.id",
            "name",
            "description",
            "@iot.selfLink",
            "Thing@iot.navigationLink",
            "Sensor@iot.navigationLink",
            "ObservedProperty@iot.navigationLink",
            "Observations@iot.navigationLink",
            "unitOfMeasurement",
            "observedArea"
        ]
    },

    Multidatastreams: {
        name: "Multidatastreams",
        singular: "Multidatastream",
        table: "multi_datastream",
        columns: [
            "id",
            "name",
            "description",
            "unitOfMeasurement",
            "observationType",
            "observedArea",
            "phenomenonTimeStart",
            "phenomenonTimeEnd",
            "resultTimeStart",
            "resultTimeEnd",
            "thing_id",
            "sensor_id",
            "properties"
        ],
        excludeColumn: ["id"],
        relations: {
            Thing: {
                entityName: "Things",
                tableName: "multi_datastream",
                columnRelation: "id",
                entityColumn: "thing_id",
                tableKey: "id"
            },
            Sensor: {
                entityName: "Sensors",
                tableName: "multi_datastream",
                columnRelation: "id",
                entityColumn: "sensor_id",
                tableKey: "id"
            },
            Observations: {
                entityName: "Observations",
                tableName: "observation",
                columnRelation: "datastream_id",
                entityColumn: "id",
                tableKey: "id"
            },
            Multidatastreamobservedproperty: {
                entityName: "Multidatastreamobservedproperty",
                tableName: "multi_datastream_observedproperty",
                columnRelation: "multidatastream_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Observations"],
        testsKeys: [
            "@iot.id",
            "name",
            "description",
            "@iot.selfLink",
            "Thing@iot.navigationLink",
            "Sensor@iot.navigationLink",
            "Observations@iot.navigationLink",
            "unitOfMeasurement",
            "observedArea"
        ]
    },

    MultiDatastreamObservedproperties: {
        name: "multidatastreamobservedproperty",
        singular: "MultiDatastreamObservedproperty",
        table: "multi_datastream_observedproperty",
        columns: ["id", "name", "definition", "description"],
        excludeColumn: ["id"],
        relations: {
            Datastreams: {
                entityName: "Datastreams",
                tableName: "datastream",
                columnRelation: "observedproperty_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Datastreams"],
        testsKeys: ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description", "definition"]
    },

    FeaturesOfInterest: {
        name: "FeaturesOfInterest",
        singular: "FeatureOfInterest",
        table: "featureofinterest",
        columns: ["id", "name", "description", "encodingType", "feature"],
        excludeColumn: ["id"],
        relations: {
            Observations: {
                entityName: "Observations",
                tableName: "observation",
                columnRelation: "featureofinterest_id",
                entityColumn: "id",
                tableKey: "id"
            },
            Locations: {
                entityName: "Locations",
                tableName: "location",
                // hide all relations start with "_"
                columnRelation: "_default_foi",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Observations"],
        testsKeys: ["@iot.id", "@iot.selfLink", "Observations@iot.navigationLink", "name", "description", "encodingType", "feature"]
    },

    HistoricalLocations: {
        name: "HistoricalLocations",
        singular: "HistoricalLocation",
        table: "historical_location",
        columns: ["id", "thing_id", "time"],
        excludeColumn: ["id"],
        relations: {
            // TODO NOT GOOD
            Thing: {
                entityName: "Things",
                tableName: "thing",
                columnRelation: "thing_id",
                entityColumn: "id",
                tableKey: "id"
            },
            Locations: {
                entityName: "Locations",
                tableName: "location_historical_location",
                columnRelation: "location_id",
                entityColumn: "historical_location_id",
                tableKey: "id"
            }
        },
        testsKeys: ["@iot.selfLink", "@iot.id", "Thing@iot.navigationLink", "Locations@iot.navigationLink", "time"]
    },

    Locations: {
        name: "Locations",
        singular: "Location",
        table: "location",
        columns: ["id", "description", "encodingType", "location", "geom", "name", "_default_foi", "properties"],
        excludeColumn: ["id"],
        relations: {
            Things: {
                entityName: "Things",
                tableName: "thing_location",
                columnRelation: "location_id",
                entityColumn: "thing_id",
                tableKey: "thing_id"
            },
            HistoricalLocation: {
                entityName: "HistoricalLocation",
                tableName: "location_historicalLocation",
                columnRelation: "location_id",
                entityColumn: "id",
                tableKey: "id"
            },
            FeatureOfInterest: {
                entityName: "FeaturesOfInterest",
                tableName: "featureofinterest",
                // hide all relations start with "_"
                columnRelation: "_default_foi",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["HistoricalLocation"],
        testsKeys: [
            "@iot.selfLink",
            "@iot.id",
            "Things@iot.navigationLink",
            "HistoricalLocation@iot.navigationLink",
            "name",
            "description",
            "encodingType",
            "location"
        ]
    },

    Observations: {
        name: "Observations",
        singular: "Observation",
        table: "observation",
        columns: ["id", "phenomenonTime", "result", "resultTime", "resultQuality", "validTime", "parameters", "datastream_id", "featureofinterest_id"],
        excludeColumn: ["id"],
        relations: {
            Datastream: {
                entityName: "Datastreams",
                tableName: "observation",
                columnRelation: "id",
                entityColumn: "datastream_id",
                tableKey: "id"
            },
            FeatureOfInterest: {
                entityName: "FeaturesOfInterest",
                tableName: "featureofinterest",
                columnRelation: "id",
                entityColumn: "featureofinterest_id",
                tableKey: "id"
            }
        },
        testsKeys: [
            "@iot.id",
            "@iot.selfLink",
            "Datastream@iot.navigationLink",
            "FeatureOfInterest@iot.navigationLink",
            "result",
            "phenomenonTime",
            "resultTime"
        ]
    },

    ObservedProperties: {
        name: "ObservedProperties",
        singular: "ObservedProperty",
        table: "observedproperty",
        columns: ["id", "name", "definition", "description"],
        excludeColumn: ["id"],
        relations: {
            Datastreams: {
                entityName: "Datastreams",
                tableName: "datastream",
                columnRelation: "observedproperty_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Datastreams"],
        testsKeys: ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description", "definition"]
    },

    Sensors: {
        name: "Sensors",
        singular: "Sensor",
        table: "sensor",
        columns: ["id", "name", "description", "encodingType", "metadata"],
        excludeColumn: ["id"],
        relations: {
            Datastreams: {
                entityName: "Datastreams",
                tableName: "datastream",
                columnRelation: "sensor_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Datastreams"],
        testsKeys: ["@iot.id", "@iot.selfLink", "Datastreams@iot.navigationLink", "name", "description"]
    },

    Things: {
        name: "Things",
        singular: "Thing",
        table: "thing",
        columns: ["id", "name", "description", "properties"],
        excludeColumn: ["id"],
        relations: {
            Locations: {
                entityName: "Locations",
                tableName: "thing_location",
                columnRelation: "location_id",
                entityColumn: "thing_id",
                tableKey: "thing_id"
            },
            HistoricalLocation: {
                entityName: "HistoricalLocation",
                tableName: "historicalLocation",
                columnRelation: "thing_id",
                entityColumn: "id",
                tableKey: "id"
            },
            Datastreams: {
                entityName: "Datastreams",
                tableName: "datastream",
                columnRelation: "thing_id",
                entityColumn: "id",
                tableKey: "id"
            }
        },
        constraints: ["Datastreams", "HistoricalLocation"],
        testsKeys: [
            "@iot.id",
            "@iot.selfLink",
            "Datastreams@iot.navigationLink",
            "HistoricalLocation@iot.navigationLink",
            "Locations@iot.navigationLink",
            "description",
            "name",
            "properties"
        ]
    }
};
