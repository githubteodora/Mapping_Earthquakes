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

// Create the earthquake overlay layer for our map.
// overlays are anything that you want to add to the map, which are "laid over" all the base layers and are visible all the time.
let earthquakes = new L.layerGroup();

// define the overlay object to add it to the map.
// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
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
// To add the overlay to the map, add the variable overlays to the Layers Control object.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
        function styleInfo(feature) {
          return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
              };
            }

            // This function determines the color of the circle based on the magnitude of the earthquake.
            function getColor(magnitude) {
              if (magnitude > 5) {
                return "#ea2c2c";
              }
              if (magnitude > 4) {
                return "#ea822c";
              }
              if (magnitude > 3) {
                return "#ee9c00";
              }
              if (magnitude > 2) {
                return "#eecc00";
              }
              if (magnitude > 1) {
                return "#d4ee00";
              }
              return "#98ee00";
            }
                  // This function determines the radius of the earthquake marker based on its magnitude.
                  // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
                  function getRadius(magnitude) {
                  if (magnitude === 0) {
                  return 1;
                  }
                  return magnitude * 4;
                  }
       
// Creating a GeoJSON layer with the retrieved data.
// change the basic marker to a circleMarker by using the pointToLayer function.
  L.geoJson(data, {
  // We turn each feature into a circleMarker on the map.
  pointToLayer: function(feature, latlng) {
    console.log(data);
    return L.circleMarker(latlng);
   },
   style: styleInfo,  // --> this is where yje styleInfo functions are put into action
    // create a popup for each circleMarker to display the magnitude and location of the earthquake
    //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    } 
  }).addTo(earthquakes); // we had to replace map with earthquakes, so that the user can decide whether to show earthquakes data using the overlay button

  // we now need to add the earthquakes layer to the map
  earthquakes.addTo(map);
});

// To change the map's style, change the map id using the list of Mapbox ids below:

// mapbox/streets-v11
// mapbox/outdoors-v11
//mapbox/light-v10
//mapbox/dark-v10
//mapbox/satellite-v9
//mapbox/satellite-streets-v11