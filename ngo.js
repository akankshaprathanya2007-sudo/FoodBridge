/* =======================================================
   NGO.JS
   =======================================================
   Everything specific to the NGO side of the app:
   - Sample "available food" dataset (stand-in for MySQL)
   - NGO Dashboard mini preview grid
   - Available Food page: search / filter / sort grid
   - Food Details page: full detail + freshness calculation
   - Food Request page: request form + validation
   Sidebar toggle is handled by initSidebarToggle() in donor.js's
   pattern — redefined here too so this file works standalone.
   ======================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initNgoSidebarToggle();
  initAvailableFoodPreview();
  initAvailableFoodPage();
  initFoodDetailsPage();
  initFoodRequestPage();
  initMyRequestsPage();
  initPickupTrackingPage();
});

/* -------------------------------------------------
   SAMPLE DATA — food currently available for NGOs to request.
   Dates are anchored around "today" (12 Sep 2026) so the
   freshness calculation has a mix of Fresh / Near Expiry / Expired.
-------------------------------------------------- */
var AVAILABLE_FOOD = [
  {
    id: "AF2101",
    name: "Vegetable Fried Rice",
    category: "Rice",
    veg: true,
    quantity: 35,
    unit: "Portions",
    servable: 35,
    prepDate: "2026-09-12",
    prepTime: "11:00",
    expiryDate: "2026-09-12",
    expiryTime: "21:00",
    pickupFrom: "17:00",
    pickupUntil: "20:00",
    city: "Madurai",
    district: "Madurai",
    pincode: "625001",
    donorName: "Green Leaf Canteen",
    donorPhone: "9876543210",
    donorAddress: "12 College Road, Madurai",
    allergens: "None declared",
    storage: "Keep covered, room temperature",
    instructions: "Consume within 4 hours of pickup",
    icon: "🍛",
    status: "available"
  },
  {
    id: "AF2098",
    name: "Assorted Bakery Items",
    category: "Bakery",
    veg: true,
    quantity: 40,
    unit: "Packets",
    servable: 40,
    prepDate: "2026-09-12",
    prepTime: "06:30",
    expiryDate: "2026-09-13",
    expiryTime: "09:00",
    pickupFrom: "09:00",
    pickupUntil: "12:00",
    city: "Madurai",
    district: "Madurai",
    pincode: "625002",
    donorName: "Sunrise Bakery",
    donorPhone: "9876501234",
    donorAddress: "45 Anna Nagar Main Road, Madurai",
    allergens: "Contains gluten, nuts",
    storage: "Store in a cool, dry place",
    instructions: "Best consumed same day",
    icon: "🍞",
    status: "available"
  },
  {
    id: "AF2095",
    name: "Chicken Biryani",
    category: "Rice",
    veg: false,
    quantity: 20,
    unit: "Kg",
    servable: 80,
    prepDate: "2026-09-12",
    prepTime: "13:00",
    expiryDate: "2026-09-12",
    expiryTime: "19:00",
    pickupFrom: "16:00",
    pickupUntil: "18:30",
    city: "Madurai",
    district: "Madurai",
    pincode: "625003",
    donorName: "Royal Function Hall",
    donorPhone: "9876512345",
    donorAddress: "8 Bypass Road, Madurai",
    allergens: "None declared",
    storage: "Keep refrigerated until pickup",
    instructions: "Reheat before serving",
    icon: "🍗",
    status: "available"
  },
  {
    id: "AF2090",
    name: "Mixed Vegetable Curry",
    category: "Curry",
    veg: true,
    quantity: 15,
    unit: "Kg",
    servable: 60,
    prepDate: "2026-09-11",
    prepTime: "12:30",
    expiryDate: "2026-09-12",
    expiryTime: "12:30",
    pickupFrom: "08:00",
    pickupUntil: "11:30",
    city: "Madurai",
    district: "Madurai",
    pincode: "625001",
    donorName: "Green Leaf Canteen",
    donorPhone: "9876543210",
    donorAddress: "12 College Road, Madurai",
    allergens: "None declared",
    storage: "Keep refrigerated",
    instructions: "Consume within 6 hours",
    icon: "🥘",
    status: "available"
  },
  {
    id: "AF2085",
    name: "Fresh Fruit Boxes",
    category: "Fruits",
    veg: true,
    quantity: 25,
    unit: "Boxes",
    servable: 50,
    prepDate: "2026-09-12",
    prepTime: "07:00",
    expiryDate: "2026-09-15",
    expiryTime: "18:00",
    pickupFrom: "10:00",
    pickupUntil: "17:00",
    city: "Madurai",
    district: "Madurai",
    pincode: "625004",
    donorName: "Fresh Mart Wholesale",
    donorPhone: "9876523456",
    donorAddress: "21 Market Street, Madurai",
    allergens: "None",
    storage: "Store at room temperature",
    instructions: "No special handling needed",
    icon: "🍎",
    status: "available"
  },
  {
    id: "AF2080",
    name: "Packaged Juice Cartons",
    category: "Beverages",
    veg: true,
    quantity: 100,
    unit: "Packets",
    servable: 100,
    prepDate: "2026-09-10",
    prepTime: "10:00",
    expiryDate: "2026-09-25",
    expiryTime: "23:59",
    pickupFrom: "11:00",
    pickupUntil: "18:00",
    city: "Madurai",
    district: "Madurai",
    pincode: "625001",
    donorName: "Green Leaf Canteen",
    donorPhone: "9876543210",
    donorAddress: "12 College Road, Madurai",
    allergens: "Contains sugar",
    storage: "Store in a cool place, do not freeze",
    instructions: "Sealed packets, safe to transport",
    icon: "🧃",
    status: "available"
  },
  {
    id: "AF2075",
    name: "Snack Boxes",
    category: "Snacks",
    veg: true,
    quantity: 50,
    unit: "Boxes",
    servable: 50,
    prepDate: "2026-09-12",
    prepTime: "09:00",
    expiryDate: "2026-09-12",
    expiryTime: "15:00",
    pickupFrom: "10:00",
    pickupUntil: "14:00",
    city: "Madurai",
    district: "Madurai",
    pincode: "625005",
    donorName: "City Event Hall",
    donorPhone: "9876534567",
    donorAddress: "3 Race Course Road, Madurai",
    allergens: "May contain traces of nuts",
    storage: "Store in a dry place",
    instructions: "Distribute same day",
    icon: "🍟",
    status: "available"
  }
];

