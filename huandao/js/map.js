// Leaflet map init shared by day-N.html (window.__route/__towns) and
// overview.html (window.__days). CARTO Positron tiles (no API key).
(function () {
  var TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  var TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>';
  var ROUTE_COLOR = "#ff83dc";

  function addTiles(map) {
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
  }

  function townLabel(town) {
    return (
      '<span lang="zh-Hant">' + town.zh + "</span><br>" + town.en
    );
  }

  // The map card can grow after Leaflet has already measured it — e.g. the
  // day-board photo beside it loads late and stretches the shared grid row.
  // Keep Leaflet's cached size in sync whenever the container's box changes.
  function observeResize(el, map) {
    if (typeof ResizeObserver === "undefined") return;
    new ResizeObserver(function () {
      map.invalidateSize();
    }).observe(el);
  }

  function initDayMap() {
    var el = document.getElementById("map");
    if (!el || !window.__route) return;

    var map = L.map(el, { scrollWheelZoom: false });
    addTiles(map);
    observeResize(el, map);

    var latlngs = window.__route;
    var line = L.polyline(latlngs, {
      color: ROUTE_COLOR,
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
      fillColor: "#7CFFC4",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(townLabel(window.__towns.start));

    L.circleMarker(end, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: ROUTE_COLOR,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup(townLabel(window.__towns.end));

    map.fitBounds(line.getBounds(), { padding: [20, 20] });
  }

  function initOverviewMap() {
    var el = document.getElementById("map");
    if (!el || !window.__days) return;

    var map = L.map(el, { scrollWheelZoom: false });
    addTiles(map);
    observeResize(el, map);

    var group = L.featureGroup().addTo(map);

    window.__days.forEach(function (d) {
      L.polyline(d.route, {
        color: ROUTE_COLOR,
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
        fillColor: "#7CFFC4",
        fillOpacity: 1,
      })
        .addTo(group)
        .bindTooltip("Day " + d.day + " — " + townLabel(d.towns.start), {
          direction: "top",
        });
    });

    map.fitBounds(group.getBounds(), { padding: [20, 20] });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDayMap();
    initOverviewMap();
  });
})();
