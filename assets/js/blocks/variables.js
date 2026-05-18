/* global Blockly */

Blockly.Blocks['daad_assign'] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('x'), 'VAR');
    this.appendDummyInput().appendField('=');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  }
};

Blockly.Blocks['daad_var_get'] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('x'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
  }
};