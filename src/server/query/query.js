var jsonObj = {};
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());
listOperations = ["GET", "POST", "PATCH", "DELETE"]
,paramentity=""
,paramsubentity=""
,paramid=""
,parammethod=""
,paramuser=""
,paramoptions=""
,paramversion="";


const relations = "@relations@";
let importFile = false;
// DON'T REMOVE !!!!
// @start@

//Hide params url





var goOrSubmit =  function () {
  if (importFile == true) {
    go.style.display = "none";

    if (Number(nb.value) > 0) { 
      submit.style.display = "inline-block";
    } else {
      submit.style.display = "none";
    }
  } else {
    go.style.display = "inline-block";
    submit.style.display = "none";
  }
};

var createSelect =  function (obj, list, defValue, addNone) {
  obj.options.length = 0;
  if (list) {
    if (addNone) list.unshift("none");
    list.forEach((element) => {
      obj.add(new Option(element));
    });
  
    obj.selectedIndex = list.indexOf(defValue);
  }
};

var init =  function () {
  source.style.display = "none";
  source.value = "query";
  tempentity = Object.keys(relations).includes(paramentity) ? paramentity : "Things";
  createSelect(method, paramuser == "true" ? listOperations : ["GET"] ,paramuser == "true" ?  listOperations.includes(parammethod.toUpperCase()) ? parammethod.toUpperCase() : "GET" : "GET");
  createSelect(entity, Object.keys(relations), tempentity);
  createSelect(subentity, relations[entity.value], relations[tempentity].includes(paramsubentity) ? paramsubentity : "none", true);
  
  nb.value = paramid;
  options.value = paramoptions;
  options.value = options.value.replace(/\$/g, "&$");
  if (options.value[0] == "&") options.value = options.value.substring(1);
  goOrSubmit();
  logout.style.display = paramuser == "true" ? "inline-block" : "none";
  populate.style.display = paramuser == "true" ? "inline-block" : "none";
  fileone.style.display = paramuser == "true" ? "inline-block" : "none";
  fileonelabel.style.display = paramuser == "true" ? "inline-block" : "none";
  datas.style.display = paramuser == "true" ? "inline-block" : "none";
  history.replaceState({}, null, "/Query");
};

init();



go.onclick = async (e) => {
  e.preventDefault();

  const index = Number(nb.value);

  let url =  document.URL.split("/Query")[0];
  url =  `${url}${url[url.length -1 ] == "/" ? "" : "/"}${paramversion}`;

  let query = options.value;

  
  if (query != "" && query[0] != "?") {
    query = "?" + query;
  }

  if (index > 0) {
    url = url + "/" + entity.value + "(" + index + ")";
  } else {
    url = url + "/" + entity.value;
  }
  
  if (subentity.value != "none") {
    url = url + "/" + subentity.value + "/" + query;
  } else {
    url = url + query;
  }

  if (method.value === "GET") {
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
  } else if (method.value == "POST" || method.value == "PATCH") {
    if (entity.value === "createDB") {
          let response = await fetch(document.URL.split("/Query")[0]+`${paramversion}/createDB`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: datas.value,
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
            fetch(document.URL.split("/Query")[0]+"/error", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: datas.value,
            });
          }
    } else {
      let response = await fetch(url, {
        method: method.value,
        headers: {
            "Content-Type": "application/json",
        },
        body: datas.value,
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
        body: datas.value,
      });
      }
      // alert(err);
    }
  } else if (operation.value === "DELETE" && nb && nb > 0) {
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
  method.value = "POST";
  entity.value = "Things";
  datas.value = `{
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

  nb.addEventListener("change", () => {
      goOrSubmit();
  });

  entity.addEventListener("change", () => {
    subentity.options.length = 0;
    if (["CreateObservations", "createDB"].includes(entity.value)) 
      method.value = "POST";
    else 
      createSelect(subentity, items, paramsubentity, true);
  });

fileone.addEventListener( "change", ( e ) => 	{
  var fileName = "";

  if (this.files && this.files.length > 1 )
    fileName = ( this.getAttribute( "data-multiple-caption" ) || "" ).replace( "{count}", this.files.length );
  else
    fileName = e.target.value.split( "\\" ).pop();
  
  if( fileName ) {
    fileonelabel.querySelector( "span" ).innerHTML = fileName;
    method.value = "POST";
    entity.value = "Datastreams";
    subentity.value = "Observations";
    importFile = true;
  }
  else {
    fileonelabel.innerHTML = labelVal;
  }
  goOrSubmit();
});