/* =======================================================
   MAIN.JS
   =======================================================
   Shared behaviour used on every page:
   1. Mobile navbar toggle
   2. Animated stat counters on the homepage
   Keep this file general-purpose. Page-specific logic
   (validation, dashboards, charts) lives in its own file
   under /js so nothing gets crowded here.
   ======================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initStatCounters();
  initRoleAwareSidebar();
  initNotificationsPage();
  initProfilePage();
});

/* -------------------------------------------------
   1. MOBILE NAV TOGGLE
   Works on any page that includes:
   <button class="navbar-toggle" id="navToggle">...</button>
   <div class="navbar-mobile-panel" id="navMobilePanel">...</div>
-------------------------------------------------- */
function initMobileNav() {
  var toggleBtn = document.getElementById("navToggle");
  var mobilePanel = document.getElementById("navMobilePanel");

  if (!toggleBtn || !mobilePanel) return;

  toggleBtn.addEventListener("click", function () {
    mobilePanel.classList.toggle("open");

    var isOpen = mobilePanel.classList.contains("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu when a link inside it is clicked
  mobilePanel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobilePanel.classList.remove("open");
    });
  });
}

/* -------------------------------------------------
   2. ANIMATED STAT COUNTERS
   Add data-count="1250" to any element and it will count
   up from 0 to that number once it scrolls into view.
   Example: <span class="stat-number" data-count="1250">0</span>
-------------------------------------------------- */
function initStatCounters() {
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length === 0) return;

  var hasRun = false;

  function runCounters() {
    if (hasRun) return;
    hasRun = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1200; // ms
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value.toLocaleString();

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  // Respect users who prefer reduced motion: just show the final number
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    counters.forEach(function (el) {
      el.textContent = (parseInt(el.getAttribute("data-count"), 10) || 0).toLocaleString();
    });
    return;
  }

  var statsSection = document.querySelector(".stats-strip");
  if (!statsSection) {
    runCounters();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounters();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsSection);
}

/* =======================================================
   SHARED PAGES: NOTIFICATIONS + PROFILE
   =======================================================
   These two pages (pages/notifications.html and
   pages/profile.html) are used by BOTH the Donor and NGO
   sides of the app. Which sidebar links and which fields
   show up is decided by a ?role=donor or ?role=ngo value
   in the URL — every dashboard links to these pages with
   its own role already attached, e.g.
   "notifications.html?role=ngo".
   ======================================================= */

function getRoleFromQuery() {
  var params = new URLSearchParams(window.location.search);
  var role = params.get("role");
  return role === "ngo" ? "ngo" : "donor"; // default to donor
}

/* -------------------------------------------------
   ROLE-AWARE SIDEBAR
   Any dashboard-style page can include TWO sidebar navs,
   one with data-role-nav="donor" and one with
   data-role-nav="ngo" (plus matching topbar-user blocks),
   and this function shows only the one matching the URL.
   Pages with only one nav (most dashboards) are unaffected.
-------------------------------------------------- */
function initRoleAwareSidebar() {
  var roleBlocks = document.querySelectorAll("[data-role-nav]");
  if (roleBlocks.length === 0) return;

  var role = getRoleFromQuery();

  roleBlocks.forEach(function (el) {
    el.style.display = el.getAttribute("data-role-nav") === role ? "" : "none";
  });

  // Also toggle any element scoped with data-role-view (used for
  // topbar user info and page copy that differs by role).
  document.querySelectorAll("[data-role-view]").forEach(function (el) {
    el.style.display = el.getAttribute("data-role-view") === role ? "" : "none";
  });

  // Role switch links, if present: <a data-role-switch="donor|ngo">
  document.querySelectorAll("[data-role-switch]").forEach(function (link) {
    var targetRole = link.getAttribute("data-role-switch");
    var url = new URL(link.href, window.location.href);
    url.searchParams.set("role", targetRole);
    link.href = url.pathname + url.search;
    if (targetRole === role) link.classList.add("active-role");
  });
}

