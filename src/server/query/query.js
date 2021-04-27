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

var wait = function (on) {
  spinner.style.display = on == true ? "inline-block" : "none";
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
  history.replaceState({}, null, "/Query");
  wait(false);
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
};









init();

submit.onclick = () => {
  wait(true);
  document.getElementById("import").submit(); 
};

go.onclick = async (e) => {
  e.preventDefault();
  wait(true);

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
  
var notify =  function (titleMess, bodyMess) {
  titre.innerHTML = titleMess;
  corps.innerHTML = bodyMess;
  message.click();
};

preview.addEventListener("click", function () {
  try {
    const value = datas.value;
    jsonObj = JSON.parse(value);
  }
  catch (err) {
      notify("Error", err.message);
  }
  jsonViewer.showJSON(jsonObj);
});


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
    createSelect(subentity, relations[entity.value], relations[tempentity].includes(paramsubentity) ? paramsubentity : "none", true);

});

fileone.addEventListener( "change", ( e ) => 	{
  var fileName = "";
  try {
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
  } catch (err) {
      notify("Error", err.message);
  }
  goOrSubmit();
});



const SplitterBar = function(container, leftContent, rightContent) {
    // We want two divs that we're dividing
    const leftSide = document.createElement("div");
    const rightSide = document.createElement("div");
    const splitter = document.createElement("div");

    leftSide.classList.add("leftSide");
    rightSide.classList.add("rightSide");
    splitter.classList.add("splitter");

    if (leftContent !== null) {
        leftSide.appendChild(leftContent);
    }

    if (rightContent !== null) {
        rightSide.appendChild(rightContent);
    }

    
    container.appendChild(splitter);
    
    splitter.style.width = "10px";
    // splitter.style.left = splitter.parentElement.offsetWidth / 2 - (splitter.offsetWidth / 2) + 'px';
    splitter.style.left = "25%";
    splitter.style.transform = "translateX(-25%)";
    // leftSide.style.background = 'red';
    // rightSide.style.background = 'blue';
    splitter.style.background = "black";
    

    leftSide.style.left = 0;
    leftSide.style.top = 0;
    // leftSide.style.width = splitter.style.left;
    leftSide.style.width = splitter.offsetLeft - splitter.offsetWidth / 2 + "px";

    console.log("splitter offset left plus width is ", splitter.offsetLeft + splitter.offsetWidth);
  

    rightSide.style.left = (splitter.offsetLeft + splitter.offsetWidth / 2) + "px";
    rightSide.style.top = 0;
    rightSide.style.width = container.offsetWidth - splitter.offsetLeft - 10 +  "px";
    
    container.appendChild(leftSide);
    container.appendChild(rightSide);
    console.log("left of right pane is ", rightSide.offsetLeft);
    let mouseIsDown = false;
    let startX = null;
    let globalXCoordinate = null;

    // Will not touch
    splitter.addEventListener("mousedown", function(evt) {
        evt.preventDefault();
        mouseIsDown = true;
        startX = evt.offsetX;
        startY = evt.offsetY;
    });

    leftSide.addEventListener("mousemove", function(evt) {
        evt.preventDefault();
        let left = this.offsetLeft;
        globalXCoordinate = left + evt.offsetX - startX;
    });

    rightSide.addEventListener("mousemove", function(evt) {
        evt.preventDefault();
        let left = this.offsetLeft;
        globalXCoordinate = left + evt.offsetX - startX;
    });

    splitter.addEventListener("mousemove", function(evt) {
        evt.preventDefault();
        let left = this.offsetLeft;
        globalXCoordinate = left + evt.offsetX - startX;
    });


    document.body.addEventListener("mouseup", function(evt) {
        mouseIsDown = false;
    });

    document.addEventListener("mouseup", function(evt) {
        mouseIsDown = false;
    });


    document.addEventListener("mousemove", function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        let containerWidth = container.getBoundingClientRect().width;
        let hoveringOnDocument = evt.target.nodeName == "HTML" || evt.target.nodeName == "BODY";
        let docX = evt.offsetX - container.getBoundingClientRect().x - startX;
        if (mouseIsDown) {


            console.log(splitter.offsetWidth);
            // When dragging what do we need to do to take care of inner splitter areas?

            if (hoveringOnDocument) {
                if (docX < 0) {
                    docX = 0;
                }
                    
                if (docX + splitter.offsetWidth > container.offsetWidth) {
                    docX = containerWidth - splitter.offsetWidth;
                }
                
                splitter.style.left = docX + "px";
                leftSide.style.width = splitter.offsetLeft - splitter.offsetWidth / 2 + "px";
                rightSide.style.width = (container.offsetWidth - leftSide.offsetWidth - splitter.offsetWidth) + "px";
                rightSide.style.left = splitter.offsetLeft + (splitter.offsetWidth / 2) + "px";
            } else {
                if (globalXCoordinate + splitter.offsetWidth > containerWidth) {
                    globalXCoordinate = containerWidth - splitter.offsetWidth;
                }

                if (globalXCoordinate < 0) {
                    globalXCoordinate = 0;
                }

                splitter.style.left = globalXCoordinate + "px";
                leftSide.style.width = splitter.offsetLeft - splitter.offsetWidth / 2 + "px";
                rightSide.style.width = (container.offsetWidth - leftSide.offsetWidth - splitter.offsetWidth) + "px";
                
                
                rightSide.style.left = splitter.offsetLeft + splitter.offsetWidth / 2 + "px";
            }
        }
    });
};

const splitterBar = new SplitterBar(container, first, two);

