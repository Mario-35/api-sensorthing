/**
*    @api {infos} Query [11] infos.
*    @apiVersion 1.0.0
*    @apiName QueryInfos
*    @apiGroup Query
*    @apiDescription The use of query options allows refining the requests to help get the required information about the SensorThings entities in an easy and efficient manner. Each of the listed query options are available for each SensorThings entity, however the options for each may differ.<br>
        SensorThings query options can be categorized to two different groups.<br>
          -  The first group specifies the properties to be returned by the request. $expand and $select are query options of this group.<br>
          -  The second group is limiting, filtering, or re-ordering the request results. This group contains $orderby, $top, $skip, $count, and $filter.
*/

/**
*    @api {get} /Things(:id) [12] Expand.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsThings
*    @apiGroup Query
*    @apiDescription Use $expand query option to request inline information for related entities of the requested entity collection..
*    @apiExample {js} Example usage:
*          /v1.0/Things(6)?$expand=Datastreams
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(6?$expand=Datastreams
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "6",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(6)",
*        "description": "A SensorWeb thing Number six",
*        "name": "SensorWebThing 6",
*        "properties": {
*            "owner": "Mozilla version seven",
*            "organization": "Mozilla"
*        },
*        "Datastreams": [
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
*            {
*                "@iot.id": "10",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)",
*                "description": "Air quality Number ten",
*                "name": "air_quality_readings10",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/ObservedProperty",
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Thing"
*            }
*        ],
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/Locations"
*    }
*/

/**
*    @api {get} /Things(:id) [13] Expand sub Entity.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsSensorThings
*    @apiGroup Query
*    @apiDescription $expand comma separated list of sub-entity names or sub-entity names separated by forward slash.
*    @apiExample {js} Example usage:
*          /v1.0/Things(6)?$expand=Datastreams/Sensor
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(6?$expand=Datastreams/Sensor
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "6",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(6)",
*        "description": "A SensorWeb thing Number six",
*        "name": "SensorWebThing 6",
*        "properties": {
*            "owner": "Mozilla version seven",
*            "organization": "Mozilla"
*        },
*        "Datastreams": [
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
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
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
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Thing"
*            },
*            {
*                "@iot.id": "10",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)",
*                "description": "Air quality Number ten",
*                "name": "air_quality_readings10",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/ObservedProperty",
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Thing"
*            }
*        ],
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/Locations"
*    }
*/

/**
*    @api {get} /Things(:id) [14] Expand multi entities.
*    @apiVersion 1.0.0
*    @apiName GetExpandDatastreamsSensorObservedPropertyThings
*    @apiGroup Query
*    @apiDescription Retrieve a Things with inline related entities using $expand query option. Query options can be used on the entire collection of entities or on individual ones.
*    @apiExample {js} Example usage:
*          /v1.0/Things(6)?$expand=Datastreams/Sensor,ObservedProperty
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(6?$expand=Datastreams/Sensor,ObservedProperty
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.id": "6",
*        "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(6)",
*        "description": "A SensorWeb thing Number six",
*        "name": "SensorWebThing 6",
*        "properties": {
*            "owner": "Mozilla version seven",
*            "organization": "Mozilla"
*        },
*        "Datastreams": [
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
*                "ObservedProperty": {
*                    "@iot.id": "8",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)",
*                    "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                    "description": "PM something Number eight",
*                    "name": "PM 8 observedProperties",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)/Datastreams"
*                },
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
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
*                "ObservedProperty": {
*                    "@iot.id": "8",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)",
*                    "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                    "description": "PM something Number eight",
*                    "name": "PM 8 observedProperties",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)/Datastreams"
*                },
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(9)/Thing"
*            },
*            {
*                "@iot.id": "10",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)",
*                "description": "Air quality Number ten",
*                "name": "air_quality_readings10",
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
*                "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Observations",
*                "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/ObservedProperty",
*                "ObservedProperty": {
*                    "@iot.id": "8",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)",
*                    "definition": "https://airnow.gov/index.cfm$1action=aqibasics.particle",
*                    "description": "PM something Number eight",
*                    "name": "PM 8 observedProperties",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/ObservedProperties(8)/Datastreams"
*                },
*                "Sensor": {
*                    "@iot.id": "5",
*                    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)",
*                    "description": "PM sensor Number five",
*                    "encodingType": "application/pdf",
*                    "metadata": "http://particle-sensor.com/",
*                    "name": "PM 5 sensor",
*                    "properties": null,
*                    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Sensors(5)/Datastreams"
*                },
*                "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Sensor",
*                "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(10)/Thing"
*            }
*        ],
*        "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/Datastreams",
*        "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/HistoricalLocation",
*        "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(6)/Locations"
*    }
*/

/**
*    @api {get} /Things(:id) [15] Select.
*    @apiVersion 1.0.0
*    @apiName GetSelect
*    @apiGroup Query
*    @apiDescription Retrieve specified properties for a specific Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things(1)?$select=description
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(1?$select=description
*    @apiSuccessExample {json} Success-Response:
*    {
*        "description": "A SensorWeb thing Number one"
*    }
*/

