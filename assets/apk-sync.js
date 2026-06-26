/* ============================================================
   Analyst Prep Kit — progress backup / restore (no backend).
   All kits live on one origin, so their localStorage is shared —
   this hub-side tool exports every kit's progress as one code the
   user can copy to another device and import. Stopgap until real
   accounts (Supabase) land for the recurring phase.

   Exposes window.apkSync.{exportData, importData}; auto-wires the
   hub UI elements (#apk-sync-export / #apk-sync-import / #apk-sync-box
   / #apk-sync-msg) if present.
   ============================================================ */
(function () {
  // Prep-kit localStorage key prefixes (origin is shared with other
  // github.io projects, so we only ever touch our own keys).
  var PREFIXES = ['apk', 'epk', 'sqlkit', 'ppk', 'tpk', 'spk', 'pbikt', 'ipk', 'sim2'];
  function isOurs(k) { return PREFIXES.some(function (p) { return k === p || k.indexOf(p) === 0; }); }

  function collect() {
    var o = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (isOurs(k)) o[k] = localStorage.getItem(k);
    }
    return o;
  }
  function enc(s) { return btoa(unescape(encodeURIComponent(s))); }
  function dec(s) { return decodeURIComponent(escape(atob(s))); }

  var api = {
    exportData: function () { return 'APK1:' + enc(JSON.stringify(collect())); },
    importData: function (str) {
      str = String(str || '').trim();
      if (str.indexOf('APK1:') === 0) str = str.slice(5);
      var obj;
      try { obj = JSON.parse(dec(str)); } catch (e) { return { ok: false, error: "That code didn't look right — copy the whole thing." }; }
      if (!obj || typeof obj !== 'object') return { ok: false, error: "That code didn't look right — copy the whole thing." };
      var n = 0;
      Object.keys(obj).forEach(function (k) {
        if (isOurs(k)) { try { localStorage.setItem(k, obj[k]); n++; } catch (e) {} }
      });
      return { ok: true, count: n };
    }
  };
  window.apkSync = api;

  function wire() {
    var ex = document.getElementById('apk-sync-export'),
        im = document.getElementById('apk-sync-import'),
        box = document.getElementById('apk-sync-box'),
        msg = document.getElementById('apk-sync-msg');
    if (ex && box && msg) ex.addEventListener('click', function () {
      box.value = api.exportData();
      box.select();
      try { document.execCommand('copy'); } catch (e) {}
      msg.textContent = 'Copied. Paste this code into Import on your other device.';
    });
    if (im && box && msg) im.addEventListener('click', function () {
      if (!box.value.trim()) { msg.textContent = 'Paste a progress code into the box first.'; return; }
      var r = api.importData(box.value);
      msg.textContent = r.ok ? ('Restored ' + r.count + ' items. Reloading…') : r.error;
      if (r.ok) setTimeout(function () { location.reload(); }, 900);
    });
  }
  if (document.readyState !== 'loading') wire();
  else document.addEventListener('DOMContentLoaded', wire);
})();
