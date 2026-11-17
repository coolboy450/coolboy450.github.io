/* ลูกเล่นของเว็บ noob_dev — ใช้ได้ทุกหน้า ไม่ต้องพึ่งไฟล์อื่น
   - พิมพ์หัวข้อหน้าแรกทีละตัว
   - ตัวละครกระโดด + บอลลูนคำพูด (หน้าทีม: คลิกเพื่อคุย)
   - ส่วนต่างๆ เลื่อนเข้ามาตอนเลื่อนหน้า
   - คลิก _ ในโลโก้ = คอนเฟตตีพิกเซล
   - แถบความคืบหน้าการอ่านในบันทึก
   - ความลับ: พิมพ์ "noob" แล้วแมวนูบจะเดินผ่าน
   ทุกอย่างหยุดเคลื่อนไหวเมื่อผู้ใช้ตั้ง prefers-reduced-motion */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.fun-hop{transition:transform 200ms ease-out}',
    '.fun-hop:hover,.fun-hop:focus-visible,.fun-hop.fun-on{transform:translateY(-6px)}',
    '.fun-say{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translate(-50%,4px);min-width:150px;max-width:220px;padding:8px 12px;border-radius:12px;background:var(--text,#14171C);color:var(--bg,#fff);font:400 14px/1.5 var(--font-th,system-ui);text-align:center;pointer-events:none;opacity:0;transition:opacity 200ms ease-out,transform 200ms ease-out;z-index:5}',
    '.fun-say::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:6px solid transparent;border-top-color:var(--text,#14171C)}',
    '.fun-on .fun-say,.fun-hop:hover .fun-say,.fun-hop:focus-visible .fun-say{opacity:1;transform:translate(-50%,0)}',
    '.fun-rv{opacity:0;transform:translateY(16px);transition:opacity 400ms ease-out,transform 400ms ease-out}',
    '.fun-rv.fun-in{opacity:1;transform:none}',
    '.fun-progress{position:fixed;left:0;top:0;height:3px;width:0;background:var(--accent,#4D7C0F);z-index:50}',
    '.fun-bit{position:fixed;width:8px;height:8px;pointer-events:none;z-index:60}',
    '.fun-cat{position:fixed;bottom:12px;left:-80px;z-index:60;pointer-events:none;font:400 14px/1.5 var(--font-th,system-ui);display:flex;align-items:flex-end;gap:8px}',
    '.fun-cat .msg{background:var(--text,#14171C);color:var(--bg,#fff);border-radius:12px;padding:4px 12px}',
    '.logo b{cursor:pointer}',
    '@media (prefers-reduced-motion:reduce){.fun-hop,.fun-rv,.fun-say{transition:none}.fun-rv{opacity:1;transform:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* 1) พิมพ์หัวข้อหน้าแรกทีละตัว (screen reader อ่านข้อความเต็มตั้งแต่แรก) */
  var hero = document.getElementById('hero');
  if (hero && !reduce) {
    var cursor = hero.querySelector('.tc');
    var full = hero.firstChild && hero.firstChild.nodeType === 3 ? hero.firstChild.nodeValue : '';
    if (full) {
      hero.setAttribute('aria-label', full.trim());
      var chars = Array.from ? Array.from(full) : full.split('');
      var node = hero.firstChild; node.nodeValue = ''; var i = 0;
      (function type() {
        if (i >= chars.length) return;
        node.nodeValue += chars[i++];
        setTimeout(type, i < 3 ? 120 : 45);
      })();
      if (cursor) hero.appendChild(cursor);
    }
  }

  /* 2) ตัวละครกระโดด + บอลลูนคำพูด ตามนิสัยแต่ละคน */
  var LINES = [
    ['ว้าว ตรงนี้ระยะห่างเท่ากันเป๊ะเลยค่ะ!', 'สีนี้ใครแก้ บอกมินท์ด้วยนะคะ', 'ชานมสักแก้วไหมคะ'],
    ['ได้ครับ', 'กาแฟก่อน', 'เรียบร้อย'],
    ['นูบจ้า มาเป็นนายแบบหน่อย', 'ป๊อปทำมีมให้เอาไหม', 'สีนี้แหละ ใช่เลยจ้า'],
    ['ขอเช็กก่อนนะ', 'เด็กๆ อย่าลืม checklist ข้อ 3', 'งานนี้ผ่าน ครูชมนะ'],
    ['ขอแบบฟรีนะ 555', 'Paper ก่อนนะครับ', 'ทำเลย!']
  ];
  var crew = document.querySelectorAll('[data-sprite]');
  crew.forEach(function (el) {
    var k = +el.getAttribute('data-sprite'); var lines = LINES[k]; if (!lines) return;
    el.classList.add('fun-hop');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var say = document.createElement('span'); say.className = 'fun-say'; say.setAttribute('aria-hidden', 'true');
    var n = 0; say.textContent = lines[0]; el.appendChild(say);
    // the sprite can stick out above its box, so anchor the bubble to the top of the drawing
    var place = function () {
      var svg = el.querySelector('svg'); if (!svg) return;
      say.style.bottom = (el.getBoundingClientRect().bottom - svg.getBoundingClientRect().top + 8) + 'px';
    };
    el.addEventListener('mouseenter', function () { say.textContent = lines[n++ % lines.length]; place(); });
    el.addEventListener('focus', place);
    if (el.tagName !== 'A') {           // หน้าทีม: การ์ดไม่ใช่ลิงก์ คลิกหรือกด Enter เพื่อคุย
      el.tabIndex = 0;
      el.setAttribute('aria-label', (el.querySelector('h2') || el).textContent.trim() + ' — กดเพื่อคุย');
      var talk = function () {
        say.textContent = lines[n++ % lines.length]; place();
        el.classList.add('fun-on'); clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove('fun-on'); }, 2500);
      };
      el.addEventListener('click', talk);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); talk(); } });
    }
  });

  /* 3) ส่วนต่างๆ เลื่อนเข้ามาตอนเลื่อนหน้า */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('main .card, main .tcard, main section, main article, main li');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fun-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) {
      if (t.closest('.fun-rv') || t.getBoundingClientRect().top < window.innerHeight) return; // ของที่เห็นอยู่แล้วไม่ต้องซ่อน
      t.classList.add('fun-rv'); io.observe(t);
    });
  }

  /* 4) คลิก _ ในโลโก้ = คอนเฟตตีพิกเซล */
  var COLORS = ['#4D7C0F', '#A3E635', '#DB2777', '#B45309', '#14171C'];
  function confetti(x, y) {
    if (reduce) return;
    for (var j = 0; j < 28; j++) {
      var b = document.createElement('i'); b.className = 'fun-bit';
      b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.background = COLORS[j % COLORS.length];
      document.body.appendChild(b);
      var a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 90;
      b.animate([{ transform: 'translate(0,0)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 60) + 'px) rotate(' + (Math.random() * 360) + 'deg)', opacity: 0 }],
        { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(b);
    }
  }
  document.querySelectorAll('.logo b').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();       // คลิก _ = เล่นคอนเฟตตี ไม่ต้องเปลี่ยนหน้า
      var r = b.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2);
    });
  });

  /* 5) แถบความคืบหน้าการอ่าน (เฉพาะหน้าบันทึกแต่ละตอน) */
  var art = document.querySelector('article.article');
  if (art) {
    var bar = document.createElement('div'); bar.className = 'fun-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var upd = function () {
      var r = art.getBoundingClientRect(), total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* 6) ความลับ: พิมพ์ "noob" แล้วแมวนูบจะเดินผ่าน */
  var typed = '';
  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input,textarea,[contenteditable]')) return;
    typed = (typed + (e.key || '')).slice(-4).toLowerCase();
    if (typed === 'noob') { typed = ''; walkCat(); }
  });
  function walkCat() {
    if (document.querySelector('.fun-cat')) return;
    var c = document.createElement('div'); c.className = 'fun-cat'; c.setAttribute('role', 'status');
    c.innerHTML = '<svg width="48" height="32" viewBox="0 0 12 8" shape-rendering="crispEdges" aria-hidden="true">' +
      '<rect x="1" y="3" width="8" height="4" fill="#B45309"/><rect x="8" y="1" width="3" height="3" fill="#B45309"/>' +
      '<rect x="8" y="0" width="1" height="1" fill="#B45309"/><rect x="10" y="0" width="1" height="1" fill="#B45309"/>' +
      '<rect x="9" y="2" width="1" height="1" fill="#14171C"/><rect x="0" y="2" width="1" height="3" fill="#B45309"/>' +
      '<rect x="2" y="7" width="1" height="1" fill="#B45309"/><rect x="7" y="7" width="1" height="1" fill="#B45309"/></svg>' +
      '<span class="msg">เมี๊ยว~ นูบมาแล้ว</span>';
    document.body.appendChild(c);
    if (reduce) { c.style.left = '16px'; setTimeout(function () { c.remove(); }, 2500); return; }
    c.animate([{ left: '-120px' }, { left: (window.innerWidth + 40) + 'px' }], { duration: 6000, easing: 'linear' }).onfinish = function () { c.remove(); };
  }
})();
