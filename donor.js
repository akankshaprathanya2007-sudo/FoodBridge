/* =======================================================
   DONOR.JS
   =======================================================
   Everything specific to the Donor side of the app:
   - Sidebar open/close on mobile (shared markup with NGO/Admin)
   - Sample donation data (stand-in for the future MySQL table)
   - Donor Dashboard "Recent Donations" table
   - My Donations page: search, filter, sort, view modal, cancel
   - Add Food page: image preview + date/time validation + safety checklist
   ======================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initSidebarToggle();
  initRecentDonationsTable();
  initMyDonationsPage();
  initAddFoodPage();
  initIncomingRequestsPage();
});

/* -------------------------------------------------
   SAMPLE DATA
   Stand-in for rows that will later come from MySQL via
   Flask. Each donation has everything the dashboard, my
   donations table, and the (Stage 4) food details page need.
-------------------------------------------------- */
var SAMPLE_DONATIONS = [
  {
    id: "DN1042",
    name: "Vegetable Rice",
    category: "Rice",
    veg: true,
    quantity: 40,
    unit: "Portions",
    servable: 40,
    prepDate: "2026-09-11",
    prepTime: "12:30",
    expiryDate: "2026-09-11",
    expiryTime: "20:00",
    pickupFrom: "17:00",
    pickupUntil: "19:30",
    status: "available",
    city: "Madurai",
    icon: "🍛"
  },
  {
    id: "DN1041",
    name: "Mixed Fruit Basket",
    category: "Fruits",
    veg: true,
    quantity: 15,
    unit: "Kg",
    servable: 60,
    prepDate: "2026-09-11",
    prepTime: "09:00",
    expiryDate: "2026-09-12",
    expiryTime: "18:00",
    pickupFrom: "10:00",
    pickupUntil: "16:00",
    status: "requested",
    city: "Madurai",
    icon: "🍎"
  },
  {
    id: "DN1039",
    name: "Chicken Curry",
    category: "Curry",
    veg: false,
    quantity: 12,
    unit: "Kg",
    servable: 50,
    prepDate: "2026-09-10",
    prepTime: "13:00",
    expiryDate: "2026-09-10",
    expiryTime: "21:00",
    pickupFrom: "18:00",
    pickupUntil: "20:30",
    status: "delivered",
    city: "Madurai",
    icon: "🍗"
  },
  {
    id: "DN1035",
    name: "Bread & Bakery Assortment",
    category: "Bakery",
    veg: true,
    quantity: 30,
    unit: "Packets",
    servable: 30,
    prepDate: "2026-09-09",
    prepTime: "07:00",
    expiryDate: "2026-09-10",
    expiryTime: "10:00",
    pickupFrom: "08:00",
    pickupUntil: "09:30",
    status: "completed",
    city: "Madurai",
    icon: "🍞"
  },
  {
    id: "DN1030",
    name: "Sambar Rice Packs",
    category: "Rice",
    veg: true,
    quantity: 25,
    unit: "Boxes",
    servable: 25,
    prepDate: "2026-09-08",
    prepTime: "12:00",
    expiryDate: "2026-09-08",
    expiryTime: "18:00",
    pickupFrom: "15:00",
    pickupUntil: "17:00",
    status: "expired",
    city: "Madurai",
    icon: "🍚"
  },
  {
    id: "DN1028",
    name: "Snack Boxes",
    category: "Snacks",
    veg: true,
    quantity: 50,
    unit: "Boxes",
    servable: 50,
    prepDate: "2026-09-07",
    prepTime: "16:00",
    expiryDate: "2026-09-08",
    expiryTime: "12:00",
    pickupFrom: "17:00",
    pickupUntil: "19:00",
    status: "cancelled",
    city: "Madurai",
    icon: "🍟"
  },
  {
    id: "DN1025",
    name: "Packaged Juice",
    category: "Beverages",
    veg: true,
    quantity: 100,
    unit: "Packets",
    servable: 100,
    prepDate: "2026-09-06",
    prepTime: "10:00",
    expiryDate: "2026-09-20",
    expiryTime: "23:59",
    pickupFrom: "11:00",
    pickupUntil: "18:00",
    status: "accepted",
    city: "Madurai",
    icon: "🧃"
  },
  {
    id: "DN1020",
    name: "Vegetable Curry",
    category: "Curry",
    veg: true,
    quantity: 18,
    unit: "Kg",
    servable: 70,
    prepDate: "2026-09-05",
    prepTime: "12:30",
    expiryDate: "2026-09-05",
    expiryTime: "19:00",
    pickupFrom: "16:00",
    pickupUntil: "18:30",
    status: "pickedup",
    city: "Madurai",
    icon: "🥘"
  }
];