/* -------------------------------------------------
   FRESHNESS CALCULATION
   Compares "now" against a food's expiry date/time.
   > 6 hours remaining  -> Fresh
   0–6 hours remaining  -> Near Expiry
   already past expiry  -> Expired
-------------------------------------------------- */
function getFreshness(item) {
  var now = new Date();
  var expiry = new Date(item.expiryDate + "T" + item.expiryTime);
  var hoursLeft = (expiry - now) / (1000 * 60 * 60);

  if (hoursLeft <= 0) {
    return { label: "Expired", className: "freshness-expired" };
  }
  if (hoursLeft <= 6) {
    return { label: "Near Expiry", className: "freshness-near" };
  }
  return { label: "Fresh", className: "freshness-fresh" };
}

function isExpired(item) {
  var now = new Date();
  var expiry = new Date(item.expiryDate + "T" + item.expiryTime);
  return expiry <= now;
}

function formatDateNgo(isoDate) {
  var d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* Read ?id=XXXX from the URL */
function getIdFromQuery() {
  var params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/* -------------------------------------------------
   SIDEBAR TOGGLE (same pattern as donor.js, redefined
   here so ngo pages work without also loading donor.js)
-------------------------------------------------- */
function initNgoSidebarToggle() {
  var toggleBtn = document.getElementById("sidebarToggle");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebarBackdrop");

  if (!toggleBtn || !sidebar || sidebar.dataset.bound === "true") return;
  sidebar.dataset.bound = "true";

  function closeSidebar() {
    sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("open");
  });

  if (backdrop) backdrop.addEventListener("click", closeSidebar);
}

/* -------------------------------------------------
   NGO DASHBOARD — small "available food" preview grid
   Renders into <div id="availableFoodPreview"> if present.
-------------------------------------------------- */
function initAvailableFoodPreview() {
  var grid = document.getElementById("availableFoodPreview");
  if (!grid) return;

  var items = AVAILABLE_FOOD.filter(function (i) { return !isExpired(i); }).slice(0, 3);
  grid.innerHTML = items.map(foodCardHtml).join("");
  attachFoodCardLinks(grid);
}

/* -------------------------------------------------
   AVAILABLE FOOD PAGE — full grid with search/filter/sort
-------------------------------------------------- */
function initAvailableFoodPage() {
  var grid = document.getElementById("availableFoodGrid");
  if (!grid) return;

  var searchInput = document.getElementById("foodSearch");
  var categoryFilter = document.getElementById("categoryFilter");
  var vegFilter = document.getElementById("vegFilter");
  var cityFilter = document.getElementById("cityFilter");
  var sortSelect = document.getElementById("sortSelect");
  var emptyState = document.getElementById("foodEmptyState");

  function render() {
    var term = (searchInput.value || "").toLowerCase().trim();
    var category = categoryFilter.value;
    var veg = vegFilter.value;
    var city = cityFilter.value;
    var sortVal = sortSelect.value;

    var filtered = AVAILABLE_FOOD.filter(function (item) {
      if (isExpired(item)) return false; // only show non-expired sample foods
      var matchesSearch = term === "" || item.name.toLowerCase().indexOf(term) !== -1;
      var matchesCategory = category === "all" || item.category === category;
      var matchesVeg = veg === "all" || (veg === "veg" ? item.veg : !item.veg);
      var matchesCity = city === "all" || item.city === city;
      return matchesSearch && matchesCategory && matchesVeg && matchesCity;
    });

    filtered.sort(function (a, b) {
      if (sortVal === "expiring") {
        return new Date(a.expiryDate + "T" + a.expiryTime) - new Date(b.expiryDate + "T" + b.expiryTime);
      }
      if (sortVal === "quantity") {
        return b.quantity - a.quantity;
      }
      return new Date(b.prepDate + "T" + b.prepTime) - new Date(a.prepDate + "T" + a.prepTime);
    });

    if (filtered.length === 0) {
      grid.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      grid.innerHTML = filtered.map(foodCardHtml).join("");
      attachFoodCardLinks(grid);
    }
  }

  [searchInput, categoryFilter, vegFilter, cityFilter, sortSelect].forEach(function (el) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  render();
}

function foodCardHtml(item) {
  var freshness = getFreshness(item);
  return (
    '<div class="food-card">' +
    '<div class="food-card-image">' + item.icon +
    '<span class="badge ' + freshness.className + '">' + freshness.label + "</span>" +
    "</div>" +
    '<div class="food-card-body">' +
    "<h4>" + item.name + "</h4>" +
    '<div class="food-card-meta">' +
    "<span>" + item.category + " · " + (item.veg ? "Veg" : "Non-Veg") + "</span>" +
    "<span>" + item.quantity + " " + item.unit + " · Serves " + item.servable + "</span>" +
    "<span>Pickup: " + item.pickupFrom + " - " + item.pickupUntil + "</span>" +
    "<span>" + item.city + "</span>" +
    "</div>" +
    '<div class="food-card-actions">' +
    '<a href="food-details.html?id=' + item.id + '" class="btn btn-outline">View Details</a>' +
    '<a href="food-request.html?id=' + item.id + '" class="btn btn-accent">Request</a>' +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

function attachFoodCardLinks() {
  // Cards are plain <a> links, so no extra JS wiring needed.
  // Reserved for future enhancements (e.g. quick-view modal).
}

/* -------------------------------------------------
   FOOD DETAILS PAGE
-------------------------------------------------- */
function initFoodDetailsPage() {
  var container = document.getElementById("foodDetailsContainer");
  if (!container) return;

  var id = getIdFromQuery();
  var item = AVAILABLE_FOOD.find(function (f) { return f.id === id; }) || AVAILABLE_FOOD[0];
  var freshness = getFreshness(item);

  document.title = item.name + " — Food Details — FoodBridge";

  document.getElementById("detailsIcon").textContent = item.icon;
  document.getElementById("detailsName").textContent = item.name;
  document.getElementById("detailsFreshness").textContent = freshness.label;
  document.getElementById("detailsFreshness").className = "freshness-badge " + freshness.className;
  document.getElementById("detailsCategory").textContent = item.category;
  document.getElementById("detailsVeg").textContent = item.veg ? "Vegetarian" : "Non-Vegetarian";
  document.getElementById("detailsQuantity").textContent = item.quantity + " " + item.unit;
  document.getElementById("detailsServable").textContent = item.servable + " people";
  document.getElementById("detailsPrep").textContent = formatDateNgo(item.prepDate) + " · " + item.prepTime;
  document.getElementById("detailsExpiry").textContent = formatDateNgo(item.expiryDate) + " · " + item.expiryTime;
  document.getElementById("detailsPickupWindow").textContent = item.pickupFrom + " - " + item.pickupUntil;
  document.getElementById("detailsPickupAddress").textContent = item.donorAddress + ", " + item.city + " - " + item.pincode;
  document.getElementById("detailsDonorName").textContent = item.donorName;
  document.getElementById("detailsDonorPhone").textContent = item.donorPhone;
  document.getElementById("detailsAllergens").textContent = item.allergens;
  document.getElementById("detailsStorage").textContent = item.storage;
  document.getElementById("detailsInstructions").textContent = item.instructions;

  var requestBtn = document.getElementById("detailsRequestBtn");
  if (requestBtn) requestBtn.href = "food-request.html?id=" + item.id;
}

/* -------------------------------------------------
   FOOD REQUEST PAGE
-------------------------------------------------- */
function initFoodRequestPage() {
  var form = document.getElementById("foodRequestForm");
  if (!form) return;

  var id = getIdFromQuery();
  var item = AVAILABLE_FOOD.find(function (f) { return f.id === id; }) || AVAILABLE_FOOD[0];

  document.getElementById("summaryIcon").textContent = item.icon;
  document.getElementById("summaryName").textContent = item.name;
  document.getElementById("summaryMeta").textContent =
    item.quantity + " " + item.unit + " available · " + item.donorName + " · " + item.city;

  var requestedQty = document.getElementById("requestedQuantity");
  var maxHint = document.getElementById("maxQuantityHint");
  requestedQty.max = item.quantity;
  maxHint.textContent = "Up to " + item.quantity + " " + item.unit + " available.";

  var banner = document.getElementById("requestBanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var peopleToServe = document.getElementById("peopleToServe");
    var pickupDate = document.getElementById("requestPickupDate");
    var pickupTime = document.getElementById("requestPickupTime");

    [requestedQty, peopleToServe, pickupDate, pickupTime].forEach(clearFieldError);

    if (!requestedQty.value || Number(requestedQty.value) <= 0) {
      setFieldError(requestedQty, "Enter the quantity you'd like to request.");
      valid = false;
    } else if (Number(requestedQty.value) > item.quantity) {
      setFieldError(requestedQty, "Cannot exceed the available quantity of " + item.quantity + " " + item.unit + ".");
      valid = false;
    }

    if (!peopleToServe.value || Number(peopleToServe.value) <= 0) {
      setFieldError(peopleToServe, "Enter the number of people you plan to serve.");
      valid = false;
    }

    if (!pickupDate.value) {
      setFieldError(pickupDate, "Select a pickup date.");
      valid = false;
    } else {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(pickupDate.value) < today) {
        setFieldError(pickupDate, "Pickup date cannot be in the past.");
        valid = false;
      }
    }

    if (!pickupTime.value) {
      setFieldError(pickupTime, "Select a pickup time.");
      valid = false;
    }

    if (!valid) return;

    showFormBanner(banner, "Request submitted successfully (demo). The donor will be notified.", "success");
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(function () {
      window.location.href = "ngo-dashboard.html";
    }, 1200);
  });

  var cancelBtn = document.getElementById("requestCancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      window.location.href = "available-food.html";
    });
  }
}

