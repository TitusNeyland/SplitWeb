/**
 * Service icon system for the Kilo marketing site.
 *
 * Web counterpart of the mobile app's ServiceIcon component
 * (app/components/brand/ServiceIcon.tsx). Uses generic glyphs
 * (not brand logos) — matches the app visually while avoiding
 * trademark issues.
 *
 * Usage:
 *   <div class="service-icon" data-service="Netflix Premium">N</div>
 *
 * On hydration we set the background color, pick a contrasting
 * glyph color, and replace the letter-mark fallback with the
 * SVG glyph. The letter in the markup is a no-JS fallback.
 */

const GLYPHS = {
  "play-triangle": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M9 6.5 L9 17.5 L18 12 Z"/></svg>`,

  "music": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13.5a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4.5" height="7" rx="1.4" fill="currentColor" stroke="none"/><rect x="16.5" y="13" width="4.5" height="7" rx="1.4" fill="currentColor" stroke="none"/></svg>`,

  "gamepad": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/><path d="M6 11h4M8 9v4"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="10" r="1" fill="currentColor" stroke="none"/></svg>`,

  "tv-play": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="11.5" rx="1.6"/><path d="M9.5 9.2 L9.5 14.8 L14.8 12 Z" fill="currentColor" stroke="none"/><path d="M8 19.5h8"/></svg>`,

  "tv-screen": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="10" rx="1.3"/><path d="M10 17.5 h4"/></svg>`,

  "tv-panel": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="11.5" rx="2"/><rect x="6.5" y="7.7" width="11" height="6" rx="0.9" fill="currentColor" fill-opacity="0.35" stroke="none"/><path d="M9 19.5h6"/></svg>`,

  "cloud": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 17H7.5a4 4 0 0 1-1.2-7.8 5.2 5.2 0 0 1 10.3-0.1A3.3 3.3 0 0 1 21 12.5a4.5 4.5 0 0 1-3.5 4.5z"/></svg>`,

  "brain": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5a3 3 0 0 0-3 3 2.8 2.8 0 0 0-2.5 2.8A2.9 2.9 0 0 0 4.8 13a2.7 2.7 0 0 0-0.8 2 3 3 0 0 0 3.3 3A2.5 2.5 0 0 0 12 19V6A2.5 2.5 0 0 0 9 4.5zm6 0A2.5 2.5 0 0 0 12 7v12a2.5 2.5 0 0 0 4.7 1.5 3 3 0 0 0 3.3-3c0-0.76-0.28-1.45-0.75-2A2.9 2.9 0 0 0 20.5 10.3 2.8 2.8 0 0 0 18 7.5a3 3 0 0 0-3-3z"/></svg>`,

  "cart": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3" fill="currentColor"/><circle cx="17" cy="20" r="1.3" fill="currentColor"/><path d="M3 4h2.5l2.1 10.2a1.7 1.7 0 0 0 1.7 1.3h8a1.7 1.7 0 0 0 1.65-1.3L20.8 8.5H6.5"/></svg>`,

  "dumbbell": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>`,

  "phone": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="3" width="11" height="18" rx="2.5"/><path d="M10.5 18h3"/></svg>`,

  "box-open": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" stroke-linecap="round"><path d="M12 4.5 L19 8.2 L12 11.9 L5 8.2 Z"/><path d="M5 8.2 L12 12.5 L19 8.2"/><path d="M5.2 8.5 V14.8 L12 18.5 L18.8 14.8 V8.5"/><path d="M12 12.5 V18.5"/></svg>`,

  "grid": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="4.5" y="4.5" width="6.3" height="6.3" rx="1"/><rect x="13.2" y="4.5" width="6.3" height="6.3" rx="1"/><rect x="4.5" y="13.2" width="6.3" height="6.3" rx="1"/><rect x="13.2" y="13.2" width="6.3" height="6.3" rx="1"/></svg>`,

  "brush": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 17.8 L10.2 10.5 L12.8 12.2 L9.2 18.5 H7.2 Z" fill="currentColor"/><path d="M11.5 9.2 C13 7.5 15.8 7.8 17.2 9.8"/></svg>`,

  "tree": `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L6 11 H8.5 L5 15.5 H8 L4 20.5 H20 L16 15.5 H19 L15.5 11 H18 L12 3z"/><path d="M12 20.5 V16.5"/></svg>`,
};

/**
 * Catalog of known services. Keep names canonical; lookups fall
 * back to a loose (lowercase, stripped) match.
 */
