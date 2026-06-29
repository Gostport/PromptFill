import {
  AI_FIRST_USE_CONSENT_STORAGE_KEY,
  AI_FEATURE_ENABLED,
  DEFAULT_GEMINI_MODEL,
  GEMINI_API_KEY_STORAGE_KEY,
  GEMINI_CONSENT_STORAGE_KEY,
  GEMINI_MODEL_STORAGE_KEY,
} from '../constants/aiConfig';

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const safeLocalStorage = {
  get(key) {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem(key) || '';
    } catch {
      return '';
    }
  },
  set(key, value) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  remove(key) {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

safeLocalStorage.remove('debug_zhipu_api_key');

export const getStoredApiKey = () => safeLocalStorage.get(GEMINI_API_KEY_STORAGE_KEY);
export const storeApiKey = (apiKey) => {
  const trimmed = (apiKey || '').trim();
  if (!trimmed) {
    clearApiKey();
    return false;
  }
  safeLocalStorage.set(GEMINI_API_KEY_STORAGE_KEY, trimmed);
  return true;
};
export const clearApiKey = () => safeLocalStorage.remove(GEMINI_API_KEY_STORAGE_KEY);

export const getStoredGeminiModel = () => safeLocalStorage.get(GEMINI_MODEL_STORAGE_KEY) || DEFAULT_GEMINI_MODEL;
export const storeGeminiModel = (model) => {
  safeLocalStorage.set(GEMINI_MODEL_STORAGE_KEY, (model || DEFAULT_GEMINI_MODEL).trim() || DEFAULT_GEMINI_MODEL);
};

export const getGeminiConsent = () => safeLocalStorage.get(GEMINI_CONSENT_STORAGE_KEY) === 'true';
export const storeGeminiConsent = (enabled) => {
  safeLocalStorage.set(GEMINI_CONSENT_STORAGE_KEY, enabled ? 'true' : 'false');
};

export const getAiFirstUseConsent = () => safeLocalStorage.get(AI_FIRST_USE_CONSENT_STORAGE_KEY) === 'true';
export const storeAiFirstUseConsent = () => {
  safeLocalStorage.set(AI_FIRST_USE_CONSENT_STORAGE_KEY, 'true');
};

const ensureFirstUseConsent = () => {
  if (getAiFirstUseConsent()) return;
  if (typeof window === 'undefined' || typeof window.confirm !== 'function') {
    throw new Error('AI first-use consent is required');
  }

  const accepted = window.confirm('AI features send the current prompt or template context to Gemini so it can generate suggestions. Continue?');
  if (!accepted) {
    throw new Error('AI first-use consent declined');
  }
  storeAiFirstUseConsent();
};

const assertGeminiReady = ({ requireConsent = true } = {}) => {
  if (!AI_FEATURE_ENABLED) {
    throw new Error('AI features are disabled');
  }

  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }

  if (requireConsent && !getGeminiConsent()) {
    throw new Error('Gemini prompt consent is required');
  }

  return {
    apiKey,
    model: getStoredGeminiModel(),
  };
};

const extractGeminiText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map(part => part.text || '').join('\n').trim();
};

const stripCodeFence = (text) => {
  const trimmed = (text || '').trim();
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
};

