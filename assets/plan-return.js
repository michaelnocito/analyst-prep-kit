// Back-to-plan pill for plan sittings on static pages (guides, Interview kit,
// Project Studio). Real Test rt010b: the guide hop was a total teleport — no way
// back, no stop, a box the product could never check. These pages have no
// completion event to hook, so the pill IS the stop and the completion: one fixed
// green control, always visible on a long page, that returns to the plan with
// ?ckd=<step> (+ the sitting's seconds) so the plan checks its own box.
// Opt-in via ?from=plan; nobody arriving any other way ever sees it.
(function () {
  'use strict';
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get('from') !== 'plan') return;
    var ret = qs.get('ret') || '';
    var ok = /^d\d+s\d+$/.test(ret);
    var t0 = Date.now();
    var planPath = location.pathname.replace(/(analyst-prep-kit\/).*$/, '$1plan/');
    var bar = document.createElement('a');
    bar.href = planPath;
    bar.textContent = ok ? '✓ Done here? Back to your plan, box checked'
                         : '← Back to your plan';
    bar.setAttribute('aria-label', ok ? 'Done here. Back to your plan, box checked'
                                      : 'Back to your plan');
    bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:16px;' +
      'z-index:1200;background:' + (ok ? '#15803D' : '#0E7490') + ';color:#fff;' +
      'text-decoration:none;font:600 14px/1 system-ui,sans-serif;padding:12px 18px;' +
      'border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.28)';
    if (ok) {
      bar.addEventListener('click', function (e) {
        e.preventDefault();
        var secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
        location.href = planPath + '?ckd=' + encodeURIComponent(ret) + '&s=' + secs;
      });
    }
    document.body.appendChild(bar);
  } catch (e) {}
})();
