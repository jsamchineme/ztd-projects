/* Sunny Side: small, dependency-free helpers. Never edit per nursery: everything is read from the page.
   1. Phone menu sheet (a modal <dialog>; Escape closes it and focus returns to the Menu button)
   2. Live open or closed status, and the little sun on the sun arc
   3. Dated notices (data-show-from / data-show-until)
   4. Call bar: tucked away while the hero or the Book a visit band is in view
   5. Living photo: autoplays only on wider screens without reduced motion; visible pause button
   6. Gallery filters and lightbox */
(function () {
  'use strict';
  var doc = document;
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Menu sheet ------------------------------------------------------ */
  var toggle = doc.querySelector('[data-menu-open]');
  var sheet = doc.getElementById('menu-sheet');
  if (toggle && sheet && typeof sheet.showModal === 'function') {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-haspopup', 'dialog');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'menu-sheet');
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      sheet.showModal();
      toggle.setAttribute('aria-expanded', 'true');
    });
    toggle.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); toggle.click(); } });
    sheet.addEventListener('close', function () { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); });
    sheet.querySelectorAll('[data-menu-close], a').forEach(function (el) {
      el.addEventListener('click', function () { if (el.hasAttribute('data-menu-close') || el.getAttribute('href').indexOf('#') !== -1) sheet.close(); });
    });
  }

  /* 2. Live status and the sun arc ------------------------------------- */
  var schedule = null;
  try { schedule = JSON.parse((doc.getElementById('nursery-schedule') || {}).textContent || 'null'); } catch (e) { schedule = null; }
  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function ukNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: (schedule && schedule.timeZone) || 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var d = new Date(Date.UTC(+o.year, +o.month - 1, +o.day));
    return { date: d, iso: o.year + '-' + o.month + '-' + o.day, minutes: (+o.hour) * 60 + (+o.minute) };
  }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function toMin(t) { var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function niceTime(t) {
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60, suffix = h < 12 ? 'am' : 'pm';
    if (h === 12 && mm === 0) return 'midday';
    var h12 = h % 12 || 12;
    return h12 + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + suffix;
  }
  function closureFor(isoDay) {
    var list = (schedule && schedule.closures) || [];
    for (var i = 0; i < list.length; i++) if (isoDay >= list[i].from && isoDay <= list[i].to) return list[i];
    if (schedule && schedule.term && (isoDay < schedule.term.from || isoDay > schedule.term.to)) return { label: schedule.term.label, open: false };
    return null;
  }
  function sessions(d) { return closureFor(iso(d)) ? [] : ((schedule.days || {})[DAYS[d.getUTCDay()]] || []); }
  function nextOpening(now) {
    for (var i = 1; i < 60; i++) {
      var d = new Date(now.date.getTime() + i * 864e5), s = sessions(d);
      if (s.length) return { d: d, i: i, t: s[0][0] };
    }
    return null;
  }
  function statusText(now) {
    var today = sessions(now.date), soon = schedule.closingSoonMinutes || 30;
    for (var i = 0; i < today.length; i++) {
      var a = toMin(today[i][0]), b = toMin(today[i][1]);
      if (now.minutes >= a && now.minutes < b) {
        return { state: b - now.minutes <= soon ? 'closing' : 'open', text: (b - now.minutes <= soon ? 'Open now. Closing soon, at ' : 'Open now, until ') + niceTime(today[i][1]), frac: (now.minutes - a) / (b - a) };
      }
      if (now.minutes < a) return { state: 'closed', text: 'Closed now. Opens today at ' + niceTime(today[i][0]) };
    }
    var c = closureFor(now.iso), n = nextOpening(now);
    if (!n) return { state: 'closed', text: c ? 'Closed for ' + c.label + '.' : 'Closed now.' };
    var when = n.i === 1 ? 'tomorrow' : (n.i < 7 && !c ? 'on ' + DAY_NAMES[n.d.getUTCDay()] : 'on ' + DAY_NAMES[n.d.getUTCDay()] + ' ' + n.d.getUTCDate() + ' ' + MONTHS[n.d.getUTCMonth()]);
    return { state: 'closed', text: (c ? 'Closed for ' + c.label + '. Opens ' : 'Closed now. Opens ') + when + ' at ' + niceTime(n.t) };
  }
  if (schedule && schedule.days) {
    var now = ukNow(), st = statusText(now);
    doc.querySelectorAll('[data-status]').forEach(function (el) {
      el.setAttribute('data-status', st.state);
      var t = el.querySelector('[data-status-text]') || el;
      t.textContent = st.text;
    });
    /* Move the little sun along the arc while open; hide it below the horizon when closed. */
    doc.querySelectorAll('[data-sun-arc]').forEach(function (arc) {
      var sun = arc.querySelector('.sun-arc__sun'); if (!sun) return;
      var cx = +arc.getAttribute('data-cx') || 160, cy = +arc.getAttribute('data-cy') || 100, rx = +arc.getAttribute('data-rx') || 148, ry = +arc.getAttribute('data-ry') || 84;
      if (typeof st.frac === 'number') {
        var ang = Math.PI * (1 - st.frac);
        sun.setAttribute('transform', 'translate(' + (cx + rx * Math.cos(ang)).toFixed(1) + ' ' + (cy - ry * Math.sin(ang)).toFixed(1) + ')');
      } else {
        sun.setAttribute('transform', 'translate(' + cx + ' ' + (cy + 40) + ')');
        sun.style.opacity = '0';
      }
    });
    /* Next closure line */
    doc.querySelectorAll('[data-next-closure]').forEach(function (el) {
      var list = (schedule.closures || []).filter(function (c) { return c.to >= now.iso; });
      if (!list.length) return;
      var c = list[0], f = new Date(c.from + 'T00:00:00Z');
      el.textContent = (c.from <= now.iso ? 'Closed now for ' : 'Next closure: ') + c.label + (c.from <= now.iso ? '.' : ', from ' + DAY_NAMES[f.getUTCDay()] + ' ' + f.getUTCDate() + ' ' + MONTHS[f.getUTCMonth()] + '.');
    });
  }

  /* 3. Dated notices --------------------------------------------------- */
  var today = ukNow().iso;
  doc.querySelectorAll('[data-show-from], [data-show-until]').forEach(function (el) {
    var from = el.getAttribute('data-show-from') || '0000', until = el.getAttribute('data-show-until') || '9999';
    el.hidden = !(today >= from && today <= until);
  });

  /* 4. Call bar -------------------------------------------------------- */
  var bar = doc.querySelector('[data-callbar]');
  if (bar && 'IntersectionObserver' in window) {
    var watched = doc.querySelectorAll('.hero, .page-band, .visit, .site-footer');
    var showing = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) showing.add(en.target); else showing.delete(en.target); });
      bar.classList.toggle('is-tucked', showing.size > 0);
    }, { threshold: 0 });
    watched.forEach(function (w) { io.observe(w); });
  }

  /* 5. Living photo ---------------------------------------------------- */
  doc.querySelectorAll('[data-living]').forEach(function (fig) {
    var video = fig.querySelector('video'), btn = fig.querySelector('.living__toggle');
    if (!video || !btn) return;
    var label = btn.querySelector('[data-label]'), icon = btn.querySelector('use');
    function loadSrc() { if (!video.getAttribute('src')) { video.setAttribute('src', video.getAttribute('data-src')); } }
    function show(playing) {
      label.textContent = playing ? 'Pause' : 'Play';
      icon.setAttribute('href', playing ? '#i-pause' : '#i-play');
      btn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' the moving photo of ' + (fig.getAttribute('data-living') || 'the nursery'));
    }
    btn.hidden = false;
    show(false);
    btn.addEventListener('click', function () {
      if (video.paused) { loadSrc(); var p = video.play(); if (p && p.catch) p.catch(function () { show(false); }); show(true); }
      else { video.pause(); show(false); }
    });
    var wide = matchMedia('(min-width: 40em)').matches;
    if (wide && !reduceMotion) {
      loadSrc(); video.muted = true;
      var p = video.play(); if (p && p.then) p.then(function () { show(true); }).catch(function () { show(false); });
    }
  });

  /* 6. Gallery --------------------------------------------------------- */
  var filters = doc.querySelectorAll('[data-filter]');
  var tiles = doc.querySelectorAll('[data-group]');
  var count = doc.querySelector('[data-filter-count]');
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-filter'), n = 0;
      filters.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      tiles.forEach(function (t) { var on = g === 'all' || t.getAttribute('data-group') === g; t.hidden = !on; if (on) n++; });
      if (count) count.textContent = 'Showing ' + n + ' photo' + (n === 1 ? '' : 's') + '.';
    });
  });
  var box = doc.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    var boxImg = box.querySelector('[data-lightbox-img]'), boxCap = box.querySelector('[data-lightbox-caption]'), opener = null;
    doc.querySelectorAll('[data-lightbox]').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = b.querySelector('img');
        opener = b;
        boxImg.src = b.getAttribute('data-lightbox');
        boxImg.alt = img.alt;
        boxImg.hidden = false;
        boxCap.textContent = (b.closest('figure').querySelector('figcaption') || {}).textContent || '';
        box.showModal();
      });
    });
    box.querySelector('[data-lightbox-close]').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('close', function () { if (opener) opener.focus(); });
  } else {
    doc.querySelectorAll('[data-lightbox]').forEach(function (b) { b.addEventListener('click', function () { location.href = b.getAttribute('data-lightbox'); }); });
  }
})();
