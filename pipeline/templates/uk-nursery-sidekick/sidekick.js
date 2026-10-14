/* Sidekick: the only script. No dependencies, no build step.
   1. Phone menu ("Menu" button, aria-expanded + aria-controls, Escape closes),
      and the sticky booking bar on phones (shown after the hero scrolls away).
   2. Dated notices: [data-show-from] / [data-show-until] (YYYY-MM-DD).
   3. Live status from <script id="nursery-schedule">, in UK time.
   4. Closure table marks ("past", "now", "next") and [data-next-closure].
   5. Living photo: autoplays only above phone width and without reduced
      motion; phones get the poster. A visible Pause / Play button.
   6. Gallery: filter buttons and a <dialog> lightbox (Esc closes, focus returns).
   7. In-page chips: marks the chip for the section on screen.
   Without JavaScript the menu is open, notices show, the status shows the
   hours written in the HTML, the living photo shows its poster and the
   gallery shows every photo. Nothing is lost.                            */
(function () {
  "use strict";
  var root = document.documentElement;
  if (root.className.indexOf("js") < 0) root.className += " js";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Menu ---------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
    };
    setOpen(false);
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  /* ---- 1b. Sticky booking bar (phones): shown once the first actions
     (hero or page head) have scrolled out of view, so it never sits on
     top of the page's own Book a visit buttons. */
  var bar = document.querySelector(".book-bar");
  if (bar) {
    var anchor = document.querySelector(".hero .actions, .page-head");
    var showBar = function (on) { bar.classList.toggle("is-shown", on); };
    if (anchor && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { showBar(!en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe(anchor);
    } else showBar(true);
  }

  /* ---- 5. Living photo -------------------------------------------- */
  var wide = window.matchMedia ? window.matchMedia("(min-width: 48em)") : { matches: true };
  var lives = document.querySelectorAll("[data-living]");
  Array.prototype.forEach.call(lives, function (box) {
    var video = box.querySelector("video"), btn = box.querySelector(".living__toggle");
    if (!video || !btn) return;
    var label = btn.querySelector("[data-label]") || btn;
    var use = btn.querySelector("use");
    function show(playing) {
      label.textContent = playing ? "Pause" : "Play";
      if (use) use.setAttribute("href", use.getAttribute("href").replace(/#i-(play|pause)/, playing ? "#i-pause" : "#i-play"));
      btn.setAttribute("aria-label", (playing ? "Pause" : "Play") + " the moving photo: " + (video.getAttribute("aria-label") || ""));
    }
    function load() {
      if (video.getAttribute("src")) return;
      video.setAttribute("src", video.getAttribute("data-src"));
    }
    function play() { load(); var p = video.play(); if (p && p.catch) p.catch(function () { show(false); }); show(true); }
    function pause() { video.pause(); show(false); }
    btn.hidden = false;
    btn.addEventListener("click", function () { if (video.paused) play(); else pause(); });
    if (!reduce && wide.matches) play(); else show(false);
  });

  /* ---- 6. Gallery -------------------------------------------------- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  if (filterBtns.length) {
    var groups = document.querySelectorAll("[data-group]");
    var filterBar = filterBtns[0].closest(".filters");
    if (filterBar) filterBar.hidden = false;
    Array.prototype.forEach.call(filterBtns, function (b) {
      b.addEventListener("click", function () {
        var want = b.getAttribute("data-filter");
        Array.prototype.forEach.call(filterBtns, function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        Array.prototype.forEach.call(groups, function (g) { g.hidden = want !== "all" && g.getAttribute("data-group") !== want; });
      });
    });
  }
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var holder = box.querySelector(".lightbox__img"), big = document.createElement("img"), cap = box.querySelector("[data-caption]"), opener = null;
    document.addEventListener("click", function (e) {
      var o = e.target.closest && e.target.closest(".gallery__open");
      if (!o) return;
      var img = o.querySelector("img");
      opener = o;
      if (!big.parentNode) holder.appendChild(big);
      big.src = o.getAttribute("data-full") || img.currentSrc || img.src;
      big.alt = img.alt;
      cap.textContent = o.getAttribute("data-caption") || img.alt;
      box.showModal();
    });
    box.addEventListener("close", function () { if (opener) opener.focus(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    var closer = box.querySelector(".lightbox__close");
    if (closer) closer.addEventListener("click", function () { box.close(); });
  } else {
    // No <dialog> support: the buttons simply do nothing; every photo is already on the page.
    Array.prototype.forEach.call(document.querySelectorAll(".gallery__open"), function (o) { o.style.cursor = "default"; });
  }

  /* ---- 7. In-page chips -------------------------------------------- */
  var chips = document.querySelectorAll(".chips a[href^='#']");
  if (chips.length && "IntersectionObserver" in window) {
    var byId = {};
    Array.prototype.forEach.call(chips, function (c) { byId[c.getAttribute("href").slice(1)] = c; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(chips, function (c) { c.removeAttribute("aria-current"); });
        var c = byId[en.target.id];
        if (c) c.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

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
  function say(t) { // 7:30am, 6pm, midday
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
        return { state: left <= SOON ? "closing" : "open", text: left <= SOON ? "Open now. Home time soon, at " + say(s[1]) : "Open now until " + say(s[1]) };
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
    }
    markDates();
  }

  /* ---- 4. Closure table -------------------------------------------- */
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
      if (cf <= today.ymd) text = "Closed now for " + c.label + ". Back on " + longDate(back) + ".";
      else text = "Next closure: " + c.label + ", on " + longDate(cf) + (ct !== cf ? " to " + longDate(ct) : "") + ". Back on " + longDate(back) + ".";
      break;
    }
    if (text) for (var s = 0; s < slots.length; s++) slots[s].textContent = text;
  }

  paint();
  setInterval(paint, 60000);
})();