var STATUS_LABELS = {
  available: "Available",
  requested: "Requested",
  accepted: "Accepted",
  pickup: "Pickup Scheduled",
  pickedup: "Picked Up",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
  rejected: "Rejected"
};

function statusBadge(status) {
  var label = STATUS_LABELS[status] || status;
  return '<span class="badge badge-status-' + status + '">' + label + "</span>";
}

function formatDate(isoDate) {
  var d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* -------------------------------------------------
   SIDEBAR TOGGLE (mobile off-canvas)
   Works with:
   <button class="sidebar-toggle" id="sidebarToggle">
   <aside class="sidebar" id="sidebar">
   <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
-------------------------------------------------- */
function initSidebarToggle() {
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

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }
}

/* -------------------------------------------------
   DONOR DASHBOARD — RECENT DONATIONS TABLE
   Renders into <tbody id="recentDonationsBody"> if present.
-------------------------------------------------- */
function initRecentDonationsTable() {
  var body = document.getElementById("recentDonationsBody");
  if (!body) return;

  var recent = SAMPLE_DONATIONS.slice(0, 5);
  body.innerHTML = recent.map(donationRowHtml).join("");
  attachRowActions(body, recent);
}

function donationRowHtml(d) {
  return (
    "<tr>" +
    '<td><div class="food-cell"><div class="food-thumb">' + d.icon + "</div><div>" +
    d.name + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + d.id + "</span></div></div></td>" +
    "<td>" + d.quantity + " " + d.unit + "</td>" +
    "<td>" + formatDate(d.prepDate) + "</td>" +
    "<td>" + formatDate(d.expiryDate) + "</td>" +
    "<td>" + d.pickupFrom + " - " + d.pickupUntil + "</td>" +
    "<td>" + statusBadge(d.status) + "</td>" +
    '<td><div class="row-actions">' +
    '<button class="icon-btn view-btn" data-id="' + d.id + '" title="View">View</button>' +
    "</div></td>" +
    "</tr>"
  );
}