/* -------------------------------------------------
   NOTIFICATIONS PAGE
-------------------------------------------------- */
var NOTIFICATIONS_BY_ROLE = {
  donor: [
    { icon: "📨", text: "Hope Trust requested your donation \u201cMixed Fruit Basket\u201d.", time: "10 minutes ago", read: false },
    { icon: "✅", text: "Your donation \u201cChicken Curry\u201d was marked delivered.", time: "2 hours ago", read: false },
    { icon: "🚚", text: "Pickup for \u201cVegetable Rice\u201d is scheduled for today, 5:00 PM.", time: "3 hours ago", read: false },
    { icon: "⏱️", text: "Your donation \u201cSambar Rice Packs\u201d will expire soon.", time: "Yesterday", read: true },
    { icon: "🎉", text: "Your donation \u201cBread & Bakery Assortment\u201d has been completed.", time: "2 days ago", read: true },
    { icon: "👤", text: "Welcome to FoodBridge! Complete your profile to get started.", time: "5 days ago", read: true }
  ],
  ngo: [
    { icon: "✅", text: "Green Leaf Canteen accepted your request for \u201cVegetable Fried Rice\u201d.", time: "20 minutes ago", read: false },
    { icon: "🚚", text: "Pickup for \u201cAssorted Bakery Items\u201d is scheduled for 9:30 AM tomorrow.", time: "1 hour ago", read: false },
    { icon: "🍽️", text: "3 new food donations are available near you.", time: "4 hours ago", read: false },
    { icon: "❌", text: "Your request for \u201cSnack Boxes\u201d was declined by the donor.", time: "Yesterday", read: true },
    { icon: "🎉", text: "Your pickup of \u201cMixed Vegetable Curry\u201d was marked completed.", time: "3 days ago", read: true },
    { icon: "👤", text: "Welcome to FoodBridge! Complete your NGO profile to get started.", time: "6 days ago", read: true }
  ]
};

function initNotificationsPage() {
  var list = document.getElementById("notificationsList");
  if (!list) return;

  var role = getRoleFromQuery();
  var items = NOTIFICATIONS_BY_ROLE[role];

  function render() {
    list.innerHTML = items
      .map(function (n, index) {
        return (
          '<div class="notification-item' + (n.read ? "" : " unread") + '">' +
          '<div class="notification-icon">' + n.icon + "</div>" +
          '<div class="notification-body">' +
          "<p>" + n.text + "</p>" +
          '<span class="notification-time">' + n.time + "</span>" +
          "</div>" +
          (n.read
            ? ""
            : '<button class="btn btn-outline btn-sm mark-read-btn" data-index="' + index + '">Mark as read</button>') +
          "</div>"
        );
      })
      .join("");

    list.querySelectorAll(".mark-read-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        items[Number(btn.getAttribute("data-index"))].read = true;
        render();
      });
    });
  }

  var markAllBtn = document.getElementById("markAllReadBtn");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", function () {
      items.forEach(function (n) { n.read = true; });
      render();
    });
  }

  render();
}

/* -------------------------------------------------
   PROFILE PAGE
   Fields are pre-filled with demo data. "Edit" enables the
   inputs; "Save" disables them again and shows a success
   banner (nothing is persisted — there's no backend yet).
-------------------------------------------------- */
function initProfilePage() {
  var form = document.getElementById("profileForm");
  if (!form) return;

  var editBtn = document.getElementById("profileEditBtn");
  var saveBtn = document.getElementById("profileSaveBtn");
  var banner = document.getElementById("profileBanner");
  var inputs = form.querySelectorAll("input, textarea");

  function setEditable(editable) {
    inputs.forEach(function (el) {
      el.disabled = !editable;
    });
    editBtn.style.display = editable ? "none" : "inline-flex";
    saveBtn.style.display = editable ? "inline-flex" : "none";
  }

  setEditable(false);

  editBtn.addEventListener("click", function () {
    setEditable(true);
    if (banner) banner.className = "form-banner";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setEditable(false);
    if (banner) {
      banner.textContent = "Profile updated (demo). This will save to your account once the backend is connected.";
      banner.className = "form-banner show success";
    }
  });
}
