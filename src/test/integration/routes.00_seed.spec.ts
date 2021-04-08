process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const should = chai.should();

import { server } from "../../server/index";

const number = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "onze", "douze", "treize", "quatorze", "quinze"];

describe("Add for tests.", () => {
    it("Create Database", async (done) => {
        chai.request(server)
            .post("/v1.0/createDB")
            .send({
                host: process.env.PGHOST,
                user: process.env.PGUSER,
                password: process.env.PGPASSWORD,
                database: "test"
            })
            .end((err: any, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                done();
            });
    });

    // FeaturesOfInterest
    for (let i = 1; i < 6; i++) {
        it("Add FeaturesOfInterest for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/FeaturesOfInterest")
                .send({
                    description: `This is the weather station Number ${number[i]}`,
                    name: `Weather Station ${i}`,
                    encodingType: "application/vnd.geo+json",
                    feature: {
                        type: "Point",
                        coordinates: [
                            `-${Number(Math.floor(Math.random() * Math.floor(200)) + 1)}.06`,
                            `${Number(Math.floor(Math.random() * Math.floor(50)) + 1)}.05`
                        ]
                    }
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // Sensor
    for (let i = 1; i < 6; i++) {
        it("Add Sensor for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/Sensors")
                .send({
                    description: `PM sensor Number ${number[i]}`,
                    name: `PM ${i} sensor`,
                    encodingType: "application/pdf",
                    metadata: "http://particle-sensor.com/"
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    console.log(res.body);

                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // Thing
    for (let i = 1; i < 11; i++) {
        it("Add Thing for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/Things")
                .send(
                    i < 6
                        ? {
                              description: `A SensorWeb thing Number ${number[i]}`,
                              name: `SensorWebThing ${i}`,
                              properties: {
                                  owner: `Mozilla version ${number[Number(Math.floor(Math.random() * Math.floor(9)))]}`,
                                  organization: "Mozilla"
                              }
                          }
                        : {
                              description: `A SensorWeb thing Number ${number[i]}`,
                              name: `SensorWebThing ${i}`,
                              properties: {
                                  owner: `Mozilla version ${number[Number(Math.floor(Math.random() * Math.floor(9)))]}`,
                                  organization: "Mozilla"
                              },
                              Locations: [
                                  {
                                      name: `UofC (Created new location) Number ${number[i]}`,
                                      description: "University of Calgary, CCIT building",
                                      encodingType: "application/vnd.geo+json",
                                      location: {
                                          type: "Point",
                                          coordinates: [
                                              `-${Number(Math.floor(Math.random() * Math.floor(200)) + 1)}.06`,
                                              `${Number(Math.floor(Math.random() * Math.floor(50)) + 1)}.05`
                                          ]
                                      },
                                      gen_fo_id: Number(Math.floor(Math.random() * Math.floor(4)) + 1)
                                  }
                              ]
                          }
                )
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // ObservedProperties
    for (let i = 1; i < 11; i++) {
        it("Add ObservedProperties for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/ObservedProperties")
                .send({
                    description: `PM something Number ${number[i]}`,
                    name: `PM ${i} observedProperties`,
                    definition: "https://airnow.gov/index.cfm?action=aqibasics.particle"
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // Datastream
    for (let i = 1; i < 11; i++) {
        it("Add Datastream for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/Datastreams")
                .send({
                    unitOfMeasurement: {
                        symbol: "μg/m³",
                        name: "PM 2.5 Particulates (ug/m3)",
                        definition: "http://unitsofmeasure.org/ucum.html"
                    },
                    observationType: "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    description: `Air quality Number ${number[i]}`,
                    name: `air_quality_readings${i}`,
                    thing_id: i < 8 ? Number(Math.floor(Math.random() * Math.floor(5)) + 1) : 6,
                    observedproperty_id: i < 8 ? Number(Math.floor(Math.random() * Math.floor(4)) + 1) : 8,
                    sensor_id: i < 8 ? Number(Math.floor(Math.random() * Math.floor(4)) + 1) : 5
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // Observation
    for (let i = 1; i < 11; i++) {
        it("Add Observation for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/Observations")
                .send({
                    phenomenonTime: `2016-11-18T0${Number(Math.floor(Math.random() * Math.floor(8)) + 1)}:15:15.790Z`,
                    resultTime: `2016-11-18T1${Number(Math.floor(Math.random() * Math.floor(8)) + 1)}:30:30.790Z`,
                    result: i < 8 ? 35 / Number(Math.floor(Math.random() * Math.floor(4)) + 1) : 45,
                    datastream_id: i < 8 ? Number(Math.floor(Math.random() * Math.floor(4)) + 1) : 10,
                    featureofinterest_id: Number(Math.floor(Math.random() * Math.floor(4)) + 1)
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // Location
    for (let i = 6; i < 11; i++) {
        it("Add Location for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/Locations")
                .send({
                    name: `My Location ${i}`,
                    description: `This is the Location Number ${number[i]}`,
                    encodingType: "application/vnd.geo+json",
                    location: {
                        type: "Point",
                        coordinates: [
                            `-${Number(Math.floor(Math.random() * Math.floor(200)) + 1)}.06`,
                            `${Number(Math.floor(Math.random() * Math.floor(50)) + 1)}.05`
                        ]
                    },
                    gen_fo_id: Number(Math.floor(Math.random() * Math.floor(4)) + 1),
                    Things: [{ "@iot.id": "5" }]
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }

    // HistoricalLocations
    for (let i = 1; i < 11; i++) {
        it("Add HistoricalLocations for tests.", (done) => {
            chai.request(server)
                .post("/v1.0/HistoricalLocations")
                .send({
                    time: `2014-12-${Number(Math.floor(Math.random() * Math.floor(2)) + 1)}1T1${Number(
                        Math.floor(Math.random() * Math.floor(8)) + 1
                    )}:59:59.00+08:00`,
                    thing_id: Number(Math.floor(Math.random() * Math.floor(9)) + 1)
                })
                .end((err: any, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    done();
                });
        });
    }
});
