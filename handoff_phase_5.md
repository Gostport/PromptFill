# Handoff Phase 5, Maintainability, Tests, and Developer Experience

## Goal

Reduce central app complexity, add basic tests around fragile logic, and improve setup documentation for future contributors.

## Scope

Included:

- Incremental extraction from `App.jsx`.
- Vitest setup.
- Tests for pure logic.
- `npm run check`.
- README setup and troubleshooting.
- Contribution notes.

Excluded:

- Docker.
- Tauri implementation.
- Full UI test suite.
- React 19 migration.
- Large visual editor rewrite.

## Instructions

### 1. Create phase branch

```bash
git checkout byok-alpha
git checkout -b phase-5-tests-dx
```

### 2. Add test runner

Use Vitest unless there is a strong reason not to.

Add scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"check": "npm run lint && npm run test && npm run build"
```

If lint is not stable from baseline, document and temporarily use:

```json
"check": "npm run test && npm run build"
```

Then restore lint once fixed.

### 3. Extract pure functions for testing

Move these out of UI components where practical:

```text
parseVariableName
parseInlineSyntax
detectAutoComplete
parseGeminiTermsResponse
parseGeminiSmartSplitResponse
sanitizeExportPayload
validatePromptFillPayload
mergeTemplatesWithSystem
mergeBanksWithSystem
```

Do not rewrite `VisualEditor` heavily. Only extract pure helper functions if safe.

### 4. Add focused unit tests

Prioritize tests for fragile bones:

```text
variable parsing
inline variable syntax
autocomplete trigger detection
Gemini term response parsing
Gemini smart split response parsing
export sanitization
import validation
folder payload validation
system data merge behavior
```

No real API calls in tests. Mock all provider requests.

### 5. Reduce `App.jsx` state gravity incrementally

Do not attempt a grand rewrite. Extract only clear domains.

Preferred extraction:

```text
src/hooks/useAISettings.js
src/hooks/useAIActions.js
src/hooks/useAppVersionCheck.js
src/hooks/useSystemDataUpdates.js
src/storage/browserStorage.js
src/storage/folderStorageController.js
src/storage/exportSanitizer.js
```

Settings components should receive state and callbacks rather than owning provider-specific behavior directly.

### 6. Improve README Quick Start

Include:

```bash
git clone <fork-url>
cd promptfill-byok
npm install
npm run dev
```

Add environment notes:

```text
Node.js 18+ recommended.
Modern Chromium-based browser recommended for folder storage.
Gemini API key required only for AI features.
No backend required for basic local use.
```

### 7. Add troubleshooting section

Add entries:

```text
AI key test fails
Folder storage not available
Import failed
Build failed
Blank screen
Lost data recovery
```

### 8. Add project map

Example:

```text
src/App.jsx                 Main app shell and orchestration
src/components              UI components
src/constants               UI strings, styles, AI defaults
src/data                    Built-in templates and banks
src/hooks                   Shared React behavior
src/utils                   Storage, parsing, helper utilities
src/ai                      Gemini BYOK provider layer
src/storage                 Storage orchestration and export sanitization
```

### 9. Add contribution notes

Include:

```text
Run npm run check before commits.
Do not log API keys or prompt data.
Keep English strings in translation constants.
Add tests for parsing/storage changes.
Avoid expanding App.jsx with new state unless necessary.
Do not add Docker in this fork phase.
```

## Checklist

- [ ] Vitest added.
- [ ] `npm run test` exists.
- [ ] `npm run test:watch` exists.
- [ ] `npm run check` exists.
- [ ] Tests do not call real Gemini API.
- [ ] Variable parsing tests added.
- [ ] Inline syntax tests added.
- [ ] Gemini term parsing tests added.
- [ ] Gemini smart split parsing tests added.
- [ ] Export sanitizer tests added.
- [ ] Import validation or payload validation tests added.
- [ ] Storage validation tests added.
- [ ] Merge behavior tests added if merge functions are present.
- [ ] AI settings/actions logic extracted from `App.jsx` where practical.
- [ ] Storage orchestration extracted where practical.
- [ ] Version/update logic extracted where practical.
- [ ] `VisualEditor` not heavily rewritten.
- [ ] README Quick Start improved.
- [ ] README environment notes added.
- [ ] README troubleshooting added.
- [ ] README project map added.
- [ ] Contribution notes added.
- [ ] No Docker work added.
- [ ] No Tauri implementation work added.
- [ ] `npm run check` passes or baseline exception is documented.

## Stop Point

Stop when core fragile logic has tests, `npm run check` exists, and README is good enough for another developer to run the app without guessing.
