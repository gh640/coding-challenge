var locationMap;
var markers = [];

const MAP_ID = 'location-map';
const MAP_CENTER = {lat: 37.7827, lng: -122.4186};
const MAP_STYLES = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
];

function initMap() {
  locationMap = new google.maps.Map(document.getElementById(MAP_ID), {
    zoom: 9,
    styles: MAP_STYLES,
    center: MAP_CENTER
  });
}

function updateMap(locations) {
  clearMarkers(markers);

  locations.forEach(function (l) {
    var marker = new google.maps.Marker({
      position: {lat: l.geo_lat, lng: l.geo_lng},
      map: locationMap
    });
    markers.push(marker);
  });

  center = calcCenterOfMap(locations);
  if (center) {
    locationMap.setCenter(center);
  }
}

// Sets the map on all markers in the array.
function setMapOnAll(markers, map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markers) {
  setMapOnAll(markers, null);
  markers = [];
}

function calcCenterOfMap(locations) {
  if (locations.length < 1) {
    return null;
  }

  var totalLat = 0;
  var totalLng = 0;

  locations.forEach(function (l) {
    totalLat += l.geo_lat;
    totalLng += l.geo_lng;
  });

  return {
    'lat': totalLat / locations.length,
    'lng': totalLng / locations.length
  };
}

(function () {
  const MESSAGE_TTL = 2000;

  init();

  function init() {
    defineComponents();

    const locationMapApp = new Vue({
      el: '#location-map-app',
      data: {
        title: '',
        count: '',
        message: '',
        locations: []
      },
      methods: {
        updateList: function (event) {
          updateLocations(this, this.title);
        }
      }
    })

    window.onload = function() {
      updateLocations(locationMapApp, '');
    };
  }

  function defineComponents() {
    // 現在のカウント数
    Vue.component('current-count', {
      'props': ['count'],
      'template': '<span>{{ count }} location(s) found.</span>'
    })

    // ステータスメッセージ
    Vue.component('status-message', {
      'props': ['message'],
      'template': '<span>{{ message }}</span>'
    })

    // ロケーションのテーブル
    Vue.component('location-table-row', {
      'props': ['location'],
      'template': '<tr>' +
        '<td class="location-table-row-title">{{ location.title }}</td>' +
        '<td class="location-table-row-year">{{ location.year }}</td>' +
        '<td class="location-table-row-locations">{{ location.locations }}</td>' +
        '</tr>'
    })
  }

  function updateLocations(app, title) {
    app.message = 'loading...';
    axios.get('/location', {
        'params': {
          'title': title
        }
      })
      .then(function (response) {
        app.locations = response.data;
        updateMap(app.locations);
        app.count = app.locations.length;
        app.message = 'loaded!';
        window.setTimeout(function () {
          app.message = '';
        }, MESSAGE_TTL);
      })
      .catch(function (error) {
        app.message = 'failed to fetch data :(';
        window.setTimeout(function () {
          app.message = '';
        }, MESSAGE_TTL);
      });
  }

})();
