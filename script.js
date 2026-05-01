/* ─── Theme ─────────────────────────────────────────────── */
const toggle = document.querySelector("[data-nav-toggle]");
const header = document.querySelector("[data-header]");
const navItems = document.querySelectorAll("[data-nav] a");
const themeToggle = document.querySelector("[data-theme-toggle]");

const themeStorageKey = "reenz-theme-v2";
const savedTheme = localStorage.getItem(themeStorageKey);
const initialTheme = savedTheme || "dark";

function setTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  }
}

setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  });
}

/* ─── Mobile Nav ─────────────────────────────────────────── */
if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* ─── Scroll: Header shadow + Back-to-top ───────────────── */
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 60;
  header?.classList.toggle("is-scrolled", scrolled);

  if (backToTop) {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }
}, { passive: true });

/* ─── Scroll Reveal Animations ───────────────────────────── */
const revealElements = document.querySelectorAll(
  ".menu-card, .image-story figure, .story-media, .carousel-wrapper, .location-card, .section-heading, .intro-copy, .brows-text"
);

const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("active");
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealElements.forEach((el, index) => {
  el.classList.add("reveal");

  // Stagger items in a grid
  if (
    el.closest(".menu-grid") ||
    el.closest(".quote-grid") ||
    el.closest(".location-card") ||
    el.closest(".image-story")
  ) {
    el.style.transitionDelay = `${(index % 3) * 0.15}s`;
  }

  revealObserver.observe(el);
});

/* ─── Skeleton Shimmer Loaders ───────────────────────────── */
// Apply shimmer to all lazy images; remove once loaded
document.querySelectorAll("img[loading='lazy']").forEach(img => {
  img.classList.add("img-skeleton");
  if (img.complete && img.naturalWidth > 0) {
    img.classList.remove("img-skeleton");
  } else {
    img.addEventListener("load", () => img.classList.remove("img-skeleton"), { once: true });
    img.addEventListener("error", () => img.classList.remove("img-skeleton"), { once: true });
  }
});

/* ─── Custom Cursor (pointer devices only) ───────────────── */
const cursor = document.querySelector(".custom-cursor");

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const hoverElements = document.querySelectorAll(
    "a, button, input, .menu-card, .location-card, .image-story figure, .carousel-slide"
  );

  hoverElements.forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });
} else if (cursor) {
  cursor.style.display = "none";
}

/* ─── Modal Logic (with focus trapping + Escape key) ─────── */
const modalOpens = document.querySelectorAll("[data-modal-open]");
const modalCloses = document.querySelectorAll("[data-modal-close]");

// Focusable selectors for trap
const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";

  // Focus first focusable element inside modal
  const firstFocusable = modal.querySelector(FOCUSABLE);
  firstFocusable?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalOpens.forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById(btn.getAttribute("data-modal-open"));
    openModal(modal);
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});

modalCloses.forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".article-modal"));
  });
});

// Escape key closes active modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".article-modal.is-open");
    if (openModal) closeModal(openModal);
  }
});

// Focus trap inside open modal
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const activeModal = document.querySelector(".article-modal.is-open");
  if (!activeModal) return;

  const focusableEls = Array.from(activeModal.querySelectorAll(FOCUSABLE));
  if (!focusableEls.length) return;

  const first = focusableEls[0];
  const last = focusableEls[focusableEls.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ─── Autoscrolling Testimonials Carousel ────────────────── */
const carouselTrack = document.querySelector(".carousel-track");

if (carouselTrack) {
  const originalSlides = Array.from(carouselTrack.children);
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.style.opacity = "1";
    clone.style.transform = "translateY(0)";
    carouselTrack.appendChild(clone);
  });

  originalSlides.forEach(slide => {
    slide.style.opacity = "1";
    slide.style.transform = "translateY(0)";
  });

  carouselTrack.style.scrollSnapType = "none";
  carouselTrack.style.scrollBehavior = "auto";
  carouselTrack.querySelectorAll(".carousel-slide").forEach(
    slide => (slide.style.scrollSnapAlign = "none")
  );

  let isHovered = false;
  let currentScroll = 0;
  const scrollSpeed = 0.6;

  carouselTrack.addEventListener("mouseenter", () => (isHovered = true));
  carouselTrack.addEventListener("mouseleave", () => (isHovered = false));

  function smoothScroll() {
    if (!isHovered) {
      currentScroll += scrollSpeed;
      if (currentScroll >= carouselTrack.scrollWidth / 2) {
        currentScroll = 0;
      }
      carouselTrack.scrollLeft = currentScroll;
    } else {
      currentScroll = carouselTrack.scrollLeft;
    }
    requestAnimationFrame(smoothScroll);
  }

  requestAnimationFrame(smoothScroll);
}
