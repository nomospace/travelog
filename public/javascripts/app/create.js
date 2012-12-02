$(function() {
  'use strict';
  var map = new GMaps({
    div: '#J_map',
    lat: 31.225394428808663,
    lng: 121.47675279999999
  });
  GMaps.geolocate({
    success: function(position) {
      map.setCenter(position.coords.latitude, position.coords.longitude);
    },
    error: function(error) {
      alert('Geolocation failed: ' + error.message);
    },
    not_supported: function() {
      alert('Your browser does not support geolocation');
    },
    always: function() {
//      alert('Done!');
    }
  });
//  map.drawRoute({
//    origin: [39.984756, 116.314095],
//    destination: [39.984756, 116.314095],
//    travelMode: 'driving',
//    strokeColor: '#131540',
//    strokeOpacity: 0.6,
//    strokeWeight: 6
//  });
});
