/* Studio: phone menu, live open or closed status, the treatment index and the ribbon's pause button.
   Plain JS, no dependencies. Hours come from <script type="application/json" id="practice-hours"> in the page,
   so a builder only edits HTML. Times are always worked out in Europe/London, whatever the visitor's clock. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  /* ---- Phone menu ---- */
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

  /* ---- Treatment index: disclosure buttons. On wide screens one panel is always open (it sits beside the list);
     on phones each row opens and closes in place. Without JS every panel shows. ---- */
  var wide = window.matchMedia('(min-width: 60em)');
  document.querySelectorAll('[data-index]').forEach(function (index) {
    var buttons = Array.prototype.slice.call(index.querySelectorAll('.index__btn'));
    index.style.setProperty('--n', buttons.length);
    var panelOf = function (b) { return document.getElementById(b.getAttribute('aria-controls')); };
    var show = function (btn, open) { btn.setAttribute('aria-expanded', String(open)); panelOf(btn).hidden = !open; };
    var linked = buttons.filter(function (b) { return location.hash && panelOf(b).id === location.hash.slice(1); })[0];
    var initial = linked || buttons[0];
    buttons.forEach(function (b) { show(b, b === initial && (wide.matches || !!linked)); });
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        if (wide.matches) { if (open) return; buttons.forEach(function (o) { show(o, o === b); }); }
        else show(b, !open);
      });
    });
    var sync = function () {
      if (!wide.matches) return;
      var openOnes = buttons.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
      var keep = openOnes[0] || buttons[0];
      buttons.forEach(function (o) { show(o, o === keep); });
    };
    if (wide.addEventListener) wide.addEventListener('change', sync); else if (wide.addListener) wide.addListener(sync);
  });

  /* ---- Ribbon: pause and play. It also pauses on hover and focus (CSS). ---- */
  document.querySelectorAll('.ribbon').forEach(function (r) {
    var btn = r.querySelector('.ribbon__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var paused = !r.classList.contains('is-paused');
      r.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-pressed', String(paused));
    });
  });

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
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
  }
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function say(t) { /* NHS style: 9am, 5:30pm, midday */
    var m = toMins(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return 'midday';
    return (h % 12 || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (h < 12 ? 'am' : 'pm');
  }
  function sessions(d) { return (data.open[DAYS[d]] || []).map(function (s) { return [toMins(s[0]), toMins(s[1]), s[0], s[1]]; }); }

  function work(now) {
    var today = sessions(now.day);
    for (var i = 0; i < today.length; i++) {
      var s = today[i];
      if (now.mins >= s[0] && now.mins < s[1]) {
        var next = today[i + 1], left = s[1] - now.mins;
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

  function render() {
    var now = londonNow(), st = work(now);
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.setAttribute('data-state', st.state);
      var s = el.querySelector('.status__state'), t = el.querySelector('.status__detail');
      if (s) s.textContent = st.label;
      if (t) t.textContent = st.detail;
    });
    var list = sessions(now.day);
    var first = list.length ? say(list[0][2]) : '', last = list.length ? say(list[list.length - 1][3]) : '';
    var text = list.length ? 'Today: ' + first + ' to ' + last + (list.length > 1 ? ' (closed for lunch ' + say(list[0][3]) + ' to ' + say(list[1][2]) + ')' : '') : 'Closed today';
    document.querySelectorAll('[data-today-hours]').forEach(function (el) { el.textContent = text; });
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