/* -------------------------------------------------
   MY DONATIONS PAGE — search / filter / sort / view / cancel
-------------------------------------------------- */
function initMyDonationsPage() {
  var body = document.getElementById("myDonationsBody");
  if (!body) return;

  var searchInput = document.getElementById("donationSearch");
  var statusFilter = document.getElementById("statusFilter");
  var sortSelect = document.getElementById("sortSelect");
  var emptyState = document.getElementById("donationsEmptyState");

  // Work on a copy so "Cancel" can update status without touching the master list
  var donations = SAMPLE_DONATIONS.map(function (d) {
    return Object.assign({}, d);
  });

  function render() {
    var term = (searchInput.value || "").toLowerCase().trim();
    var statusVal = statusFilter.value;
    var sortVal = sortSelect.value;

    var filtered = donations.filter(function (d) {
      var matchesSearch =
        term === "" ||
        d.name.toLowerCase().indexOf(term) !== -1 ||
        d.category.toLowerCase().indexOf(term) !== -1;
      var matchesStatus = statusVal === "all" || d.status === statusVal;
      return matchesSearch && matchesStatus;
    });

    filtered.sort(function (a, b) {
      if (sortVal === "expiring") {
        return new Date(a.expiryDate + "T" + a.expiryTime) - new Date(b.expiryDate + "T" + b.expiryTime);
      }
      if (sortVal === "quantity") {
        return b.quantity - a.quantity;
      }
      // default: newest first (by prep date)
      return new Date(b.prepDate + "T" + b.prepTime) - new Date(a.prepDate + "T" + a.prepTime);
    });

    if (filtered.length === 0) {
      body.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      body.innerHTML = filtered
        .map(function (d) {
          return (
            "<tr>" +
            '<td><div class="food-cell"><div class="food-thumb">' + d.icon + "</div><div>" +
            d.name + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + d.category + (d.veg ? " · Veg" : " · Non-Veg") + "</span></div></div></td>" +
            "<td>" + d.quantity + " " + d.unit + " (" + d.servable + " people)</td>" +
            "<td>" + formatDate(d.prepDate) + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + d.prepTime + "</span></td>" +
            "<td>" + formatDate(d.expiryDate) + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + d.expiryTime + "</span></td>" +
            "<td>" + d.pickupFrom + " - " + d.pickupUntil + "</td>" +
            "<td>" + statusBadge(d.status) + "</td>" +
            '<td><div class="row-actions">' +
            '<button class="icon-btn view-btn" data-id="' + d.id + '" title="View">View</button>' +
            '<button class="icon-btn edit-btn" data-id="' + d.id + '" title="Edit">Edit</button>' +
            '<button class="icon-btn danger cancel-btn" data-id="' + d.id + '" title="Cancel">Cancel</button>' +
            "</div></td>" +
            "</tr>"
          );
        })
        .join("");

      attachRowActions(body, filtered, {
        onCancel: function (id) {
          var target = donations.find(function (d) {
            return d.id === id;
          });
          if (target && confirm("Cancel this donation (" + target.name + ")?")) {
            target.status = "cancelled";
            render();
          }
        }
      });
    }
  }

  searchInput.addEventListener("input", render);
  statusFilter.addEventListener("change", render);
  sortSelect.addEventListener("change", render);

  render();
}

/* Attach View / Edit / Cancel handlers to whatever rows currently exist */
function attachRowActions(container, dataset, handlers) {
  handlers = handlers || {};

  container.querySelectorAll(".view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = (dataset || SAMPLE_DONATIONS).find(function (d) {
        return d.id === btn.getAttribute("data-id");
      }) || SAMPLE_DONATIONS.find(function (d) {
        return d.id === btn.getAttribute("data-id");
      });
      if (item) openDonationModal(item);
    });
  });

  container.querySelectorAll(".edit-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      alert("Edit form will open here, pre-filled with this donation's details, once connected to the backend.");
    });
  });

  container.querySelectorAll(".cancel-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (handlers.onCancel) handlers.onCancel(btn.getAttribute("data-id"));
    });
  });
}

/* -------------------------------------------------
   VIEW MODAL
   Expects: <div class="modal-overlay" id="donationModal">
              <div class="modal-box"> ... #donationModalBody ... </div>
            </div>
-------------------------------------------------- */
function openDonationModal(d) {
  var overlay = document.getElementById("donationModal");
  var body = document.getElementById("donationModalBody");
  if (!overlay || !body) return;

  body.innerHTML =
    '<h3>' + d.name + " <span style=\"font-size:0.9rem;color:var(--color-ink-soft);\">#" + d.id + "</span></h3>" +
    '<div class="detail-grid">' +
    detailItem("Category", d.category) +
    detailItem("Type", d.veg ? "Vegetarian" : "Non-Vegetarian") +
    detailItem("Quantity", d.quantity + " " + d.unit) +
    detailItem("People Servable", d.servable) +
    detailItem("Prepared", formatDate(d.prepDate) + " · " + d.prepTime) +
    detailItem("Expiry", formatDate(d.expiryDate) + " · " + d.expiryTime) +
    detailItem("Pickup Window", d.pickupFrom + " - " + d.pickupUntil) +
    detailItem("City", d.city) +
    detailItem("Status", STATUS_LABELS[d.status] || d.status) +
    "</div>";

  overlay.classList.add("open");
}