const parseJsonResponse = (text) => {
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

const callGemini = async ({ prompt, temperature = 0.4, responseMimeType = null, requireConsent = true }) => {
  const { apiKey, model } = assertGeminiReady({ requireConsent });
  if (requireConsent) {
    ensureFirstUseConsent();
  }
  const url = `${GEMINI_ENDPOINT_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        ...(responseMimeType ? { responseMimeType } : {}),
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gemini API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = extractGeminiText(data);
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
};

const normalizeOption = (value, language) => {
  if (typeof value === 'object' && value !== null) {
    return {
      cn: value.cn || value.en || '',
      en: value.en || value.cn || '',
    };
  }
  const text = String(value || '').trim();
  return language === 'cn' ? { cn: text, en: text } : { cn: text, en: text };
};

export const validateApiKey = async (apiKey = getStoredApiKey(), model = getStoredGeminiModel()) => {
  const savedKey = getStoredApiKey();
  const savedModel = getStoredGeminiModel();
  const savedConsent = getGeminiConsent();

  try {
    if (apiKey) storeApiKey(apiKey);
    if (model) storeGeminiModel(model);
    storeGeminiConsent(true);
    await callGemini({
      prompt: 'Reply with exactly: OK',
      temperature: 0,
      requireConsent: false,
    });
    return true;
  } finally {
    if (savedKey) storeApiKey(savedKey);
    else clearApiKey();
    storeGeminiModel(savedModel);
    storeGeminiConsent(savedConsent);
  }
};

export const generateAITerms = async (params) => {
  const {
    variableLabel,
    language = 'en',
    currentValue = '',
    localOptions = [],
    templateContext = '',
    count = 5,
    selectedValues = {},
  } = params;

  const localOptionsText = localOptions
    .slice(0, 20)
    .map(opt => {
      if (typeof opt === 'object' && opt !== null) return opt[language] || opt.en || opt.cn || JSON.stringify(opt);
      return String(opt);
    })
    .filter(Boolean)
    .join(', ');

  const selectedText = Object.entries(selectedValues)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const prompt = `You generate concise reusable prompt-bank options for AI image and video workflows.

Return JSON only in this exact shape:
{
  "terms": [
    { "cn": "Chinese term", "en": "English term" }
  ]
}

Rules:
- Generate exactly ${count} options for "${variableLabel}".
- Match the prompt context and selected values.
- Avoid duplicates from the existing local options.
- Each option should be short, concrete, and useful as a prompt fragment.
- If the source language is English, still include a useful Chinese translation.
- If the source language is Chinese, still include a useful English translation.

Language tab: ${language}
Current value: ${currentValue || '(none)'}
Selected values:
${selectedText || '(none)'}

Existing local options:
${localOptionsText || '(none)'}

Prompt context:
${templateContext || '(none)'}`;

  const text = await callGemini({ prompt, temperature: 0.7, responseMimeType: 'application/json' });
  const parsed = parseJsonResponse(text);
  const terms = Array.isArray(parsed?.terms) ? parsed.terms : [];

  return terms
    .map(term => normalizeOption(term, language))
    .filter(term => term.cn || term.en)
    .slice(0, count);
};

export const polishAndSplitPrompt = async (params) => {
  const {
    rawPrompt,
    existingBankContext = '',
    availableTags = [],
    language = 'en',
  } = params;

  const prompt = `You are converting a complete AI image/video prompt into a reusable fill-in-the-blank template.

Return JSON only in this exact shape:
{
  "name": { "cn": "中文模板名", "en": "English template name" },
  "content": { "cn": "中文模板内容 with {{variable_key}}", "en": "English template with {{variable_key}}" },
  "variables": [
    {
      "key": "variable_key",
      "label": { "cn": "中文标签", "en": "English Label" },
      "category": "character",
      "options": [
        { "cn": "中文选项", "en": "English option" }
      ],
      "default": { "cn": "中文默认值", "en": "English default" }
    }
  ],
  "tags": []
}

Rules:
- Extract only 2 to 5 high-impact reusable variables.
- Keep technical rendering details, minor colors, and tiny texture details as fixed text unless they define the whole image.
- Reuse existing variable keys when they fit.
- Use lowercase snake_case keys.
- Categories must be one of: character, item, action, location, visual, other.
- Ensure every {{variable_key}} in content exists in variables.
- Ensure every variable key appears in both cn and en content.
- Put the original value as each variable's default and first option.
- Tags may only come from this list: ${availableTags.join(', ') || '(none)'}.
- Preserve the original meaning. Do not invent a different scene.

Source language: ${language}

Existing bank reference:
${existingBankContext || '(none)'}

Prompt:
${rawPrompt}`;

  const text = await callGemini({ prompt, temperature: 0.35, responseMimeType: 'application/json' });
  const parsed = parseJsonResponse(text);

  const variables = Array.isArray(parsed.variables) ? parsed.variables.slice(0, 5).map(variable => {
    const options = Array.isArray(variable.options) ? variable.options : [];
    const normalizedOptions = options.map(opt => normalizeOption(opt, language)).filter(opt => opt.cn || opt.en);
    const defaultValue = variable.default
      ? normalizeOption(variable.default, language)
      : normalizedOptions[0];

    return {
      key: String(variable.key || '').trim(),
      label: typeof variable.label === 'object' && variable.label !== null
        ? { cn: variable.label.cn || variable.label.en || variable.key, en: variable.label.en || variable.label.cn || variable.key }
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
