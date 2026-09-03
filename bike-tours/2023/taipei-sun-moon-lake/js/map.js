// Leaflet map init shared by day pages (window.__route/__towns/__waypoints)
// and the overview page (window.__days). Basemaps, the layer switcher and
// the click-to-hand-off popup come from js/basemap.js.
//
// Adapted from pacific-coast/js/map.js — the route-options (candidate-track
// comparison) and lodging-marker branches are dropped, since this trip has
// one settled track per day and no lodging data (core scope: map + elevation
// + climbs only).
(function () {
  var BASE = window.TSML_BASEMAP;

  function routeColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-theme").trim() || "#ff83dc";
  }

  function initDayMap() {
    var el = document.getElementById("map");
    if (!el || !window.__route) return;

    var color = routeColor();
    var map = L.map(el, { scrollWheelZoom: false });
    BASE.addTiles(map);
    BASE.enablePointHandoff(map);

    var latlngs = window.__route;
    var line = L.polyline(latlngs, {
      color: color,
      weight: 4,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    var bounds = line.getBounds();
    var start = latlngs[0];
    var end = latlngs[latlngs.length - 1];
    var towns = window.__towns || {};

    L.circleMarker(start, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: "#7cffc4",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(towns.start ? townLabel(towns.start) : "Start");

    L.circleMarker(end, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: color,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(towns.end ? townLabel(towns.end) : "Finish");

    (window.__waypoints || []).forEach(function (w) {
      if (!w.name) return;
      L.circleMarker([w.lat, w.lon], {
        radius: 5,
        color: "#fff",
        weight: 1.5,
        fillColor: "#05192b",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(w.name);
    });

    map.fitBounds(bounds, { padding: [20, 20] });

    BASE.observeResize(el, map, function () {
      return bounds;
    });
  }

  function townLabel(town) {
    var city = town && town.city;
    if (!city) return String(town);
    return city.en + (city.zh ? " (" + city.zh + (city.pinyin ? ", " + city.pinyin : "") + ")" : "");
  }

  function initOverviewMap() {
    var el = document.getElementById("map");
    if (!el || !window.__days) return;

    var color = routeColor();
    var map = L.map(el, { scrollWheelZoom: false });
    BASE.addTiles(map);
    BASE.enablePointHandoff(map);

    var group = L.featureGroup().addTo(map);

    window.__days.forEach(function (d) {
      if (!d.route) return;
      L.polyline(d.route, {
        color: color,
        weight: 3,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(group);

      var start = d.route[0];
      L.circleMarker(start, {
        radius: 5,
        color: "#fff",
        weight: 1.5,
        fillColor: "#7cffc4",
        fillOpacity: 1,
      })
        .addTo(group)
        .bindTooltip("Day " + d.day + (d.towns ? " — " + townLabel(d.towns.start) : ""), { direction: "top" });
    });

    map.fitBounds(group.getBounds(), { padding: [20, 20] });
    BASE.observeResize(el, map, function () {
      return group.getBounds();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDayMap();
    initOverviewMap();
  });
})();
