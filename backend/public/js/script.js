/* ==========================================================================
   STAYAIRA THEME ENGINE — Light | Dark | System
   ========================================================================== */

/**
 * Apply theme to document root and update UI indicators.
 * @param {string} preference - "light" | "dark" | "system"
 */
function setTheme(preference) {
    localStorage.setItem("stayaira-theme", preference);
    localStorage.setItem("rentrova-theme", preference);
    document.documentElement.setAttribute("data-theme-pref", preference);

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effective = preference === "system" ? (prefersDark ? "dark" : "light") : preference;
    document.documentElement.setAttribute("data-theme", effective);

    updateThemeUI(preference);

    // Close panel after selection
    const panel = document.getElementById("themePanel");
    if (panel) panel.classList.remove("open");
}

/**
 * Update icon, panel active state, and switcher button tooltip.
 */
function updateThemeUI(preference) {
    const icon = document.getElementById("themeIcon");
    const options = document.querySelectorAll(".theme-option");

    // Remove active from all
    options.forEach(opt => opt.classList.remove("active"));

    // Set active on selected
    const activeOpt = document.querySelector(`.theme-option[data-theme-choice="${preference}"]`);
    if (activeOpt) activeOpt.classList.add("active");

    // Update icon
    if (icon) {
        icon.className = "fa-solid";
        if (preference === "light") {
            icon.classList.add("fa-sun");
            icon.style.color = "#F59E0B";
        } else if (preference === "dark") {
            icon.classList.add("fa-moon");
            icon.style.color = "#6366F1";
        } else {
            icon.classList.add("fa-circle-half-stroke");
            icon.style.color = "";
        }
    }
}

// Theme Switcher Panel Toggle
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeSwitcherBtn");
    const panel = document.getElementById("themePanel");

    if (btn && panel) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            panel.classList.toggle("open");
        });

        // Close panel when clicking outside
        document.addEventListener("click", function (e) {
            if (!document.getElementById("themeWrapper")?.contains(e.target)) {
                panel.classList.remove("open");
            }
        });
    }

    // Initialize UI state from stored preference
    const saved = localStorage.getItem("stayaira-theme") || localStorage.getItem("rentrova-theme") || "system";
    updateThemeUI(saved);

    // Listen for OS-level color scheme changes (when "System Default" is selected)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        const current = localStorage.getItem("stayaira-theme") || localStorage.getItem("rentrova-theme") || "system";
        if (current === "system") {
            setTheme("system");
        }
    });
});

/* ========================================================================== */

(() => {
  "use strict";

  // 1. Bootstrap custom validation styles
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // 2. Auto-dismiss floating toast notifications after 4.5 seconds
  const toasts = document.querySelectorAll('.luxury-toast');
  toasts.forEach(toast => {
    setTimeout(() => {
      toast.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  });

  // 3. Tax Switcher Logic (Calculates total or toggles GST badge)
  const taxSwitch = document.getElementById("taxSwitch");
  if (taxSwitch) {
    taxSwitch.addEventListener("change", function () {
      const isChecked = this.checked;
      const gstBadges = document.querySelectorAll(".gst-badge");
      const priceElements = document.querySelectorAll(".card-price-val");

      gstBadges.forEach(badge => {
        badge.style.display = isChecked ? "inline-block" : "none";
      });

      priceElements.forEach(priceEl => {
        const basePrice = parseFloat(priceEl.getAttribute("data-base-price")) || 0;
        if (isChecked) {
          const totalWithGst = Math.round(basePrice * 1.18);
          priceEl.innerHTML = `&#8377; ${totalWithGst.toLocaleString("en-IN")}`;
        } else {
          priceEl.innerHTML = `&#8377; ${basePrice.toLocaleString("en-IN")}`;
        }
      });
    });
  }

  // 4. Client-side Search & Category Filtering on Listings
  const searchInputs = [
    document.getElementById("navSearchInput"),
    document.getElementById("mobileNavSearchInput")
  ];
  const filterPills = document.querySelectorAll(".filter-pill");
  const listingItems = document.querySelectorAll(".listing-item");
  const noResultsState = document.getElementById("noResultsState");
  let activeCategory = "all";

  function filterListings() {
    const query = (searchInputs[0]?.value || searchInputs[1]?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    listingItems.forEach(item => {
      const title = item.getAttribute("data-title") || "";
      const location = item.getAttribute("data-location") || "";
      const country = item.getAttribute("data-country") || "";

      const matchesSearch = !query || title.includes(query) || location.includes(query) || country.includes(query);
      
      // Category match (if specific categories are mapped or show all)
      let matchesCategory = true;
      if (activeCategory !== "all") {
        matchesCategory = title.includes(activeCategory) || location.includes(activeCategory) || country.includes(activeCategory);
      }

      if (matchesSearch && (activeCategory === "all" || matchesCategory)) {
        item.style.display = "";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (noResultsState) {
      if (visibleCount === 0 && listingItems.length > 0) {
        noResultsState.classList.remove("d-none");
      } else {
        noResultsState.classList.add("d-none");
      }
    }
  }

  // Search input listeners
  searchInputs.forEach(input => {
    if (input) {
      input.addEventListener("input", filterListings);
    }
  });

  // Category pill click handlers
  filterPills.forEach(pill => {
    pill.addEventListener("click", function () {
      filterPills.forEach(p => p.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.getAttribute("data-category") || "all";
      filterListings();
    });
  });

  // Global reset helper
  window.resetFilters = function () {
    searchInputs.forEach(input => {
      if (input) input.value = "";
    });
    filterPills.forEach(p => p.classList.remove("active"));
    const firstPill = document.querySelector(".filter-pill");
    if (firstPill) firstPill.classList.add("active");
    activeCategory = "all";
    filterListings();
  };

  // Global heart toggle helper
  window.toggleFavorite = function (btn, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const icon = btn.querySelector("i");
    if (icon) {
      const isFav = icon.classList.contains("fa-solid");
      if (isFav) {
        // Unfavorite → back to white outline
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        icon.style.color = "";        // CSS takes over: white via .card-favorite-btn i
        btn.classList.remove("active");
      } else {
        // Favourite → solid red
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        icon.style.color = "#FF385C";
        btn.classList.add("active");
      }
    }
  };

})();