(function () {
  "use strict";

  var cfg = window.BOOFDAY_CONFIG || {};

  /* ---------- Wire up config-driven links ---------- */
  function wireLinks() {
    document.querySelectorAll('[data-link="rsvp"]').forEach(function (el) {
      el.href = cfg.rsvpUrl || "#top";
    });
    document.querySelectorAll('[data-link="sheet"]').forEach(function (el) {
      el.href = cfg.sheetUrl || "#top";
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Highlight the current section in the nav as you scroll.
    var sections = Array.prototype.slice
      .call(document.querySelectorAll("main section[id]"))
      .filter(function (s) {
        return s.id;
      });
    var navLinks = nav.querySelectorAll('a[href^="#"]');

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (s) {
        observer.observe(s);
      });
    }
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    var el = document.getElementById("countdown");
    if (!el || !cfg.event) return;

    var start = new Date(cfg.event.start);
    var end = new Date(cfg.event.end);

    function render() {
      var now = new Date();

      if (now < start) {
        var diff = start - now;
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff % 86400000) / 3600000);
        var minutes = Math.floor((diff % 3600000) / 60000);
        el.textContent = "⏳ " + days + "d " + hours + "h " + minutes + "m until go-time";
      } else if (now >= start && now <= end) {
        el.textContent = "🍑 It's happening right now. Go boof.";
      } else {
        el.textContent = "🎉 Boofday has been lived. See you next year.";
      }
    }

    render();
    window.setInterval(render, 30000);
  }

  /* ---------- Add to calendar (.ics download) ---------- */
  function toICSDate(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function escapeICS(text) {
    return String(text).replace(/([,;])/g, "\\$1");
  }

  function buildICS(event) {
    var uid = "boofday-" + Date.now() + "@heathers40th";
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Boofday//Heathers40th//EN",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + toICSDate(new Date().toISOString()),
      "DTSTART:" + toICSDate(event.start),
      "DTEND:" + toICSDate(event.end),
      "SUMMARY:" + escapeICS(event.title),
      "LOCATION:" + escapeICS(event.location),
      "DESCRIPTION:" + escapeICS(event.description),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  function downloadICS(event) {
    var ics = buildICS(event);
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "boofday.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // UTC stamp without separators, e.g. 20260725T190000Z — what Google/Yahoo expect.
  function toCompactUTC(iso) {
    return toICSDate(iso);
  }

  function buildGoogleUrl(event) {
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: toCompactUTC(event.start) + "/" + toCompactUTC(event.end),
      details: event.description,
      location: event.location,
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function buildOutlookUrl(event) {
    var params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      startdt: new Date(event.start).toISOString(),
      enddt: new Date(event.end).toISOString(),
      subject: event.title,
      body: event.description,
      location: event.location,
    });
    return "https://outlook.live.com/calendar/0/deeplink/compose?" + params.toString();
  }

  function buildYahooUrl(event) {
    var params = new URLSearchParams({
      v: "60",
      title: event.title,
      st: toCompactUTC(event.start),
      et: toCompactUTC(event.end),
      desc: event.description,
      in_loc: event.location,
    });
    return "https://calendar.yahoo.com/?" + params.toString();
  }

  function initCalendarButton() {
    var toggle = document.getElementById("calendarToggle");
    var menu = document.getElementById("calendarMenu");
    if (!toggle || !menu || !cfg.event) return;

    var googleLink = menu.querySelector('[data-cal="google"]');
    var outlookLink = menu.querySelector('[data-cal="outlook"]');
    var yahooLink = menu.querySelector('[data-cal="yahoo"]');
    var icsButton = menu.querySelector('[data-cal="ics"]');

    if (googleLink) googleLink.href = buildGoogleUrl(cfg.event);
    if (outlookLink) outlookLink.href = buildOutlookUrl(cfg.event);
    if (yahooLink) yahooLink.href = buildYahooUrl(cfg.event);
    if (icsButton) {
      icsButton.addEventListener("click", function () {
        downloadICS(cfg.event);
        closeMenu();
      });
    }

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    menu.querySelectorAll("a.calendar-menu-item").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== toggle) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------- Packing checklist ---------- */
  var PACKING_LISTS = {
    must: [
      "Tent & sleeping situation",
      "Camping plate, cup & utensils (there are wash sinks, but no dish soap fairy)",
      "Headlamp or lights",
      "Good shoes — for the outdoors and the tree web",
      "Sunscreen",
      "Towel for the pool/shower",
      "Natural, biodegradable toiletries for the outdoor showers",
      "Hot weather outfit",
      "Nighttime party outfit",
      "Cool weather outfit / jacket — redwoods get cold at night",
    ],
    good: [
      "Booty shorts, thongs, mini skirts",
      "Bug spray",
      "Your potluck or Pirate Bar contribution",
      "Camp chair",
      "Pool toys",
      "A booty-related open mic bit",
      "A tip for Ceecee's butt portraits",
      "Glowsticks (optional, for nighttime shenanigans)",
    ],
  };

  var PACKING_STORAGE_KEY = "boofday-packing-v1";

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function loadPackingState() {
    try {
      return JSON.parse(window.localStorage.getItem(PACKING_STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePackingState(state) {
    try {
      window.localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage unavailable — checklist still works, just won't persist */
    }
  }

  function initPackingList() {
    var state = loadPackingState();

    Object.keys(PACKING_LISTS).forEach(function (key) {
      var list = document.querySelector('[data-checklist="' + key + '"]');
      if (!list) return;

      PACKING_LISTS[key].forEach(function (item) {
        var id = key + "-" + slugify(item);
        var li = document.createElement("li");
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = Boolean(state[id]);

        var span = document.createElement("span");
        span.textContent = item;

        checkbox.addEventListener("change", function () {
          state[id] = checkbox.checked;
          savePackingState(state);
        });

        label.appendChild(checkbox);
        label.appendChild(span);
        li.appendChild(label);
        list.appendChild(li);
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireLinks();
    initNav();
    initCountdown();
    initCalendarButton();
    initPackingList();
  });
})();
