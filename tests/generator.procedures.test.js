import { describe, it, expect } from 'vitest';
import { codeOf, block, stmt, text, num, program } from './setup.js';

describe('procedure blocks', () => {
  it('procedures_defnoreturn (no params) -> دالة name():', () => {
    const code = codeOf(program(
      block('procedures_defnoreturn', {
        fields: { NAME: 'greet' },
        inputs: { STACK: stmt(block('text_print', { inputs: { TEXT: text('مرحبا') } })) },
      })
    ));
    expect(code).toBe('دالة greet():\n  اطبع("مرحبا")\n');
  });

  it('procedures_defreturn -> دالة name(): ... ارجع value', () => {
    const code = codeOf(program(
      block('procedures_defreturn', {
        fields: { NAME: 'square' },
        inputs: {
          STACK: stmt(block('text_print', { inputs: { TEXT: text('x') } })),
          RETURN: num(4),
        },
      })
    ));
    expect(code).toBe('دالة square():\n  اطبع("x")\nارجع 4\n');
  });

  it('procedures_ifreturn', () => {
    const code = codeOf(program(
      block('procedures_ifreturn', {
        inputs: {
          CONDITION: { block: { kind: 'block', type: 'logic_boolean', fields: { BOOL: 'TRUE' } } },
          VALUE: num(0),
        },
      })
    ));
    expect(code).toBe('اذا صحيح:\n  ارجع 0\n');
  });

  it('procedures_ifreturn without value -> bare ارجع', () => {
    const code = codeOf(program(
      block('procedures_ifreturn', {
        inputs: {
          CONDITION: { block: { kind: 'block', type: 'logic_boolean', fields: { BOOL: 'TRUE' } } },
        },
      })
    ));
    expect(code).toBe('اذا صحيح:\n  ارجع\n');
  });

  it('procedures_callnoreturn (no args) -> name()', () => {
    const code = codeOf(program(
      block('procedures_callnoreturn', { fields: { NAME: 'greet' } })
    ));
    expect(code.trim()).toBe('greet()');
  });

  it('procedures_callreturn used as value -> name()', () => {
    const code = codeOf(program(
      block('text_print', {
        inputs: {
          TEXT: { block: { kind: 'block', type: 'procedures_callreturn', fields: { NAME: 'now' } } },
        },
      })
    ));
    expect(code.trim()).toBe('اطبع(now())');
  });
});