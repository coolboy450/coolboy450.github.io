/* Services page: builds a ready-to-send project brief on the visitor's own screen.
   NOTHING is sent from this page. The visitor copies the text, or opens their own email / Discord to send it.
   The e-mail address is assembled here (not written in the page) to keep it away from simple scrapers. */
(function () {
  'use strict';
  var TH = (document.documentElement.lang || '').indexOf('th') === 0;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('brief'); if (!form) return;
  var out = $('brief-out'), ok = $('brief-ok');
  var TO = ['kmnthat56', 'gmail.com'].join('@');

  var T = TH ? {
    head: 'สวัสดีครับ อยากปรึกษางานกับ noob_dev',
    need: 'งานที่ต้องการ', who: 'ใช้กับใคร / ธุรกิจอะไร', goal: 'อยากให้คนที่เข้ามาทำอะไร', when: 'กำหนดที่อยากได้',
    assets: 'ข้อความและรูป', links: 'ตัวอย่างที่ชอบ / เว็บปัจจุบัน', contact: 'ติดต่อกลับทาง', none: '(ยังไม่ระบุ)', tail: 'ขอทราบว่าทำได้ไหม ต้องถามอะไรเพิ่ม และประเมินขอบเขตกับราคาให้ได้ไหมครับ',
    copied: 'คัดลอกแล้ว วางในอีเมลหรือแชทได้เลย', copyFail: 'คัดลอกอัตโนมัติไม่ได้ เลือกข้อความในกล่องแล้วคัดลอกเอง', subject: 'ปรึกษางานกับ noob_dev'
  } : {
    head: 'Hi, I would like to talk about a project with noob_dev.',
    need: 'What I need', who: 'Who it is for / what business', goal: 'What visitors should do', when: 'When I need it',
    assets: 'Text and images', links: 'Examples I like / current site', contact: 'Reach me by', none: '(not specified)', tail: 'Can you tell me whether this is doable, what else you need to know, and give a rough scope and price?',
    copied: 'Copied. Paste it into an e-mail or a chat.', copyFail: 'Could not copy automatically. Select the text in the box and copy it yourself.', subject: 'Project enquiry for noob_dev'
  };

  function val(name) { var e = form.querySelector('[name="' + name + '"]'); return e ? String(e.value || '').trim() : ''; }
  function checked(name) { return [].map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (c) { return c.value; }); }
  function build() {
    var need = checked('need').join(', ');
    var lines = [T.head, '',
      T.need + ': ' + (need || T.none),
      T.who + ': ' + (val('who') || T.none),
      T.goal + ': ' + (val('goal') || T.none),
      T.when + ': ' + (val('when') || T.none),
      T.assets + ': ' + (val('assets') || T.none),
      T.links + ': ' + (val('links') || T.none),
      T.contact + ': ' + (val('contact') || T.none), '', T.tail];
    return lines.join('\n');
  }
  function draw() { out.textContent = build(); }
  form.addEventListener('input', draw); form.addEventListener('change', draw); draw();

  $('btn-copy').addEventListener('click', function () {
    var t = build();
    var done = function () { ok.textContent = T.copied; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { ok.textContent = T.copyFail; });
    else { try { var r = document.createRange(); r.selectNodeContents(out); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); ok.textContent = T.copyFail; } catch (e) { ok.textContent = T.copyFail; } }
  });
  $('btn-mail').addEventListener('click', function () {
    location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(T.subject) + '&body=' + encodeURIComponent(build());
  });
})();
