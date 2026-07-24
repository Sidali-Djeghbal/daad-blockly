window.DAAD_EXAMPLES_XML = {
  hello: {
    name: 'مرحباً بالعالم',
    desc: 'برنامج بسيط يطبع رسالة ترحيب',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<block type="text_print" x="20" y="20">' +
        '<value name="TEXT">' +
          '<block type="text">' +
            '<field name="TEXT">مرحباً بالعالم</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</xml>'
  },
  input: {
    name: 'المدخلات',
    desc: 'يطلب الاسم ويطبع تحية مخصصة',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<variables>' +
        '<variable id="var_name" type="">اسم</variable>' +
      '</variables>' +
      '<block type="variables_set" x="20" y="20">' +
        '<field name="VAR" id="var_name">اسم</field>' +
        '<value name="VALUE">' +
          '<block type="daad_input">' +
            '<value name="PROMPT">' +
              '<block type="text">' +
                '<field name="TEXT">ما اسمك؟ </field>' +
              '</block>' +
            '</value>' +
          '</block>' +
        '</value>' +
        '<next>' +
          '<block type="text_print">' +
            '<value name="TEXT">' +
              '<block type="text_join">' +
                '<value name="ADD0">' +
                  '<block type="text">' +
                    '<field name="TEXT">مرحباً </field>' +
                  '</block>' +
                '</value>' +
                '<value name="ADD1">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_name">اسم</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</value>' +
          '</block>' +
        '</next>' +
      '</block>' +
    '</xml>'
  },
  grades: {
    name: 'الدرجات',
    desc: 'يحدد التقدير بناءً على درجة الطالب',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<variables>' +
        '<variable id="var_grade" type="">درجة</variable>' +
      '</variables>' +
      '<block type="variables_set" x="20" y="20">' +
        '<field name="VAR" id="var_grade">درجة</field>' +
        '<value name="VALUE">' +
          '<block type="math_number">' +
            '<field name="NUM">85</field>' +
          '</block>' +
        '</value>' +
        '<next>' +
          '<block type="controls_if" x="20" y="80">' +
            '<mutation elseif="2" else="1"></mutation>' +
            '<value name="IF0">' +
              '<block type="logic_compare">' +
                '<field name="OP">GTE</field>' +
                '<value name="A">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_grade">درجة</field>' +
                  '</block>' +
                '</value>' +
                '<value name="B">' +
                  '<block type="math_number">' +
                    '<field name="NUM">90</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</value>' +
            '<statement name="DO0">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="text">' +
                    '<field name="TEXT">ممتاز</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</statement>' +
            '<value name="IF1">' +
              '<block type="logic_compare">' +
                '<field name="OP">GTE</field>' +
                '<value name="A">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_grade">درجة</field>' +
                  '</block>' +
                '</value>' +
                '<value name="B">' +
                  '<block type="math_number">' +
                    '<field name="NUM">75</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</value>' +
            '<statement name="DO1">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="text">' +
                    '<field name="TEXT">جيد جداً</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</statement>' +
            '<value name="IF2">' +
              '<block type="logic_compare">' +
                '<field name="OP">GTE</field>' +
                '<value name="A">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_grade">درجة</field>' +
                  '</block>' +
                '</value>' +
                '<value name="B">' +
                  '<block type="math_number">' +
                    '<field name="NUM">60</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</value>' +
            '<statement name="DO2">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="text">' +
                    '<field name="TEXT">جيد</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</statement>' +
            '<statement name="ELSE">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="text">' +
                    '<field name="TEXT">راسب</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</statement>' +
          '</block>' +
        '</next>' +
      '</block>' +
    '</xml>'
  },
  counting: {
    name: 'العد',
    desc: 'يعد من 1 إلى 5 باستخدام حلقة تكرار',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<variables>' +
        '<variable id="var_count" type="">عداد</variable>' +
      '</variables>' +
      '<block type="variables_set" x="20" y="20">' +
        '<field name="VAR" id="var_count">عداد</field>' +
        '<value name="VALUE">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<next>' +
          '<block type="controls_whileUntil" x="20" y="80">' +
            '<field name="MODE">WHILE</field>' +
            '<value name="BOOL">' +
              '<block type="logic_compare">' +
                '<field name="OP">LTE</field>' +
                '<value name="A">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_count">عداد</field>' +
                  '</block>' +
                '</value>' +
                '<value name="B">' +
                  '<block type="math_number">' +
                    '<field name="NUM">5</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</value>' +
            '<statement name="DO">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_count">عداد</field>' +
                  '</block>' +
                '</value>' +
                '<next>' +
                  '<block type="daad_augmented_assign">' +
                    '<field name="VAR">عداد</field>' +
                    '<field name="OP">PLUS_ASSIGN</field>' +
                    '<value name="VALUE">' +
                      '<block type="math_number">' +
                        '<field name="NUM">1</field>' +
                      '</block>' +
                    '</value>' +
                  '</block>' +
                '</next>' +
              '</block>' +
            '</statement>' +
          '</block>' +
        '</next>' +
      '</block>' +
    '</xml>'
  },
  lists: {
    name: 'القوائم',
    desc: 'يطبع أسماء من قائمة باستخدام حلقة لكل',
    xml: '<xml xmlns="https://developers.google.com/blockly/xml">' +
      '<variables>' +
        '<variable id="var_list" type="">أسماء</variable>' +
      '</variables>' +
      '<block type="variables_set" x="20" y="20">' +
        '<field name="VAR" id="var_list">أسماء</field>' +
        '<value name="VALUE">' +
          '<block type="lists_create_with" x="20" y="20">' +
            '<mutation items="3"></mutation>' +
            '<value name="ADD0">' +
              '<block type="text">' +
                '<field name="TEXT">علي</field>' +
              '</block>' +
            '</value>' +
            '<value name="ADD1">' +
              '<block type="text">' +
                '<field name="TEXT">أحمد</field>' +
              '</block>' +
            '</value>' +
            '<value name="ADD2">' +
              '<block type="text">' +
                '<field name="TEXT">مريم</field>' +
              '</block>' +
            '</value>' +
          '</block>' +
        '</value>' +
        '<next>' +
          '<block type="controls_forEach" x="20" y="80">' +
            '<field name="VAR" id="var_item">اسم</field>' +
            '<value name="LIST">' +
              '<block type="variables_get">' +
                '<field name="VAR" id="var_list">أسماء</field>' +
              '</block>' +
            '</value>' +
            '<statement name="DO">' +
              '<block type="text_print">' +
                '<value name="TEXT">' +
                  '<block type="variables_get">' +
                    '<field name="VAR" id="var_item">اسم</field>' +
                  '</block>' +
                '</value>' +
              '</block>' +
            '</statement>' +
          '</block>' +
        '</next>' +
      '</block>' +
    '</xml>'
  }
};

window.loadExample = function(key, workspace, updateCodeFn) {
  var ex = window.DAAD_EXAMPLES_XML && window.DAAD_EXAMPLES_XML[key];
  if (!ex) return;
  try {
    var parser = new DOMParser();
    var xml = parser.parseFromString(ex.xml, 'text/xml');
    Blockly.Xml.domToWorkspace(xml.documentElement, workspace);
    if (updateCodeFn) updateCodeFn();
  } catch (e) {
    alert('خطأ في تحميل المثال: ' + e.message);
  }
};