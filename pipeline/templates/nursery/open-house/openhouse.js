/* Open House: small, dependency-free behaviour. Reads everything from the page; never edit per nursery.
   1. Phone menu sheet   2. Live open or closed status   3. Dated notices
   4. Smoke pause        5. Living photo                 6. Tour film (click to play)
   7. Gallery filters        8. Gallery lightbox */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* 1. Menu: a full-height sheet. Esc closes it and focus returns to the Menu button. */
  var btn = document.querySelector('[data-menu-open]');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    var closeBtn = nav.querySelector('[data-menu-close]');
    var open = function () {
      nav.classList.add('is-open'); document.body.classList.add('menu-open');
      btn.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a'); if (first) first.focus();
    };
    var close = function (refocus) {
      nav.classList.remove('is-open'); document.body.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus();
    };
    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', function () { close(true); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close(true);
      if (e.key === 'Tab' && nav.classList.contains('is-open')) { /* keep focus inside the sheet */
        var f = nav.querySelectorAll('a, button'); var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    window.matchMedia('(min-width: 1240px)').addEventListener('change', function () { close(false); });
  }

  /* Call bar (phones): hidden while the page's first Book a visit button is on screen, so it never doubles it or covers the hero */
  var bar = document.querySelector('.callbar'), firstActions = document.querySelector('main .actions');
  if (bar && firstActions && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      bar.classList.toggle('is-shown', past);
    }).observe(firstActions);
  } else if (bar) bar.classList.add('is-shown');

  /* UK time parts, whatever the visitor's clock says */
  function ukNow() {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[p.weekday], mins: (+p.hour % 24) * 60 + +p.minute, iso: p.year + '-' + p.month + '-' + p.day };
  }
  function toMins(t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; }
  function say(t) { var m = toMins(t), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (mm ? ':' + String(mm).padStart(2, '0') : '') + ap; }
  var DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* 2. Live status. <p class="status" data-hours='{"days":[1,2,3,4,5],"open":"08:00","close":"18:00","closed":["2026-12-25"]}'>
        The text inside is the no-JS fallback. Closed dates are only the nursery's own. */
  document.querySelectorAll('[data-hours]').forEach(function (el) {
    var h; try { h = JSON.parse(el.getAttribute('data-hours')); } catch (e) { return; }
    var n = ukNow(), closed = (h.closed || []).indexOf(n.iso) > -1;
    var openDay = h.days.indexOf(n.day) > -1 && !closed;
    var o = toMins(h.open), c = toMins(h.close);
    if (openDay && n.mins >= o && n.mins < c) { el.textContent = 'Open now, until ' + say(h.close) + ' today'; el.classList.add('is-open'); return; }
    if (openDay && n.mins < o) { el.textContent = 'Closed now. Opens at ' + say(h.open) + ' today'; return; }
    for (var i = 1; i <= 7; i++) {
      var d = (n.day + i) % 7;
      if (h.days.indexOf(d) > -1) { el.textContent = 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAY[d]) + ' at ' + say(h.open); return; }
    }
  });

  /* 3. Dated notices: data-show-from="2026-12-20" data-show-until="2027-01-05" (UK dates, inclusive) */
  var today = ukNow().iso;
  document.querySelectorAll('[data-show-from], [data-show-until]').forEach(function (el) {
    var from = el.getAttribute('data-show-from') || '0000-00-00', until = el.getAttribute('data-show-until') || '9999-12-31';
    el.hidden = !(today >= from && today <= until);
  });

  /* 4. Smoke pause (any looping drawing): toggles .motion-paused on <html> */
  document.querySelectorAll('[data-pause]').forEach(function (b) {
    b.addEventListener('click', function () {
      var paused = doc.classList.toggle('motion-paused');
      b.textContent = paused ? 'Play' : 'Pause';
    });
  });

  /* 5. Living photo: <figure class="living"><video data-living data-src="x.mp4" poster muted loop playsinline></video><button class="living__btn" hidden>
        Plays only on screens 700px and wider with no reduced-motion request; everyone else keeps the poster and downloads nothing. */
  document.querySelectorAll('video[data-living]').forEach(function (v) {
    var b = v.parentNode.querySelector('.living__btn');
    if (reduce.matches || window.innerWidth < 700) return;
    v.src = v.getAttribute('data-src'); v.muted = true;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    if (b) {
      b.hidden = false;
      b.addEventListener('click', function () {
        if (v.paused) { v.play(); b.textContent = 'Pause'; b.setAttribute('aria-pressed', 'false'); }
        else { v.pause(); b.textContent = 'Play'; b.setAttribute('aria-pressed', 'true'); }
      });
    }
  });

  /* 6. Tour film: the poster and a big play button. The native controls appear once it plays. */
  document.querySelectorAll('[data-film]').forEach(function (wrap) {
    var v = wrap.querySelector('video'), b = wrap.querySelector('.film__play');
    if (!v || !b) return;
    v.controls = false;
    b.hidden = false;
    b.addEventListener('click', function () {
      b.hidden = true; v.controls = true; v.preload = 'auto';
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.focus();
    });
  });

  /* 7. Gallery filters: <button data-filter="rooms" aria-pressed="false"> over <li data-group="rooms"> */
  var filters = document.querySelectorAll('[data-filter]');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var g = f.getAttribute('data-filter');
      filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
      document.querySelectorAll('[data-group]').forEach(function (el) {
        el.hidden = !(g === 'all' || el.getAttribute('data-group') === g);
      });
      var live = document.getElementById('filter-status');
      if (live) live.textContent = 'Showing ' + (g === 'all' ? 'all photos' : f.textContent.trim().toLowerCase());
    });
  });

  /* 8. Gallery lightbox: <a class="mosaic__open" href="big.jpg"> around each photo, one <dialog id="lightbox">.
        Steps through the photos the filters show, wrapping round. Arrow keys and swipes move; Esc or the backdrop closes. */
  var box = document.getElementById('lightbox');
  var opens = document.querySelectorAll('.mosaic__open');
  if (box && box.showModal && opens.length) {
    var big = box.querySelector('img'), cap = box.querySelector('figcaption'), count = box.querySelector('.lightbox__count');
    var list = [], at = 0, opener = null, downX = null;
    var show = function (i) {
      at = (i + list.length) % list.length;
      var a = list[at], im = a.querySelector('img'), fc = a.parentNode.querySelector('figcaption');
      big.src = a.getAttribute('href'); big.alt = im.alt;
      big.width = im.getAttribute('width'); big.height = im.getAttribute('height');
      cap.textContent = fc ? fc.textContent : '';
      count.textContent = (at + 1) + ' of ' + list.length;
    };
    opens.forEach(function (a) {
      a.setAttribute('aria-haspopup', 'dialog');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        list = Array.prototype.filter.call(opens, function (x) { return !x.closest('[hidden]'); });
        opener = a; show(list.indexOf(a)); box.showModal();
      });
    });
    box.querySelector('.lightbox__prev').addEventListener('click', function () { show(at - 1); });
    box.querySelector('.lightbox__next').addEventListener('click', function () { show(at + 1); });
    box.querySelector('.lightbox__close').addEventListener('click', function () { box.close(); });
    box.addEventListener('close', function () { if (opener) opener.focus(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    });
    box.addEventListener('click', function (e) { /* a click outside the dialog box is the backdrop */
      var r = box.getBoundingClientRect();
      if (e.clientX && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) box.close();
    });
    big.addEventListener('pointerdown', function (e) { downX = e.clientX; });
    big.addEventListener('pointerup', function (e) {
      if (downX !== null && Math.abs(e.clientX - downX) > 40) show(at + (e.clientX < downX ? 1 : -1));
      downX = null;
    });
  }
})();
