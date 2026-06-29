export const parseVariableName = (varName = '') => {
  const match = String(varName).match(/^(.+?)(?:_(\d+))?$/);
  if (match) {
    return {
      baseKey: match[1],
      groupId: match[2] || null,
    };
  }
  return { baseKey: String(varName), groupId: null };
};

export const parseInlineSyntax = (raw = '') => {
  const text = String(raw);
  const colonIdx = text.indexOf(':');
  if (colonIdx === -1) return { varPart: text.trim(), inlineVal: null };
  return {
    varPart: text.slice(0, colonIdx).trim(),
    inlineVal: text.slice(colonIdx + 1).trim() || null,
  };
};

export const detectAutoComplete = (text, cursorPos, disableSlash = false) => {
  if (!text || cursorPos == null || cursorPos === 0) return null;
  const before = String(text).substring(0, cursorPos);

  for (let i = before.length - 1; i >= 0; i--) {
    const ch = before[i];
    if (ch === '\n' || ch === '}') return null;
    if (ch === '{' || ch === '/') {
      if (ch === '/' && disableSlash) return null;
      if (ch === '{' && i > 0 && before[i - 1] === '{') return null;
      return {
        triggerPos: i,
        triggerChar: ch,
        rawQuery: before.substring(i + 1),
      };
    }
  }

  return null;
};
