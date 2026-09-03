// Imperial/metric toggle. Both unit values are pre-computed at build time
// and rendered in the markup (see _includes/partials/unit.njk); this just
// flips which one is visible via a class on <html>, and remembers the
// choice. The anti-flash class application happens inline in <head>, before
// first paint — this file only wires up the button. Ported verbatim from
// huandao/js/units.js.
(function () {
  function isMetric() {
    return document.documentElement.classList.contains("metric");
  }

  function sync(btn) {
    var metric = isMetric();
    btn.setAttribute("aria-pressed", metric ? "true" : "false");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("unit-toggle");
    if (!btn) return;
    sync(btn);
    btn.addEventListener("click", function () {
      var metric = document.documentElement.classList.toggle("metric");
      try {
        localStorage.setItem("tsml-units", metric ? "metric" : "imperial");
      } catch (e) {
        /* localStorage unavailable (private mode etc.) — toggle still works for this page view */
      }
      sync(btn);
    });
  });
})();
