/**
*    @api {infos} /Format [11] infos.
*    @apiVersion 1.0.0
*    @apiName FormatInfos
*    @apiGroup Formats
*    @apiDescription Format result JSON as default, CSV with comma separator, note that $value return result as text.
*/

/**
*    @api {get} /Things(:id)?resultFormat=CSV [12].
*    @apiVersion 1.0.0
*    @apiName GetFormatCsv
*    @apiGroup Formats
*    @apiDescription Use $resultFormat to determine return result format.
*    @apiExample {js} Example usage:
*          /v1.0/Things(10)?$resultFormat=CSV
*    @apiSampleRequest http://sensorthings.geosas.fr/v1.0/Things(10?$resultFormat=CSV
*    @apiSuccessExample {json} Success-Response:
*    "@iot.id";"@iot.selfLink";"description";"name";"properties";"Datastreams@iot.navigationLink";"HistoricalLocation@iot.navigationLink";"Locations@iot.navigationLink"
*    "10";"http://sensorthings.geosas.fr/v1.0/Things(10)";"A SensorWeb thing Number ten";"SensorWebThing 10";"{""owner"":""Mozilla version one"",""organization"":""Mozilla""}";"proxy/v1.0/Things(10)/Datastreams";"proxy/v1.0/Things(10)/HistoricalLocation";"proxy/v1.0/Things(10)/Locations"
*    @apiErrorExample {json} Error-Response:
*    ""
*/
