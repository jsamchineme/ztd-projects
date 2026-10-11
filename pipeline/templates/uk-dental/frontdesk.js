/* Front Desk: menu toggle and live open/closed status. Plain JS, no dependencies.
   Hours are read from <script type="application/json" id="practice-hours"> in the page,
   so a builder only edits the HTML. Times are always worked out in Europe/London. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* ---- Live status ---- */
  var dataEl = document.getElementById('practice-hours');
  if (!dataEl) return;
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (err) { return; }

  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: data.timeZone || 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day: day, mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
  }
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  /* NHS style: 9am, 5:30pm, midday */
  function say(t) {
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    var h12 = h % 12 || 12, suffix = h < 12 ? 'am' : 'pm';
    return h12 + (mm ? ':' + String(mm).padStart(2, '0') : '') + suffix;
  }
  function sessions(d) { return (data.open[DAYS[d]] || []).map(function (s) { return [toMins(s[0]), toMins(s[1]), s[0], s[1]]; }); }

  function work(now) {
    var today = sessions(now.day);
    for (var i = 0; i < today.length; i++) {
      var s = today[i];
      if (now.mins >= s[0] && now.mins < s[1]) {
        var next = today[i + 1];
        var left = s[1] - now.mins;
        if (next) return { state: left <= 30 ? 'soon' : 'open', label: 'Open now', detail: 'until ' + say(s[3]) + ', then ' + say(next[2]) + ' to ' + say(next[3]) };
        return { state: left <= 30 ? 'soon' : 'open', label: left <= 30 ? 'Closing soon' : 'Open now', detail: 'until ' + say(s[3]) + ' today' };
      }
      if (now.mins < s[0]) {
        var lunch = i > 0;
        return { state: lunch ? 'lunch' : 'closed', label: lunch ? 'Closed for lunch' : 'Closed now', detail: 'opens again at ' + say(s[2]) + (lunch ? '' : ' today') };
      }
    }
    for (var add = 1; add <= 7; add++) {
      var d = (now.day + add) % 7, list = sessions(d);
      if (list.length) return { state: 'closed', label: 'Closed now', detail: 'opens ' + (add === 1 ? 'tomorrow' : NAMES[d]) + ' at ' + say(list[0][2]) };
    }
    return { state: 'closed', label: 'Closed now', detail: '' };
  }

  function emergencyNow(now) {
    var e = (data.emergency || {})[DAYS[now.day]] || [];
    for (var i = 0; i < e.length; i++) if (now.mins >= toMins(e[i][0]) && now.mins < toMins(e[i][1])) return 'The emergency phone line is open now, until ' + say(e[i][1]) + '.';
    return '';
  }

  function render() {
    var now = londonNow();
    var st = work(now);
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.setAttribute('data-state', st.state);
      var s = el.querySelector('.status__state'), t = el.querySelector('.status__detail');
      if (s) s.textContent = st.label;
      if (t) t.textContent = st.detail;
    });
    var todayList = sessions(now.day);
    var todayText = todayList.length ? 'Today: ' + todayList.map(function (x) { return say(x[2]) + ' to ' + say(x[3]); }).join(', ') : 'Closed today';
    document.querySelectorAll('[data-today-hours]').forEach(function (el) { el.textContent = todayText; });
    var em = emergencyNow(now);
    document.querySelectorAll('[data-emergency-now]').forEach(function (el) { el.textContent = em; el.hidden = !em; });
    document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
      var isToday = tr.getAttribute('data-day') === DAYS[now.day];
      tr.classList.toggle('is-today', isToday);
      var th = tr.querySelector('th'), tag = th.querySelector('.today-tag');
      if (isToday && !tag) { tag = document.createElement('span'); tag.className = 'today-tag'; tag.textContent = 'Today'; th.appendChild(tag); }
      if (!isToday && tag) tag.remove();
    });
  }
  render();
  setInterval(render, 60000);
})();
