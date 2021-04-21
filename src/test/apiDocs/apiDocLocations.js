/**
*    @api {infos} /Locations [1] infos.
*    @apiVersion 1.0.0
*    @apiName Locations Infos
*    @apiGroup Locations
*    @apiDescription The Location entity locates the Thing(s) it associated with.<br>A Thing’s Location entity is defined as the last known location of the Thing.<br>
    A Thing can have multiple Locations if all Locations are different representations of same Location with different encodingType.
*/

/**
*    @api {get} /Locations [2] all.
*    @apiVersion 1.0.0
*    @apiName GetAllLocations
*    @apiGroup Locations
*    @apiDescription Retrieve all Locations.
*    @apiExample {js} Example usage:
*          /v1.0/Locations
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for Location entity, commonly a descriptive name.
*    @apiSuccess {string} description The description about the location.
*    @apiSuccess {JSONObject} location The location type is defined by encodingType.
*    @apiSuccess {string} encodingType The encoding type of the location.
*    @apiSuccess {number} _default_foi Default feature of interest.
*    @apiSuccess {Enum} geom Geom.
*    @apiSuccess {JSONObject} properties Properties of the location.
*    @apiSuccess {relation} Things Things@iot.navigationLink
*    @apiSuccess {relation} HistoricalLocation HistoricalLocation@iot.navigationLink
*    @apiSuccess {relation} FeatureOfInterest FeatureOfInterest@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Locations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "12",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)",
*                "_default_foi": "4",
*                "description": "University of Calgary, CCIT building",
*                "encodingType": "application/vnd.geo+json",
*                "geom": null,
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-63.06",
*                        "27.05"
*                    ]
*                },
*                "name": "UofC (Created new location) Number six",
*                "properties": null,
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/HistoricalLocation",
*                "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/Things"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(2)",
*                "_default_foi": "1",
*                "description": "University of Calgary, CCIT building",
*                "encodingType": "application/vnd.geo+json",
*                "geom": null,
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-195.06",
*                        "50.05"
*                    ]
*                },
*                "name": "UofC (Created new location) Number seven",
*                "properties": null,
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(2)/HistoricalLocation",
*                "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(2)/Things"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Locations(:id) [3] one.
*    @apiVersion 1.0.0
*    @apiName GetLocations
*    @apiGroup Locations
*    @apiDescription Get a specific Locations.
*    @apiExample {js} Example usage:
*          /v1.0/Locations(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Locations(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)",
*        "_default_foi": "4",
*        "description": "University of Calgary, CCIT building",
*        "encodingType": "application/vnd.geo+json",
*        "geom": null,
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                "-63.06",
*                "27.05"
*            ]
*        },
*        "name": "UofC (Created new location) Number six",
*        "properties": null,
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/HistoricalLocation",
*        "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/Things"
*    }
*/

