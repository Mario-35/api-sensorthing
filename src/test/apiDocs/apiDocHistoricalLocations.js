/**
*    @api {infos} /HistoricalLocations [1] infos.
*    @apiVersion 1.0.0
*    @apiName HistoricalLocations Infos
*    @apiGroup HistoricalLocations
*    @apiDescription A Thing’s HistoricalLocation entity set provides the times of the current (last known) and previous locations of the Thing.
*/

/**
*    @api {get} /HistoricalLocations [2] all.
*    @apiVersion 1.0.0
*    @apiName GetAllHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Retrieve all HistoricalLocations.
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {Date} time The time when the Thing is known at the Location.
*    @apiSuccess {relation} Thing Thing@iot.navigationLink
*    @apiSuccess {relation} Locations Locations@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/HistoricalLocations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "23",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)",
*                "time": "2021-04-26T15:51:37.651Z",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)/Locations",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)/Thing"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(2)",
*                "time": "2021-04-26T15:51:37.663Z",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(2)/Locations",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(2)/Thing"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /HistoricalLocations(:id) [3] one.
*    @apiVersion 1.0.0
*    @apiName GetHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Get a specific HistoricalLocations.
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations(1)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)",
*        "time": "2021-04-26T15:51:37.651Z",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)/Locations",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(1)/Thing"
*    }
*/

/**
*    @api {get} /HistoricalLocations(:id) [4] Expand.
*    @apiVersion 1.0.0
*    @apiName GetExpandLocationsHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Get a specific HistoricalLocations and expand location.
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations(6)?$expand=Locations
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/HistoricalLocations(6?$expand=Locations
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "6",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(6)",
*        "time": "2021-04-26T15:51:37.851Z",
*        "Locations": [
*            {
*                "@iot.id": "6",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)",
*                "_default_foi": "3",
*                "description": "This is the Location Number six",
*                "encodingType": "application/vnd.geo+json",
*                "geom": null,
*                "location": {
*                    "type": "Point",
*                    "coordinates": [
*                        "-140.06",
*                        "39.05"
*                    ]
*                },
*                "name": "My Location 6",
*                "properties": null,
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)/HistoricalLocation",
*                "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(6)/Things"
*            }
*        ],
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(6)/Thing"
*    }
*/

/**
*    @api {get} /HistoricalLocations(:id) [5] Select.
*    @apiVersion 1.0.0
*    @apiName GetSelectTimeHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Retrieve time for a specific HistoricalLocations .
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations(6)?$select=time
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/HistoricalLocations(6?$select=time
*    @apiSuccessExample {json} Success-Response:
*    {
*        "time": "2021-04-26T15:51:37.851Z"
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
*    @api {patch} /HistoricalLocations [6] one.
*    @apiVersion 1.0.0
*    @apiName PatchHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Patch a HistoricalLocations.
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations(25)
*    @apiParamExample {json} Request-Example:
*    {
*        "time": "2015-02-07T19:22:11.297Z"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "25",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(25)",
*        "time": "2015-02-07T19:22:11.297Z",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(25)/Locations",
*        "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/HistoricalLocations(25)/Thing"
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
*    @api {delete} /HistoricalLocations [7] one.
*    @apiVersion 1.0.0
*    @apiName DeleteHistoricalLocations
*    @apiGroup HistoricalLocations
*    @apiDescription Delete a HistoricalLocations.
*    @apiExample {js} Example usage:
*          /v1.0/HistoricalLocations(25)
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
