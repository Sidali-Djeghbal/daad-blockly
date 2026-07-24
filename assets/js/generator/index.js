var Daad = new Blockly.CodeGenerator('Daad');
Daad.ORDER_ATOMIC = 0;

Daad.RESERVED_WORDS_ = 'اذا,واذا,والا,طالما,لكل,كرر,مرات,في,اطبع,دالة,ارجع,أرجع,صحيح,خطأ,ليس,لا,نوع,طول,نص,عشري,اخرج,أخرج,تابع,و,أو,او,صنف,فئة,ادخل,ذاتي,هذا,استورد,من';

Daad.init = function(workspace) {
  Blockly.CodeGenerator.prototype.init.call(this, workspace);
  this.workspace_ = workspace;
  this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
  this.nameDB_.setVariableMap(workspace.getVariableMap());
  this.nameDB_.populateVariables(workspace);
  this.nameDB_.populateProcedures(workspace);
  this.isInitialized = true;
};

Daad.getVariableName = function(name) {
  if (this.workspace_) {
    var map = this.workspace_.getVariableMap();
    if (map) {
      var v = map.getVariableById(name);
      if (v) return v.name;
    }
  }
  return name;
};
Daad.ORDER_UNARY = 1;
Daad.ORDER_MULTIPLICATIVE = 2;
Daad.ORDER_ADDITIVE = 3;
Daad.ORDER_RELATIONAL = 4;
Daad.ORDER_LOGICAL = 5;

Daad.scrub_ = function(block, code) {
  var next = block.getNextBlock();
  return code + (next ? this.blockToCode(next) : '');
};

function q(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}

