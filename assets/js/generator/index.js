/* global Blockly */

(function() {
  if (typeof Blockly === 'undefined') return;

  var Daad = new Blockly.Generator('Daad');
  Daad.ORDER_ATOMIC = 0;
  Daad.ORDER_UNARY = 1;
  Daad.ORDER_MULTIPLICATIVE = 2;
  Daad.ORDER_ADDITIVE = 3;
  Daad.ORDER_RELATIONAL = 4;
  Daad.ORDER_LOGICAL = 5;

  Daad.scrub_ = function(block, code) {
    var next = block.nextConnection && block.nextConnection.targetBlock();
    return code + (next ? Daad.blockToCode(next) : '');
  };

  function q(s) {
    return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
  }

  function getOp(op) {
    var m = { ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/' };
    return m[op] || '+';
  }

  function getCompareOp(op) {
    var m = { EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
    return m[op] || '==';
  }

  function cleanVarName(name) {
    return (name || 'x').replace(/[^a-zA-Z0-9_ا-ي]/g, '_');
  }

  // Text & IO
  Daad.forBlock['text'] = function(b) { return [q(b.getFieldValue('TEXT') || ''), Daad.ORDER_ATOMIC]; };
  Daad.forBlock['daad_print'] = function(b) {
    return 'اطبع(' + (Daad.valueToCode(b, 'TEXT', Daad.ORDER_ATOMIC) || q('')) + ')\n';
  };
  Daad.forBlock['daad_str'] = function(b) {
    return ['نص(' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || q('')) + ')', Daad.ORDER_ATOMIC];
  };

  // Math
  Daad.forBlock['daad_number'] = function(b) { return [String(b.getFieldValue('NUM') || 0), Daad.ORDER_ATOMIC]; };
  Daad.forBlock['daad_arithmetic'] = function(b) {
    var op = getOp(b.getFieldValue('OP'));
    var a = Daad.valueToCode(b, 'A', Daad.ORDER_ATOMIC) || '0';
    var c = Daad.valueToCode(b, 'B', Daad.ORDER_ATOMIC) || '0';
    return ['(' + a + ' ' + op + ' ' + c + ')', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_int'] = function(b) {
    return ['صحيح(' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || '0') + ')', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_float'] = function(b) {
    return ['عشري(' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || '0') + ')', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_range'] = function(b) {
    var start = b.getFieldValue('START') || 0;
    var stop = b.getFieldValue('STOP') || 10;
    var step = b.getFieldValue('STEP') || 1;
    return ['نطاق(' + start + ', ' + stop + ', ' + step + ')', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_type'] = function(b) {
    return ['نوع(' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || 'عدم') + ')', Daad.ORDER_ATOMIC];
  };

  // Variables
  Daad.forBlock['daad_assign'] = function(b) {
    var name = cleanVarName(b.getFieldValue('VAR'));
    var value = Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || 'عدم';
    return name + ' = ' + value + '\n';
  };
  Daad.forBlock['daad_var_get'] = function(b) {
    return [cleanVarName(b.getFieldValue('VAR')), Daad.ORDER_ATOMIC];
  };

  // Lists
  Daad.forBlock['daad_list'] = function(b) { return [b.getFieldValue('ITEMS') || '[]', Daad.ORDER_ATOMIC]; };
  Daad.forBlock['daad_list_get'] = function(b) {
    var list = Daad.valueToCode(b, 'LIST', Daad.ORDER_ATOMIC) || '[]';
    var idx = Daad.valueToCode(b, 'INDEX', Daad.ORDER_ATOMIC) || '0';
    return [list + '[' + idx + ']', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_list_set'] = function(b) {
    var list = Daad.valueToCode(b, 'LIST', Daad.ORDER_ATOMIC) || '[]';
    var idx = Daad.valueToCode(b, 'INDEX', Daad.ORDER_ATOMIC) || '0';
    var val = Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || 'عدم';
    return list + '[' + idx + '] = ' + val + '\n';
  };
  Daad.forBlock['daad_len'] = function(b) {
    return ['طول(' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || '[]') + ')', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_dict'] = function(b) { return [b.getFieldValue('ITEMS') || '{}', Daad.ORDER_ATOMIC]; };

  // Logic
  Daad.forBlock['daad_boolean'] = function(b) {
    return [b.getFieldValue('BOOL') === 'TRUE' ? 'صحيح' : 'خطأ', Daad.ORDER_ATOMIC];
  };
  Daad.forBlock['daad_compare'] = function(b) {
    var op = getCompareOp(b.getFieldValue('OP'));
    var a = Daad.valueToCode(b, 'A', Daad.ORDER_ATOMIC) || '0';
    var c = Daad.valueToCode(b, 'B', Daad.ORDER_ATOMIC) || '0';
    return ['(' + c + ' ' + op + ' ' + a + ')', Daad.ORDER_RELATIONAL];
  };
  Daad.forBlock['daad_logic'] = function(b) {
    var op = b.getFieldValue('OP') === 'AND' ? ' و ' : ' او ';
    var a = Daad.valueToCode(b, 'A', Daad.ORDER_ATOMIC) || 'خطأ';
    var c = Daad.valueToCode(b, 'B', Daad.ORDER_ATOMIC) || 'خطأ';
    return ['(' + a + op + c + ')', Daad.ORDER_LOGICAL];
  };
  Daad.forBlock['daad_not'] = function(b) {
    return ['ليس(' + (Daad.valueToCode(b, 'BOOL', Daad.ORDER_UNARY) || 'خطأ') + ')', Daad.ORDER_UNARY];
  };

  // Control Flow
  Daad.forBlock['daad_if'] = function(b) {
    var cond = Daad.valueToCode(b, 'IF0', Daad.ORDER_ATOMIC) || 'خطأ';
    var then = Daad.statementToCode(b, 'DO0');
    var else_ = Daad.statementToCode(b, 'ELSE');
    return 'اذا ' + cond + ':\n' + then + 'والا:\n' + else_;
  };
  Daad.forBlock['daad_while'] = function(b) {
    var test = Daad.valueToCode(b, 'TEST', Daad.ORDER_ATOMIC) || 'خطأ';
    return 'طالما ' + test + ':\n' + Daad.statementToCode(b, 'DO');
  };
  Daad.forBlock['daad_foreach'] = function(b) {
    var item = b.getFieldValue('ITEM') || 'عنصر';
    var iter = Daad.valueToCode(b, 'ITER', Daad.ORDER_ATOMIC) || '[]';
    return 'لكل ' + item + ' في ' + iter + ':\n' + Daad.statementToCode(b, 'DO');
  };
  Daad.forBlock['daad_repeat'] = function(b) {
    var times = Daad.valueToCode(b, 'TIMES', Daad.ORDER_ATOMIC) || '0';
    return 'كرر ' + times + ' مرات:\n' + Daad.statementToCode(b, 'DO');
  };
  Daad.forBlock['daad_break'] = function() { return 'اكسر\n'; };
  Daad.forBlock['daad_continue'] = function() { return 'استمر\n'; };

  // Functions
  Daad.forBlock['daad_function'] = function(b) {
    var name = b.getFieldValue('NAME') || 'دالة';
    var params = b.getFieldValue('PARAMS') || '';
    return 'دالة ' + name + '(' + params + '):\n' + Daad.statementToCode(b, 'BODY');
  };
  Daad.forBlock['daad_return'] = function(b) {
    return 'ارجع ' + (Daad.valueToCode(b, 'VALUE', Daad.ORDER_ATOMIC) || 'عدم') + '\n';
  };
  Daad.forBlock['daad_call'] = function(b) {
    var func = b.getFieldValue('FUNC') || 'دالة';
    var args = b.getFieldValue('ARGS') || '';
    return [func + '(' + args + ')', Daad.ORDER_ATOMIC];
  };

  Blockly.Daad = Daad;
})();