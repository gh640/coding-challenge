var locationMap;

const MAP_ID = 'location-map';
const MAP_CENTER = {lat: 37.7827, lng: -122.4186};
const MAP_ZOOM = 10;
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

/**
 * マップを初期化する。
 */
function initMap() {
  locationMap = new google.maps.Map(document.getElementById(MAP_ID), {
    zoom: MAP_ZOOM,
    styles: MAP_STYLES,
    center: MAP_CENTER
  });
}

(function () {
  // メッセージ表示時間（単位: ミリ秒）
  const MESSAGE_TTL = 2000;
  // サジェスチョンを取得しに行くまでの街時間（単位: ミリ秒）
  const SUGGESTION_WAIT = 400;
  // マーカー
  var markers = [];
  // 開かれている地図内ウィンドウ
  var infoWindowsOpened = [];

  init();

  /**
   * ページの初期化処理を実行する。
   */
  function init() {
    defineComponents();

    const locationMapApp = new Vue({
      el: '#location-map-app',
      data: {
        title: '',
        count: '',
        message: '',
        suggestions: [],
        locations: [],
        currentIndex: -1,
        suggestionSelected: false,
        isTitleFocused: false
      },
      methods: {
        onKeyUp: function (event) {
          switch (event.code) {
            case 'Enter':
              this.selectSuggestionOrUpdateList();
              break;

            case 'ArrowDown':
              this.down();
              break;

            case 'ArrowUp':
              this.up();
              break;

            default:
              this.updateSuggestion();
          }
        },

        // サジェスチョンのうち 1 つを選択、またはリストを更新する
        selectSuggestionOrUpdateList: function () {
          if (this.suggestions[this.currentIndex]) {
            this.selectSuggestion();
          } else {
            updateLocations(this, this.title);
          }
        },

        // サジェスチョンのリストを更新する
        updateSuggestion: _.debounce(function () {
          if (this.suggestionSelected) {
            this.suggestionSelected = false;
            return;
          }

          if (this.title) {
            fetchSuggestions(this, this.title);
          } else {
            this.clearSuggestions();
          }

          this.resetIndex();
        }, SUGGESTION_WAIT),

        // サジェスチョンの 1 つ下の要素を選択する
        down: function () {
          console.log(this.currentIndex);
          if (this.suggestions.length < 1) {
            this.resetIndex();
          }
          if (this.currentIndex < this.suggestions.length - 1) {
            this.currentIndex += 1;
          }

          // リスト内で自動スクロール
          const container = this.$refs.suggestionsContainer;
          const suggestions = container.querySelectorAll('li');
          if (suggestions[this.currentIndex]) {
            const selected = suggestions[this.currentIndex];
            if (selected.offsetTop + selected.clientHeight >
                container.scrollTop + container.clientHeight) {
              container.scrollTop += selected.clientHeight;
            }
          }
        },

        // サジェスチョンの 1 つ上の要素を選択する
        up: function () {
          console.log(this.currentIndex);
          if (this.suggestions.length < 1) {
            this.resetIndex();
          }
          if (this.currentIndex > 0) {
            this.currentIndex -= 1;
          }

          // リスト内で自動スクロール
          const container = this.$refs.suggestionsContainer;
          const suggestions = container.querySelectorAll('li');
          if (suggestions[this.currentIndex]) {
            const selected = suggestions[this.currentIndex];
            if (selected.offsetTop < container.scrollTop) {
              container.scrollTop -= selected.clientHeight;
            }
          }
        },

        // サジェスチョンのうち 1 つを選択しロケ地リストも更新する
        selectSuggestionAndUpdateList: function (suggestion) {
          this.selectSuggestion(suggestion);
          updateLocations(this, this.title);
        },

        // サジェスチョンのうち 1 つを選択する
        selectSuggestion: function (suggestion) {
          if (suggestion) {
            this.title = suggestion.title;
          } else {
            this.title = this.suggestions[this.currentIndex].title;
          }

          this.clearSuggestions();
          this.suggestionSelected = true;
          this.$refs.title.focus();
        },

        // サジェスチョンをクリアする
        clearSuggestions: function () {
          this.resetIndex();
          this.suggestions = [];
        },

        // タイトルのフォーカスステータスを切り替える
        toggleTitleFocus: function (value) {
          this.isTitleFocused = value;
        },

        // インデックスを初期状態（ -1 ）にリセットする
        resetIndex: function () {
          this.currentIndex = -1;
        },

        // 現在のサジェスチョン行が選択中かどうかをチェックする
        isCurrent: function (index) {
          return index === this.currentIndex;
        },
      }
    })

    // マップを初期化する
    window.onload = function() {
      updateLocations(locationMapApp, '');
    };
  }

  /**
   * 利用するコンポーネントを定義する。
   */
  function defineComponents() {
    // 自動補完候補
    Vue.component('title-suggestion', {
      'props': ['suggestion'],
      'template': '<li>{{ suggestion.title }}</li>'
    });
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

  /**
   * 映画タイトルの自動補完のために候補を取得する
   */
  function fetchSuggestions(app, title) {
    axios.get('/movie', {
        'params': {
          'title': title
        }
      })
      .then(function (response) {
        app.suggestions = response.data;
      })
      .catch(function (error) {
        app.message = 'failed to fetch data :(';
        app.suggestions = [];
      });
  }

  /**
   * ロケ地データをフェッチして更新する。
   */
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

  /**
   * 新しいロケ地設置を受けてマップを更新する。
   *
   * @param Array locations
   */
  function updateMap(locations) {
    clearMarkers(markers);

    locations.forEach(function (l) {
      var marker = new google.maps.Marker({
        position: {lat: l.geo_lat, lng: l.geo_lng},
        map: locationMap,
        // マップ内ウィンドウに情報を表示するためにロケ地情報を持たせる
        location: l,
      });

      marker.addListener('click', function () {
        // 他のウィンドウを閉じる
        infoWindowsOpened.forEach(function (w) {
          w.close();
        });
        infoWindowsOpened = [];

        // マップ内ウィンドウに映画情報を表示する
        var infoWindow = new google.maps.InfoWindow({
          content: `<div class="map-info-window"><h1>${this.location.title} (${this.location.year})</h1><div>${this.location.locations}</div></div>`
        });

        infoWindow.open(locationMap, marker);
        infoWindowsOpened.push(infoWindow);
      });

      markers.push(marker);
    });

    var center = calcCenterOfMap(locations);
    if (center) {
      locationMap.setCenter(center);
    }
  }

  /**
   * 指定されたマーカーを削除する。
   *
   * @param google.maps.Marker[] markers
   */
  function clearMarkers(markers) {
    setMapOnAll(markers, null);
    markers = [];
  }

  /**
   * マーカーにマップをセットする。
   *
   * @param google.maps.Marker[] markers
   * @param google.maps.Map map
   */
  function setMapOnAll(markers, map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  /**
   * ロケ地からマップの中心を計算する。
   *
   * @param Array locations
   */
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

})();
