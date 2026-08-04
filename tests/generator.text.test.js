import { describe, it, expect } from 'vitest';
import { codeOf, block, text, num, program, variable } from './setup.js';

describe('text blocks', () => {
  it('text -> quoted string', () => {
    expect(codeOf(program(block('text', { fields: { TEXT: 'مرحبا' } }))).trim())
      .toBe('"مرحبا"');
  });

  it('text escapes quotes and backslashes', () => {
    expect(codeOf(program(block('text', { fields: { TEXT: 'a"b\\c' } }))).trim())
      .toBe('"a\\"b\\\\c"');
  });

  it('text_print wraps argument in اطبع(...)', () => {
    const code = codeOf(program(
      block('text_print', { inputs: { TEXT: text('مرحباً بالعالم') } })
    ));
    expect(code.trim()).toBe('اطبع("مرحباً بالعالم")');
  });

  it('text_print with no input prints empty string', () => {
    const code = codeOf(program(block('text_print')));
    expect(code.trim()).toBe('اطبع("")');
  });

  it('text_length -> طول(...)', () => {
    const code = codeOf(program(
      block('text_length', { inputs: { VALUE: text('abc') } })
    ));
    expect(code.trim()).toBe('طول("abc")');
  });

  it('text_join joins with " + "', () => {
    const code = codeOf(program(
      block('text_join', {
        extra: { itemCount: 2 },
        inputs: { ADD0: text('a'), ADD1: text('b') },
      })
    ));
    expect(code.trim()).toBe('"a" + "b"');
  });

  it('text_append -> var = var + value', () => {
    const code = codeOf(program(
      block('text_append', {
        fields: { VAR: { id: 'v1', name: 'س' } },
        inputs: { TEXT: text('x') },
      }),
      [variable('س', 'v1')]
    ));
    expect(code.trim()).toBe('س = س + "x"');
  });

  it('daad_str -> نص(...)', () => {
    const code = codeOf(program(
      block('daad_str', { inputs: { VALUE: num(5) } })
    ));
    expect(code.trim()).toBe('نص(5)');
  });
});