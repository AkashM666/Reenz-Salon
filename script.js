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

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.service-card, .image-story figure, .story-media, .carousel-wrapper, .location-card, .section-heading, .intro-copy, .brows-text');

const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.classList.add('active');
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealElements.forEach((el, index) => {
  el.classList.add('reveal');
  
  // Add a slight stagger for items in a grid
  if (el.closest('.service-grid') || el.closest('.quote-grid') || el.closest('.location-card') || el.closest('.image-story')) {
    el.style.transitionDelay = `${(index % 3) * 0.15}s`;
  }
  
  revealObserver.observe(el);
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');

if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverElements = document.querySelectorAll('a, button, input, .service-card, .location-card, .image-story figure, .carousel-slide');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}

// Modal Logic
const modalOpens = document.querySelectorAll('[data-modal-open]');
const modalCloses = document.querySelectorAll('[data-modal-close]');

modalOpens.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal-open');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  });
  
  // Also open on Enter key if focused
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

modalCloses.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.article-modal');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
});

// Autoscrolling Carousel (Smooth & Constant)
const carouselTrack = document.querySelector('.carousel-track');

if (carouselTrack) {
  // Duplicate content carefully without destroying original nodes
  const originalSlides = Array.from(carouselTrack.children);
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    // Make sure cloned slides are visible if they had reveal classes
    clone.style.opacity = '1';
    clone.style.transform = 'translateY(0)';
    carouselTrack.appendChild(clone);
  });
  
  // Make sure original slides are visible too just in case
  originalSlides.forEach(slide => {
    slide.style.opacity = '1';
    slide.style.transform = 'translateY(0)';
  });
  
  // Disable CSS scroll snapping and smooth behavior so continuous scroll isn't jerky or frozen
  carouselTrack.style.scrollSnapType = 'none';
  carouselTrack.style.scrollBehavior = 'auto';
  const slides = carouselTrack.querySelectorAll('.carousel-slide');
  slides.forEach(slide => slide.style.scrollSnapAlign = 'none');
  
  let isHovered = false;
  let currentScroll = 0;
  const scrollSpeed = 0.6; // Adjust this value to change speed
  
  carouselTrack.addEventListener('mouseenter', () => isHovered = true);
  carouselTrack.addEventListener('mouseleave', () => isHovered = false);
  
  function smoothScroll() {
    if (!isHovered) {
      currentScroll += scrollSpeed;
      // If we've scrolled past the first set of items, seamlessly jump back to the start
      if (currentScroll >= carouselTrack.scrollWidth / 2) {
        currentScroll = 0;
      }
      carouselTrack.scrollLeft = currentScroll;
    } else {
      // Keep track of manual scrolling when hovered
      currentScroll = carouselTrack.scrollLeft;
    }
    requestAnimationFrame(smoothScroll);
  }
  
  requestAnimationFrame(smoothScroll);
}
