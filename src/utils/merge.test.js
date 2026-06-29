import { describe, expect, it } from 'vitest';
import { mergeBanksWithSystem, mergeTemplatesWithSystem } from './merge';

describe('system data merge', () => {
  it('preserves custom templates while refreshing system templates', () => {
    const result = mergeTemplatesWithSystem([
      {
        id: 'custom_template',
        name: 'Custom',
        content: 'Hello',
        selections: {},
      },
    ], { backupSuffix: ' backup' });

    expect(result.templates.some(template => template.id === 'custom_template')).toBe(true);
  });

  it('preserves custom bank options when system banks refresh', () => {
    const result = mergeBanksWithSystem({
      art_style: {
        label: { cn: '艺术风格', en: 'Art Style' },
        category: 'visual',
        options: [{ cn: '自定义风格', en: 'custom style' }],
      },
      custom_bank: {
        label: 'Custom',
        category: 'other',
        options: ['one'],
      },
    }, { custom_bank: 'one' }, { backupSuffix: ' backup' });

    expect(result.banks.art_style.options).toContainEqual({ cn: '自定义风格', en: 'custom style' });
    expect(result.banks.custom_bank).toBeTruthy();
    expect(result.defaults.custom_bank).toBe('one');
  });
});
