import { describe, it, expect } from 'vitest';
import { codeOf, block, val, stmt, text, num, program, variable } from './setup.js';

describe('control blocks', () => {
  it('controls_if (only)', () => {
    const code = codeOf(program(
      block('controls_if', {
        inputs: {
          IF0: val(block('logic_compare', {
            fields: { OP: 'EQ' },
            inputs: { A: num(1), B: num(1) },
          })),
          DO0: stmt(block('text_print', { inputs: { TEXT: text('نعم') } })),
        },
      })
    ));
    expect(code).toBe('اذا ((1 == 1)):\n  اطبع("نعم")\n');
  });

  it('controls_if with else', () => {
    const code = codeOf(program(
      block('controls_if', {
        extraState: { hasElse: true },
        inputs: {
          IF0: val(block('logic_boolean', { fields: { BOOL: 'FALSE' } })),
          DO0: stmt(block('text_print', { inputs: { TEXT: text('a') } })),
          ELSE: stmt(block('text_print', { inputs: { TEXT: text('b') } })),
        },
      })
    ));
    expect(code).toBe('اذا خطأ:\n  اطبع("a")\nوالا:\n  اطبع("b")\n');
  });

  it('controls_whileUntil WHILE -> طالما', () => {
    const code = codeOf(program(
      block('controls_whileUntil', {
        fields: { MODE: 'WHILE' },
        inputs: {
          BOOL: val(block('logic_boolean', { fields: { BOOL: 'TRUE' } })),
          DO: stmt(block('text_print', { inputs: { TEXT: text('loop') } })),
        },
      })
    ));
    expect(code).toBe('طالما صحيح:\n  اطبع("loop")\n');
  });

  it('controls_whileUntil UNTIL -> طالما ليس(...)', () => {
    const code = codeOf(program(
      block('controls_whileUntil', {
        fields: { MODE: 'UNTIL' },
        inputs: {
          BOOL: val(block('logic_boolean', { fields: { BOOL: 'FALSE' } })),
          DO: stmt(block('text_print', { inputs: { TEXT: text('x') } })),
        },
      })
    ));
    expect(code).toBe('طالما ليس(خطأ):\n  اطبع("x")\n');
  });

  it('controls_forEach -> لكل item في list', () => {
    const code = codeOf(program(
      block('controls_forEach', {
        fields: { VAR: { id: 'vi', name: 'عنصر' } },
        inputs: {
          LIST: val(block('lists_create_empty')),
          DO: stmt(block('text_print', { inputs: { TEXT: text('p') } })),
        },
      }),
      [variable('عنصر', 'vi')]
    ));
    expect(code).toBe('لكل عنصر في []:\n  اطبع("p")\n');
  });

  it('controls_repeat_ext -> كرر N مرات', () => {
    const code = codeOf(program(
      block('controls_repeat_ext', {
        inputs: {
          TIMES: num(3),
          DO: stmt(block('text_print', { inputs: { TEXT: text('hi') } })),
        },
      })
    ));
    expect(code).toBe('كرر 3 مرات:\n  اطبع("hi")\n');
  });

  it('controls_flow_statements BREAK -> اخرج', () => {
    expect(codeOf(program(block('controls_flow_statements', { fields: { FLOW: 'BREAK' } }))).trim())
      .toBe('اخرج');
  });

  it('controls_flow_statements CONTINUE -> تابع', () => {
    expect(codeOf(program(block('controls_flow_statements', { fields: { FLOW: 'CONTINUE' } }))).trim())
      .toBe('تابع');
  });
});