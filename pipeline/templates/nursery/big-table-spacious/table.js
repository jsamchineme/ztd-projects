/* Big Table: the only script. No dependencies, no build step.
   It is Front Desk Nursery's frontdesk.js (same behaviour, same data), plus
   one small motion helper (section 5).
   1. Phone menu ("Menu" button, aria-expanded + aria-controls, Escape closes).
      In the spacious version it opens as a full-height sheet (styles.css 5).
   2. Dated notices: [data-show-from] / [data-show-until] (YYYY-MM-DD) hide
      themselves outside their dates.
   3. Live status from <script id="nursery-schedule">, in UK time. It knows
      term time, holidays and closures.
   4. Term and closure dates: rows with data-from / data-to get "past", "now"
      and "next" marks, and [data-next-closure] gets the next closure in words.
   5. Motion: doodles ([data-draw]) draw in and recipe rows fade in once, when
      they first enter the screen. Only if the visitor allows motion. Nothing
      is ever hidden before the script runs, so content never depends on it.
   Without JavaScript the menu is simply open, every notice shows, and the
   status shows the plain hours written in the HTML. Nothing is lost.     */
(function () {
  "use strict";
  var root = document.documentElement;
  if (root.className.indexOf("js") < 0) root.className += " js";

  /* ---- 1. Menu ---------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  if (toggle && nav) {
    // Spacious version: on phones the open menu is a full-height sheet under
    // the header bar, so the page scrolls to the top and stops scrolling.
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
      root.classList.toggle("menu-open", open && getComputedStyle(toggle).display !== "none");
      if (open && getComputedStyle(toggle).display !== "none") window.scrollTo(0, 0);
    };
    setOpen(false);
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && getComputedStyle(toggle).display !== "none") setOpen(false);
    });
  }


  /* ---- 5. Motion ---------------------------------------------------- */
  (function () {
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !("IntersectionObserver" in window)) return;
    root.className += " js-motion";
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { entries[i].target.classList.add("is-in"); io.unobserve(entries[i].target); }
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.25 });
    var els = document.querySelectorAll("[data-draw], .recipe");
    for (var k = 0; k < els.length; k++) io.observe(els[k]);
  })();

  if (!window.Intl) return;
  var src = document.getElementById("nursery-schedule");
  var data = {};
  if (src) { try { data = JSON.parse(src.textContent); } catch (e) { data = {}; } }

  var KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var SOON = data.closingSoonMinutes || 30;

  function now() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: data.timeZone || "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit",
      hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; };
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")),
      min: (+get("hour") % 24) * 60 + +get("minute"),
      ymd: get("year") + "-" + get("month") + "-" + get("day")
    };
  }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function say(t) { // 9am, 3pm, 11:40am, midday
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return "midday";
    return (h % 12 || 12) + (mm ? ":" + (mm < 10 ? "0" : "") + mm : "") + (h < 12 ? "am" : "pm");
  }
  function addDays(ymd, n) { var d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayIndex(ymd) { return (new Date(ymd + "T12:00:00Z").getUTCDay() + 6) % 7; }
  function longDate(ymd, withDay) {
    return (withDay !== false ? DAYS[dayIndex(ymd)] + " " : "") + +ymd.slice(8) + " " + MONTHS[+ymd.slice(5, 7) - 1];
  }

  var today = now();

  /* ---- 2. Dated notices ------------------------------------------- */
  var dated = document.querySelectorAll("[data-show-from], [data-show-until]");
  for (var n = 0; n < dated.length; n++) {
    var from = dated[n].getAttribute("data-show-from"), until = dated[n].getAttribute("data-show-until");
    dated[n].hidden = (from && today.ymd < from) || (until && today.ymd > until) ? true : false;
  }

  /* ---- 3. Live status --------------------------------------------- */
  // A closure covers whole days: {"from": "2026-10-09", "to": "2026-10-16", "label": "the October holiday"}.
  // "term": {"from", "to", "label"}: days outside it are closed (the summer holidays).
  function closureOn(ymd) {
    var list = data.closures || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], f = c.from || c.date, t = c.to || f;
      if (ymd >= f && ymd <= t) return c;
    }
    if (data.term && (ymd < data.term.from || ymd > data.term.to)) return { label: data.term.label || "the holidays" };
    return null;
  }
  function sessions(ymd) {
    if (closureOn(ymd)) return [];
    return (data.days && data.days[KEYS[dayIndex(ymd)]]) || [];
  }
  function work() {
    var t = today, list = sessions(t.ymd), i, s;
    for (i = 0; i < list.length; i++) {
      s = list[i];
      if (t.min >= toMin(s[0]) && t.min < toMin(s[1])) {
        var left = toMin(s[1]) - t.min;
        return { state: left <= SOON ? "closing" : "open", text: left <= SOON ? "Open now. Home time soon, at " + say(s[1]) : "Open now. Home time is " + say(s[1]) };
      }
    }
    var why = closureOn(t.ymd);
    var lead = why && why.label ? "Closed for " + why.label + "." : "Closed now.";
    for (var add = 0; add < 120; add++) {
      var ymd = addDays(t.ymd, add), l = sessions(ymd);
      for (i = 0; i < l.length; i++) {
        if (add === 0 && toMin(l[i][0]) <= t.min) continue;
        var when = add === 0 ? "today" : add === 1 ? "tomorrow" : add < 7 && !why ? "on " + DAYS[dayIndex(ymd)] : "on " + longDate(ymd);
        return { state: "closed", text: lead + " Opens " + when + " at " + say(l[i][0]) };
      }
    }
    return { state: "closed", text: lead };
  }
  function paint() {
    today = now();
    if (data.days) {
      var r = work(), pills = document.querySelectorAll("[data-status]");
      for (var i = 0; i < pills.length; i++) {
        pills[i].setAttribute("data-state", r.state);
        (pills[i].querySelector("[data-status-text]") || pills[i]).textContent = r.text;
      }
      var rows = document.querySelectorAll("[data-day]"), key = KEYS[today.day];
      for (var j = 0; j < rows.length; j++) {
        var on = (" " + rows[j].getAttribute("data-day") + " ").indexOf(" " + key + " ") > -1 && !closureOn(today.ymd);
        rows[j].classList.toggle("is-today", on);
        if (on) rows[j].setAttribute("aria-current", "date"); else rows[j].removeAttribute("aria-current");
      }
    }
    markDates();
  }

  /* ---- 4. Term dates ------------------------------------------------ */
  function markDates() {
    var rows = document.querySelectorAll("tr[data-from]"), nextDone = false;
    for (var i = 0; i < rows.length; i++) {
      var f = rows[i].getAttribute("data-from"), t = rows[i].getAttribute("data-to") || f;
      var past = t < today.ymd;
      rows[i].classList.toggle("is-past", past);
      var isNext = !past && !nextDone, isNow = isNext && f <= today.ymd;
      rows[i].classList.toggle("is-next", isNext && !isNow);
      rows[i].classList.toggle("is-now", isNow);
      if (isNext) nextDone = true;
    }
    var slots = document.querySelectorAll("[data-next-closure]");
    if (!slots.length || !data.closures) return;
    var text = "", list = data.closures;
    for (var k = 0; k < list.length; k++) {
      var c = list[k], cf = c.from || c.date, ct = c.to || cf;
      if (ct < today.ymd) continue;
      var back = addDays(ct, 1), guard = 0;
      while (!sessions(back).length && guard++ < 120) back = addDays(back, 1);
      if (guard >= 120) continue;
      // Describe the closure from its first normal opening day (not a Saturday).
      var first = cf, g2 = 0;
      while (!((data.days && data.days[KEYS[dayIndex(first)]]) || []).length && first < ct && g2++ < 14) first = addDays(first, 1);
      cf = first;
      if (cf <= today.ymd) text = "Closed now for " + c.label + ". Back on " + longDate(back) + ".";
      else text = "Next closure: " + c.label + ", from " + longDate(cf) + ". Back on " + longDate(back) + ".";
      break;
    }
    if (text) for (var s = 0; s < slots.length; s++) slots[s].textContent = text;
  }

  paint();
  setInterval(paint, 60000);
})();