/* -------------------------------------------------
   MY REQUESTS PAGE (NGO side)
   Requests this NGO has made on donors' food listings.
-------------------------------------------------- */
var MY_REQUESTS = [
  {
    id: "MR301",
    food: "Vegetable Fried Rice",
    icon: "🍛",
    donor: "Green Leaf Canteen",
    quantity: "20 Portions",
    requestedDate: "2026-09-12",
    pickupDate: "2026-09-12",
    pickupTime: "17:30",
    status: "requested",
    donorAddress: "12 College Road, Madurai",
    donorPhone: "9876543210"
  },
  {
    id: "MR298",
    food: "Assorted Bakery Items",
    icon: "🍞",
    donor: "Sunrise Bakery",
    quantity: "30 Packets",
    requestedDate: "2026-09-11",
    pickupDate: "2026-09-13",
    pickupTime: "09:30",
    status: "accepted",
    donorAddress: "45 Anna Nagar Main Road, Madurai",
    donorPhone: "9876501234"
  },
  {
    id: "MR291",
    food: "Mixed Vegetable Curry",
    icon: "🥘",
    donor: "Green Leaf Canteen",
    quantity: "15 Kg",
    requestedDate: "2026-09-10",
    pickupDate: "2026-09-11",
    pickupTime: "09:00",
    status: "delivered",
    donorAddress: "12 College Road, Madurai",
    donorPhone: "9876543210"
  },
  {
    id: "MR285",
    food: "Snack Boxes",
    icon: "🍟",
    donor: "City Event Hall",
    quantity: "50 Boxes",
    requestedDate: "2026-09-08",
    pickupDate: "2026-09-08",
    pickupTime: "13:00",
    status: "rejected",
    donorAddress: "3 Race Course Road, Madurai",
    donorPhone: "9876534567"
  }
];

