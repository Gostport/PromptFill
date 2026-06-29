# Handoff Phase 2, Gemini BYOK AI Layer

## Goal

Replace the current AI coupling with a provider-based Gemini BYOK layer while keeping the app usable with AI disabled.

## Scope

Included:

- Gemini provider abstraction.
- BYOK settings helpers.
- Gemini settings UI.
- Test key flow.
- Term generation through Gemini.
- Smart split through Gemini.
- Old AI path quarantine or removal from user-facing flows.

Excluded:

- Docker.
- Tauri implementation.
- Broad storage refactor.
- Full dependency modernization.

## Current Risk to Address

The upstream app has AI code tied to an external maintainer backend and debug GLM paths. For this fork, Gemini BYOK must be the supported path. Old GLM/upstream AI behavior should not remain exposed to normal users.

## Instructions

### 1. Create phase branch

```bash
git checkout byok-alpha
git checkout -b phase-2-gemini-byok
```

### 2. Add AI module structure

Create:

```text
src/ai/
  aiClient.js
  aiSettings.js
  providers/
    gemini.js
```

Recommended responsibilities:

```text
aiSettings.js: read/write provider, key, model, enabled flag, first-use consent.
aiClient.js: provider-neutral functions used by the app.
providers/gemini.js: Gemini-specific request/response handling.
```

### 3. Add settings keys

Use local-only settings keys:

```text
promptfill_ai_provider = "gemini"
promptfill_gemini_api_key = user key
promptfill_gemini_model = selected model
promptfill_ai_enabled = true/false
promptfill_ai_first_use_consent = true/false
```

Do not include these keys in template exports.

### 4. Add Gemini model constants

Create one source of truth for Gemini model values.

Suggested initial models:

```text
gemini-2.5-flash
gemini-2.5-pro
gemini-1.5-flash
```

If a model name fails because of API availability, make the list easy to edit rather than scattering model names through components.

### 5. Implement Gemini provider methods

Minimum API:

```js
generateTerms({
  apiKey,
  model,
  variableLabel,
  language,
  currentValue,
  localOptions,
  templateContext,
  count,
  selectedValues
})

smartSplitPrompt({
  apiKey,
  model,
  rawPrompt,
  language,
  splitMode
})

testGeminiConnection({
  apiKey,
  model
})
```

### 6. Prompt design for term generation

Gemini should be instructed to return only generated options.

Rules:

```text
No numbering.
No explanations.
No markdown unless JSON is requested.
Prefer concise phrases.
Respect active language.
Avoid duplicates from localOptions.
Use selectedValues as hard context when present.
```

Response parser must handle:

```text
JSON array.
Line-separated text.
Comma-separated fallback.
Markdown fenced JSON.
Extra leading/trailing text.
```

### 7. Prompt design for smart split

Gemini should:

```text
Take a raw prompt.
Identify reusable variable candidates.
Return a template using {{variable_key}} placeholders.
Return suggested variables and default options.
Preserve useful prompt wording.
Avoid over-fragmenting every adjective.
Prefer readable English variable keys.
```

Smart split must preview changes before overwriting the current template.

### 8. Add Gemini settings UI

In Settings, add:

```text
AI Features
- Enable AI assistance
- Provider: Gemini
- Gemini API Key input
- Show/hide key toggle
- Save key
- Test connection
- Clear key
- Model selector
```

Test connection statuses:

```text
Connection successful.
Invalid API key.
Rate limited.
Network error.
Unknown Gemini API error.
```

Do not log the key.

### 9. Wire AI buttons to new layer

Route existing AI term generation and smart split actions through `aiClient.js`.

If AI is disabled or key missing, show clear UI errors:

```text
AI is disabled.
Gemini API key is missing.
Please add your Gemini key in Settings.
```

### 10. Remove or quarantine old AI paths

Remove from normal user-facing flows:

```text
debug_zhipu_api_key
GLM direct calls
Hardcoded upstream AI endpoint for AI features
MANAGED_BY_BACKEND stubs
```

If old files remain temporarily, mark them legacy and ensure UI does not call them.

### 11. Preserve non-AI use

The app must remain fully usable without Gemini.

## Checklist

- [ ] Created `src/ai/aiClient.js`.
- [ ] Created `src/ai/aiSettings.js`.
- [ ] Created `src/ai/providers/gemini.js`.
- [ ] Added Gemini model constants in one place.
- [ ] Added local-only BYOK settings keys.
- [ ] Added Gemini API key input in Settings.
- [ ] Added show/hide key toggle.
- [ ] Added save key and clear key actions.
- [ ] Added model selector.
- [ ] Added test connection flow.
- [ ] Test connection does not log API key.
- [ ] Term generation uses Gemini provider.
- [ ] Smart split uses Gemini provider.
- [ ] Smart split previews before applying changes.
- [ ] Gemini parsers handle JSON, fenced JSON, line text, and noisy output.
- [ ] Old GLM/upstream AI path is removed or not reachable from UI.
- [ ] App works with AI disabled.
- [ ] App gives clear errors for missing key or disabled AI.
- [ ] No Docker work added.
- [ ] No Tauri implementation work added.
- [ ] Build passes.
- [ ] Lint passes.

## Stop Point

Stop when Gemini BYOK works for term generation and smart split, old AI paths are not exposed, and the app still works with AI disabled.
