/* global Blockly */

Blockly.Blocks['daad_boolean'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['صحيح', 'TRUE'],
        ['خطأ', 'FALSE']
      ]), 'BOOL');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

Blockly.Blocks['daad_compare'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['=', 'EQ'],
        ['≠', 'NEQ'],
        ['<', 'LT'],
        ['≤', 'LTE'],
        ['>', 'GT'],
        ['≥', 'GTE']
      ]), 'OP');
    this.appendValueInput('B');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

Blockly.Blocks['daad_logic'] = {
  init: function() {
    this.appendValueInput('A').setCheck('Boolean');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['و', 'AND'],
        ['أو', 'OR']
      ]), 'OP');
    this.appendValueInput('B').setCheck('Boolean');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

Blockly.Blocks['daad_not'] = {
  init: function() {
    this.appendValueInput('BOOL').setCheck('Boolean').appendField('ليس');
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};