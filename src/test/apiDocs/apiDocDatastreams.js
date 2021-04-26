/**
*    @api {infos} /Datastreams [11] infos.
*    @apiVersion 1.0.0
*    @apiName Datastreams Infos
*    @apiGroup Datastreams
*    @apiDescription A Datastream groups a collection of Observations measuring the same ObservedProperty and produced by the same Sensor.
*/

/**
*    @api {get} /Datastreams [12] all.
*    @apiVersion 1.0.0
*    @apiName GetAllDatastreams
*    @apiGroup Datastreams
*    @apiDescription Retrieve all Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for Datastream entity, commonly a descriptive name.
*    @apiSuccess {string} description The description of the Datastream entity.
*    @apiSuccess {string} observationType The type of Observation (with unique result type), which is used by the service to encode observations.
*    @apiSuccess {JSONObject} unitOfMeasurement The encoding type of the feature property.
*    @apiSuccess {Enum} observedArea The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream.
*    @apiSuccess {Date} phenomenonTime The temporal interval of the phenomenon times of all observations belonging to this Datastream.
*    @apiSuccess {Date} resultTime The temporal interval of the result times of all observations belonging to this Datastream.
*    @apiSuccess {JSONObject} properties The detailed description of the feature. The data type is defined by encodingType.
*    @apiSuccess {relation} Thing Thing@iot.navigationLink
*    @apiSuccess {relation} Sensor Sensor@iot.navigationLink
*    @apiSuccess {relation} ObservedProperty ObservedProperty@iot.navigationLink
*    @apiSuccess {relation} Observations Observations@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "10",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)",
*                "description": "Air quality Number one",
*                "name": "air_quality_readings1",
*                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*                "observedArea": null,
*                "phenomenonTime": null,
*                "properties": null,
*                "resultTime": null,
*                "unitOfMeasurement": {
*                    "name": "PM 2.5 Particulates (ug/m3)",
*                    "symbol": "μg/m³",
*                    "definition": "http://unitsofmeasure.org/ucum.html"
*                },
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(2)",
*                "description": "Air quality Number two",
*                "name": "air_quality_readings2",
*                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*                "observedArea": null,
*                "phenomenonTime": null,
*                "properties": null,
*                "resultTime": null,
*                "unitOfMeasurement": {
*                    "name": "PM 2.5 Particulates (ug/m3)",
*                    "symbol": "μg/m³",
*                    "definition": "http://unitsofmeasure.org/ucum.html"
*                },
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(2)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(2)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(2)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(2)/Thing"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Datastreams(:id) [13] one.
*    @apiVersion 1.0.0
*    @apiName GetDatastreams
*    @apiGroup Datastreams
*    @apiDescription Get a specific Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Datastreams(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)",
*        "description": "Air quality Number one",
*        "name": "air_quality_readings1",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "observedArea": null,
*        "phenomenonTime": null,
*        "properties": null,
*        "resultTime": null,
*        "unitOfMeasurement": {
*            "name": "PM 2.5 Particulates (ug/m3)",
*            "symbol": "μg/m³",
*            "definition": "http://unitsofmeasure.org/ucum.html"
*        },
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations",
*        "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/ObservedProperty",
*        "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Sensor",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing"
*    }
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 404,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "That element does not exist."
*    }
*/

/**
*    @api {get} /Things(6)/Datastreams(:id) [14] specific Thing .
*    @apiVersion 1.0.0
*    @apiName GetThingsDatastreams
*    @apiGroup Datastreams
*    @apiDescription Get Datastreamss from Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(6)/Datastreams
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(6/Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "3",
*        "value": [
*            {
*                "@iot.id": "8",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(8)",
*                "description": "Air quality Number eight",
*                "name": "air_quality_readings8",
*                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*                "observedArea": null,
*                "phenomenonTime": null,
*                "properties": null,
*                "resultTime": null,
*                "unitOfMeasurement": {
*                    "name": "PM 2.5 Particulates (ug/m3)",
*                    "symbol": "μg/m³",
*                    "definition": "http://unitsofmeasure.org/ucum.html"
*                },
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(8)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(8)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(8)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(8)/Thing"
*            },
*            {
*                "@iot.id": "9",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)",
*                "description": "Air quality Number nine",
*                "name": "air_quality_readings9",
*                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*                "observedArea": null,
*                "phenomenonTime": null,
*                "properties": null,
*                "resultTime": null,
*                "unitOfMeasurement": {
*                    "name": "PM 2.5 Particulates (ug/m3)",
*                    "symbol": "μg/m³",
*                    "definition": "http://unitsofmeasure.org/ucum.html"
*                },
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Thing"
*            },
*            "..."
*        ]
*    }
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 404,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "That element does not exist."
*    }
*/

