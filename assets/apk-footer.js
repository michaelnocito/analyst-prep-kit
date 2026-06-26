/* ============================================================
   Analyst Prep Kit — shared support footer.
   Injects a Grain-styled footer (GitHub · Buy Me a Coffee · All kits)
   into every kit page and fires a GA4 `support_click` event so we can
   see which kit drives donations. One line to include per kit:
     <script src="../assets/apk-footer.js" defer></script>
   Uses each kit's own theme vars (--border/--muted/--accent), so it
   adapts to dark + light automatically.
   ============================================================ */
(function () {
  if (document.querySelector('.apk-eco-footer')) return;

  // Derive the kit name from the path for the GA4 event label.
  var seg = location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '').split('/');
  var kit = seg.pop() || 'hub';

  var css = document.createElement('style');
  css.textContent =
    '.apk-eco-footer{text-align:center;padding:30px 18px;margin-top:44px;' +
    'border-top:1px solid var(--border,#e0d9d2);color:var(--muted,#888);' +
    'font-size:13px;font-family:inherit;line-height:1.6}' +
    '.apk-eco-footer a{color:var(--muted,#888);text-decoration:none;transition:color .15s}' +
    '.apk-eco-footer a:hover{color:var(--accent,#C5511F)}' +
    '.apk-eco-sep{margin:0 10px;opacity:.45}';
  document.head.appendChild(css);

  var f = document.createElement('footer');
  f.className = 'apk-eco-footer';
  f.innerHTML =
    '<a href="https://github.com/michaelnocito/analyst-prep-kit" target="_blank" rel="noopener">GitHub</a>' +
    '<span class="apk-eco-sep">·</span>' +
    '<a class="apk-eco-coffee" href="https://buymeacoffee.com/michaelnocito" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>' +
    '<span class="apk-eco-sep">·</span>' +
    '<a href="../">← All kits</a>';
  document.body.appendChild(f);

  f.querySelector('.apk-eco-coffee').addEventListener('click', function () {
    if (window.gtag) {
      gtag('event', 'support_click', { kit: kit, method: 'buymeacoffee' });
    }
  });
})();
