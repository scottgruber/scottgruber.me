// Shared Leaflet basemap setup for every map on the site (day pages and the
// overview). Ported from pacific-coast/js/basemap.js — tiles come from
// Mapbox's Static Tiles API as raster tiles, which keeps the site on plain
// Leaflet instead of pulling in Mapbox GL JS.
//
// With no token configured (js/config.js -> window.TSML_CONFIG), this falls
// back to CARTO's keyless tiles so the site still renders.
window.TSML_BASEMAP = (function () {
  var OSM_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var CARTO_ATTR = OSM_ATTR + ' &copy; <a href="https://carto.com/attributions">CARTO</a>';
  var MAPBOX_ATTR = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' + OSM_ATTR;

  var STYLES = [
    { label: "Elevation", style: "mapbox/outdoors-v12", default: true },
    { label: "Vegetation", style: "mapbox/satellite-streets-v12" },
    { label: "Plain", style: "mapbox/light-v11" },
  ];

  function token() {
    return (window.TSML_CONFIG || {}).MAPBOX_TOKEN || "";
  }

  function mapboxLayer(style) {
    return L.tileLayer(
      "https://api.mapbox.com/styles/v1/" + style +
        "/tiles/512/{z}/{x}/{y}{r}?access_token=" + encodeURIComponent(token()),
      { attribution: MAPBOX_ATTR, tileSize: 512, zoomOffset: -1, maxZoom: 19 }
    );
  }

  function cartoLayer() {
    return L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: CARTO_ATTR, subdomains: "abcd", maxZoom: 19 }
    );
  }

  function addTiles(map, opts) {
    opts = opts || {};
    if (!token()) {
      cartoLayer().addTo(map);
      return null;
    }
    var layers = {};
    STYLES.forEach(function (s) {
      var layer = mapboxLayer(s.style);
      layers[s.label] = layer;
      if (s.default) layer.addTo(map);
    });
    if (opts.addControl !== false) {
      L.control.layers(layers, null, { position: "topright" }).addTo(map);
    }
    return layers;
  }

  function handoffPopupHtml(lat, lon) {
    var ll = lat.toFixed(5) + "," + lon.toFixed(5);
    return (
      '<div class="map-handoff">' +
      '<p class="map-handoff__coords">' + ll + "</p>" +
      '<a href="https://www.google.com/maps/search/?api=1&query=' + ll +
        '" target="_blank" rel="noopener">Google Maps</a>' +
      '<a href="https://maps.apple.com/?q=' + ll +
        '" target="_blank" rel="noopener">Apple Maps</a>' +
      '<a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + ll +
        '" target="_blank" rel="noopener">Street View</a>' +
      "</div>"
    );
  }

  function enablePointHandoff(map) {
    map.on("click", function (e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(handoffPopupHtml(e.latlng.lat, e.latlng.lng))
        .openOn(map);
    });
  }

  // Re-fit after layout settles: the map card can grow after Leaflet has
  // already measured it (flex column below buttons/etc.), so keep Leaflet's
  // cached size in sync and re-fit — invalidateSize() preserves zoom, so a
  // map that first measured near-zero height doesn't stay stuck.
  function observeResize(el, map, getBounds) {
    if (typeof ResizeObserver === "undefined") return;
    new ResizeObserver(function () {
      map.invalidateSize();
      if (getBounds) map.fitBounds(getBounds(), { padding: [20, 20] });
    }).observe(el);
  }

  return {
    addTiles: addTiles,
    enablePointHandoff: enablePointHandoff,
    observeResize: observeResize,
    handoffPopupHtml: handoffPopupHtml,
  };
})();
