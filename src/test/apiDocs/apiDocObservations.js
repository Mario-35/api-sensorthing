/**
*    @api {infos} /Observations [11] infos.
*    @apiVersion 1.0.0
*    @apiName Observations Infos
*    @apiGroup Observations
*    @apiDescription An Observation is the act of measuring or otherwise determining the value of a property.<br>
    An Observation in SensorThings represents a single Sensor reading of an ObservedProperty.<br>A physical device, a Sensor, sends Observations to a specified Datastream.<br>An Observation requires a FeatureOfInterest entity, if none is provided in the request, the Location of the Thing associated with the Datastream, will be assigned to the new Observation as the FeatureOfInterest.
*/

/**
*    @api {get} /Observations(:id) [12] Expands.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsObservations
*    @apiGroup Observations
*    @apiDescription Get a specific Observations and expand Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(1)?$expand=Datastreams
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations(1?$expand=Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*        "parameters": null,
*        "phenomenonTime": "2016-11-18T04:15:15.790Z",
*        "result": 35,
*        "resultQuality": null,
*        "resultTime": "2016-11-18T12:30:30.790Z",
*        "validTime": null,
*        "Datastream": {
*            "@iot.id": "1",
*            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)",
*            "description": "Air quality Number one",
*            "name": "air_quality_readings1",
*            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
*            "observedArea": null,
*            "phenomenonTime": null,
*            "properties": null,
*            "resultTime": null,
*            "unitOfMeasurement": {
*                "name": "PM 2.5 Particulates (ug/m3)",
*                "symbol": "μg/m³",
*                "definition": "http://unitsofmeasure.org/ucum.html"
*            },
*            "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations",
*            "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/ObservedProperty",
*            "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Sensor",
*            "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing"
*        },
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
*    }
*/

/**
*    @api {get} /Observations(:id) [13] Select.
*    @apiVersion 1.0.0
*    @apiName GetSelectPhenomenonTimeObservations
*    @apiGroup Observations
*    @apiDescription Retrieve specified phenomenonTime, result for a specific Observations.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(1)?$select=phenomenonTime,result
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations(1?$select=phenomenonTime,result
*    @apiSuccessExample {json} Success-Response:
*    {
*        "phenomenonTime": "2016-11-18T04:15:15.790Z",
*        "result": 35
*    }
*/

/**
*    @api {get} /Observations [14] all.
*    @apiVersion 1.0.0
*    @apiName GetAllObservations
*    @apiGroup Observations
*    @apiDescription Retrieve all Observations.
*    @apiExample {js} Example usage:
*          /v1.0/Observations
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {Date} phenomenonTime The time instant or period of when the Observation happens.
*    @apiSuccess {string} result The estimated value of an ObservedProperty from the Observation.
*    @apiSuccess {Date} resultTime The time of the Observation result was generated.
*    @apiSuccess {JSONObject} resultQuality Describes the quality of the result.
*    @apiSuccess {Date} validTime The time period during which the result may be used.
*    @apiSuccess {JSONObject} parameters Key-value pairs showing the environmental conditions during measurement.
*    @apiSuccess {relation} Datastream Datastream@iot.navigationLink
*    @apiSuccess {relation} FeatureOfInterest FeatureOfInterest@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "10",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T04:15:15.790Z",
*                "result": 35,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T12:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T08:15:15.790Z",
*                "result": 11.6666666666667,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T14:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Observations(:id) [15] one.
*    @apiVersion 1.0.0
*    @apiName GetObservations
*    @apiGroup Observations
*    @apiDescription Get a specific Observations.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*        "parameters": null,
*        "phenomenonTime": "2016-11-18T04:15:15.790Z",
*        "result": 35,
*        "resultQuality": null,
*        "resultTime": "2016-11-18T12:30:30.790Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
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
*    @api {get} /Datastreams(10)/Observations [16] from Datastream.
*    @apiVersion 1.0.0
*    @apiName GetDatastreamsObservations
*    @apiGroup Observations
*    @apiDescription Get Observationss from Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(10)/Observations
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Datastreams(10/Observations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "3",
*        "value": [
*            {
*                "@iot.id": "8",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T01:15:15.790Z",
*                "result": 45,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T12:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(8)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "9",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T07:15:15.790Z",
*                "result": 45,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T16:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {post} /Observations [17] with existing FOI.
*    @apiVersion 1.0.0
*    @apiName PostObservations
*    @apiGroup Observations
*    @apiDescription Post a new observation.
*    @apiExample {js} Example usage:
*          /v1.0/Observations
*    @apiParam {Date} [phenomenonTime] The time instant or period of when the Observation happens.
*    @apiParam {string} [result] The estimated value of an ObservedProperty from the Observation.
*    @apiParam {Date} [resultTime] The time of the Observation result was generated.
*    @apiParam {JSONObject} [resultQuality] Describes the quality of the result.
*    @apiParam {Date} [validTime] The time period during which the result may be used.
*    @apiParam {JSONObject} [parameters] Key-value pairs showing the environmental conditions during measurement.
*    @apiParam {relation} [Datastream] Datastream@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "result": 21.6,
*        "Datastream": {
*            "@iot.id": 10
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "11",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)",
*        "parameters": null,
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "result": 21.6,
*        "resultQuality": null,
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)/FeatureOfInterest"
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
*    @api {post} /Observations [18] with FOI.
*    @apiVersion 1.0.0
*    @apiName PostNewFoiObservations
*    @apiGroup Observations
*    @apiDescription Post a new observation.
*    @apiExample {js} Example usage:
*          /v1.0/Observations
*    @apiParam {Date} [phenomenonTime] The time instant or period of when the Observation happens.
*    @apiParam {string} [result] The estimated value of an ObservedProperty from the Observation.
*    @apiParam {Date} [resultTime] The time of the Observation result was generated.
*    @apiParam {JSONObject} [resultQuality] Describes the quality of the result.
*    @apiParam {Date} [validTime] The time period during which the result may be used.
*    @apiParam {JSONObject} [parameters] Key-value pairs showing the environmental conditions during measurement.
*    @apiParam {relation} [Datastream] Datastream@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "result": 21.6,
*        "FeatureOfInterest": {
*            "name": "UofC CCIT",
*            "description": "University of Calgary, CCIT building",
*            "encodingType": "application/vnd.geo+json",
*            "feature": {
*                "type": "Point",
*                "coordinates": [
*                    -114.133,
*                    51.08
*                ]
*            }
*        },
*        "Datastream": {
*            "@iot.id": 6
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "12",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(12)",
*        "parameters": null,
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "result": 21.6,
*        "resultQuality": null,
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(12)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(12)/FeatureOfInterest"
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
*    @api {post} /Observations [19] from Datastream.
*    @apiVersion 1.0.0
*    @apiName PostObservationsDatastreamsObservations
*    @apiGroup Observations
*    @apiDescription POST with existing Datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(10)/Observations
*    @apiParam {Date} [phenomenonTime] The time instant or period of when the Observation happens.
*    @apiParam {string} [result] The estimated value of an ObservedProperty from the Observation.
*    @apiParam {Date} [resultTime] The time of the Observation result was generated.
*    @apiParam {JSONObject} [resultQuality] Describes the quality of the result.
*    @apiParam {Date} [validTime] The time period during which the result may be used.
*    @apiParam {JSONObject} [parameters] Key-value pairs showing the environmental conditions during measurement.
*    @apiParam {relation} [Datastream] Datastream@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "result": 21.6
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)",
*        "parameters": null,
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "result": 21.6,
*        "resultQuality": null,
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)/FeatureOfInterest"
*    }
*/

