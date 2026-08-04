import { describe, it, expect } from 'vitest';
import { codeOf, block, text, num, program } from './setup.js';

describe('daad cast / type / membership', () => {
  it('daad_str -> نص(x)', () => {
    expect(codeOf(program(block('daad_str', { inputs: { VALUE: num(5) } }))).trim()).toBe('نص(5)');
  });
  it('daad_float -> عشري(x)', () => {
    expect(codeOf(program(block('daad_float', { inputs: { VALUE: num(3) } }))).trim()).toBe('عشري(3)');
  });
  it('daad_type -> نوع(x)', () => {
    expect(codeOf(program(block('daad_type', { inputs: { VALUE: text('hi') } }))).trim()).toBe('نوع("hi")');
  });
  it('daad_membership -> (item في list)', () => {
    expect(codeOf(program(
      block('daad_membership', { inputs: { ITEM: num(1), LIST: text('abc') } })
    )).trim()).toBe('(1 في "abc")');
  });
});

describe('daad tuple / dict', () => {
  it('daad_tuple -> (items)', () => {
    expect(codeOf(program(block('daad_tuple', { fields: { ITEMS: '1, 2, 3' } }))).trim())
      .toBe('(1, 2, 3)');
  });
  it('daad_dict -> {items} (wraps when missing braces)', () => {
    expect(codeOf(program(block('daad_dict', { fields: { ITEMS: '"a": 1' } }))).trim())
      .toBe('{"a": 1}');
  });
  it('daad_dict does not double-wrap when braces already present', () => {
    expect(codeOf(program(block('daad_dict', { fields: { ITEMS: '{"a": 1}' } }))).trim())
      .toBe('{"a": 1}');
  });
  it('daad_dict empty -> {}', () => {
    expect(codeOf(program(block('daad_dict', { fields: { ITEMS: '' } }))).trim())
      .toBe('{}');
  });
});

describe('daad augmented assign', () => {
  const ops = [
    ['PLUS_ASSIGN', '+='], ['MINUS_ASSIGN', '-='], ['MULT_ASSIGN', '*='],
    ['DIVIDE_ASSIGN', '/='], ['MOD_ASSIGN', '%='], ['FLOORDIV_ASSIGN', '//='],
    ['POWER_ASSIGN', '**='],
  ];
  for (const [op, sym] of ops) {
    it(`daad_augmented_assign ${op} -> v ${sym} n`, () => {
      const code = codeOf(program(
        block('daad_augmented_assign', {
          fields: { VAR: 'س', OP: op },
          inputs: { VALUE: num(2) },
        })
      ));
      expect(code.trim()).toBe(`س ${sym} 2`);
    });
  }
});

describe('daad bitwise', () => {
  const ops = [
    ['AND', '&'], ['OR', '|'], ['XOR', '^'],
    ['LSHIFT', '<<'], ['RSHIFT', '>>'],
  ];
  for (const [op, sym] of ops) {
    it(`daad_bitwise ${op} -> (a ${sym} b)`, () => {
      expect(codeOf(program(
        block('daad_bitwise', {
          fields: { OP: op },
          inputs: { A: num(6), B: num(2) },
        })
      )).trim()).toBe(`(6 ${sym} 2)`);
    });
  }
  it('daad_bitwise_not -> (~x)', () => {
    expect(codeOf(program(block('daad_bitwise_not', { inputs: { VALUE: num(5) } }))).trim())
      .toBe('(~5)');
  });
});

describe('daad input', () => {
  it('daad_input -> ادخل(prompt)', () => {
    expect(codeOf(program(
      block('daad_input', { inputs: { PROMPT: text('ما اسمك؟ ') } })
    )).trim()).toBe('ادخل("ما اسمك؟ ")');
  });
  it('daad_input with no prompt -> ادخل("")', () => {
    expect(codeOf(program(block('daad_input'))).trim()).toBe('ادخل("")');
  });
});

describe('daad class / method / self / attr / instantiate', () => {
  it('daad_class -> صنف name:', () => {
    const code = codeOf(program(
      block('daad_class', {
        fields: { NAME: 'شخص' },
        inputs: { BODY: { block: block('daad_method', {
          fields: { NAME: 'تقديم', PARAMS: 'ذاتي' },
        }) } },
      })
    ));
    expect(code).toContain('صنف شخص:');
    expect(code).toContain('دالة تقديم(ذاتي):');
  });

  it('daad_self -> ذاتي', () => {
    expect(codeOf(program(block('daad_self'))).trim()).toBe('ذاتي');
  });

  it('daad_attr_get -> obj.attr', () => {
    const code = codeOf(program(
      block('daad_attr_get', {
        fields: { ATTR: 'اسم' },
        inputs: { OBJECT: { block: block('daad_self') } },
      })
    ));
    expect(code.trim()).toBe('ذاتي.اسم');
  });

  it('daad_attr_set -> obj.attr = value', () => {
    const code = codeOf(program(
      block('daad_attr_set', {
        fields: { ATTR: 'عمر' },
        inputs: { OBJECT: { block: block('daad_self') }, VALUE: num(25) },
      })
    ));
    expect(code.trim()).toBe('ذاتي.عمر = 25');
  });

  it('daad_instantiate -> Name(args)', () => {
    expect(codeOf(program(
      block('daad_instantiate', { fields: { NAME: 'شخص', ARGS: '"سامر", 25' } })
    )).trim()).toBe('شخص("سامر", 25)');
  });
});

describe('daad import', () => {
  it('daad_import -> استورد mod', () => {
    expect(codeOf(program(block('daad_import', { fields: { MODULE: 'random' } }))).trim())
      .toBe('استورد random');
  });
  it('daad_import_from -> من mod استورد name', () => {
    expect(codeOf(program(
      block('daad_import_from', { fields: { MODULE: 'math', NAME: 'جذر' } })
    )).trim()).toBe('من math استورد جذر');
  });
});