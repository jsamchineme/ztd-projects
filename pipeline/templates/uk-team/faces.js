/* Familiar Faces: menu and live opening status. No dependencies.
   The hours live in the page (the <table data-hours> rows), so the status can never
   disagree with the published table. Times are worked out in Europe/London. */
(function () {
  'use strict';

  /* ---- Mobile menu: a real button with aria-expanded and aria-controls ---- */
  var toggle = document.querySelector('[data-menu-toggle]');
  if (toggle) {
    var menu = document.getElementById(toggle.getAttribute('aria-controls'));
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
  }

  /* ---- Live open / closed status ---- */
  var table = document.querySelector('[data-hours]');
  if (!table) return;
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var rows = Array.prototype.slice.call(table.querySelectorAll('tr[data-day]'));
  var week = {};
  rows.forEach(function (r) {
    var d = Number(r.getAttribute('data-day'));
    week[d] = r.hasAttribute('data-open') ? { open: toMin(r.getAttribute('data-open')), close: toMin(r.getAttribute('data-close')), row: r } : { row: r };
  });

  function toMin(hhmm) { var p = hhmm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function say(min) {                                   /* 540 -> "9am", 1050 -> "5:30pm" */
    var h = Math.floor(min / 60), m = min % 60, suffix = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + (m ? ':' + String(m).padStart(2, '0') : '') + suffix;
  }
  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    return { day: DAYS.indexOf(get('weekday')), min: Number(get('hour')) * 60 + Number(get('minute')) };
  }
  function nextOpening(now) {
    for (var i = 0; i < 8; i++) {
      var d = (now.day + i) % 7, h = week[d];
      if (!h || h.open == null) continue;
      if (i === 0 && now.min >= h.open) continue;
      var when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d];
      return 'opens ' + when + ' at ' + say(h.open);
    }
    return 'phone to check opening times';
  }

  function render() {
    var now = londonNow(), today = week[now.day] || {};
    var open = today.open != null && now.min >= today.open && now.min < today.close;
    var label = open ? 'Open now' : 'Closed now';
    var detail = open ? 'until ' + say(today.close) + ' today' : nextOpening(now);

    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.setAttribute('data-state', open ? 'open' : 'closed');
      el.innerHTML = '<span>' + label + '</span> <span class="status__detail">' + detail + '</span>';
    });
    document.querySelectorAll('[data-when-closed]').forEach(function (el) { el.hidden = open; });
    rows.forEach(function (r) {
      var isToday = Number(r.getAttribute('data-day')) === now.day;
      r.classList.toggle('is-today', isToday);
      var th = r.querySelector('th'), tag = th.querySelector('.today-tag');
      if (isToday && !tag) th.insertAdjacentHTML('beforeend', '<span class="today-tag"> (today)</span>');
      if (!isToday && tag) tag.remove();
    });
  }
  render();
  setInterval(render, 60 * 1000);
})();
