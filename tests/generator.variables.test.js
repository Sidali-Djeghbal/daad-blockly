import { describe, it, expect } from 'vitest';
import { codeOf, block, num, program, variable } from './setup.js';

describe('variable blocks', () => {
  it('variables_get -> name', () => {
    const code = codeOf(
      program(block('variables_get', { fields: { VAR: { id: 'v', name: 'س' } } }), [variable('س', 'v')])
    );
    expect(code.trim()).toBe('س');
  });

  it('variables_set -> name = value', () => {
    const code = codeOf(program(
      block('variables_set', {
        fields: { VAR: { id: 'v', name: 'س' } },
        inputs: { VALUE: num(7) },
      }),
      [variable('س', 'v')]
    ));
    expect(code.trim()).toBe('س = 7');
  });
});