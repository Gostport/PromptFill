import { describe, expect, it } from 'vitest';
import { validatePromptFillPayload } from './folderStorage';

describe('validatePromptFillPayload', () => {
  it('accepts payloads with valid templates', () => {
    expect(validatePromptFillPayload({ templates: [{ id: 'tpl_1' }] })).toBe(true);
  });

  it('rejects empty, malformed, or id-less template payloads', () => {
    expect(validatePromptFillPayload(null)).toBe(false);
    expect(validatePromptFillPayload({ templates: [] })).toBe(false);
    expect(validatePromptFillPayload({ templates: [{ name: 'Missing id' }] })).toBe(false);
  });
});
