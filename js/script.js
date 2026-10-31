/* =========================================================
   Nadun Charuka Perera - Portfolio Script
   Features:
     1. Theme toggle (saved in localStorage)
     2. Mobile menu
     3. Navbar shadow + active link highlight on scroll
     4. Scroll reveal animations
     5. Skill category filter
     6. Back-to-top button
     7. Placeholder link handling + toast
     8. Download CV check
     9. Contact form validation (opens email app)
    10. Profile photo fallback
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var toastEl = $("#toast");
  var toastTimer;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  /* ---------- 1. THEME TOGGLE ---------- */
  var themeBtn = $("#theme-toggle");
  var themeIcon = $("#theme-icon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeIcon) {
      // Moon icon in dark mode (click for light), sun icon in light mode
      themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
    try { localStorage.setItem("theme", theme); } catch (e) { /* storage may be blocked */ }
  }

  // First visit: follow the system preference, otherwise stay dark
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    saved = "light";
  }
  applyTheme(saved || "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 2. MOBILE MENU ---------- */
  var menuBtn = $("#menu-toggle");
  var navMenu = $("#nav-menu");

  function setMenu(open) {
    if (!navMenu || !menuBtn) return;
    navMenu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenu(!navMenu.classList.contains("open"));
    });
  }
  // Close the menu after choosing a link, pressing Escape, or resizing to desktop
  $$(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- 3. NAVBAR SHADOW + ACTIVE LINK ---------- */
  var navbar = $("#navbar");
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-link");
  var backBtn = $("#back-to-top");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (navbar) navbar.classList.toggle("scrolled", y > 10);
    if (backBtn) backBtn.classList.toggle("show", y > 500);

    // Highlight the link of the section currently in view
    var current = "home";
    sections.forEach(function (sec) {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. SCROLL REVEAL ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms"; // small stagger
      observer.observe(el);
    });
  } else {
    // Older browsers: just show everything
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 5. SKILL CATEGORY FILTER ---------- */
  var tabs = $$(".tab");
  var groups = $$(".skill-group");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter");
      tabs.forEach(function (t) { t.classList.toggle("active", t === tab); });
      groups.forEach(function (g) {
        var show = filter === "all" || g.getAttribute("data-cat") === filter;
        g.classList.toggle("hidden", !show);
        if (show) g.classList.add("visible"); // make sure revealed groups stay visible
      });
    });
  });

  /* ---------- 6. BACK TO TOP ---------- */
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 7. PLACEHOLDER LINKS ----------
     Links such as href="#" with class "placeholder-link" tell the visitor
     the real URL has not been added yet. Once you set a real URL in the
     HTML (and remove the class), the link works normally. */
  $$(".placeholder-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        showToast((link.getAttribute("data-label") || "This link") + " has not been added yet.");
      }
    });
  });

  /* ---------- 8. DOWNLOAD CV ----------
     Checks that assets/cv.pdf exists (when served over http/https).
     Opening index.html straight from disk skips the check. */
  var cvBtn = $("#cv-btn");
  if (cvBtn && window.location.protocol.indexOf("http") === 0) {
    cvBtn.addEventListener("click", function (e) {
      e.preventDefault();
      fetch(cvBtn.getAttribute("href"), { method: "HEAD" })
        .then(function (res) {
          if (!res.ok) throw new Error("missing");
          // File exists: trigger the real download
          var a = document.createElement("a");
          a.href = cvBtn.getAttribute("href");
          a.download = cvBtn.getAttribute("download") || "cv.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(function () {
          showToast("CV not uploaded yet. Add it as assets/cv.pdf.");
        });
    });
  }

  /* ---------- 9. CONTACT FORM ----------
     Validates the fields, then opens the visitor's email app with the message filled in.
     Set RECIPIENT to your email address to make this work. */
  var RECIPIENT = ""; // EDIT: e.g. "yourname@example.com"

  var form = $("#contact-form");
  var statusEl = $("#form-status");

  function validateField(input) {
    var field = input.closest(".field");
    var errorEl = $(".error", field);
    var value = input.value.trim();
    var message = "";

    if (input.required && !value) {
      message = "This field is required.";
    } else if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    }
    field.classList.toggle("invalid", !!message);
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  if (form) {
    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("blur", function () { if (input.required) validateField(input); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("input[required], textarea[required]", form).forEach(function (input) {
        if (!validateField(input)) ok = false;
      });
      if (!ok) { statusEl.textContent = "Please fix the highlighted fields."; return; }

      if (!RECIPIENT) {
        statusEl.textContent = "Message form is ready. Add your email address in js/script.js (RECIPIENT) to start receiving messages.";
        showToast("Form is not connected to an email yet.");
        return;
      }

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim() || "Portfolio enquiry from " + name;
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + form.message.value.trim();

      window.location.href = "mailto:" + encodeURIComponent(RECIPIENT) +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      statusEl.textContent = "Opening your email app...";
      form.reset();
    });
  }

  /* ---------- 10. PROFILE PHOTO + CERTIFICATE IMAGE FALLBACKS ----------
     If an image file is missing, show the initials / placeholder instead. */
  var photo = $("#profile-img");
  var frame = photo ? photo.closest(".photo-frame") : null;
  if (photo && frame) {
    photo.addEventListener("error", function () { frame.classList.add("no-photo"); });
    if (photo.complete && photo.naturalWidth === 0) frame.classList.add("no-photo");
  }
  $$(".cert-img").forEach(function (img) {
    function hide() { img.style.display = "none"; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