/**
*    @api {get} /Things(5)/Locations(:id) [4] specific Thing.
*    @apiVersion 1.0.0
*    @apiName GetAllFromThingLocations
*    @apiGroup Locations
*    @apiDescription Retrieve Locations of a specific Thing.
*    @apiExample {js} Example usage:
*          /v1.0/Things(5)/Locations
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for Location entity, commonly a descriptive name.
*    @apiSuccess {string} description The description about the location.
*    @apiSuccess {JSONObject} location The location type is defined by encodingType.
*    @apiSuccess {string} encodingType The encoding type of the location.
*    @apiSuccess {number} _default_foi Default feature of interest.
*    @apiSuccess {Enum} geom Geom.
*    @apiSuccess {JSONObject} properties Properties of the location.
*    @apiSuccess {relation} Things Things@iot.navigationLink
*    @apiSuccess {relation} HistoricalLocation HistoricalLocation@iot.navigationLink
*    @apiSuccess {relation} FeatureOfInterest FeatureOfInterest@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(5/Locations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "5",
*        "value": [
*            {
*                "@iot.id": "6",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)",
*                "_default_foi": "4",
*                "description": "This is the Location Number six",
*                "encodingType": "application/vnd.geo+json",
*                "geom": null,
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-34.06",
*                        "12.05"
*                    ]
*                },
*                "name": "My Location 6",
*                "properties": null,
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)/HistoricalLocation",
*                "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)/Things"
*            },
*            {
*                "@iot.id": "7",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(7)",
*                "_default_foi": "4",
*                "description": "This is the Location Number seven",
*                "encodingType": "application/vnd.geo+json",
*                "geom": null,
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-113.06",
*                        "18.05"
*                    ]
*                },
*                "name": "My Location 7",
*                "properties": null,
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(7)/HistoricalLocation",
*                "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(7)/Things"
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
*    @api {post} /Locations [5] basic.
*    @apiVersion 1.0.0
*    @apiName PostLocations
*    @apiGroup Locations
*    @apiDescription Post a new location.
*    @apiExample {js} Example usage:
*          /v1.0/Locations
*    @apiParam {string} name A property provides a label for Location entity, commonly a descriptive name.
*    @apiParam {string} description The description about the location.
*    @apiParam {JSONObject} [location] The location type is defined by encodingType.
*    @apiParam {string} [encodingType] The encoding type of the location.
*    @apiParam {number} [_default_foi] Default feature of interest.
*    @apiParam {Enum} [geom] Geom.
*    @apiParam {JSONObject} [properties] Properties of the location.
*    @apiParam {relation} [Things] Things@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "My Location",
*        "description": "Backyard",
*        "encodingType": "application/vnd.geo+json",
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                4.913329,
*                52.343029
*            ]
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(13)",
*        "_default_foi": null,
*        "description": "Backyard",
*        "encodingType": "application/vnd.geo+json",
*        "geom": null,
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                4.913329,
*                52.343029
*            ]
*        },
*        "name": "My Location",
*        "properties": null,
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(13)/HistoricalLocation",
*        "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(13)/Things"
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
*    @api {post} /Locations [6] with existing Thing.
*    @apiVersion 1.0.0
*    @apiName PostLocationThingLocations
*    @apiGroup Locations
*    @apiDescription POST with existing Thing.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)/Locations
*    @apiParam {string} name A property provides a label for Location entity, commonly a descriptive name.
*    @apiParam {string} description The description about the location.
*    @apiParam {JSONObject} [location] The location type is defined by encodingType.
*    @apiParam {string} [encodingType] The encoding type of the location.
*    @apiParam {number} [_default_foi] Default feature of interest.
*    @apiParam {Enum} [geom] Geom.
*    @apiParam {JSONObject} [properties] Properties of the location.
*    @apiParam {relation} [Things] Things@iot.navigationLink
*    @apiParam {relation} [HistoricalLocation] HistoricalLocation@iot.navigationLink
*    @apiParam {relation} [FeatureOfInterest] FeatureOfInterest@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "UofC CCIT",
*        "description": "University of Calgary, CCIT building",
*        "encodingType": "application/vnd.geo+json",
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                -114.133,
*                51.08
*            ]
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "14",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)",
*        "_default_foi": null,
*        "description": "University of Calgary, CCIT building",
*        "encodingType": "application/vnd.geo+json",
*        "geom": null,
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                -114.133,
*                51.08
*            ]
*        },
*        "name": "UofC CCIT",
*        "properties": null,
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)/HistoricalLocation",
*        "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)/Things"
*    }
*/

/**
*    @api {patch} /Locations [7] one.
*    @apiVersion 1.0.0
*    @apiName PatchLocations
*    @apiGroup Locations
*    @apiDescription Patch a thing.
*    @apiExample {js} Example usage:
*          /v1.0/Locations(14)
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "My Location has changed",
*        "description": "Backyard",
*        "encodingType": "application/vnd.geo+json",
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                4.913329,
*                52.343029
*            ]
*        }
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "14",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)",
*        "_default_foi": null,
*        "description": "Backyard",
*        "encodingType": "application/vnd.geo+json",
*        "geom": null,
*        "location": {
*            "type": "Point",
*            "coordinates": [
*                4.913329,
*                52.343029
*            ]
*        },
*        "name": "My Location has changed",
*        "properties": null,
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)/HistoricalLocation",
*        "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(14)/Things"
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
*    @api {delete} /Locations [8] one.
*    @apiVersion 1.0.0
*    @apiName DeleteLocations
*    @apiGroup Locations
*    @apiDescription Delete a Locations.
*    @apiExample {js} Example usage:
*          /v1.0/Locations(14)
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
