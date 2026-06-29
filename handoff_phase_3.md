# Handoff Phase 3, Security, Privacy, and Safe Exports

## Goal

Make the fork safe and honest for BYOK users. The user should understand what is local, what is sent to Gemini, and what is included in exports.

## Scope

Included:

- BYOK privacy notice.
- First-use AI consent.
- Sensitive logging cleanup.
- Export sanitization.
- `SECURITY.md`.
- Remote sharing clarity.

Excluded:

- Docker.
- Tauri implementation.
- Large storage rewrite.
- Cloud account system.

## Instructions

### 1. Create phase branch

```bash
git checkout byok-alpha
git checkout -b phase-3-security-privacy
```

### 2. Add privacy notice in Settings

Add clear text near Gemini settings:

```text
Your Gemini API key is stored locally in this browser. It is used only to call Gemini from your device. Do not use an unrestricted production key. Set usage limits and restrictions in Google AI Studio or Google Cloud. Your prompt data stays local unless you export, share, or use an AI feature that sends prompt context to Gemini.
```

### 3. Add first-use AI consent

Before the first Gemini request that sends prompt/template content, show a one-time confirmation:

```text
AI features send the current prompt or template context to Gemini so it can generate suggestions. Continue?
```

Store consent locally:

```text
promptfill_ai_first_use_consent = true
```

If user declines, do not send the request.

### 4. Remove sensitive logs

Search for logs that print:

```text
API keys
Authorization headers
Full request bodies
Full AI responses
Raw prompt content
Imported user data
Export payloads
```

Rules:

```text
Never log API keys.
Never log Authorization headers.
Avoid logging full prompt content.
Development logs must be behind a development-only guard.
Production errors should be short and user-safe.
```

### 5. Export sanitization

Create or update export sanitizer so exported templates/backups do not include:

```text
Gemini API key
AI provider secrets
Debug keys
Consent flags
Local-only AI settings
Internal auth/settings values
```

Add a reusable pure function such as:

```js
sanitizeExportPayload(payload)
```

Use it for every export path.

### 6. Import safety

Do not import AI secrets from JSON. If old or third-party JSON contains AI key-like fields, drop them.

### 7. Add SECURITY.md

Create `SECURITY.md` with:

```text
Security Policy
- How to report vulnerabilities.
- What data is stored locally.
- How BYOK works.
- Do not paste API keys into issues.
- AI prompts are sent to Gemini only when AI features are used.
- Exported templates should not contain secrets.
- Third-party AI provider behavior is governed by that provider.
```

### 8. Clarify sharing paths

Audit share/export UI labels. Make clear distinction between:

```text
local JSON export
image export
long URL share
short-link share
remote upload or remote sync
```

Any remote sharing should show a warning before use.

### 9. Add README privacy section

Document:

```text
Where prompt data is stored.
Where Gemini key is stored.
What gets sent to Gemini.
How to clear the key.
How to export safely.
How to recover local data where applicable.
```

## Checklist

- [ ] Settings includes BYOK privacy notice.
- [ ] First Gemini use requires consent.
- [ ] Declining consent prevents Gemini request.
- [ ] Consent is stored locally only.
- [ ] API keys are never logged.
- [ ] Authorization headers are never logged.
- [ ] Full prompt content is not logged in production.
- [ ] Export sanitizer exists.
- [ ] All export paths use sanitizer.
- [ ] Imports drop secret-looking AI settings.
- [ ] Gemini key is not included in exported JSON.
- [ ] Local-only consent/settings are not included in exported JSON.
- [ ] `SECURITY.md` exists.
- [ ] README has privacy/BYOK section.
- [ ] Remote sharing paths have clear labels/warnings.
- [ ] App still works with AI disabled.
- [ ] No Docker work added.
- [ ] No Tauri implementation work added.
- [ ] Build passes.
- [ ] Lint passes.

## Stop Point

Stop when a user can understand BYOK risks, use AI knowingly, and export data without leaking API keys or local-only settings.
