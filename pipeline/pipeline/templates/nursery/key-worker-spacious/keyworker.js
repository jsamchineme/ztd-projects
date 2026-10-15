/* Key Worker: the template's only script. Plain JavaScript, no dependencies.
   Every nursery-specific value lives in the page, in
   <script type="application/json" id="nursery-hours">, so builders never edit this file.

   1. Phone menu: a full-height sheet; aria-expanded, aria-controls, Escape closes it
   2. Live "Open now" or "Closed now" status in UK time (Europe/London)
   3. Dated items: [data-date] hides once past; [data-show-from] / [data-show-until] show a notice only between its dates
*/
(function () {
  'use strict';
  var doc = document;

  /* 1. Menu ---------------------------------------------------------------- */
  /* Phones and tablets: a full-height sheet under the header (S11). The page behind
     stops scrolling; Escape, a link, or tabbing out of the sheet closes it. */
  var toggle = doc.querySelector('.nav__toggle');
  if (toggle) {
    var list = doc.getElementById(toggle.getAttribute('aria-controls'));
    var bar = toggle.parentNode;
    var wide = window.matchMedia('(min-width: 64em)');
    var setOpen = function (open) {
      if (open) list.style.setProperty('--sheet-top', Math.max(0, bar.getBoundingClientRect().bottom) + 'px');
      toggle.setAttribute('aria-expanded', String(open));
      list.classList.toggle('is-open', open);
      doc.documentElement.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    list.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (to && to !== toggle && !list.contains(to) && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
    var onWide = function () { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* Time helpers ------------------------------------------------------------ */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function nowParts(tz) {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { iso: p.year + '-' + p.month + '-' + p.day, mins: (+p.hour) * 60 + (+p.minute) };
  }
  function toMins(t) { var a = t.split(':'); return (+a[0]) * 60 + (+a[1]); }
  function dow(iso) { return new Date(iso + 'T12:00:00Z').getUTCDay(); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function longDate(iso) { var d = new Date(iso + 'T12:00:00Z'); return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]; }
  function fmt(t) { // GOV.UK style: 8am, 5:30pm, midday
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    return (h % 12 || 12) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h >= 12 ? 'pm' : 'am');
  }

  /* 2. Live status ------------------------------------------------------------ */
  var dataEl = doc.getElementById('nursery-hours');
  var H = null;
  if (dataEl) { try { H = JSON.parse(dataEl.textContent); } catch (err) { H = null; } }
  var TZ = (H && H.timezone) || 'Europe/London';

  function closedOn(iso) {
    var c = (H.closures || []);
    for (var i = 0; i < c.length; i++) { if (iso >= c[i].from && iso <= c[i].to) return c[i]; }
    return null;
  }
  function hoursOn(iso) {
    if (closedOn(iso)) return null;
    return (H.weekdays || []).indexOf(dow(iso)) !== -1 ? H.hours : null;
  }
  function nextOpen(now) {
    for (var i = 0; i < 40; i++) {
      var iso = addDays(now.iso, i), h = hoursOn(iso);
      if (!h || (i === 0 && toMins(h.from) <= now.mins)) continue;
      var day = i === 0 ? 'today' : i === 1 ? 'tomorrow' : i < 7 ? 'on ' + DAYS[dow(iso)] : 'on ' + longDate(iso);
      return 'Opens ' + day + ' at ' + fmt(h.from) + '.';
    }
    return '';
  }
  function render() {
    var el = doc.querySelector('[data-status]');
    if (!el || !H) return;
    var now = nowParts(TZ), h = hoursOn(now.iso), c = closedOn(now.iso);
    var open = h && toMins(h.from) <= now.mins && now.mins < toMins(h.to);
    el.setAttribute('data-state', open ? 'open' : 'closed');
    var word = el.querySelector('[data-status-word]'), detail = el.querySelector('[data-status-detail]');
    if (word) word.textContent = open ? 'Open now' : (c && c.label ? c.label : 'Closed now');
    if (detail) detail.textContent = open ? 'We close at ' + fmt(h.to) + ' today.' : nextOpen(now);
  }
  render();
  setInterval(render, 60000);

  /* 3. Dated items ------------------------------------------------------------ */
  var today = nowParts(TZ).iso;
  [].forEach.call(doc.querySelectorAll('[data-date]'), function (el) {
    if (el.getAttribute('data-date') < today) el.hidden = true;
  });
  [].forEach.call(doc.querySelectorAll('[data-show-from], [data-show-until]'), function (el) {
    var from = el.getAttribute('data-show-from') || '0000-00-00', until = el.getAttribute('data-show-until') || '9999-12-31';
    el.hidden = !(today >= from && today <= until);
  });
  [].forEach.call(doc.querySelectorAll('.dates'), function (list) {
    if (list.querySelector('li:not([hidden])')) return;
    var li = doc.createElement('li');
    li.textContent = 'No upcoming closures are published. Phone to check.';
    list.appendChild(li);
  });
})();
