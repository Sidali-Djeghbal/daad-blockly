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