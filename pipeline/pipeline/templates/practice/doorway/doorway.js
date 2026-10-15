/* Doorway: phone menu and live open/closed status. Plain JS, no dependencies, no network.
   Hours come from <script type="application/json" id="practice-hours"> in the page.
   Times are always worked out in Europe/London, whatever the visitor's clock says. */
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
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), mins: +get('hour') * 60 + +get('minute') };
  }
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  /* NHS style: 9am, 5:30pm, midday */
  function say(t) {
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    return (h % 12 || 12) + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + (h < 12 ? 'am' : 'pm');
  }
  function sessions(d) { return (data.open[DAYS[d]] || []).map(function (s) { return [toMins(s[0]), toMins(s[1]), s[0], s[1]]; }); }
  function dayText(d) {
    var list = sessions(d);
    if (!list.length) return 'Closed';
    return list.map(function (s) { return say(s[2]) + ' to ' + say(s[3]); }).join(', then ');
  }

  function work(now) {
    var today = sessions(now.day);
    for (var i = 0; i < today.length; i++) {
      var s = today[i], next = today[i + 1];
      if (now.mins >= s[0] && now.mins < s[1]) {
        var soon = s[1] - now.mins <= 30;
        return { state: soon ? 'soon' : 'open', label: soon ? 'Closing soon' : 'Open now',
          detail: 'until ' + say(s[3]) + (next ? ', then ' + say(next[2]) + ' to ' + say(next[3]) : ' today') };
      }
      if (now.mins < s[0]) {
        return { state: 'closed', label: i > 0 ? 'Closed for lunch' : 'Closed now', detail: 'opens ' + (i > 0 ? 'again ' : '') + 'at ' + say(s[2]) + ' today' };
      }
    }
    for (var add = 1; add <= 7; add++) {
      var d = (now.day + add) % 7, list = sessions(d);
      if (list.length) return { state: 'closed', label: 'Closed now', detail: 'opens ' + (add === 1 ? 'tomorrow' : NAMES[d]) + ' at ' + say(list[0][2]) };
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
    for (var j = 0; j < todays.length; j++) todays[j].textContent = 'Today: ' + dayText(now.day);
    var rows = document.querySelectorAll('tr[data-day]');
    for (var k = 0; k < rows.length; k++) rows[k].classList.toggle('is-today', rows[k].getAttribute('data-day') === DAYS[now.day]);
  }
  render();
  setInterval(render, 60000);
})();
