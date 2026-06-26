/* ============================================================
   Analyst Prep Kit — Interview Prep Pass (client-side unlock).
   Static GitHub-Pages gate: a buyer gets the unlock code in the
   Buy Me a Coffee post-purchase message, pastes it into any kit,
   and premium lessons unlock for 1 year (localStorage).
   Client-side only — best-effort by nature; acceptable at this price.

   LAUNCH MODEL (set 2026-06-26):
   - Now → launch: premium = "coming soon" + FOUNDING OFFER, $5.55 for
     the first year (95.837084% off the $11.11/mo launch price).
     Prices are number-sequence winks: 555 = "change", 11:11 = "new beginnings".
   - Founding code is redeemable now; access lasts 1 year from redeem.
   - At launch (~July 10, 2026): flip MODE to 'live' and price to $11.11/mo.

   Each kit decides WHICH lessons are premium and calls:
     window.apkPass.isUnlocked()      -> boolean
     window.apkPass.gateHTML({title}) -> paywall HTML (render into #main)
     window.apkPass.setKit('sql')     -> label GA4 events

   Unlock code (set this in the BMC product's post-purchase message):
     PREP-PASS-2026
   ============================================================ */
(function () {
  var KEY = 'apk-pass';
  var EXP = 'apk-pass-exp';
  var TARGET = 2935497303;            // djb2 hash of the code, uppercased
  var YEAR_MS = 365 * 24 * 60 * 60 * 1000;

  var MODE = 'founding';              // 'founding' (pre-launch) | 'live' (post-launch)
  var LAUNCH = 'August 1, 2026';
  var FOUNDING_PRICE = '$5.55';       // 555 = "change" (for career-changers)
  var LAUNCH_PRICE = '$11.11/mo';     // 11:11 = "new beginnings"
  // For the record — discount framing was intentionally dropped (steep % cheapens the brand);
  // the card sells value, not a fire-sale. True first-year cost $11.11 x 12 = $133.32;
  // founding $5.55 works out to 95.837084% off, but we never say that to the buyer.

  function h(s) {
    var n = 5381;
    for (var i = 0; i < s.length; i++) { n = ((n << 5) + n + s.charCodeAt(i)) >>> 0; }
    return n;
  }

  var api = {
    _kit: '',
    setKit: function (k) { this._kit = k || ''; },
    isUnlocked: function () {
      try {
        if (localStorage.getItem(KEY) !== '1') return false;
        var exp = parseInt(localStorage.getItem(EXP) || '0', 10);
        if (exp && Date.now() > exp) { return false; }   // expired
        return true;
      } catch (e) { return false; }
    },
    unlock: function (code) {
      if (h(String(code).trim().toUpperCase()) === TARGET) {
        try {
          localStorage.setItem(KEY, '1');
          localStorage.setItem(EXP, String(Date.now() + YEAR_MS));
        } catch (e) {}
        return true;
      }
      return false;
    },
    lock: function () { try { localStorage.removeItem(KEY); localStorage.removeItem(EXP); } catch (e) {} },
    gateHTML: function (opts) {
      opts = opts || {};
      var live = MODE === 'live';
      var icon = live ? 'lock' : 'rocket';
      var heading = live ? (opts.title || 'Premium lesson') : 'Interview tracks — coming soon';
      var badge = live ? '' : '<div class="apk-gate-badge">Launching ' + LAUNCH + '</div>';
      var blurb = live
        ? 'Part of the <strong>Interview Prep Pass</strong> — the interview tracks, mock exams, and deep practice that get you interview-ready. The core lessons stay free, always.'
        : 'The interview tracks, mock exams, and deep practice are in final testing before launch. The core lessons stay free, always.';
      var offer = live
        ? ''
        : '<div class="apk-gate-offer">' +
            '<div class="apk-gate-offer-tag">Founding offer · ends at launch ' + LAUNCH + '</div>' +
            '<div class="apk-gate-juice">A whole year of premium access — every interview track, mock-exam practice, the analyst job-sim, and the final exam.</div>' +
            '<div class="apk-gate-price"><span class="apk-gate-amt">' + FOUNDING_PRICE + '</span>' +
            '<span class="apk-gate-per">for your first year</span></div>' +
            '<div class="apk-gate-strike">Founding rate · ' + LAUNCH_PRICE + ' at launch</div>' +
          '</div>';
      var buyLabel = live
        ? 'Get the Interview Prep Pass — ' + LAUNCH_PRICE
        : 'Become a founding member — ' + FOUNDING_PRICE + '/year';
      return '<div class="apk-gate"><div class="apk-gate-card">' +
        badge +
        '<div class="apk-gate-icon"><i data-lucide="' + icon + '"></i></div>' +
        '<h2>' + heading + '</h2>' +
        '<p>' + blurb + '</p>' +
        offer +
        '<a class="apk-gate-buy" href="https://buymeacoffee.com/michaelnocito/extras?extra=551812" target="_blank" rel="noopener" ' +
        'onclick="if(window.gtag)gtag(\'event\',\'pass_buy_click\',{kit:apkPass._kit,mode:\'' + MODE + '\'})">' + buyLabel + '</a>' +
        '<div class="apk-gate-unlock">' +
        '<input id="apk-code" type="text" placeholder="Have a code? Paste it here" autocomplete="off" ' +
        'onkeydown="if(event.key===\'Enter\')apkPass._submit()">' +
        '<button type="button" onclick="apkPass._submit()">Unlock</button></div>' +
        '<div id="apk-code-msg" class="apk-gate-msg"></div>' +
        '</div></div>';
    },
    _submit: function () {
      var inp = document.getElementById('apk-code');
      var msg = document.getElementById('apk-code-msg');
      if (!inp || !msg) return;
      if (api.unlock(inp.value)) {
        msg.textContent = 'Unlocked! Loading…';
        msg.className = 'apk-gate-msg ok';
        if (window.gtag) gtag('event', 'pass_unlock', { kit: api._kit, mode: MODE });
        setTimeout(function () { location.reload(); }, 700);
      } else {
        msg.textContent = "That code didn't match — check for typos or trailing spaces.";
        msg.className = 'apk-gate-msg err';
      }
    }
  };
  window.apkPass = api;

  var css = document.createElement('style');
  css.textContent =
    '.apk-gate{display:flex;justify-content:center;padding:24px 0}' +
    '.apk-gate-card{max-width:460px;text-align:center;background:var(--surf,#fff);' +
    'border:1px solid var(--border,#e0d9d2);border-radius:14px;padding:30px 26px}' +
    '.apk-gate-badge{display:inline-block;background:var(--accent,#C5511F);color:#fff;font-size:11px;' +
    'font-weight:500;letter-spacing:.05em;text-transform:uppercase;padding:4px 12px;border-radius:99px;margin-bottom:14px}' +
    '.apk-gate-icon{width:46px;height:46px;border-radius:50%;margin:0 auto 14px;display:flex;' +
    'align-items:center;justify-content:center;background:var(--accent,#C5511F);color:#fff}' +
    '.apk-gate-card h2{margin:0 0 8px;font-size:20px}' +
    '.apk-gate-card p{color:var(--muted,#666);font-size:14px;line-height:1.55;margin:0 0 18px}' +
    '.apk-gate-offer{position:relative;background:var(--bg,#faf7f3);border:1px dashed var(--accent,#C5511F);border-radius:12px;' +
    'padding:16px 16px 14px;margin:0 0 18px}' +
    '.apk-gate-offer-tag{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:var(--accent,#C5511F);margin-bottom:8px}' +
    '.apk-gate-juice{font-size:13px;color:var(--muted,#555);line-height:1.5;margin-bottom:12px}' +
    '.apk-gate-price{display:flex;align-items:baseline;justify-content:center;gap:8px;flex-wrap:wrap}' +
    '.apk-gate-amt{font-size:38px;font-weight:500;color:var(--text,#222);line-height:1}' +
    '.apk-gate-per{font-size:13px;color:var(--muted,#666)}' +
    '.apk-gate-strike{font-size:12px;color:var(--muted,#888);margin-top:6px}' +
    '.apk-gate-buy{display:inline-block;background:var(--accent,#C5511F);color:#fff;text-decoration:none;' +
    'font-weight:500;padding:11px 20px;border-radius:8px;font-size:14px}' +
    '.apk-gate-buy:hover{background:var(--accent2,#A5411A)}' +
    '.apk-gate-unlock{display:flex;gap:8px;margin-top:18px}' +
    '.apk-gate-unlock input{flex:1;padding:9px 12px;border:1px solid var(--border,#ccc);border-radius:8px;' +
    'background:var(--bg,#fff);color:var(--text,#222);font-size:13px}' +
    '.apk-gate-unlock button{padding:9px 16px;border:1px solid var(--accent,#C5511F);background:transparent;' +
    'color:var(--accent,#C5511F);border-radius:8px;cursor:pointer;font-size:13px;font-weight:500}' +
    '.apk-gate-msg{font-size:12px;margin-top:10px;min-height:16px}' +
    '.apk-gate-msg.ok{color:var(--good,#3b6d11)}' +
    '.apk-gate-msg.err{color:#c0392b}' +
    '.lesson-lock{margin-left:6px;opacity:.55;vertical-align:-2px}';
  document.head.appendChild(css);
})();
