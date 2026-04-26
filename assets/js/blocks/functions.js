/* global Blockly */

Blockly.Blocks['daad_function'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('دالة')
      .appendField(new Blockly.FieldTextInput('اسم_الدالة'), 'NAME')
      .appendField(')')
      .appendField(new Blockly.FieldTextInput('a, b'), 'PARAMS')
      .appendField('(');
    this.appendStatementInput('BODY');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  }
};

Blockly.Blocks['daad_return'] = {
  init: function() {
    this.appendDummyInput().appendField('ارجع');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  }
};

Blockly.Blocks['daad_call'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('اسم_الدالة'), 'FUNC')
      .appendField(')')
      .appendField(new Blockly.FieldTextInput('a, b'), 'ARGS')
      .appendField('(');
    this.setOutput(true, null);
    this.setColour(290);
  }
};