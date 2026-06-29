import { describe, expect, it } from 'vitest';
import { sanitizeExportPayload } from './helpers';

describe('sanitizeExportPayload', () => {
  it('drops API keys, local AI settings, consent flags, and debug secrets recursively', () => {
    const payload = sanitizeExportPayload({
      templates: [{ id: 'tpl_1', name: 'A' }],
      promptfill_gemini_api_key_v1: 'secret',
      nested: {
        authorization: 'Bearer token',
        promptfill_ai_first_use_consent: 'true',
        safe: 'keep',
      },
      list: [{ debug_zhipu_api_key: 'legacy', value: 1 }],
    });

    expect(payload).toEqual({
      templates: [{ id: 'tpl_1', name: 'A' }],
      nested: { safe: 'keep' },
      list: [{ value: 1 }],
    });
  });
});
