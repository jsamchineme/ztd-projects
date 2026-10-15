/* Front Desk: the only script. No dependencies, no build step.
   1. Phone menu (button says "Menu", uses aria-expanded + aria-controls).
   2. Live "open now" status from the hours in <script id="practice-hours">,
      worked out in the practice's own time zone (Europe/London).
   Without JavaScript the menu is simply open and the status shows the
   plain-text hours written into the HTML, so nothing is lost. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---- 1. Menu ---------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
    };
    setOpen(false);
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && getComputedStyle(toggle).display !== "none") setOpen(false);
    });
  }

  /* ---- 2. Open now ------------------------------------------------ */
  var source = document.getElementById("practice-hours");
  if (!source || !window.Intl) return;
  var data;
  try { data = JSON.parse(source.textContent); } catch (e) { return; }

  var KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var SOON = 60; // minutes before closing that count as "closes soon"

  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  // NHS style: 8am, 5:30pm, midday, midnight
  function say(t) {
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return "midday";
    if (m === 0 || m === 1440) return "midnight";
    var suffix = h < 12 ? "am" : "pm", h12 = h % 12 || 12;
    return h12 + (mm ? ":" + (mm < 10 ? "0" : "") + mm : "") + suffix;
  }
  function now() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: data.timeZone || "Europe/London",
      weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    var get = function (type) { for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value; };
    var day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
    var ymd = get("year") + "-" + get("month") + "-" + get("day");
    return { day: day, min: (+get("hour") % 24) * 60 + +get("minute"), ymd: ymd };
  }
  // "closures": ["2026-12-25", ...] are whole days the practice is shut.
  function addDays(ymd, n) {
    var d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function sessions(day, ymd) {
    if (ymd && data.closures && data.closures.indexOf(ymd) > -1) return [];
    return (data.days && data.days[KEYS[day]]) || [];
  }

  function work() {
    var n = now(), today = sessions(n.day, n.ymd), i, s;
    for (i = 0; i < today.length; i++) {
      s = today[i];
      if (n.min >= toMin(s[0]) && n.min < toMin(s[1])) {
        var left = toMin(s[1]) - n.min;
        return { state: left <= SOON ? "closing" : "open", text: (left <= SOON ? "Open now. Closes soon, at " : "Open now. Closes at ") + say(s[1]), day: n.day };
      }
    }
    for (var add = 0; add < 15; add++) {
      var d = (n.day + add) % 7, list = sessions(d, addDays(n.ymd, add));
      for (i = 0; i < list.length; i++) {
        if (add === 0 && toMin(list[i][0]) <= n.min) continue;
        var when = add === 0 ? "today" : add === 1 ? "tomorrow" : add < 7 ? "on " + NAMES[d] : "on " + NAMES[d] + " " + +addDays(n.ymd, add).slice(8) + " " + MONTHS[+addDays(n.ymd, add).slice(5, 7) - 1];
        return { state: "closed", text: "Closed now. Opens " + when + " at " + say(list[i][0]), day: n.day };
      }
    }
    return { state: "closed", text: "Closed now", day: n.day };
  }

  function paint() {
    var r = work();
    var pills = document.querySelectorAll("[data-status]");
    for (var i = 0; i < pills.length; i++) {
      pills[i].setAttribute("data-state", r.state);
      var label = pills[i].querySelector("[data-status-text]") || pills[i];
      label.textContent = r.text;
    }
    var rows = document.querySelectorAll("[data-day]");
    for (var j = 0; j < rows.length; j++) {
      var isToday = (" " + rows[j].getAttribute("data-day") + " ").indexOf(" " + KEYS[r.day] + " ") > -1;
      rows[j].classList.toggle("is-today", isToday);
      if (isToday) rows[j].setAttribute("aria-current", "date"); else rows[j].removeAttribute("aria-current");
    }
  }
  paint();
  setInterval(paint, 60000);
})();
