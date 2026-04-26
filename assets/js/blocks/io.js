/* global Blockly */

Blockly.Blocks['daad_print'] = {
  init: function() {
    this.appendValueInput('TEXT').appendField('اطبع');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
  }
};

Blockly.Blocks['text'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, 'String');
    this.setColour(160);
  }
};

Blockly.Blocks['daad_str'] = {
  init: function() {
    this.appendDummyInput().appendField('نص');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(160);
  }
};