# SensorThings API usage

This repository contains the implementation of the SensorThings API.

## Example requests

The following requests are an example of the normal usage that a new sensor
station can make of this API to register itself and start sending its
observations.

The usual steps are:

1. Create a [Thing](#Thing).
1. Create a [Thing](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25).
1. Create a [Location](#Location).
1. Create a [Location](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#26) associated to the Thing.
1. Create a [ObservedProperty](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#30).
1. Create a [Sensor](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#29).
1. Create a [Datastream](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#28) associated to the Thing, the ObservedProperty and the Sensor.
1. Create a [FeatureOfInterest](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#32)
1. Create [Observations](http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#31) associated to the Datastream and FeatureOfInterest.

### 1. Create a <a name="Thing">Thing</a>.

#### Request

[Post http://localhost:8029/v1.0/Things](http://localhost:8029/Query?method=Post&entity=Things&datas=%7B%0A%20%20%20%20%22description%22%3A%20%22A%20SensorWeb%20thing%22%2C%0A%20%20%20%20%22name%22%3A%20%22SensorWebThing%22%2C%0A%20%20%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22organization%22%3A%20%22Mozilla%22%2C%0A%20%20%20%20%20%20%20%20%22owner%22%3A%20%22Mozilla%22%0A%20%20%20%20%7D%0A%7D%0A)

```json
{
    "description": "A SensorWeb thing",
    "name": "SensorWebThing",
    "properties": {
        "organization": "Mozilla",
        "owner": "Mozilla"
    }
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/Things(1)",
    "Locations@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/Locations",
    "HistoricalLocation@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/HistoricalLocation",
    "Datastreams@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/Datastreams",
    "description": "A SensorWeb thing",
    "name": "SensorWebThing",
    "properties": {
        "owner": "Mozilla",
        "organization": "Mozilla"
    }
}
```

### 2. Create a <a id="Location"></a>Location.

#### Request

[Post http://localhost:8029/v1.0/Location](http://localhost:8029/Query?method=Post&entity=Locations&datas=%7B%0A%20%20%20%20%22description%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%22name%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%22location%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-117.123%2C%2054.123%5D%0A%20%20%20%20%7D%0A%7D)

```json
{
    "description": "My backyard",
    "name": "My backyard",
    "encodingType": "application/vnd.geo+json",
    "location": {
        "type": "Point",
        "coordinates": [-117.123, 54.123]
    }
}
```

### 3. Create a Location associated to the Thing.

Note that we are using the `@iot.id` value returned as response to the previous create thing request in the URL to let the API know that we want to associate this Location
to the previously created Thing.

#### Request

[Post http://localhost:8029/v1.0/Things(1)/Location](http://localhost:8029/Query?method=Post&entity=Things&id=1&options=Locations&datas=%7B%0A%20%20%20%20%22description%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%22name%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%22location%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-117.123%2C%2054.123%5D%0A%20%20%20%20%7D%0A%7D)

```json
{
    "description": "My backyard",
    "name": "My backyard",
    "encodingType": "application/vnd.geo+json",
    "location": {
        "type": "Point",
        "coordinates": [-117.123, 54.123]
    }
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/Locations(1)",
    "Things@iot.navigationLink": "http://localhost:8029/v1.0/Locations(1)/Things",
    "HistoricalLocation@iot.navigationLink": "http://localhost:8029/v1.0/Locations(1)/HistoricalLocation",
    "description": "My backyard",
    "name": "My backyard",
    "encodingType": "application/vnd.geo+json",
    "location": {
        "type": "Point",
        "coordinates": [-117.123, 54.123]
    }
}
```

### 3. Create a ObservedProperty.

#### Request

[Post http://localhost:8029/v1.0/ObservedProperties](http://localhost:8029/Query?method=Post&entity=ObservedProperties&datas=%7B%0A%20%20%22name%22%3A%20%22PM%202.5%22%2C%0A%20%20%22description%22%3A%20%22Particle%20pollution%2C%20also%20called%20particulate%20matter%20or%20PM%2C%20is%20a%20mixture%20of%20solids%20and%20liquid%20droplets%20floating%20in%20the%20air.%22%2C%0A%20%20%22definition%22%3A%20%22https%3A%2F%2Fairnow.gov%2Findex.cfm%3Faction%3Daqibasics.particle%22%0A%7D)

```json
{
    "name": "PM 2.5",
    "description": "Particle pollution, also called particulate matter or PM, is a mixture of solids and liquid droplets floating in the air.",
    "definition": "https://airnow.gov/index.cfm?action=aqibasics.particle"
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/ObservedProperties(1)",
    "Datastreams@iot.navigationLink": "http://localhost:8029/v1.0/ObservedProperties(1)/Datastreams",
    "name": "PM 2.5",
    "description": "Particle pollution, also called particulate matter or PM, is a mixture of solids and liquid droplets floating in the air.",
    "definition": "https://airnow.gov/index.cfm?action=aqibasics.particle"
}
```

### 4. Create a Sensor.

#### Request

[Post http://localhost:8029/v1.0/Sensors](http://localhost:8029/Query?method=Post&entity=Sensors&datas=%7B%0A%09%22description%22%3A%20%22PM%202.5%20sensor%22%2C%0A%20%20%20%20%22name%22%3A%20%22PM25sensor%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fpdf%22%2C%0A%20%20%20%20%22metadata%22%3A%20%22http%3A%2F%2Fparticle-sensor.com%2F%22%0A%7D)

```json
{
    "description": "PM 2.5 sensor",
    "name": "PM25sensor",
    "encodingType": "application/pdf",
    "metadata": "http://particle-sensor.com/"
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/Sensors(1)",
    "Datastreams@iot.navigationLink": "http://localhost:8029/v1.0/Sensors(1)/Datastreams",
    "description": "PM 2.5 sensor",
    "name": "PM25sensor",
    "encodingType": "application/pdf",
    "metadata": "http://particle-sensor.com/"
}
```

### 5. Create a Datastream associated to the Thing, the ObservedProperty and the Sensor.

#### Request

Note that we used the `@iot.id` values from the recently created Thing, ObservedProperty
and Sensor to associate this Datastream to those entities.

[Post http://localhost:8029/v1.0/Datastreams](<http://localhost:8029/Query?method=Post&entity=Datastreams&datas=%7B%0A%22unitOfMeasurement%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22symbol%22%3A%20%22%CE%BCg%2Fm%C2%B3%22%2C%0A%20%20%20%20%20%20%20%20%22name%22%3A%20%22PM%202.5%20Particulates%20(ug%2Fm3)%22%2C%0A%20%20%20%20%20%20%20%20%22definition%22%3A%20%22http%3A%2F%2Funitsofmeasure.org%2Fucum.html%22%0A%20%20%20%20%7D%2C%0A%20%20%22observationType%22%3A%22http%3A%2F%2Fwww.opengis.net%2Fdef%2FobservationType%2FOGC-OM%2F2.0%2FOM_Measurement%22%2C%0A%20%20%22description%22%3A%20%22Air%20quality%20readings%22%2C%0A%20%20%22name%22%3A%20%22air_quality_readings%22%2C%0A%20%20%22Thing%22%3A%20%7B%22%40iot.id%22%3A%201%7D%2C%0A%20%20%22ObservedProperty%22%3A%20%7B%22%40iot.id%22%3A%201%7D%2C%0A%20%20%22Sensor%22%3A%20%7B%22%40iot.id%22%3A%201%7D%0A%7D>)

```json
{
    "unitOfMeasurement": {
        "symbol": "μg/m³",
        "name": "PM 2.5 Particulates (ug/m3)",
        "definition": "http://unitsofmeasure.org/ucum.html"
    },
    "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
    "description": "Air quality readings",
    "name": "air_quality_readings",
    "Thing": { "@iot.id": 1 },
    "ObservedProperty": { "@iot.id": 1 },
    "Sensor": { "@iot.id": 1 }
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/Datastreams(1)",
    "Thing@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Thing",
    "Sensor@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Sensor",
    "ObservedProperty@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/ObservedProperty",
    "Observations@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Observations",
    "unitOfMeasurement": {
        "name": "PM 2.5 Particulates (ug/m3)",
        "symbol": "μg/m³",
        "definition": "http://unitsofmeasure.org/ucum.html"
    },
    "description": "Air quality readings",
    "name": "air_quality_readings",
    "observedArea": null
}
```

### 6. Create a FeatureOfInterest.

#### Request

[Post http://localhost:8029/v1.0/FeaturesOfInterest](http://localhost:8029/Query?method=Post&entity=FeaturesOfInterest&datas=%7B%0A%20%20%22name%22%3A%20%22Weather%20Station%20YYC.%22%2C%0A%20%20%22description%22%3A%20%22This%20is%20a%20weather%20station%20located%20at%20the%20Calgary%20Airport.%22%2C%0A%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%22feature%22%3A%20%7B%0A%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20-114.06%2C%0A%20%20%20%20%20%2051.05%0A%20%20%20%20%5D%0A%20%20%7D%0A%7D)

```json
{
    "name": "Weather Station YYC.",
    "description": "This is a weather station located at the Calgary Airport.",
    "encodingType": "application/vnd.geo+json",
    "feature": {
        "type": "Point",
        "coordinates": [-114.06, 51.05]
    }
}
```

#### Response

```json
{
    "@iot.id": "2",
    "@iot.selfLink": "http://localhost:8029/v1.0/FeaturesOfInterest(1)",
    "Observations@iot.navigationLink": "http://localhost:8029/v1.0/FeaturesOfInterest(1)/Observations",
    "name": "Weather Station YYC.",
    "description": "This is a weather station located at the Calgary Airport.",
    "encodingType": "application/vnd.geo+json",
    "feature": {
        "type": "Point",
        "coordinates": [-114.06, 51.05]
    }
}
```

### 7. Create Observations associated to the Datastream and FeatureOfInterest.

#### Request

[Post http://localhost:8029/v1.0/Observations](http://localhost:8029/Query?method=Post&entity=Observations&datas=%7B%0A%20%20%22phenomenonTime%22%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22resultTime%22%20%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22result%22%20%3A%2012.4%2C%0A%20%20%22Datastream%22%3A%7B%22%40iot.id%22%3A%201%7D%2C%0A%20%20%22FeatureOfInterest%22%3A%7B%22%40iot.id%22%3A%202%7D%0A%7D)

```json
{
    "phenomenonTime": "2016-11-18T11:04:15.790Z",
    "resultTime": "2016-11-18T11:04:15.790Z",
    "result": 12.4,
    "Datastream": { "@iot.id": 1 },
    "FeatureOfInterest": { "@iot.id": 2 }
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://localhost:8029/v1.0/Observations(1)",
    "Datastream@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/Datastream",
    "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/FeaturesOfInterest(2)",
    "phenomenonTime": "2016-11-18T11:04:15.790Z",
    "resultTime": "2016-11-18T11:04:15.790Z",
    "result": 12.4,
    "parameters": null
}
```

## Deep Insert.

Alternatively, instead of creating five different requests, it is possible to
do all the work to create a Datastream associated to a Thing, a ObservedProperty
and a Sensor with all its details on a single request.

### Request to deep insert a Datastream

[Post http://localhost:8029/v1.0/Datastreams](<http://localhost:8029/Query?method=Post&entity=Datastreams&datas=%7B%0A%20%20%22unitOfMeasurement%22%3A%20%7B%0A%20%20%20%20%22symbol%22%3A%20%22%CE%BCg%2Fm%C2%B3%22%2C%0A%20%20%20%20%22name%22%3A%20%22PM%202.5%20Particulates%20(ug%2Fm3)%22%2C%0A%20%20%20%20%22definition%22%3A%20%22http%3A%2F%2Funitsofmeasure.org%2Fucum.html%22%0A%20%20%7D%2C%0A%20%20%22observationType%22%3A%22http%3A%2F%2Fwww.opengis.net%2Fdef%2FobservationType%2FOGC-OM%2F2.0%2FOM_Measurement%22%2C%0A%20%20%22description%22%3A%20%22Air%20quality%20readings%22%2C%0A%20%20%22name%22%3A%20%22air_quality_readings%22%2C%0A%20%20%22Thing%22%3A%20%7B%0A%20%20%20%20%22description%22%3A%20%22A%20SensorWeb%20thing%22%2C%0A%20%20%20%20%22name%22%3A%22SensorWebThing%22%2C%0A%20%20%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%20%20%22organisation%22%3A%20%22Mozilla%22%2C%0A%20%20%20%20%20%20%22owner%22%3A%20%22Mozilla%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%22Locations%22%3A%20%5B%7B%0A%20%20%20%20%20%20%22description%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%20%20%22name%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%20%20%22location%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-117.123%2C%2054.123%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%5D%0A%20%20%7D%2C%0A%20%20%22ObservedProperty%22%3A%20%7B%0A%20%20%20%20%22name%22%3A%20%22PM%202.5%22%2C%0A%20%20%20%20%22description%22%3A%20%22Particle%20pollution%2C%20also%20called%20particulate%20matter%20or%20PM%2C%20is%20a%20mixture%20of%20solids%20and%20liquid%20droplets%20floating%20in%20the%20air.%22%2C%0A%20%20%20%20%22definition%22%3A%20%22https%3A%2F%2Fairnow.gov%2Findex.cfm%3Faction%3Daqibasics.particle%22%0A%20%20%7D%2C%0A%20%20%22Sensor%22%3A%20%7B%0A%20%20%20%20%22description%22%3A%20%22PM%202.5%20sensor%22%2C%0A%20%20%20%20%22name%22%3A%20%22PM25sensor%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fpdf%22%2C%0A%20%20%20%20%22metadata%22%3A%20%22http%3A%2F%2Fparticle-sensor.com%2F%22%0A%20%20%7D%0A%7D>)

```json
{
    "unitOfMeasurement": {
        "symbol": "μg/m³",
        "name": "PM 2.5 Particulates (ug/m3)",
        "definition": "http://unitsofmeasure.org/ucum.html"
    },
    "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
    "description": "Air quality readings",
    "name": "air_quality_readings",
    "Thing": {
        "description": "A SensorWeb thing",
        "name": "SensorWebThing",
        "properties": {
            "organisation": "Mozilla",
            "owner": "Mozilla"
        },
        "Locations": [
            {
                "description": "My backyard",
                "name": "My backyard",
                "encodingType": "application/vnd.geo+json",
                "location": {
                    "type": "Point",
                    "coordinates": [-117.123, 54.123]
                }
            }
        ]
    },
    "ObservedProperty": {
        "name": "PM 2.5",
        "description": "Particle pollution, also called particulate matter or PM, is a mixture of solids and liquid droplets floating in the air.",
        "definition": "https://airnow.gov/index.cfm?action=aqibasics.particle"
    },
    "Sensor": {
        "description": "PM 2.5 sensor",
        "name": "PM25sensor",
        "encodingType": "application/pdf",
        "metadata": "http://particle-sensor.com/"
    }
}
```

### Response

```json
{
    "@iot.id": "1",
    "@iot.selfLink": "http://localhost:8029/v1.0/Datastreams(1)",
    "Thing@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Thing",
    "Sensor@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Sensor",
    "ObservedProperty@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/ObservedProperty",
    "Observations@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Observations",
    "unitOfMeasurement": {
        "name": "PM 2.5 Particulates (ug/m3)",
        "symbol": "μg/m³",
        "definition": "http://unitsofmeasure.org/ucum.html"
    },
    "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
    "description": "Air quality readings",
    "name": "air_quality_readings",
    "observedArea": null
}
```

Subsequent requests to add new Observations will look exactly like before. You
just need to specify the id of the Datastream where you want to push these observations.
In this case, if you want to push an Observation to the Datastream you just created
via deep insert, you can send this request:

[Post http://localhost:8029/v1.0/Observations](http://localhost:8029/Query?method=Post&entity=Observations&datas=%7B%0A%20%20%22phenomenonTime%22%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22resultTime%22%20%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22result%22%20%3A%2012.4%2C%0A%20%20%22FeatureOfInterest%22%3A%20%7B%0A%20%20%20%20%22name%22%3A%20%22Weather%20Station%20YYC.%22%2C%0A%20%20%20%20%22description%22%3A%20%22This%20is%20a%20weather%20station%20located%20at%20the%20Calgary%20Airport.%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%22feature%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20-114.06%2C%0A%20%20%20%20%20%20%20%2051.05%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%7D%0A%20%20%7D%2C%0A%20%20%22Datastream%22%3A%20%7B%20%22%40iot.id%22%3A%201%20%7D%0A%7D)

```json
{
    "phenomenonTime": "2016-11-18T11:04:15.790Z",
    "resultTime": "2016-11-18T11:04:15.790Z",
    "result": 12.4,
    "FeatureOfInterest": {
        "name": "Weather Station YYC.",
        "description": "This is a weather station located at the Calgary Airport.",
        "encodingType": "application/vnd.geo+json",
        "feature": {
            "type": "Point",
            "coordinates": [-114.06, 51.05]
        }
    },
    "Datastream": { "@iot.id": 1 }
}
```

Which should reply with something like:

```json
{
    "@iot.id": "1",
    "@iot.selfLink": "http://localhost:8029/v1.0/Observations(1)",
    "Datastream@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/Datastream",
    "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/FeatureOfInterest",
    "phenomenonTime": "2016-11-18T11:04:15.790Z",
    "resultTime": "2016-11-18T11:04:15.790Z",
    "result": 12.4,
    "parameters": null
}
```

## Querying the API

Until we have the query language ready, querying the API to get data is a bit
painful.

For example, let's say that you want to implement something similar to
[http://calgary-air.sensorup.com/](http://calgary-air.sensorup.com/).
Which:

-   Shows on a map a list of registered Things that have an
    active Datastream.
-   Changes how each of these Datastreams look like on the map based on its
    associated Observations
-   Shows details about each Observation result if the user clicks on the map.

In order to get enough data from the API to do that, you need to do the
following requests:

### Placing dots on a map Get.

First of all, you need to get the list of registered Datastreams. Without, the
query language, you'll get the entire list (sorry!).

#### Request

[Get http://localhost:8029/v1.0/Datastreams](http://localhost:8029/Query?method=GET&entity=Datastreams)

#### Response

```json
{
    "@iot.count": 1,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://localhost:8029/v1.0/Datastreams(1)",
            "Thing@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Thing",
            "Sensor@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Sensor",
            "ObservedProperty@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/ObservedProperty",
            "Observations@iot.navigationLink": "http://localhost:8029/v1.0/Datastreams(1)/Observations",
            "name": "air_quality_readings",
            "description": "Air quality readings",
            "unitOfMeasurement": {
                "name": "PM 2.5 Particulates (ug/m3)",
                "symbol": "μg/m³",
                "definition": "http://unitsofmeasure.org/ucum.html"
            },
            "observedArea": null,
            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement"
        }
    ]
}
```

In this case, the above response only shows one Datastream. For each Datastream
we care about two associations:

-   its Location, to be able to place a dot on the map.
-   its Observations, to be able to modify how this dot looks on the map and to
    show the list of results if the user clicks on it.

In order to get its Locations we first need to get the Datastream associated
Thing by following the `Thing@iot.navigationLink` navigation link.

#### Request

[Get http://localhost:8029/v1.0/Datastreams(1)/Thing](http://localhost:8029/Query?method=GET&entity=Datastreams&id=1&options=Thing)

#### Response

```json
{
    "@iot.id": "1",
    "@iot.selfLink": "http://localhost:8029/v1.0/Things(1)",
    "Locations@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/Locations",
    "HistoricalLocation@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/HistoricalLocation",
    "Datastreams@iot.navigationLink": "http://localhost:8029/v1.0/Things(1)/Datastreams",
    "name": "SensorWebThing",
    "description": "A SensorWeb thing",
    "properties": {
        "owner": "Mozilla",
        "organisation": "Mozilla"
    }
}
```

Once we have the Datastream associated Thing, we query its Locations.

#### Request

[Get http://localhost:8029/v1.0/Things(1)/Locations](http://localhost:8029/Query?method=GET&entity=Things&id=1&options=Locations)

#### Response

```json
{
    "@iot.count": 1,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://localhost:8029/v1.0/Locations(1)",
            "Things@iot.navigationLink": "http://localhost:8029/v1.0/Locations(1)/Things",
            "HistoricalLocation@iot.navigationLink": "http://localhost:8029/v1.0/Locations(1)/HistoricalLocation",
            "name": "My backyard",
            "description": "My backyard",
            "encodingType": "application/vnd.geo+json",
            "location": {
                "type": "Point",
                "coordinates": [-117.123, 54.123]
            }
        }
    ]
}
```

With this information we should be able to place a dot on a map at coordinates
`[-117.123, 54.123]`.

Now we need to know how this dot looks like. So we query the list of Observations
associated to the Datastream by following the `Observations@iot.navigationLink`
navigation link that we got in the first request.

#### Request

[Get http://localhost:8029/v1.0/Datastreams(1)/Observations](http://localhost:8029/Query?method=GET&entity=Datastreams&id=1&options=Observations)

#### Response

```json
{
    "@iot.count": 2,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://localhost:8029/v1.0/Observations(1)",
            "Datastream@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/Datastream",
            "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/v1.0/Observations(1)/FeatureOfInterest",
            "phenomenonTime": "2016-11-18T11:04:15.790Z",
            "result": 12.4,
            "resultTime": "2016-11-18T11:04:15.790Z",
            "parameters": null
        },
        {
            "@iot.id": "2",
            "@iot.selfLink": "http://localhost:8029/v1.0/Observations(2)",
            "Datastream@iot.navigationLink": "http://localhost:8029/v1.0/Observations(2)/Datastream",
            "FeatureOfInterest@iot.navigationLink": "http://localhost:8029/v1.0/Observations(2)/FeatureOfInterest",
            "phenomenonTime": "2016-11-18T11:04:15.790Z",
            "result": 14.4,
            "resultTime": "2016-11-18T11:04:15.790Z",
            "parameters": null
        }
    ]
}
```

These give us two observations. One with result `12.4` and the other one with
result `14.4`. With these two values, you can decide how you want your dot to
look like on the map. And you can list the observations registered for the
dot.
