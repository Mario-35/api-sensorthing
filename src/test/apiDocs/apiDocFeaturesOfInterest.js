/**
*    @api {infos} /FeaturesOfInterest [1] infos.
*    @apiVersion 1.0.0
*    @apiName FeaturesOfInterest Infos
*    @apiGroup FeaturesOfInterest
*    @apiDescription An Observation results is a value being assigned to a phenomenon.<br>The phenomenon is a property of a feature, the latter being the FeatureOfInterest of the Observation.<br>
    In the context of the Internet of Things, many Observations’ FeatureOfInterest can be the Location of the Thing. For example, the FeatureOfInterest of a wifi-connect thermostat can be the Location of the thermostat (the living room where the thermostat is located in).<br>In the case of remote sensing, the FeatureOfInterest can be the geographical area or volume that is being sensed.
*/

/**
*    @api {get} /FeaturesOfInterest [2] all.
*    @apiVersion 1.0.0
*    @apiName GetAllFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Retrieve all FeaturesOfInterest.
*    @apiExample {js} Example usage:
*          /v1.0/FeaturesOfInterest
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for FeatureOfInterest entity, commonly a descriptive name.
*    @apiSuccess {string} description The description about the FeatureOfInterest.
*    @apiSuccess {string} encodingType The encoding type of the feature property.
*    @apiSuccess {JSONObject} feature The detailed description of the feature. The data type is defined by encodingType.
*    @apiSuccess {relation} Observations Observations@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "8",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1)",
*                "description": null,
*                "encodingType": null,
*                "feature": null,
*                "name": "Default Feature of Interest",
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1)/Observations"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(2)",
*                "description": "This is the weather station Number one",
*                "encodingType": "application/vnd.geo+json",
*                "feature": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-177.06",
*                        "30.05"
*                    ]
*                },
*                "name": "Weather Station 1",
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(2)/Observations"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /FeaturesOfInterest(:id) [3] one.
*    @apiVersion 1.0.0
*    @apiName GetFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Get a specific FeaturesOfInterest.
*    @apiExample {js} Example usage:
*          /v1.0/FeaturesOfInterest(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1)",
*        "description": null,
*        "encodingType": null,
*        "feature": null,
*        "name": "Default Feature of Interest",
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1)/Observations"
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
*    @api {get} /FeaturesOfInterest(:id) [4] one and expand.
*    @apiVersion 1.0.0
*    @apiName GetExpandObservationsFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Get a specific FeaturesOfInterest and expand Observations.
*    @apiExample {js} Example usage:
*          /v1.0/FeaturesOfInterest(1)?$expand=Observations
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1?$expand=Observations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(1)",
*        "description": null,
*        "encodingType": null,
*        "feature": null,
*        "name": "Default Feature of Interest",
*        "Observations": [
*            {
*                "@iot.id": "11",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)",
*                "parameters": null,
*                "phenomenonTime": "2017-02-07T18:02:00.000Z",
*                "result": 21.6,
*                "resultQuality": null,
*                "resultTime": "2017-02-07T18:02:05.000Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(11)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "13",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)",
*                "parameters": null,
*                "phenomenonTime": "2017-02-07T18:02:00.000Z",
*                "result": 21.6,
*                "resultQuality": null,
*                "resultTime": "2017-02-07T18:02:05.000Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(13)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {post} /FeaturesOfInterest [5] basic.
*    @apiVersion 1.0.0
*    @apiName PostFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Post a new featureofinterest.
*    @apiExample {js} Example usage:
*          /v1.0/FeaturesOfInterest
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Weather Station YYC.",
*        "description": "This is a weather station located at the Calgary Airport.",
*        "encodingType": "application/vnd.geo+json",
*        "feature": {
*            "type": "Point",
*            "coordinates": [
*                -114.06,
*                51.05
*            ]
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "9",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(9)",
*        "description": "This is a weather station located at the Calgary Airport.",
*        "encodingType": "application/vnd.geo+json",
*        "feature": {
*            "type": "Point",
*            "coordinates": [
*                -114.06,
*                51.05
*            ]
*        },
*        "name": "Weather Station YYC.",
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(9)/Observations"
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
*    @api {patch} /FeaturesOfInterest [7] one.
*    @apiVersion 1.0.0
*    @apiName PatchFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Patch a sensor.
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "My New Name",
*        "feature": {
*            "type": "Point",
*            "coordinates": [
*                -115.06,
*                55.05
*            ]
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "9",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(9)",
*        "description": "This is a weather station located at the Calgary Airport.",
*        "encodingType": "application/vnd.geo+json",
*        "feature": {
*            "type": "Point",
*            "coordinates": [
*                -115.06,
*                55.05
*            ]
*        },
*        "name": "My New Name",
*        "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/FeaturesOfInterest(9)/Observations"
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
*    @api {delete} /FeaturesOfInterest [8] one.
*    @apiVersion 1.0.0
*    @apiName DeleteFeaturesOfInterest
*    @apiGroup FeaturesOfInterest
*    @apiDescription Delete a FeaturesOfInterest.
*    @apiExample {js} Example usage:
*          /v1.0/FeaturesOfInterest(9)
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
