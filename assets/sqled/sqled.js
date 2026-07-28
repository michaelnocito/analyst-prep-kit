/*
  SQLED — the shared SQL editor for the Analyst Prep Kit.

  Why this exists: every SQL box in the kit is a bare textarea, so a learner practising
  here builds none of the habits a real editor rewards. The point of this file is that
  the editor helps the way a work editor helps, and the learner gets used to being
  helped: keywords and column names arrive half-typed, quotes and brackets close
  themselves, and the shape of the query is visible in colour while it is being written.

  It wraps CodeMirror 5, which is loaded from cdnjs alongside sql.js. CodeMirror 5 rather
  than 6 because 6 is ESM-only and would force a build step onto a repo that has none.

  Contract, so a page can adopt this without reading the source:

    const ed = SQLED.attach(document.getElementById('sql'), {
      schema: {table_name: ['col', 'col']},   // powers table and column completion
      onRun: () => {...}                      // Ctrl+Enter, the universal run key
    });
    ed.getValue(); ed.setValue(s); ed.focus(); ed.refresh();

  If CodeMirror fails to load, attach() returns a handle backed by the original textarea.
  A missing CDN must cost the learner autocomplete, never the ability to type a query.
*/
(function () {
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/';

  // cdnjs flattens CodeMirror's lib/ directory to the package root, so the core files
  // are codemirror.min.js and codemirror.min.css while every addon keeps its own path.
  const FILES = [
    ['css', 'codemirror.min.css'],
    ['css', 'addon/hint/show-hint.min.css'],
    ['js',  'codemirror.min.js'],
    ['js',  'mode/sql/sql.min.js'],
    ['js',  'addon/hint/show-hint.min.js'],
    ['js',  'addon/hint/sql-hint.min.js'],
    ['js',  'addon/edit/closebrackets.min.js'],
    ['js',  'addon/edit/matchbrackets.min.js'],
  ];

  // Scripts must run in order: the mode and the addons all register themselves onto the
  // CodeMirror global, so the library has to be parsed before any of them.
  function loadOne(kind, path) {
    return new Promise((resolve, reject) => {
      if (kind === 'css') {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = CDN + path;
        l.onload = resolve; l.onerror = () => reject(new Error(path));
        document.head.appendChild(l);
      } else {
        const s = document.createElement('script');
        s.src = CDN + path; s.async = false;
        s.onload = resolve; s.onerror = () => reject(new Error(path));
        document.head.appendChild(s);
      }
    });
  }

  // CodeMirror's SQLite mode carries a keyword list, not a function list: COUNT happens to
  // be in it, SUM, AVG, MIN, MAX and ROUND are not. That makes completion look broken in a
  // way that is worse than having none, because it fires for one aggregate and not the next
  // one on the same line. These are the functions a working analyst actually reaches for,
  // and they get merged into every completion list below.
  const FUNCTIONS = [
    'AVG', 'COUNT', 'MAX', 'MIN', 'SUM', 'TOTAL', 'GROUP_CONCAT',
    'ROUND', 'ABS', 'CAST', 'COALESCE', 'IFNULL', 'NULLIF', 'IIF',
    'LENGTH', 'LOWER', 'UPPER', 'TRIM', 'LTRIM', 'RTRIM', 'REPLACE',
    'SUBSTR', 'INSTR', 'PRINTF', 'TYPEOF',
    'DATE', 'TIME', 'DATETIME', 'JULIANDAY', 'STRFTIME',
    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE', 'LAG', 'LEAD',
    'FIRST_VALUE', 'LAST_VALUE', 'OVER', 'PARTITION BY'
  ];

  // The stock sql hint, plus the functions above. Anything the stock hint already found is
  // left exactly where it was, so table and column names keep their ranking at the top.
  function hintWithFunctions(cm, options) {
    const base = CodeMirror.hint.sql(cm, options) || { list: [], from: cm.getCursor(), to: cm.getCursor() };
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const word = (token.string || '').replace(/[^\w]/g, '');
    if (word.length < 1) return base;

    const seen = new Set(base.list.map(x => String(x.text || x).toUpperCase()));
    const up = word.toUpperCase();
    const extra = FUNCTIONS.filter(f => f.indexOf(up) === 0 && !seen.has(f));

    // Columns, even before a FROM clause exists. The stock hint only offers column names
    // once it can tell which table is in play, which means the SELECT list, the part a
    // learner types first, is exactly where it stays silent.
    const tables = (options && options.tables) || {};
    Object.keys(tables).forEach(t => {
      (tables[t] || []).forEach(c => {
        const name = String(c.text || c);
        if (name.toUpperCase().indexOf(up) === 0 && !seen.has(name.toUpperCase())) {
          seen.add(name.toUpperCase());
          extra.push(name);
        }
      });
    });

    if (!extra.length) return base;

    return {
      list: base.list.concat(extra),
      from: base.list.length ? base.from : CodeMirror.Pos(cur.line, cur.ch - word.length),
      to: base.list.length ? base.to : cur
    };
  }

  let loading = null;
  function load() {
    if (!loading) {
      loading = (async () => {
        for (const [kind, path] of FILES) await loadOne(kind, path);
      })();
    }
    return loading;
  }

  // The completion list is driven by the schema the page hands over, so the learner sees
  // the real table and column names of the database in front of them and nothing else.
  // Nothing here is scored: a completion is a shortcut, never a hint about correctness.
  function attach(textarea, opts) {
    opts = opts || {};
    const fallback = {
      getValue: () => textarea.value,
      setValue: v => { textarea.value = v; },
      focus: () => textarea.focus({ preventScroll: true }),
      refresh: () => {},
      isReal: false
    };

    const handle = Object.assign({}, fallback);

    // The schema may be a plain object, or a function for pages whose database finishes
    // loading after the editor is on screen. Resolving it at hint time rather than at
    // attach time is what keeps completion correct in both cases.
    const tables = () => {
      const s = typeof opts.schema === 'function' ? opts.schema() : opts.schema;
      return s || {};
    };

    load().then(() => {
      if (typeof CodeMirror === 'undefined') return;

      const cm = CodeMirror.fromTextArea(textarea, {
        mode: 'text/x-sqlite',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,   // typing ( or ' closes itself, as every work editor does
        matchBrackets: true,
        smartIndent: true,
        indentUnit: 2,
        tabSize: 2,
        hintOptions: { hint: hintWithFunctions, completeSingle: false },
        extraKeys: {
          'Ctrl-Space': cmi => cmi.showHint({ hint: hintWithFunctions, tables: tables(), completeSingle: false }),
          'Ctrl-Enter': () => opts.onRun && opts.onRun(),
          'Cmd-Enter': () => opts.onRun && opts.onRun(),
          // Tab indents rather than leaving the editor, which is what a learner expects
          // from every editor they will meet on the job.
          Tab: cmi => cmi.execCommand('indentMore'),
          'Shift-Tab': cmi => cmi.execCommand('indentLess')
        }
      });

      // Autocomplete fires while typing a word or straight after a dot, so the list is
      // there without anyone having to know a shortcut exists. Everything else, including
      // the moment a completion is being accepted, is left alone.
      cm.on('inputRead', (cmi, change) => {
        if (change.origin !== '+input') return;
        const typed = change.text[0];
        if (!/[\w.]/.test(typed)) return;
        if (cmi.state.completionActive) return;
        cmi.showHint({ hint: hintWithFunctions, tables: tables(), completeSingle: false });
      });

      Object.assign(handle, {
        getValue: () => cm.getValue(),
        setValue: v => { cm.setValue(v); cm.clearHistory(); },
        focus: () => cm.focus(),
        refresh: () => cm.refresh(),
        cm,
        isReal: true
      });

      if (opts.onReady) opts.onReady(handle);
    }).catch(() => {
      // Left on the textarea deliberately. Silent degradation beats a broken page.
    });

    return handle;
  }

  // upgrade() is attach() for pages that already talk to the textarea directly, which is
  // every SQL box in the kits: they read el.value, write el.value, and call el.focus().
  // Rather than rewrite those call sites, the element's own value property is redefined
  // to read and write the editor. Existing code keeps working untouched and the learner
  // gets the real editor.
  function upgrade(textarea, opts) {
    if (!textarea || textarea.dataset.sqled) return null;
    textarea.dataset.sqled = '1';

    const handle = attach(textarea, Object.assign({}, opts, {
      onReady: h => {
        const cm = h.cm;

        Object.defineProperty(textarea, 'value', {
          configurable: true,
          get: () => cm.getValue(),
          set: v => { cm.setValue(v == null ? '' : String(v)); }
        });
        textarea.focus = () => cm.focus();
        // Anything watching the textarea for input still hears about it.
        cm.on('change', () => textarea.dispatchEvent(new Event('input', {bubbles: true})));

        if (opts && opts.onReady) opts.onReady(h);
      }
    }));
    return handle;
  }

  // Convenience: build the completion schema straight from a live sql.js database, so a
  // page never has to hand maintain a column list that the database already knows.
  function schemaFromDb(db) {
    const schema = {};
    const res = db.exec("SELECT name FROM sqlite_master WHERE type = 'table'");
    if (!res.length) return schema;
    res[0].values.forEach(([t]) => {
      const info = db.exec('PRAGMA table_info(' + t + ')');
      schema[t] = info.length ? info[0].values.map(r => r[1]) : [];
    });
    return schema;
  }

  window.SQLED = { attach, upgrade, load, schemaFromDb };
})();
