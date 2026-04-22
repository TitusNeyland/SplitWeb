import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * GitHub project pages need a subpath, e.g. /SplitWeb/
 * (must start and end with /). Local `npm run dev` uses the default /.
 * CI sets BASE_PATH from the repository name in .github/workflows/deploy-pages.yml
 */
const raw = process.env.BASE_PATH;
const base =
  raw == null || raw === ""
    ? "/"
    : raw.startsWith("/")
      ? raw.endsWith("/")
        ? raw
        : `${raw}/`
      : `/${raw.endsWith("/") ? raw : `${raw}/`}`;

export default defineConfig({
  base,
  root: ".",
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
        help: resolve(__dirname, "help.html"),
      },
    },
  },
});
