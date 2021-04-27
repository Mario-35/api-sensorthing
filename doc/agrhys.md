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

### 2. Ajout des observations.

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

#### Response

```json
{
    "@iot.id": 1,
    "@iot.selfLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)",
    "Datastream@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/Datastream",
    "FeatureOfInterest@iot.navigationLink": "http://sensorthings.geosas.fr/v1.0/Observations(1)/FeaturesOfInterest(2)",
    "phenomenonTime": "1993-02-01T00:50:00Z",
    "resultTime": "1993-02-01T00:50:00Z",
    "result": 0.152,
    "parameters": null
}
```

## CSV Insert.

you can add csv file.
