import { describe, expect, it } from 'vitest';
import { detectAutoComplete, parseInlineSyntax, parseVariableName } from './variableSyntax';

describe('variableSyntax', () => {
  it('parses linked variable group suffixes', () => {
    expect(parseVariableName('subject_2')).toEqual({ baseKey: 'subject', groupId: '2' });
    expect(parseVariableName('camera_angle')).toEqual({ baseKey: 'camera_angle', groupId: null });
  });

  it('parses inline values without losing colons in the value', () => {
    expect(parseInlineSyntax('subject: red fox')).toEqual({ varPart: 'subject', inlineVal: 'red fox' });
    expect(parseInlineSyntax('url: https://example.com/a:b')).toEqual({ varPart: 'url', inlineVal: 'https://example.com/a:b' });
    expect(parseInlineSyntax('subject')).toEqual({ varPart: 'subject', inlineVal: null });
  });

  it('detects slash and brace autocomplete triggers', () => {
    expect(detectAutoComplete('a /sce', 6)).toEqual({ triggerPos: 2, triggerChar: '/', rawQuery: 'sce' });
    expect(detectAutoComplete('a {sce', 6)).toEqual({ triggerPos: 2, triggerChar: '{', rawQuery: 'sce' });
  });

  it('does not trigger inside existing double-brace variables or across lines', () => {
    expect(detectAutoComplete('{{sce', 5)).toBeNull();
    expect(detectAutoComplete('/scene\nnext', 11)).toBeNull();
    expect(detectAutoComplete('a /sce', 6, true)).toBeNull();
  });
});
