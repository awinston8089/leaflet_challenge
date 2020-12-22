
//  Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

// Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. 
// Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.






//Define Tile layers
// Streetmap Layer
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

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var myMap = L.map("mapid", {
    center: [
        37.6, 14.0
    ],
    zoom: 2.9
});

//add satellitemap tile layer to map
satellitemap.addTo(myMap);

//create layers for each dataset(earthquakes and tectonicplate
var earthquakes = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();

//define basemaps object to hold tile layers
var baseMaps = {
    "Street Map": streetmap,
    // "Gray Map":  graymap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
};

//define overlay maps object to hold layers for each data set
var overlayMaps = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes

};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
console.log("control layers add to map")

var UrltectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(UrltectonicPlates, function (plateData) {
    //add geoJSON data and style information to tectonicplates layer
    L.geoJson(plateData, {
        color: "orange",
        weight: 3
    })
        .addTo(tectonicplates);

    //add tectonicplates layer to myMap (as a default)
    tectonicplates.addTo(myMap);
    console.log("tectonic places added to map");
});

//define variable UrlEarthquake
var UrlEarthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
console.log(`URL for Earthquake date from USGS: ${UrlEarthquake}`);

d3.json(UrlEarthquake, function (data) {
    function styleInformation(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.6,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "white",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5

        };
    }


    //create function to get circle radius
    //note assign value of 1 for maginiude 0 to ensure all earthquakes are plotted

    function getRadius(magnitude) {
        // if (magnitude === 0) {
        //     return 1;
        // }
        return magnitude * 3.5; //just a scaling factor - adjust as needed
    }

    //create function to get circle color ...see colorbrewer2.org website for ideas on colors
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#d73027";
            case depth > 70:
                return "#fc8d59";
            case depth > 50:
                return "#fee090";
            case depth > 30:
                return "#e0f3f8";
            case depth > 10:
                return "#91bfdb";
            default:
                return "#4575b4"
        }
    }
    // //add geoJSON layer to map to see https://leaflet.js.com/examples/geojson
    L.geoJson(data, {
        //create circlemarkers
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleInformation,

        //     //create a popup for each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Location:"
                + feature.properties.place
            );
        }

    })


        .addTo(earthquakes);

    earthquakes.addTo(myMap);

    // // //Create the Legend control object
    var Legend_depth = L.control({
        position: "bottomright"
    });

    Legend_depth.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 10, 30, 50, 70, 90];
        var colors = [
            "#4575b4",
            "#91bfdb",
            "#e0f3f8",
            "#fee090",
            "#fc8d59",
            "#d73027"
        ];



        // generate a label for each color
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += [
                "Depth: ",
                "<i style='background: " + colors[i] + "'></i> "
                + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + " km" + "<br>" : "+" + " km")];
        }
        return div;
    };
    Legend_depth.addTo(myMap);


});