/**
*    @api {get} /Datastreams(:id) [15] Expands.
*    @apiVersion 1.0.0
*    @apiName GetExpandObservationsDatastreams
*    @apiGroup Datastreams
*    @apiDescription Get a specific Datastreams and expand Observations, and ObservedProperty.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(10)?$expand=Observations,ObservedProperty
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Datastreams(10?$expand=Observations,ObservedProperty
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "10",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)",
*        "description": "Air quality Number ten",
*        "name": "air_quality_readings10",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "observedArea": null,
*        "phenomenonTime": null,
*        "properties": null,
*        "resultTime": null,
*        "unitOfMeasurement": {
*            "name": "PM 2.5 Particulates (ug/m3)",
*            "symbol": "μg/m³",
*            "definition": "http://unitsofmeasure.org/ucum.html"
*        },
*        "Observations": [
*            {
*                "@iot.id": "8",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T04:15:15.790Z",
*                "result": 45,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T17:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "9",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T08:15:15.790Z",
*                "result": 45,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T13:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "10",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(10)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T03:15:15.790Z",
*                "result": 45,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T13:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(10)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(10)/FeatureOfInterest"
*            }
*        ],
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Observations",
*        "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/ObservedProperty",
*        "ObservedProperty": {
*            "@iot.id": "8",
*            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)",
*            "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*            "description": "PM something Number eight",
*            "name": "PM 8 observedProperties",
*            "properties": null,
*            "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)/Datastreams"
*        },
*        "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Sensor",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Thing"
*    }
*/

/**
*    @api {post} /Datastreams [16] with existing Thing.
*    @apiVersion 1.0.0
*    @apiName PostDatastreams
*    @apiGroup Datastreams
*    @apiDescription Post a new datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams
*    @apiParam {string} name A property provides a label for Datastream entity, commonly a descriptive name.
*    @apiParam {string} [description] The description of the Datastream entity.
*    @apiParam {string} [observationType] The type of Observation (with unique result type), which is used by the service to encode observations.
*    @apiParam {JSONObject} unitOfMeasurement The encoding type of the feature property.
*    @apiParam {Enum} [observedArea] The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream.
*    @apiParam {Date} [phenomenonTime] The temporal interval of the phenomenon times of all observations belonging to this Datastream.
*    @apiParam {Date} [resultTime] The temporal interval of the result times of all observations belonging to this Datastream.
*    @apiParam {JSONObject} [properties] The detailed description of the feature. The data type is defined by encodingType.
*    @apiParam {relation} [Thing] Thing@iot.navigationLink
*    @apiParam {relation} [Sensor] Sensor@iot.navigationLink
*    @apiParam {relation} [ObservedProperty] ObservedProperty@iot.navigationLink
*    @apiParam {relation} [Observations] Observations@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "unitOfMeasurement": {
*            "symbol": "μg/m³",
*            "name": "PM 2.5 Particulates (ug/m3)",
*            "definition": "http://unitsofmeasure.org/ucum.html"
*        },
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "description": "Air quality readings",
*        "name": "air_quality_readings",
*        "Thing": {
*            "@iot.id": 1
*        },
*        "ObservedProperty": {
*            "@iot.id": 1
*        },
*        "Sensor": {
*            "@iot.id": 1
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "12",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)",
*        "description": "Air quality readings",
*        "name": "air_quality_readings",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "observedArea": null,
*        "phenomenonTime": null,
*        "properties": null,
*        "resultTime": null,
*        "unitOfMeasurement": {
*            "name": "PM 2.5 Particulates (ug/m3)",
*            "symbol": "μg/m³",
*            "definition": "http://unitsofmeasure.org/ucum.html"
*        },
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Observations",
*        "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/ObservedProperty",
*        "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Sensor",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Thing"
*    }
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 400,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "Something went wrong."
*    }
*/

