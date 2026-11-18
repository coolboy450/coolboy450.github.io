/* noob_dev movie: "How the video editor was made" (the true story of EP.13-15), told in scenes.
   Everything that moves is a CSS animation, so pausing freezes it exactly. No outside files. */
(function () {
  'use strict';
  var root = document.getElementById('movie'); if (!root) return;
  var TH = (document.documentElement.lang || '').indexOf('th') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- pixel crew (same drawings as the team page) ---------- */
  var MAP = ['..HHHH..', '.HHHHHH.', '.HFFFFH.', '.FEFFEF.', '.FFFFFF.', '..BBBB..', '.BBBBBB.', 'FBBBBBBF', '..LLLL..', '..L..L..'];
  var GLS = ['..HHHH..', '.HHHHHH.', '.HFFFFH.', '.GEGGEG.', '.FFFFFF.', '..BBBB..', '.BBBBBB.', 'FBBBBBBF', '..LLLL..', '..L..L..'];
  var CREW = [
    { n: TH ? 'มินท์' : 'Mint', h: 'var(--pop)', b: 'var(--text)' },
    { n: TH ? 'บิต' : 'Bit', h: 'var(--muted)', b: 'var(--muted)' },
    { n: TH ? 'ป๊อป' : 'Pop', h: 'var(--text)', b: 'var(--pop)' },
    { n: TH ? 'ครูแว่น' : 'Kru Waen', h: 'var(--muted)', b: 'var(--text)', g: 1 },
    { n: TH ? 'แบงก์' : 'Bank', h: 'var(--text)', b: 'var(--muted)' },
    { n: TH ? 'เจ้าของ' : 'Owner', h: 'var(--text)', b: 'var(--ok)' }
  ];
  function sprite(i) {
    var c = CREW[i], col = { H: c.h, F: 'var(--warn)', E: 'var(--bg)', G: 'var(--bg)', B: c.b, L: 'var(--muted)' };
    var s = '<svg class="spr" viewBox="0 0 8 10" aria-hidden="true" shape-rendering="crispEdges">';
    (c.g ? GLS : MAP).forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) if (row[x] !== '.') s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + col[row[x]] + '"/>';
    });
    return s + '</svg>';
  }

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function beat(e, at) { e.classList.add('beat'); e.style.animationDelay = at + 'ms'; return e; }
  function actor(i, line, at, sayAt) {
    var a = el('div', 'actor'); a.insertAdjacentHTML('afterbegin', sprite(i)); a.appendChild(el('span', '', CREW[i].n));
    if (line) { var s = beat(el('span', 'say', line), sayAt || at + 500); a.appendChild(s); }
    return beat(a, at);
  }
  function actors(list) { var r = el('div', 'actors'); list.forEach(function (x) { r.appendChild(x); }); return r; }
  function term(lines, start, step) {
    var t = el('div', 'term');
    lines.forEach(function (l, k) { var s = el('span', 'l ' + (l[1] || ''), l[0]); t.appendChild(beat(s, start + k * (step || 700))); });
    return t;
  }

  /* ---------- the script ---------- */
  var S = TH ? {
    title: 'แอปตัดต่อ', kicker: 'noob_dev ภูมิใจเสนอ', sub: 'เรื่องจริง เล่าเป็น 11 ฉาก',
    c: [
      'noob_dev ภูมิใจเสนอ: เรื่องจริงของแอปตัดต่อวิดีโอ ตั้งแต่โจทย์จนขึ้นเว็บจริง',
      'วันแรก เจ้าของเขียนโจทย์ แอปตัดต่อที่ใช้ได้จริงบนเบราว์เซอร์ ไม่มีปุ่มหลอก',
      'มินท์วาดแบบร่างมาสามแบบ โต๊ะตัดต่อ โรงหนังเล็ก และคอนโซลนูบ',
      'ติ๊ง! ครั้งแรกที่สตูดิโอส่งข้อความเข้า Discord จากงานจริง',
      'เจ้าของเลือกแบบ A เพราะตรงโจทย์ที่สุด... แล้วกดส่งก่อนพิมพ์โน้ต',
      'บิตลงมือ สามไฟล์ สคริปต์หนึ่งตัวขนาด 58 KB กาแฟไปหลายแก้ว',
      'ครูแว่นยังไม่เชื่อ รอบแก้หมด การ์ดกลับมาว่า "ยังไม่ผ่าน"',
      'เจ้าของเลยตรวจเอง ส่วนใหญ่ผ่าน ข้อหนึ่งจริง และอีกข้อยังไม่มีใครตรวจ',
      'เผยแพร่ครั้งแรก ตัวกันบอกว่าไม่ ด้วยเหตุผลที่ถูก แล้วเว็บก็ขึ้น',
      'ช่องของ Discord ต้องการแค่ชื่อโดเมน ไม่ใช่ลิงก์เต็ม',
      'โปรดติดตามตอนต่อไป ยังต้องลองตัดวิดีโอจริง และกดปุ่มเผยแพร่ของจริง'
    ],
    brief: 'ทำแอปตัดต่อวิดีโอที่ใช้ได้จริง สวยๆ', mintSay: 'สามแบบค่ะ!',
    drafts: [['A', 'โต๊ะตัดต่อ'], ['B', 'โรงหนังเล็ก'], ['C', 'คอนโซลนูบ']],
    toast: '✋ รอเลือกแบบร่าง', toastFrom: 'noob_dev Studio · ตอนนี้',
    pickSay: 'เอา A!', oops: '(อุ๊ย กดส่งก่อนพิมพ์โน้ต)', bitSay: 'กาแฟก่อน', coffee: '☕ × 3',
    stamp: 'ยังไม่ผ่าน ⚠️', krSay: 'ขอดูผลทดสอบก่อนนะ',
    review: ['ยังไม่ได้ตรวจ syntax', 'ยังไม่ได้ลองที่ 375 px', 'ขอบมือถือ 8 px (ต้อง 16)'],
    check: [['ok', 'syntax ผ่าน'], ['ok', '375 px ไม่มี scroll แนวนอน'], ['ok', 'ปุ่ม 20 ตัว ≥ 44 px'], ['bad', 'ขอบ 8 px: จริง แก้รอบหน้า'], ['open', 'ลองวิดีโอจริง: ยังไม่ได้ทำ']],
    pub: [['$ publish video-editor', ''], ['✗ ปฏิเสธ: ครั้งแรก และต่างจาก GitHub', 'bad'], ['dry run: +3 ไฟล์, −README', 'dim'], ['$ publish video-editor --first', ''], ['404… 404…', 'dim'], ['200 ✓ ขึ้นเว็บแล้ว', 'ok']],
    dLabel: 'Domain', dErr: 'String value did not match validation regex.', dGood: 'ใช้ได้ ✓ ยืนยันทั้งโดเมน',
    endTitle: 'โปรดติดตามตอนต่อไป…', endList: ['ลองตัดวิดีโอจริง', 'กดปุ่มเผยแพร่ในสตูดิโอของจริง', 'แก้ขอบ 8 px → 16 px'],
    play: 'เล่น', pause: 'หยุด', prev: 'ฉากก่อน', next: 'ฉากถัดไป', scene: 'ฉาก', again: 'ดูอีกรอบ', bigplay: 'เริ่มเล่นหนัง'
  } : {
    title: 'The Video Editor', kicker: 'noob_dev presents', sub: 'a true story in 11 scenes',
    c: [
      'noob_dev presents: the true story of a video editor, from brief to live site.',
      'Day one. The owner writes a brief: a video editor that really works in the browser, with no fake buttons.',
      'Mint draws three drafts: an editing desk, a small cinema, and a terminal console.',
      'Bzzt. For the first time, the studio pings Discord about a real job.',
      'The owner picks A, because it fits the brief best... and presses send before typing the note.',
      'Bit gets to work. Three files, one 58 KB script, several coffees.',
      'Kru Waen is not convinced. The fix rounds run out, and the card comes back "not passed".',
      'So the owner checks it by hand. Most of it passes, one item is real, and one nobody has checked yet.',
      'The first publish. The guard says no for the right reason, and then the site goes live.',
      'Discord\'s box only wants a bare domain, not the full link.',
      'To be continued. Still to do: cut a real video, and press the real Publish button.'
    ],
    brief: 'make a video editor that really works, and pretty', mintSay: 'Three drafts!',
    drafts: [['A', 'Editing desk'], ['B', 'Small cinema'], ['C', 'noob console']],
    toast: '✋ Waiting for you to choose a draft', toastFrom: 'noob_dev Studio · now',
    pickSay: 'A it is!', oops: '(oops, sent before the note)', bitSay: 'Coffee first.', coffee: '☕ × 3',
    stamp: 'NOT PASSED ⚠️', krSay: 'Show me the tests first.',
    review: ['syntax never checked', 'not tried at 375 px', 'phone padding 8 px (should be 16)'],
    check: [['ok', 'syntax passes'], ['ok', '375 px: no sideways scroll'], ['ok', 'all 20 buttons ≥ 44 px'], ['bad', 'padding 8 px: true, next round'], ['open', 'real video: not tested yet']],
    pub: [['$ publish video-editor', ''], ['✗ refused: first publish, differs from GitHub', 'bad'], ['dry run: +3 files, −README', 'dim'], ['$ publish video-editor --first', ''], ['404… 404…', 'dim'], ['200 ✓ live', 'ok']],
    dLabel: 'Domain', dErr: 'String value did not match validation regex.', dGood: 'Accepted ✓ the whole domain is verified',
    endTitle: 'To be continued…', endList: ['cut a real video', 'press the real Publish button', 'fix padding 8 px → 16 px'],
    play: 'Play', pause: 'Pause', prev: 'Previous scene', next: 'Next scene', scene: 'Scene', again: 'Watch again', bigplay: 'Play the movie'
  };

  /* each scene: build(sceneEl) and how long it stays (ms) */
  var SCENES = [
    { ms: 5000, build: function (s) {
      s.appendChild(beat(el('p', 'kicker', S.kicker), 0));
      var t = beat(el('h2', 'title'), 600); t.innerHTML = 'noob<b>_</b>dev'; s.appendChild(t);
      s.appendChild(beat(el('p', 'title', S.title), 1300));
      s.appendChild(beat(el('p', 'kicker', S.sub), 2100));
    } },
    { ms: 6500, build: function (s) {
      s.appendChild(term([['$ studio new-job --kind web', 'dim'], ['"' + S.brief + '"', ''], ['✓ 8 features · no fake buttons · no fake forms', 'ok']], 400, 1200));
      s.appendChild(actors([actor(5, null, 0)]));
    } },
    { ms: 7000, build: function (s) {
      s.appendChild(actors([actor(0, S.mintSay, 0, 3200)]));
      var d = el('div', 'drafts');
      S.drafts.forEach(function (x, k) {
        var c = el('div', 'draft'); c.appendChild(el('strong', '', x[0])); c.appendChild(document.createTextNode(x[1]));
        var mini = el('div', 'mini'); for (var j = 0; j < 3; j++) mini.appendChild(el('i')); c.appendChild(mini);
        d.appendChild(beat(c, 700 + k * 700));
      });
      s.appendChild(d);
    } },
    { ms: 6000, build: function (s) {
      var p = el('div', 'phone'); var t = el('div', 'toast');
      t.innerHTML = '<span aria-hidden="true">🔔</span><span></span>'; t.lastChild.textContent = S.toast;
      var sm = el('small', '', S.toastFrom); t.lastChild.appendChild(sm);
      p.appendChild(beat(t, 900)); s.appendChild(beat(p, 0));
      var o = actor(5, null, 300); s.appendChild(actors([o]));
      setTimeout(function () { o.classList.add('hop'); }, 0);
    } },
    { ms: 6500, build: function (s) {
      var d = el('div', 'drafts');
      S.drafts.forEach(function (x, k) {
        var c = el('div', 'draft' + (k === 0 ? ' pick' : '')); c.appendChild(el('strong', '', x[0])); c.appendChild(document.createTextNode(x[1]));
        if (k === 0) { c.classList.remove('pick'); setTimeout(function () { c.classList.add('pick'); }, reduce ? 0 : 1400); }
        d.appendChild(c);
      });
      s.appendChild(d);
      s.appendChild(actors([actor(5, S.pickSay, 0, 1200)]));
      s.appendChild(beat(el('p', 'kicker', S.oops), 3600));
    } },
    { ms: 6500, build: function (s) {
      s.appendChild(term([['+ index.html', 'ok'], ['+ style.css', 'ok'], ['+ app.js', 'ok']], 600, 900));
      s.appendChild(beat(el('p', 'counter', 'app.js · 58 KB'), 3400));
      s.appendChild(actors([actor(1, S.bitSay, 0, 400), beat(el('span', 'kicker', S.coffee), 2400)]));
    } },
    { ms: 7000, build: function (s) {
      s.appendChild(beat(el('p', 'stamp', S.stamp), 900));
      var l = el('ul', 'mlist'); S.review.forEach(function (x, k) { var li = el('li', 'bad', x); li.setAttribute('data-m', '•'); l.appendChild(beat(li, 1800 + k * 600)); });
      s.appendChild(l);
      s.appendChild(actors([actor(3, S.krSay, 0, 400)]));
    } },
    { ms: 8000, build: function (s) {
      var l = el('ul', 'mlist'); var M = { ok: '✓', bad: '✗', open: '?' };
      S.check.forEach(function (x, k) { var li = el('li', x[0], x[1]); li.setAttribute('data-m', M[x[0]]); l.appendChild(beat(li, 700 + k * 1000)); });
      s.appendChild(l);
      s.appendChild(actors([actor(5, null, 0)]));
    } },
    { ms: 8500, build: function (s) {
      s.appendChild(term(S.pub, 300, 1000));
      setTimeout(function () { if (!reduce && current === 8 && playing) confetti(s); }, 6400);
    } },
    { ms: 8000, build: function (s) {
      var f = el('div', 'field'); f.appendChild(el('p', 'kicker', S.dLabel));
      var bad = el('div', 'box err', 'https://coolboy450.github.io/video-editor/'); f.appendChild(beat(bad, 300));
      f.appendChild(beat(el('p', 'msg err', '! ' + S.dErr), 1200));
      var good = el('div', 'box good', 'coolboy450.github.io'); f.appendChild(beat(good, 3600));
      f.appendChild(beat(el('p', 'msg good', S.dGood), 4400));
      s.appendChild(f);
    } },
    { ms: 9000, build: function (s) {
      s.appendChild(beat(el('p', 'title', S.endTitle), 200));
      var l = el('ul', 'mlist'); S.endList.forEach(function (x, k) { var li = el('li', 'open', x); li.setAttribute('data-m', '□'); l.appendChild(beat(li, 1200 + k * 700)); });
      s.appendChild(l);
      s.appendChild(actors([0, 1, 2, 3, 4, 5].map(function (i, k) { return actor(i, null, 3000 + k * 200); })));
    } }
  ];

  /* ---------- player ---------- */
  var screen = root.querySelector('.screen'), subs = root.querySelector('.subs');
  var bPlay = root.querySelector('.play'), bPrev = root.querySelector('.prev'), bNext = root.querySelector('.next'), dots = root.querySelector('.dots');
  var current = -1, playing = false, timer = null, left = 0, startedAt = 0, seen = {};
  bPrev.setAttribute('aria-label', S.prev); bNext.setAttribute('aria-label', S.next);
  SCENES.forEach(function (_, k) {
    var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', S.scene + ' ' + (k + 1)); b.appendChild(el('i'));
    b.onclick = function () { show(k); }; dots.appendChild(b);
  });

  function confetti(s) {
    var C = ['#A3E635', '#F472B6', '#F59E0B', '#E6EDF3', '#5865F2'];
    for (var j = 0; j < 30; j++) {
      var b = el('i', 'bit'); b.style.left = '50%'; b.style.top = '40%'; b.style.background = C[j % C.length]; s.appendChild(b);
      var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 140;
      b.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 80) + 'px) rotate(' + Math.random() * 360 + 'deg)', opacity: 0 }],
        { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' });
    }
  }
  function show(k) {
    clearTimeout(timer);
    current = Math.max(0, Math.min(SCENES.length - 1, k)); seen[current] = 1;
    var big = screen.querySelector('.bigplay'); if (big) big.remove();
    screen.innerHTML = ''; screen.appendChild(el('div', 'floor'));
    var s = el('div', 'scene'); s.setAttribute('aria-hidden', 'true'); SCENES[current].build(s); screen.appendChild(s);
    subs.textContent = S.c[current];
    [].forEach.call(dots.children, function (b, i) { if (i === current) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); b.classList.toggle('seen', !!seen[i]); });
    left = SCENES[current].ms; startedAt = 0; screen.classList.remove('paused'); screen.classList.toggle('still', !playing);
    if (playing) arm();
  }
  function arm() {
    startedAt = Date.now(); clearTimeout(timer);
    timer = setTimeout(function () {
      if (current >= SCENES.length - 1) { setPlaying(false); bPlay.textContent = '↺ ' + S.again; return; }
      show(current + 1);
    }, left);
  }
  function setPlaying(on) {
    playing = on; bPlay.textContent = on ? '⏸ ' + S.pause : '▶ ' + S.play; bPlay.setAttribute('aria-pressed', on);
    if (on) screen.classList.remove('paused'); else if (!screen.classList.contains('still')) screen.classList.add('paused');
    if (on) arm(); else { clearTimeout(timer); if (startedAt) left = Math.max(300, left - (Date.now() - startedAt)); startedAt = 0; }
  }
  function toggle() {
    if (!playing && current === SCENES.length - 1 && /↺/.test(bPlay.textContent)) { setPlaying(true); show(0); return; }
    if (current < 0) { playing = true; setPlaying(true); show(0); return; }
    setPlaying(!playing);
  }
  bPlay.onclick = toggle;
  bPrev.onclick = function () { show(current - 1); };
  bNext.onclick = function () { show(current + 1); };
  root.addEventListener('keydown', function (e) {
    if (e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;  // buttons handle their own keys
    if (e.key === ' ') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
  });

  /* first frame: the title card, paused, with a big play button */
  show(0); setPlaying(false);
  var big = el('button', 'bigplay', '▶'); big.type = 'button'; big.setAttribute('aria-label', S.bigplay);
  big.onclick = function () { big.remove(); setPlaying(true); show(0); bPlay.focus(); };
  screen.appendChild(big);
  screen.classList.remove('paused');   // let the title card animate in behind the play button
})();
