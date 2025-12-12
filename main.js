// ====== Helpers ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ====== Year in footer ======
$("#year").textContent = new Date().getFullYear();

// ====== Mobile nav toggle ======
const navToggle = $("#navToggle");
const navList = $("#navList");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close nav when a link is clicked (mobile UX)
  navList.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ====== Theme toggle (interactivity) ======
const themeToggle = $("#themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const isDark = theme !== "light";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "Toggle Light Mode" : "Toggle Dark Mode";
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "dark");

themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

// ====== Project filtering (interactivity) ======
const chips = $$(".chip");
const projects = $$(".project");
const noResults = $("#noResults");

function setActiveChip(clicked) {
  chips.forEach((c) => c.classList.remove("is-active"));
  clicked.classList.add("is-active");
}

function filterProjects(tag) {
  let visibleCount = 0;

  projects.forEach((p) => {
    const tags = (p.getAttribute("data-tags") || "").split(/\s+/);
    const show = tag === "all" || tags.includes(tag);
    p.style.display = show ? "" : "none";
    if (show) visibleCount++;
  });

  if (noResults) {
    noResults.classList.toggle("hidden", visibleCount !== 0);
  }
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    setActiveChip(chip);
    filterProjects(chip.dataset.filter);
  });
});

// ====== Back to top button (interactivity) ======
const backToTop = $("#backToTop");

function updateBackToTop() {
  const show = window.scrollY > 500;
  backToTop?.classList.toggle("show", show);
}

window.addEventListener("scroll", updateBackToTop);
updateBackToTop();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ====== Contact form validation (interactivity) ======
const form = $("#contactForm");

function setError(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  // Reset errors
  setError("#nameError", "");
  setError("#emailError", "");
  setError("#messageError", "");
  $("#formStatus").textContent = "";

  let ok = true;

  if (name.length < 2) {
    setError("#nameError", "Please enter your name (at least 2 characters).");
    ok = false;
  }

  if (!isValidEmail(email)) {
    setError("#emailError", "Please enter a valid email address.");
    ok = false;
  }

  if (message.length < 10) {
    setError("#messageError", "Please write a message (at least 10 characters).");
    ok = false;
  }

  if (!ok) return;

  // Demo success (no backend)
  $("#formStatus").textContent = "Message sent (demo). Thanks!";
  form.reset();
});
