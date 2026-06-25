Blockly.Blocks['daad_str'] = {
  init: function() {
    this.appendDummyInput().appendField('نص');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(160);
  }
};

Blockly.Blocks['daad_float'] = {
  init: function() {
    this.appendDummyInput().appendField('عشري');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_type'] = {
  init: function() {
    this.appendDummyInput().appendField('نوع');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(210);
  }
};

Blockly.Blocks['daad_list_get'] = {
  init: function() {
    this.appendValueInput('INDEX').setCheck('Number');
    this.appendDummyInput().appendField('][');
    this.appendValueInput('LIST');
    this.setOutput(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['daad_dict'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('قاموس')
      .appendField(new Blockly.FieldTextInput('{}', function(v) { return v || '{}'; }), 'ITEMS');
    this.setOutput(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_tuple'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('(')
      .appendField(new Blockly.FieldTextInput('1, 2, 3'), 'ITEMS')
      .appendField(')');
    this.setOutput(true, 'Array');
    this.setColour(260);
  }
};

Blockly.Blocks['daad_power'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput().appendField('**');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_modulo'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput().appendField('%');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_floor_divide'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput().appendField('//');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_membership'] = {
  init: function() {
    this.appendValueInput('ITEM');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['في', 'IN']
      ]), 'OP');
    this.appendValueInput('LIST');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

Blockly.Blocks['daad_augmented_assign'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('x'), 'VAR')
      .appendField(new Blockly.FieldDropdown([
        ['+=', 'PLUS_ASSIGN'],
        ['-=', 'MINUS_ASSIGN'],
        ['*=', 'MULT_ASSIGN'],
        ['/=', 'DIVIDE_ASSIGN'],
        ['%=', 'MOD_ASSIGN'],
        ['//=', 'FLOORDIV_ASSIGN'],
        ['**=', 'POWER_ASSIGN']
      ]), 'OP');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.Blocks['daad_input'] = {
  init: function() {
    this.appendValueInput('PROMPT').appendField('ادخل');
    this.setOutput(true, 'String');
    this.setColour(160);
  }
};

Blockly.Blocks['daad_class'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('صنف')
      .appendField(new Blockly.FieldTextInput('MyClass'), 'NAME');
    this.appendStatementInput('BODY');
    this.setColour(300);
  }
};

Blockly.Blocks['daad_method'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('دالة')
      .appendField(new Blockly.FieldTextInput('methodName'), 'NAME')
      .appendField('(')
      .appendField(new Blockly.FieldTextInput('ذاتي'), 'PARAMS')
      .appendField(')');
    this.appendStatementInput('STACK');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_self'] = {
  init: function() {
    this.appendDummyInput().appendField('ذاتي');
    this.setOutput(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_attr_get'] = {
  init: function() {
    this.appendValueInput('OBJECT');
    this.appendDummyInput()
      .appendField('.')
      .appendField(new Blockly.FieldTextInput('attr'), 'ATTR');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_attr_set'] = {
  init: function() {
    this.appendValueInput('OBJECT');
    this.appendDummyInput()
      .appendField('.')
      .appendField(new Blockly.FieldTextInput('attr'), 'ATTR')
      .appendField('=');
    this.appendValueInput('VALUE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_instantiate'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('ClassName'), 'NAME')
      .appendField('(')
      .appendField(new Blockly.FieldTextInput(''), 'ARGS')
      .appendField(')');
    this.setOutput(true, null);
    this.setColour(300);
  }
};

Blockly.Blocks['daad_bitwise'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['&', 'AND'],
        ['|', 'OR'],
        ['^', 'XOR'],
        ['<<', 'LSHIFT'],
        ['>>', 'RSHIFT']
      ]), 'OP');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_bitwise_not'] = {
  init: function() {
    this.appendDummyInput().appendField('~');
    this.appendValueInput('VALUE');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_import'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('استورد')
      .appendField(new Blockly.FieldTextInput('math'), 'MODULE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
  }
};

Blockly.Blocks['daad_import_from'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('من')
      .appendField(new Blockly.FieldTextInput('math'), 'MODULE')
      .appendField('استورد')
      .appendField(new Blockly.FieldTextInput('جذر'), 'NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
  }
};
