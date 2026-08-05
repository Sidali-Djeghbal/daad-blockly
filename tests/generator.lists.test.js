import { describe, it, expect } from 'vitest';
import { codeOf, block, num, program } from './setup.js';

describe('list blocks', () => {
  it('lists_create_with -> [a, b, ...]', () => {
    const code = codeOf(program(
      block('lists_create_with', {
        inputs: {
          ADD0: num(1), ADD1: num(2), ADD2: num(3),
        },
      })
    ));
    expect(code.trim()).toBe('[1, 2, 3]');
  });

  it('lists_create_with zero items -> []', () => {
    expect(codeOf(program(
      block('lists_create_with', { extraState: { itemCount: 0 } })
    )).trim()).toBe('[]');
  });

  it('lists_create_empty -> []', () => {
    expect(codeOf(program(block('lists_create_empty'))).trim()).toBe('[]');
  });

  it('lists_length -> طول(...)', () => {
    const code = codeOf(program(
      block('lists_length', { inputs: { VALUE: { block: { kind: 'block', type: 'lists_create_empty' } } } })
    ));
    expect(code.trim()).toBe('طول([])');
  });

  it('daad_list_get -> list[idx]', () => {
    const code = codeOf(program(
      block('daad_list_get', {
        inputs: {
          LIST: { block: { kind: 'block', type: 'lists_create_empty' } },
          INDEX: num(0),
        },
      })
    ));
    expect(code.trim()).toBe('[][0]');
  });
});

describe('daad range / list ops', () => {
  it('daad_range -> نطاق(n)', () => {
    expect(codeOf(program(
      block('daad_range', { inputs: { END: num(5) } })
    )).trim()).toBe('نطاق(5)');
  });

  it('daad_list_append ADD -> q = اضف(q, item)', () => {
    const code = codeOf(program(
      block('daad_list_append', {
        fields: { VAR: 'ق', OP: 'APPEND' },
        inputs: { ITEM: num(3) },
      })
    ));
    expect(code.trim()).toBe('ق = اضف(ق, 3)');
  });

  it('daad_list_append PUSH -> q = ادفع(q, item)', () => {
    const code = codeOf(program(
      block('daad_list_append', {
        fields: { VAR: 'ق', OP: 'PUSH' },
        inputs: { ITEM: num(3) },
      })
    ));
    expect(code.trim()).toBe('ق = ادفع(ق, 3)');
  });

  it('daad_list_pop -> q = ازل(q)', () => {
    expect(codeOf(program(
      block('daad_list_pop', { fields: { VAR: 'ق' } })
    )).trim()).toBe('ق = ازل(ق)');
  });

  it('daad_list_copy -> انسخ(list)', () => {
    const code = codeOf(program(
      block('daad_list_copy', { inputs: { LIST: { block: { kind: 'block', type: 'lists_create_empty' } } } })
    ));
    expect(code.trim()).toBe('انسخ([])');
  });

  it('daad_list_clear -> q = افرغ(q)', () => {
    expect(codeOf(program(
      block('daad_list_clear', { fields: { VAR: 'ق' } })
    )).trim()).toBe('ق = افرغ(ق)');
  });
});