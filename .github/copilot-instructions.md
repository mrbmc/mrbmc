Purpose
-------
This file orients AI coding agents to the `mrbmc` site repo so they can be immediately productive: how the site is built, where source lives, and the concrete commands and conventions to follow. Only include changes that are discoverable in the repo.

**Big Picture**
- **Site generator:** Eleventy. Source content lives in `src/` and the generated site is `www/` (see `eleventy.config.js`).
- **Asset pipelines:** Gulp orchestrates CSS and JS transforms; `gulpfile.js` defines the primary build steps. Some JS is bundled programmatically using Rollup inside the gulp tasks; an alternate `rollup.config.js` exists but the canonical runtime bundling is in `gulpfile.js` (`bundleJS` uses `paths.jsbundles`).
- **Legacy/static build script:** `build.sh` performs an alternate build+deploy path (uglify + rsync + eleventy). Both `gulp` and `build.sh` are used in the repo — prefer `gulp` for automated dev workflows and `build.sh` for manual or CI scripts that mimic the author's historical flow.

**Local development (quick commands)**
- **Install:** `npm install` (project uses Node dev deps listed in `package.json`).
- **Serve and watch everything:** `npm start` (runs watchers in parallel). This runs `watch:eleventy` (Eleventy incremental serve) + `watch:sass`.
- **Eleventy only:** `npm run watch:eleventy` -> `npx @11ty/eleventy --ignore-initial --incremental --serve` (dev server configured to port `9999` in `eleventy.config.js`).
- **Sass only:** `npm run watch:sass` -> `sass --watch src/assets/scss:www/css`.
- **Build (gulp):** `npm run build` (this runs `gulp build --verbose`). For production builds that toggle minification/behavior pass `--prod` to gulp: `npm run build -- --prod` (or `gulp build --prod`).
- **Deploy (author's script):** `npm run deploy` calls `./build.sh deploy` which syncs `www/` to S3 and invalidates CloudFront (see `build.sh`).

**What `gulp build` does** (see `gulpfile.js` `exports.build`)
- Runs `transpileJS` (uglify), `bundleJS` (Rollup over `paths.jsbundles`), `transpileCSS` (Sass -> `www/css`), `buildHTML` (invokes Eleventy when in production), `syncAssets` (rsync-like asset sync), `syncBackups`, then cleanup and link-checks. Many tasks are gated by an `isProduction` flag (`--prod`).

**Source layout and conventions**
- **Content & templates:** `src/` — markdown and Nunjucks/Liquid templates. Eleventy input/output set in `eleventy.config.js` (`input: "src"`, `output: "www"`, `includes: "_includes"`, `layouts: "_layouts"`).
- **Styles:** `src/assets/scss/` -> watched and written to `www/css/` by Sass/gulp.
- **JS:** `src/assets/js/` (per-bundle inputs referenced in `gulpfile.js` `paths.jsbundles`). There is also legacy `src/_js/` used by `build.sh` and `rollup.config.js`.
- **Images:** `src/images/` — Eleventy plugin produces optimized images into `www/images/optimized/` (see `eleventy.config.js`). Passthrough copies exist for favicons and robots.
- **Backups & historical content:** `backup/` is synced into `www/` during build; treat that as content the site intentionally exposes.

**Patterns agents should follow when editing the repo**
- **Edit `src/` for content or template changes.** Non-source changes should avoid directly editing `www/` (it's generated output).
- **When modifying the JS pipeline, prefer `gulpfile.js` patterns.** `bundleJS` uses Rollup programmatically and refers to `paths.jsbundles` — change that list rather than adding a separate bundler unless necessary.
- **Use `--prod` to test production-only behavior.** Many tasks (HTML build, asset sync, link-checking) only run when `isProduction` is true.
- **Be conservative with deployment constants.** `gulpfile.js` and `build.sh` contain S3 and CloudFront identifiers (`S3BUCKET`, `CFDISTRO`, etc.). Don't alter them unless making an explicit deployment change.

**Integration & external dependencies**
- **AWS S3 + CloudFront:** Deploy and metrics use S3 buckets and CloudFront invalidation (see `build.sh` and `gulpfile.js`).
- **GeoIP / metrics:** `metrics/metrics.sh` downloads logs from S3, cleans, and runs `goaccess` to generate metrics HTML. The `package.json` includes a `geolite2` config — treat that data as sensitive.
- **Image optimization:** Uses `@11ty/eleventy-img` plugin configured in `eleventy.config.js` (outputs to `www/images/optimized/`).

**Examples (explicit snippets)**
- To build a production site (minified JS/CSS, Eleventy run, and asset sync):
  - `npm run build -- --prod --verbose`
- To run Eleventy dev server with incremental builds:
  - `npm run watch:eleventy` (or `npx @11ty/eleventy --ignore-initial --incremental --serve`)

**Files to inspect first when debugging or changing behavior**
- `gulpfile.js` — primary build pipeline and where JS/CSS/asset tasks are defined.
- `eleventy.config.js` — templating, collections, image optimization, dev server settings.
- `build.sh` — alternate build and deploy script (legacy/manual flows).
- `rollup.config.js` and `src/_js/` — legacy rollup/uglify based bundling used by `build.sh`.
- `metrics/metrics.sh` — logs download/clean/analysis workflow (uses `goaccess`).

If anything above is unclear or you'd like this shortened, expanded with examples (PR template snippets, recommended tests, or CI steps), tell me which section to iterate on and I will update the file.
