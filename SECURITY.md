# Security Policy

## Reporting Vulnerabilities

Please report security issues privately to the project maintainer. Do not paste API keys, access tokens, private prompts, exported backups, or other secrets into public issues or discussions.

## Local Data

PromptFill stores templates, banks, categories, defaults, and local app settings in the browser or in the local folder you choose. Emergency recovery snapshots may also be stored locally in IndexedDB.

## Gemini BYOK

Gemini BYOK means your Gemini API key is saved locally in this browser and used from your device to call Gemini. The app does not need a PromptFill cloud account for AI features.

Do not use an unrestricted production key. Set usage limits and restrictions in Google AI Studio or Google Cloud.

AI prompts are sent to Gemini only when you use an AI feature, such as Gemini Terms or Smart Split. Third-party AI provider behavior is governed by that provider.

## Exports And Sharing

Exported templates and backups should not contain secrets. PromptFill sanitizes export, share, folder, and import payloads to drop Gemini API keys, AI provider secrets, debug keys, consent flags, and local-only AI settings.

Long URL sharing keeps data in the URL. Short-link sharing uploads sanitized share data to the configured remote short-link service after confirmation.
