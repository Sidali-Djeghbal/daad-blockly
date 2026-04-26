/* global Blockly */

window.DAAD_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    { kind: 'category', name: 'نص', colour: '#5C81A6', contents: [
      { kind: 'block', type: 'text' },
      { kind: 'block', type: 'daad_print' },
      { kind: 'block', type: 'daad_str' }
    ]},
    { kind: 'category', name: 'أرقام', colour: '#5CA65C', contents: [
      { kind: 'block', type: 'daad_number' },
      { kind: 'block', type: 'daad_arithmetic' },
      { kind: 'block', type: 'daad_int' },
      { kind: 'block', type: 'daad_float' },
      { kind: 'block', type: 'daad_range' }
    ]},
    { kind: 'category', name: 'منطق', colour: '#5C68A6', contents: [
      { kind: 'block', type: 'daad_boolean' },
      { kind: 'block', type: 'daad_compare' },
      { kind: 'block', type: 'daad_logic' },
      { kind: 'block', type: 'daad_not' },
      { kind: 'block', type: 'daad_type' }
    ]},
    { kind: 'category', name: 'قوائم', colour: '#9C6BC5', contents: [
      { kind: 'block', type: 'daad_list' },
      { kind: 'block', type: 'daad_list_get' },
      { kind: 'block', type: 'daad_list_set' },
      { kind: 'block', type: 'daad_len' }
    ]},
    { kind: 'category', name: 'قاموس', colour: '#C56B6B', contents: [
      { kind: 'block', type: 'daad_dict' }
    ]},
    { kind: 'category', name: 'تحكم', colour: '#C53030', contents: [
      { kind: 'block', type: 'daad_if' },
      { kind: 'block', type: 'daad_while' },
      { kind: 'block', type: 'daad_foreach' },
      { kind: 'block', type: 'daad_repeat' },
      { kind: 'block', type: 'daad_break' },
      { kind: 'block', type: 'daad_continue' }
    ]},
    { kind: 'category', name: 'دوال', colour: '#6BC5A0', contents: [
      { kind: 'block', type: 'daad_function' },
      { kind: 'block', type: 'daad_return' },
      { kind: 'block', type: 'daad_call' }
    ]},
    { kind: 'category', name: 'متغيرات', colour: '#C5A06B', contents: [
      { kind: 'block', type: 'daad_assign' },
      { kind: 'block', type: 'daad_var_get' }
    ]}
  ]
};