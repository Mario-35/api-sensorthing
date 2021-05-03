/**
 * Datas for createDB.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

// import { IEntityPropertyCreate } from "../constant";

/* eslint-disable quotes */

export const triggers = `CREATE OR REPLACE FUNCTION func_trigger_after_insert_or_update_thing_location()
  RETURNS trigger AS
    $$
    DECLARE 
    t_id integer;
    
    BEGIN
            INSERT INTO historical_location(time, thing_id)
            VALUES(current_timestamp, new.thing_id)
            returning id into t_id;
            
            INSERT INTO location_historical_location(historical_location_id, location_id)
            VALUES(t_id, new.location_id);
            
        RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_after_insert_thing_location
  AFTER INSERT OR UPDATE
  ON thing_location
  FOR EACH ROW
  EXECUTE PROCEDURE func_trigger_after_insert_or_update_thing_location();
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const databaseDatas: any = {
    users: {
        columns: {
            id: {
                create: "int8 GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            username: {
                create: "text NOT NULL",
                comment: "Name of the user."
            },
            email: {
                create: "text NOT NULL",
                comment: "Mail fo the user."
            },
            password: {
                create: "text NOT NULL",
                comment: "Password."
            },
            admin: {
                create: "bool NULL",
                comment: "Admin or Not."
            }
        }
    },

    thing: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "This is a short description of the corresponding Thing entity."
            },
            description: {
                create: "text NOT NULL",
                comment: "A property provides a label for Thing entity, commonly a descriptive name."
            },
            properties: {
                create: "jsonb NULL",
                comment: "A JSON Object containing user-annotated properties as key-value pairs."
            }
        },
        constraints: {
            thing_pkey: 'PRIMARY KEY ("id")'
        }
    },

    featureofinterest: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for FeatureOfInterest entity, commonly a descriptive name."
            },
            description: {
                create: "text NULL",
                comment: "The description about the FeatureOfInterest."
            },
            encodingType: {
                create: "text NULL",
                comment: "The encoding type of the feature property."
            },
            feature: {
                create: "jsonb NULL",
                comment: "The detailed description of the feature. The data type is defined by encodingType."
            }
        },
        constraints: {
            featureofinterest_pkey: 'PRIMARY KEY ("id")'
        },
        after: `INSERT INTO featureofinterest ("name", description, "encodingType", feature) VALUES ('Default Feature of Interest', NULL, NULL, NULL);`
    },

    location: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for Location entity, commonly a descriptive name."
            },
            description: {
                create: "text NOT NULL",
                comment: "The description about the location."
            },
            location: {
                create: "jsonb NULL",
                comment: "The location type is defined by encodingType."
            },
            encodingType: {
                create: "text NULL",
                comment: "The encoding type of the location."
            },
            _default_foi: {
                create: "BIGINT",
                comment: "Default feature of interest."
            },
            geom: {
                // Not in Sensor 1.1
                create: "geometry NULL",
                comment: "Geom."
            },
            properties: {
                // Not in Sensor 1.1
                create: "jsonb NULL",
                comment: "Properties of the location."
            }
        },
        constraints: {
            location_pkey: 'PRIMARY KEY ("id")'
        }
    },

    historical_location: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            time: {
                create: "timestamptz NULL",
                comment: "The time when the Thing is known at the Location."
            },
            thing_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for thing."
            }
        },
        constraints: {
            historical_location_pkey: 'PRIMARY KEY ("id")',
            historical_location_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            historical_location_thing_id: 'ON public."historical_location" USING btree ("thing_id")'
        }
    },

    location_historical_location: {
        columns: {
            location_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for location."
            },
            historical_location_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for historical location."
            }
        },
        constraints: {
            location_historical_location_pkey: 'PRIMARY KEY ("location_id", "historical_location_id")',
            location_historical_location_historical_location_id_fkey:
                'FOREIGN KEY ("historical_location_id") REFERENCES "historical_location"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            location_historical_location_location_id_fkey: 'FOREIGN KEY ("location_id") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            location_historical_location_historical_location_id: 'ON public."location_historical_location" USING btree ("historical_location_id")',
            location_historical_location_location_id: 'ON public."location_historical_location" USING btree ("location_id")'
        }
    },

    observedproperty: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for ObservedProperty entity, commonly a descriptive name."
            },
            definition: {
                create: "text NULL",
                comment: "The URI of the ObservedProperty. Dereferencing this URI SHOULD result in a representation of the definition of the ObservedProperty."
            },
            description: {
                create: "text NULL",
                comment: "A description about the ObservedProperty."
            },
            properties: {
                // Not in Sensor 1.1
                create: "jsonb NULL",
                comment: "The detailed properties of the observed property."
            }
        },
        constraints: {
            observedproperty_pkey: 'PRIMARY KEY ("id")'
        }
    },

    sensor: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for FeatureOfInterest entity, commonly a descriptive name."
            },
            description: {
                create: "text NULL",
                comment: "The definition of the observed property."
            },
            encodingType: {
                create: "text NULL",
                comment: "The encoding type of the feature property."
            },
            metadata: {
                create: "text NULL",
                comment: "The encoding type of the feature property."
            },
            properties: {
                // Not in Sensor 1.1
                create: "jsonb NULL",
                comment: "The detailed description of the feature. The data type is defined by encodingType."
            }
        },
        constraints: {
            sensor_pkey: 'PRIMARY KEY ("id")'
        }
    },

    datastream: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for Datastream entity, commonly a descriptive name."
            },
            description: {
                create: "text NULL",
                comment: "The description of the Datastream entity."
            },
            observationType: {
                create: "text NULL",
                comment: "The type of Observation (with unique result type), which is used by the service to encode observations."
            },
            unitOfMeasurement: {
                create: "jsonb NOT NULL",
                comment: "The encoding type of the feature property."
            },
            observedArea: {
                create: "geometry NULL",
                comment:
                    "The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream."
            },
            phenomenonTime: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the phenomenon times of all observations belonging to this Datastream."
            },
            resultTime: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the result times of all observations belonging to this Datastream."
            },
            thing_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for thing."
            },
            observedproperty_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for observedproperty."
            },
            sensor_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for sensor."
            },
            properties: {
                // Not in Sensor 1.1
                create: "jsonb NULL",
                comment: "The detailed description of the feature. The data type is defined by encodingType."
            }
        },
        constraints: {
            datastream_pkey: 'PRIMARY KEY ("id")',
            datastream_observedproperty_id_fkey: 'FOREIGN KEY ("observedproperty_id") REFERENCES "observedproperty"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            datastream_sensor_id_fkey: 'FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            datastream_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            datastream_observedproperty_id: 'ON public."datastream" USING btree ("observedproperty_id")',
            datastream_sensor_id: 'ON public."datastream" USING btree ("sensor_id")',
            datastream_thing_id: 'ON public."datastream" USING btree ("thing_id")'
        }
    },

    multi_datastream: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            name: {
                create: "text NOT NULL DEFAULT 'no name'::text",
                comment: "A property provides a label for Datastream entity, commonly a descriptive name."
            },
            description: {
                create: "text NULL",
                comment: "The description of the Datastream entity."
            },
            unitOfMeasurement: {
                create: "jsonb NOT NULL",
                comment: "The encoding type of the feature property."
            },
            observationType: {
                create: "text NULL",
                comment: "The type of Observation (with unique result type), which is used by the service to encode observations."
            },
            observedArea: {
                create: "geometry NULL",
                comment:
                    "The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream."
            },
            phenomenonTimeStart: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the phenomenon times of all observations belonging to this Datastream."
            },
            phenomenonTimeEnd: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the phenomenon times of all observations belonging to this Datastream."
            },
            resultTimeStart: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the result times of all observations belonging to this Datastream."
            },
            resultTimeEnd: {
                create: "timestamptz NULL",
                comment: "The temporal interval of the result times of all observations belonging to this Datastream."
            },
            thing_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for thing."
            },
            sensor_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for sensor."
            },
            properties: {
                create: "jsonb NULL",
                comment: "The detailed description of the multi_datastream. The data type is defined by encodingType."
            }
        },
        constraints: {
            multi_datastream_pkey: 'PRIMARY KEY ("id")',
            multi_datastream_sensor_id_fkey: 'FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            multi_datastream_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            multi_datastream_sensor_id: 'ON public."multi_datastream" USING btree ("sensor_id")',
            multi_datastream_thing_id: 'ON public."multi_datastream" USING btree ("thing_id")'
        }
    },

    multi_datastream_observedproperty: {
        columns: {
            multi_datastream_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for observedproperty."
            },
            observedproperty_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for observedproperty."
            },
            rank: {
                create: "INT NOT NULL",
                comment: "?."
            }
        },
        constraints: {
            multi_datastream_observedproperty_multi_datastream_id_fkey:
                'FOREIGN KEY ("multi_datastream_id") REFERENCES "multi_datastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            multi_datastream_observedproperty_observedproperty_id_fkey:
                'FOREIGN KEY ("observedproperty_id") REFERENCES "observedproperty"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        }
    },

    observation: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            phenomenonTime: {
                create: "timestamptz NULL",
                comment: "The time instant or period of when the Observation happens."
            },
            result: {
                create: "float8 NULL",
                comment: "The estimated value of an ObservedProperty from the Observation."
            },
            resultTime: {
                create: "timestamptz NULL",
                comment: "The time of the Observation result was generated."
            },
            resultQuality: {
                create: "jsonb NULL",
                comment: "Describes the quality of the result."
            },
            validTime: {
                create: "timestamptz NULL",
                comment: "The time period during which the result may be used."
            },
            parameters: {
                create: "jsonb NULL",
                comment: "Key-value pairs showing the environmental conditions during measurement."
            },
            datastream_id: {
                create: "BIGINT NULL",
                comment: "The spatial."
            },
            featureofinterest_id: {
                create: "BIGINT NOT NULL DEFAULT 1",
                comment: "mandatory (If it is not provided it will be automatically created based on the Location of associated Thing)"
            }
        },
        constraints: {
            observation_pkey: 'PRIMARY KEY ("id")',
            observation_datastream_id_fkey: 'FOREIGN KEY ("datastream_id") REFERENCES "datastream"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            observation_featureofinterest_id_fkey:
                'FOREIGN KEY ("featureofinterest_id") REFERENCES "featureofinterest"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            observation_datastream_id: 'ON public."observation" USING btree ("datastream_id")',
            observation_featureofinterest_id: 'ON public."observation" USING btree ("featureofinterest_id")'
        }
    },

    thing_location: {
        columns: {
            thing_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for thing."
            },
            location_id: {
                create: "BIGINT NOT NULL",
                comment: "A unique bigSerial for location."
            }
        },
        constraints: {
            thing_location_pkey: 'PRIMARY KEY ("thing_id", "location_id")',
            thing_location_location_id_fkey: 'FOREIGN KEY ("location_id") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE CASCADE',
            thing_location_thing_id_fkey: 'FOREIGN KEY ("thing_id") REFERENCES "thing"("id") ON UPDATE CASCADE ON DELETE CASCADE'
        },
        indexes: {
            thing_location_location_id: 'ON public."thing_location" USING btree ("location_id")',
            thing_location_thing_id: 'ON public."thing_location" USING btree ("thing_id")'
        }
    },
    log: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            author: {
                create: "text NULL",
                comment: "Author of the opération."
            },
            filename: {
                create: "text NULL",
                comment: "Filename of the opération."
            },
            dateexecuted: {
                create: "timestamptz NULL",
                comment: "The time of the opération."
            }
        }
    },
    log_request: {
        columns: {
            id: {
                create: "BIGINT GENERATED ALWAYS AS IDENTITY",
                comment: "A unique bigSerial."
            },
            date: {
                create: "timestamptz DEFAULT CURRENT_TIMESTAMP",
                comment: "The time of the opération."
            },
            user_id: {
                create: "BIGINT",
                comment: "User id."
            },
            method: {
                create: "text",
                comment: "Method of request."
            },
            url: {
                create: "text NOT NULL",
                comment: "Url of the request."
            },
            datas: {
                create: "jsonb NULL",
                comment: "Datas send."
            },
            results: {
                create: "jsonb NULL",
                comment: "result / error receive."
            }
        }
    }
};
