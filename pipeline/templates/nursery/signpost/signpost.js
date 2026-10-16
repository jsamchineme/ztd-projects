/* Signpost: phone menu, phone dock, live open/closed status, dated notices,
   boards that swing once into place, gallery filters and lightbox, living
   photo. No dependencies. Everything it needs is read from the page (see
   BRIEF.md sections 6 and 8). Edit per nursery: never. */
(function () {
  "use strict";
  var doc = document;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Phone menu: a full-height sheet. Esc closes it and returns focus. ---- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      doc.body.classList.toggle("menu-open", open);
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
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    });
    window.matchMedia("(min-width: 64em)").addEventListener("change", function () { setOpen(false); });
  }

  /* Phone dock: shows after the first screen, hides once the footer is in view. */
  var dock = doc.querySelector(".dock");
  if (dock) {
    var foot = doc.querySelector(".site-footer");
    var showDock = function () {
      var footTop = foot ? foot.getBoundingClientRect().top : Infinity;
      dock.classList.toggle("is-shown", window.scrollY > 480 && footTop > window.innerHeight - 8);
    };
    window.addEventListener("scroll", showDock, { passive: true });
    window.addEventListener("resize", showDock);
    showDock();
  }

  /* Live status, in the nursery's own time zone. ------------------------- */
  var schedEl = doc.getElementById("nursery-schedule");
  var sched = null;
  try { sched = schedEl ? JSON.parse(schedEl.textContent) : null; } catch (e) { sched = null; }
  var tz = (sched && sched.timeZone) || "Europe/London";
  var DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var NAMES = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };

  function partsAt(date) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var o = {};
    f.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return { iso: o.year + "-" + o.month + "-" + o.day, mins: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10) };
  }
  function addDays(iso, n) { var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayOf(iso) { return DAYS[new Date(iso + "T12:00:00Z").getUTCDay()]; }
  function toMins(t) { var a = t.split(":"); return parseInt(a[0], 10) * 60 + parseInt(a[1], 10); }
  function say(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    if (h === 12 && mm === 0) return "midday";
    return (h % 12 === 0 ? 12 : h % 12) + (mm ? ":" + (mm < 10 ? "0" : "") + mm : "") + (h >= 12 ? "pm" : "am");
  }
  function inList(list, iso) {
    for (var i = 0; i < (list || []).length; i++) if (iso >= list[i].from && iso <= list[i].to) return list[i];
    return null;
  }
  function sessions(iso) {
    if (inList(sched.closures, iso)) return [];
    var early = inList(sched.earlyClose, iso);
    return ((sched.days && sched.days[dayOf(iso)]) || []).map(function (s) {
      var a = toMins(s[0]), b = toMins(s[1]);
      if (early) b = Math.min(b, toMins(early.at));
      return [a, b];
    });
  }
  function longDate(iso) {
    var d = new Date(iso + "T12:00:00Z");
    return NAMES[dayOf(iso)] + " " + d.getUTCDate() + " " + d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  }
  function status(now) {
    var p = partsAt(now), today = sessions(p.iso), soon = sched.closingSoonMinutes || 30;
    for (var i = 0; i < today.length; i++) {
      if (p.mins >= today[i][0] && p.mins < today[i][1]) {
        var end = today[i][1];
        return end - p.mins <= soon ? { state: "closing", text: "Open now. Closing soon, at " + say(end) } : { state: "open", text: "Open now, until " + say(end) };
      }
      if (p.mins < today[i][0]) return { state: "closed", text: "Closed now. Opens today at " + say(today[i][0]) };
    }
    var c = inList(sched.closures, p.iso);
    for (var n = 1; n <= 28; n++) {
      var iso = addDays(p.iso, n), s = sessions(iso);
      if (s.length) {
        var when = n === 1 ? "tomorrow" : (n < 7 && !c ? "on " + NAMES[dayOf(iso)] : "on " + longDate(iso));
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

  /* Boards swing once into place when they first come into view. -------- */
  var boards = doc.querySelectorAll(".boards");
  if (boards.length && "IntersectionObserver" in window && !calm.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-swinging"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    boards.forEach(function (b) {
      b.querySelectorAll(".board").forEach(function (a, i) { a.style.setProperty("--i", i); });
      io.observe(b);
    });
  }

  /* Gallery filters: buttons with aria-pressed show one group at a time. -- */
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

  /* Lightbox: a native dialog. Previous / Next (and the arrow keys or a swipe)
     step through the photos the filters show, wrapping at the ends. Esc
     closes it; focus goes back to the photo that opened it. -------------- */
  var box = doc.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector("img"), boxCap = box.querySelector("[data-lightbox-caption]"),
      boxCount = box.querySelector("[data-lightbox-count]"), opener = null, list = [], at = 0;
    var show = function (i) {
      at = (i + list.length) % list.length;
      var a = list[at], img = a.querySelector("img"), fig = a.closest("figure");
      boxImg.src = a.getAttribute("href");
      boxImg.alt = img ? img.alt : "";
      boxCap.textContent = fig && fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : "";
      if (boxCount) boxCount.textContent = (at + 1) + " of " + list.length;
    };
    doc.querySelectorAll("[data-lightbox]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        opener = a;
        list = Array.prototype.filter.call(doc.querySelectorAll("[data-lightbox]"), function (l) { return !l.closest("[hidden]"); });
        show(list.indexOf(a));
        box.showModal();
        box.querySelector(".lightbox__close").focus();
      });
    });
    box.querySelectorAll("[data-step]").forEach(function (b) {
      b.addEventListener("click", function () { show(at + Number(b.getAttribute("data-step"))); });
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1); }
    });
    var downX = null; /* swipe: a sideways drag of 40px or more */
    boxImg.addEventListener("pointerdown", function (e) { downX = e.clientX; });
    boxImg.addEventListener("pointerup", function (e) {
      if (downX !== null && Math.abs(e.clientX - downX) >= 40) show(at + (e.clientX < downX ? 1 : -1));
      downX = null;
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* Living photo: a muted loop. It plays by itself only above phone width and
     only without reduced motion. It always has a play/pause button. ------- */
  var wide = window.matchMedia("(min-width: 48em) and (prefers-reduced-motion: no-preference)");
  doc.querySelectorAll(".living").forEach(function (el) {
    var v = el.querySelector("video"), b = el.querySelector(".living__toggle");
    if (!v || !b) return;
    var label = b.querySelector(".visually-hidden"), name = b.getAttribute("data-name") || "the film";
    function sync() {
      var playing = !v.paused;
      el.classList.toggle("is-playing", playing);
      if (label) label.textContent = (playing ? "Pause " : "Play ") + name;
    }
    b.addEventListener("click", function () { if (v.paused) { v.play().catch(function () {}); } else { v.pause(); } });
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    if (wide.matches) { v.preload = "auto"; v.play().catch(function () {}); }
    sync();
  });
})();
