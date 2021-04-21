/**
*    @api {infos} /CreateObservations [11] infos.
*    @apiVersion 1.0.0
*    @apiName CreateObservations Infos
*    @apiGroup CreateObservations
*    @apiDescription Create observations
*/

/**
*    @api {post} /CreateObservations [12] CreateObservations FOI.
*    @apiVersion 1.0.0
*    @apiName PostObservationsCreateObservationsFoiCreateObservations
*    @apiGroup CreateObservations
*    @apiDescription CreateObservations
*    @apiExample {js} Example usage:
*          /v1.0/CreateObservations
*    @apiParamExample {json} Request-Example:
*    {
*        "Datastream": {
*            "@iot.id": 1
*        },
*        "components": [
*            "phenomenonTime",
*            "result",
*            "FeatureOfInterest/id"
*        ],
*        "dataArray@iot.count": 3,
*        "dataArray": [
*            [
*                "2017-01-13T10:20:00.000Z",
*                90,
*                1
*            ],
*            [
*                "2017-01-13T10:21:00.000Z",
*                91,
*                1
*            ],
*            [
*                "2017-01-13T10:22:00.000Z",
*                92,
*                1
*            ]
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    [
*        "http://sensorthings.geosas.fr/v1.0/Observations(15)",
*        "http://sensorthings.geosas.fr/v1.0/Observations(16)",
*        "http://sensorthings.geosas.fr/v1.0/Observations(17)"
*    ]
*/

/**
*    @api {post} /CreateObservations [13] CreateObservations.
*    @apiVersion 1.0.0
*    @apiName PostObservationsCreateObservationsCreateObservations
*    @apiGroup CreateObservations
*    @apiDescription CreateObservations
*    @apiExample {js} Example usage:
*          /v1.0/CreateObservations
*    @apiParamExample {json} Request-Example:
*    {
*        "Datastream": {
*            "@iot.id": 1
*        },
*        "components": [
*            "phenomenonTime",
*            "result"
*        ],
*        "dataArray@iot.count": 3,
*        "dataArray": [
*            [
*                "2017-01-13T10:20:00.000Z",
*                90
*            ],
*            [
*                "2017-01-13T10:21:00.000Z",
*                91
*            ],
*            [
*                "2017-01-13T10:22:00.000Z",
*                92
*            ]
*        ]
*    }
*    @apiSuccessExample {json} Success-Response:
*    [
*        "http://sensorthings.geosas.fr/v1.0/Observations(18)",
*        "http://sensorthings.geosas.fr/v1.0/Observations(19)",
*        "http://sensorthings.geosas.fr/v1.0/Observations(20)"
*    ]
*    @apiErrorExample {json} Error-Response:
*    {
*        "code": 400,
*        "errno": 777,
*        "error": "Bad Request",
*        "message": "Something went wrong."
*    }
*/
