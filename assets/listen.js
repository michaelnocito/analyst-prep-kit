/* ============================================================================
   listen.js — "Listen" for a written page.

   Drop-in: <script defer src="/analyst-prep-kit/assets/listen.js"></script>
   Nothing else. It finds the article, inserts one small Listen control under
   the byline, and reads the page aloud with the browser's own speech engine.
   No account, no network call, no audio file to host.

   Why it is built this way
   -----------------------
   - One tap to start. The whole point is low friction, so the entry control is
     a single button, not a player. The transport bar only exists once audio is
     actually playing, because until then there is nothing to transport.
   - It speaks one BLOCK at a time (a paragraph, a heading, a list item) rather
     than one long utterance. Three reasons: `onboundary` word events are not
     reliable on iOS, long utterances get cut off in Chrome, and per-block
     speech gives us paragraph skip and "tap a paragraph to start here" for
     free.
   - iOS Safari refuses speechSynthesis.speak() unless it happens inside a real
     user gesture. Every code path that starts audio therefore runs directly in
     a click handler. Never move a speak() call behind a timer or a promise.
   ========================================================================== */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  // ---- What gets read -------------------------------------------------------
  // Blocks in document order. Anything navigational, decorative, or unreadable
  // aloud is excluded here rather than being cleaned up later.
  var BLOCKS = 'h1, h2, h3, p, li, blockquote, figcaption';
  var SKIP_INSIDE = '.crumb, .morelinks, .toc, nav, footer, .listen-bar, .listen-launch';

  // Code and tables are read as a short marker instead of their contents.
  // A screenful of SQL read character by character is not listening, it is
  // punishment, and a table read left to right loses the column meanings.
  var MARKERS = [
    { sel: 'pre', say: 'A code example follows on screen.' },
    { sel: 'table', say: 'A table follows on screen.' },
    // Author, year, journal, DOI is reference apparatus. Read aloud it is a
    // wall of numbers, and nobody listening is writing down a DOI.
    { sel: 'ul.refs, ol.refs', say: 'The references are listed on screen.' }
  ];

  function visible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function collect(root) {
    var out = [];
    var seen = new Set();
    var all = root.querySelectorAll(BLOCKS + ', pre, table');

    Array.prototype.forEach.call(all, function (el) {
      if (el.closest(SKIP_INSIDE)) return;
      if (!visible(el)) return;
      // A <p> inside a <blockquote> would otherwise be read twice.
      if (seen.has(el)) return;

      var marker = null;
      for (var i = 0; i < MARKERS.length; i++) {
        if (el.matches(MARKERS[i].sel)) { marker = MARKERS[i].say; break; }
      }
      if (marker) {
        el.querySelectorAll(BLOCKS).forEach(function (c) { seen.add(c); });
        out.push({ el: el, text: marker });
        return;
      }
      if (el.closest('pre, table, ul.refs, ol.refs')) return;

      var text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length < 2) return;
      seen.add(el);
      out.push({ el: el, text: text });
    });

    return out;
  }

  // ---- Voice ---------------------------------------------------------------
  // getVoices() is populated asynchronously in Chrome, Edge and Firefox, so the
  // first call can legitimately return an empty list. Prefer a local voice so
  // playback keeps working with no network.
  var voice = null;
  function pickVoice() {
    var voices = synth.getVoices() || [];
    if (!voices.length) return null;
    var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
    var pool = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lang) === 0; });
    if (!pool.length) pool = voices;
    var local = pool.filter(function (v) { return v.localService; });
    if (local.length) pool = local;
    // Apple's Samantha and Google's UK/US English are the least robotic of the
    // defaults; otherwise take whatever the platform put first.
    var preferred = ['Samantha', 'Google UK English Female', 'Google US English', 'Microsoft Aria'];
    for (var i = 0; i < preferred.length; i++) {
      var hit = pool.find(function (v) { return v.name.indexOf(preferred[i]) !== -1; });
      if (hit) return hit;
    }
    return pool[0];
  }
  pickVoice();
  if (synth.onvoiceschanged !== undefined) {
    synth.addEventListener('voiceschanged', function () { voice = pickVoice(); });
  }

  // ---- Styles --------------------------------------------------------------
  // Injected rather than shipped as a second file, so adding this to a page is
  // one script tag and nothing else. Colors defer to whatever the host page
  // already defines and fall back to the Zinc & Sky values.
  var CSS = [
    '.listen-launch{display:inline-flex;align-items:center;gap:8px;margin:2px 0 18px;',
    'font:600 13px/1 var(--font-sans,inherit);color:var(--accent,#0E7490);',
    'background:transparent;border:1px solid var(--line,#E4E7EA);border-radius:999px;',
    'padding:8px 15px;cursor:pointer;transition:background .15s,border-color .15s}',
    '.listen-launch:hover{background:var(--accent-soft,#E0F5F9);border-color:var(--accent,#0E7490)}',
    '.listen-launch:focus-visible{outline:2px solid var(--accent,#0E7490);outline-offset:2px}',
    '.listen-launch-ic{font-size:10px}',
    '.listen-launch-time{color:var(--muted,#52525B);font-weight:400}',
    '.listen-launch-time:before{content:"\\00b7";margin-right:8px}',

    '.listen-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:60;',
    'display:flex;align-items:center;gap:4px;padding:6px 8px;border-radius:999px;',
    'background:var(--card,var(--panel,#fff));border:1px solid var(--line,var(--border,#E4E7EA));',
    'box-shadow:0 6px 24px rgba(9,9,11,.16);font:500 13px/1 var(--font-sans,inherit)}',
    '.listen-bar[hidden]{display:none}',
    '.listen-bar button{min-width:34px;height:34px;border:0;border-radius:999px;cursor:pointer;',
    'background:transparent;color:var(--ink,var(--text,#09090B));font-size:12px;padding:0 6px}',
    '.listen-bar button:hover{background:var(--sunken,rgba(127,127,127,.14))}',
    '.listen-bar .listen-play{background:var(--accent,#0E7490);color:#fff}',
    '.listen-bar .listen-play:hover{opacity:.9;background:var(--accent,#0E7490)}',
    '.listen-count{color:var(--muted,#52525B);padding:0 8px;font-variant-numeric:tabular-nums}',
    '.listen-rate{font-variant-numeric:tabular-nums}',

    // The read-along highlight is deliberately faint. It marks where the voice
    // is without turning the page into a karaoke screen.
    '.listen-now{background:var(--accent-soft,#E0F5F9);box-shadow:0 0 0 6px var(--accent-soft,#E0F5F9);',
    'border-radius:3px}',
    '@media (prefers-color-scheme:dark){.listen-now{background:rgba(56,189,248,.14);',
    'box-shadow:0 0 0 6px rgba(56,189,248,.14)}}',
    '@media (prefers-reduced-motion:reduce){.listen-now{transition:none}}',
    '@media print{.listen-launch,.listen-bar{display:none}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // ---- State ---------------------------------------------------------------
  var blocks = [];
  var idx = -1;
  var playing = false;
  var rate = 1;
  var root, launch, bar, playBtn, label, rateBtn;

  function speakFrom(i, fromGesture) {
    if (i < 0 || i >= blocks.length) { stop(); return; }
    synth.cancel();
    idx = i;
    highlight();

    var u = new SpeechSynthesisUtterance(blocks[i].text);
    if (!voice) voice = pickVoice();
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = rate;
    u.onend = function () {
      if (!playing) return;
      // Chaining the next block from onend is safe: iOS treats the whole
      // sequence as belonging to the gesture that started it.
      if (idx + 1 < blocks.length) speakFrom(idx + 1);
      else stop();
    };
    u.onerror = function (e) {
      // "interrupted" and "canceled" are what we cause ourselves via cancel().
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      stop();
    };

    playing = true;
    render();
    synth.speak(u);
    if (fromGesture) keepAlive();
  }

  // Chrome pauses synthesis after roughly fifteen seconds of a single
  // utterance. Poking resume() on a timer is the long-standing workaround.
  var aliveTimer = null;
  function keepAlive() {
    clearInterval(aliveTimer);
    aliveTimer = setInterval(function () {
      if (!playing) { clearInterval(aliveTimer); return; }
      if (synth.speaking && !synth.paused) { synth.pause(); synth.resume(); }
    }, 10000);
  }

  function stop() {
    playing = false;
    clearInterval(aliveTimer);
    synth.cancel();
    idx = -1;
    highlight();
    render();
  }

  function pause() { synth.pause(); playing = false; render(); }
  function resume() { synth.resume(); playing = true; render(); keepAlive(); }

  function highlight() {
    blocks.forEach(function (b, i) {
      b.el.classList.toggle('listen-now', i === idx);
    });
    if (idx > -1 && blocks[idx]) {
      var r = blocks[idx].el.getBoundingClientRect();
      if (r.top < 60 || r.bottom > innerHeight - 90) {
        blocks[idx].el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  // ---- UI ------------------------------------------------------------------
  function render() {
    if (!launch) return;
    var on = playing || synth.paused;
    launch.setAttribute('aria-pressed', on ? 'true' : 'false');
    launch.querySelector('.listen-launch-text').textContent = on ? 'Listening' : 'Listen';
    if (bar) {
      bar.hidden = !on;
      playBtn.textContent = playing ? '❙❙' : '▶';
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      var n = blocks.length ? Math.min(idx + 1, blocks.length) : 0;
      label.textContent = n + ' of ' + blocks.length;
      rateBtn.textContent = rate + '×';
    }
  }

  function buildBar() {
    bar = document.createElement('div');
    bar.className = 'listen-bar';
    bar.hidden = true;
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Listening controls');
    bar.innerHTML =
      '<button type="button" data-act="prev" aria-label="Previous paragraph">◀◀</button>' +
      '<button type="button" data-act="play" class="listen-play" aria-label="Pause">❙❙</button>' +
      '<button type="button" data-act="next" aria-label="Next paragraph">▶▶</button>' +
      '<span class="listen-count" aria-live="off">0 of 0</span>' +
      '<button type="button" data-act="rate" class="listen-rate" aria-label="Playback speed">1×</button>' +
      '<button type="button" data-act="stop" aria-label="Stop listening">✕</button>';
    document.body.appendChild(bar);
    playBtn = bar.querySelector('[data-act="play"]');
    label = bar.querySelector('.listen-count');
    rateBtn = bar.querySelector('[data-act="rate"]');

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'play') { playing ? pause() : (synth.paused ? resume() : speakFrom(0, true)); }
      else if (act === 'next') { speakFrom(Math.min(idx + 1, blocks.length - 1), true); }
      else if (act === 'prev') { speakFrom(Math.max(idx - 1, 0), true); }
      else if (act === 'stop') { stop(); }
      else if (act === 'rate') {
        rate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.85 : 1;
        if (playing) speakFrom(idx, true); else render();
      }
    });
  }

  function buildLaunch(anchor) {
    launch = document.createElement('button');
    launch.type = 'button';
    launch.className = 'listen-launch';
    launch.setAttribute('aria-pressed', 'false');
    launch.innerHTML =
      '<span class="listen-launch-ic" aria-hidden="true">▶</span>' +
      '<span class="listen-launch-text">Listen</span>' +
      '<span class="listen-launch-time"></span>';
    launch.addEventListener('click', function () {
      if (playing) { pause(); return; }
      if (synth.paused && idx > -1) { resume(); return; }
      speakFrom(0, true);
    });
    anchor.insertAdjacentElement('afterend', launch);
  }

  function minutes() {
    var words = blocks.reduce(function (n, b) { return n + b.text.split(' ').length; }, 0);
    // ~155 wpm is a comfortable synthetic-speech pace.
    return Math.max(1, Math.round(words / 155));
  }

  function init() {
    root = document.querySelector('[data-listen-root]') || document.querySelector('main') || document.body;
    blocks = collect(root);
    if (blocks.length < 3) return;

    // Under the byline/standfirst if there is one, otherwise under the title.
    // Order matters: a selector list returns whichever comes first in the
    // document, and we want the control BELOW the byline, not above it.
    var anchor = null;
    ['.byline', '.meta', '.standfirst', 'h1'].some(function (s) {
      anchor = (document.querySelector('header') || root).querySelector(s) || root.querySelector(s);
      return !!anchor;
    });
    if (!anchor) anchor = root.firstElementChild;
    if (!anchor) return;

    buildLaunch(anchor);
    buildBar();
    launch.querySelector('.listen-launch-time').textContent = minutes() + ' min';

    // Tap any paragraph while listening to jump there.
    root.addEventListener('click', function (e) {
      if (!playing && !synth.paused) return;
      var hit = -1;
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].el === e.target || blocks[i].el.contains(e.target)) { hit = i; break; }
      }
      if (hit > -1) speakFrom(hit, true);
    });

    // Leaving the page with the voice still running is genuinely alarming.
    addEventListener('pagehide', function () { synth.cancel(); });
    addEventListener('beforeunload', function () { synth.cancel(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && playing) pause();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