const CATALOG = {
  // Streaming — video
  "Netflix":              { bg: "#000000", glyph: "tv-screen", fg: "#e50914" },
  "Netflix Premium":      { bg: "#000000", glyph: "tv-screen", fg: "#e50914" },
  "Disney+":              { bg: "#113ccf", glyph: "tv-panel" },
  "Disney Plus":          { bg: "#113ccf", glyph: "tv-panel" },
  "Hulu":                 { bg: "#1ce783", glyph: "tv-screen" },
  "Max":                  { bg: "#0057ff", glyph: "tv-screen" },
  "HBO Max":              { bg: "#9131e1", glyph: "tv-screen" },
  "Paramount+":           { bg: "#0064ff", glyph: "tv-panel" },
  "Apple TV+":            { bg: "#111111", glyph: "tv-play" },
  "Peacock":              { bg: "#0b2440", glyph: "tv-panel" },
  "YouTube Premium":      { bg: "#ff0033", glyph: "play-triangle" },
  "YouTube TV":           { bg: "#ff0033", glyph: "tv-play" },

  // Music
  "Spotify":              { bg: "#1db954", glyph: "music" },
  "Spotify Family":       { bg: "#1db954", glyph: "music" },
  "Apple Music":          { bg: "#fa2e54", glyph: "music" },
  "Tidal":                { bg: "#000000", glyph: "music" },

  // Gaming
  "Xbox Game Pass":       { bg: "#107c10", glyph: "gamepad" },
  "Game Pass":            { bg: "#107c10", glyph: "gamepad" },
  "Xbox":                 { bg: "#107c10", glyph: "gamepad" },
  "PlayStation Plus":     { bg: "#006fcd", glyph: "gamepad" },
  "PS Plus":              { bg: "#006fcd", glyph: "gamepad" },
  "Nintendo Switch Online": { bg: "#e60012", glyph: "gamepad" },

  // AI
  "ChatGPT":              { bg: "#10a37f", glyph: "brain" },
  "ChatGPT Plus":         { bg: "#10a37f", glyph: "brain" },
  "Claude":               { bg: "#c96442", glyph: "brain" },
  "Gemini":               { bg: "#4285f4", glyph: "brain" },

  // Cloud / storage
  "iCloud":               { bg: "#3693f3", glyph: "cloud" },
  "iCloud+":              { bg: "#3693f3", glyph: "cloud" },
  "Google One":           { bg: "#4285f4", glyph: "cloud" },
  "Dropbox":              { bg: "#0061ff", glyph: "cloud" },

  // Commerce / shopping
  "Amazon Prime":         { bg: "#00a8e1", glyph: "cart" },
  "Prime":                { bg: "#00a8e1", glyph: "cart" },

  // Productivity
  "Microsoft 365":        { bg: "#d83b01", glyph: "grid" },
  "Office 365":           { bg: "#d83b01", glyph: "grid" },
  "Google Workspace":     { bg: "#4285f4", glyph: "grid" },
  "Notion":               { bg: "#111111", glyph: "grid" },

  // Creative
  "Adobe Creative Cloud": { bg: "#fa0f00", glyph: "brush" },
  "Adobe CC":             { bg: "#fa0f00", glyph: "brush" },
  "Figma":                { bg: "#0acf83", glyph: "brush" },

  // Other lifestyle
  "Gym":                  { bg: "#f59e0b", glyph: "dumbbell" },
  "The Gym":              { bg: "#f59e0b", glyph: "dumbbell" },
  "Planet Fitness":       { bg: "#6d28d9", glyph: "dumbbell" },
  "Phone Plan":           { bg: "#475569", glyph: "phone" },

  // Community (no clean glyph — falls back to letter mark)
  "Discord Nitro":        { bg: "#5865f2", glyph: null },
  "Discord":              { bg: "#5865f2", glyph: null },
};

const KEY_INDEX = new Map(
  Object.keys(CATALOG).map((k) => [normalize(k), k])
);

function normalize(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+]+/gu, "")
    .trim();
}

/** Very loose fallback — e.g., "Netflix" finds "Netflix Premium". */
function looseLookup(name) {
  const n = normalize(name);
  if (!n) return null;
  if (KEY_INDEX.has(n)) return CATALOG[KEY_INDEX.get(n)];
  // try prefix / substring
  for (const [key, canonical] of KEY_INDEX) {
    if (key.startsWith(n) || n.startsWith(key)) return CATALOG[canonical];
  }
  for (const [key, canonical] of KEY_INDEX) {
    if (key.includes(n) || n.includes(key)) return CATALOG[canonical];
  }
  return null;
}

export function resolveService(name) {
  if (!name) return null;
  return CATALOG[name] || looseLookup(name) || null;
}

/** Pick a glyph color that contrasts with the given hex background. */
export function pickContrast(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return "#ffffff";
  const v = parseInt(m[1], 16);
  const r = (v >> 16) & 0xff;
  const g = (v >> 8) & 0xff;
  const b = v & 0xff;
  // Perceived luminance (Rec. 601) — matches the mobile app's rule
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  return l > 186 ? "#1a0b2e" : "#ffffff";
}

/** Build 1–2 letter fallback from a service name. */
export function letterMark(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleaned[0].toUpperCase();
}

/**
 * Hydrate every `[data-service]` element in `root`: set its brand
 * background, pick a contrasting glyph color, and replace the
 * letter-mark fallback with the SVG glyph (when available).
 */
export function hydrateServiceIcons(root = document) {
  const els = root.querySelectorAll("[data-service]");
  els.forEach((el) => {
    const name = el.dataset.service;
    const resolved = resolveService(name);
    const bg = el.dataset.bg || (resolved && resolved.bg);
    const fg = el.dataset.fg || (resolved && resolved.fg);
    const glyph = resolved && resolved.glyph;
    if (bg) {
      el.style.backgroundColor = bg;
      el.style.color = fg || pickContrast(bg);
    }
    if (glyph && GLYPHS[glyph]) {
      el.innerHTML = GLYPHS[glyph];
      el.classList.add("has-glyph");
    } else if (!el.textContent.trim()) {
      // respect any fallback letters authored in the HTML; only
      // fill in a letter mark if the author left it empty.
      el.textContent = letterMark(name);
    }
    if (!el.hasAttribute("aria-label")) {
      el.setAttribute("aria-label", `${name} icon`);
    }
    if (!el.hasAttribute("role")) el.setAttribute("role", "img");
  });
}
