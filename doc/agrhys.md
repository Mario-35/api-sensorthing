# Le modèle de données de l'API SensorThings

Afin de comprendre l'API SensorThings, il est essentiel de comprendre le modèle de données sous-jacent. Ce modèle comprend les classes suivantes:

## Thing :

    Une chose du monde réel, dans ce contexte généralement la chose où se trouve le capteur. Il peut s'agir d'une station de surveillance ou simplement de la pièce où le capteur a été installé.

## Location :

    Emplacement de la chose. L'emplacement est fourni séparément de la chose car une chose peut se déplacer vers un emplacement différent.

## Datastreams :

    Un Datastream relie une chose à un capteur qui mesure une propriété observée pour fournir un point d'entrée pour une série chronologique. Toutes les observations créées par le capteur concernant la propriété observée sont liées à ce flux de données.

## Sensor :

    Description d'un capteur qui fournit des valeurs, y compris des informations sur la méthode de mesure. Bien que formellement conçu pour les capteurs dans le contexte de l'IoT, le capteur pourrait également être un observateur humain.

## ObservedProperties:

    Les ObservedProperties décrivent ce qui est mesuré par un capteur à un emplacement spécifique.

## Observations:

    Une seule valeur de mesure. Des informations sur la propriété observée qui a été mesurée avec quel type de capteur est fourni par le flux de données auquel cette observation est liée; l'objet sur lequel la mesure a été effectuée est fourni par le FeatureOfInterest de cette observation.

## FeaturesOfInterest :

    Le FeatureOfInterest est l'objet sur lequel la mesure a été effectuée.

