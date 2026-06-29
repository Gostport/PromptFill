const stripCodeFence = (text) => {
  const trimmed = (text || '').trim();
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

export const parseJsonResponse = (text) => {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Gemini response did not contain valid JSON');
  }
};

export const normalizeGeminiOption = (value, language = 'en') => {
  if (typeof value === 'object' && value !== null) {
    return {
      cn: value.cn || value.en || '',
      en: value.en || value.cn || '',
    };
  }
  const text = String(value || '').trim();
  return language === 'cn' ? { cn: text, en: text } : { cn: text, en: text };
};

export const parseGeminiTermsResponse = (text, { language = 'en', count = Infinity } = {}) => {
  const parsed = parseJsonResponse(text);
  const terms = Array.isArray(parsed?.terms) ? parsed.terms : [];
  return terms
    .map(term => normalizeGeminiOption(term, language))
    .filter(term => term.cn || term.en)
    .slice(0, count);
};

export const parseGeminiSmartSplitResponse = (text, {
  rawPrompt = '',
  availableTags = [],
  language = 'en',
} = {}) => {
  const parsed = parseJsonResponse(text);
  const variables = Array.isArray(parsed.variables) ? parsed.variables.slice(0, 5).map(variable => {
    const options = Array.isArray(variable.options) ? variable.options : [];
    const normalizedOptions = options.map(opt => normalizeGeminiOption(opt, language)).filter(opt => opt.cn || opt.en);
    const defaultValue = variable.default
      ? normalizeGeminiOption(variable.default, language)
      : normalizedOptions[0];

    return {
      key: String(variable.key || '').trim(),
      label: typeof variable.label === 'object' && variable.label !== null
        ? {
            cn: variable.label.cn || variable.label.en || variable.key,
            en: variable.label.en || variable.label.cn || variable.key,
          }
        : { cn: variable.label || variable.key, en: variable.label || variable.key },
      category: ['character', 'item', 'action', 'location', 'visual', 'other'].includes(variable.category) ? variable.category : 'other',
      options: normalizedOptions.length ? normalizedOptions : [defaultValue].filter(Boolean),
      default: defaultValue,
    };
  }).filter(variable => variable.key && variable.options.length > 0) : [];

  return {
    name: typeof parsed.name === 'object' && parsed.name !== null
      ? { cn: parsed.name.cn || parsed.name.en || '新模板', en: parsed.name.en || parsed.name.cn || 'New Template' }
      : parsed.name,
    content: typeof parsed.content === 'object' && parsed.content !== null
      ? { cn: parsed.content.cn || parsed.content.en || rawPrompt, en: parsed.content.en || parsed.content.cn || rawPrompt }
      : parsed.content,
    variables,
    tags: Array.isArray(parsed.tags) ? parsed.tags.filter(tag => availableTags.includes(tag)) : [],
  };
};