function detailItem(label, value) {
  return '<div class="detail-item"><span>' + label + "</span><strong>" + value + "</strong></div>";
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-close") || e.target.classList.contains("modal-overlay")) {
    var overlay = e.target.closest(".modal-overlay") || e.target;
    if (overlay.classList) overlay.classList.remove("open");
  }
});

/* -------------------------------------------------
   ADD FOOD PAGE
-------------------------------------------------- */
function initAddFoodPage() {
  var form = document.getElementById("addFoodForm");
  if (!form) return;

  initImageUpload();

  var locBtn = document.getElementById("useLocationBtn");
  if (locBtn) {
    locBtn.addEventListener("click", function () {
      var status = document.getElementById("locationStatus");
      if (!navigator.geolocation) { status.textContent = "Location is not supported in this browser."; return; }
      status.textContent = "Getting your location\u2026";
      navigator.geolocation.getCurrentPosition(function (pos) {
        document.getElementById("pickupLat").value = pos.coords.latitude.toFixed(7);
        document.getElementById("pickupLng").value = pos.coords.longitude.toFixed(7);
        status.textContent = "Location captured \u2714";
      }, function () {
        status.textContent = "Permission denied. We will use the address instead.";
      });
    });
  }

  var banner = document.getElementById("addFoodBanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var required = [
      "foodName", "foodCategory", "foodType", "quantity", "unit", "servable",
      "prepDate", "prepTime", "bestBeforeDate", "bestBeforeTime", "expiryDate", "expiryTime",
      "pickupAddress", "pickupCity", "pickupDistrict", "pickupPincode",
      "pickupFrom", "pickupUntil", "contactPerson", "contactNumber"
    ];

    required.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      clearFieldError(el);
      if (!el.value || !el.value.toString().trim()) {
        setFieldError(el, "This field is required.");
        valid = false;
      }
    });

    // Veg / Non-Veg radio group
    var vegSelected = form.querySelector('input[name="vegType"]:checked');
    var vegError = document.getElementById("vegTypeError");
    if (!vegSelected) {
      if (vegError) vegError.classList.add("show");
      valid = false;
    } else if (vegError) {
      vegError.classList.remove("show");
    }

    // Pincode + phone format (reusing the same rules as registration)
    var pincode = document.getElementById("pickupPincode");
    if (pincode.value && !/^\d{6}$/.test(pincode.value.trim())) {
      setFieldError(pincode, "Enter a valid 6-digit pincode.");
      valid = false;
    }

    var contactNumber = document.getElementById("contactNumber");
    if (contactNumber.value && !/^[6-9]\d{9}$/.test(contactNumber.value.trim())) {
      setFieldError(contactNumber, "Enter a valid 10-digit Indian mobile number.");
      valid = false;
    }

    // Date/time logic: expiry must not be before preparation, and not in the past
    var prepDate = document.getElementById("prepDate");
    var prepTime = document.getElementById("prepTime");
    var expiryDate = document.getElementById("expiryDate");
    var expiryTime = document.getElementById("expiryTime");

    if (prepDate.value && prepTime.value && expiryDate.value && expiryTime.value) {
      var prepDT = new Date(prepDate.value + "T" + prepTime.value);
      var expiryDT = new Date(expiryDate.value + "T" + expiryTime.value);
      var now = new Date();

      if (expiryDT <= prepDT) {
        setFieldError(expiryDate, "Expiry must be after the preparation date & time.");
        valid = false;
      } else if (expiryDT < now) {
        setFieldError(expiryDate, "Expiry cannot be in the past.");
        valid = false;
      }
    }

    // Food safety confirmations — all four required
    var safetyChecks = form.querySelectorAll(".safety-checklist input[type='checkbox']");
    var allChecked = Array.prototype.every.call(safetyChecks, function (c) {
      return c.checked;
    });

    if (!allChecked) {
      showFormBanner(banner, "Please confirm all four food safety checkboxes before submitting.", "error");
      valid = false;
    }

    if (!valid) {
      if (banner.textContent === "" ) {
        showFormBanner(banner, "Please fix the highlighted fields before submitting.", "error");
      }
      return;
    }

    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var payload = {
      donor_id: parseInt(localStorage.getItem("donor_id") || "1", 10), // set this at login
      food_name: val("foodName"),
      category: val("foodCategory"),
      food_type: val("foodType"),
      is_veg: vegSelected.value === "veg" ? 1 : 0,
      quantity: val("quantity"),
      unit: val("unit"),
      servable: val("servable"),
      prep_date: val("prepDate"),
      prep_time: val("prepTime"),
      expiry_date: val("expiryDate"),
      expiry_time: val("expiryTime"),
      pickup_address: val("pickupAddress"),
      city: val("pickupCity"),
      district: val("pickupDistrict"),
      pincode: val("pickupPincode"),
      pickup_from: val("pickupFrom"),
      pickup_until: val("pickupUntil"),
      contact_person: val("contactPerson"),
      contact_number: val("contactNumber"),
      allergens: val("allergens"),
      storage_requirements: val("storageRequirements"),
      special_instructions: val("specialInstructions"),
      latitude: val("pickupLat") || null,
      longitude: val("pickupLng") || null
    };

    showFormBanner(banner, "Submitting your donation\u2026", "success");

    fetch("http://127.0.0.1:5000/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); })
      .then(function (r) {
        if (!r.ok) {
          showFormBanner(banner, r.body.message || "Could not save the donation.", "error");
          return;
        }
        showFormBanner(banner, "Food donation listed successfully! Redirecting to My Donations\u2026", "success");
        setTimeout(function () { window.location.href = "my-donations.html"; }, 1200);
      })
      .catch(function () {
        showFormBanner(banner, "Cannot reach the server. Is the Flask backend running?", "error");
      });
  });
}

