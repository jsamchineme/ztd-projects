/* Front Desk: shared behaviour for the GP practice template.
   Plain JavaScript, no dependencies, no build step. Everything practice-specific
   lives in the <script type="application/json" id="practice-schedule"> block in
   the page, so builders never edit this file.

   1. Phone menu toggle (aria-expanded, aria-controls, Escape closes it)
   2. Live open/closed status, in UK time (Europe/London), from the schedule
   3. Dated notices that appear and disappear on their own
   4. Opening-times table: marks the row that applies now; drops past holidays
   5. Site search that answers inline, in the page (never an overlay)
*/
(function () {
  'use strict';
  var doc = document;

  /* ---------- 1. Menu ---------- */
  var toggle = doc.querySelector('.nav__toggle');
  if (toggle) {
    var list = doc.getElementById(toggle.getAttribute('aria-controls'));
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      list.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* ---------- Schedule ---------- */
  var dataEl = doc.getElementById('practice-schedule');
  if (!dataEl) return;
  var S;
  try { S = JSON.parse(dataEl.textContent); } catch (err) { return; }
  var TZ = S.timezone || 'Europe/London';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Current date and minutes past midnight in the practice's time zone.
  function nowParts(date) {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    var iso = p.year + '-' + p.month + '-' + p.day;
    return { iso: iso, mins: (+p.hour) * 60 + (+p.minute), dow: new Date(iso + 'T12:00:00Z').getUTCDay() };
  }
  var toMins = function (hhmm) { var a = hhmm.split(':'); return (+a[0]) * 60 + (+a[1]); };
  // NHS style: 8am, 8:30am, 12:30pm, midday
  function fmtTime(hhmm) {
    var m = toMins(hhmm), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    var suffix = h >= 12 ? 'pm' : 'am', h12 = h % 12 || 12;
    return h12 + (mm ? ':' + String(mm).padStart(2, '0') : '') + suffix;
  }
  function addDays(iso, n) {
    var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function longDate(iso) {
    var d = new Date(iso + 'T12:00:00Z');
    return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()];
  }
  function periodsFor(iso) {
    var special = S.specialDays && S.specialDays[iso];
    if (special) return special.periods || [];
    if ((S.holidays || []).indexOf(iso) !== -1) return [];
    var dow = new Date(iso + 'T12:00:00Z').getUTCDay();
    return (S.weekdays || []).indexOf(dow) !== -1 ? S.periods : [];
  }
  function isOpenState(p) { return p.state === 'open' || p.state === 'limited'; }

  // The next time the practice opens (first open or limited period after now).
  function nextOpening(now) {
    for (var i = 0; i < 21; i++) {
      var iso = addDays(now.iso, i);
      var ps = periodsFor(iso);
      for (var j = 0; j < ps.length; j++) {
        if (!isOpenState(ps[j])) continue;
        if (i === 0 && toMins(ps[j].from) <= now.mins) continue;
        return { iso: iso, at: ps[j].from, offset: i };
      }
    }
    return null;
  }
  function whenText(next, now) {
    if (!next) return '';
    var day = next.offset === 0 ? 'today' : next.offset === 1 ? 'tomorrow' : 'on ' + DAYS[new Date(next.iso + 'T12:00:00Z').getUTCDay()];
    // Give the full date if it is a week or more away, or a holiday falls in between.
    for (var k = 1; k < next.offset; k++) {
      if (next.offset >= 7 || (S.holidays || []).indexOf(addDays(now.iso, k)) !== -1) { day = 'on ' + longDate(next.iso); break; }
    }
    return day + ' at ' + fmtTime(next.at);
  }

  /* ---------- 2. Live status ---------- */
  var status = doc.getElementById('status');
  function renderStatus() {
    if (!status) return;
    var now = nowParts(new Date());
    var ps = periodsFor(now.iso);
    var cur = null;
    for (var i = 0; i < ps.length; i++) {
      if (toMins(ps[i].from) <= now.mins && now.mins < toMins(ps[i].to)) { cur = ps[i]; break; }
    }
    var special = S.specialDays && S.specialDays[now.iso];
    var holiday = (S.holidays || []).indexOf(now.iso) !== -1;
    var state, word, detail;
    if (cur && cur.state !== 'closed') {
      state = cur.state; word = cur.label; detail = cur.detail || '';
    } else {
      state = 'closed';
      var next = nextOpening(now);
      if (cur && cur.state === 'closed') { word = cur.label || S.closed.label; }
      else if (special && special.closedLabel && ps.length && now.mins >= toMins(ps[ps.length - 1].to)) { word = special.closedLabel; }
      else if (holiday) { word = S.closed.holidayLabel || 'Closed for the public holiday'; }
      else { word = S.closed.label; }
      var opens = next ? 'We open ' + (next.offset === 0 ? '' : 'again ') + whenText(next, now) + '. ' : '';
      detail = (cur && cur.detail ? cur.detail + ' ' : opens) + S.closed.detail;
    }
    status.setAttribute('data-state', state);
    var set = function (sel, text) { var el = status.querySelector(sel); if (el) el.textContent = text; };
    set('[data-status="date"]', longDate(now.iso));
    set('[data-status="word"]', word);
    set('[data-status="detail"]', detail);
  }
  renderStatus();
  setInterval(renderStatus, 30000);
  doc.addEventListener('visibilitychange', function () { if (!doc.hidden) renderStatus(); });

  /* ---------- 3. Dated notices ---------- */
  var today = nowParts(new Date());
  Array.prototype.forEach.call(doc.querySelectorAll('[data-show-until]'), function (el) {
    var from = el.getAttribute('data-show-from'), until = el.getAttribute('data-show-until');
    if ((from && today.iso < from) || today.iso > until) el.hidden = true;
  });

  /* ---------- 4. Opening times ---------- */
  var openDay = periodsFor(today.iso) === S.periods;
  Array.prototype.forEach.call(doc.querySelectorAll('tr[data-from]'), function (row) {
    var match = openDay && toMins(row.getAttribute('data-from')) <= today.mins && today.mins < toMins(row.getAttribute('data-to'));
    if (!match) return;
    row.classList.add('is-now');
    var th = row.querySelector('th');
    if (th) th.insertAdjacentHTML('beforeend', ' <span class="tag tag--blue">Now</span>');
  });
  Array.prototype.forEach.call(doc.querySelectorAll('[data-date]'), function (li) {
    if (li.getAttribute('data-date') < today.iso) li.hidden = true;
  });

  /* ---------- 5. Search ---------- */
  var form = doc.querySelector('form.search');
  var out = doc.getElementById('search-results');
  if (!form || !out) return;
  var input = form.querySelector('input[type="search"]');
  var entries = Array.prototype.map.call(doc.querySelectorAll('[data-search]'), function (el) {
    var heading = el.querySelector('h2, h3, h4');
    var title = el.getAttribute('data-search-title') || (heading ? heading.textContent.trim() : '');
    var text = (title + ' ' + el.getAttribute('data-search')).toLowerCase();
    return { id: el.id, title: title, hint: el.getAttribute('data-search-hint') || '', text: text };
  });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function search(q) {
    var words = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 1; });
    return entries.map(function (e) {
      var score = 0;
      words.forEach(function (w) {
        var stem = w.length > 4 ? w.replace(/(ing|es|s)$/, '') : w;
        if (e.text.indexOf(stem) !== -1) score += e.title.toLowerCase().indexOf(stem) !== -1 ? 3 : 1;
      });
      return { e: e, score: score };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; }).slice(0, 5);
  }
  function show(q) {
    var results = search(q);
    var phone = S.phone ? ' or phone us on <a href="tel:' + esc(S.phoneHref || S.phone.replace(/\s/g, '')) + '">' + esc(S.phone) + '</a>' : '';
    out.innerHTML = '<div class="wrap"><div class="search-results__box">' +
      '<h2 id="search-results-title" tabindex="-1">' + (results.length ? 'Results for “' + esc(q) + '”' : 'No results for “' + esc(q) + '”') + '</h2>' +
      (results.length
        ? '<ul class="search-results__list">' + results.map(function (r) {
            return '<li><a href="#' + esc(r.e.id) + '">' + esc(r.e.title) + '</a>' + (r.e.hint ? '<p>' + esc(r.e.hint) + '</p>' : '') + '</li>';
          }).join('') + '</ul>'
        : '<p>Try another word, like “appointment” or “prescription”' + phone + '.</p>') +
      '<button type="button" class="search-results__clear">Clear search</button></div></div>';
    out.hidden = false;
    out.querySelector('h2').focus();
  }
  out.addEventListener('click', function (e) {
    if (e.target.closest('.search-results__clear')) { out.hidden = true; out.innerHTML = ''; input.value = ''; input.focus(); }
    else if (e.target.closest('a')) { out.hidden = true; }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (q) show(q);
  });
  var params = new URLSearchParams(location.search);
  if (params.get('q')) { input.value = params.get('q'); show(params.get('q')); }
})();
