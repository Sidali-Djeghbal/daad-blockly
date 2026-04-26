/* global Blockly */

Blockly.Blocks['daad_list'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('قائمة')
      .appendField(new Blockly.FieldTextInput('[]', function(v) { return v || '[]'; }), 'ITEMS');
    this.setOutput(true, 'Array');
    this.setColour(260);
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

Blockly.Blocks['daad_list_set'] = {
  init: function() {
    this.appendValueInput('INDEX').setCheck('Number');
    this.appendDummyInput().appendField('][');
    this.appendValueInput('LIST');
    this.appendDummyInput().appendField('=');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
  }
};

Blockly.Blocks['daad_len'] = {
  init: function() {
    this.appendDummyInput().appendField('طول');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'Number');
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