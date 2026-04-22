const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setNavForScrollPosition() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const y = 40;
  const darkSelectors = [".scroll-hero", "#features", "#download", "footer"];
  const overDark = darkSelectors.some((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return y >= r.top && y <= r.bottom;
  });
  nav.classList.toggle("nav--on-light", !overDark);
}

function updateHeroParallax() {
  if (!document.documentElement.classList.contains("scroll-effects")) {
    return;
  }
  const root = document.querySelector(".scroll-hero");
  const content = document.querySelector(".scroll-hero .hero-content");
  const phone = document.querySelector(".scroll-hero .phone-stage");
  if (!root) return;
  if (!content || !phone) return;

  const r = root.getBoundingClientRect();
  if (r.bottom < -32) {
    root.style.setProperty("--hero-s", "0");
    content.style.removeProperty("transform");
    phone.style.removeProperty("transform");
    return;
  }
  if (r.top > window.innerHeight) {
    return;
  }

  const t = r.top > 0 ? 0 : Math.min(1, -r.top / (r.height * 0.72));
  const th = t.toFixed(4);
  root.style.setProperty("--hero-s", th);
  const tyText = t * 36;
  const sc = 1 - t * 0.04;
  const tyPhone = t * 56;
  content.style.transform = `translate3d(0, ${tyText.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;
  phone.style.transform = `translate3d(0, ${tyPhone.toFixed(2)}px, 0)`;
}

let scrollRaf = false;
function onScroll() {
  if (scrollRaf) return;
  scrollRaf = true;
  requestAnimationFrame(() => {
    scrollRaf = false;
    setNavForScrollPosition();
    updateHeroParallax();
  });
}

export function initScrollAnimations() {
  setNavForScrollPosition();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    setNavForScrollPosition();
    updateHeroParallax();
  });

  if (prefersReduced()) {
    return;
  }

  document.documentElement.classList.add("scroll-effects");
  updateHeroParallax();

  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
        }
      }
    },
    { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
  );
  document.querySelectorAll(".section-reveal").forEach((el) => obs.observe(el));
}
