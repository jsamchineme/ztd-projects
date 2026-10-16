/* SOFT PLAY · softplay.js
   Plain JavaScript, no dependencies. Every feature reads its data from
   the page, so builders never edit this file.
   1. Phone menu sheet        2. Sticky phone bar
   3. Living photo            4. Dated notices
   5. Live open/closed status 6. Gallery filters and lightbox
   7. Ball row and staircase entrances (skipped under reduced motion) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* 1. Phone menu: a full-height sheet. Esc or Close shuts it and focus
     returns to the Menu button. Focus stays inside while it is open. */
  var menuBtn = $('.menu-button');
  var sheet = menuBtn && document.getElementById(menuBtn.getAttribute('aria-controls'));
  if (menuBtn && sheet) {
    var closeBtn = $('[data-menu-close]', sheet);
    var open = function () {
      sheet.hidden = false; menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      var first = $('a, button', sheet); if (first) first.focus();
    };
    var close = function () {
      sheet.hidden = true; menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open'); menuBtn.focus();
    };
    menuBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a, button', sheet); var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    $$('a[href^="#"], a[href*=".html#"]', sheet).forEach(function (l) { l.addEventListener('click', function () { if (!sheet.hidden) close(); }); });
  }

  /* 2. Sticky phone bar: shows once the first [data-bar-after] element
     (the hero or page band) has scrolled away, hides while any
     [data-bar-hide] (visit band, footer) is on screen. The body is
     padded by the bar's height so it never covers content or focus. */
  var bar = $('[data-phone-bar]');
  if (bar && 'IntersectionObserver' in window) {
    var after = $('[data-bar-after]'); var hiders = $$('[data-bar-hide]');
    var pastTop = false, hidersOn = new Set();
    var update = function () {
      var show = pastTop && hidersOn.size === 0 && window.innerWidth < 1024;
      bar.classList.toggle('is-shown', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      $$('a', bar).forEach(function (a) { a.tabIndex = show ? 0 : -1; });
      doc.style.setProperty('--bar-height', show ? bar.offsetHeight + 'px' : '0px');
    };
    if (after) new IntersectionObserver(function (es) { es.forEach(function (e) { pastTop = !e.isIntersecting && e.boundingClientRect.top < 0; }); update(); }).observe(after);
    var ho = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) hidersOn.add(e.target); else hidersOn.delete(e.target); }); update(); });
    hiders.forEach(function (h) { ho.observe(h); });
    window.addEventListener('resize', update);
    update();
  }

  /* 3. Living photo: <video data-src> with a poster. It loads and plays
     only on screens 768px and wider when motion is welcome; phones keep
     the poster and never download the film. Visible pause button. */
  $$('[data-living]').forEach(function (fig) {
    var v = $('video', fig), btn = $('.living__toggle', fig), label = $('.living__label', fig);
    if (!v) return;
    var wide = window.matchMedia('(min-width: 768px)');
    var start = function () {
      if (reduce.matches || !wide.matches || v.getAttribute('src')) return;
      v.src = v.getAttribute('data-src');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      if (btn) btn.hidden = false;
      if (label && label.dataset.playing) label.textContent = label.dataset.playing;
    };
    if (btn) btn.addEventListener('click', function () {
      var t = $('.living__text', btn), i = $('use', btn);
      if (v.paused) { v.play(); btn.setAttribute('aria-pressed', 'false'); if (t) t.textContent = 'Pause'; if (i) i.setAttribute('href', '#i-pause'); }
      else { v.pause(); btn.setAttribute('aria-pressed', 'true'); if (t) t.textContent = 'Play'; if (i) i.setAttribute('href', '#i-play'); }
    });
    start();
    if (wide.addEventListener) wide.addEventListener('change', start);
  });

  /* 3b. Tour film: a big "Play the tour" button over the poster. It
     starts the film and then gets out of the way; the native controls
     (hidden until then so they don't sit under it) and captions do the rest. Without JS the button stays hidden. */
  $$('[data-film]').forEach(function (fig) {
    var v = $('video', fig), btn = $('.film__play', fig);
    if (!v || !btn) return;
    btn.hidden = false; v.controls = false;
    btn.addEventListener('click', function () {
      btn.hidden = true; v.controls = true;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.focus();
    });
    v.addEventListener('play', function () { btn.hidden = true; v.controls = true; });
  });

  /* 4. Dated notices: hide [data-show-from] / [data-show-until] (YYYY-MM-DD,
     inclusive, UK date) outside their window. Never a pop-up. */
  var ukToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  $$('[data-show-from], [data-show-until]').forEach(function (n) {
    var from = n.getAttribute('data-show-from'), until = n.getAttribute('data-show-until');
    n.hidden = (from && ukToday < from) || (until && ukToday > until);
  });

  /* 5. Live status: <p class="status" data-status data-open="07:30"
     data-close="18:00" data-days="1-5"> where days are 1 (Monday) to 7.
     Without data-days (days not confirmed) the printed text stays as it is. */
  $$('[data-status]').forEach(function (s) {
    var days = s.getAttribute('data-days'); if (!days) return;
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
    var dayNum = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
    var now = get('hour') + ':' + get('minute');
    var r = days.split('-'), onDay = dayNum >= +r[0] && dayNum <= +(r[1] || r[0]);
    var o = s.getAttribute('data-open'), c = s.getAttribute('data-close');
    var nice = function (t) { var h = +t.slice(0, 2), m = t.slice(3); return (h % 12 || 12) + (m === '00' ? '' : '.' + m) + (h < 12 ? 'am' : 'pm'); };
    var isOpen = onDay && now >= o && now < c;
    s.setAttribute('data-state', isOpen ? 'open' : 'closed');
    s.textContent = isOpen ? 'Open now until ' + nice(c) : (onDay && now < o ? 'Closed now. Opens at ' + nice(o) + ' today' : 'Closed now');
  });

  /* 6. Gallery filters: buttons with data-filter and aria-pressed; tiles
     carry data-group. "all" shows everything. */
  $$('[data-filters]').forEach(function (group) {
    var target = document.getElementById(group.getAttribute('data-filters'));
    var count = $('[data-filter-count]');
    $$('button', group).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter'), n = 0;
        $$('button', group).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('[data-group]', target).forEach(function (t) { var show = f === 'all' || t.getAttribute('data-group') === f; t.hidden = !show; if (show) n++; });
        if (count) count.textContent = 'Showing ' + n + (n === 1 ? ' photo' : ' photos') + (f === 'all' ? '' : ' of ' + b.textContent.trim().toLowerCase());
      });
    });
  });

  /* 6b. Gallery lightbox: each tile's link (to the biggest photo file)
     opens a <dialog> instead. Previous / Next and the arrow keys move
     through the photos the filter is showing, wrapping at the ends; a
     sideways swipe does the same. Esc, Close or the backdrop shut it and
     focus goes back to the photo. Without JS the links open the file. */
  var lb = $('#lightbox');
  if (lb && lb.showModal) {
    var lbImg = $('[data-lb-img]', lb), lbCap = $('[data-lb-caption]', lb), lbCount = $('[data-lb-count]', lb);
    var lbList = [], lbAt = 0, lbFrom = null;
    var lbShow = function (i) {
      lbAt = (i + lbList.length) % lbList.length;
      var a = lbList[lbAt], t = $('img', a), c = $('figcaption', a.parentNode);
      lbImg.src = a.getAttribute('href'); lbImg.alt = t ? t.alt : '';
      lbCap.textContent = c ? c.textContent : '';
      lbCount.textContent = (lbAt + 1) + ' of ' + lbList.length;
      lb.style.setProperty('--frame', getComputedStyle(a).getPropertyValue('--frame'));
    };
    $$('.mosaic__open').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbList = $$('.mosaic__open').filter(function (x) { return !x.closest('[hidden]'); });
        lbFrom = a; lbShow(lbList.indexOf(a)); lb.showModal();
      });
    });
    $('[data-lb-prev]', lb).addEventListener('click', function () { lbShow(lbAt - 1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { lbShow(lbAt + 1); });
    $('[data-lb-close]', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(lbAt - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lbAt + 1); }
    });
    lb.addEventListener('click', function (e) {
      var r = lb.getBoundingClientRect();
      if (e.target === lb && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) lb.close();
    });
    lb.addEventListener('close', function () { if (lbFrom) lbFrom.focus(); });
    var sx = null; lbImg.draggable = false;
    lbImg.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    lbImg.addEventListener('pointerup', function (e) {
      if (sx === null) return; var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) lbShow(lbAt + (dx < 0 ? 1 : -1));
    });
  }

  /* 7. Entrances: the stairs settle in once, when first seen. Nothing
     moves under reduced motion. */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        once.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    $$('.stairs').forEach(function (s) {
      if (s.getBoundingClientRect().top > window.innerHeight) once.observe(s);
    });
  }
})();
