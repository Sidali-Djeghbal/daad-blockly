import { describe, it, expect } from 'vitest';
import { codeOf, block, num, program } from './setup.js';

describe('math blocks', () => {
  it('math_number', () => {
    expect(codeOf(program(block('math_number', { fields: { NUM: 42 } }))).trim())
      .toBe('42');
  });

  it('math_number defaults to 0', () => {
    expect(codeOf(program(block('math_number'))).trim()).toBe('0');
  });

  const ops = [
    ['ADD', '+'], ['MINUS', '-'], ['MULTIPLY', '*'], ['DIVIDE', '/'],
  ];
  for (const [op, sym] of ops) {
    it(`math_arithmetic ${op} -> (a ${sym} b)`, () => {
      const code = codeOf(program(
        block('math_arithmetic', {
          fields: { OP: op },
          inputs: { A: num(6), B: num(2) },
        })
      ));
      expect(code.trim()).toBe(`(6 ${sym} 2)`);
    });
  }

  it('daad_power -> (a ** b)', () => {
    const code = codeOf(program(
      block('daad_power', { inputs: { A: num(2), B: num(8) } })
    ));
    expect(code.trim()).toBe('(2 ** 8)');
  });

  it('daad_modulo -> (a % b)', () => {
    const code = codeOf(program(
      block('daad_modulo', { inputs: { A: num(10), B: num(3) } })
    ));
    expect(code.trim()).toBe('(10 % 3)');
  });

  it('daad_floor_divide -> (a // b)', () => {
    const code = codeOf(program(
      block('daad_floor_divide', { inputs: { A: num(9), B: num(2) } })
    ));
    expect(code.trim()).toBe('(9 // 2)');
  });

  it('daad_float -> عشري(x)', () => {
    const code = codeOf(program(
      block('daad_float', { inputs: { VALUE: num(3) } })
    ));
    expect(code.trim()).toBe('عشري(3)');
  });
});