/* Image upload with preview + type/size validation */
function initImageUpload() {
  var box = document.getElementById("imageUploadBox");
  var input = document.getElementById("foodImageInput");
  var previewRow = document.getElementById("imagePreviewRow");
  var previewImg = document.getElementById("imagePreviewImg");
  var previewName = document.getElementById("imagePreviewName");
  var warning = document.getElementById("imageWarning");

  if (!box || !input) return;

  box.addEventListener("click", function () {
    input.click();
  });

  box.addEventListener("dragover", function (e) {
    e.preventDefault();
    box.classList.add("dragover");
  });

  box.addEventListener("dragleave", function () {
    box.classList.remove("dragover");
  });

  box.addEventListener("drop", function (e) {
    e.preventDefault();
    box.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      handleFile(input.files[0]);
    }
  });

  input.addEventListener("change", function () {
    if (input.files.length) handleFile(input.files[0]);
  });

  function handleFile(file) {
    warning.textContent = "";
    var validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (validTypes.indexOf(file.type) === -1) {
      warning.textContent = "Please upload a JPG, JPEG or PNG image.";
      previewRow.style.display = "none";
      input.value = "";
      return;
    }

    var maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      warning.textContent = "Image is larger than " + maxSizeMB + "MB. Please choose a smaller file.";
      previewRow.style.display = "none";
      input.value = "";
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewName.textContent = file.name + " (" + (file.size / 1024).toFixed(0) + " KB)";
      previewRow.style.display = "flex";
    };
    reader.readAsDataURL(file);
  }
}

