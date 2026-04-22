import "./style.css";
import { initScrollAnimations } from "./scroll-animations.js";

initScrollAnimations();

function setFaqExpanded(item, expanded) {
  const btn = item.querySelector(".faq-q");
  if (btn) btn.setAttribute("aria-expanded", String(expanded));
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  if (!q) return;
  q.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other === item) return;
      other.classList.remove("open");
      setFaqExpanded(other, false);
    });
    item.classList.toggle("open", willOpen);
    setFaqExpanded(item, willOpen);
  });
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      q.click();
    }
  });
});

const nav = document.querySelector("nav");
const toggle = document.querySelector(".nav-toggle");
if (nav && toggle) {
  const closeNav = () => {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav-open")) closeNav();
  });
}
