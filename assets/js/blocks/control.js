/* global Blockly */

Blockly.Blocks['daad_if'] = {
  init: function() {
    this.appendValueInput('IF0').setCheck('Boolean').appendField('اذا');
    this.appendDummyInput().appendField(':');
    this.appendStatementInput('DO0');
    this.appendDummyInput('ELSE_INPUT').appendField('والا').appendField(':');
    this.appendStatementInput('ELSE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['daad_while'] = {
  init: function() {
    this.appendValueInput('TEST').setCheck('Boolean').appendField('طالما');
    this.appendDummyInput().appendField(':');
    this.appendStatementInput('DO');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['daad_foreach'] = {
  init: function() {
    this.appendDummyInput().appendField('لكل');
    this.appendDummyInput().appendField(new Blockly.FieldVariable('عنصر'), 'ITEM');
    this.appendDummyInput().appendField('في');
    this.appendValueInput('ITER').setCheck(['Array', 'String']);
    this.appendDummyInput().appendField(':');
    this.appendStatementInput('DO');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['daad_repeat'] = {
  init: function() {
    this.appendValueInput('TIMES').setCheck('Number').appendField('كرر');
    this.appendDummyInput().appendField('مرات:');
    this.appendStatementInput('DO');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['daad_break'] = {
  init: function() {
    this.appendDummyInput().appendField('اكسر');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};

Blockly.Blocks['daad_continue'] = {
  init: function() {
    this.appendDummyInput().appendField('استمر');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
  }
};