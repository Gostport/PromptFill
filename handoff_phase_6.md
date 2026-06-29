# Handoff Phase 6, Dependency Drift and Tauri Cleanup

## Goal

Clarify dependency status, avoid accidental drift, and decide whether Tauri remains experimental or is removed from the browser-first fork path.

## Scope

Included:

- Dependency audit/outdated documentation.
- Safe patch/minor updates only if low risk.
- Tauri status clarification or removal.
- Lockfile consistency.

Excluded:

- Docker.
- Tauri implementation.
- React 19 migration unless explicitly chosen after tests pass.
- Broad dependency churn.

## Instructions

### 1. Create phase branch

```bash
git checkout byok-alpha
git checkout -b phase-6-dependency-tauri-cleanup
```

### 2. Run dependency visibility commands

Run:

```bash
npm audit
npm outdated
npm run check
```

Document results in `DEPENDENCY_REVIEW.md`.

Include:

```text
Date reviewed.
Node/npm versions used.
High/critical vulnerabilities, if any.
Outdated direct dependencies.
Decision for each important dependency.
```

### 3. Add dependency maintenance docs to README

Document:

```bash
npm install
npm audit
npm outdated
npm run lint
npm run test
npm run build
npm run check
```

### 4. Do not upgrade everything blindly

Only apply safe patch/minor updates after tests exist and `npm run check` passes.

Suggested cautious order:

```text
Patch/minor updates first.
Then Vite if needed.
Then Tailwind if needed.
Then React only in a future phase if necessary.
```

### 5. Handle Tauri explicitly

This fork is browser-first. Choose one option.

Preferred option A, quarantine Tauri:

```text
Keep Tauri dependencies/scripts only if they do not break install/build.
Mark desktop packaging as experimental and unsupported for v0.1.0-byok-alpha.
Do not add Tauri implementation.
```

Option B, remove Tauri:

```text
Remove Tauri dependencies and script if there is no complete Tauri app and they cause confusion or install friction.
Update README to say desktop packaging is not included yet.
```

Do not half-implement desktop packaging in this phase.

### 6. Keep lockfile consistent

After any dependency change:

```bash
npm install
npm run check
```

Commit updated `package-lock.json` with `package.json`.

### 7. Future React migration note

If React remains at 18, document:

```text
React 19 migration deferred until after v0.1.0-byok-alpha because this phase prioritizes BYOK functionality, storage safety, and tests.
```

## Checklist

- [ ] Ran `npm audit`.
- [ ] Ran `npm outdated`.
- [ ] Ran `npm run check`.
- [ ] Created `DEPENDENCY_REVIEW.md`.
- [ ] README includes dependency maintenance commands.
- [ ] No broad dependency upgrade performed blindly.
- [ ] Safe updates, if any, were verified by `npm run check`.
- [ ] Tauri status decided: experimental/quarantined or removed.
- [ ] README clearly says browser-first for this milestone.
- [ ] No Tauri implementation added.
- [ ] React 19 migration deferred unless deliberately completed and verified.
- [ ] `package.json` and `package-lock.json` are consistent.
- [ ] No Docker work added.
- [ ] Final `npm run check` passes or documented exception exists.

## Stop Point

Stop when dependency status is documented, Tauri is no longer ambiguous, and the repo remains stable.