/* -------------------------------------------------
   REQUESTS PAGE (Donor side)
   These are requests NGOs have made on THIS donor's food
   donations — different from the NGO's own "My Requests"
   page in js/ngo.js.
-------------------------------------------------- */
var INCOMING_REQUESTS = [
  {
    id: "RQ501",
    food: "Mixed Fruit Basket",
    icon: "🍎",
    ngo: "Hope Trust",
    quantity: "10 Kg",
    requestedDate: "2026-09-12",
    pickupDate: "2026-09-12",
    pickupTime: "14:00",
    status: "requested"
  },
  {
    id: "RQ498",
    food: "Packaged Juice",
    icon: "🧃",
    ngo: "Care & Share Foundation",
    quantity: "50 Packets",
    requestedDate: "2026-09-11",
    pickupDate: "2026-09-12",
    pickupTime: "11:00",
    status: "accepted"
  },
  {
    id: "RQ492",
    food: "Chicken Curry",
    icon: "🍗",
    ngo: "Hope Trust",
    quantity: "12 Kg",
    requestedDate: "2026-09-10",
    pickupDate: "2026-09-10",
    pickupTime: "18:30",
    status: "delivered"
  },
  {
    id: "RQ488",
    food: "Snack Boxes",
    icon: "🍟",
    ngo: "Anbu Illam Trust",
    quantity: "50 Boxes",
    requestedDate: "2026-09-08",
    pickupDate: "2026-09-08",
    pickupTime: "17:30",
    status: "rejected"
  }
];

var REQUEST_STATUS_LABELS = {
  requested: "Requested",
  accepted: "Accepted",
  rejected: "Rejected",
  pickup: "Pickup Scheduled",
  pickedup: "Picked Up",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled"
};

function requestStatusBadge(status) {
  var label = REQUEST_STATUS_LABELS[status] || status;
  return '<span class="badge badge-status-' + status + '">' + label + "</span>";
}

function initIncomingRequestsPage() {
  var body = document.getElementById("incomingRequestsBody");
  if (!body) return;

  var requests = INCOMING_REQUESTS.map(function (r) { return Object.assign({}, r); });

  function render() {
    body.innerHTML = requests
      .map(function (r) {
        var canRespond = r.status === "requested";
        return (
          "<tr>" +
          '<td><div class="food-cell"><div class="food-thumb">' + r.icon + "</div><div>" +
          r.food + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + r.id + "</span></div></div></td>" +
          "<td>" + r.ngo + "</td>" +
          "<td>" + r.quantity + "</td>" +
          "<td>" + formatDate(r.requestedDate) + "</td>" +
          "<td>" + formatDate(r.pickupDate) + "<br><span style=\"color:var(--color-ink-soft);font-size:0.8rem;\">" + r.pickupTime + "</span></td>" +
          "<td>" + requestStatusBadge(r.status) + "</td>" +
          '<td><div class="row-actions">' +
          (canRespond
            ? '<button class="icon-btn accept-btn" data-id="' + r.id + '" title="Accept">Accept</button>' +
              '<button class="icon-btn danger reject-btn" data-id="' + r.id + '" title="Reject">Reject</button>'
            : '<button class="icon-btn view-request-btn" data-id="' + r.id + '" title="View">View</button>') +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");

    body.querySelectorAll(".accept-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = requests.find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (r && confirm("Accept " + r.ngo + "'s request for " + r.food + "?")) {
          r.status = "accepted";
          render();
        }
      });
    });

    body.querySelectorAll(".reject-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = requests.find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (r && confirm("Reject " + r.ngo + "'s request for " + r.food + "?")) {
          r.status = "rejected";
          render();
        }
      });
    });

    body.querySelectorAll(".view-request-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = requests.find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (r) {
          alert(
            r.food + " — requested by " + r.ngo + "\n" +
            "Quantity: " + r.quantity + "\n" +
            "Pickup: " + formatDate(r.pickupDate) + " at " + r.pickupTime + "\n" +
            "Status: " + (REQUEST_STATUS_LABELS[r.status] || r.status)
          );
        }
      });
    });
  }

  render();
}
