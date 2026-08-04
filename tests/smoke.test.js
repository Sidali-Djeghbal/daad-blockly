import { describe, it, expect } from 'vitest';
import { codeOf } from '../setup.js';

describe('smoke', () => {
  it('generates print of a string', () => {
    const code = codeOf({
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'text_print',
            kind: 'block',
            inputs: {
              TEXT: { kind: 'block', type: 'text', fields: { TEXT: 'مرحبا' } },
            },
          },
        ],
      },
    });
    expect(code).toContain('اطبع("مرحبا")');
  });

  it('generates a math number', () => {
    const code = codeOf({
      blocks: {
        languageVersion: 0,
        blocks: [
          { kind: 'block', type: 'math_number', fields: { NUM: 42 } },
        ],
      },
    });
    expect(code.trim()).toBe('42');
  });
});