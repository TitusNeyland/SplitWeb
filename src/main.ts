import "./kilo.css";

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

const nav = document.getElementById("mainNav");
const darkSections = [".hero", ".features", ".news-section", ".final-cta"];
const lightSections = [".how", ".categories", ".showcase", ".creators", ".faq"];

function updateNavColor() {
  if (!nav) return;
  const navHeight = 60;
  const checkY = navHeight;
  const allSections = [...darkSections, ...lightSections];
  let currentMode: "on-dark" | "on-light" = "on-dark";

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

if (nav) {
  window.addEventListener("scroll", updateNavColor, { passive: true });
  window.addEventListener("resize", updateNavColor);
  updateNavColor();
}
