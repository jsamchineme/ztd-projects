/* Meadow: the only script. No dependencies, no build step.
   1. Phone menu: a full-height sheet ("Menu" button, aria-expanded +
      aria-controls, Escape closes, a link or a wider screen closes it).
   2. Dated notices: [data-show-from] / [data-show-until] (YYYY-MM-DD).
   3. Live open/closed status from <script id="nursery-schedule">, in UK time,
      plus the "today" row in the hours table. Public holidays listed in
      "checkDays" (not confirmed by the nursery) say "Phone to check".
   4. Living photo: a short muted loop that plays only when the viewer hasn't
      asked for reduced motion and the screen is wider than a phone. Phones
      get the poster. A visible Pause / Play button is always there.
   5. Gallery: filter buttons (aria-pressed) and a <dialog> lightbox with
      Previous / Next icon buttons, an "n of N" count, arrow keys and swipe
      (wrapping round the photos shown), Esc to close and focus return.
   Without JavaScript: the menu is open, every notice shows, the status shows
   the hours written in the HTML, the living photo shows its poster, and the
   gallery is a plain grid of every photo. Nothing is lost.                  */
(function () {
  "use strict";
  var root = document.documentElement;
  if (root.className.indexOf("js") < 0) root.className += " js";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Menu ---------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
      document.body.classList.toggle("menu-open", open);
    };
    setOpen(false);
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a") && toggle.getAttribute("aria-expanded") === "true") setOpen(false); });
    if (window.matchMedia) matchMedia("(min-width: 68em)").addEventListener("change", function () { setOpen(false); });
  }

  /* ---- 4. Living photo -------------------------------------------- */
  var lives = document.querySelectorAll("[data-living]");
  Array.prototype.forEach.call(lives, function (box) {
    var video = box.querySelector("video"), btn = box.querySelector(".living__btn");
    if (!video || !btn) return;
    var label = btn.querySelector("[data-label]");
    var loaded = false;
    function load() {
      if (loaded) return; loaded = true;
      var s = video.querySelector("source[data-src]");
      if (s) { s.src = s.getAttribute("data-src"); video.load(); }
    }
    function show(playing) {
      btn.setAttribute("aria-label", (playing ? "Pause" : "Play") + " the moving photo: " + (box.getAttribute("data-living") || "video"));
      if (label) label.textContent = playing ? "Pause" : "Play";
      btn.querySelector(".i-pause").style.display = playing ? "" : "none";
      btn.querySelector(".i-play").style.display = playing ? "none" : "";
    }
    function play() { load(); var p = video.play(); if (p && p.catch) p.catch(function () { show(false); }); show(true); }
    function pause() { video.pause(); show(false); }
    btn.hidden = false;
    btn.addEventListener("click", function () { if (video.paused) play(); else pause(); });
    video.addEventListener("pause", function () { show(false); });
    video.addEventListener("play", function () { show(true); });
    var wide = window.matchMedia && matchMedia("(min-width: 48em)").matches;
    if (!reduce && wide) play(); else show(false);
  });

  /* ---- 5. Gallery filters and lightbox ---------------------------- */
  var filters = document.querySelectorAll("[data-filter]");
  var groups = document.querySelectorAll("[data-group-title]");
  var countEl = document.querySelector("[data-filter-count]");
  Array.prototype.forEach.call(filters, function (f) {
    f.addEventListener("click", function () {
      var g = f.getAttribute("data-filter"), shown = 0;
      Array.prototype.forEach.call(filters, function (o) { o.setAttribute("aria-pressed", String(o === f)); });
      Array.prototype.forEach.call(groups, function (sec) {
        var on = g === "all" || sec.getAttribute("data-group-title") === g;
        sec.hidden = !on; if (on) shown += sec.querySelectorAll(".mosaic > li").length;
      });
      if (countEl) countEl.textContent = "Showing " + shown + " photos" + (g === "all" ? "." : " of " + f.textContent.trim().toLowerCase() + ".");
    });
  });
  var filterBar = document.querySelector(".filters");
  if (filterBar) filterBar.hidden = false;

  var dialog = document.querySelector("dialog.lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var big = dialog.querySelector("img"), cap = dialog.querySelector("[data-caption]"), count = dialog.querySelector("[data-count]");
    var opener = null, index = 0, list = [];
    var buttons = document.querySelectorAll(".mosaic button[data-full]");
    function visible() { return Array.prototype.filter.call(buttons, function (b) { var sec = b.closest("[data-group-title]"); return !(sec && sec.hidden); }); }
    function showAt(i) {
      list = visible(); if (!list.length) return;
      index = (i + list.length) % list.length;
      var b = list[index], img = b.querySelector("img");
      big.src = b.getAttribute("data-full"); big.alt = img.alt;
      cap.textContent = (b.closest("figure").querySelector("figcaption") || {}).textContent || img.alt;
      if (count) count.textContent = (index + 1) + " of " + list.length;
    }
    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener("click", function () { opener = b; showAt(visible().indexOf(b)); dialog.showModal(); });
    });
    dialog.querySelector("[data-prev]").addEventListener("click", function () { showAt(index - 1); });
    dialog.querySelector("[data-next]").addEventListener("click", function () { showAt(index + 1); });
    dialog.querySelector("[data-close]").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); showAt(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); showAt(index + 1); }
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    // Swipe on touch: a sideways drag of 40px or more moves one photo.
    var startX = null;
    big.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") startX = e.clientX; });
    big.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) >= 40) showAt(index + (dx < 0 ? 1 : -1));
    });
    big.addEventListener("pointercancel", function () { startX = null; });
    dialog.addEventListener("close", function () { if (opener) opener.focus(); });
  } else {
    // No <dialog>: buttons open the larger photo in the same tab.
    Array.prototype.forEach.call(document.querySelectorAll(".mosaic button[data-full]"), function (b) {
      b.addEventListener("click", function () { window.location.href = b.getAttribute("data-full"); });
    });
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
  function say(t) {
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60;
    if (m === 720) return "midday";
    return (h % 12 || 12) + (mm ? ":" + (mm < 10 ? "0" : "") + mm : "") + (h < 12 ? "am" : "pm");
  }
  function addDays(ymd, n) { var d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayIndex(ymd) { return (new Date(ymd + "T12:00:00Z").getUTCDay() + 6) % 7; }
  function longDate(ymd) { return DAYS[dayIndex(ymd)] + " " + +ymd.slice(8) + " " + MONTHS[+ymd.slice(5, 7) - 1]; }

  var today = now();

  /* ---- 2. Dated notices ------------------------------------------- */
  var dated = document.querySelectorAll("[data-show-from], [data-show-until]");
  for (var n = 0; n < dated.length; n++) {
    var from = dated[n].getAttribute("data-show-from"), until = dated[n].getAttribute("data-show-until");
    dated[n].hidden = !!((from && today.ymd < from) || (until && today.ymd > until));
  }

  /* ---- 3. Live status --------------------------------------------- */
  function closureOn(ymd) {
    var list = data.closures || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], f = c.from, t = c.to || f;
      if (ymd >= f && ymd <= t) return c;
    }
    if (data.term && (ymd < data.term.from || ymd > data.term.to)) return { label: data.term.label || "the holidays" };
    return null;
  }
  function sessions(ymd) {
    if (closureOn(ymd)) return [];
    return (data.days && data.days[KEYS[dayIndex(ymd)]]) || [];
  }
  function checkDay(ymd) {
    var list = data.checkDays || [];
    for (var i = 0; i < list.length; i++) if (list[i].date === ymd) return list[i];
    return null;
  }
  function work() {
    var t = today, list = sessions(t.ymd), i, s;
    // A public holiday the nursery hasn't confirmed: never guess.
    var chk = !closureOn(t.ymd) && checkDay(t.ymd);
    if (chk) return { state: "closed", text: "Today is " + chk.label + ". Phone to check if we're open." };
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
    if (!data.days) return;
    var r = work(), pills = document.querySelectorAll("[data-status]");
    for (var i = 0; i < pills.length; i++) {
      pills[i].setAttribute("data-state", r.state);
      (pills[i].querySelector("[data-status-text]") || pills[i]).textContent = r.text;
    }
    var rows = document.querySelectorAll("[data-day]"), key = KEYS[today.day];
    for (var j = 0; j < rows.length; j++) {
      var on = (" " + rows[j].getAttribute("data-day") + " ").indexOf(" " + key + " ") > -1 && !closureOn(today.ymd);
      rows[j].classList.toggle("is-today", on);
    }
  }
  paint();
  setInterval(paint, 60000);
})();
