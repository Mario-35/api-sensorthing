var jsonObj = {};
const APIVERSION = "v1.0";
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());

const array = ["@array@"];

// textarea value to JSON object
var setJSON = function () {
  
// const entity = document.getElementById("entity");
// if (entity != null)
//   for (let i = 0; i < array.length; i++) {
//       var option = document.createElement("option");
//       option.value = array[i];
//       option.text = array[i]; 
//       entity.appendChild(option);
//   }
};

// load default value
setJSON();


go.onclick = async (e) => {
  e.preventDefault();
  // const operation = document.getElementById("operation");
  const queryElem = document.getElementById("query");
  const nbElem = document.getElementById("nb");

  const nb = nbElem != null ? Number(nbElem.value) : 0;

  let url = document.URL.split("/Query")[0]+`/${APIVERSION}`;

  let query = (queryElem != null) ? queryElem.value : "";

  
  
  if (query != "" && query[0] != "?" ) {
    query = (array.includes(query)) ? "\\" + query : "?" + query;
  }

  if (nb > 0) {
    url = url + "/" + entity.value + "(" + nb + ")" + query;
  } else {
    url = url + "/" + entity.value + query;
  } 
    if (operation.value === "Get") {
    let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
    });

    try {
      var value = await response.text();
      jsonObj = JSON.parse(value);
      jsonViewer.showJSON(jsonObj);
    }
    catch (err) {
        window.location.href = "/error";
    }
  } else if (operation.value == "Post" || operation.value == "Patch") {
    const data = document.getElementById("input");
if (entity.value === "createDB") {
      const data = document.getElementById("input");
      let response = await fetch(document.URL.split("/Query")[0]+`${APIVERSION}/createDB`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data.value,
      });
      try {
        const value = await response.text();
        if (response.status == 401) {
          window.location.href = "/login";
        }
        jsonObj = JSON.parse(value);
        jsonViewer.showJSON(jsonObj);
      }
      catch (err) {
        // window.location.href = "/error";

fetch(document.URL.split("/Query")[0]+"/error", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data.value,
      });


      }
    } else {
      let response = await fetch(url, {
        method: operation.value.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
        },
        body: data.value,
      });
      try {
        const value = await response.text();
        if (response.status == 401) {
          // window.location.replace(value);
          window.location.href = "/login";
        }
        jsonObj = JSON.parse(value);
        jsonViewer.showJSON(jsonObj);
      }
      catch (err) {
        // window.location.href = "/error";
        fetch(document.URL.split("/Query")[0]+"/error", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data.value,
      });
      }
      // alert(err);
    }
  } else if (operation.value === "Delete" && nb && nb > 0) {
    let response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
    });

    try {
      var value = await response.text();
      jsonObj = JSON.parse(value);
      jsonViewer.showJSON(jsonObj);
    }

    catch (err) {
        window.location.href = "/error";
    }
  }
};
  

logout.onclick = () => {
  window.location.href = "/logout";
};

info.onclick = () => {
  window.location.href = "/status";
};

doc.onclick = () => {
  window.location.href = "http://sensorthings.geosas.fr/apidoc/";
};

git.onclick = () => {
  window.location.href = "https://github.com/Mario-35/api-sensorthing";
};

populate.onclick = () => {
  operation.value = "Post";
  entity.value = "Things";
  const data = document.getElementById("input");
  data.value = `{
    "description": "thing 1",
    "name": "thing name 1",
    "properties": {
        "reference": "first"
    },
    "Locations": [
        {
            "description": "location 1",
            "name": "location name 1",
            "location": {
                "type": "Point",
                "coordinates": [
                    -117.05,
                    51.05
                ]
            },
            "encodingType": "application/vnd.geo+json"
        }
    ],
    "Datastreams": [
        {
            "unitOfMeasurement": {
                "name": "Lumen",
                "symbol": "lm",
                "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen"
            },
            "description": "datastream 1",
            "name": "datastream name 1",
            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "ObservedProperty": {
                "name": "Luminous Flux",
                "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/LuminousFlux",
                "description": "observedProperty 1"
            },
            "Sensor": {
                "description": "sensor 1",
                "name": "sensor name 1",
                "encodingType": "application/pdf",
                "metadata": "Light flux sensor"
            },
            "Observations": [
                {
                    "phenomenonTime": "2015-03-03T00:00:00Z",
                    "result": 3
                },
                {
                    "phenomenonTime": "2015-03-04T00:00:00Z",
                    "result": 4
                }
            ]
        },
        {
            "unitOfMeasurement": {
                "name": "Centigrade",
                "symbol": "C",
                "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html/Lumen"
            },
            "description": "datastream 2",
            "name": "datastream name 2",
            "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
            "ObservedProperty": {
                "name": "Tempretaure",
                "definition": "http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html/Tempreture",
                "description": "observedProperty 2"
            },
            "Sensor": {
                "description": "sensor 2",
                "name": "sensor name 2",
                "encodingType": "application/pdf",
                "metadata": "Tempreture sensor"
            },
            "Observations": [
                {
                    "phenomenonTime": "2015-03-05T00:00:00Z",
                    "result": 5
                },
                {
                    "phenomenonTime": "2015-03-06T00:00:00Z",
                    "result": 6
                }
            ]
        }
    ]
}`;
};

  entity.addEventListener("change", () => {
    if (["CreateObservations", "createDB"].includes(entity.value)) {
      operation.value = "Post";
    }
  });