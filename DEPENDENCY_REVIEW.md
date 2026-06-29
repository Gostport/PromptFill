# Dependency Review

Date reviewed: 2026-06-29

Environment used:

- Node: v24.18.0
- npm: 11.16.0
- npm cache: project-local `.npm-cache` was used because the Windows user npm cache is not writable in this environment.

## Commands Run

```bash
npm audit
npm outdated
npm run check
```

`npm run check` did not complete in this Codex sandbox. Vitest/Vite failed while esbuild tried to read a parent directory:

```text
Cannot read directory "../../..": Access is denied.
Could not resolve "C:\\Users\\gostp\\Desktop\\Projects\\PromptFill\\vitest.config.js"
```

This is the same local Windows filesystem/ACL limitation observed during Phase 5. Because the check command is blocked, this phase does not apply dependency upgrades.

## Audit Summary

`npm audit` reported 11 vulnerabilities:

- 1 low
- 6 moderate
- 3 high
- 1 critical

Important findings:

- `react-router` / `react-router-dom`: high severity advisories. `npm audit fix` reports a non-force fix is available.
- `vite` / `esbuild`: moderate advisory. `npm audit fix --force` would jump to `vite@8.1.0`, which is a breaking upgrade and is deferred.
- `@babel/core`: arbitrary file read advisory; non-force fix is available.
- `brace-expansion`, `js-yaml`, `postcss`: moderate advisories; non-force fixes are available.

## Outdated Direct Dependencies

Notable direct dependencies with newer versions:

- `react-router-dom`: 7.13.2 current, 7.18.0 wanted/latest.
- `@tailwindcss/typography`: 0.5.19 current, 0.5.20 wanted/latest.
- `postcss`: 8.5.8 current, 8.5.16 wanted/latest.
- `autoprefixer`: 10.4.27 current, 10.5.2 wanted/latest.
- `framer-motion`: 12.38.0 current, 12.42.0 wanted/latest.
- `tailwind-merge`: 3.5.0 current, 3.6.0 wanted/latest.
- Tauri packages have patch/minor updates available.
- Major upgrades are available for React, React DOM, Vite, Vitest, Tailwind, ESLint, lucide-react, pako, and Vercel Analytics.

## Decisions

- No dependency upgrade is applied in this phase because `npm run check` is currently blocked by local filesystem permissions.
- React remains on 18. React 19 migration is deferred until after `v0.1.0-byok-alpha` because this milestone prioritizes BYOK functionality, storage safety, and tests.
- Vite remains on 5. A future Vite upgrade should happen only after tests and build pass locally.
- React Router should be the first upgrade candidate after the check command works, because the audit report includes high severity advisories with a non-force fix path.
- PostCSS, Babel, brace-expansion, and js-yaml should be handled through a cautious non-force `npm audit fix` once verification is unblocked.
- Tauri is kept but quarantined as experimental. This fork remains browser-first for the current milestone, and desktop packaging is unsupported for `v0.1.0-byok-alpha`.

## Tauri Status

Tauri dependencies and the `npm run tauri` script remain in place only to avoid unnecessary dependency churn. No Tauri implementation is added in this phase.

Desktop packaging is experimental and unsupported for `v0.1.0-byok-alpha`. Browser development, BYOK behavior, storage safety, import/export, and tests are the supported path for this milestone.

## Next Safe Order

1. Fix the local Windows permission issue that blocks Vitest/Vite config loading.
2. Run `npm run check`.
3. Apply non-force `npm audit fix`.
4. Re-run `npm run check`.
5. Consider safe patch/minor direct dependency updates.
6. Defer major upgrades, especially React 19 and Vite major upgrades, to later phases.