/**
*    @api {get} /Things(:id) [16] Select multi.
*    @apiVersion 1.0.0
*    @apiName GetSelectMulti
*    @apiGroup Query
*    @apiDescription Retrieve name and description for Things.
*    @apiExample {js} Example usage:
*          /v1.0/Things?$select=name,description
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things?$select=name,description
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "13",
*        "value": [
*            {
*                "description": "A SensorWeb thing",
*                "name": "SensorWebThing",
*                "Datastreams@iot.navigationLink": "undefined/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "undefined/HistoricalLocation",
*                "Locations@iot.navigationLink": "undefined/Locations"
*            },
*            {
*                "description": "A SensorWeb thing Number one",
*                "name": "SensorWebThing 1",
*                "Datastreams@iot.navigationLink": "undefined/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "undefined/HistoricalLocation",
*                "Locations@iot.navigationLink": "undefined/Locations"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Things [17] OrderBy.
*    @apiVersion 1.0.0
*    @apiName GetOrderByThings
*    @apiGroup Query
*    @apiDescription Use $orderby query option to sort the response based on properties of requested entity in ascending (asc) or descending (desc) order.
*    @apiExample {js} Example usage:
*          /v1.0/Things?$orderby=name desc
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things?$orderby=name desc
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "13",
*        "value": [
*            {
*                "@iot.id": "13",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(13)",
*                "description": "Sensor (POST with existing Location)",
*                "name": "Temperature Monitoring System",
*                "properties": {
*                    "Case Used": "Radiation shield",
*                    "Deployment Condition": "Deployed in a third floor balcony"
*                },
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/HistoricalLocation",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(13)/Locations"
*            },
*            {
*                "@iot.id": "12",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(12)",
*                "description": "Thing (POST with new Location)",
*                "name": "Temperature Monitoring System",
*                "properties": {
*                    "Case Used": "Radiation shield",
*                    "Deployment Condition": "Deployed in a third floor balcony"
*                },
*                "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/Datastreams",
*                "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/HistoricalLocation",
*                "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(12)/Locations"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Observations [18] Top.
*    @apiVersion 1.0.0
*    @apiName GetTopObservations
*    @apiGroup Query
*    @apiDescription Use $top query option to limit the number of requested entities.
*    @apiExample {js} Example usage:
*          /v1.0/Observations?$top=5
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations?$top=5
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "5",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T11:04:15.790Z",
*                "result": 8.75,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T11:04:15.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "3",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T03:15:15.790Z",
*                "result": 11.6666666666667,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T17:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Observations [19] Skip.
*    @apiVersion 1.0.0
*    @apiName GetSelectMultiThings
*    @apiGroup Query
*    @apiDescription Use $skip to specify the number of entities that should be skipped before returning the requested entities.
*    @apiExample {js} Example usage:
*          /v1.0/Observations?$skip=3
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations?$skip=3
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "13",
*        "value": [
*            {
*                "@iot.id": "5",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(5)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T08:15:15.790Z",
*                "result": 8.75,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T11:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(5)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(5)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "6",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(6)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T05:15:15.790Z",
*                "result": 8.75,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T18:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(6)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(6)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Observations [20] eq.
*    @apiVersion 1.0.0
*    @apiName GetEqualObservations
*    @apiGroup Query
*    @apiDescription Use $filter query option to perform conditional operations on the property values and filter request result.
*    @apiExample {js} Example usage:
*          /v1.0/Observations?$filter=result eq 45
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations?$filter=result eq 45
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
*                "resultTime": "2016-11-18T18:30:30.790Z",
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
*                "resultTime": "2016-11-18T17:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(9)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*/

/**
*    @api {get} /Observations [21] lt.
*    @apiVersion 1.0.0
*    @apiName GetLessObservations
*    @apiGroup Query
*    @apiDescription Use $filter query option to perform conditional operations on the property values and filter request result.
*    @apiExample {js} Example usage:
*          /v1.0/Observations?$filter=result lt 45
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Observations?$filter=result lt 45
*    @apiSuccessExample {json} Success-Response:
*    {
*        "@iot.count": "10",
*        "value": [
*            {
*                "@iot.id": "1",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T11:04:15.790Z",
*                "result": 8.75,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T11:04:15.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest"
*            },
*            {
*                "@iot.id": "3",
*                "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)",
*                "parameters": null,
*                "phenomenonTime": "2016-11-18T03:15:15.790Z",
*                "result": 11.6666666666667,
*                "resultQuality": null,
*                "resultTime": "2016-11-18T17:30:30.790Z",
*                "validTime": null,
*                "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)/Datastream",
*                "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(3)/FeatureOfInterest"
*            },
*            "..."
*        ]
*    }
*    @apiErrorExample {json} Error-Response:
*    ""
*/