function getArithOp(op) {
  var m = { ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/' };
  return m[op] || '+';
}

function getCompareOp(op) {
  var m = { EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
  return m[op] || '==';
}

// --- Standard Text Blocks ---
Daad.forBlock['text'] = function(block) {
  return [q(block.getFieldValue('TEXT') || ''), Daad.ORDER_ATOMIC];
};

Daad.forBlock['text_print'] = function(block, generator) {
  return 'اطبع(' + (generator.valueToCode(block, 'TEXT', Daad.ORDER_ATOMIC) || q('')) + ')\n';
};

Daad.forBlock['text_length'] = function(block, generator) {
  return ['طول(' + (generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || q('')) + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['text_join'] = function(block, generator) {
  var code = generator.valueToCode(block, 'ADD0', Daad.ORDER_ATOMIC) || q('');
  for (var n = 1; block.getInput('ADD' + n); n++) {
    code += ' + ' + (generator.valueToCode(block, 'ADD' + n, Daad.ORDER_ATOMIC) || q(''));
  }
  return [code, Daad.ORDER_ADDITIVE];
};

Daad.forBlock['text_append'] = function(block, generator) {
  var varName = generator.getVariableName(block.getFieldValue('VAR'));
  var value = generator.valueToCode(block, 'TEXT', Daad.ORDER_ATOMIC) || q('');
  return varName + ' = ' + varName + ' + ' + value + '\n';
};

// --- Standard Math Blocks ---
Daad.forBlock['math_number'] = function(block) {
  return [String(block.getFieldValue('NUM') || 0), Daad.ORDER_ATOMIC];
};

Daad.forBlock['math_arithmetic'] = function(block, generator) {
  var op = getArithOp(block.getFieldValue('OP'));
  var a = generator.valueToCode(block, 'A', Daad.ORDER_MULTIPLICATIVE) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_MULTIPLICATIVE) || '0';
  return ['(' + a + ' ' + op + ' ' + b + ')', Daad.ORDER_ATOMIC];
};

// --- Standard Logic Blocks ---
Daad.forBlock['logic_boolean'] = function(block) {
  return [block.getFieldValue('BOOL') === 'TRUE' ? 'صحيح' : 'خطأ', Daad.ORDER_ATOMIC];
};

Daad.forBlock['logic_compare'] = function(block, generator) {
  var op = getCompareOp(block.getFieldValue('OP'));
  var a = generator.valueToCode(block, 'A', Daad.ORDER_RELATIONAL) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_RELATIONAL) || '0';
  return ['(' + a + ' ' + op + ' ' + b + ')', Daad.ORDER_RELATIONAL];
};

Daad.forBlock['logic_operation'] = function(block, generator) {
  var op = block.getFieldValue('OP') === 'AND' ? ' و ' : ' أو ';
  var a = generator.valueToCode(block, 'A', Daad.ORDER_LOGICAL) || 'خطأ';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_LOGICAL) || 'خطأ';
  return ['(' + a + op + b + ')', Daad.ORDER_LOGICAL];
};

Daad.forBlock['logic_negate'] = function(block, generator) {
  return ['ليس(' + (generator.valueToCode(block, 'BOOL', Daad.ORDER_UNARY) || 'خطأ') + ')', Daad.ORDER_UNARY];
};

// --- Standard Control Blocks ---
Daad.forBlock['controls_if'] = function(block, generator) {
  var code = '';
  var n = 0;
  var hasElse = block.elseCount_ > 0;

  var cond = generator.valueToCode(block, 'IF' + n, Daad.ORDER_ATOMIC) || 'خطأ';
  var branch = generator.statementToCode(block, 'DO' + n) || '';
  code += 'اذا ' + cond + ':\n' + branch;
  n++;

  for (; n <= (block.elseifCount_ || 0); n++) {
    cond = generator.valueToCode(block, 'IF' + n, Daad.ORDER_ATOMIC) || 'خطأ';
    branch = generator.statementToCode(block, 'DO' + n) || '';
    code += 'واذا ' + cond + ':\n' + branch;
  }

  if (hasElse) {
    branch = generator.statementToCode(block, 'ELSE') || '';
    code += 'والا:\n' + branch;
  }

  return code;
};

Daad.forBlock['controls_whileUntil'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  var test = generator.valueToCode(block, 'BOOL', Daad.ORDER_ATOMIC) || 'خطأ';
  if (mode === 'UNTIL') {
    return 'طالما ليس(' + test + '):\n' + generator.statementToCode(block, 'DO');
  }
  return 'طالما ' + test + ':\n' + generator.statementToCode(block, 'DO');
};

Daad.forBlock['controls_forEach'] = function(block, generator) {
  var item = generator.getVariableName(block.getFieldValue('VAR'));
  var list = generator.valueToCode(block, 'LIST', Daad.ORDER_ATOMIC) || '[]';
  return 'لكل ' + item + ' في ' + list + ':\n' + generator.statementToCode(block, 'DO');
};

Daad.forBlock['controls_repeat_ext'] = function(block, generator) {
  var times = generator.valueToCode(block, 'TIMES', Daad.ORDER_ATOMIC) || '0';
  return 'كرر ' + times + ' مرات:\n' + generator.statementToCode(block, 'DO');
};

Daad.forBlock['controls_flow_statements'] = function(block) {
  var op = block.getFieldValue('FLOW');
  if (op === 'BREAK') return 'اخرج\n';
  if (op === 'CONTINUE') return 'تابع\n';
  return '';
};

// --- Standard Variables Blocks ---
Daad.forBlock['variables_get'] = function(block, generator) {
  return [generator.getVariableName(block.getFieldValue('VAR')), Daad.ORDER_ATOMIC];
};

Daad.forBlock['variables_set'] = function(block, generator) {
  var name = generator.getVariableName(block.getFieldValue('VAR'));
  var value = generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '0';
  return name + ' = ' + value + '\n';
};

// --- Standard Procedure Blocks ---
Daad.forBlock['procedures_defnoreturn'] = function(block, generator) {
  var name = generator.getProcedureName(block.getFieldValue('NAME'));
  var params = '';
  var paramList = block.getParameters();
  for (var i = 0; i < paramList.length; i++) {
    params += (params ? ', ' : '') + paramList[i].getName();
  }
  return 'دالة ' + name + '(' + params + '):\n' + generator.statementToCode(block, 'STACK');
};

Daad.forBlock['procedures_defreturn'] = function(block, generator) {
  var name = generator.getProcedureName(block.getFieldValue('NAME'));
  var params = '';
  var paramList = block.getParameters();
  for (var i = 0; i < paramList.length; i++) {
    params += (params ? ', ' : '') + paramList[i].getName();
  }
  var code = 'دالة ' + name + '(' + params + '):\n' + generator.statementToCode(block, 'STACK');
  var returnValue = generator.valueToCode(block, 'RETURN', Daad.ORDER_ATOMIC) || '0';
  if (returnValue) code += 'ارجع ' + returnValue + '\n';
  return code;
};

Daad.forBlock['procedures_ifreturn'] = function(block, generator) {
  var cond = generator.valueToCode(block, 'CONDITION', Daad.ORDER_ATOMIC) || 'خطأ';
  var value = generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC);
  var code = 'اذا ' + cond + ':\n';
  if (value) {
    code += '  ارجع ' + value + '\n';
  } else {
    code += '  ارجع\n';
  }
  return code;
};