/**
*    @api {post} /Datastreams [17] with a Thing.
*    @apiVersion 1.0.0
*    @apiName PostLocationThingDatastreams
*    @apiGroup Datastreams
*    @apiDescription POST with existing Thing.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)/Datastreams
*    @apiParam {string} name A property provides a label for Datastream entity, commonly a descriptive name.
*    @apiParam {string} [description] The description of the Datastream entity.
*    @apiParam {string} [observationType] The type of Observation (with unique result type), which is used by the service to encode observations.
*    @apiParam {JSONObject} unitOfMeasurement The encoding type of the feature property.
*    @apiParam {Enum} [observedArea] The spatial bounding box of the spatial extent of all FeaturesOfInterest that belong to the Observations associated with this Datastream.
*    @apiParam {Date} [phenomenonTime] The temporal interval of the phenomenon times of all observations belonging to this Datastream.
*    @apiParam {Date} [resultTime] The temporal interval of the result times of all observations belonging to this Datastream.
*    @apiParam {JSONObject} [properties] The detailed description of the feature. The data type is defined by encodingType.
*    @apiParam {relation} [Thing] Thing@iot.navigationLink
*    @apiParam {relation} [Sensor] Sensor@iot.navigationLink
*    @apiParam {relation} [ObservedProperty] ObservedProperty@iot.navigationLink
*    @apiParam {relation} [Observations] Observations@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Air Temperature DS",
*        "description": "Datastream for recording temperature",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "unitOfMeasurement": {
*            "name": "Degree Celsius",
*            "symbol": "degC",
*            "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
*        },
*        "ObservedProperty": {
*            "name": "Area Temperature",
*            "description": "The degree or intensity of heat present in the area",
*            "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
*        },
*        "Sensor": {
*            "name": "DHT22",
*            "description": "DHT22 temperature sensor",
*            "encodingType": "application/pdf",
*            "metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)",
*        "description": "Datastream for recording temperature",
*        "name": "Air Temperature DS",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "observedArea": null,
*        "phenomenonTime": null,
*        "properties": null,
*        "resultTime": null,
*        "unitOfMeasurement": {
*            "name": "Degree Celsius",
*            "symbol": "degC",
*            "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
*        },
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Observations",
*        "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/ObservedProperty",
*        "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Sensor",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Thing"
*    }
*/

/**
*    @api {patch} /Datastreams [18] one.
*    @apiVersion 1.0.0
*    @apiName PatchDatastreams
*    @apiGroup Datastreams
*    @apiDescription Patch a Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(13)
*    @apiParamExample {json} Request-Example:
*    {
*        "unitOfMeasurement": {
*            "name": "Degrees Fahrenheit",
*            "symbol": "degF",
*            "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeFahrenheit"
*        },
*        "description": "Water Temperature of Bow river"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)",
*        "description": "Water Temperature of Bow river",
*        "name": "Air Temperature DS",
*        "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*        "observedArea": null,
*        "phenomenonTime": null,
*        "properties": null,
*        "resultTime": null,
*        "unitOfMeasurement": {
*            "name": "Degrees Fahrenheit",
*            "symbol": "degF",
*            "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeFahrenheit"
*        },
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Observations",
*        "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/ObservedProperty",
*        "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Sensor",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(13)/Thing"
*    }
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 404,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "That element does not exist."
*    }
*/

/**
*    @api {delete} /Datastreams [19] one.
*    @apiVersion 1.0.0
*    @apiName DeleteDatastreams
*    @apiGroup Datastreams
*    @apiDescription Delete a Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(13)
*    @apiSuccessExample {json} Success-Response:
*    {}
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 404,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "That element does not exist."
*    }
*/
