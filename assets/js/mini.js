window.onload = function () {
        var tileLayerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

        var map = L.map('map', {
          center: [139.5469721, 35.3192296],
          zoom: 12,
          layers: [
            L.tileLayer(tileLayerUrl, {
              attribution:
                'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            })
          ]
        });

        var miniMapLayer = new L.TileLayer(tileLayerUrl);
        var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true }).addTo(map);
      };