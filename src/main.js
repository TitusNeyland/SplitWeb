import "./style.css";
import { hydrateServiceIcons } from "./serviceIcons.js";

hydrateServiceIcons();

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
  const darkSections = [".hero", ".trust-section", ".final-cta", ".legal-hero", ".help-hero", ".help-contact"];
  const lightSections = [".social-proof", ".problem", ".how", ".feature-deep", ".pricing", ".creators", ".faq", ".legal-shell", ".help-shell"];

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

// Legal / privacy page: active-section highlighting in the sticky TOC,
// plus a mobile toggle to collapse the contents list.
// Runs regardless of motion preferences; null-guarded so it's a no-op
// on pages without a .legal-toc element (like the marketing homepage).
const toc = document.querySelector(".legal-toc");
if (toc) {
  const tocLinks = Array.from(toc.querySelectorAll(".legal-toc-list a"));
  const sectionsById = new Map();
  tocLinks.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) return;
    const section = document.getElementById(id);
    if (section) sectionsById.set(section, link);
  });

  if (sectionsById.size > 0 && "IntersectionObserver" in window) {
    const tocIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionsById.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      {
        // Trigger when a section crosses into the upper portion of the
        // viewport — matches the reader's attention better than center.
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );
    sectionsById.forEach((_link, section) => tocIO.observe(section));
  }

  const tocToggle = toc.querySelector(".legal-toc-toggle");
  if (tocToggle) {
    tocToggle.addEventListener("click", () => {
      const isOpen = toc.classList.toggle("is-open");
      tocToggle.setAttribute("aria-expanded", String(isOpen));
    });
    tocLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 960px)").matches) {
          toc.classList.remove("is-open");
          tocToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
}

// Help center: live search filter across all articles.
// Null-guarded so it's a no-op on pages without the help search input.
const helpSearch = document.getElementById("helpSearch");
if (helpSearch) {
  const clearBtn = document.getElementById("helpSearchClear");
  const emptyState = document.getElementById("helpEmpty");
  const emptyTerm = document.getElementById("helpEmptyTerm");
  const articles = Array.from(document.querySelectorAll(".help-article"));
  const categories = Array.from(document.querySelectorAll(".help-category"));

  // Pre-compute lowercase search text for each article to keep filtering fast
  // even with many articles — avoids re-reading the DOM on every keystroke.
  const index = articles.map((article) => ({
    article,
    text: (article.textContent || "").toLowerCase(),
    // Remember whether the article was manually opened before a search
    // started, so we can restore that state when the search is cleared.
    wasOpen: article.open,
  }));

  // Track which articles the search has opened vs which the user opened;
  // clearing the search should only close search-opened ones.
  const searchOpened = new WeakSet();

  const applyFilter = (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();

    if (!query) {
      // Reset to initial state: show everything, close any articles we
      // forced open because of a match, leave user-opened ones alone.
      articles.forEach((article) => {
        article.hidden = false;
        article.classList.remove("is-match");
        if (searchOpened.has(article)) {
          article.open = false;
          searchOpened.delete(article);
        }
      });
      categories.forEach((cat) => { cat.hidden = false; });
      emptyState.hidden = true;
      clearBtn.hidden = true;
      return;
    }

    clearBtn.hidden = false;

    let anyMatch = false;

    index.forEach(({ article, text }) => {
      const matches = text.includes(query);
      article.hidden = !matches;
      article.classList.toggle("is-match", matches);
      if (matches) {
        anyMatch = true;
        // Auto-open matching articles so users can scan answers without
        // another click, but remember we did so for later cleanup.
        if (!article.open) {
          article.open = true;
          searchOpened.add(article);
        }
      } else if (searchOpened.has(article)) {
        article.open = false;
        searchOpened.delete(article);
      }
    });

    // Hide categories that now have no visible articles.
    categories.forEach((cat) => {
      const visibleArticles = cat.querySelectorAll(".help-article:not([hidden])");
      cat.hidden = visibleArticles.length === 0;
    });

    emptyTerm.textContent = rawQuery.trim();
    emptyState.hidden = anyMatch;
  };

  // Simple debounce so we don't thrash on every keystroke in very long lists.
  let debounce;
  helpSearch.addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => applyFilter(e.target.value), 60);
  });

  clearBtn.addEventListener("click", () => {
    helpSearch.value = "";
    applyFilter("");
    helpSearch.focus();
  });

  // Pressing Escape inside the search clears it.
  helpSearch.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpSearch.value) {
      e.preventDefault();
      helpSearch.value = "";
      applyFilter("");
    }
  });

  // Support deep-linking to a specific article via URL hash (e.g. /help#getting-started).
  // Scroll the target category into view after initial paint.
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
}

// Back-to-top button — appears once the user has scrolled past
// one viewport height; smooth-scrolls to the top on click (or
// jumps instantly for users who prefer reduced motion).
(() => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  const threshold = () => Math.max(400, window.innerHeight * 0.6);
  let visible = false;
  let ticking = false;

  const update = () => {
    ticking = false;
    const shouldShow = window.scrollY > threshold();
    if (shouldShow !== visible) {
      visible = shouldShow;
      btn.classList.toggle("visible", shouldShow);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
})();
