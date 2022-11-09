var map, featureList, boroughSearch = [], theaterSearch = [], museumSearch = [], wideSearch = [], infoSearch = [], addressSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  theaters.eachLayer(function (layer) {
    if (map.hasLayer(theaterLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  museums.eachLayer(function (layer) {
    if (map.hasLayer(museumLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/wide.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through wides layer and add only features which are in the map bounds */
  wides.eachLayer(function (layer) {
    if (map.hasLayer(wideLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through infos layer and add only features which are in the map bounds */
  infos.eachLayer(function (layer) {
    if (map.hasLayer(infoLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/info.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through addresss layer and add only features which are in the map bounds */
  addresss.eachLayer(function (layer) {
    if (map.hasLayer(addressLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/address.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">地理院地図（淡色）</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var usgsImagery = L.layerGroup([L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  maxZoom: 18,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 18,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "地理院地図（標準）"
})]);
var seamlessphoto = L.layerGroup([L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
  maxZoom:18,
  attribution: '地理院地図（写真）'
})]);

var openstreetmap = L.layerGroup([L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:18,
  attribution: 'OpenStreetMap'
})]);

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: 'Map data &copy; OpenStreetMap contributors'});

//var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//var osmAttrib='Map data &copy; OpenStreetMap contributors';
//var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "green",
      fill: false,
      opacity: 0.7,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

//Create a color dictionary based off of subway route_id
var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
    "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
    "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
    "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
    "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
    "Q":"#ffff00", "R":"#ffff00" };

var subwayLines = L.geoJson(null, {
  style: function (feature) {
      return {
        color: subwayColors[feature.properties.route_id],
        weight: 3,
        opacity: 1
      };
  },
 
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});


//UTMgrid
var u54Grid = L.utmGrid(54, false, {
  color: '#800',
  //latLonClipBounds: [[0, -180 + (129 * 6)],[80, -180 + (129 * 6) + 6]],
  latLonClipBounds: [[30, -180 + (53 * 6)],[40, -180 + (53 * 6) + 6]],
  drawClip: false, 
  showAxisLabels: [100, 1000, 10000, 100000],
  showSquareLabels: [100000], // label 100km grid squares
  //showAxis100km: true
});

/*オーバーレイ追加 1 */
var slope = L.layerGroup([L.tileLayer('../slope/{z}/{x}/{y}.png', {   
  opacity:0.7,    
  maxZoom: 18,
  attribution: ""
  }) ]);

/*オーバーレイ追加 2 */
var sedimentrisk = L.layerGroup([L.tileLayer('../sedimentrisk/{z}/{x}/{y}.png', {   
  opacity:0.7,    
  maxZoom: 18,
  attribution: ""
  }) ]);
  
/*オーバーレイ追加 3 */
var sedimentwarning = L.layerGroup([L.tileLayer('../sedimentwarning/{z}/{x}/{y}.png', {   
  opacity:0.7,    
  maxZoom: 18,
  attribution: ""
  }) ]);  

/*オーバーレイ追加 4 */
var tsunami = L.layerGroup([L.tileLayer('../tsunami/{z}/{x}/{y}.png', {   
  opacity:0.7,    
  maxZoom: 18,
  attribution: ""
  }) ]);  

//L.control.layers(baseLayers, sediment).addTo(map);  


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: false,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 0
}); 

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var theaterLayer = L.geoJson(null);
var theaters = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/theater.png",
        iconSize: [48, 56],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>施設名</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>施設分類</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>住所</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>URL</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<tr><th>画像</th><td><a class='url-break' href='" + feature.properties.URL + ">" + "" + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      theaterSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS1,
        source: "Theaters",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_THEATER_01_13SEPT2010.geojson", function (data) {
  theaters.addData(data);
  //map.addLayer(theaterLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var museumLayer = L.geoJson(null);
var museums = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/wide.png",
        iconSize: [48, 56],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>施設名</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>施設分類</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>住所</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>URL</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/wide.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      museumSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Museums",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_MUSEUM_01_13SEPT2010.geojson", function (data) {
  museums.addData(data);
  //map.addLayer(museumLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var wideLayer = L.geoJson(null);
var wides = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/museum.png",
        iconSize: [48, 56],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>施設名</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>施設分類</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>住所</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>URL</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      wideSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Wides",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_WIDE_01_13SEPT2010.geojson", function (data) {
  wides.addData(data);
  //map.addLayer(wideLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var infoLayer = L.geoJson(null);
var infos = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/info.png",
        iconSize: [48, 56],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>施設名</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>施設分類</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>住所</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th>URL</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      infoSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Infos",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_INFO_01_13SEPT2010.geojson", function (data) {
  infos.addData(data);
  //map.addLayer(infoLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var addressLayer = L.geoJson(null);
var addresss = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/address.png",
        iconSize: [36, 42],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>地域名</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th></th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>エリア</th><td>" + feature.properties.ADRESS1 + "</td></tr>" + "<tr><th></th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      addressSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "Addresss",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/DOITT_ADDRESS_01_13SEPT2010.geojson", function (data) {
  addresss.addData(data);
  map.addLayer(addressLayer);
});

map = L.map("map", {
  zoom: 14,
  center: [139.5469721, 35.3192296],
  layers: [cartoLight, boroughs, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

// デフォルトのズームコントロールは false になっているものとする
L.control.zoom({
  // ボタンのラベルを＋－から変更
  zoomInText: '▲',
  zoomOutText: '▼',
  // title 属性を日本語化
  zoomInTitle: '拡大',
  zoomOutTitle: '縮小'
}).addTo(map);

/* Layer control listeners that allow for a single markerClusters layer  */
map.on("overlayadd", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.addLayer(theaters);
    syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.addLayer(museums);
    syncSidebar();
  }
  if (e.layer === wideLayer) {
    markerClusters.addLayer(wides);
    syncSidebar();
  }
  if (e.layer === infoLayer) {
    markerClusters.addLayer(infos);
    syncSidebar();
  }
  if (e.layer === addressLayer) {
    markerClusters.addLayer(addresss);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === theaterLayer) {
    markerClusters.removeLayer(theaters);
    syncSidebar();
  }
  if (e.layer === museumLayer) {
    markerClusters.removeLayer(museums);
    syncSidebar();
  }
  if (e.layer === wideLayer) {
    markerClusters.removeLayer(wides);
    syncSidebar();
  }
  if (e.layer === infoLayer) {
    markerClusters.removeLayer(infos);
    syncSidebar();
  }
  if (e.layer === addressLayer) {
    markerClusters.removeLayer(addresss);
    syncSidebar();
  }
});  

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "buyodo";
  return div;
};
map.addControl(attributionControl);
/*
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);
*/

/* GPS enabled geolocation control set to follow the user's location 
var locateControl = L.control.locate({
  //position: "bottomright",
  drawMarker: true,
  follow: true,
  setView: false,
  keepCurrentZoomLevel: true,
  showCompass: true,
  markerStyle: {
    weight: 1,
    opacity: 0.4,
    fillOpacity: 0.4
  },
  circleStyle: {
    //weight: 1,
    //clickable: false,
    //radius: 30
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "現在位置",
    popup: "半径100m",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);*/


/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
};

var baseLayers = {

  "地理院地図（淡色）": cartoLight,
  "地理院地図（標準）": usgsImagery,
  "地理院地図（写真）": seamlessphoto,
  "OpenStreetMap": openstreetmap,

};

var groupedOverlays = {
  "避難所、公共施設等": {
    "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;避難所": theaterLayer,
    "<img src='assets/img/wide.png' width='24' height='28'>&nbsp;避難建築物": museumLayer,
    "<img src='assets/img/museum.png' width='24' height='28'>&nbsp;広域避難場所": wideLayer,
    "<img src='assets/img/info.png' width='24' height='28'>&nbsp;情報カメラ": infoLayer,
  },
  "住所検索": {
    "<img src='assets/img/address.png' width='24' height='28'>&nbsp;住所検索": addressLayer,
  },  
  "情報切替え": {
    "境界": boroughs,
    "UTMグリッド": u54Grid,
    "急傾斜": slope,
    "土砂災害危険箇所": sedimentrisk,
    "土砂災害警戒箇所": sedimentwarning,
    "津波": tsunami,
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var theatersBH = new Bloodhound({
    name: "Theaters",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: theaterSearch,
    limit: 10
  });

  var museumsBH = new Bloodhound({
    name: "Museums",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: museumSearch,
    limit: 10
  });

  var widesBH = new Bloodhound({
    name: "Wides",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: wideSearch,
    limit: 10
  });

  var infosBH = new Bloodhound({
    name: "Infos",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: infoSearch,
    limit: 10
  });

  var addresssBH = new Bloodhound({
    name: "Addresss",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: addressSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  theatersBH.initialize();
  museumsBH.initialize();
  widesBH.initialize();
  infosBH.initialize();
  addresssBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  }, {
    name: "Theaters",
    displayKey: "name",
    source: theatersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;避難所</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Museums",
    displayKey: "name",
    source: museumsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/wide.png' width='24' height='28'>&nbsp;避難建築物</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Wides",
    displayKey: "name",
    source: widesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/museum.png' width='24' height='28'>&nbsp;広域避難場所</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Infos",
    displayKey: "name",
    source: infosBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/info.png' width='24' height='28'>&nbsp;情報カメラ</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Addresss",
    displayKey: "name",
    source: addresssBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/address.png' width='24' height='28'>&nbsp;住所</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }

    if (datum.source === "Theaters") {
      if (!map.hasLayer(theaterLayer)) {
        map.addLayer(theaterLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Museums") {
      if (!map.hasLayer(museumLayer)) {
        map.addLayer(museumLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Wide") {
      if (!map.hasLayer(wideLayer)) {
        map.addLayer(wideLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Info") {
      if (!map.hasLayer(infoLayer)) {
        map.addLayer(infoLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Address") {
      if (!map.hasLayer(addressLayer)) {
        map.addLayer(addressLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

//スケールの表示
L.control.scale({imperial:false}).addTo(map);

//ミニマップ
var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13});
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

//現在地に同心円を描く
function setCurLocation(){
  if (navigator.geolocation == false){
    alert('現在地を取得できませんでした。');
    return;
  }
  function success(e) {
    var lat  = e.coords.latitude;
    var lng = e.coords.longitude;
    map.setView([lat, lng], 15);
    
    //var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:'#1199fb'});
    //L.marker([lat, lng],{icon: pulsingIcon}).addTo(map);

    var pop1 = L.popup({maxWidth:550}).setContent(`現在地`);
    L.marker([lat, lng], {title:""}).bindPopup(pop1).addTo(map);  

    L.circle([lat, lng], { radius: 100, color: "red", fill: true, weight: 2 }).addTo(map);
    L.circle([lat, lng], { radius: 500, color: "red", fill: false, weight: 1 }).addTo(map);  
  };
  function error() {
    alert('現在地を取得できませんでした。');
  };
  navigator.geolocation.getCurrentPosition(success, error);
}


//印刷機能
var customActionToPrint = function(context, mode) {
	return function() {
		window.alert("We are printing the MAP. Let's do Custom print here!");
		context._printMode(mode);
	}
};

L.control.browserPrint({
	title: '印刷',
  position: 'bottomleft',
	documentTitle: 'Map printed using leaflet.browser.print plugin',
	//printLayer: L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
	//				attribution: '',
	//				subdomains: 'abcd',
	//				minZoom: 1,
	//				maxZoom: 18,
	//				ext: 'png'
	//			}),
	closePopupsOnPrint: false,
	printModes: [
            //L.BrowserPrint.Mode.Landscape("Tabloid",{title: "全画面印刷"}),
            //L.browserPrint.mode("Alert",{title:"印刷指定",pageSize: "A6", action: customActionToPrint, invalidateBounds: false}),
            L.BrowserPrint.Mode.Landscape("B4",{title: "A4 ヨコ"}),
            L.BrowserPrint.Mode.Portrait("B4",{title: "A4 タテ"}),
            //L.BrowserPrint.Mode.Auto("B4",{title: "A4 ヨコ"}),
            //L.BrowserPrint.Mode.Custom("B5",{title:"領域選択"})
	],
	manualMode: false
}).addTo(map);

//UTM座標
          var el1 = document.forms.frm1.elements;
          var el2 = document.forms.frm2.elements;
  
          function toUTMBtn() {
              document.getElementById('result1').innerHTML = '---';
              var ll = L.latLng(el1.lat.value, el1.lng.value);
              var utm = ll.utm();
              marker.setLatLng(ll).bindPopup(utm + '<br>' + ll).openPopup()
              el2.x.value = utm.x.toFixed(1);
              el2.y.value = utm.y.toFixed(1);
              el2.zone.value = utm.zone;
              el2.band.value = utm.band;
              el2.southHemi.value = utm.southHemi;
              document.getElementById('result1').innerHTML = '' + utm;
          }
  
          function toLatLngBtn() {
              document.getElementById('result2').innerHTML = '---';
              var sh = el2.southHemi.value.toLowerCase();
              var southHemi = ['true', 'y', 'yes', '1'].indexOf(sh) > -1 ? true : false;
              var utm = L.utm(el2.x.value, el2.y.value, el2.zone.value, el2.band.value, southHemi);
              var ll = utm.latLng();
              if (ll) {
                  marker.setLatLng(ll).bindPopup(utm + '<br>' + ll).openPopup()
                  el1.lat.value = ll.lat.toFixed(6);
                  el1.lng.value = ll.lng.toFixed(6);
                  document.getElementById('result2').innerHTML = '' + ll;
              }
          }


          var marker = new L.Marker([0, 0]).addTo(map);
          toUTMBtn();

          map.on('move', function(e) {
              var c = map.getCenter();
              document.getElementById('center').innerHTML = c + '<br>UTMポイント: ' + c.utm();
          });
          map.fire('move');
