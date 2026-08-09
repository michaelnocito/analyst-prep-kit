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
    '.apk-eco-sep{margin:0 10px;opacity:.45}' +
    '.apk-eco-tm{display:block;margin-top:10px;font-size:11px;opacity:.7;max-width:560px;' +
    'margin-left:auto;margin-right:auto}';
  document.head.appendChild(css);

  // SQL-only cross-sell: the prompt pack is a SQL product, so it appears on the
  // SQL surfaces and nowhere else rather than on every kit's footer.
  var SQL_KITS = { sql: 1, 'sql-dry-run': 1 };
  var packLink = SQL_KITS[kit]
    ? '<a class="apk-eco-pack" href="https://michaelnocito.gumroad.com/l/sql-prompt-pack" ' +
      'target="_blank" rel="noopener">SQL Teaching-Comment Prompt Pack ↗</a>' +
      '<span class="apk-eco-sep">·</span>'
    : '';

  var f = document.createElement('footer');
  f.className = 'apk-eco-footer';
  f.innerHTML =
    packLink +
    '<a href="https://github.com/michaelnocito/analyst-prep-kit" target="_blank" rel="noopener">GitHub</a>' +
    '<span class="apk-eco-sep">·</span>' +
    '<a class="apk-eco-coffee" href="https://buymeacoffee.com/michaelnocito" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>' +
    '<span class="apk-eco-sep">·</span>' +
    '<a href="../">← All kits</a>' +
    '<span class="apk-eco-tm">Power BI and Excel are trademarks of Microsoft; Tableau is a trademark of Salesforce. ' +
    'Used for identification only. The Analyst Prep Kit is independent and not affiliated with or endorsed by these companies.</span>';
  document.body.appendChild(f);

  f.querySelector('.apk-eco-coffee').addEventListener('click', function () {
    if (window.gtag) {
      gtag('event', 'support_click', { kit: kit, method: 'buymeacoffee' });
    }
  });

  var pack = f.querySelector('.apk-eco-pack');
  if (pack) {
    pack.addEventListener('click', function () {
      if (window.gtag) {
        gtag('event', 'prompt_pack_click', { kit: kit });
      }
    });
  }

  /* ----------------------------------------------------------
     Book card. Sits directly above the footer on the kit hubs.
     Opt-in by path segment: a kit with no entry here gets no
     card, which is why the app shells (drill, final, simulator)
     stay clean. Prices verified against the live Gumroad
     listings 2026-08-09; page counts are the 2026-08-09 rebuild.
     ---------------------------------------------------------- */
  var BOOKS = {
    excel: {
      slug: 'excel-for-analysts', title: 'Excel for Analysts', price: '$19', pages: 378,
      hook: 'You can build the pivot. The stall comes when the Grand Total does not match the source column and nothing on screen says why.',
      what: 'every formula read argument by argument in plain words, with practice questions that print the answer and the reason it is right'
    },
    sql: {
      slug: 'sql-for-analysts', title: 'SQL for Analysts', price: '$19', pages: 458,
      hook: 'You can write a SELECT. The stall comes when somebody says join those and tell me why the totals moved.',
      what: 'every query read line by line in plain words, with practice questions that print the answer and the reason it is right'
    },
    tableau: {
      slug: 'tableau-for-analysts', title: 'Tableau for Analysts', price: '$19', pages: 128,
      hook: 'The chart draws itself. The stall comes when two sheets on the same data show two different totals.',
      what: 'relationships, level of detail and table calculations worked through one decision at a time'
    },
    python: {
      slug: 'python-for-analysts', title: 'Python for Analysts', price: '$19', pages: 203,
      hook: 'The notebook runs clean. The stall comes when a merge quietly doubles your row count and the code never complains.',
      what: 'pandas read line by line in plain words, with the checks that catch a bad join before it reaches a chart'
    },
    powerbi: {
      slug: 'power-bi-for-analysts', title: 'Power BI for Analysts', price: '$19', pages: 187,
      hook: 'The visual loads. The stall comes when the measure and the column give two different numbers for the same thing.',
      what: 'DAX, the star schema and filter context explained in the order the questions actually arrive'
    },
    stats: {
      slug: 'statistics-for-analysts', title: 'Statistics for Analysts', price: '$19', pages: 123,
      hook: 'You have the two averages. The stall comes when somebody asks whether the gap between them is real.',
      what: 'spread, p-values, confidence intervals and A/B tests written for people who have to present the answer'
    },
    forecasting: {
      slug: 'forecasting-for-analysts', title: 'Forecasting for Analysts', price: '$12', pages: 43,
      hook: 'The line goes up. The stall comes when somebody asks how far ahead you are willing to say that out loud.',
      what: 'moving averages, seasonality and forecast accuracy, including how to state what the number cannot tell you'
    },
    'chart-literacy': {
      slug: 'charts-and-visualization', title: 'Charts and Visualization', price: '$12', pages: 42,
      hook: 'The chart is accurate and still reads wrong to the room.',
      what: 'picking the mark, ordering the bars and cutting the axis, with the misleads shown side by side'
    },
    viz: {
      slug: 'charts-and-visualization', title: 'Charts and Visualization', price: '$12', pages: 42,
      hook: 'The chart is accurate and still reads wrong to the room.',
      what: 'picking the mark, ordering the bars and cutting the axis, with the misleads shown side by side'
    },
    interview: {
      slug: 'thinking-like-an-analyst', title: 'Thinking Like an Analyst', price: '$19', pages: 64,
      hook: 'You know the work. The interview asks you to say it out loud in ninety seconds.',
      what: 'the reasoning behind the answer, so you can talk through a problem instead of reciting a formula'
    },
    projects: {
      slug: 'thinking-like-an-analyst', title: 'Thinking Like an Analyst', price: '$19', pages: 64,
      hook: 'A finished project is not the same as a project you can explain.',
      what: 'how an analyst frames a question, checks their own work and writes up what the numbers do not settle'
    },
    path: {
      slug: 'thinking-like-an-analyst', title: 'Thinking Like an Analyst', price: '$19', pages: 64,
      hook: 'Tools are the easy half. The other half is knowing which question you are answering.',
      what: 'how an analyst frames a question, checks their own work and writes up what the numbers do not settle'
    },
    guides: {
      slug: 'thinking-like-an-analyst', title: 'Thinking Like an Analyst', price: '$19', pages: 64,
      hook: 'Every guide here answers one question. The habit underneath them is the same one.',
      what: 'how an analyst frames a question, checks their own work and writes up what the numbers do not settle'
    }
  };

  var book = BOOKS[kit];
  if (!book) return;

  var bcss = document.createElement('style');
  bcss.textContent =
    '.apk-book{max-width:760px;margin:44px auto 0;padding:18px 22px;' +
    'border:1px solid var(--border,#e0d9d2);border-left:4px solid var(--accent,#C5511F);' +
    'border-radius:12px;font-family:inherit;font-size:15px;line-height:1.6;text-align:left}' +
    '.apk-book strong{display:block;margin-bottom:8px}' +
    '.apk-book p{margin:0;color:var(--muted,#888);font-size:14px}' +
    '.apk-book a{display:inline-block;margin-top:12px;font-weight:600;' +
    'color:var(--accent,#C5511F);text-decoration:none}' +
    '.apk-book a:hover{text-decoration:underline}';
  document.head.appendChild(bcss);

  var b = document.createElement('aside');
  b.className = 'apk-book';
  b.innerHTML =
    '<strong>' + book.hook + '</strong>' +
    '<p><em>' + book.title + '</em> is ' + book.pages + ' pages, ' + book.what + '.</p>' +
    '<a class="apk-book-link" href="https://michaelnocito.gumroad.com/l/' + book.slug + '" ' +
    'target="_blank" rel="noopener">' + book.title + ', ' + book.price + ' &rarr;</a>';
  document.body.insertBefore(b, f);

  b.querySelector('.apk-book-link').addEventListener('click', function () {
    if (window.gtag) {
      gtag('event', 'hub_book_click', { kit: kit, book: book.slug });
    }
  });
})();
