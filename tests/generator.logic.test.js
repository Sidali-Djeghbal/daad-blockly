import { describe, it, expect } from 'vitest';
import { codeOf, block, val, text, num, program } from './setup.js';

describe('logic blocks', () => {
  it('logic_boolean TRUE -> صحيح', () => {
    expect(codeOf(program(block('logic_boolean', { fields: { BOOL: 'TRUE' } }))).trim())
      .toBe('صحيح');
  });

  it('logic_boolean FALSE -> خطأ', () => {
    expect(codeOf(program(block('logic_boolean', { fields: { BOOL: 'FALSE' } }))).trim())
      .toBe('خطأ');
  });

  const cmp = [
    ['EQ', '=='], ['NEQ', '!='], ['LT', '<'], ['LTE', '<='],
    ['GT', '>'], ['GTE', '>='],
  ];
  for (const [op, sym] of cmp) {
    it(`logic_compare ${op} -> (a ${sym} b)`, () => {
      const code = codeOf(program(
        block('logic_compare', {
          fields: { OP: op },
          inputs: { A: num(1), B: num(2) },
        })
      ));
      expect(code.trim()).toBe(`(1 ${sym} 2)`);
    });
  }

  it('logic_operation AND -> (a و b)', () => {
    const code = codeOf(program(
      block('logic_operation', {
        fields: { OP: 'AND' },
        inputs: { A: val(block('logic_boolean', { fields: { BOOL: 'TRUE' } })), B: val(block('logic_boolean', { fields: { BOOL: 'FALSE' } })) },
      })
    ));
    expect(code.trim()).toBe('(صحيح و خطأ)');
  });

  it('logic_operation OR -> (a أو b)', () => {
    const code = codeOf(program(
      block('logic_operation', {
        fields: { OP: 'OR' },
        inputs: { A: val(block('logic_boolean', { fields: { BOOL: 'TRUE' } })), B: val(block('logic_boolean', { fields: { BOOL: 'FALSE' } })) },
      })
    ));
    expect(code.trim()).toBe('(صحيح أو خطأ)');
  });

  it('logic_negate -> ليس(x)', () => {
    const code = codeOf(program(
      block('logic_negate', { inputs: { BOOL: val(block('logic_boolean', { fields: { BOOL: 'TRUE' } })) } })
    ));
    expect(code.trim()).toBe('ليس(صحيح)');
  });

  it('daad_type -> نوع(x)', () => {
    const code = codeOf(program(
      block('daad_type', { inputs: { VALUE: text('hi') } })
    ));
    expect(code.trim()).toBe('نوع("hi")');
  });

  it('daad_membership -> (item في list)', () => {
    const code = codeOf(program(
      block('daad_membership', { inputs: { ITEM: num(1), LIST: text('abc') } })
    ));
    expect(code.trim()).toBe('(1 في "abc")');
  });
});