var MY_REQUEST_STATUS_LABELS = {
  requested: "Requested",
  accepted: "Accepted",
  rejected: "Rejected",
  pickup: "Pickup Scheduled",
  pickedup: "Picked Up",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled"
};

function myRequestStatusBadge(status) {
  var label = MY_REQUEST_STATUS_LABELS[status] || status;
  return '<span class="badge badge-status-' + status + '">' + label + "</span>";
}

function initMyRequestsPage() {
  var body = document.getElementById("myRequestsBody");
  if (!body) return;

  var requests = MY_REQUESTS.map(function (r) { return Object.assign({}, r); });

  function render() {
    body.innerHTML = requests
      .map(function (r) {
        var canCancel = r.status === "requested" || r.status === "accepted";
        return (
          "<tr>" +
          '<td><div class="food-cell"><div class="food-thumb">' + r.icon + "</div><div>" +
          r.food + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + r.id + "</span></div></div></td>" +
          "<td>" + r.donor + "</td>" +
          "<td>" + r.quantity + "</td>" +
          "<td>" + formatDateNgo(r.requestedDate) + "</td>" +
          "<td>" + formatDateNgo(r.pickupDate) + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + r.pickupTime + "</span></td>" +
          "<td>" + myRequestStatusBadge(r.status) + "</td>" +
          '<td><div class="row-actions">' +
          '<button class="icon-btn view-my-request-btn" data-id="' + r.id + '" title="View">View</button>' +
          (canCancel ? '<button class="icon-btn danger cancel-my-request-btn" data-id="' + r.id + '" title="Cancel">Cancel</button>' : "") +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");

    body.querySelectorAll(".view-my-request-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = requests.find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (r) {
          alert(
            r.food + " — from " + r.donor + "\n" +
            "Quantity requested: " + r.quantity + "\n" +
            "Pickup: " + formatDateNgo(r.pickupDate) + " at " + r.pickupTime + "\n" +
            "Donor address: " + r.donorAddress + "\n" +
            "Status: " + (MY_REQUEST_STATUS_LABELS[r.status] || r.status)
          );
        }
      });
    });

    body.querySelectorAll(".cancel-my-request-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = requests.find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (r && confirm("Cancel your request for " + r.food + "?")) {
          r.status = "cancelled";
          render();
        }
      });
    });
  }

  render();
}

