// API Link to Earthquakes - GeoJSON
var source = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Colors for marker
function markerColor (mag) {
    if (mag <= 1) {
        return "green";
    }
    else if (mag <= 2) {
        return "lime";
    }
    else if (mag <= 3) {
        return "gold";
    }
    else if (mag <= 4) {
        return "orange";
    }
    else if (mag <= 5) {
        return "darkorange";
    }
    else {
        return "red";
    }
}

// Change marker size
function changeSize (mag) {
    return mag*25000
}

function createMap(earthquakes) {
  
    // Define satelitemap and darkmap layers
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: //insert your API 
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: //insert your API 
    });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: //insert your API 
    });
  
    // BaseMaps object to hold our base layers
    var baseMaps = {
      "Satellite Map": satellitemap,
      "Dark Map": darkmap,
      "Light Map": lightmap
    };
  
    // Overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map w/ satelitemap and earthquakes layers
    var myMap = L.map("map", {
      center: [31.57853542647338,-99.580078125],
      zoom: 3,
      layers: [satellitemap, earthquakes]
    });
  
    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
  
  }
  

function markerInfo(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: changeSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Request query
d3.json(source, function(data) {
    markerInfo(data.features);
  });