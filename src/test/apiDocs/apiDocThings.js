/**
*    @api {infos} /Things [11] infos.
*    @apiVersion 1.0.0
*    @apiName Things Infos
*    @apiGroup Things
*    @apiDescription A Thing is an object of the physical world (physical Things) or the information world (virtual Things) that is capable of being identified and integrated into communication networks<br>
    Thing is a good starting point to start creating the SensorThings model structure.<br>
    <br>
    A Thing has Locations and one or more Datastreams to collect Observations. A minimal Thing can be created without a Location and Datastream and there are options to create a Things with a nested linked Location and Datastream.
*/

/**
*    @api {get} /Things [12] all.
*    @apiVersion 1.0.0
*    @apiName GetAllThings
*    @apiGroup Things
*    @apiDescription Retrieve all Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} description A property provides a label for Thing entity, commonly a descriptive name.
*    @apiSuccess {JSONObject} properties A JSON Object containing user-annotated properties as key-value pairs.
*    @apiSuccess {string} name This is a short description of the corresponding Thing entity.
*    @apiSuccess {relation} Locations Locations@iot.navigationLink
*    @apiSuccess {relation} HistoricalLocation HistoricalLocation@iot.navigationLink
*    @apiSuccess {relation} Datastreams Datastreams@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "10",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(1)",
*                "description": "A SensorWeb thing Number one",
*                "name": "SensorWebThing 1",
*                "properties": {
*                    "owner": "Mozilla version two",
*                    "organization": "Mozilla"
*                },
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/HistoricalLocation",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Locations"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(2)",
*                "description": "A SensorWeb thing Number two",
*                "name": "SensorWebThing 2",
*                "properties": {
*                    "owner": "Mozilla version zero",
*                    "organization": "Mozilla"
*                },
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(2)/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(2)/HistoricalLocation",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(2)/Locations"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Things(:id) [13] one.
*    @apiVersion 1.0.0
*    @apiName GetThings
*    @apiGroup Things
*    @apiDescription Get a specific Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(1)",
*        "description": "A SensorWeb thing Number one",
*        "name": "SensorWebThing 1",
*        "properties": {
*            "owner": "Mozilla version two",
*            "organization": "Mozilla"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Locations"
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
*    @api {get} /Things(:id) [14] property name.
*    @apiVersion 1.0.0
*    @apiName GetNameThings
*    @apiGroup Things
*    @apiDescription Get the name of a specific Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)/name
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(1/name
*    @apiSuccessExample {json} Success-Response:
*    {
*        "name": "SensorWebThing 1"
*    }
*/

/**
*    @api {get} /Things(:id) [15] value of property name.
*    @apiVersion 1.0.0
*    @apiName GetNameValueThings
*    @apiGroup Things
*    @apiDescription Get the value of the property name of a specific Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)/name/$value
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(1/name/$value
*    @apiSuccessExample {json} Success-Response:
*    SensorWebThing 1
*/

/**
*    @api {post} /Things [16] basic.
*    @apiVersion 1.0.0
*    @apiName PostThings
*    @apiGroup Things
*    @apiDescription Post a new thing.
*    @apiExample {js} Example usage:
*          /v1.0/Things
*    @apiParam {string} description A property provides a label for Thing entity, commonly a descriptive name.
*    @apiParam {JSONObject} [properties] A JSON Object containing user-annotated properties as key-value pairs.
*    @apiParam {string} name This is a short description of the corresponding Thing entity.
*    @apiParam {relation} [Locations] Locations@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [Datastreams] Datastreams@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "description": "A SensorWeb thing",
*        "name": "SensorWebThing",
*        "properties": {
*            "organization": "Mozilla",
*            "owner": "Mozilla"
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "11",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(11)",
*        "description": "A SensorWeb thing",
*        "name": "SensorWebThing",
*        "properties": {
*            "owner": "Mozilla",
*            "organization": "Mozilla"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(11)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(11)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(11)/Locations"
*    }
*/

/**
*    @api {post} /Things [17] with new Location.
*    @apiVersion 1.0.0
*    @apiName PostThingsLocation
*    @apiGroup Things
*    @apiDescription A Location entity can be linked to a Thing at its creation time. The Location provided will be a new Location in the system.
*    @apiExample {js} Example usage:
*          /v1.0/Things
*    @apiParam {string} description A property provides a label for Thing entity, commonly a descriptive name.
*    @apiParam {JSONObject} [properties] A JSON Object containing user-annotated properties as key-value pairs.
*    @apiParam {string} name This is a short description of the corresponding Thing entity.
*    @apiParam {relation} [Locations] Locations@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [Datastreams] Datastreams@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Temperature Monitoring System",
*        "description": "Thing (POST with new Location)",
*        "properties": {
*            "Deployment Condition": "Deployed in a third floor balcony",
*            "Case Used": "Radiation shield"
*        },
*        "Locations": [
*            {
*                "name": "UofC (Created new location)",
*                "description": "University of Calgary, CCIT building",
*                "encodingType": "application/vnd.geo+json",
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        -114.133,
*                        51.08
*                    ]
*                }
*            }
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "12",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(12)",
*        "description": "Thing (POST with new Location)",
*        "name": "Temperature Monitoring System",
*        "properties": {
*            "Case Used": "Radiation shield",
*            "Deployment Condition": "Deployed in a third floor balcony"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/Locations"
*    }
*/

