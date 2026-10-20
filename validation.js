/* =======================================================
   VALIDATION.JS
   =======================================================
   Frontend-only validation for:
   - Login page
   - Donor registration page
   - NGO registration page
   Everything here runs in the browser only. There is no
   server, so "successful" submissions just show a banner
   and pretend to redirect — the future Flask backend will
   replace this with real API calls.
   ======================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initPasswordToggles();
  initPasswordStrength();
  initLoginForm();
  initDonorRegisterForm();
  initNgoRegisterForm();
});

/* -------------------------------------------------
   SHARED VALIDATORS
-------------------------------------------------- */
var Validators = {
  isRequired: function (value) {
    return value !== null && value.trim().length > 0;
  },
  isEmail: function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  },
  isIndianMobile: function (value) {
    return /^[6-9]\d{9}$/.test(value.trim());
  },
  isPincode: function (value) {
    return /^\d{6}$/.test(value.trim());
  },
  minLength: function (value, len) {
    return value.trim().length >= len;
  }
};

/* Show an inline error under a field. Expects a sibling
   element with class "field-error" and matching data-for. */
function setFieldError(inputEl, message) {
  inputEl.classList.add("error");
  var errorEl = document.querySelector(
    '.field-error[data-for="' + inputEl.id + '"]'
  );
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
}

function clearFieldError(inputEl) {
  inputEl.classList.remove("error");
  var errorEl = document.querySelector(
    '.field-error[data-for="' + inputEl.id + '"]'
  );
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }
}

function showFormBanner(bannerEl, message, type) {
  if (!bannerEl) return;
  bannerEl.textContent = message;
  bannerEl.className = "form-banner show " + type;
}

/* -------------------------------------------------
   1. PASSWORD SHOW / HIDE
   Works on any button with class "password-toggle" whose
   closest .password-field contains one input.
-------------------------------------------------- */
function initPasswordToggles() {
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var field = btn.closest(".password-field");
      var input = field.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "Hide";
      } else {
        input.type = "password";
        btn.textContent = "Show";
      }
    });
  });
}

/* -------------------------------------------------
   2. PASSWORD STRENGTH METER
   Attach to any input with class "js-password-strength".
   Expects a sibling ".strength-meter" (with 4 ".bar" spans)
   and a ".strength-label".
-------------------------------------------------- */
function initPasswordStrength() {
  document.querySelectorAll(".js-password-strength").forEach(function (input) {
    var wrapper = input.closest(".form-group");
    if (!wrapper) return;

    var meter = wrapper.querySelector(".strength-meter");
    var label = wrapper.querySelector(".strength-label");
    if (!meter || !label) return;

    input.addEventListener("input", function () {
      var score = getPasswordScore(input.value);
      meter.className = "strength-meter " + score.className;
      label.textContent = input.value.length === 0 ? "" : score.text;
    });
  });
}

function getPasswordScore(password) {
  var score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { className: "", text: "" };
  if (score <= 1) return { className: "strength-weak", text: "Weak password" };
  if (score === 2) return { className: "strength-fair", text: "Fair password" };
  if (score === 3) return { className: "strength-good", text: "Good password" };
  return { className: "strength-strong", text: "Strong password" };
}

/* -------------------------------------------------
   3. LOGIN FORM
-------------------------------------------------- */
function initLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  var banner = document.getElementById("loginBanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail");
    var password = document.getElementById("loginPassword");
    var role = form.querySelector('input[name="loginRole"]:checked');

    var valid = true;

    clearFieldError(email);
    clearFieldError(password);

    if (!Validators.isRequired(email.value) || !Validators.isEmail(email.value)) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    if (!Validators.isRequired(password.value)) {
      setFieldError(password, "Password is required.");
      valid = false;
    }

    if (!role) {
      showFormBanner(banner, "Please select a role (Donor, NGO or Admin) before logging in.", "error");
      valid = false;
    }

    if (!valid) return;

    // DEMO ONLY: no backend yet, so we just simulate success.
    var destination = {
      donor: "donor-dashboard.html",
      ngo: "ngo-dashboard.html",
      admin: "admin-dashboard.html"
    }[role.value];

    showFormBanner(
      banner,
      "Demo login successful. Redirecting to your " + role.value + " dashboard\u2026",
      "success"
    );

    setTimeout(function () {
      window.location.href = destination;
    }, 900);
  });
}

