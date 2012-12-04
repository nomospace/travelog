$(function() {
  'use strict';
  var $fromPosition = $('#J_from_position'),
    $toPosition = $('#J_to_position'),
    $generateRoute = $('#J_generate_route');

  var marker = {},
    currentPosition;

  var map = new GMaps({
    div: '#J_map',
    lat: 31.225394428808663,
    lng: 121.47675279999999
  });

  GMaps.geolocate({
    success: function(position) {
      currentPosition = position;
    },
    error: function(error) {
      alert('Geolocation failed: ' + error.message);
    },
    not_supported: function() {
      alert('Your browser does not support geolocation');
    },
    always: function() {
    }
  });

  function setCenter(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
  }

  function addMarker(type) {
    var coords = currentPosition.coords;
    marker[type] && map.removeMarker(marker[type]);
    marker[type] = map.addMarker({
      lat: coords.latitude,
      lng: coords.longitude,
      draggable: true,
      dragend: generateRoute
    });
    generateRoute();
    // BAD SMELL
    setCenter(currentPosition);
  }

  function drawRoute(from, to) {
    if (from && to) {
      map.cleanRoute();
      map.drawRoute({
        origin: [from.$a, from.ab],
        destination: [to.$a, to.ab],
        travelMode: 'walking',
        strokeColor: '#000',
        strokeOpacity: 0.6,
        strokeWeight: 6
      });
    }
  }

  function generateRoute() {
    var from = marker.from && marker.from.position,
      to = marker.to && marker.to.position;
    drawRoute(from, to);
  }

  $fromPosition.click(function() {
    addMarker('from');
  });
  $toPosition.click(function() {
    addMarker('to');
  });
  $generateRoute.click(generateRoute);
});
