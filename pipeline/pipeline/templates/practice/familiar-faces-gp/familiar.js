/* Familiar Faces: the template's only script. Plain JavaScript, no dependencies.
   Every practice-specific value lives in the page, in
   <script type="application/json" id="practice-schedule">, so builders never edit this file.

   1. Phone menu: aria-expanded, aria-controls, Escape closes it
   2. Live open or closed status in UK time (Europe/London), from the schedule
   3. Past holiday dates hide themselves
*/
(function () {
  'use strict';
  var doc = document;

  /* 1. Menu ---------------------------------------------------------------- */
  var toggle = doc.querySelector('.nav__toggle');
  if (toggle) {
    var list = doc.getElementById(toggle.getAttribute('aria-controls'));
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      list.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* Schedule --------------------------------------------------------------- */
  var dataEl = doc.getElementById('practice-schedule');
  if (!dataEl) return;
  var S;
  try { S = JSON.parse(dataEl.textContent); } catch (err) { return; }
  var TZ = S.timezone || 'Europe/London';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var holidays = S.holidays || [];

  function nowParts(date) {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    var iso = p.year + '-' + p.month + '-' + p.day;
    return { iso: iso, mins: (+p.hour) * 60 + (+p.minute) };
  }
  function toMins(t) { var a = t.split(':'); return (+a[0]) * 60 + (+a[1]); }
  function dow(iso) { return new Date(iso + 'T12:00:00Z').getUTCDay(); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function longDate(iso) { var d = new Date(iso + 'T12:00:00Z'); return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]; }
  // NHS style: 8am, 5:30pm, midday
  function fmt(t) {
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    return (h % 12 || 12) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h >= 12 ? 'pm' : 'am');
  }
  function periodsFor(iso) {
    var sp = S.specialDays && S.specialDays[iso];
    if (sp) return sp.periods || [];
    if (holidays.indexOf(iso) !== -1) return [];
    return (S.weekdays || []).indexOf(dow(iso)) !== -1 ? S.periods : [];
  }
  // Next time the phone lines open (the next "open" period after now)
  function nextOpen(now) {
    for (var i = 0; i < 21; i++) {
      var iso = addDays(now.iso, i), ps = periodsFor(iso);
      for (var j = 0; j < ps.length; j++) {
        if (ps[j].state !== 'open') continue;
        if (i === 0 && toMins(ps[j].from) <= now.mins) continue;
        var day = i === 0 ? 'today' : i === 1 ? 'tomorrow' : 'on ' + DAYS[dow(iso)];
        for (var k = 1; k < i; k++) { if (i >= 7 || holidays.indexOf(addDays(now.iso, k)) !== -1) { day = 'on ' + longDate(iso); break; } }
        return day + ' at ' + fmt(ps[j].from);
      }
    }
    return '';
  }

  /* 2. Live status ---------------------------------------------------------- */
  var card = doc.getElementById('now');
  function render() {
    if (!card) return;
    var now = nowParts(new Date()), ps = periodsFor(now.iso), cur = null;
    for (var i = 0; i < ps.length; i++) {
      if (toMins(ps[i].from) <= now.mins && now.mins < toMins(ps[i].to)) { cur = ps[i]; break; }
    }
    var state = 'closed', word, detail, opens = nextOpen(now), sp = S.specialDays && S.specialDays[now.iso];
    if (cur && cur.state !== 'closed') {
      state = cur.state; word = cur.label; detail = cur.detail || '';
    } else {
      if (cur && cur.label) word = cur.label;
      else if (sp && sp.closedLabel) word = sp.closedLabel;
      else if (holidays.indexOf(now.iso) !== -1) word = S.closed.holidayLabel;
      else word = S.closed.label;
      detail = (opens ? 'Phone lines open ' + opens + '. ' : '') + S.closed.detail;
    }
    card.setAttribute('data-state', state);
    var q = function (k) { return card.querySelector('[data-now="' + k + '"]'); };
    if (q('date')) q('date').textContent = 'Today is ' + longDate(now.iso) + ', ' + fmt(('0' + Math.floor(now.mins / 60)).slice(-2) + ':' + ('0' + now.mins % 60).slice(-2)) + '.';
    if (q('word')) q('word').textContent = word;
    if (q('detail')) q('detail').textContent = detail;
  }
  render();
  setInterval(render, 60000);

  /* 3. Hide past dates ------------------------------------------------------ */
  var today = nowParts(new Date()).iso;
  [].forEach.call(doc.querySelectorAll('[data-date]'), function (el) {
    if (el.getAttribute('data-date') < today) el.hidden = true;
  });
  // If every listed date has passed, say so rather than show an empty list.
  [].forEach.call(doc.querySelectorAll('.dates'), function (list) {
    if (list.querySelector('li:not([hidden])')) return;
    var li = doc.createElement('li');
    li.textContent = 'No upcoming dates are published. Phone to check.';
    list.appendChild(li);
  });
})();
