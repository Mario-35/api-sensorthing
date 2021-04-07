/**
*    @api {infos} /ObservedProperties [11] infos.
*    @apiVersion 1.0.0
*    @apiName ObservedProperties Infos
*    @apiGroup ObservedProperties
*    @apiDescription An ObservedProperty specifies the phenomenon of an Observation.
*/

/**
*    @api {get} /ObservedProperties [12] all.
*    @apiVersion 1.0.0
*    @apiName GetAllObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Retrieve all ObservedProperties.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties
*    @apiSuccess {number} id @iot.id
*    @apiSuccess {relation} selfLink @iot.selfLink
*    @apiSuccess {string} name A property provides a label for ObservedProperty entity, commonly a descriptive name.
*    @apiSuccess {string} definition The URI of the ObservedProperty. Dereferencing this URI SHOULD result in a representation of the definition of the ObservedProperty.
*    @apiSuccess {string} description A description about the ObservedProperty.
*    @apiSuccess {JSONObject} properties The detailed properties of the observed property.
*    @apiSuccess {relation} Datastreams Datastreams@iot.navigationLink
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/ObservedProperties
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "12",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(1)",
*                "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                "description": "PM something Number one",
*                "name": "PM 1 observedProperties",
*                "properties": null,
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(1)/Datastreams"
*            },
*            {
*                "@iot.id": "2",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(2)",
*                "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                "description": "PM something Number two",
*                "name": "PM 2 observedProperties",
*                "properties": null,
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(2)/Datastreams"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /ObservedProperties(:id) [13] one.
*    @apiVersion 1.0.0
*    @apiName GetObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Get a specific ObservedProperties.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties(2)
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/ObservedProperties(2
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "2",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(2)",
*        "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*        "description": "PM something Number two",
*        "name": "PM 2 observedProperties",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(2)/Datastreams"
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
*    @api {get} /Datastream(10/ObservedProperties [14] specific Datastream .
*    @apiVersion 1.0.0
*    @apiName GetDatastreamObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Get ObservedPropertiess from Datastream.
*    @apiExample {js} Example usage:
*          /v1.0/Datastream(8)/ObservedProperties
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Datastream(8/ObservedProperties
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "1",
*        "value": [
*            {
*                "@iot.id": "8",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)",
*                "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                "description": "PM something Number eight",
*                "name": "PM 8 observedProperties",
*                "properties": null,
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)/Datastreams"
*            }
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
*    @api {get} /ObservedProperties(:id) [15] Expands.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Get a specific ObservedProperties and expand Datastreams.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties(1)?$expand=Datastreams
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/ObservedProperties(1?$expand=Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "1",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(1)",
*        "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*        "description": "PM something Number one",
*        "name": "PM 1 observedProperties",
*        "properties": null,
*        "Datastreams": [
*            {
*                "@iot.id": "3",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(3)",
*                "description": "Air quality Number three",
*                "name": "air_quality_readings3",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(3)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(3)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(3)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(3)/Thing"
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
*    @api {get} /ObservedProperties(:id) [16] Select.
*    @apiVersion 1.0.0
*    @apiName GetSelectDescriptionObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Retrieve specified properties for a specific ObservedProperties.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties(1)?$select=description
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/ObservedProperties(1?$select=description
*    @apiSuccessExample {json} Success-Response:
*    {
*        "description": "PM something Number one"
*    }
*/

/**
*    @api {post} /ObservedProperties [17] basic.
*    @apiVersion 1.0.0
*    @apiName PostObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Post a new observedproperty.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties
*    @apiParam {string} name A property provides a label for ObservedProperty entity, commonly a descriptive name.
*    @apiParam {string} [definition] The URI of the ObservedProperty. Dereferencing this URI SHOULD result in a representation of the definition of the ObservedProperty.
*    @apiParam {string} [description] A description about the ObservedProperty.
*    @apiParam {JSONObject} [properties] The detailed properties of the observed property.
*    @apiParam {relation} [Datastreams] Datastreams@iot.navigationLink
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "Area Temperature",
*        "description": "The degree or intensity of heat present in the area",
*        "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(13)",
*        "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature",
*        "description": "The degree or intensity of heat present in the area",
*        "name": "Area Temperature",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(13)/Datastreams"
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
*    @api {patch} /ObservedProperties [18] one.
*    @apiVersion 1.0.0
*    @apiName PatchObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Patch a thing.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties(13)
*    @apiParamExample {json} Request-Example:
*    {
*        "name": "New PM 2.5 Observation"
*    }
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "13",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(13)",
*        "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#AreaTemperature",
*        "description": "The degree or intensity of heat present in the area",
*        "name": "New PM 2.5 Observation",
*        "properties": null,
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(13)/Datastreams"
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
*    @api {delete} /ObservedProperties [19] one.
*    @apiVersion 1.0.0
*    @apiName DeleteObservedProperties
*    @apiGroup ObservedProperties
*    @apiDescription Delete a ObservedProperties.
*    @apiExample {js} Example usage:
*          /v1.0/ObservedProperties(13)
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
