Blockly.Blocks['daad_str'] = {
  init: function() {
    this.appendDummyInput().appendField('نص');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip('يحول القيمة المدخلة إلى نص (String). استخدمه لتأكيد أن القيمة نصية.');
  }
};

Blockly.Blocks['daad_float'] = {
  init: function() {
    this.appendDummyInput().appendField('عشري');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('يحول القيمة إلى عدد عشري (float). مناسب للأرقام ذات الفاصلة.');
  }
};

Blockly.Blocks['daad_type'] = {
  init: function() {
    this.appendDummyInput().appendField('نوع');
    this.appendValueInput('VALUE');
    this.setOutput(true, 'String');
    this.setColour(210);
    this.setTooltip('يعطي نوع القيمة المدخلة (نص، عدد، قائمة...) ككلمة.');
  }
};

Blockly.Blocks['daad_list_get'] = {
  init: function() {
    this.appendValueInput('INDEX').setCheck('Number');
    this.appendDummyInput().appendField('][');
    this.appendValueInput('LIST');
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip('يأخذ عنصراً من قائمة باستخدام رقم الفهرس. العد يبدأ من 0.');
  }
};

Blockly.Blocks['daad_list_append'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('ق'), 'VAR')
      .appendField(new Blockly.FieldDropdown([
        ['اضف', 'APPEND'],
        ['ادفع', 'PUSH']
      ]), 'OP');
    this.appendValueInput('ITEM');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('يضيف عنصراً إلى نهاية قائمة. مثلاً: ق = اضف(ق, 3)');
  }
};

Blockly.Blocks['daad_list_pop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('ق'), 'VAR')
      .appendField('ازل');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('يزيل آخر عنصر من قائمة. مثلاً: ق = ازل(ق)');
  }
};

Blockly.Blocks['daad_list_copy'] = {
  init: function() {
    this.appendDummyInput().appendField('انسخ');
    this.appendValueInput('LIST');
    this.setOutput(true, 'Array');
    this.setColour(260);
    this.setTooltip('ينسخ قائمة (نسخة سطحية). مثلاً: ق2 = انسخ(ق)');
  }
};

Blockly.Blocks['daad_list_clear'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('ق'), 'VAR')
      .appendField('افرغ');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('يفرغ كل عناصر قائمة. مثلاً: ق = افرغ(ق)');
  }
};

Blockly.Blocks['daad_range'] = {
  init: function() {
    this.appendDummyInput().appendField('نطاق');
    this.appendValueInput('END').setCheck('Number');
    this.setOutput(true, 'Array');
    this.setColour(260);
    this.setTooltip('ينشئ قائمة أعداد صحيحة من 0 إلى العدد المطلوب (لا يشمل العدد). مفيد مع لكل.');
  }
};

Blockly.Blocks['daad_format'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('نسق')
      .appendField(new Blockly.FieldTextInput('الاسم: %ن'), 'TEMPLATE');
    this.appendValueInput('ARGS');
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip('ينسق نصاً باستخدام قوالب: %ن نص، %ر عدد صحيح، %ع عدد عشري، %م منطقي. مثلاً: نسق("عمرك %ر سنة", 25)');
  }
};

Blockly.Blocks['daad_dict'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('قاموس')
      .appendField(new Blockly.FieldTextInput('{}', function(v) { return v || '{}'; }), 'ITEMS');
    this.setOutput(true, null);
    this.setColour(300);
    this.setTooltip('ينشئ قاموساً (مفتاح: قيمة). اكتب المحتوى بين {} مثل: {"اسم": "أحمد"}');
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
    this.setTooltip('ينشئ مجموعة (tuple) ثابتة. لا يمكن تغيير محتوياتها بعد إنشائها.');
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
    this.setTooltip('يرفع الرقم الأول إلى قوة الرقم الثاني. مثلاً: 2 ** 3 = 8');
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
    this.setTooltip('يعطي باقي قسمة الرقم الأول على الثاني. مفيد لمعرفة إذا كان الرقم زوجياً أو فردياً.');
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
    this.setTooltip('يقسم الرقم الأول على الثاني مع تجاهل الباقي (قسمة صحيحة). مثلاً: 7 // 2 = 3');
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
    this.setTooltip('يتحقق إذا كان العنصر موجوداً داخل قائمة. يعطي صحيح أو خطأ.');
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
    this.setTooltip('تغيير قيمة متغير باستخدام عملية حسابية. مثلاً: س += 5 تعني س = س + 5');
  }
};

Blockly.Blocks['daad_input'] = {
  init: function() {
    this.appendValueInput('PROMPT').appendField('ادخل');
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip('يطلب من المستخدم إدخال نص. يمكن إضافة رسالة توضيحية في الحقل المتصل به.');
  }
};

Blockly.Blocks['daad_class'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('صنف')
      .appendField(new Blockly.FieldTextInput('MyClass'), 'NAME');
    this.appendStatementInput('BODY');
    this.setColour(300);
    this.setTooltip('يعرف صنفاً (class) جديداً. داخل الصنف يمكن إضافة دوال (طرق) ومتغيرات.');
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
    this.setTooltip('يعرف دالة (طريقة) داخل صنف. استخدم "ذاتي" للإشارة إلى الكائن الحالي.');
  }
};

Blockly.Blocks['daad_self'] = {
  init: function() {
    this.appendDummyInput().appendField('ذاتي');
    this.setOutput(true, null);
    this.setColour(300);
    this.setTooltip('يشير إلى الكائن الحالي داخل طرق (دوال) الصنف. مثلاً: ذاتي.اسم');
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
    this.setTooltip('يقرأ خاصية (attribute) من كائن. مثلاً: شخص.اسم');
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
    this.setTooltip('يغير قيمة خاصية في كائن. مثلاً: شخص.اسم = "أحمد"');
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
    this.setTooltip('ينشئ كائناً جديداً من صنف. يمكن تمرير معاملات للباني (_بناء_).');
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
    this.setTooltip('عمليات بتية (bitwise) على الأرقام. تستخدم للتعامل مع البتات في الذاكرة.');
  }
};

Blockly.Blocks['daad_bitwise_not'] = {
  init: function() {
    this.appendDummyInput().appendField('~');
    this.appendValueInput('VALUE');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setColour(230);
    this.setTooltip('عكس البتات (bitwise NOT). يقلب كل 0 إلى 1 وكل 1 إلى 0.');
  }
};

Blockly.Blocks['daad_import'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('استورد')
      .appendField(new Blockly.FieldTextInput('رياضيات'), 'MODULE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('يستورد مكتبة جاهزة لاستخدام دوالها. الوحدات المدمجة: رياضيات، عشوائي، وقت، نظام، مسار. أو ملف ضاد (.daad).');
  }
};

Blockly.Blocks['daad_import_from'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('من')
      .appendField(new Blockly.FieldTextInput('رياضيات'), 'MODULE')
      .appendField('استورد')
      .appendField(new Blockly.FieldTextInput('جذر'), 'NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('يستورد دالة محددة من مكتبة. مثلاً: من رياضيات استورد جذر');
  }
};