/**
*    @api {post} /Things [18] with existing Location.
*    @apiVersion 1.0.0
*    @apiName PostThingExistLocation
*    @apiGroup Things
*    @apiDescription Create a thing with existing location.
*    @apiExample {js} Example usage:
*          /v1.0/Things
*    @apiParam {string} description A property provides a label for Thing entity, commonly a descriptive name.
*    @apiParam {JSONObject} [properties] A JSON Object containing user-annotated properties as key-value pairs.
*    @apiParam {string} name This is a short description of the corresponding Thing entity.
*    @apiParam {relation} [Locations] Locations@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [Datastreams] Datastreams@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Temperature Monitoring System",
*        "description": "Sensor (POST with existing Location)",
*        "properties": {
*            "Deployment Condition": "Deployed in a third floor balcony",
*            "Case Used": "Radiation shield"
*        },
*        "Locations": [
*            {
*                "@iot.id": "1"
*            }
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(13)",
*        "description": "Sensor (POST with existing Location)",
*        "name": "Temperature Monitoring System",
*        "properties": {
*            "Case Used": "Radiation shield",
*            "Deployment Condition": "Deployed in a third floor balcony"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/Locations"
*    }
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 400,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "La clé (location_id)=(1908) n'est pas présente dans la table « location »."
*    }
*/

/**
*    @api {post} /Things [19] with Location and Datastream.
*    @apiVersion 1.0.0
*    @apiName PostThingLocationDatastream
*    @apiGroup Things
*    @apiDescription Create a thing with new location & datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Things
*    @apiParam {string} description A property provides a label for Thing entity, commonly a descriptive name.
*    @apiParam {JSONObject} [properties] A JSON Object containing user-annotated properties as key-value pairs.
*    @apiParam {string} name This is a short description of the corresponding Thing entity.
*    @apiParam {relation} [Locations] Locations@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [Datastreams] Datastreams@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Temperature Monitoring System",
*        "description": "Sensor system monitoring area temperature Hot",
*        "properties": {
*            "Deployment Condition": "Deployed in a third floor balcony",
*            "Case Used": "Radiation shield"
*        },
*        "Locations": [
*            {
*                "name": "UofC CCIT",
*                "description": "University of Calgary, CCIT building",
*                "encodingType": "application/vnd.geo+json",
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        -114.133,
*                        51.08
*                    ]
*                }
*            }
*        ],
*        "Datastreams": [
*            {
*                "name": "Air Temperature DS",
*                "description": "Datastream for recording temperature",
*                "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*                "unitOfMeasurement": {
*                    "name": "Degree Celsius",
*                    "symbol": "degC",
*                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html#DegreeCelsius"
*                },
*                "ObservedProperty": {
*                    "name": "Area Temperature",
*                    "description": "The degree or intensity of heat present in the area",
*                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
*                },
*                "Sensor": {
*                    "name": "DHT22",
*                    "description": "DHT22 temperature sensor",
*                    "encodingType": "application/pdf",
*                    "metadata": "https://cdn-shop.adafruit.com/datasheets/DHT22.pdf"
*                }
*            }
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "15",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(15)",
*        "description": "Sensor system monitoring area temperature Hot",
*        "name": "Temperature Monitoring System",
*        "properties": {
*            "Case Used": "Radiation shield",
*            "Deployment Condition": "Deployed in a third floor balcony"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Locations"
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
*    @api {patch} /Things [20] one.
*    @apiVersion 1.0.0
*    @apiName PatchThings
*    @apiGroup Things
*    @apiDescription Patch a thing.
*    @apiExample {js} Example usage:
*          /v1.0/Things(15)
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "New SensorWebThing Patch",
*        "properties": {
*            "organization": "Mozilla",
*            "owner": "Mozilla"
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "15",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(15)",
*        "description": "Sensor system monitoring area temperature Hot",
*        "name": "New SensorWebThing Patch",
*        "properties": {
*            "owner": "Mozilla",
*            "organization": "Mozilla"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Locations"
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
*    @api {patch} /Things [21] and change Location.
*    @apiVersion 1.0.0
*    @apiName PatchLocationThings
*    @apiGroup Things
*    @apiDescription Patch a thing and location change.
*    @apiExample {js} Example usage:
*          /v1.0/Things(15)
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "New SensorWebThing back",
*        "properties": {
*            "organization": "Mozilla",
*            "owner": "Mozilla"
*        },
*        "Locations": [
*            {
*                "@iot.id": 10
*            }
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "15",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(15)",
*        "description": "Sensor system monitoring area temperature Hot",
*        "name": "New SensorWebThing back",
*        "properties": {
*            "owner": "Mozilla",
*            "organization": "Mozilla"
*        },
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(15)/Locations"
*    }
*/

/**
*    @api {delete} /Things [22] one.
*    @apiVersion 1.0.0
*    @apiName DeleteThings
*    @apiGroup Things
*    @apiDescription Delete a Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(15)
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
