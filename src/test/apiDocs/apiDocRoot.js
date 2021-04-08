/**
*    @api {get} / [0] resource path.
*    @apiVersion 1.0.0
*    @apiName GetPaths
*    @apiGroup Root
*    @apiDescription Access to all resources begins at the base resource path.
*    @apiExample {js} Example usage:
*          /v1.0/
*    @apiSuccess {relation} Datastreams Get all datastreams.
*    @apiSuccess {relation} MultiDatastreams Get all multidatastreams.
*    @apiSuccess {relation} FeaturesOfInterest Get all features of interest.
*    @apiSuccess {relation} HistoricalLocation Get all historical locations.
*    @apiSuccess {relation} Locations Get all locations.
*    @apiSuccess {relation} Observations Get all observations.
*    @apiSuccess {relation} ObservedProperties Get all observed property.
*    @apiSuccess {relation} Sensors Get all sensors.
*    @apiSuccess {relation} Things Get all things.
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/
*    @apiSuccessExample {json} Success-Response:
*    {
*        "value": [
*            {
*                "name": "Datastreams",
*                "url": "http://127.0.0.1:51226/v1.0/Datastreams"
*            },
*            {
*                "name": "Multidatastreams",
*                "url": "http://127.0.0.1:51226/v1.0/Multidatastreams"
*            },
*            {
*                "name": "multidatastreamobservedproperty",
*                "url": "http://127.0.0.1:51226/v1.0/MultiDatastreamObservedproperties"
*            },
*            {
*                "name": "FeaturesOfInterest",
*                "url": "http://127.0.0.1:51226/v1.0/FeaturesOfInterest"
*            },
*            {
*                "name": "HistoricalLocations",
*                "url": "http://127.0.0.1:51226/v1.0/HistoricalLocations"
*            },
*            {
*                "name": "Locations",
*                "url": "http://127.0.0.1:51226/v1.0/Locations"
*            },
*            {
*                "name": "Observations",
*                "url": "http://127.0.0.1:51226/v1.0/Observations"
*            },
*            {
*                "name": "ObservedProperties",
*                "url": "http://127.0.0.1:51226/v1.0/ObservedProperties"
*            },
*            {
*                "name": "Sensors",
*                "url": "http://127.0.0.1:51226/v1.0/Sensors"
*            },
*            {
*                "name": "Things",
*                "url": "http://127.0.0.1:51226/v1.0/Things"
*            }
*        ]
*    }
*/