/* -------------------------------------------------
   PICKUP TRACKING PAGE
   Shows a visual timeline for whichever request is selected
   in the #trackingSelect dropdown.
-------------------------------------------------- */
var TRACKING_STEPS = [
  { key: "requested", label: "Request Submitted" },
  { key: "accepted", label: "Donor Accepted" },
  { key: "pickup", label: "Pickup Scheduled" },
  { key: "pickedup", label: "Food Picked Up" },
  { key: "delivered", label: "Food Delivered" },
  { key: "completed", label: "Completed" }
];

// Maps a request's real-world status onto how far along the
// fixed 6-step timeline it has progressed.
var STATUS_TO_STEP_INDEX = {
  requested: 0,
  accepted: 1,
  pickup: 2,
  pickedup: 3,
  delivered: 4,
  completed: 5,
  rejected: 0,
  cancelled: 0
};

function initPickupTrackingPage() {
  var select = document.getElementById("trackingSelect");
  var timeline = document.getElementById("trackingTimeline");
  var detailsBox = document.getElementById("trackingDetails");
  if (!select || !timeline) return;

  // Only requests that are actually progressing (not rejected/cancelled)
  var trackable = MY_REQUESTS.filter(function (r) {
    return r.status !== "rejected" && r.status !== "cancelled";
  });

  select.innerHTML = trackable
    .map(function (r) {
      return '<option value="' + r.id + '">' + r.food + " — " + r.donor + "</option>";
    })
    .join("");

  function render() {
    var selectedId = select.value;
    var r = trackable.find(function (x) { return x.id === selectedId; }) || trackable[0];
    if (!r) return;

    var currentIndex = STATUS_TO_STEP_INDEX[r.status] !== undefined ? STATUS_TO_STEP_INDEX[r.status] : 0;
    // Treat "delivered" as functionally complete unless status is explicitly "completed"
    if (r.status === "delivered") currentIndex = 4;

    timeline.innerHTML = TRACKING_STEPS.map(function (step, index) {
      var stateClass = index < currentIndex ? "done" : index === currentIndex ? "done current" : "";
      var icon = index <= currentIndex ? "✓" : "○";
      var subtext =
        index === currentIndex
          ? "In progress"
          : index < currentIndex
          ? "Completed"
          : "Pending";

      return (
        '<div class="tracking-step ' + stateClass + '">' +
        '<div class="tracking-dot">' + icon + "</div>" +
        "<div><h4>" + step.label + "</h4><span>" + subtext + "</span></div>" +
        "</div>"
      );
    }).join("");

    if (detailsBox) {
      detailsBox.innerHTML =
        detailItem("Food", r.food) +
        detailItem("Donor", r.donor) +
        detailItem("NGO", "Hope Trust") +
        detailItem("Pickup Address", r.donorAddress) +
        detailItem("Pickup Date", formatDateNgo(r.pickupDate)) +
        detailItem("Pickup Time", r.pickupTime) +
        detailItem("Contact Person", r.donor + " Coordinator") +
        detailItem("Contact Number", r.donorPhone);
    }
  }

  select.addEventListener("change", render);
  render();
}
