// Leaflet map init shared by day-N.html (window.__route/__towns) and
// overview.html (window.__days). Basemaps, the layer switcher and the
// click-to-hand-off popup come from js/basemap.js.
//
// Aligned with the taipei-sun-moon-lake/pacific-coast pattern: Mapbox
// raster tiles (js/basemap.js) instead of CARTO-only, and the same
// site-wide darker-pink route color instead of a plain hardcoded hex.
(function () {
  var BASE = window.HUANDAO_BASEMAP;

  function routeColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-route").trim() || "#dc3caf";
  }

  function townLabel(town) {
    return '<span lang="zh-Hant">' + town.zh + "</span><br>" + town.en;
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

    var start = latlngs[0];
    var end = latlngs[latlngs.length - 1];

    L.circleMarker(start, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: "#7cffc4",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(townLabel(window.__towns.start));

    L.circleMarker(end, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: color,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(townLabel(window.__towns.end));

    var bounds = line.getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });

    BASE.observeResize(el, map, function () {
      return bounds;
    });
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
        .bindTooltip("Day " + d.day + " — " + townLabel(d.towns.start), {
          direction: "top",
        });
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
