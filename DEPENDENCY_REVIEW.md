# Dependency Review

Date reviewed: 2026-06-29

Environment used:

- Node: v24.18.0
- npm: 11.16.0
- npm cache: project-local `.npm-cache` was used because the Windows user npm cache was not writable from Codex.

## Commands Run

```bash
npm audit
npm outdated
npm run check
```

`npm run check` now passes:

- 5 test files passed.
- 12 tests passed.
- Production build completed with Vite 8.1.0.

Build warnings remain from dependencies/tooling:

- `lottie-web` uses direct `eval`.
- The main app chunk is larger than 500 kB.
- Some dynamic imports are ineffective because the same modules are also statically imported.

## Audit Summary

`npm audit` initially reported 11 vulnerabilities. After the dependency alignment and lockfile refresh, npm reports 0 vulnerabilities.

Changes made to restore a clean install/build state:

- `vite` is on 8.1.0.
- `vitest` is on 4.1.9.
- `@vitejs/plugin-react` is aligned to the Vite 8-compatible 6.x line.
- `esbuild` is installed explicitly because Vite 8 no longer bundles it for the current esbuild-based minify/transpile path.
- `vite.config.js` uses `es2020` instead of the removed `modules` target.

## Outdated Direct Dependencies

Notable direct dependencies with newer versions at review time:

- `react-router-dom`: patch/minor updates available.
- `@tailwindcss/typography`: patch update available.
- `postcss`: patch updates available.
- `autoprefixer`: patch/minor updates available.
- `framer-motion`: patch/minor updates available.
- `tailwind-merge`: patch/minor updates available.
- Tauri packages have patch/minor updates available.
- Major upgrades remain available for React, React DOM, Tailwind, ESLint, lucide-react, pako, and Vercel Analytics.

## Decisions

- Vite and Vitest are now on current majors because the check path was unblocked and the audit/lockfile state had already moved forward.
- React remains on 18. React 19 migration is deferred until after `v0.1.0-byok-alpha` because this milestone prioritizes BYOK functionality, storage safety, and tests.
- React Router remains at the current locked version because audit is now clean and routing behavior should be tested deliberately before changing it further.
- Tauri is kept but quarantined as experimental. This fork remains browser-first for the current milestone, and desktop packaging is unsupported for `v0.1.0-byok-alpha`.

## Tauri Status

Tauri dependencies and the `npm run tauri` script remain in place only to avoid unnecessary dependency churn. No Tauri implementation is added in this phase.

Desktop packaging is experimental and unsupported for `v0.1.0-byok-alpha`. Browser development, BYOK behavior, storage safety, import/export, and tests are the supported path for this milestone.

## Next Safe Order

1. Keep `npm run check` green before applying more dependency changes.
2. Consider safe patch/minor direct dependency updates only in small batches.
3. Re-run `npm audit`, `npm outdated`, and `npm run check` after each batch.
4. Defer React 19 migration to a dedicated future phase.
5. Keep Tauri quarantined unless desktop packaging becomes a deliberate project goal.
