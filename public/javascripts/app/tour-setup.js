$(function() {
  'use strict';
  var $doc = $(window),
    $body = $('body');
  $body.append($('#J_map_alert_tpl').html(), $('#J_invite_friends_tpl').html());

  var $fromPosition = $('#J_from_position'),
    $toPosition = $('#J_to_position'),
    $generateRoute = $('#J_generate_route'),
    $mapAlert = $('#J_map_alert'),
    $map = $('#J_map'),
    $inviteFriendsDialog = $('#J_invite_friends_dialog'),
    $inviteFriends = $('#J_invite_friends');

  var marker = {},
    currentPosition;

  var map = new GMaps({
    div: $map[0],
    lat: 31.225394428808663,
    lng: 121.47675279999999
  });

  map.setContextMenu({
    control: 'map',
    options: [
      {
        title: '设置起点',
        name: '设置起点',
        action: function(e) {
          addMarker('from', e.latLng.lat(), e.latLng.lng(), '起点');
        }
      },
      {
        title: '设置终点',
        name: '设置终点',
        action: function(e) {
          addMarker('to', e.latLng.lat(), e.latLng.lng(), '终点');
        }
      },
      {
        title: '在此居中',
        name: '在此居中',
        action: function(e) {
          setCenter(e.latLng);
        }
      }
    ]
  });

  function setCenter(position) {
    map.setCenter(position.lat(), position.lng());
  }

  function geolocate() {
    if (!currentPosition) {
      GMaps.geolocate({
        success: function(position) {
          map.setCenter(position.coords.latitude, position.coords.longitude);
          currentPosition = position;
        },
        error: function(error) {
          $mapAlert.find('p').text(error.message).end().reveal();
        },
        not_supported: function() {
          alert('Your browser does not support geolocation');
        },
        always: function() {
        }
      });
    }
  }

  var geocode = _.debounce(function(e) {
    if (e.keyCode == 13) {
      var $this = $(this);
      GMaps.geocode({
        address: $this.val(),
        callback: function(results, status) {
          if (status == 'OK') {
            // TODO add suggest module
//          enableAutoComplete($this, results);
            console.log(results);
            var address = results[0]['formatted_address'],
              position = results[0]['geometry'].location,
              lat = position.lat(), lng = position.lng();
            $this.val(address).attr('title', address);
            setCenter(position);
            addMarker($this.data('type'), lat, lng, $this.attr('title'));
          }
        }
      });
    }
  }, 500);

  function addMarker(type, latitude, longitude, title) {
    marker[type] && map.removeMarker(marker[type]);
    marker[type] = map.addMarker({
      lat: latitude,
      lng: longitude,
      title: title,
      animation: 'drop',
      draggable: true,
      dragend: generateRoute
    });
    generateRoute();
  }

  function drawRoute(from, to) {
    map.cleanRoute();
    map.drawRoute({
      origin: [from.lat(), from.lng()],
      destination: [to.lat(), to.lng()],
      travelMode: 'walking',
      strokeColor: '#000',
      strokeOpacity: 0.6,
      strokeWeight: 3
    });
  }

  function generateRoute() {
    var from = marker.from && marker.from.position,
      to = marker.to && marker.to.position;
    if (from && to) {
      drawRoute(from, to);
      map.fitZoom();
    }
  }

  function useCurrentPosition(type, title) {
    geolocate();
    if (currentPosition) {
      var coords = currentPosition.coords;
      addMarker(type, coords.latitude, coords.longitude, title);
    }
  }

  $fromPosition.click(function() {
    useCurrentPosition('from', '起点');
  });
  $toPosition.click(function() {
    useCurrentPosition('to', '终点');
  });
  $generateRoute.click(generateRoute);
  $body.on('keypress', '.tour-route input:text', geocode);

  $inviteFriends.click(function() {
    $inviteFriendsDialog.reveal();
  });

  $doc.resize(function() {
    var height = $doc.height() - 180;
    $map.height(height + 'px');
  });
  $doc.resize();

//  function enableAutoComplete(target, results) {
//    target.suggest(results);
//  }
});
