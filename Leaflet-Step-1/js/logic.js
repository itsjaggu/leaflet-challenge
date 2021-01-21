var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquakeDataUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }


function createMap(earthquakes) {
  
    // Adding a tile layer (the background map image) to our map
    // Define variables for our tile layers
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var myMap = L.map("mapid", {
        center: [37.09, -119.42],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });


}