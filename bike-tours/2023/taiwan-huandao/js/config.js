// Site configuration. Loaded before js/map.js.
//
// MAPBOX_TOKEN must be a PUBLIC token — it starts with "pk." and is visible to
// anyone who views source, which is fine and expected for a public token so
// long as it is URL-restricted to this site's domain in the Mapbox account
// (Account -> Tokens -> the token -> URL restrictions). Same token already
// used by scottgruber.me/bike-tours/pacific-coast/2026 and
// bike-tours/2024/taipei-sun-moon-lake — this site deploys under the same
// scottgruber.me domain, so no new restriction entry is needed.
//
// NEVER put a secret "sk." token here. Secret tokens cannot be URL-restricted
// and are for server-side/CLI use only.
//
// If this is left empty the maps fall back to CARTO's keyless tiles, so the
// site still builds and renders — just on the rate-limited basemap.
window.HUANDAO_CONFIG = {
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2NvdHRncnViZXIiLCJhIjoiY210ZngzdXdqMHpnbDJ5cHQ1NWdwcm45OCJ9.rLX-CrCt3RimnjdZwlLJ_Q",
};
