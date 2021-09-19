// will contain all the JavaScript and Leaflet code to create the map and add data to the map.

// Add console.log to check to see if our code is working.
console.log("working");

// Next, we'll add the map object, as shown on the Leaflet Quick Start Guide page with some slight modifications. 
// We'll change the geographical center of the map to the approximate geographical center of the United States.
// Create the map object with a center and zoom level.
// let map = L.map('mapid').setView([37.6213, -122.3790], 5);  // use ([44.58, -103.46], 4) to move the center to the USA

// Create the map object with a center and zoom level.
// let map = L.map("mapid", {
//    center: [
//      40.7, -94.5
//    ],
//    zoom: 4
//  });

// We're assigning the variable map to the object L.map(), and we'll instantiate the object with the given string 'mapid'.
// The mapid will reference the id tag in our <div> element on the index.html file.
// The setView() method sets the view of the map with a geographical center, where the first coordinate is latitude (40.7) and the second is longitude (-94.5). We set the zoom level of "4" on a scale 0–18.

// Add a Tile Layer for Our Map
// We create the tile layer that will be the background of our map.
// We assign the tileLayer() method, as shown in the Quick Start Guide's "Setting up the map" section to the variable streets. Leaflet doesn't provide a tile layer. Instead, it offers various tile layer APIs.

// let marker = L.circleMarker([34.0522, -118.2437], {
//    radius: 100,
//    color: "black",
//    fillColor: 'ffffa1'
// }).addTo(map); //  Add a marker to the map for Los Angeles, California.

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {  //The API URL with a reference to the accessToken
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // The OpenStreetMap URL inside the curly braces of our tileLayer() method
    maxZoom: 18, // We add the maxZoom attribute and assign it a value of 18.
    accessToken: API_KEY //We add the accessToken attribute and assign it the value of our API_KEY.
});
// Then if needed, we add our map layer to the map.
// streets.addTo(map);


let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {  //The API URL with a reference to the accessToken
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // The OpenStreetMap URL inside the curly braces of our tileLayer() method
maxZoom: 18, // We add the maxZoom attribute and assign it a value of 18.
accessToken: API_KEY //We add the accessToken attribute and assign it the value of our API_KEY.
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});


// Create a base layer that holds both maps.
let baseMaps = {
    "Street": streets,
    "Satellite streets": satelliteStreets,  // we need the quotes because the label is made up of 2 words
    "Dark": dark
  };


//Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [
      39.5, -98.5
    ],
    zoom: 3,
    layers: [streets]
  });

// Pass our map layer into our layer control and add the layter control to the map
L.control.layers(baseMaps).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data).addTo(map);
});

// To change the map's style, change the map id using the list of Mapbox ids below:

// mapbox/streets-v11
// mapbox/outdoors-v11
//mapbox/light-v10
//mapbox/dark-v10
//mapbox/satellite-v9
//mapbox/satellite-streets-v11