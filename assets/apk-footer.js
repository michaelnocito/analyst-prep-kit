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
    'border-top:1px solid var(--border,var(--bord,var(--line,#e0d9d2)));color:var(--muted,var(--dim,var(--txt2,#6B7280)));' +
    'font-size:13px;font-family:inherit;line-height:1.6}' +
    '.apk-eco-footer a{color:var(--muted,var(--dim,var(--txt2,#6B7280)));text-decoration:none;transition:color .15s}' +
    '.apk-eco-footer a:hover{color:var(--accent,#C5511F)}' +
    '.apk-eco-sep{margin:0 10px;opacity:.7}' +
    '.apk-eco-tm{display:block;margin-top:10px;font-size:11px;opacity:.7;max-width:560px;' +
    'margin-left:auto;margin-right:auto}';
  document.head.appendChild(css);

  /* ----------------------------------------------------------
     Paid cross-sells in the footer line. Both are opt-in by kit
     rather than sitewide: a product only appears on the surfaces
     where a reader is already doing that product's work.

       The SQL Comment System ($29) -> the SQL surfaces.
       The Data Analyst OS ($49)    -> SQL and Excel, the two kits
                                       whose readers are doing the
                                       job the OS runs workflows for.

     Each fires its own GA4 event so the two funnels stay separable.
     ---------------------------------------------------------- */
  var CROSS = [
    { kits: { sql: 1, 'sql-dry-run': 1 },
      cls: 'apk-eco-pack', ev: 'comment_system_click',
      slug: 'sql-comment-system', label: 'The SQL Comment System' },
    { kits: { sql: 1, 'sql-dry-run': 1, excel: 1 },
      cls: 'apk-eco-os', ev: 'analyst_os_click',
      slug: 'analyst-os', label: 'The Data Analyst OS' }
  ];

  var packLink = CROSS.filter(function (c) { return c.kits[kit]; }).map(function (c) {
    return '<a class="' + c.cls + '" href="https://michaelnocito.gumroad.com/l/' + c.slug +
      '?utm_source=analyst-prep-kit&utm_medium=kit-footer&utm_campaign=' + c.slug + '" ' +
      'target="_blank" rel="noopener">' + c.label + ' ↗</a>' +
      '<span class="apk-eco-sep">·</span>';
  }).join('');

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

  CROSS.forEach(function (c) {
    var a = f.querySelector('.' + c.cls);
    if (!a) return;
    a.addEventListener('click', function () {
      if (window.gtag) {
        gtag('event', c.ev, { kit: kit });
      }
    });
  });

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

  /* ----------------------------------------------------------
     One page out of the book, keyed by slug. This is the graphic
     on the card, and the shape of it is deliberate.

     Mike asked for "a fun graphic" here. The obvious move is a
     cover image or a banner, and that is the one move the
     evidence says not to make: readers systematically look past
     anything sitting in an ad-shaped slot, even when it holds
     the exact thing they were hunting for (Benway 1998, Proc.
     Human Factors & Ergonomics Society 42(5):463-467). Making
     this MORE advertisement-shaped would make it less read.

     So the graphic is a sample instead: a torn-out page showing
     the book actually doing the thing the copy claims it does.
     It is content-shaped rather than banner-shaped, it is fun
     because it reads as a physical page, and it argues the case
     rather than asserting it. Every sample below is real: a line
     the book covers, plus the plain-words read-out that IS the
     format being sold.
     ---------------------------------------------------------- */
  var PAGES = {
    'sql-for-analysts': { p: 'p. 212', code: [
        'SELECT c.name, SUM(o.amount)', 'FROM customers c',
        'JOIN orders o ON o.customer_id = c.id', 'GROUP BY c.name;'],
      say: 'One row per customer. The JOIN can repeat a customer, and GROUP BY folds those copies back into one.' },
    'excel-for-analysts': { p: 'p. 104', code: ['=SUMIFS(D:D, A:A, "West", B:B, ">="&E2)'],
      say: 'Add up column D, but only on rows where column A is West and the date in column B is on or after E2.' },
    'tableau-for-analysts': { p: 'p. 61', code: ['{ FIXED [Customer] : SUM([Sales]) }'],
      say: 'Total per customer, worked out before any filter on the sheet gets to touch it.' },
    'python-for-analysts': { p: 'p. 88', code: ["df.merge(orders, on='customer_id', how='left')"],
      say: 'Keep every customer. A left merge cannot drop a row, but it can quietly duplicate one.' },
    'power-bi-for-analysts': { p: 'p. 73', code: ['Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])'],
      say: 'Multiply row by row, then add the rows up. A calculated column would have multiplied once and stored it.' },
    'statistics-for-analysts': { p: 'p. 46', code: ['p = 0.03'],
      say: 'If nothing were really going on, you would still see a gap this big about three times in a hundred.' },
    'forecasting-for-analysts': { p: 'p. 29', code: ['MAPE = 8.4%'],
      say: 'On average the forecast was 8.4% off. Check whether one bad month is carrying that number on its own.' },
    'charts-and-visualization': { p: 'p. 18', code: ['Sort the bars by value, not by name.'],
      say: 'The reader is ranking them anyway. Alphabetical order just makes them do it in their head first.' },
    'thinking-like-an-analyst': { p: 'p. 31', code: ['What changes if this number is wrong?'],
      say: 'Ask before the analysis, not after. The answer tells you how much checking the number is worth.' }
  };

  var book = BOOKS[kit];
  if (!book) return;
  var pg = PAGES[book.slug];

  var bcss = document.createElement('style');
  bcss.textContent =
    '.apk-book{max-width:760px;margin:44px auto 0;padding:18px 22px;' +
    'border:1px solid var(--border,var(--bord,var(--line,#e0d9d2)));border-left:4px solid var(--accent,#C5511F);' +
    'border-radius:12px;font-family:inherit;font-size:15px;line-height:1.6;text-align:left;' +
    'display:grid;grid-template-columns:1fr;gap:16px}' +
    '.apk-book-body strong{display:block;margin-bottom:8px}' +
    '.apk-book-body p{margin:0;color:var(--muted,var(--dim,var(--txt2,#6B7280)));font-size:14px}' +
    '.apk-book a{display:inline-block;margin-top:12px;font-weight:600;' +
    'color:var(--accent,#C5511F);text-decoration:none}' +
    '.apk-book a:hover{text-decoration:underline}' +
    /* The page. A folded top-right corner, a page number, and a hairline rule
       under the code, so it reads as paper rather than as a callout box. */
    '.apk-book-pg{position:relative;padding:13px 14px 22px;border:1px solid var(--border,var(--bord,var(--line,#e0d9d2)));' +
    'border-radius:3px;background:var(--surf,var(--panel,var(--surface,#fff)));overflow:hidden}' +
    '.apk-book-pg:after{content:"";position:absolute;top:0;right:0;border-width:0 15px 15px 0;' +
    'border-style:solid;border-color:transparent var(--bg,#f5f0e9) transparent transparent}' +
    '.apk-book-pg code{display:block;font-family:var(--mono,ui-monospace,SFMono-Regular,Menlo,monospace);' +
    'font-size:11.5px;line-height:1.55;color:var(--text,var(--txt,var(--ink,#222)));white-space:pre-wrap;word-break:break-word}' +
    '.apk-book-pg .sy{display:block;margin-top:9px;padding-top:8px;border-top:1px solid var(--border,var(--bord,var(--line,#e0d9d2)));' +
    'font-size:12px;line-height:1.5;color:var(--muted,var(--dim,var(--txt2,#6B7280)));font-style:italic}' +
    '.apk-book-pg .pn{position:absolute;bottom:5px;right:10px;font-size:10px;letter-spacing:.05em;' +
    'color:var(--muted,var(--dim,var(--txt2,#6B7280)));opacity:.7}' +
    '@media(min-width:660px){.apk-book.has-pg{grid-template-columns:minmax(0,1fr) 250px;align-items:start}' +
    '.apk-book.has-pg .apk-book-pg{order:2}}';
  document.head.appendChild(bcss);

  var b = document.createElement('aside');
  b.className = 'apk-book' + (pg ? ' has-pg' : '');
  var esc = function (t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  b.innerHTML =
    (pg ? '<div class="apk-book-pg"><code>' + pg.code.map(esc).join('\n') + '</code>' +
          '<span class="sy">' + esc(pg.say) + '</span>' +
          '<span class="pn">' + esc(pg.p) + '</span></div>' : '') +
    '<div class="apk-book-body">' +
    '<strong>' + book.hook + '</strong>' +
    '<p><em>' + book.title + '</em> is ' + book.pages + ' pages, ' + book.what + '.</p>' +
    '<a class="apk-book-link" href="https://michaelnocito.gumroad.com/l/' + book.slug +
    '?utm_source=analyst-prep-kit&utm_medium=kit-hub&utm_campaign=' + book.slug + '" ' +
    'target="_blank" rel="noopener">' + book.title + ', ' + book.price + ' &rarr;</a>' +
    '</div>';
  document.body.insertBefore(b, f);

  b.querySelector('.apk-book-link').addEventListener('click', function () {
    if (window.gtag) {
      gtag('event', 'hub_book_click', { kit: kit, book: book.slug });
    }
  });
})();
