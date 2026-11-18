/* View counter for noob_dev, using GoatCounter (no cookies, nothing that identifies a person).
   - Counts one view of the current page (only on the real site, never on a local preview).
   - Shows views on each devlog episode, on the episode cards, and the site total in the footer.
   - Visit any page with #nocount once to stop counting your own visits on this browser (#count turns it back on).
   No third-party script is loaded: this file sends the count itself. */
(function () {
  'use strict';
  var GC = 'https://noobdev.goatcounter.com';
  var LIVE = location.hostname === 'coolboy450.github.io';
  var TH = (document.documentElement.lang || '').indexOf('th') === 0;
  var KEY = 'noob-nocount';

  function store(get, val) {
    try { if (get) return localStorage.getItem(KEY); if (val) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) { return null; }
  }
  if (location.hash === '#nocount') store(false, true);
  if (location.hash === '#count') store(false, false);
  var skip = store(true) === '1';

  // one path per page: "/devlog/" and "/devlog/index.html" are the same page.
  // GoatCounter stores "/devlog" (no trailing slash), so strip it to match when reading counts.
  function norm(p) {
    p = p.replace(/index\.html$/, '');
    try { p = decodeURI(p); } catch (e) {}
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
  }
  var here = norm(location.pathname);

  function count() {
    if (!LIVE || skip || navigator.webdriver) return;
    var q = 'p=' + encodeURIComponent(here) + '&t=' + encodeURIComponent(document.title) +
      '&r=' + encodeURIComponent(document.referrer || '') + '&s=' + encodeURIComponent([screen.width, screen.height, window.devicePixelRatio || 1].join(',')) + '&rnd=' + Math.random().toString(36).slice(2);
    var img = new Image(); img.alt = ''; img.src = GC + '/count?' + q;   // a 1x1 image request, same as GoatCounter's own no-JS option
  }

  // note: GoatCounter caches these public counts for up to 4 hours, so new views show up late
  function views(path, cb) {
    fetch(GC + '/counter/' + encodeURIComponent(path) + '.json', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.count != null) cb(String(j.count).replace(/\s/g, '')); })
      .catch(function () { /* counter unavailable: just show nothing */ });
  }
  var label = function (n) { return TH ? 'อ่านแล้ว ' + n + ' ครั้ง' : n + (n === '1' ? ' view' : ' views'); };
  function badge(n, cls) {
    var s = document.createElement('span'); s.className = cls;
    s.textContent = '👁 ' + label(n); s.setAttribute('title', TH ? 'จำนวนครั้งที่เปิดหน้านี้' : 'How many times this page was opened');
    return s;
  }
  var css = '.views{font:400 12px/1.7 var(--font-mono,monospace);color:var(--muted,#5E6570);white-space:nowrap}' +
    '.meta .views::before{content:"·";margin:0 8px 0 4px}.ep .views{display:block}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function show() {
    // 1) this episode / movie page
    var meta = document.querySelector('article.article .meta');
    if (meta) views(here, function (n) { meta.appendChild(badge(n, 'views')); });
    var movieHead = document.querySelector('.movie .ph');
    if (movieHead && !meta) views(here, function (n) { var b = badge(n, 'views'); b.style.display = 'block'; movieHead.appendChild(b); });
    // 2) episode cards (devlog list and home page)
    document.querySelectorAll('a.card.ep[href]').forEach(function (a) {
      var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
      views(norm(u.pathname), function (n) { (a.querySelector('.tags') || a).insertAdjacentElement('beforebegin', badge(n, 'views')); });
    });
    // 3) whole-site total in the footer
    var foot = document.querySelector('footer .wrap');
    if (foot) views('TOTAL', function (n) {
      var s = badge(n, 'views'); s.textContent = '👁 ' + (TH ? 'เข้าชมทั้งเว็บ ' + n + ' ครั้ง' : n + ' visits to the site');
      s.removeAttribute('title'); foot.appendChild(s);
    });
  }

  count();
  // give the count a moment to land, so the number shown includes this visit
  setTimeout(show, LIVE && !skip ? 700 : 0);
})();
