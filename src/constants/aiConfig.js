/**
 * AI feature configuration.
 *
 * Gemini BYOK values are stored in browser localStorage only. They are not part
 * of template, bank, folder, or share payloads.
 */

export const AI_FEATURE_ENABLED = true;
export const GEMINI_BYOK_ENABLED = true;
export const AI_SMART_SPLIT_ENABLED = true;

export const AI_PROVIDERS = {
  GEMINI: 'gemini',
};

export const DEFAULT_AI_PROVIDER = AI_PROVIDERS.GEMINI;

export const GEMINI_API_KEY_STORAGE_KEY = 'promptfill_gemini_api_key_v1';
export const GEMINI_MODEL_STORAGE_KEY = 'promptfill_gemini_model_v1';
export const GEMINI_CONSENT_STORAGE_KEY = 'promptfill_gemini_prompt_consent_v1';
export const AI_FIRST_USE_CONSENT_STORAGE_KEY = 'promptfill_ai_first_use_consent';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
export const DEFAULT_AI_MODEL = DEFAULT_GEMINI_MODEL;
export const AI_API_KEY_STORAGE_KEY = GEMINI_API_KEY_STORAGE_KEY;
export const AI_PROVIDER_STORAGE_KEY = 'promptfill_ai_provider_v1';
export const AI_MODEL_STORAGE_KEY = GEMINI_MODEL_STORAGE_KEY;

export const DEFAULT_AI_MODELS = {
  [AI_PROVIDERS.GEMINI]: DEFAULT_GEMINI_MODEL,
};

export const AI_GENERATION_COUNT = {
  MIN: 3,
  MAX: 8,
  DEFAULT: 5,
};

export const AI_ERROR_MESSAGES = {
  NO_API_KEY: {
    cn: '请先在设置中保存 Gemini API Key',
    en: 'Save your Gemini API key in Settings first',
  },
  NO_CONSENT: {
    cn: '请先在设置中允许将提示词发送给 Gemini',
    en: 'Allow sending prompt context to Gemini in Settings first',
  },
  GENERATION_FAILED: {
    cn: 'AI 生成失败，请重试',
    en: 'AI generation failed, please retry',
  },
  NETWORK_ERROR: {
    cn: '网络错误，请检查连接或 API Key',
    en: 'Network error. Check your connection or API key',
  },
  RATE_LIMIT: {
    cn: '请求过于频繁，请稍后重试',
    en: 'Too many requests, please try again later',
  },
};

export const AI_BUTTON_TEXT = {
  cn: '✨ Gemini 词条',
  en: '✨ Gemini Terms',
};

export const AI_LOADING_TEXT = {
  cn: 'Gemini 生成中...',
  en: 'Gemini generating...',
};

export const AI_SECTION_TITLE = {
  cn: 'Gemini 词条',
  en: 'Gemini Terms',
};

export const LOCAL_SECTION_TITLE = {
  cn: '本地词库',
  en: 'Local Library',
};

export const GEMINI_SETTINGS_TEXT = {
  title: {
    cn: 'Gemini BYOK',
    en: 'Gemini BYOK',
  },
  keyLabel: {
    cn: 'API Key',
    en: 'API Key',
  },
  keyPlaceholder: {
    cn: '粘贴你的 Gemini API Key',
    en: 'Paste your Gemini API key',
  },
  modelLabel: {
    cn: '模型',
    en: 'Model',
  },
  consentLabel: {
    cn: '允许 AI 功能将当前提示词上下文发送给 Gemini',
    en: 'Allow AI features to send current prompt context to Gemini',
  },
  privacyNote: {
    cn: '你的 Gemini API Key 仅保存在本浏览器中，并且只用于从你的设备调用 Gemini。请不要使用不受限制的生产 Key；请在 Google AI Studio 或 Google Cloud 中设置用量限制和访问限制。你的提示词数据会保留在本地，除非你导出、分享，或使用会将提示词上下文发送给 Gemini 的 AI 功能。',
    en: 'Your Gemini API key is stored locally in this browser. It is used only to call Gemini from your device. Do not use an unrestricted production key. Set usage limits and restrictions in Google AI Studio or Google Cloud. Your prompt data stays local unless you export, share, or use an AI feature that sends prompt context to Gemini.',
  },
  saved: {
    cn: '已保存',
    en: 'Saved',
  },
  save: {
    cn: '保存',
    en: 'Save',
  },
  clear: {
    cn: '清除',
    en: 'Clear',
  },
  test: {
    cn: '测试',
    en: 'Test',
  },
};
