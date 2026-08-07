/* ============================================================
   Analyst Prep Kit — single AdSense unit, opt-out aware.

   DESIGN RULES, on purpose:
   - ONE ad per page. Never two, never a sticky bar, never an anchor.
   - Below the article, above the footer. Never inside the reading flow.
   - Space is reserved before the ad loads, so nothing on the page jumps.
   - Does nothing at all until PUB_ID and SLOT_ID are filled in below.
   - Never loads on localhost, on file://, or for anyone who has opted
     out. That includes Mike, via the existing ?ga=off switch.

   TO TURN IT ON:
     1. Paste your publisher ID into PUB_ID  (looks like ca-pub-1234567890123456)
     2. Paste the ad unit's slot ID into SLOT_ID  (a 10-digit number)
     That is the whole activation. Nothing else changes.

   TO TURN IT OFF AGAIN:
     Blank either constant. The script then injects nothing and makes
     no third-party request.

   Include per page:
     <script src="../../assets/apk-ads.js" defer></script>
   And put the slot where you want it:
     <div data-apk-ad></div>
   If no slot element exists, the unit is appended before the footer.

   NOTE: keep "Auto ads" switched OFF in the AdSense dashboard. Auto ads
   ignore everything above and place units wherever Google likes,
   including mid-paragraph and as a sticky overlay.
   ============================================================ */
(function () {
  var PUB_ID  = '';   // e.g. 'ca-pub-1234567890123456'
  var SLOT_ID = '';   // e.g. '1234567890'

  if (!PUB_ID || !SLOT_ID) return;              // not configured, do nothing
  if (document.querySelector('.apk-ad')) return; // already placed

  // Same opt-out surface as the GA gate, so one ?ga=off covers both.
  // ?ads=off / ?ads=on toggles ads alone.
  var local = location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) ||
    /^(192\.168\.|10\.)/.test(location.hostname);
  var optedOut = false;
  try {
    var p = new URLSearchParams(location.search).get('ads');
    if (p === 'off') localStorage.setItem('adsOptOut', '1');
    else if (p === 'on') localStorage.removeItem('adsOptOut');
    optedOut = localStorage.getItem('adsOptOut') === '1' ||
               localStorage.getItem('gaOptOut') === '1';
  } catch (e) {}
  if (local || optedOut) return;

  var css = document.createElement('style');
  css.textContent =
    '.apk-ad{max-width:760px;margin:34px auto 0;padding:0 22px;box-sizing:border-box}' +
    // Reserve the height up front so the page never jumps when the ad arrives.
    '.apk-ad ins{display:block;min-height:280px}' +
    '.apk-ad-label{font-size:11px;letter-spacing:.06em;text-transform:uppercase;' +
    'color:var(--muted,#71717A);opacity:.7;margin:0 0 6px}';
  document.head.appendChild(css);

  var loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + PUB_ID;
  loader.crossOrigin = 'anonymous';
  document.head.appendChild(loader);

  var wrap = document.createElement('div');
  wrap.className = 'apk-ad';
  // Labelled, because an ad a reader can't identify as an ad is the thing
  // that actually annoys people.
  wrap.innerHTML =
    '<p class="apk-ad-label">Advertisement</p>' +
    '<ins class="adsbygoogle" style="display:block" data-ad-client="' + PUB_ID +
    '" data-ad-slot="' + SLOT_ID + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';

  var slot = document.querySelector('[data-apk-ad]');
  if (slot) {
    slot.appendChild(wrap);
  } else {
    var foot = document.querySelector('main footer') || document.querySelector('footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(wrap, foot);
    else document.body.appendChild(wrap);
  }

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}
})();
