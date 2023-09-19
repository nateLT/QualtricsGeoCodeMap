import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { useGeographic } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import $ from "jquery";

require("./v7.5.1_ol.css");
require("./main.css");
useGeographic();

let map;
let view;

let vectorSource = new VectorSource({
  features: [],
});

let vectorLayer = new VectorLayer({
  source: vectorSource,
});

export function createMap(name) {
  view = new View({
    center: [-111.70983337454919, 40.241187696127625],
    zoom: 12,
  });

  map = new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    target: name,
    view: view,
  });
}

export function geocodeZoomTo(address) {
  vectorSource.clear();
  var returnxx = -1;
  var returnyy = -1;
  var element = document.getElementById("confirmtxt");

  var geocode_url =
    "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=" +
    address +
    "&category=&outFields=*&forStorage=false&f=pjson";

  $.ajaxSetup({async: false});
  $.ajax({
    url: geocode_url,
    success: function (result1) {
      var result = JSON.parse(result1);
      console.log(result);
      if (
        result.candidates.length === 0 ||
        result.candidates[0].attributes.Region !== "Utah" // remove this or change this to only allow for a certain area.
      ) {
        element.textContent = "Could not geocode address."
      } else {
        var addscore = result.candidates[0].attributes.Score;
        result = result.candidates[0];

        var xx = result.location.x;
        var yy = result.location.y;

        xx = xx.toFixed(8);
        yy = yy.toFixed(8);

        var pointFeature = new Feature({
          geometry: new Point([xx, yy]), 
        });

        var pointStyle = new Style({
          image: new Circle({
            radius: 8, 
            fill: new Fill({
              color: "red", 
            }),
            stroke: new Stroke({
              color: "white", 
              width: 1.5, 
            }),
          }),
        });

        pointFeature.setStyle(pointStyle);

        vectorSource.addFeature(pointFeature);

        view.setCenter([xx, yy]); 
        view.setZoom(17);

        element.textContent = "Geocoded address with accuracy of " + addscore + ".";
       
        returnxx = xx;
        returnyy = yy;
      }
    }
  });

  return [returnxx, returnyy];
 
}

export function addDivs(parentdiv) {

  var mainDiv = document.getElementById(parentdiv);
  var parDiv = document.createElement("div");
  parDiv.id = "content";
  parDiv.className = "center";
  mainDiv.appendChild(parDiv);

  var parentDiv = document.getElementById("content");
  var mapDiv = document.createElement("div");
  mapDiv.id = "map";
  mapDiv.className = "map";
  parentDiv.appendChild(mapDiv);

  var buttonDiv = document.createElement("div");
  buttonDiv.id = "enterbtn";
  buttonDiv.className = "button";
  buttonDiv.textContent = "Confirm Address";
  parentDiv.appendChild(buttonDiv);

  var confirmDiv = document.createElement("div");
  confirmDiv.id = "confirmtxt";
  confirmDiv.className = "confirmtxt";
  parentDiv.appendChild(confirmDiv);

}
