/* Results: menu toggle, live open/closed status and the before-and-after comparison.
   Plain JS, no dependencies, about 150 lines. A builder never edits this file:
   - hours come from <script type="application/json" id="practice-hours"> in the page
   - every <figure class="ba" data-ba> becomes a comparison slider
   Times are always worked out in Europe/London, whatever the visitor's clock says. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Menu (phones and tablets) ---- */
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

  /* ---- Before-and-after comparison ----
     The divider position is a real <input type="range"> (0 to 100): the before
     photo shows to the left of the divider and the after photo to the right.
     Arrow keys, Home/End, pointer drag on the photo and the two buttons all move it. */
  document.querySelectorAll('[data-ba]').forEach(function (fig, n) {
    var frame = fig.querySelector('.ba__frame');
    var range = fig.querySelector('.ba__range');
    var buttons = fig.querySelectorAll('[data-ba-show]');
    if (!frame || !range) return;
    fig.classList.add('ba--live');
    var setPos = function (v, animate) {
      v = Math.max(0, Math.min(100, Math.round(v)));
      if (animate && !reduceMotion) {
        fig.classList.add('is-animating');
        setTimeout(function () { fig.classList.remove('is-animating'); }, 380);
      }
      frame.style.setProperty('--pos', v + '%');
      range.value = v;
      range.setAttribute('aria-valuetext',
        v >= 100 ? 'Showing the before photo' : v <= 0 ? 'Showing the after photo' :
        'Before on the left ' + v + '%, after on the right ' + (100 - v) + '%');
      buttons.forEach(function (b) {
        var w = b.getAttribute('data-ba-show');
        b.setAttribute('aria-pressed', String((w === 'before' && v >= 100) || (w === 'after' && v <= 0)));
      });
    };
    range.addEventListener('input', function () { setPos(+range.value); });
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setPos(b.getAttribute('data-ba-show') === 'before' ? 100 : 0, true); });
    });
    var dragging = false;
    var fromPointer = function (e) {
      var r = frame.getBoundingClientRect();
      setPos(((e.clientX - r.left) / r.width) * 100);
    };
    frame.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; fromPointer(e);
      if (frame.setPointerCapture) frame.setPointerCapture(e.pointerId);
    });
    frame.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
      frame.addEventListener(t, function () { dragging = false; });
    });
    setPos(+range.value || 50);
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
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day: day, mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
  }
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  /* NHS style: 9am, 12:30pm, midday */
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
        var next = today[i + 1], left = s[1] - now.mins;
        if (next) return { state: left <= 30 ? 'soon' : 'open', label: left <= 30 ? 'Closing for lunch soon' : 'Open now', detail: 'until ' + say(s[3]) + ', then ' + say(next[2]) + ' to ' + say(next[3]) };
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
    var now = londonNow();
    var st = work(now);
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.setAttribute('data-state', st.state);
      var s = el.querySelector('.status__state'), t = el.querySelector('.status__detail');
      if (s) s.textContent = st.label;
      if (t) t.textContent = st.detail;
    });
    var todayList = sessions(now.day);
    var todayText = todayList.length ? 'Today ' + say(todayList[0][2]) + ' to ' + say(todayList[todayList.length - 1][3]) : 'Closed today';
    document.querySelectorAll('[data-today-hours]').forEach(function (el) { el.textContent = todayText; });
    document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
      var days = tr.getAttribute('data-day').split(' ');
      var isToday = days.indexOf(DAYS[now.day]) !== -1;
      tr.classList.toggle('is-today', isToday);
      var th = tr.querySelector('th'), tag = th.querySelector('.today-tag');
      if (isToday && !tag) { tag = document.createElement('span'); tag.className = 'today-tag'; tag.textContent = 'Today'; th.appendChild(tag); }
      if (!isToday && tag) tag.remove();
    });
  }
  render();
  setInterval(render, 60000);
})();
