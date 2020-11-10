const initMap = () => {
  const accessToken = "pk.eyJ1IjoibHVjaWFub3JhYnUiLCJhIjoiY2tncGdudTFkMGEwZTJxdGQ1bjc2cGQzMyJ9.clTzJRrkDknTC8j4jLHcaA";
    mapboxgl.accessToken = accessToken; //Mapbox token

  const map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/lucianorabu/ckgph9z1z3ud919qle3qpxv2h", //stylesheet location
    center: [-3.2765753, 54.7023545], // starting position
    zoom: 1, // starting zoom
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken,
      mapboxgl,
    }), 'bottom-left'
  );
  
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');

  // Add geolocate control to the map.
   map.addControl(
      new mapboxgl.GeolocateControl({
         positionOptions: {
            enableHighAccuracy: true
         },
      trackUserLocation: true
      }), 'bottom-left'
   );

   // Add zoom and rotation controls to the map.
   map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

  return map;
}

const loadmap = (data, map) => {
  
  map.on("load", () => {
    
    map.addSource("locationPoints", {
      type: "geojson",
      data: data,
    });

    map.addLayer({
      id: "points",
      type: "circle",
      source: "locationPoints",
      paint: {
        "circle-radius": 30,
        "circle-opacity": 0,
      },
    });

    data.features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker';
    
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });

    // When a click event occurs on a feature in the csvData layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "points", (e) => {
      map.flyTo({
         center: e.features[0].geometry.coordinates
      });
      var coordinates = e.features[0].geometry.coordinates.slice();
      var htmlPopup = getPopup(e.features[0].properties) ;
      setTimeout(function(){
         //add Popup to map
         new mapboxgl.Popup()
           .setLngLat(coordinates)
           .setHTML(htmlPopup)
           .addTo(map);
      }, 100);
    });

    const line = turf.lineString(data.features.map(feature=> feature.geometry.coordinates));
    const bbox = turf.bbox(line);
    map.fitBounds(bbox, { padding: 50 });

  });
};

const getPopup = (properties) => {
  var htmlPopup = $('#location-popup-template').html();
  Object.keys(properties).forEach((key,index) => {
   if (properties[key] != '') {
      htmlPopup = htmlPopup.replaceAll("%%%"+key.toUpperCase()+"%%%", properties[key]);
   } else {
      htmlPopup = htmlPopup.replace("href=\"%%%"+key.toUpperCase()+"%%%\"","");
   }
  });
  return htmlPopup;
}

(($) => {
  $(document).ready(function () {
   // /wp-content/uploads/2020/11/locations.json
   // /locations.json
   $.getJSON("/locations.json", function(result){   
      loadmap(result, initMap());
   });
  });
})(jQuery);
