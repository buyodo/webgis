/**/
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

    var options = {
        attribution:
            '<a href="https://openstreetmap.org/copyright"</a> &copy; ' +
            'OpenStreetmap Contributors',
        subdomains: 'abc',
        minZoom: 0,
        maxZoom: 19
    };

    var osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options);
    var map = L.map('map', {layers: [osm], center: [35.3192296, 139.5469721], zoom: 14});
    
    toUTMBtn();

    map.on('move', function(e) {
        var c = map.getCenter();
        document.getElementById('center').innerHTML = c + '<br>UTM: ' + c.utm();
    });
    map.fire('move');
