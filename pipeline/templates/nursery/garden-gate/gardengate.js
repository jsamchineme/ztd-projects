/* Garden Gate: phone menu, live open/closed status (term closures included) and dated notices.
   Plain JS, no dependencies, no network. Everything comes from the page:
   - <script type="application/json" id="nursery-hours"> holds the hours and the closures;
   - [data-show-from] / [data-show-until] (YYYY-MM-DD) on a notice hide it outside those dates.
   Dates and times are always worked out in Europe/London, whatever the visitor's clock says. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  /* ---- Phone menu: a real button with aria-expanded and aria-controls ---- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  var dataEl = document.getElementById('nursery-hours');
  var data = { timeZone: 'Europe/London', open: {}, closed: [] };
  if (dataEl) { try { data = JSON.parse(dataEl.textContent); } catch (err) { /* keep the fallback text */ } }

  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* Today's date and time in London, as { iso: 'YYYY-MM-DD', day: 0-6, mins } */
  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: data.timeZone || 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    return {
      iso: get('year') + '-' + get('month') + '-' + get('day'),
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
      mins: +get('hour') * 60 + +get('minute')
    };
  }
  /* Calendar arithmetic on YYYY-MM-DD strings, done in UTC so clocks changing can't shift a day */
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function longDate(iso) { var d = new Date(iso + 'T12:00:00Z'); return NAMES[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]; }

  /* ---- Dated notices: shown only between their dates (inclusive) ---- */
  var now0 = londonNow();
  var dated = document.querySelectorAll('[data-show-from], [data-show-until]');
  for (var n = 0; n < dated.length; n++) {
    var from = dated[n].getAttribute('data-show-from'), until = dated[n].getAttribute('data-show-until');
    dated[n].hidden = (from && now0.iso < from) || (until && now0.iso > until) || false;
  }
  /* Rows in a dates table that have passed get a quieter style */
  var rows = document.querySelectorAll('tr[data-date-until]');
  for (var r = 0; r < rows.length; r++) rows[r].classList.toggle('is-past', rows[r].getAttribute('data-date-until') < now0.iso);

  /* ---- Live status ---- */
  if (!dataEl) return;
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  /* GOV.UK style: 9am, 5:30pm, midday */
  function say(t) {
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    return (h % 12 || 12) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h < 12 ? 'am' : 'pm');
  }
  function closure(iso) {
    var list = data.closed || [];
    for (var i = 0; i < list.length; i++) if (iso >= list[i].from && iso <= (list[i].to || list[i].from)) return list[i];
    return null;
  }
  function sessionsOn(iso, day) { return closure(iso) ? [] : (data.open[DAYS[day]] || []).map(function (s) { return [toMins(s[0]), toMins(s[1]), s[0], s[1]]; }); }
  function dayText(day) {
    var list = data.open[DAYS[day]] || [];
    if (!list.length) return 'Closed';
    return list.map(function (s) { return say(s[0]) + ' to ' + say(s[1]); }).join(', then ');
  }

  function work(now) {
    var shut = closure(now.iso);
    var today = sessionsOn(now.iso, now.day);
    for (var i = 0; i < today.length; i++) {
      var s = today[i];
      if (now.mins >= s[0] && now.mins < s[1]) {
        var soon = s[1] - now.mins <= 30;
        return { state: soon ? 'soon' : 'open', label: soon ? 'Closing soon' : 'Open now', detail: 'until ' + say(s[3]) + ' today' };
      }
      if (now.mins < s[0]) return { state: 'closed', label: 'Closed now', detail: 'opens at ' + say(s[2]) + ' today' };
    }
    for (var add = 1; add <= 60; add++) {
      var iso = addDays(now.iso, add), d = (now.day + add) % 7, list = sessionsOn(iso, d);
      if (list.length) {
        var when = add === 1 ? 'tomorrow' : add < 7 ? NAMES[d] : longDate(iso);
        return shut
          ? { state: 'holiday', label: 'Closed today: ' + shut.label, detail: 'opens ' + when + ' at ' + say(list[0][2]) }
          : { state: 'closed', label: 'Closed now', detail: 'opens ' + when + ' at ' + say(list[0][2]) };
      }
    }
    return { state: 'closed', label: 'Closed now', detail: '' };
  }

  function render() {
    var now = londonNow(), st = work(now);
    var pills = document.querySelectorAll('[data-live-status]');
    for (var i = 0; i < pills.length; i++) {
      pills[i].setAttribute('data-status', st.state);
      pills[i].querySelector('.status__state').textContent = st.label;
      pills[i].querySelector('.status__detail').textContent = st.detail;
    }
    var todays = document.querySelectorAll('[data-today-hours]');
    for (var j = 0; j < todays.length; j++) todays[j].textContent = 'Today: ' + (closure(now.iso) ? 'Closed' : dayText(now.day));
    var hrs = document.querySelectorAll('tr[data-day]');
    for (var k = 0; k < hrs.length; k++) hrs[k].classList.toggle('is-today', hrs[k].getAttribute('data-day') === DAYS[now.day]);
  }
  render();
  setInterval(render, 60000);
})();
