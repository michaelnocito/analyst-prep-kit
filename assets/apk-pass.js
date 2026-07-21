/* ============================================================
   Analyst Prep Kit — All-Access Pass (client-side unlock).
   Static GitHub-Pages gate: a buyer gets the unlock code in the
   Buy Me a Coffee post-purchase message, pastes it into any kit,
   and premium lessons unlock for good (localStorage).
   Client-side only — best-effort by nature; acceptable at this price.

   LAUNCH MODEL (revised 2026-07-21 — ONE-TIME + PERMANENT):
   - Now → launch: premium = "coming soon" + FOUNDING OFFER, $5.55 once.
     Prices are number-sequence winks: 555 = "change", 11:11 = "new beginnings".
   - At launch (Aug 1, 2026): flip MODE to 'live'; price = $11.11 ONE-TIME.
   - ACCESS NEVER EXPIRES. Pay once, keep it. No subscription, no renewal,
     no 1-year cap (the old YEAR_MS expiry was a subscription-era leftover
     and was removed 2026-07-21 — legacy `apk-pass-exp` values are ignored
     so early redeemers can never be locked out).
   - Why one-time: interview prep is an episodic need (BLS median job search
     11 wks; education subs churn worst per RevenueCat/Recurly; the closest
     competitors sell one-time/lifetime passes). Decision: Mike, 2026-07-21.

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
  var CELEB = 'apk-pass-celebrated';  // one-time "you've unlocked" flag
  var TARGET = 2935497303;            // djb2 hash of the code, uppercased
  // NOTE: `EXP` is legacy. Access no longer expires; we clear the key on unlock
  // and never read it, so anyone who redeemed under the old 1-year model keeps
  // access permanently. Do not reintroduce an expiry check.

  var MODE = 'founding';              // 'founding' (pre-launch) | 'live' (post-launch)
  var LAUNCH = 'August 1, 2026';
  var FOUNDING_PRICE = '$5.55';       // 555 = "change" (for career-changers)
  var LAUNCH_PRICE = '$11.11';        // 11:11 = "new beginnings" — ONE-TIME, never expires
  // Discount framing intentionally dropped (steep % cheapens the brand);
  // the card sells value, not a fire-sale.

  function h(s) {
    var n = 5381;
    for (var i = 0; i < s.length; i++) { n = ((n << 5) + n + s.charCodeAt(i)) >>> 0; }
    return n;
  }

  var api = {
    _kit: '',
    setKit: function (k) { this._kit = k || ''; },
    isUnlocked: function () {
      // Free access until August 1, 2026 — gates removed while lessons/AI/coach are built
      if (Date.now() < new Date('2026-08-01T00:00:00').getTime()) return true;
      try {
        return localStorage.getItem(KEY) === '1';   // never expires
      } catch (e) { return false; }
    },
    unlock: function (code) {
      if (h(String(code).trim().toUpperCase()) === TARGET) {
        try {
          localStorage.setItem(KEY, '1');
          localStorage.removeItem(EXP);   // legacy expiry — access is permanent now
        } catch (e) {}
        return true;
      }
      return false;
    },
    lock: function () { try { localStorage.removeItem(KEY); localStorage.removeItem(EXP); } catch (e) {} },

    // ── Membership state — the GENUINE "unlocked" signal ─────────────────
    // isUnlocked() free-bypasses to true for everyone until launch, so it
    // can't drive an "you unlocked this" badge. These read the real state:
    // a redeemed code, or a signed-in account entitlement.
    _acctPass: false,                   // set true once hasInterviewPass() resolves
    // A code was actually redeemed (ignores the free bypass). Never expires.
    hasRedeemed: function () {
      try {
        return localStorage.getItem(KEY) === '1';
      } catch (e) { return false; }
    },
    // True when the visitor has genuinely unlocked premium — redeemed code OR
    // account entitlement. This is what the "Unlocked" badge/banner key on.
    isMember: function () { return this.hasRedeemed() || this._acctPass === true; },
    // Async: check the Supabase account entitlement (hasInterviewPass, loaded by
    // supabase_auth_sync.js). If it resolves true, cache it, re-render via the
    // supplied callback, and fire the one-time celebration. Safe no-op if the
    // auth layer isn't present or the user isn't signed in.
    hydrateAcct: function (rerender) {
      var self = this;
      try {
        if (typeof window.hasInterviewPass !== 'function') return;
        Promise.resolve(window.hasInterviewPass()).then(function (ok) {
          if (ok && !self._acctPass) {
            self._acctPass = true;
            if (typeof rerender === 'function') { try { rerender(); } catch (e) {} }
            self.celebrateUnlock();
          }
        }).catch(function () {});
      } catch (e) {}
    },

    // ── "Unlocked" treatment for premium surfaces ────────────────────────
    // Pill for a premium lesson card. Three states so free vs. paid reads clearly:
    //   member      → "✓ Unlocked" (green)   — you own this
    //   free window → "Premium · free now"   — preview, unlocked for launch only
    //   locked      → "🔒 Premium"           — locked/preview
    lessonBadge: function () {
      if (this.isMember())
        return '<span class="apk-pill apk-pill-on"><i data-lucide="check"></i>Unlocked</span>';
      if (this.isUnlocked())
        return '<span class="apk-pill apk-pill-preview">Premium · free now</span>';
      return '<span class="apk-pill apk-pill-lock"><i data-lucide="lock"></i>Premium</span>';
    },
    // Banner shown atop a premium surface a member has unlocked. `noun` names
    // the surface (default 'lesson'; e.g. 'exam kit').
    unlockedBanner: function (noun) {
      if (!this.isMember()) return '';
      noun = noun || 'lesson';
      return '<div class="apk-unlocked-banner"><i data-lucide="sparkles"></i>' +
        '<span><strong>Unlocked.</strong> This premium ' + noun + ' is part of your All-Access Pass.</span></div>';
    },
    // One-time "You\'ve unlocked..." moment. Fires once per browser after a
    // genuine unlock (guarded by the CELEB flag). Call on every kit load — it
    // no-ops unless the visitor is a member who hasn\'t seen it yet.
    celebrateUnlock: function (force) {
      try {
        if (!force && !this.isMember()) return;
        if (!force && localStorage.getItem(CELEB) === '1') return;
        localStorage.setItem(CELEB, '1');
      } catch (e) { if (!force) return; }
      if (typeof document === 'undefined' || !document.body) return;
      var el = document.createElement('div');
      el.className = 'apk-unlock-toast';
      el.innerHTML = '<div class="apk-unlock-toast-card">' +
        '<div class="apk-unlock-toast-icon"><i data-lucide="party-popper"></i></div>' +
        '<div class="apk-unlock-toast-body"><strong>You\'ve unlocked the All-Access Pass</strong>' +
        '<span>Every interview track and premium module is now open across all kits.</span></div>' +
        '<button type="button" class="apk-unlock-toast-x" aria-label="Dismiss">&times;</button></div>';
      document.body.appendChild(el);
      if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch (e) {} }
      var close = function () {
        el.classList.remove('apk-unlock-toast-in');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
      };
      el.querySelector('.apk-unlock-toast-x').onclick = close;
      requestAnimationFrame(function () { el.classList.add('apk-unlock-toast-in'); });
      setTimeout(close, 9000);
    },
    gateHTML: function (opts) {
      opts = opts || {};
      var live = MODE === 'live';
      var icon = live ? 'lock' : 'rocket';
      var heading = live ? (opts.title || 'Premium lesson') : 'All-Access Pass — coming soon';
      var badge = live ? '' : '<div class="apk-gate-badge">Launching ' + LAUNCH + '</div>';
      var blurb = live
        ? 'Part of the <strong>All-Access Pass</strong> — the full premium layer of the Analyst Prep Kit. It keeps growing, and everything added later is included at no extra cost. The core lessons stay free, always.'
        : 'The premium layer of the Analyst Prep Kit is in final testing before launch. It keeps growing, and everything added later is included at no extra cost. The core lessons stay free, always.';
      var offer = live
        ? ''
        : '<div class="apk-gate-offer">' +
            '<div class="apk-gate-offer-tag">Founding offer · ends at launch ' + LAUNCH + '</div>' +
            '<div class="apk-gate-juice">Every interview track, the final exam, and new advanced modules as they land — yours for good.</div>' +
            '<div class="apk-gate-price"><span class="apk-gate-amt">' + FOUNDING_PRICE + '</span>' +
            '<span class="apk-gate-per">once · no subscription</span></div>' +
            '<div class="apk-gate-strike">Founding rate · ' + LAUNCH_PRICE + ' at launch. Pay once, keep it — nothing renews.</div>' +
          '</div>';
      var buyLabel = live
        ? 'Get the All-Access Pass — ' + LAUNCH_PRICE + ' once'
        : 'Become a founding member — ' + FOUNDING_PRICE + ' once';
      return '<div class="apk-gate"><div class="apk-gate-card">' +
        badge +
        '<div class="apk-gate-icon"><i data-lucide="' + icon + '"></i></div>' +
        '<h2>' + heading + '</h2>' +
        '<p>' + blurb + '</p>' +
        offer +
        '<a class="apk-gate-buy" href="https://buymeacoffee.com/michaelnocito/e/551812" target="_blank" rel="noopener" ' +
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
    '.lesson-lock{margin-left:6px;opacity:.55;vertical-align:-2px}' +
    // ── Premium "unlocked" treatment (Medium #5) ──
    '.apk-pill{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;' +
    'letter-spacing:.02em;padding:2px 8px;border-radius:99px;vertical-align:1px;white-space:nowrap;line-height:1.4}' +
    '.apk-pill .lucide{width:11px;height:11px}' +
    '.apk-pill-on{background:color-mix(in srgb,var(--good,#3b6d11) 15%,transparent);' +
    'color:var(--good,#3b6d11);border:1px solid color-mix(in srgb,var(--good,#3b6d11) 40%,transparent)}' +
    '.apk-pill-preview{background:color-mix(in srgb,var(--accent,#C5511F) 12%,transparent);' +
    'color:var(--accent,#C5511F);border:1px solid color-mix(in srgb,var(--accent,#C5511F) 35%,transparent)}' +
    '.apk-pill-lock{background:var(--surf2,#f0ece7);color:var(--muted,#777);border:1px solid var(--border,#ddd)}' +
    '.apk-unlocked-banner{display:flex;align-items:center;gap:8px;' +
    'background:color-mix(in srgb,var(--good,#3b6d11) 10%,transparent);' +
    'border:1px solid color-mix(in srgb,var(--good,#3b6d11) 30%,transparent);' +
    'color:var(--text,#222);border-radius:10px;padding:9px 13px;margin:0 0 14px;font-size:13px;line-height:1.45}' +
    '.apk-unlocked-banner .lucide{width:16px;height:16px;color:var(--good,#3b6d11);flex:0 0 auto}' +
    '.apk-unlock-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);opacity:0;' +
    'transition:opacity .3s ease,transform .3s ease;z-index:99999;max-width:92vw}' +
    '.apk-unlock-toast-in{opacity:1;transform:translate(-50%,0)}' +
    '.apk-unlock-toast-card{display:flex;align-items:flex-start;gap:12px;background:var(--surf,#fff);' +
    'border:1px solid var(--accent,#C5511F);border-radius:14px;padding:14px 16px;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.18);max-width:420px}' +
    '.apk-unlock-toast-icon{width:38px;height:38px;flex:0 0 auto;border-radius:50%;' +
    'background:var(--accent,#C5511F);color:#fff;display:flex;align-items:center;justify-content:center}' +
    '.apk-unlock-toast-icon .lucide{width:20px;height:20px}' +
    '.apk-unlock-toast-body{display:flex;flex-direction:column;gap:2px}' +
    '.apk-unlock-toast-body strong{font-size:14px;color:var(--text,#222)}' +
    '.apk-unlock-toast-body span{font-size:12px;color:var(--muted,#666);line-height:1.45}' +
    '.apk-unlock-toast-x{background:none;border:none;color:var(--muted,#999);font-size:20px;' +
    'line-height:1;cursor:pointer;padding:0 2px;align-self:flex-start}';
  document.head.appendChild(css);
})();