![entitées](https://raw.githubusercontent.com/Mario-35/api-sensorthing/main/doc/assets/entite.jpg "entitées")

Un ajout a êté ajouté par rapport a la norme sensorthing est un feature of interest par defaut dans location, ceci permet d'utiliser ce feature of interest si observation ne l'indique pas.

pour cet example nous allons utiliser un exutoir situé à Kervidy et deux des sensors que sont la hauteur d'eau et la temperature.

Appliqué au modèle (pour la hauteur d'eau) ont pourrai :

Le modèle de données de l'API SensorThings.

Chaque chose (Thing) a un emplacement (location) (ou certains emplacements historiques historical_locations) dans l'espace et le temps.

Un ensemble d'observations (Observation) regroupées par la même propriété observée (ObservedProperty) et le même capteur (sensor) forment un flux de données (Datastream).

Une observation (Observation) est un événement effectué par un capteur (Sensor) qui produit une valeur d'une propriété observée (ObservedProperty) d'intérêt caractérisé (featureOfInterest).

### 1. Creation du Thing.

La creation de lu "Thing", de sa "location" et des 2 "datastreams" dans la meme requette, bien evidement on pourrait le faire les une à la suite des autres.

-   Questions :
    les properties de thing peuvent acrceuillir les informations relative a hydras ou une uri pointant sur une table propre a hydras ?

#### Request

[Post http://sensorthings.geosas.fr/v1.0/Things](http://sensorthings.geosas.fr/Query?method=Post&entity=Things&datas=%7B%0A%20%20%20%20%22description%22%3A%20%22Exutoir%20Kervidy%22%2C%0A%20%20%20%20%22name%22%3A%20%22Exutoir%20Kervidy%22%2C%0A%20%20%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22hydras%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22domaine%22%3A%20%22C_Naizin%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22region%22%3A%20%22C_Naizin__03%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22station%22%3A%20%22KERVIDY_C_EXU%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22capteur%22%3A%20%220102%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%22Locations%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22description%22%3A%20%22Kervidy%22%2C%0A%20%20%20%20%20%20%20%20%22name%22%3A%20%22Kervidy%22%2C%0A%20%20%20%20%20%20%20%20%22location%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-117.05%2C%2051.05%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%20%20%20%20%22FeatureOfInterest%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22Capteur%20Kervidy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22Niveau%20d'eau%20du%20capteur%20kervidy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22feature%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-114.133%2C%2051.08%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%22Datastreams%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22kervidy%20hauteur%20d'eau%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22Niveau%20d'eau%20de%20kervidy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22unitOfMeasurement%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22Hauteur%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22symbol%22%3A%20%22m%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22ObservedProperty%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22Niveau%20d'eau%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22valeur%20en%20m%C3%A8tre%20de%20la%20hauteur%20de%20l'eau%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sensor%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22Niveau%20du%20cours%20d'eau%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22sensor%20name%201%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fpdf%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22metadata%22%3A%20%22hauteur%20d'eau%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22kervidy%20temperature%20d'eau%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22temperature%20de%20kervidy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22unitOfMeasurement%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22temperature%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22symbol%22%3A%20%22C%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22ObservedProperty%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22temperature%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22temperature%20en%20centigrade%20de%20l'eau%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sensor%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22description%22%3A%20%22Temperature%20du%20cours%20d'eau%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22sensor%20name%201%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fpdf%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22metadata%22%3A%20%22temperature%20d'eau%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D)

```json
{
    "description": "Exutoir Kervidy",
    "name": "Exutoir Kervidy",
    "properties": {
        "hydras": {
            "domaine": "C_Naizin",
            "region": "C_Naizin__03",
            "station": "KERVIDY_C_EXU",
            "capteur": "0102"
        }
    },
    "Locations": {
        "description": "Kervidy",
        "name": "Kervidy",
        "location": {
            "type": "Point",
            "coordinates": [-117.05, 51.05]
        },
        "encodingType": "application/vnd.geo+json",
        "FeatureOfInterest": {
            "name": "Capteur Kervidy",
            "description": "Niveau d'eau du capteur kervidy",
            "encodingType": "application/vnd.geo+json",
            "feature": {
                "type": "Point",
                "coordinates": [-114.133, 51.08]
            }
        }
    },
    "Datastreams": [
        {
            "name": "kervidy hauteur d'eau",
            "description": "Niveau d'eau de kervidy",
            "unitOfMeasurement": {
                "name": "Hauteur",
                "symbol": "m"
            },
            "ObservedProperty": {
                "name": "Niveau d'eau",
                "description": "valeur en mètre de la hauteur de l'eau"
            },
            "Sensor": {
                "description": "Niveau du cours d'eau",
                "name": "sensor name 1",
                "encodingType": "application/pdf",
                "metadata": "hauteur d'eau"
            }
        },
        {
            "name": "kervidy temperature d'eau",
            "description": "temperature de kervidy",
            "unitOfMeasurement": {
                "name": "temperature",
                "symbol": "C"
            },
            "ObservedProperty": {
                "name": "temperature",
                "description": "temperature en centigrade de l'eau"
            },
            "Sensor": {
                "description": "Temperature du cours d'eau",
                "name": "sensor name 1",
                "encodingType": "application/pdf",
                "metadata": "temperature d'eau"
            }
        }
    ]
}
```

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(1)",
    "description": "Niveau du cours d'eau de Kervidy",
    "name": "Niveau d'eau kervidy",
    "properties": {
        "hydras": {
            "region": "C_Naizin__03",
            "capteur": "0102",
            "domaine": "C_Naizin",
            "station": "KERVIDY_C_EXU"
        }
    },
    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Datastreams",
    "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/HistoricalLocation",
    "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Locations"
}
```

            "Observations": [
                {
                    "phenomenonTime": "1993-02-01T00:00:00Z",
                    "result": 0.155,

                }
            ]

### 2. Ajoeut des observations.

#### Request

[Post http://sensorthings.geosas.fr/v1.0/Observations](http://sensorthings.geosas.fr/Query?method=Post&entity=Observations&datas=%7B%0A%20%20%20%20%22phenomenonTime%22%3A%20%221993-02-01T00%3A50%3A00Z%22%2C%0A%20%20%20%20%22resultTime%22%3A%20%221993-02-01T00%3A50%3A00Z%22%2C%0A%20%20%20%20%22result%22%3A%200.152%2C%0A%20%20%20%20%22Datastream%22%3A%20%7B%20%22%40iot.id%22%3A%201%20%7D%0A%7D)

```json
{
    "phenomenonTime": "1993-02-01T00:50:00Z",
    "resultTime": "1993-02-01T00:50:00Z",
    "result": 0.152,
    "Datastream": { "@iot.id": 1 }
}
```

ou

[Post http://sensorthings.geosas.fr/v1.0/Datastream(1)/Observations](http://sensorthings.geosas.fr/Query?method=Post&entity=Datastreams&id=1&options=Observations&datas=%7B%0A%20%20%20%20%22phenomenonTime%22%3A%20%221993-02-01T00%3A50%3A00Z%22%2C%0A%20%20%20%20%22resultTime%22%3A%20%221993-02-01T00%3A50%3A00Z%22%2C%0A%20%20%20%20%22result%22%3A%200.152%0A%7D)

```json
{
    "phenomenonTime": "1993-02-01T00:50:00Z",
    "resultTime": "1993-02-01T00:50:00Z",
    "result": 0.152
}
```

KERV_C_EXU;0102;02/02/1993;04:00:00;34002,16667;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;04:10:00;34002,17361;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;04:20:00;34002,18056;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;04:30:00;34002,18750;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;04:40:00;34002,19444;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;04:50:00;34002,20139;0,152;;"m"
KERV_C_EXU;0102;02/02/1993;05:00:00;34002,20833;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;05:10:00;34002,21528;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;05:20:00;34002,22222;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;05:30:00;34002,22917;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;05:40:00;34002,23611;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;05:50:00;34002,24306;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:00:00;34002,25000;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:10:00;34002,25694;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:20:00;34002,26389;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:30:00;34002,27083;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:40:00;34002,27778;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;06:50:00;34002,28472;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:00:00;34002,29167;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:10:00;34002,29861;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:20:00;34002,30556;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:30:00;34002,31250;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:40:00;34002,31944;0,151;;"m"
KERV_C_EXU;0102;02/02/1993;07:50:00;34002,32639;0,150;;"m"
KERV_C_EXU;0102;02/02/1993;08:00:00;34002,33333;0,150;;"m"
KERV_C_EXU;0102;02/02/1993;08:10:00;34002,34028;0,150;;"m"
KERV_C_EXU;0102;02/02/1993;08:20:00;34002,34722;0,150;;"m"
KERV_C_EXU;0102;02/02/1993;08:30:00;34002,35417;0,150;;"m"
KERV_C_EXU;0102;02/02/1993;08:40:00;34002,36111;0,150;;"m"

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
    "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
    "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeaturesOfInterest(2)",
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

[Post http://sensorthings.geosas.fr/v1.0/Datastreams](<http://sensorthings.geosas.fr/Query?method=Post&entity=Datastreams&datas=%7B%0A%20%20%22unitOfMeasurement%22%3A%20%7B%0A%20%20%20%20%22symbol%22%3A%20%22%CE%BCg%2Fm%C2%B3%22%2C%0A%20%20%20%20%22name%22%3A%20%22PM%202.5%20Particulates%20(ug%2Fm3)%22%2C%0A%20%20%20%20%22definition%22%3A%20%22http%3A%2F%2Funitsofmeasure.org%2Fucum.html%22%0A%20%20%7D%2C%0A%20%20%22observationType%22%3A%22http%3A%2F%2Fwww.opengis.net%2Fdef%2FobservationType%2FOGC-OM%2F2.0%2FOM_Measurement%22%2C%0A%20%20%22description%22%3A%20%22Air%20quality%20readings%22%2C%0A%20%20%22name%22%3A%20%22air_quality_readings%22%2C%0A%20%20%22Thing%22%3A%20%7B%0A%20%20%20%20%22description%22%3A%20%22A%20SensorWeb%20thing%22%2C%0A%20%20%20%20%22name%22%3A%22SensorWebThing%22%2C%0A%20%20%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%20%20%22organisation%22%3A%20%22Mozilla%22%2C%0A%20%20%20%20%20%20%22owner%22%3A%20%22Mozilla%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%22Locations%22%3A%20%5B%7B%0A%20%20%20%20%20%20%22description%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%20%20%22name%22%3A%20%22My%20backyard%22%2C%0A%20%20%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%20%20%22location%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B-117.123%2C%2054.123%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%5D%0A%20%20%7D%2C%0A%20%20%22ObservedProperty%22%3A%20%7B%0A%20%20%20%20%22name%22%3A%20%22PM%202.5%22%2C%0A%20%20%20%20%22description%22%3A%20%22Particle%20pollution%2C%20also%20called%20particulate%20matter%20or%20PM%2C%20is%20a%20mixture%20of%20solids%20and%20liquid%20droplets%20floating%20in%20the%20air.%22%2C%0A%20%20%20%20%22definition%22%3A%20%22https%3A%2F%2Fairnow.gov%2Findex.cfm%3Faction%3Daqibasics.particle%22%0A%20%20%7D%2C%0A%20%20%22Sensor%22%3A%20%7B%0A%20%20%20%20%22description%22%3A%20%22PM%202.5%20sensor%22%2C%0A%20%20%20%20%22name%22%3A%20%22PM25sensor%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fpdf%22%2C%0A%20%20%20%20%22metadata%22%3A%20%22http%3A%2F%2Fparticle-sensor.com%2F%22%0A%20%20%7D%0A%7D>)

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
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)",
    "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing",
    "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Sensor",
    "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/ObservedProperty",
    "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations",
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

[Post http://sensorthings.geosas.fr/v1.0/Observations](http://sensorthings.geosas.fr/Query?method=Post&entity=Observations&datas=%7B%0A%20%20%22phenomenonTime%22%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22resultTime%22%20%3A%20%222016-11-18T11%3A04%3A15.790Z%22%2C%0A%20%20%22result%22%20%3A%2012.4%2C%0A%20%20%22FeatureOfInterest%22%3A%20%7B%0A%20%20%20%20%22name%22%3A%20%22Weather%20Station%20YYC.%22%2C%0A%20%20%20%20%22description%22%3A%20%22This%20is%20a%20weather%20station%20located%20at%20the%20Calgary%20Airport.%22%2C%0A%20%20%20%20%22encodingType%22%3A%20%22application%2Fvnd.geo%2Bjson%22%2C%0A%20%20%20%20%22feature%22%3A%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20-114.06%2C%0A%20%20%20%20%20%20%20%2051.05%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%7D%0A%20%20%7D%2C%0A%20%20%22Datastream%22%3A%20%7B%20%22%40iot.id%22%3A%201%20%7D%0A%7D)

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
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
    "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
    "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest",
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

[Get http://sensorthings.geosas.fr/v1.0/Datastreams](http://sensorthings.geosas.fr/Query?method=GET&entity=Datastreams)

#### Response

```json
{
    "@iot.count": 1,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)",
            "Thing@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing",
            "Sensor@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Sensor",
            "ObservedProperty@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/ObservedProperty",
            "Observations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations",
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

[Get http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Thing](http://sensorthings.geosas.fr/Query?method=GET&entity=Datastreams&id=1&options=Thing)

#### Response

```json
{
    "@iot.id": "1",
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Things(1)",
    "Locations@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Locations",
    "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/HistoricalLocation",
    "Datastreams@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Things(1)/Datastreams",
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

[Get http://sensorthings.geosas.fr/v1.0/Things(1)/Locations](http://sensorthings.geosas.fr/Query?method=GET&entity=Things&id=1&options=Locations)

#### Response

```json
{
    "@iot.count": 1,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)",
            "Things@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/Things",
            "HistoricalLocation@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Locations(1)/HistoricalLocation",
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

[Get http://sensorthings.geosas.fr/v1.0/Datastreams(1)/Observations](http://sensorthings.geosas.fr/Query?method=GET&entity=Datastreams&id=1&options=Observations)

#### Response

```json
{
    "@iot.count": 2,
    "value": [
        {
            "@iot.id": "1",
            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
            "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
            "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeatureOfInterest",
            "phenomenonTime": "2016-11-18T11:04:15.790Z",
            "result": 12.4,
            "resultTime": "2016-11-18T11:04:15.790Z",
            "parameters": null
        },
        {
            "@iot.id": "2",
            "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)",
            "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/Datastream",
            "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(2)/FeatureOfInterest",
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