Daad.forBlock['procedures_callnoreturn'] = function(block, generator) {
  var name = generator.getProcedureName(block.getFieldValue('NAME'));
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args.push(generator.valueToCode(block, 'ARG' + i, Daad.ORDER_ATOMIC) || '0');
  }
  return name + '(' + args.join(', ') + ')\n';
};

Daad.forBlock['procedures_callreturn'] = function(block, generator) {
  var name = generator.getProcedureName(block.getFieldValue('NAME'));
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args.push(generator.valueToCode(block, 'ARG' + i, Daad.ORDER_ATOMIC) || '0');
  }
  return [name + '(' + args.join(', ') + ')', Daad.ORDER_ATOMIC];
};

// --- Standard List Blocks ---
Daad.forBlock['lists_create_with'] = function(block, generator) {
  var items = [];
  for (var i = 0; i < block.itemCount_; i++) {
    items.push(generator.valueToCode(block, 'ADD' + i, Daad.ORDER_ATOMIC) || '0');
  }
  return ['[' + items.join(', ') + ']', Daad.ORDER_ATOMIC];
};

Daad.forBlock['lists_create_empty'] = function() {
  return ['[]', Daad.ORDER_ATOMIC];
};

Daad.forBlock['lists_length'] = function(block, generator) {
  return ['طول(' + (generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '[]') + ')', Daad.ORDER_ATOMIC];
};

