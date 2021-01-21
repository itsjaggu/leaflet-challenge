// End point api url
var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Getting data from api
d3.json(earthquakeDataUrl, function(data) {
    // Passing api response data to createFeatures function
    console.log(data);
    createFeatures(data.features);
});

// Function to loop through each feature and creating markers for earthquake
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place
        + "</h3>Magnitude: <strong>" + feature.properties.mag + "</strong><br>Depth: <strong>" 
        + feature.geometry.coordinates[2] + "</strong><hr><p>" 
        + new Date(feature.properties.time) + "</p>");
    }
  
    // Creating GeoJSON layer containing the features array on the earthquakeData
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 1.0,
                weight: 1,
                color: "black"
            });
        },
        onEachFeature: onEachFeature
    });
    console.log(earthquakes);
    // Calling createMap function to load markers
    createMap(earthquakes);
  }

// Function to create the Map with Earthquake Data
function createMap(earthquakes) {
    // Defining streetmap and darkmap layers, so user can toggle between dark or street map.
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Defining a baseMaps object to hold base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Creating overlay object to hold earthquake data
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Creating map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Creating a layer control to toggle between baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Adding legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = [],
        mag_categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        mag_categories_color = [0, 20, 40, 60, 80, 100]

        for (var i = 0; i < mag_categories.length; i++) {
                div.innerHTML += 
                labels.push(
                    '<l style="background-color:' + getColor(mag_categories_color[i]) + '"></l> ' +
                (mag_categories[i] ? mag_categories[i] : '+'));
            }
            div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
}

// Function to get color for marker based on depth of Earthquake
function getColor(geoDepth) {
    return  geoDepth > 90  ? '#FF0000' :
            geoDepth > 70  ? '#FF9E00' :
            geoDepth > 50  ? '#FFD300' :
            geoDepth > 30  ? '#FFF600' :
            geoDepth > 10  ? '#E5FF00' :
                             '#00FF00' ;
}