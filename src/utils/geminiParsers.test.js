import { describe, expect, it } from 'vitest';
import { parseGeminiSmartSplitResponse, parseGeminiTermsResponse, parseJsonResponse } from './geminiParsers';

describe('geminiParsers', () => {
  it('parses fenced JSON and ignores surrounding text', () => {
    expect(parseJsonResponse('```json\n{"ok":true}\n```')).toEqual({ ok: true });
    expect(parseJsonResponse('Result:\n{"ok":true}\nThanks')).toEqual({ ok: true });
  });

  it('normalizes Gemini term responses', () => {
    const terms = parseGeminiTermsResponse('{"terms":[{"cn":"雨夜","en":"rainy night"},"cinematic"]}', { count: 5 });
    expect(terms).toEqual([
      { cn: '雨夜', en: 'rainy night' },
      { cn: 'cinematic', en: 'cinematic' },
    ]);
  });

  it('normalizes smart split responses and filters unavailable tags', () => {
    const result = parseGeminiSmartSplitResponse(JSON.stringify({
      name: { en: 'Portrait' },
      content: { en: 'A {{subject}} portrait' },
      variables: [
        {
          key: 'subject',
          label: 'Subject',
          category: 'bad-category',
          options: ['astronaut'],
        },
      ],
      tags: ['portrait', 'missing'],
    }), { rawPrompt: 'A portrait', availableTags: ['portrait'] });

    expect(result.name).toEqual({ cn: 'Portrait', en: 'Portrait' });
    expect(result.content).toEqual({ cn: 'A {{subject}} portrait', en: 'A {{subject}} portrait' });
    expect(result.variables[0]).toMatchObject({
      key: 'subject',
      category: 'other',
      default: { cn: 'astronaut', en: 'astronaut' },
    });
    expect(result.tags).toEqual(['portrait']);
  });
});