// --- Custom Daad Blocks ---
Daad.forBlock['daad_str'] = function(block, generator) {
  return ['نص(' + (generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || q('')) + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_float'] = function(block, generator) {
  return ['عشري(' + (generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '0') + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_type'] = function(block, generator) {
  return ['نوع(' + (generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '0') + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_list_get'] = function(block, generator) {
  var list = generator.valueToCode(block, 'LIST', Daad.ORDER_ATOMIC) || '[]';
  var idx = generator.valueToCode(block, 'INDEX', Daad.ORDER_ATOMIC) || '0';
  return [list + '[' + idx + ']', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_dict'] = function(block) {
  return [block.getFieldValue('ITEMS') || '{}', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_tuple'] = function(block) {
  return ['(' + (block.getFieldValue('ITEMS') || '') + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_power'] = function(block, generator) {
  var a = generator.valueToCode(block, 'A', Daad.ORDER_MULTIPLICATIVE) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_MULTIPLICATIVE) || '0';
  return ['(' + a + ' ** ' + b + ')', Daad.ORDER_MULTIPLICATIVE];
};

Daad.forBlock['daad_modulo'] = function(block, generator) {
  var a = generator.valueToCode(block, 'A', Daad.ORDER_MULTIPLICATIVE) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_MULTIPLICATIVE) || '0';
  return ['(' + a + ' % ' + b + ')', Daad.ORDER_MULTIPLICATIVE];
};

Daad.forBlock['daad_floor_divide'] = function(block, generator) {
  var a = generator.valueToCode(block, 'A', Daad.ORDER_MULTIPLICATIVE) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_MULTIPLICATIVE) || '0';
  return ['(' + a + ' // ' + b + ')', Daad.ORDER_MULTIPLICATIVE];
};

Daad.forBlock['daad_membership'] = function(block, generator) {
  var item = generator.valueToCode(block, 'ITEM', Daad.ORDER_RELATIONAL) || '0';
  var list = generator.valueToCode(block, 'LIST', Daad.ORDER_RELATIONAL) || '[]';
  return ['(' + item + ' في ' + list + ')', Daad.ORDER_RELATIONAL];
};

Daad.forBlock['daad_augmented_assign'] = function(block, generator) {
  var varName = generator.getVariableName(block.getFieldValue('VAR'));
  var opMap = {
    'PLUS_ASSIGN': '+=',
    'MINUS_ASSIGN': '-=',
    'MULT_ASSIGN': '*=',
    'DIVIDE_ASSIGN': '/=',
    'MOD_ASSIGN': '%=',
    'FLOORDIV_ASSIGN': '//=',
    'POWER_ASSIGN': '**='
  };
  var op = opMap[block.getFieldValue('OP')] || '+=';
  var value = generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '0';
  return varName + ' ' + op + ' ' + value + '\n';
};

Daad.forBlock['daad_input'] = function(block, generator) {
  var prompt = generator.valueToCode(block, 'PROMPT', Daad.ORDER_ATOMIC) || q('');
  return ['ادخل(' + prompt + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_class'] = function(block, generator) {
  var name = block.getFieldValue('NAME');
  var body = generator.statementToCode(block, 'BODY') || '';
  return 'صنف ' + name + ':\n' + body;
};

Daad.forBlock['daad_method'] = function(block, generator) {
  var name = block.getFieldValue('NAME');
  var params = block.getFieldValue('PARAMS') || 'ذاتي';
  return 'دالة ' + name + '(' + params + '):\n' + generator.statementToCode(block, 'STACK');
};

Daad.forBlock['daad_self'] = function() {
  return ['ذاتي', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_attr_get'] = function(block, generator) {
  var obj = generator.valueToCode(block, 'OBJECT', Daad.ORDER_ATOMIC) || '0';
  var attr = block.getFieldValue('ATTR') || 'attr';
  return [obj + '.' + attr, Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_attr_set'] = function(block, generator) {
  var obj = generator.valueToCode(block, 'OBJECT', Daad.ORDER_ATOMIC) || '0';
  var attr = block.getFieldValue('ATTR') || 'attr';
  var value = generator.valueToCode(block, 'VALUE', Daad.ORDER_ATOMIC) || '0';
  return obj + '.' + attr + ' = ' + value + '\n';
};

Daad.forBlock['daad_instantiate'] = function(block) {
  var name = block.getFieldValue('NAME');
  var args = block.getFieldValue('ARGS') || '';
  return [name + '(' + args + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_bitwise'] = function(block, generator) {
  var opMap = {
    'AND': ' & ',
    'OR': ' | ',
    'XOR': ' ^ ',
    'LSHIFT': ' << ',
    'RSHIFT': ' >> '
  };
  var op = opMap[block.getFieldValue('OP')] || ' & ';
  var a = generator.valueToCode(block, 'A', Daad.ORDER_ADDITIVE) || '0';
  var b = generator.valueToCode(block, 'B', Daad.ORDER_ADDITIVE) || '0';
  return ['(' + a + op + b + ')', Daad.ORDER_ATOMIC];
};

Daad.forBlock['daad_bitwise_not'] = function(block, generator) {
  var value = generator.valueToCode(block, 'VALUE', Daad.ORDER_UNARY) || '0';
  return ['(~' + value + ')', Daad.ORDER_UNARY];
};

Daad.forBlock['daad_import'] = function(block) {
  var mod = block.getFieldValue('MODULE') || 'math';
  return 'استورد ' + mod + '\n';
};

Daad.forBlock['daad_import_from'] = function(block) {
  var mod = block.getFieldValue('MODULE') || 'math';
  var name = block.getFieldValue('NAME') || 'جذر';
  return 'من ' + mod + ' استورد ' + name + '\n';
};

Blockly.Daad = Daad;
