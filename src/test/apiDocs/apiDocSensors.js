/**
*    @api {infos} /Sensors [1] infos.
*    @apiVersion 1.0.0
*    @apiName Sensors Infos
*    @apiGroup Sensors
*    @apiDescription A Sensor in SensorThings API is an instrument that observes a property or phenomenon with the goal of producing an estimate of the value of the property.
*/

/**
*    @api {get} /Sensors [3] all.
*    @apiVersion 1.0.0
*    @apiName GetAllSensors
*    @apiGroup Sensors
*    @apiDescription Retrieve all Sensors.
*    @apiExample {js} Example usage:
*          /v1.0/Sensors
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for FeatureOfInterest entity, commonly a descriptive name.
*    @apiSuccess {string} description The definition of the observed property.
*    @apiSuccess {string} encodingType The encoding type of the feature property.
*    @apiSuccess {string} metadata The encoding type of the feature property.
*    @apiSuccess {JSONObject} properties The detailed description of the feature. The data type is defined by encodingType.
*    @apiSuccess {relation} Datastreams Datastreams@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Sensors
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "7",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(1)",
*                "description": "PM sensor Number one",
*                "encodingType": "application/pdf",
*                "metadata": "http://particle-sensor.com/",
*                "name": "PM 1 sensor",
*                "properties": null,
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(1)/Datastreams"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(2)",
*                "description": "PM sensor Number two",
*                "encodingType": "application/pdf",
*                "metadata": "http://particle-sensor.com/",
*                "name": "PM 2 sensor",
*                "properties": null,
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(2)/Datastreams"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Sensors(:id) [4] one.
*    @apiVersion 1.0.0
*    @apiName GetSensors
*    @apiGroup Sensors
*    @apiDescription Get a specific sensor.
*    @apiExample {js} Example usage:
*          /v1.0/Sensors(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Sensors(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(1)",
*        "description": "PM sensor Number one",
*        "encodingType": "application/pdf",
*        "metadata": "http://particle-sensor.com/",
*        "name": "PM 1 sensor",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(1)/Datastreams"
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
*    @api {get} /Sensors(:id) [5] Expands.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsSensors
*    @apiGroup Sensors
*    @apiDescription Get a specific Sensors and expand Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Sensors(1)?$expand=Datastreams
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Sensors(1?$expand=Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(1)",
*        "description": "PM sensor Number one",
*        "encodingType": "application/pdf",
*        "metadata": "http://particle-sensor.com/",
*        "name": "PM 1 sensor",
*        "properties": null,
*        "Datastreams": [
*            {
*                "@iot.id": "4",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(4)",
*                "description": "Air quality Number four",
*                "name": "air_quality_readings4",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(4)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(4)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(4)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(4)/Thing"
*            },
*            {
*                "@iot.id": "12",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)",
*                "description": "Air quality readings",
*                "name": "air_quality_readings",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(12)/Thing"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Sensors(:id) [6] Select.
*    @apiVersion 1.0.0
*    @apiName GetSelectDescriptionSensors
*    @apiGroup Sensors
*    @apiDescription Retrieve specified properties for a specific Sensors.
*    @apiExample {js} Example usage:
*          /v1.0/Sensors(1)?$select=description
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Sensors(1?$select=description
*    @apiSuccessExample {json} Success-Response:
*    {
*        "description": "PM sensor Number one"
*    }
*/

/**
*    @api {post} /Sensors [2] basic.
*    @apiVersion 1.0.0
*    @apiName PostSensors
*    @apiGroup Sensors
*    @apiDescription Post a new sensor.
*    @apiExample {js} Example usage:
*          /v1.0/Sensors
*    @apiParam {String} [name] name of the Thing.
*    @apiParam {String} description description of the Thing.
*    @apiParam {ValueCode} encodingType encodingType ValueCode.
*    @apiParam {metadata} metadata depending on the value of the encodingType
*    @apiParamExample {json} Request-Example:
*    {
*        "description": "PM 2.5 sensor",
*        "name": "PM25sensor",
*        "encodingType": "application/pdf",
*        "metadata": "http://particle-sensor.com/"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "8",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(8)",
*        "description": "PM 2.5 sensor",
*        "encodingType": "application/pdf",
*        "metadata": "http://particle-sensor.com/",
*        "name": "PM25sensor",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(8)/Datastreams"
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
*    @api {patch} /Sensors [8] one.
*    @apiVersion 1.0.0
*    @apiName PatchSensors
*    @apiGroup Sensors
*    @apiDescription Patch a sensor.
*    @apiParam {String} [name] name of the Thing.
*    @apiParam {String} description description of the Thing.
*    @apiParam {ValueCode} encodingType encodingType ValueCode.
*    @apiParam {metadata} metadata depending on the value of the encodingType
*    @apiParamExample {json} Request-Example:
*    {
*        "description": "This is a new PM 2.5 sensor"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "8",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(8)",
*        "description": "This is a new PM 2.5 sensor",
*        "encodingType": "application/pdf",
*        "metadata": "http://particle-sensor.com/",
*        "name": "PM25sensor",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(8)/Datastreams"
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
*    @api {delete} /Sensors [9] one.
*    @apiVersion 1.0.0
*    @apiName DeleteSensors
*    @apiGroup Sensors
*    @apiDescription Delete a sensor.
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
