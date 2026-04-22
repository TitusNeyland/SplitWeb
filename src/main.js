import "./style.css";

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });
});

// Billing toggle
const toggleOptions = document.querySelectorAll(".bt-option");
const priceAmount = document.querySelector(".price-card.featured .price-amount");
const pricePeriod = document.querySelector(".price-card.featured .price-period");
toggleOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    toggleOptions.forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");
    const period = opt.dataset.period;
    if (!priceAmount || !pricePeriod) return;
    if (period === "annual") {
      priceAmount.textContent = priceAmount.dataset.annual;
      pricePeriod.textContent = pricePeriod.dataset.annualLabel;
    } else {
      priceAmount.textContent = priceAmount.dataset.monthly;
      pricePeriod.textContent = pricePeriod.dataset.monthlyLabel;
    }
  });
});

// Simple QR code pattern (decorative — real QR generated server-side for production)
const qr = document.getElementById("qr");
if (qr) {
  const pattern = [
    1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1,
    1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
    0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0,
  ];
  pattern.forEach((px) => {
    const d = document.createElement("div");
    d.className = "qr-pixel" + (px ? "" : " empty");
    qr.appendChild(d);
  });
}

// Nav color detection
const nav = document.getElementById("mainNav");
if (nav) {
  const darkSections = [".hero", ".trust-section", ".final-cta"];
  const lightSections = [".social-proof", ".problem", ".how", ".feature-deep", ".pricing", ".creators", ".faq"];

  function updateNavColor() {
    const checkY = 60;
    const allSections = [...darkSections, ...lightSections];
    let currentMode = "on-dark";

    for (const selector of allSections) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= checkY && rect.bottom > checkY) {
        currentMode = darkSections.includes(selector) ? "on-dark" : "on-light";
        break;
      }
    }

    nav.classList.remove("on-dark", "on-light");
    nav.classList.add(currentMode);
  }

  window.addEventListener("scroll", updateNavColor, { passive: true });
  window.addEventListener("resize", updateNavColor);
  updateNavColor();
}

// Scroll reveal animations (Apple-style)
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  // Release GPU layers (`will-change`) after the animation settles.
  // This keeps mobile scrolling smooth: scroll perf is about how many
  // composited layers the browser has to rasterize per frame.
  const clearWillChange = (el) => {
    const onEnd = (e) => {
      if (e.target !== el) return;
      el.classList.add("reveal-done");
      el.removeEventListener("transitionend", onEnd);
    };
    el.addEventListener("transitionend", onEnd);
    // Safety: force cleanup after a generous timeout in case transitionend
    // never fires (e.g. element was display:none'd before finishing).
    setTimeout(() => el.classList.add("reveal-done"), 2000);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        // rAF ensures the class is applied on the next paint frame — avoids
        // layout thrash when many elements enter the viewport at once (common
        // on phones because the viewport is short and hero+problem reveal
        // nearly simultaneously on first load).
        requestAnimationFrame(() => {
          el.classList.add("in-view");
          clearWillChange(el);
        });
        io.unobserve(el);
      }
    },
    {
      // Slightly earlier trigger on mobile so reveals happen in-flow rather
      // than feeling "late" on short viewports.
      threshold: isSmallScreen ? 0.05 : 0.12,
      rootMargin: isSmallScreen ? "0px 0px -4% 0px" : "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((el) => io.observe(el));

  // Parallax on the floating phone — desktop only. Scroll-tied transforms
  // are a known jank source on iOS Safari (momentum scroll) and on
  // low-end Android devices, so we skip it for touch + narrow screens.
  const phoneStage = document.querySelector(".phone-stage");
  const hero = document.querySelector(".hero");
  if (phoneStage && hero && !isTouchDevice && !isSmallScreen) {
    let ticking = false;
    const updatePhoneParallax = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const offset = scrolled * 0.12;
      phoneStage.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updatePhoneParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
}
