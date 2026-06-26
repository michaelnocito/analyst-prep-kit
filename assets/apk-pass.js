/* ============================================================
   Analyst Prep Kit — Interview Prep Pass (client-side unlock).
   Static GitHub-Pages gate: a buyer gets the unlock code in the
   Buy Me a Coffee post-purchase message, pastes it into any kit,
   and premium lessons unlock (stored in localStorage['apk-pass']).
   Client-side only — best-effort by nature; acceptable at $15.

   Each kit decides WHICH lessons are premium and calls:
     window.apkPass.isUnlocked()      -> boolean
     window.apkPass.gateHTML({title}) -> paywall HTML (render into #main)
     window.apkPass.setKit('sql')     -> label GA4 events

   Unlock code (set this in the BMC product's post-purchase message):
     PREP-PASS-2026
   ============================================================ */
(function () {
  var KEY = 'apk-pass';
  var TARGET = 2935497303; // djb2 hash of the code, uppercased

  function h(s) {
    var n = 5381;
    for (var i = 0; i < s.length; i++) { n = ((n << 5) + n + s.charCodeAt(i)) >>> 0; }
    return n;
  }

  var api = {
    _kit: '',
    setKit: function (k) { this._kit = k || ''; },
    isUnlocked: function () {
      try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    },
    unlock: function (code) {
      if (h(String(code).trim().toUpperCase()) === TARGET) {
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
        return true;
      }
      return false;
    },
    lock: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    gateHTML: function (opts) {
      opts = opts || {};
      var title = opts.title || 'Premium lesson';
      return '<div class="apk-gate"><div class="apk-gate-card">' +
        '<div class="apk-gate-icon"><i data-lucide="lock"></i></div>' +
        '<h2>' + title + '</h2>' +
        '<p>Part of the <strong>Interview Prep Pass</strong> — the interview tracks, mock exams, ' +
        'and deep practice that get you interview-ready. The core lessons stay free, always.</p>' +
        '<a class="apk-gate-buy" href="https://buymeacoffee.com/michaelnocito/extras" target="_blank" rel="noopener" ' +
        'onclick="if(window.gtag)gtag(\'event\',\'pass_buy_click\',{kit:apkPass._kit})">Get the Interview Prep Pass — $15</a>' +
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
        if (window.gtag) gtag('event', 'pass_unlock', { kit: api._kit });
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
    '.apk-gate-card{max-width:440px;text-align:center;background:var(--surf,#fff);' +
    'border:1px solid var(--border,#e0d9d2);border-radius:14px;padding:30px 26px}' +
    '.apk-gate-icon{width:46px;height:46px;border-radius:50%;margin:0 auto 14px;display:flex;' +
    'align-items:center;justify-content:center;background:var(--accent,#C5511F);color:#fff}' +
    '.apk-gate-card h2{margin:0 0 8px;font-size:20px}' +
    '.apk-gate-card p{color:var(--muted,#666);font-size:14px;line-height:1.55;margin:0 0 18px}' +
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
