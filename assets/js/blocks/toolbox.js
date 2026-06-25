window.DAAD_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    { kind: 'category', name: 'نص', colour: '#5C81A6', contents: [
      { kind: 'block', type: 'text' },
      { kind: 'block', type: 'text_print' },
      { kind: 'block', type: 'text_length' },
      { kind: 'block', type: 'text_join' },
      { kind: 'block', type: 'text_append' },
      { kind: 'block', type: 'daad_str' }
    ]},
    { kind: 'category', name: 'أرقام', colour: '#5CA65C', contents: [
      { kind: 'block', type: 'math_number' },
      { kind: 'block', type: 'math_arithmetic' },
      { kind: 'block', type: 'daad_power' },
      { kind: 'block', type: 'daad_modulo' },
      { kind: 'block', type: 'daad_floor_divide' },
      { kind: 'block', type: 'daad_float' }
    ]},
    { kind: 'category', name: 'منطق', colour: '#5C68A6', contents: [
      { kind: 'block', type: 'logic_boolean' },
      { kind: 'block', type: 'logic_compare' },
      { kind: 'block', type: 'logic_operation' },
      { kind: 'block', type: 'logic_negate' },
      { kind: 'block', type: 'daad_type' },
      { kind: 'block', type: 'daad_membership' }
    ]},
    { kind: 'category', name: 'قوائم', colour: '#9C6BC5', contents: [
      { kind: 'block', type: 'lists_create_with' },
      { kind: 'block', type: 'lists_create_empty' },
      { kind: 'block', type: 'daad_tuple' },
      { kind: 'block', type: 'daad_list_get' },
      { kind: 'block', type: 'lists_length' }
    ]},
    { kind: 'category', name: 'قاموس', colour: '#C56B6B', contents: [
      { kind: 'block', type: 'daad_dict' }
    ]},
    { kind: 'category', name: 'عوامل', colour: '#5CA6A6', contents: [
      { kind: 'block', type: 'daad_augmented_assign' },
      { kind: 'block', type: 'daad_bitwise' },
      { kind: 'block', type: 'daad_bitwise_not' }
    ]},
    { kind: 'category', name: 'تحكم', colour: '#C53030', contents: [
      { kind: 'block', type: 'controls_if' },
      { kind: 'block', type: 'controls_whileUntil' },
      { kind: 'block', type: 'controls_forEach' },
      { kind: 'block', type: 'controls_repeat_ext' },
      { kind: 'block', type: 'controls_flow_statements' }
    ]},
    { kind: 'category', name: 'دوال', colour: '#6BC5A0', contents: [
      { kind: 'block', type: 'procedures_defnoreturn' },
      { kind: 'block', type: 'procedures_defreturn' },
      { kind: 'block', type: 'procedures_ifreturn' },
      { kind: 'block', type: 'procedures_callnoreturn' },
      { kind: 'block', type: 'procedures_callreturn' }
    ]},
    { kind: 'category', name: 'متغيرات', colour: '#C5A06B', contents: [
      { kind: 'block', type: 'variables_get' },
      { kind: 'block', type: 'variables_set' }
    ]},
    { kind: 'category', name: 'دوال مدمجة', colour: '#C58B6B', contents: [
      { kind: 'block', type: 'daad_input' },
      { kind: 'block', type: 'daad_import' },
      { kind: 'block', type: 'daad_import_from' }
    ]},
    { kind: 'category', name: 'كائنات', colour: '#6B8BC5', contents: [
      { kind: 'block', type: 'daad_class' },
      { kind: 'block', type: 'daad_method' },
      { kind: 'block', type: 'daad_self' },
      { kind: 'block', type: 'daad_attr_get' },
      { kind: 'block', type: 'daad_attr_set' },
      { kind: 'block', type: 'daad_instantiate' }
    ]}
  ]
};
