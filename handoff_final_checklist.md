# Final Checklist, v0.1.0-byok-alpha

Use this checklist before calling the fork personally usable.

## Product Identity

- [ ] App name clearly reflects PromptFill BYOK Edition or chosen fork name.
- [ ] README explains English-first, local-first, Gemini BYOK direction.
- [ ] Fork notice exists.
- [ ] MIT license preserved.
- [ ] Original upstream attribution preserved.
- [ ] No Docker support was added.

## Browser-First Scope

- [ ] Browser app is the primary supported path.
- [ ] Tauri is marked experimental/unsupported or removed.
- [ ] No Tauri implementation work is required to run the app.

## English-First UX

- [ ] Fresh install opens in English.
- [ ] Existing language preference is preserved.
- [ ] Main navigation is English-readable.
- [ ] Settings are English-readable.
- [ ] Import/export flows are English-readable.
- [ ] Modals and warnings are English-readable.
- [ ] Template/bank fallback order is English, Chinese, raw string, safe placeholder.
- [ ] Chinese data was not destroyed.

## Core App Functionality

- [ ] User can create templates.
- [ ] User can edit templates.
- [ ] User can create/edit banks.
- [ ] User can select variable options.
- [ ] User can copy generated prompt.
- [ ] User can export data.
- [ ] User can import data after validation.
- [ ] Browser storage works.
- [ ] Non-AI usage works with AI disabled.

## Gemini BYOK

- [ ] Settings include AI enable/disable.
- [ ] Settings include Gemini provider.
- [ ] User can enter Gemini API key.
- [ ] User can show/hide key.
- [ ] User can save key.
- [ ] User can clear key.
- [ ] User can choose Gemini model.
- [ ] User can test Gemini connection.
- [ ] Test connection handles success, invalid key, rate limit, network error, and unknown error.
- [ ] AI term generation works through Gemini.
- [ ] Smart split works through Gemini or fails safely.
- [ ] Smart split previews before applying changes.
- [ ] Old upstream AI backend is not required for Gemini features.
- [ ] Old GLM/debug path is not exposed in normal UI.

## Security and Privacy

- [ ] Settings include clear BYOK privacy warning.
- [ ] First AI use requires consent before sending prompt/template content.
- [ ] Declining consent prevents AI request.
- [ ] Gemini API key is stored locally only.
- [ ] Gemini API key is never logged.
- [ ] Authorization headers are never logged.
- [ ] Full prompt content is not logged in production.
- [ ] Exported JSON does not contain Gemini API key.
- [ ] Exported JSON does not contain local-only AI settings.
- [ ] Imports drop secret-looking AI fields.
- [ ] `SECURITY.md` exists.
- [ ] README explains what is local and what is sent to Gemini.
- [ ] Sharing/export paths are labeled clearly.

## Storage Safety

- [ ] IndexedDB remains main browser storage for large data.
- [ ] Folder mode cannot overwrite before load/confirmation.
- [ ] Existing folder data prompts load/overwrite/cancel.
- [ ] Folder write uses temp validation and backup.
- [ ] Backup behavior is documented.
- [ ] Import validates shape before applying.
- [ ] Import shows summary before applying.
- [ ] Remote/system data updates do not silently overwrite user data.
- [ ] Remote/system data updates can be disabled.

## Tests and Quality

- [ ] Vitest or equivalent test runner exists.
- [ ] `npm run test` exists.
- [ ] `npm run check` exists.
- [ ] Tests do not call real Gemini API.
- [ ] Parser tests exist.
- [ ] Gemini response parsing tests exist.
- [ ] Export sanitization tests exist.
- [ ] Import/storage validation tests exist.
- [ ] `npm run check` passes.

## Developer Experience

- [ ] README Quick Start works from a fresh clone.
- [ ] README states Node.js requirement.
- [ ] README explains Gemini key is optional unless using AI.
- [ ] README explains no backend is required for basic local use.
- [ ] README troubleshooting includes AI key failure.
- [ ] README troubleshooting includes folder storage availability.
- [ ] README troubleshooting includes import failure.
- [ ] README troubleshooting includes lost data recovery.
- [ ] Project map exists in README.
- [ ] Contribution notes exist.

## Dependency and Maintenance

- [ ] `npm audit` has been run and documented.
- [ ] `npm outdated` has been run and documented.
- [ ] `DEPENDENCY_REVIEW.md` exists.
- [ ] No broad dependency upgrade was done blindly.
- [ ] Lockfile is consistent with package file.
- [ ] React 19 migration is either completed deliberately or deferred explicitly.

## Release Note Template

Use this release note for the first alpha:

```text
v0.1.0-byok-alpha

PromptFill BYOK Edition is now English-first and browser-first, with Gemini BYOK support for AI term generation and smart prompt splitting. API keys are stored locally and excluded from exports. Storage/import/export flows include additional safety checks. This alpha is intended for personal/local use and early testing.

Known limits:
- Desktop/Tauri packaging is not supported in this milestone.
- No Docker support is included.
- Users should restrict their Gemini API keys and set usage limits.
```