/**
*    @api {post} /Observations [20] from Datastream and FOI.
*    @apiVersion 1.0.0
*    @apiName PostObservationsDatastreamsFOIObservations
*    @apiGroup Observations
*    @apiDescription POST with existing Datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Datastreams(10)/Observations
*    @apiParam {Date} [phenomenonTime] The time instant or period of when the Observation happens.
*    @apiParam {string} [result] The estimated value of an ObservedProperty from the Observation.
*    @apiParam {Date} [resultTime] The time of the Observation result was generated.
*    @apiParam {JSONObject} [resultQuality] Describes the quality of the result.
*    @apiParam {Date} [validTime] The time period during which the result may be used.
*    @apiParam {JSONObject} [parameters] Key-value pairs showing the environmental conditions during measurement.
*    @apiParam {relation} [Datastream] Datastream@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "result": 21.6,
*        "FeatureOfInterest": {
*            "name": "UofC CCIT",
*            "description": "University of Calgary, CCIT building",
*            "encodingType": "application/vnd.geo+json",
*            "feature": {
*                "type": "Point",
*                "coordinates": [
*                    -114.133,
*                    51.08
*                ]
*            }
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "14",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(14)",
*        "parameters": null,
*        "phenomenonTime": "2017-02-07T18:02:00.000Z",
*        "result": 21.6,
*        "resultQuality": null,
*        "resultTime": "2017-02-07T18:02:05.000Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(14)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(14)/FeatureOfInterest"
*    }
*/

/**
*    @api {patch} /Observations [21] one.
*    @apiVersion 1.0.0
*    @apiName PatchObservationObservations
*    @apiGroup Observations
*    @apiDescription Patch an Observation.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(1)
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2016-11-18T11:04:15.790Z",
*        "resultTime": "2016-11-18T11:04:15.790Z"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*        "parameters": null,
*        "phenomenonTime": "2016-11-18T11:04:15.790Z",
*        "result": 35,
*        "resultQuality": null,
*        "resultTime": "2016-11-18T11:04:15.790Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
*    }
*/

/**
*    @api {patch} /Observations [22] with Datastream.
*    @apiVersion 1.0.0
*    @apiName PatchObservationDatastreamObservations
*    @apiGroup Observations
*    @apiDescription Patch an Observation with datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(2)
*    @apiParamExample {json} Request-Example:
*    {
*        "phenomenonTime": "2016-11-18T11:04:15.790Z",
*        "resultTime": "2016-11-18T11:04:15.790Z",
*        "result": 20.4,
*        "Datastream": {
*            "@iot.id": 6
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "2",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)",
*        "parameters": null,
*        "phenomenonTime": "2016-11-18T11:04:15.790Z",
*        "result": 20.4,
*        "resultQuality": null,
*        "resultTime": "2016-11-18T11:04:15.790Z",
*        "validTime": null,
*        "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/Datastream",
*        "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/FeatureOfInterest"
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
*    @api {delete} /Observations [23] one.
*    @apiVersion 1.0.0
*    @apiName DeleteObservations
*    @apiGroup Observations
*    @apiDescription Delete a Observations.
*    @apiExample {js} Example usage:
*          /v1.0/Observations(2)
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
