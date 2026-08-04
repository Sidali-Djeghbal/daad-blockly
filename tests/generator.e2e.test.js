import { describe, it, expect } from 'vitest';
import { codeOf, block, val, stmt, text, num, program, variable } from './setup.js';

describe('e2e: README hello example', () => {
  it('print -> input -> print', () => {
    // اطبع("مرحباً بك في لغة ضاد!")
    // الاسم = ادخل("ما اسمك؟ ")
    // اطبع("أهلاً، " + الاسم)
    const v = variable('الاسم', 'v1');
    const code = codeOf({
      variables: [v],
      blocks: {
        languageVersion: 0,
        blocks: [
          block('text_print', {
            inputs: { TEXT: text('مرحباً بك في لغة ضاد!') },
            next: block('variables_set', {
              fields: { VAR: { id: 'v1', name: 'الاسم' } },
              inputs: {
                VALUE: val(block('daad_input', {
                  inputs: { PROMPT: text('ما اسمك؟ ') },
                })),
              },
              next: block('text_print', {
                inputs: {
                  TEXT: val(block('text_join', {
                    extraState: { itemCount: 2 },
                    inputs: {
                      ADD0: text('أهلاً، '),
                      ADD1: val(block('variables_get', {
                        fields: { VAR: { id: 'v1', name: 'الاسم' } },
                      })),
                    },
                  })),
                },
              }),
            }),
          }),
        ],
      },
    });
    expect(code).toContain('اطبع("مرحباً بك في لغة ضاد!")');
    expect(code).toContain('الاسم = ادخل("ما اسمك؟ ")');
    expect(code).toContain('اطبع(("أهلاً، " + الاسم))');
  });
});

describe('e2e: number-guess example skeleton', () => {
  it('while + if + break + else', () => {
    // طالما المحاولات > 0:
    //   اذا التخمين == الرقم_السري:
    //     اطبع("أحسنت! لقد فزت")
    //     اخرج
    //   والا:
    //     المحاولات = المحاولات - 1
    const attempts = variable('المحاولات', 'a');
    const secret = variable('الرقم_السري', 's');
    const guess = variable('التخمين', 'g');
    const vars = [attempts, secret, guess];

    const code = codeOf({
      variables: vars,
      blocks: {
        languageVersion: 0,
        blocks: [
          block('controls_whileUntil', {
            fields: { MODE: 'WHILE' },
            inputs: {
              BOOL: val(block('logic_compare', {
                fields: { OP: 'GT' },
                inputs: {
                  A: val(block('variables_get', { fields: { VAR: { id: 'a', name: 'المحاولات' } } })),
                  B: num(0),
                },
              })),
              DO: stmt(block('controls_if', {
                extraState: { hasElse: true },
                inputs: {
                  IF0: val(block('logic_compare', {
                    fields: { OP: 'EQ' },
                    inputs: {
                      A: val(block('variables_get', { fields: { VAR: { id: 'g', name: 'التخمين' } } })),
                      B: val(block('variables_get', { fields: { VAR: { id: 's', name: 'الرقم_السري' } } })),
                    },
                  })),
                  DO0: stmt(block('text_print', {
                    inputs: { TEXT: text('أحسنت! لقد فزت') },
                    next: block('controls_flow_statements', { fields: { FLOW: 'BREAK' } }),
                  })),
                  ELSE: stmt(block('variables_set', {
                    fields: { VAR: { id: 'a', name: 'المحاولات' } },
                    inputs: {
                      VALUE: val(block('math_arithmetic', {
                        fields: { OP: 'MINUS' },
                        inputs: {
                          A: val(block('variables_get', { fields: { VAR: { id: 'a', name: 'المحاولات' } } })),
                          B: num(1),
                        },
                      })),
                    },
                  })),
                },
              })),
            },
          }),
        ],
      },
    });

    expect(code).toContain('طالما ((المحاولات > 0)):');
    expect(code).toContain('اذا ((التخمين == الرقم_السري)):');
    expect(code).toContain('اطبع("أحسنت! لقد فزت")');
    expect(code).toContain('اخرج');
    expect(code).toContain('والا:');
    expect(code).toContain('المحاولات = (المحاولات - 1)');
  });
});

describe('e2e: OOP class example skeleton', () => {
  it('class with __init__ + method', () => {
    // صنف شخص:
    //   دالة __init__(ذاتي, اسم, عمر):
    //     ذاتي.اسم = اسم
    //     ذاتي.عمر = عمر
    const code = codeOf(program(
      block('daad_class', {
        fields: { NAME: 'شخص' },
        inputs: {
          BODY: stmt(block('daad_method', {
            fields: { NAME: '__init__', PARAMS: 'ذاتي, اسم, عمر' },
            inputs: {
              STACK: stmt(block('daad_attr_set', {
                fields: { ATTR: 'اسم' },
                inputs: {
                  OBJECT: val(block('daad_self')),
                  VALUE: val(block('variables_get', { fields: { VAR: { id: 'nm', name: 'اسم' } } })),
                },
                next: block('daad_attr_set', {
                  fields: { ATTR: 'عمر' },
                  inputs: {
                    OBJECT: val(block('daad_self')),
                    VALUE: val(block('variables_get', { fields: { VAR: { id: 'ag', name: 'عمر' } } })),
                  },
                }),
              })),
            },
          })),
        },
      }),
      [variable('اسم', 'nm'), variable('عمر', 'ag')]
    ));
    expect(code).toContain('صنف شخص:');
    expect(code).toContain('دالة __init__(ذاتي, اسم, عمر):');
    expect(code).toContain('ذاتي.اسم = اسم');
    expect(code).toContain('ذاتي.عمر = عمر');
  });
});