/* -------------------------------------------------
   4. DONOR REGISTRATION FORM
-------------------------------------------------- */
function initDonorRegisterForm() {
  var form = document.getElementById("donorRegisterForm");
  if (!form) return;

  var banner = document.getElementById("donorRegisterBanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var fullName = document.getElementById("donorFullName");
    var orgName = document.getElementById("donorOrgName");
    var email = document.getElementById("donorEmail");
    var phone = document.getElementById("donorPhone");
    var password = document.getElementById("donorPassword");
    var confirmPassword = document.getElementById("donorConfirmPassword");
    var address = document.getElementById("donorAddress");
    var city = document.getElementById("donorCity");
    var district = document.getElementById("donorDistrict");
    var pincode = document.getElementById("donorPincode");
    var terms = document.getElementById("donorTerms");

    var fields = [fullName, orgName, email, phone, password, confirmPassword, address, city, district, pincode];
    fields.forEach(clearFieldError);

    if (!Validators.isRequired(fullName.value)) {
      setFieldError(fullName, "Full name is required.");
      valid = false;
    }
    if (!Validators.isRequired(orgName.value)) {
      setFieldError(orgName, "Organization / restaurant / hotel name is required.");
      valid = false;
    }
    if (!Validators.isRequired(email.value) || !Validators.isEmail(email.value)) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }
    if (!Validators.isRequired(phone.value) || !Validators.isIndianMobile(phone.value)) {
      setFieldError(phone, "Enter a valid 10-digit Indian mobile number.");
      valid = false;
    }
    if (!Validators.minLength(password.value, 8)) {
      setFieldError(password, "Password must be at least 8 characters.");
      valid = false;
    }
    if (password.value !== confirmPassword.value || !Validators.isRequired(confirmPassword.value)) {
      setFieldError(confirmPassword, "Passwords do not match.");
      valid = false;
    }
    if (!Validators.isRequired(address.value)) {
      setFieldError(address, "Address is required.");
      valid = false;
    }
    if (!Validators.isRequired(city.value)) {
      setFieldError(city, "City is required.");
      valid = false;
    }
    if (!Validators.isRequired(district.value)) {
      setFieldError(district, "District is required.");
      valid = false;
    }
    if (!Validators.isPincode(pincode.value)) {
      setFieldError(pincode, "Enter a valid 6-digit pincode.");
      valid = false;
    }
    if (!terms.checked) {
      showFormBanner(banner, "Please accept the terms and conditions to continue.", "error");
      valid = false;
    }

    if (!valid) return;

    showFormBanner(banner, "Account created (demo). Redirecting to login\u2026", "success");
    form.reset();
    document.querySelectorAll(".strength-meter").forEach(function (m) {
      m.className = "strength-meter";
    });
    document.querySelectorAll(".strength-label").forEach(function (l) {
      l.textContent = "";
    });

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1000);
  });
}

/* -------------------------------------------------
   5. NGO REGISTRATION FORM
-------------------------------------------------- */
function initNgoRegisterForm() {
  var form = document.getElementById("ngoRegisterForm");
  if (!form) return;

  var banner = document.getElementById("ngoRegisterBanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    var ngoName = document.getElementById("ngoName");
    var regNumber = document.getElementById("ngoRegNumber");
    var contactPerson = document.getElementById("ngoContactPerson");
    var email = document.getElementById("ngoEmail");
    var phone = document.getElementById("ngoPhone");
    var password = document.getElementById("ngoPassword");
    var confirmPassword = document.getElementById("ngoConfirmPassword");
    var address = document.getElementById("ngoAddress");
    var city = document.getElementById("ngoCity");
    var district = document.getElementById("ngoDistrict");
    var pincode = document.getElementById("ngoPincode");
    var areasServed = document.getElementById("ngoAreasServed");
    var beneficiaries = document.getElementById("ngoBeneficiaries");
    var terms = document.getElementById("ngoTerms");

    var fields = [ngoName, regNumber, contactPerson, email, phone, password, confirmPassword, address, city, district, pincode, areasServed, beneficiaries];
    fields.forEach(clearFieldError);

    if (!Validators.isRequired(ngoName.value)) {
      setFieldError(ngoName, "NGO name is required.");
      valid = false;
    }
    if (!Validators.isRequired(regNumber.value)) {
      setFieldError(regNumber, "NGO registration number is required.");
      valid = false;
    }
    if (!Validators.isRequired(contactPerson.value)) {
      setFieldError(contactPerson, "Contact person is required.");
      valid = false;
    }
    if (!Validators.isRequired(email.value) || !Validators.isEmail(email.value)) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }
    if (!Validators.isRequired(phone.value) || !Validators.isIndianMobile(phone.value)) {
      setFieldError(phone, "Enter a valid 10-digit Indian mobile number.");
      valid = false;
    }
    if (!Validators.minLength(password.value, 8)) {
      setFieldError(password, "Password must be at least 8 characters.");
      valid = false;
    }
    if (password.value !== confirmPassword.value || !Validators.isRequired(confirmPassword.value)) {
      setFieldError(confirmPassword, "Passwords do not match.");
      valid = false;
    }
    if (!Validators.isRequired(address.value)) {
      setFieldError(address, "Address is required.");
      valid = false;
    }
    if (!Validators.isRequired(city.value)) {
      setFieldError(city, "City is required.");
      valid = false;
    }
    if (!Validators.isRequired(district.value)) {
      setFieldError(district, "District is required.");
      valid = false;
    }
    if (!Validators.isPincode(pincode.value)) {
      setFieldError(pincode, "Enter a valid 6-digit pincode.");
      valid = false;
    }
    if (!Validators.isRequired(areasServed.value)) {
      setFieldError(areasServed, "Please list the areas your NGO serves.");
      valid = false;
    }
    if (!Validators.isRequired(beneficiaries.value) || isNaN(beneficiaries.value) || Number(beneficiaries.value) <= 0) {
      setFieldError(beneficiaries, "Enter a valid number of beneficiaries.");
      valid = false;
    }
    if (!terms.checked) {
      showFormBanner(banner, "Please accept the terms and conditions to continue.", "error");
      valid = false;
    }

    if (!valid) return;

    showFormBanner(banner, "NGO account created (demo). Redirecting to login\u2026", "success");
    form.reset();
    document.querySelectorAll(".strength-meter").forEach(function (m) {
      m.className = "strength-meter";
    });
    document.querySelectorAll(".strength-label").forEach(function (l) {
      l.textContent = "";
    });

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1000);
  });
}
