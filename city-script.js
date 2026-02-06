/* ===================================================================
   BAMA BUSINESSES – City Page Interactions
   =================================================================== */

(function () {
  "use strict";

  // ---- DOM refs ----
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const filterCategory = document.getElementById("filter-category");
  const clearBtn = document.getElementById("clear-filters");
  const resultsCount = document.getElementById("results-count");
  const cards = Array.from(document.querySelectorAll(".business-card"));
  const sections = Array.from(document.querySelectorAll(".category-section"));

  // ---- State ----
  let currentCategory = "all";
  let currentSearch = "";

  // ---- Helpers ----
  function normalize(str) {
    return str.toLowerCase().trim();
  }

  function cardMatchesSearch(card, term) {
    if (!term) return true;
    var text = normalize(card.textContent);
    return text.indexOf(term) !== -1;
  }

  // ---- Core filter logic ----
  function applyFilters() {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var catMatch =
        currentCategory === "all" ||
        card.dataset.category === currentCategory;
      var searchMatch = cardMatchesSearch(card, currentSearch);
      var visible = catMatch && searchMatch;

      card.classList.toggle("hidden", !visible);
      if (visible) visibleCount++;
    });

    // Hide category sections that have zero visible cards
    sections.forEach(function (section) {
      var hasVisible = section.querySelector(".business-card:not(.hidden)");
      section.classList.toggle("hidden", !hasVisible);
    });

    // Update counter
    updateResultsCount(visibleCount);

    // Toggle no-results message
    var noResults = document.querySelector(".no-results");
    if (noResults) {
      noResults.classList.toggle("visible", visibleCount === 0);
    }
  }

  function updateResultsCount(count) {
    if (count === cards.length) {
      resultsCount.textContent = "Showing all " + count + " businesses";
    } else if (count === 0) {
      resultsCount.textContent = "No businesses found";
    } else {
      resultsCount.textContent =
        "Showing " + count + " of " + cards.length + " businesses";
    }
  }

  // ---- Event listeners ----
  filterCategory.addEventListener("change", function () {
    currentCategory = this.value;
    applyFilters();
  });

  searchInput.addEventListener("input", function () {
    currentSearch = normalize(this.value);
    applyFilters();
  });

  searchBtn.addEventListener("click", function () {
    currentSearch = normalize(searchInput.value);
    applyFilters();
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      currentSearch = normalize(searchInput.value);
      applyFilters();
    }
  });

  clearBtn.addEventListener("click", function () {
    filterCategory.value = "all";
    searchInput.value = "";
    currentCategory = "all";
    currentSearch = "";
    applyFilters();
  });

  // Footer category links
  document.querySelectorAll("[data-cat-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var cat = this.getAttribute("data-cat-link");
      filterCategory.value = cat;
      currentCategory = cat;
      applyFilters();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // ---- Back-to-top button ----
  var topBtn = document.createElement("button");
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = "&#8593;";
  document.body.appendChild(topBtn);

  window.addEventListener("scroll", function () {
    topBtn.classList.toggle("visible", window.scrollY > 400);
  });

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---- No-results placeholder ----
  var noResultsDiv = document.createElement("div");
  noResultsDiv.className = "no-results";
  noResultsDiv.textContent =
    "No businesses match your filters. Try adjusting your search or selections.";
  document.querySelector(".directory .container").appendChild(noResultsDiv);
})();
