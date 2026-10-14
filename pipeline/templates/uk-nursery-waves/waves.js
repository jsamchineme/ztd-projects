/* Make Waves: phone menu, live open/closed status, dated notices, gallery
   filters and lightbox, living photo. No dependencies. It reads everything
   it needs from the page (see BRIEF.md, sections 6 and 8). Edit per nursery:
   never. */
(function () {
  "use strict";
  var doc = document;

  /* Phone menu ----------------------------------------------------------- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      var label = toggle.querySelector(".menu-toggle__label");
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* Phone booking dock: appears once the hero's own buttons have scrolled away. */
  var dock = doc.querySelector(".dock");
  if (dock) {
    var showDock = function () { dock.classList.toggle("is-shown", window.scrollY > 520); };
    window.addEventListener("scroll", showDock, { passive: true });
    showDock();
  }

  /* Time in the nursery's own time zone ---------------------------------- */
  var schedEl = doc.getElementById("nursery-schedule");
  var sched = null;
  try { sched = schedEl ? JSON.parse(schedEl.textContent) : null; } catch (e) { sched = null; }
  var tz = (sched && sched.timeZone) || "Europe/London";
  var DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var DAY_NAMES = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };

  function partsAt(date) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" });
    var o = {};
    f.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return {
      iso: o.year + "-" + o.month + "-" + o.day,
      mins: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10),
      day: o.weekday.slice(0, 3).toLowerCase()
    };
  }
  function addDays(iso, n) {
    var d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function dayOf(iso) { return DAYS[new Date(iso + "T12:00:00Z").getUTCDay()]; }
  function toMins(t) { var a = t.split(":"); return parseInt(a[0], 10) * 60 + parseInt(a[1], 10); }
  function say(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h === 12 && m === 0) return "midday";
    var ap = h >= 12 ? "pm" : "am";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ":" + (m < 10 ? "0" : "") + m : "") + ap;
  }
  function closureOn(iso) {
    var list = (sched && sched.closures) || [];
    for (var i = 0; i < list.length; i++) {
      if (iso >= list[i].from && iso <= list[i].to) return list[i];
    }
    return null;
  }
  function sessions(iso) {
    if (closureOn(iso)) return [];
    return ((sched && sched.days && sched.days[dayOf(iso)]) || []).map(function (s) { return [toMins(s[0]), toMins(s[1])]; });
  }
  function longDate(iso) {
    var d = new Date(iso + "T12:00:00Z");
    return DAY_NAMES[dayOf(iso)] + " " + d.getUTCDate() + " " + d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  }

  function status(now) {
    var p = partsAt(now);
    var today = sessions(p.iso);
    var soon = (sched && sched.closingSoonMinutes) || 30;
    for (var i = 0; i < today.length; i++) {
      if (p.mins >= today[i][0] && p.mins < today[i][1]) {
        var end = today[i][1];
        if (end - p.mins <= soon) return { state: "closing", text: "Open now. Closing soon, at " + say(end) };
        return { state: "open", text: "Open now, until " + say(end) };
      }
      if (p.mins < today[i][0]) return { state: "closed", text: "Closed now. Opens today at " + say(today[i][0]) };
    }
    var c = closureOn(p.iso);
    for (var n = 1; n <= 21; n++) {
      var iso = addDays(p.iso, n);
      var s = sessions(iso);
      if (s.length) {
        var when = n === 1 ? "tomorrow" : (n < 7 && !c ? "on " + DAY_NAMES[dayOf(iso)] : "on " + longDate(iso));
        return { state: "closed", text: (c ? "Closed for " + c.label + ". Opens " : "Closed now. Opens ") + when + " at " + say(s[0][0]) };
      }
    }
    return { state: "closed", text: "Closed now. Phone us to check when we open." };
  }

  if (sched) {
    var st = status(new Date());
    doc.querySelectorAll("[data-status]").forEach(function (el) {
      el.setAttribute("data-status", st.state);
      var t = el.querySelector("[data-status-text]");
      if (t) t.textContent = st.text;
    });
  }

  /* Dated notices: shown only between data-show-from and data-show-until. */
  var todayIso = partsAt(new Date()).iso;
  doc.querySelectorAll("[data-show-from], [data-show-until]").forEach(function (el) {
    var from = el.getAttribute("data-show-from") || "0000-01-01";
    var until = el.getAttribute("data-show-until") || "9999-12-31";
    el.hidden = !(todayIso >= from && todayIso <= until);
  });

  /* Gallery filters: buttons with aria-pressed show one group at a time. */
  var filters = doc.querySelectorAll("[data-filter]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var want = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      doc.querySelectorAll("[data-group]").forEach(function (g) {
        g.hidden = !(want === "all" || g.getAttribute("data-group") === want);
      });
    });
  });

  /* Lightbox: a native dialog. Esc closes it; focus goes back to the photo. */
  var box = doc.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector("img");
    var boxCap = box.querySelector("[data-lightbox-caption]");
    var opener = null;
    doc.querySelectorAll("[data-lightbox]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        opener = a;
        var img = a.querySelector("img");
        boxImg.src = a.getAttribute("href");
        boxImg.alt = img ? img.alt : "";
        var cap = a.closest("figure") && a.closest("figure").querySelector("figcaption");
        boxCap.textContent = cap ? cap.textContent : "";
        box.showModal();
        box.querySelector(".lightbox__close").focus();
      });
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* Living photo: muted loop. Plays by itself only above phone width and only
     if the visitor hasn't asked for reduced motion. Always has a pause button. */
  var wide = window.matchMedia("(min-width: 48em) and (prefers-reduced-motion: no-preference)");
  doc.querySelectorAll(".living").forEach(function (box2) {
    var v = box2.querySelector("video");
    var b = box2.querySelector(".living__toggle");
    if (!v || !b) return;
    var label = b.querySelector(".visually-hidden");
    var name = b.getAttribute("data-name") || "the film";
    function sync() {
      var playing = !v.paused;
      box2.classList.toggle("is-playing", playing);
      if (label) label.textContent = (playing ? "Pause " : "Play ") + name;
    }
    b.addEventListener("click", function () {
      if (v.paused) { v.play().catch(function () {}); } else { v.pause(); }
    });
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    if (wide.matches) {
      v.preload = "auto";
      v.play().catch(function () {});
    }
    sync();
  });
})();
