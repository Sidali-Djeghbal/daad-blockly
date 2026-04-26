/* global Blockly */

Blockly.Blocks['daad_number'] = {
  init: function() {
    this.appendDummyInput().appendField(new Blockly.FieldNumber(0), 'NUM');
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_arithmetic'] = {
  init: function() {
    this.appendValueInput('A');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['+', 'ADD'],
        ['-', 'MINUS'],
        ['×', 'MULTIPLY'],
        ['÷', 'DIVIDE']
      ]), 'OP');
    this.appendValueInput('B');
    this.setOutput(true, 'Number');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_int'] = {
  init: function() {
    this.appendDummyInput().appendField('صحيح');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'Number');
    this.setColour(230);
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

Blockly.Blocks['daad_range'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('نطاق')
      .appendField(new Blockly.FieldNumber(0), 'START')
      .appendField(':')
      .appendField(new Blockly.FieldNumber(10), 'STOP')
      .appendField(':')
      .appendField(new Blockly.FieldNumber(1), 'STEP');
    this.setOutput(true, 'Array');
    this.setColour(230);
  }
};

Blockly.Blocks['daad_type'] = {
  init: function() {
    this.appendDummyInput().appendField('نوع');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(230);
  }
};