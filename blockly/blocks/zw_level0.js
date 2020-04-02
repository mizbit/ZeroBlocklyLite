'use strict';

goog.provide('Blockly.Blocks.level0');
goog.require('Blockly.Blocks');

Blockly.Blocks.level0.HUE = 210;
var a = -1;
var twice = -1;
var z = 0;

var aggregate = [];
var oldHeight = 62;

Blockly.Blocks['test'] = {
	init: function() {
		this.appendDummyInput().appendField('抓取目标')
			.appendField(new Blockly.FieldImage("http://ozoblockly.com/media/inline-block-icons/color-LED-rainbow.svg", 23, 35, "")).appendField('抓取目标');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};

Blockly.Blocks['isAuto'] = {
	init: function() {
		this.appendDummyInput().appendField('已进入巡线模式');
		this.setOutput(true,null);
		this.setColour('#6caa1c');
		this.setTooltip('');
	}
};

Blockly.Blocks['pawOpen'] = {
	init: function() {
		this.appendDummyInput().appendField('  张开机械抓手');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/pawOpen.png", 100, 65, ""))
		this.setColour("#017DC7");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['pawClose'] = {
	init: function() {
		this.appendDummyInput().appendField('  关闭机械抓手');
		this.appendDummyInput().appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/pawClose.png',100,65,''));
		this.setColour("#017DC7");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};
Blockly.Blocks['pawUp'] = {
	init: function() {
		this.appendDummyInput().appendField('  机械抓手提升');
		this.appendDummyInput().appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/pawUp.png',100,65));
		this.setColour("#017DC7");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};
Blockly.Blocks['pawDown'] = {
	init: function() {
		this.appendDummyInput().appendField('  机械抓手下降');
		this.appendDummyInput().appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/pawDown.png',100,65));
		this.setColour("#017DC7");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['colorChoose'] = {
  /**	
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour('#7C163E');
	this.appendDummyInput("").appendField('选择球的颜色有');
//      .appendField(new Blockly.FieldDropdown([[Blockly.LANG_MATH_INT, 'long'],[Blockly.LANG_MATH_FLOAT, 'float'],[Blockly.LANG_MATH_CHAR, 'char']]), "TYPE")
//      .appendField(' ')
//      .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
//      .appendField('[')
//      .appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
//      .appendField(']')
        ;
    this.itemCount_ = 3;
    this.updateShape_();
//  this.setPreviousStatement(true);
//  this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
//        .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE)
          ;
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
//        input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH)
          ;
        }
      }
    }
  }
};

//Blockly.Blocks['colorChoose'] = {
//init: function() {
//  this.setColour(Blockly.Blocks.loops.HUE);
//  this.appendValueInput('colorValue')
//	    .appendField('识别球的颜色');
//	
//		this.setNextStatement(true, null);
//}
//
//
//};

Blockly.Blocks['level_s'] = {
	init: function() {
		this.appendDummyInput().appendField('S级的程序');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/level_s.png", 60, 60, ""));
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_motor'] = {
	init: function() {
		this.appendDummyInput().appendField('左边马达以').appendField(new Blockly.FieldTextInput('255'),'motorSpeed').appendField('的速度').appendField(new Blockly.FieldDropdown([
				['顺时针','FORWARD'],
				['逆时针','BACKWARD']
		]),'direction');
		this.setColour("#E5A811");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['right_motor'] = {
	init: function() {
		this.appendDummyInput().appendField('右边马达以').appendField(new Blockly.FieldTextInput('255'),'motorSpeed').appendField('的速度').appendField(new Blockly.FieldDropdown([
				['顺时针','FORWARD'],
				['逆时针','BACKWARD']
		]),'direction');
		this.setColour("#E5A811");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['lfet_punches'] = {
	init: function() {
		this.appendDummyInput().appendField('机器人左拳出击');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lfet_punches.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['lfet_takeAFist'] = {
	init: function() {
		this.appendDummyInput().appendField('机器人左拳回收');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lfet_takeAFist.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['right_punches'] = {
	init: function() {
		this.appendDummyInput().appendField('机器人右拳出击');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/right_punches.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['right_takeAFist'] = {
	init: function() {
		this.appendDummyInput().appendField('机器人右拳回收');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/right_takeAFist.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['loadingCarriage'] = {
	init: function() {
		this.appendDummyInput().appendField('装载卡车的车厢');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/loadingCarriage.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['unloadingCarriage'] = {
	init: function() {
		this.appendDummyInput().appendField('卸载卡车的车厢');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/unloadingCarriage.png", 100, 80, ""));
		this.setColour("#f08300");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('');
	}
};

Blockly.Blocks['bollColor'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldDropdown([
									["红色", "RED"],
									["橙色", "ORANGE"],
									["黄色", "YELLOW"],
									["绿色", "GREEN"],
									["蓝色", "BLUE"],
									["紫色", "PURPLE"],
									["粉红", "PINK"]
								]),'bollColor');
		this.setOutput(true, null);
		this.setColour("#7C163E");
		this.setTooltip('');
	}
};

Blockly.Blocks['bollChoosed'] = {
	init: function() {
		this.appendDummyInput().appendField('检测到')
			.appendField(new Blockly.FieldDropdown([
									["红色", "RED"],
									["橙色", "ORANGE"],
									["黄色", "YELLOW"],
									["绿色", "GREEN"],
									["蓝色", "BLUE"],
									["紫色", "PURPLE"],
									["粉红", "PINK"]
								]),'bollChoose').appendField('颜色的球');
		this.setOutput(true, null);
		this.setColour("#ED0C68");
		this.setTooltip('');
	}
};
Blockly.Blocks['intelligentLearning'] = {
	init: function() {
		this.appendDummyInput().appendField('是否进行智能学习').appendField(new Blockly.FieldDropdown([
									["是", "1"],
									["否", "0"],
								]),'intelligent');
//		this.setPreviousStatement(true, null);
//		this.setNextStatement(true, null);
		this.setColour("#ED0C68");
		this.setTooltip('');
	}
};



Blockly.Blocks['filter'] = {
	init: function() {
		this.appendDummyInput().appendField('      筛选球');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/filter.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['fireBoom'] = {
	init: function() {
		this.appendDummyInput().appendField('      抛射球');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/mangonel.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['intoAuto'] = {
	init: function() {
		this.appendDummyInput().appendField('车开启巡线模式');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/intoAuto.png", 100, 80, ""));
		this.setColour('#f08300');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
	}
}

Blockly.Blocks['outAuto'] = {
	init: function() {
		this.appendDummyInput().appendField('车关闭巡线模式');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/outAuto.png", 100, 80, ""));
		this.setColour('#f08300');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
	}
}

Blockly.Blocks['twoSensor'] = {
	init: function() {
		this.appendDummyInput().appendField('左边的传感器检测到').appendField(new Blockly.FieldDropdown([
									["黑", "1"],
									["白", "0"]
								]),'leftSensor').appendField('，右边的传感器检测到').appendField(new Blockly.FieldDropdown([
									["黑", "1"],
									["白", "0"]
								]),'rightSensor');;
		this.setColour('#6caa1c');
		this.setOutput(true);
	}
}




Blockly.Blocks['optionalServe'] = {
	init: function() {
		this.appendDummyInput().appendField('选择').appendField(new Blockly.FieldDropdown([
			["B1", "B1"],
			["B2", "B2"],
			["B3", "B3"],
			["B4", "B4"]
		]), 'optionalServe').appendField('伺服，选择旋转').appendField(new Blockly.FieldTextInput('0'), 'optionalAng').appendField('度');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};

Blockly.Blocks['readyFire'] = {
	init: function() {//.appendField(new Blockly.FieldLabel('', 'changeBlack'))
		this.appendDummyInput().appendField('准 备 发 射');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/readyFire.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['accumulating'] = {
	init: function() {
		this.appendDummyInput().appendField('蓄 力');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/accumulating.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['fire'] = {
	init: function() {
		this.appendDummyInput().appendField('点 火 开 炮');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/fire.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['pull'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯头部往上升');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampUp.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
Blockly.Blocks['pull2'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯头部往下降');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampDown.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['pull_another'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯身体往上升');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampBodyUp.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
Blockly.Blocks['pull_another2'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯身体往下降');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampBodyDown.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['turnonlight'] = {
	init: function() {
		this.appendDummyInput().appendField('开  灯');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lightturnoff.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['turnofflight'] = {
	init: function() {
		this.appendDummyInput().appendField('关  灯');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lightturnon.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['leftwards'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯头部向左转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampLeft.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
Blockly.Blocks['rightwards'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯头部向右转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampRight.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['chassis_leftwards'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯底盘向左转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampCL.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
Blockly.Blocks['chassis_rightwards'] = {
	init: function() {
		this.appendDummyInput().appendField('台灯底盘向右转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampCR.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
//Blockly.Blocks['forwards'] = {
//	init: function() {
//		this.appendDummyInput().appendField('向前');
//		this.setPreviousStatement(true, null);
//		this.setNextStatement(true, null);
//		this.setColour("#0D4366");
//		this.setTooltip('');
//	}
//};

Blockly.Blocks['indicatorLight'] = {
	init: function() {
		this.appendDummyInput().appendField('雷达指示灯亮起');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/indicatorLight.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};
Blockly.Blocks['indicatorLightOff'] = {
	init: function() {
		this.appendDummyInput().appendField('关闭雷达指示灯');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lightOff.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['radarMove'] = {
	init: function() {
		this.appendDummyInput().appendField('启动雷达扫描器');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/radar_pic.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['radarStop'] = {
	init: function() {
		this.appendDummyInput().appendField('关闭雷达扫描器');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/radar_close.png", 100, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['upwards'] = {
	init: function() {
		this.appendDummyInput().appendField('向上击打目标物');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/fightUp.png", 100, 80, ''));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['downwards'] = {
	init: function() {
		this.appendDummyInput().appendField('向下击打目标物');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/fightDown.png", 100, 80, ''));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#f08300");
		this.setTooltip('');
	}
};

Blockly.Blocks['delay'] = {
	init: function() {
		linkage();

		this.appendDummyInput().appendField('延时').appendField(new Blockly.FieldTextInput('1'), "delay").appendField('秒');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#118972");
		this.setTooltip('');
	}
};

Blockly.Blocks['delay_t5'] = {
	init: function() {
		linkage();

		this.appendDummyInput().appendField('delay(').appendField(new Blockly.FieldTextInput('1'), "delay").appendField(new Blockly.FieldDropdown([
			["s", "m"],
			["ms", "ms"]
		]), 'unit').appendField(');');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#118972");
		this.setTooltip('');
	}
};

Blockly.Blocks['pursuit'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.PURSUIT);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/pursuit.png", 130, 70, ""));
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'pursuit'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#F5821F");
		this.setTooltip('');
	}
};
Blockly.Blocks['presShake'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.PRESSSHAKE).appendField(new Blockly.FieldLabel('', 'presShake'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#F5821F");
		this.setTooltip('');
	}
};

Blockly.Blocks['bumperCar'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('碰碰车模块');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#F5821F");
		this.setTooltip('');
	}
};

Blockly.Blocks['catch'] = {
	init: function() {
		this.appendDummyInput().appendField('抓取目标')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['place'] = {
	init: function() {
		this.appendDummyInput().appendField('放置目标')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/place.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};

Blockly.Blocks['AdjustLoaderAngle'] = {
	init: function() {
		this.appendDummyInput().appendField('  调整弹夹角度');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/AdjustLoaderAngle.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('按下L1和R1转动弹夹,按下select确认角度,直到6个调度确认后完成.');
	}
};
Blockly.Blocks['loaded'] = {
	init: function() {
		this.appendDummyInput().appendField('     炮弹上膛');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/loadBullets.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};
Blockly.Blocks['shot'] = {
	init: function() {
		this.appendDummyInput().appendField('     炮弹发射');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/shot.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['handlebarLeft'] = {
	init: function() {
		this.appendDummyInput().appendField('     车把向左');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/handlebarLeft.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};
Blockly.Blocks['handlebarRight'] = {
	init: function() {
		this.appendDummyInput().appendField('     车把向右');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/handlebarRight.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['handlebarReturn'] = {
	init: function() {
		this.appendDummyInput().appendField(' 车把方向向前');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/handlebarReturnBack.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['shell_loaded'] = {
	init: function() {
		this.appendDummyInput().appendField('炮弹上膛')
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['shell_shot'] = {
	init: function() {
		this.appendDummyInput().appendField('炮弹发射')
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['spin_start'] = {
	init: function() {
		this.appendDummyInput().appendField('  风扇开始旋转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/spin_start.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#E5A811");
		this.setTooltip('');
	}
};
Blockly.Blocks['spin_stop'] = {
	init: function() {
		this.appendDummyInput().appendField('  风扇停止旋转');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/spin_stop.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#E5A811");
		this.setTooltip('');
	}
};

Blockly.Blocks['big_wind'] = {
	init: function() {
		this.appendDummyInput().appendField('     风扇大风');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/bigWind.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#E5A811");
		this.setTooltip('');
	}
};

Blockly.Blocks['mid_wind'] = {
	init: function() {
		this.appendDummyInput().appendField('     风扇中风');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/midWind.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#E5A811");
		this.setTooltip('');
	}
};

Blockly.Blocks['small_wind'] = {
	init: function() {
		this.appendDummyInput().appendField('     风扇小风');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/smallWind.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#E5A811");
		this.setTooltip('');
	}
};

Blockly.Blocks['LRspin_start'] = {
	init: function() {
		this.appendDummyInput().appendField('  开始左右摇摆');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/shake.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};
Blockly.Blocks['LRspin_stop'] = {
	init: function() {
		this.appendDummyInput().appendField('  停止左右摇摆');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/stopShake.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['UCD_U'] = {
	init: function() {
		this.appendDummyInput().appendField('    风向朝上')
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/spinUp.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};
Blockly.Blocks['UCD_C'] = {
	init: function() {
		this.appendDummyInput().appendField('  风向水平朝前')
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/spinCenter.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};
Blockly.Blocks['UCD_D'] = {
	init: function() {
		this.appendDummyInput().appendField('    风向朝下')
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/spinDown.png",100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['loadBullets'] = {
	init: function() {
		this.appendDummyInput().appendField('    装载炮弹')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/loadBullets.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['shotBullet'] = {
	init: function() {
		this.appendDummyInput().appendField('发射子弹')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/Bursts.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['backOrigin'] = {
	init: function() {
		this.appendDummyInput().appendField('返回原点')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/Bursts.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};

Blockly.Blocks['Bursts'] = {
	init: function() {
		this.appendDummyInput().appendField('     炮弹连发')
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/Bursts.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['singleShot'] = {
	init: function() {
		this.appendDummyInput().appendField('     炮弹单发')
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/singleShot.png", 100, 65, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['singleShell'] = {
	init: function() {
		this.appendDummyInput().appendField('炮弹单发')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/singleShell.png", 150, 50, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['burstsShell'] = {
	init: function() {
		this.appendDummyInput().appendField('炮弹连发')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/burstsShell.png", 150, 50, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['catchUp'] = {
	init: function() {
		this.appendDummyInput().appendField('手臂向上移动')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catchUp.png", 250, 150, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['catchDown'] = {
	init: function() {
		this.appendDummyInput().appendField('手臂向下移动')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catchDown.png", 250, 150, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['catchClose'] = {
	init: function() {
		this.appendDummyInput().appendField('机械爪闭合')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catchClose.png", 250, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['catchOpen'] = {
	init: function() {
		this.appendDummyInput().appendField('机械爪张开')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catchOpen.png", 250, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
};
Blockly.Blocks['controls_if_if_new'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {

		this.setColour("#aaaaaa");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};
Blockly.Blocks['controls_if_elseif_new'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block	
	 */
	init: function() {
		this.setColour("#aaaaaa");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
}
Blockly.Blocks['controls_if_else_new'] = {
	init: function() {
		this.setColour("#aaaaaa");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
		this.setPreviousStatement(true);

	}
}
Blockly.Blocks['controls_if_new'] = {//遥控器

	init: function() {
		
		linkage();	
			
		
//		$('.blocklyEditableText').each(function(){
//					console.log($(this).prev().attr('class').split(' ')[1])
//					if($(this).prev().attr('class').split(' ')[1] != undefined){
//						a=parseInt($(this).prev().attr('class').split(' ')[1].substr(0,1)) +1;
//					}
//		});
		
		twice++;
		if(true){
			a++;
			$('.blocklyText').each(function (){
				if($(this).attr('class').split(" ")[1]!=undefined){
					
//					console.log($(this).attr('class').split(" ")[1].substr(0,1)+':'+a);
					if($(this).attr('class').split(" ")[1].substr(0,1) !=a){
						if(a>9){
							a=0;
						}
//						console.log('afterA:'+a);
					}else{
						a++;
						if(a>9){
							a=0;
						}
					}
					
				}
			});
		}
			
		z = a;
		console.log('start_a:'+a);
		this.appendDummyInput('IF0')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/complete.png", 350, 300, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover0'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/upDark.png", 60, 60, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/downDark.png", 60, 60, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftDark.png", 60, 60, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightDark.png", 60, 60, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover00'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/TriangleDark.png", 50, 50, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/×Dark.png", 50, 50, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/SquareDark.png", 50, 50, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/roundDark.png", 50, 50, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover000'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover0000'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/selectDark.png", 25, 25, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/startDark.png", 25, 25, ""))
			.appendField(new Blockly.FieldLabel('', z + 'test0'))
			.appendField(new Blockly.FieldCheckbox('false'), 'UP0')
			.appendField(new Blockly.FieldCheckbox('false'), 'DOWN0')
			.appendField(new Blockly.FieldCheckbox('false'), 'LEFT0')
			.appendField(new Blockly.FieldCheckbox('false'), 'RIGHT0')
			.appendField(new Blockly.FieldLabel('', z + 'test00'))
			.appendField(new Blockly.FieldCheckbox('false'), 'TRIANGLE0')
			.appendField(new Blockly.FieldCheckbox('false'), 'CROSS0')
			.appendField(new Blockly.FieldCheckbox('false'), 'SQUARE0')
			.appendField(new Blockly.FieldCheckbox('false'), 'CIRCLE0')
			.appendField(new Blockly.FieldLabel('', z + 'test000'))
			.appendField(new Blockly.FieldCheckbox('false'), 'L10')
			.appendField(new Blockly.FieldCheckbox('false'), 'L20')
			.appendField(new Blockly.FieldCheckbox('false'), 'R10')
			.appendField(new Blockly.FieldCheckbox('false'), 'R20')
			.appendField(new Blockly.FieldLabel('', z + 'test0000'))
			.appendField(new Blockly.FieldCheckbox('false'), 'SELECT0')
			.appendField(new Blockly.FieldCheckbox('false'), 'START0')
			.appendField(new Blockly.FieldDropdown([
				["&&", "&&"],
				["||", "||"]
			]), "andOr");
		this.appendStatementInput('DO0').appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour("#CECBCB");
		this.setMutator(new Blockly.Mutator(['controls_if_elseif_new',
			'controls_if_else_new'
		]));
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
		//		console.log('init')
		reSetCheckbox(z);
	},
	mutationToDom: function() {
		//						console.log('muta');//always
		if(!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if(this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
		}
		if(this.elseCount_) { //flash . 	if true =>show
			container.setAttribute('else', 1);
		}
				reSetCheckbox();
		return container;

	},
	domToMutation: function(xmlElement) {
		//						console.log('domToMutation');//when flash
		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
		for(var x = 1; x <= this.elseifCount_; x++) {
			this.appendDummyInput('IF' + x)
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/complete.png", 350, 300, ""))
				.appendField(new Blockly.FieldLabel('', z + 'cover' + x))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/upDark.png", 60, 60, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/downDark.png", 60, 60, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftDark.png", 60, 60, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightDark.png", 60, 60, ""))
				.appendField(new Blockly.FieldLabel('', z + 'cover' + x + x))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/TriangleDark.png", 50, 50, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/×Dark.png", 50, 50, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/SquareDark.png", 50, 50, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/roundDark.png", 50, 50, ""))
				.appendField(new Blockly.FieldLabel('', z + 'cover' + x + x + x))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
				.appendField(new Blockly.FieldLabel('', z + 'cover' + x + x + x + x))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/selectDark.png", 25, 25, ""))
				.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/startDark.png", 25, 25, ""))
				.appendField(new Blockly.FieldLabel('', z + 'test' + x))
				.appendField(new Blockly.FieldCheckbox('false'), 'UP' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'DOWN' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'LEFT' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'RIGHT' + x)
				.appendField(new Blockly.FieldLabel('', z + 'test' + x + x))
				.appendField(new Blockly.FieldCheckbox('false'), 'TRIANGLE' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'CROSS' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'SQUARE' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'CIRCLE' + x)
				.appendField(new Blockly.FieldLabel('', z + 'test' + x + x + x))
				.appendField(new Blockly.FieldCheckbox('false'), 'L1' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'L2' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'R1' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'R2' + x)
				.appendField(new Blockly.FieldLabel('', z + 'test' + x + x + x + x))
				.appendField(new Blockly.FieldCheckbox('false'), 'SELECT' + x)
				.appendField(new Blockly.FieldCheckbox('false'), 'START' + x)
				.appendField(new Blockly.FieldDropdown([
					["&&", "&&"],
					["||", "||"]
				]), "andOr" + x);
			this.appendStatementInput('DO' + x).appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}
		if(this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
		}
//				reSetCheckbox(z);
	},
	decompose: function(workspace) {
		//		console.log('decompose');//打开编辑窗口；增加块

		var j = Blockly.Xml.blockToDom2(Blockly.selected);
		var containerBlock = Blockly.Block.obtain(workspace, 'controls_if_if_new');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK').connection;

		//		console.log(this.elseifCount_); // add controls num
		for(var x = 1; x <= this.elseifCount_; x++) {
			var elseifBlock = Blockly.Block.obtain(workspace, 'controls_if_elseif_new');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if(this.elseCount_) {
			var elseBlock = Blockly.Block.obtain(workspace, 'controls_if_else_new');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
//				reSetCheckbox();
		return containerBlock;
	},
	//addhappen
	compose: function(containerBlock, height) {
//				console.log('compose');//打开编辑窗口；添加块；	
		//oldheight = 62 标一下 
		var distance = height - oldHeight;
		if(height != undefined) {
			oldHeight = height;
		}
		function getKey() {
				var a = localStorage.getItem('z');
				//	console.log(a);
				a = a.split(' ');
				a = a[1].split('c')[0];
				return a;
		}

		var q = getKey();
//		console.log('q:'+q);
		if(distance < 0) {
			if(this.elseCount_) {
				this.removeInput('ELSE');
			}
			this.elseCount_ = 0;
			//			this.elseifCount_  is elseifs' num 
			for(var x = this.elseifCount_; x > 0; x--) {
				this.removeInput('IF' + x);
				this.removeInput('DO' + x);
			}

			this.elseifCount_ = 0;
			// Rebuild the block's optional inputs.
			var clauseBlock = containerBlock.getInputTargetBlock('STACK'); //blocksvg
			aggregate = [];
			while(clauseBlock) {

				switch(clauseBlock.type) {
					case 'controls_if_elseif_new':
						var flag = true;
						var num = q + this.elseifCount_;
						for(var i = 0; i < aggregate.length; i++) {
							if(num == aggregate[i]) {
								flag = false;
							}
						}

						if(flag == false) {

						} else {
							this.elseifCount_++;

							if(this.elseifCount_ == 10) {
								this.elseifCount_ = 'a';
							} else if(this.elseifCount_ == 11) {
								this.elseifCount_ = 'b';
							} else if(this.elseifCount_ == 12) {
								this.elseifCount_ = 'c';
							} else if(this.elseifCount_ == 13) {
								this.elseifCount_ = 'd';
							}

							var ifInput = this.appendDummyInput('IF' + this.elseifCount_)
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/complete.png", 350, 300, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/upDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/downDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/TriangleDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/×Dark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/SquareDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/roundDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/selectDark.png", 25, 25, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/startDark.png", 25, 25, ""))
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'UP' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'DOWN' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'LEFT' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'RIGHT' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'TRIANGLE' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'CROSS' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'SQUARE' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'CIRCLE' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'L1' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'L2' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'R1' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'R2' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'SELECT' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'START' + this.elseifCount_)
								.appendField(new Blockly.FieldDropdown([
									["&&", "&&"],
									["||", "||"]
								]), "andOr"+this.elseifCount_);
							var doInput = this.appendStatementInput('DO' + this.elseifCount_).appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
							if(clauseBlock.valueConnection_) {
								ifInput.connection.connect(clauseBlock.valueConnection_);
							}
							if(clauseBlock.statementConnection_) {
								doInput.connection.connect(clauseBlock.statementConnection_);
							}
						}
						break;
					case 'controls_if_else_new':
						this.elseCount_++;
						var elseInput = this.appendStatementInput('ELSE');
						elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
						if(clauseBlock.statementConnection_) {
							elseInput.connection.connect(clauseBlock.statementConnection_);
						}
						break;
					default:
						throw 'Unknown block type.';
				}
				clauseBlock = clauseBlock.nextConnection &&
					clauseBlock.nextConnection.targetBlock();
			}
//			console.log('一：'+z);
			reSetCheckbox(z);
		} else if(distance > 0) {
			//ope + 4
			if(this.elseCount_) {
				this.removeInput('ELSE');
			}
			//			this.elseCount_ = 0;
			//			for(var x = this.elseifCount_; x > 0; x--) {
			//				this.removeInput('IF' + x);
			//				this.removeInput('DO' + x);
			//			}

			this.elseifCount_ = 0;
			var clauseBlock = containerBlock.getInputTargetBlock('STACK'); //blocksvg

			while(clauseBlock) {
				switch(clauseBlock.type) {
					case 'controls_if_elseif_new':
						this.elseifCount_++;
						var flag = true;
						var num = q + this.elseifCount_;
						var classes = document.getElementsByClassName('blocklyText');
						aggregate = []; //重新定义aggregate数组 
						for(var i = 0; i < classes.length; i++) {
							var numberClass = classes[i].getAttribute('class').split(' ')[1];
							if(numberClass != undefined) {
								var firt_numberClass = numberClass.split('')[0];
								if(isNaN(firt_numberClass) == false) {
									var a = numberClass.split('')[0];
									var b = numberClass.substr(numberClass.length - 1, 1);
									a = a + b;
									var flg = true;
									for(var j = 0; j < aggregate.length; j++) {
										if(a == aggregate[j]) {
											flg = false;
										}
									}
									if(flg == true) {
										aggregate.push(a);
									}
								}
							}
						}
						for(var i = 0; i < aggregate.length; i++) {
							if(num == aggregate[i]) {
								flag = false;
							}
						}
						if(flag == false) {

						} else {
							aggregate.push(num);

							if(this.elseifCount_ == 10) {
								this.elseifCount_ = 'a';
							} else if(this.elseifCount_ == 11) {
								this.elseifCount_ = 'b';
							} else if(this.elseifCount_ == 12) {
								this.elseifCount_ = 'c';
							} else if(this.elseifCount_ == 13) {
								this.elseifCount_ = 'd';
							}

							var ifInput = this.appendDummyInput('IF' + this.elseifCount_)
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/complete.png", 350, 300, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/upDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/downDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightDark.png", 60, 60, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/TriangleDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/×Dark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/SquareDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/roundDark.png", 50, 50, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56, 46, ""))
								.appendField(new Blockly.FieldLabel('', q + 'cover' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/selectDark.png", 25, 25, ""))
								.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/startDark.png", 25, 25, ""))
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'UP' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'DOWN' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'LEFT' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'RIGHT' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'TRIANGLE' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'CROSS' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'SQUARE' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'CIRCLE' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'L1' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'L2' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'R1' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'R2' + this.elseifCount_)
								.appendField(new Blockly.FieldLabel('', q + 'test' + this.elseifCount_ + this.elseifCount_ + this.elseifCount_ + this.elseifCount_))
								.appendField(new Blockly.FieldCheckbox('false'), 'SELECT' + this.elseifCount_)
								.appendField(new Blockly.FieldCheckbox('false'), 'START' + this.elseifCount_)
								.appendField(new Blockly.FieldDropdown([
									["&&", "&&"],
									["||", "||"]
								]), "andOr"+this.elseifCount_);
								
							var doInput = this.appendStatementInput('DO' + this.elseifCount_).appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
							if(clauseBlock.valueConnection_) {
								ifInput.connection.connect(clauseBlock.valueConnection_);
							}
							if(clauseBlock.statementConnection_) {
								doInput.connection.connect(clauseBlock.statementConnection_);
							}
						}

						break;
					case 'controls_if_else_new':
						this.elseCount_++;
						var elseInput = this.appendStatementInput('ELSE');
						elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
						if(clauseBlock.statementConnection_) {
							elseInput.connection.connect(clauseBlock.statementConnection_);
						}
						break;
					default:
						throw 'Unknown block type.';
				}
				clauseBlock = clauseBlock.nextConnection &&
					clauseBlock.nextConnection.targetBlock();
			}
			
//			console.log('二:'+z);
			reSetCheckbox(z);
		} else {

		}

	},
	saveConnections: function(containerBlock) {
		//						console.log('save');//打开编辑窗口；打开编辑窗口时移动时；增加块之后
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		var x = 1;
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'controls_if_elseif_new':
					var inputIf = this.getInput('IF' + x);
					var inputDo = this.getInput('DO' + x);
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					x++;
					break;
				case 'controls_if_else_new':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
		//		reSetCheckbox();
	}

};

Blockly.Blocks['control_Button_if'] = {

	init: function() {
		linkage();
		//	this.setColour("#29aadf");
		this.setColour("#28dbff");
		//this.appendDummyInput().appendField(Blockly.ZEROWORKSHOP_BUTTON_MSG);
		this.appendDummyInput('IF_Button0')
			.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR)
			.appendField(new Blockly.FieldDropdown([
				["A1", "BT1"],
				["A2", "BT2"],
				["A3", "BT3"],
				["A4", "BT4"]
			]), "Button_Input0")
			.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED);
		this.appendDummyInput()
			.appendField("             ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/3Dpush-button.gif', 70, 70, '*')).appendField(new Blockly.FieldLabel('', 'control_Button_if'));

		this.appendStatementInput("DO_Button0").appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.setPreviousStatement(!0);
		this.setNextStatement(!0);

		this.setMutator(new Blockly.Mutator(["control_Button_if_elseif", "control_Button_if_else"]));

		var a = this;
		this.elseCount_ = this.elseifCount_ = 0
	},
	mutationToDom: function() {
		if(!this.elseifCount_ && !this.elseCount_) return null;
		var a = document.createElement("mutation");
		this.elseifCount_ && a.setAttribute("elseif", this.elseifCount_);
		this.elseCount_ && a.setAttribute("else",
			1);
		return a
	},

	//初始化渲染添加元素
	domToMutation: function(a) {
		this.elseifCount_ = parseInt(a.getAttribute("elseif"), 10);
		this.elseCount_ = parseInt(a.getAttribute("else"), 10);

		for(a = 1; a <= this.elseifCount_; a++) {
			//			this.appendValueInput("IF" + a).setCheck("Boolean").appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF),
			this.appendDummyInput('IF_Button' + a)
				.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
				.appendField(new Blockly.FieldDropdown([
					["A1", "BT1"],
					["A2", "BT2"],
					["A3", "BT3"],
					["A4", "BT4"]
				]), 'Button_Input' + a)
				.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/3Dpush-button.gif', 50, 50, '*'));
			this.appendStatementInput("DO_Button" + a).appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}

		//for(a = 1; a <= this.elseifCount_; a++){this.appendDummyInput('IF_Button' + a)
		//			.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
		//			.appendField(new Blockly.FieldDropdown([["Button1", "BT1"], ["Button2", "BT2"], ["Button3", "BT3"], ["Button4", "BT4"]]), 'Button_Input'+a)
		//			.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
		//			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/on.png', 50, 50, '*'));
		//
		//			this.appendStatementInput('DO_Button' + a)
		//			    .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);}

		this.elseCount_ && this.appendStatementInput("ELSE").appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE)
	},

	decompose: function(a) {
		var b = Blockly.Block.obtain(a,
			"control_Button_if_if");
		b.initSvg();

		for(var c = b.getInput("STACK").connection, d = 1; d <= this.elseifCount_; d++) {
			var e = Blockly.Block.obtain(a, "control_Button_if_elseif");
			e.initSvg();
			c.connect(e.previousConnection);
			c = e.nextConnection
		}
		this.elseCount_ && (a = Blockly.Block.obtain(a, "control_Button_if_else"), a.initSvg(), c.connect(a.previousConnection));
		return b
	},

	compose: function(a) {
		this.elseCount_ && this.removeInput("ELSE");
		this.elseCount_ = 0;
		for(var b = this.elseifCount_; 0 < b; b--) this.removeInput("IF_Button" + b), this.removeInput("DO_Button" + b);
		this.elseifCount_ =
			0;
		for(a = a.getInputTargetBlock("STACK"); a;) {
			switch(a.type) {
				case "control_Button_if_elseif":
					this.elseifCount_++;

					var b =
						//						this.appendValueInput("IF" + this.elseifCount_).setCheck("Boolean").appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF),

						this.appendDummyInput('IF_Button' + this.elseifCount_)
						.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
						.appendField(new Blockly.FieldDropdown([
							["A1", "BT1"],
							["A2", "BT2"],
							["A3", "BT3"],
							["A4", "BT4"]
						]), 'Button_Input' + this.elseifCount_)
						.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/3Dpush-button.gif', 50, 50, '*')),

						c = this.appendStatementInput("DO_Button" + this.elseifCount_);

					c.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

					a.valueConnection_ && b.connection.connect(a.valueConnection_);
					a.statementConnection_ && c.connection.connect(a.statementConnection_);

					break;
				case "control_Button_if_else":
					this.elseCount_++;
					b = this.appendStatementInput("ELSE");
					b.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
					a.statementConnection_ && b.connection.connect(a.statementConnection_);
					break;
				default:
					throw "Unknown block type.";
			}
			a = a.nextConnection && a.nextConnection.targetBlock()
		}
	},
	saveConnections: function(a) {
		a = a.getInputTargetBlock("STACK");
		for(var b = 1; a;) {
			switch(a.type) {
				case "control_Button_if_elseif":
					var c = this.getInput("IF_Button" + b),
						d = this.getInput("DO_Button" + b);
					//					a.valueConnection_ = c && c.connection.targetConnection;
					a.statementConnection_ = d && d.connection.targetConnection;
					b++;
					break;
				case "control_Button_if_else":
					d = this.getInput("ELSE");
					a.statementConnection_ = d && d.connection.targetConnection;
					break;
				default:
					throw "Unknown block type.";
			}
			a = a.nextConnection && a.nextConnection.targetBlock()
		}
	}
};
//test
//Blockly.Blocks['controls_switch_case'] = {
//	init: function() {
//		this.setColour(210);
//		this.appendValueInput('IF0')
//			.setCheck([Number, Boolean])
//			.appendField('switch');
//		this.setPreviousStatement(true);
//		this.setNextStatement(true);
//		this.setMutator(new Blockly.Mutator(['controls_case',
//			'controls_default'
//		]));
//		this.elseifCount_ = 0;
//		this.elseCount_ = 0;
//	},
//	/**
//	 * Create XML to represent the number of else-if and else inputs.
//	 * @return {Element} XML storage element.
//	 * @this Blockly.Block
//	 */
//	mutationToDom: function() {
//		if(!this.elseifCount_ && !this.elseCount_) {
//			return null;
//		}
//		var container = document.createElement('mutation');
//		if(this.elseifCount_) {
//			container.setAttribute('elseif', this.elseifCount_);
//		}
//		if(this.elseCount_) {
//			container.setAttribute('else', 1);
//		}
//		return container;
//	},
//	/**
//	 * Parse XML to restore the else-if and else inputs.
//	 * @param {!Element} xmlElement XML storage element.
//	 * @this Blockly.Block
//	 */
//	domToMutation: function(xmlElement) {
//		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
//		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
//		for(var i = 1; i <= this.elseifCount_; i++) {
//			this.appendValueInput('IF' + i)
//				.setCheck([Number, Boolean])
//				.appendField('case');
//			this.appendStatementInput('DO' + i)
//				.appendField('');
//		}
//		if(this.elseCount_) {
//			this.appendStatementInput('ELSE')
//				.appendField('default');
//		}
//	},
//	/**
//	 * Populate the mutator's dialog with this block's components.
//	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
//	 * @return {!Blockly.Block} Root block in mutator.
//	 * @this Blockly.Block
//	 */
//	decompose: function(workspace) {
//		var containerBlock = Blockly.Block.obtain(workspace, 'controls_switch');
//		containerBlock.initSvg();
//		var connection = containerBlock.getInput('STACK').connection;
//		for(var i = 1; i <= this.elseifCount_; i++) {
//			var elseifBlock = Blockly.Block.obtain(workspace, 'controls_case');
//			elseifBlock.initSvg();
//			connection.connect(elseifBlock.previousConnection);
//			connection = elseifBlock.nextConnection;
//		}
//		if(this.elseCount_) {
//			var elseBlock = Blockly.Block.obtain(workspace, 'controls_default');
//			elseBlock.initSvg();
//			connection.connect(elseBlock.previousConnection);
//		}
//		return containerBlock;
//	},
//	/**
//	 * Reconfigure this block based on the mutator dialog's components.
//	 * @param {!Blockly.Block} containerBlock Root block in mutator.
//	 * @this Blockly.Block
//	 */
//	compose: function(containerBlock) {
//		// Disconnect the else input blocks and remove the inputs.
//		if(this.elseCount_) {
//			this.removeInput('ELSE');
//		}
//		this.elseCount_ = 0;
//		// Disconnect all the elseif input blocks and remove the inputs.
//		for(var i = this.elseifCount_; i > 0; i--) {
//			this.removeInput('IF' + i);
//			this.removeInput('DO' + i);
//		}
//		this.elseifCount_ = 0;
//		// Rebuild the block's optional inputs.
//		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
//		while(clauseBlock) {
//			switch(clauseBlock.type) {
//				case 'controls_case':
//
//					this.elseifCount_++;
//					//        var ifInput = this.appendValueInput('IF' + this.elseifCount_)
//					//            .setCheck([Number,Boolean])
//					//            .appendField('case').appendField(new Blockly.FieldDropdown([['a','a'],['b','b']])).appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_leftturn.png",150, 100, "LeftTurn��ת"));
//					var ifInput =
//						this.appendValueInput('IF' + this.elseifCount_)
//						.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
//						.appendField(new Blockly.FieldDropdown([
//							["Button1", "BT1"],
//							["Button2", "BT2"],
//							["Button3", "BT3"],
//							["Button4", "BT4"]
//						]), 'Button_Input' + this.elseifCount_)
//						.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
//						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/on.png', 50, 50, '*'));
//
//					var doInput = this.appendStatementInput('DO' + this.elseifCount_);
//					doInput.appendField('');
//					// Reconnect any child blocks.
//					if(clauseBlock.valueConnection_) {
//						ifInput.connection.connect(clauseBlock.valueConnection_);
//					}
//					if(clauseBlock.statementConnection_) {
//						doInput.connection.connect(clauseBlock.statementConnection_);
//					}
//					break;
//				case 'controls_default':
//					this.elseCount_++;
//					var elseInput = this.appendStatementInput('ELSE');
//					elseInput.appendField('default');
//					// Reconnect any child blocks.
//					if(clauseBlock.statementConnection_) {
//						elseInput.connection.connect(clauseBlock.statementConnection_);
//					}
//					break;
//				default:
//					throw 'Unknown block type.';
//			}
//			clauseBlock = clauseBlock.nextConnection &&
//				clauseBlock.nextConnection.targetBlock();
//		}
//	},
//	/**
//	 * Store pointers to any connected child blocks.
//	 * @param {!Blockly.Block} containerBlock Root block in mutator.
//	 * @this Blockly.Block
//	 */
//	saveConnections: function(containerBlock) {
//		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
//		var i = 1;
//		while(clauseBlock) {
//			switch(clauseBlock.type) {
//				case 'controls_case':
//					var inputIf = this.getInput('IF' + i);
//					var inputDo = this.getInput('DO' + i);
//					clauseBlock.valueConnection_ =
//						inputIf && inputIf.connection.targetConnection;
//					clauseBlock.statementConnection_ =
//						inputDo && inputDo.connection.targetConnection;
//					i++;
//					break;
//				case 'controls_default':
//					var inputDo = this.getInput('ELSE');
//					clauseBlock.statementConnection_ =
//						inputDo && inputDo.connection.targetConnection;
//					break;
//				default:
//					throw 'Unknown block type.';
//			}
//			clauseBlock = clauseBlock.nextConnection &&
//				clauseBlock.nextConnection.targetBlock();
//		}
//	}
//};

Blockly.Blocks['left_turn'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_leftturn.png", 100, 80, "LeftTurn��ת")).appendField(new Blockly.FieldLabel('', 'left_turn'));;
		//		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'left_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');

	}
};

Blockly.Blocks['left_turn_speed'] = {	
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField('以').appendField(new Blockly.FieldTextInput('255'),'left_turn_speed').appendField('的速度向左转');
		//		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'left_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');

	}
};
Blockly.Blocks['right_turn_speed'] = {	
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField('以').appendField(new Blockly.FieldTextInput('255'),'right_turn_speed').appendField('的速度向右转');
		//		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'left_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');

	}
};
Blockly.Blocks['go_forward_speed'] = {	
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField('以').appendField(new Blockly.FieldTextInput('255'),'go_forward_speed').appendField('的速度向前进');
		//		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'left_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};
Blockly.Blocks['go_reverse_speed'] = {	
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField('以').appendField(new Blockly.FieldTextInput('255'),'go_reverse_speed').appendField('的速度向后退');
		//		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'left_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');

	}
};


Blockly.Blocks['stop'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_brake.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'stop'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');

	}
};
Blockly.Blocks['right_turn'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_rightturn.png", 100, 80, "RighttTurn��ת")).appendField(new Blockly.FieldLabel('', 'right_turn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['go_forward'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_forward.png", 100, 80, "GoForwardǰ��")).appendField(new Blockly.FieldLabel('', 'go_forward'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['go_reverse'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_reverse.png", 100, 80, "GoRervse����")).appendField(new Blockly.FieldLabel('', 'go_reverse'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};
Blockly.Blocks['left_CW'] = {

	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabel('', 'changeBlack'))
			.appendField('Left:')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/CW.png", 100, 80, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_ACW'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('Left:')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 100, 80, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_Stop'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('左轮停止');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_CW'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('Right:')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/CW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_ACW'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('Right:')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_Stop'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('右轮停止');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_back'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('左轮向后');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_goahead'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('左轮向前');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_goahead'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('右轮向前');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_back'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('右轮向后');
		//			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ACW.png", 150, 100, "GoRervse����"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_back_speed'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('左轮向后   速度=')
			.appendField(new Blockly.FieldTextInput(255), 'left_back_speed');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['left_goahead_speed'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('左轮向前   速度=')
			.appendField(new Blockly.FieldTextInput(255), 'left_goahead_speed');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_goahead_speed'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('右轮向前   速度=')
			.appendField(new Blockly.FieldTextInput(255), 'right_goahead_speed');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['right_back_speed'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField('右轮向后   速度=')
			.appendField(new Blockly.FieldTextInput(255), 'right_back_speed');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['go_brake'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/ZW_brake.png", 100, 80, "Stopֹͣ"));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['steeringRight'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/steeringRight.png", 150, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['steeringLeft'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/steeringLeft.png", 150, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0055ff");
		this.setTooltip('');
	}
};

Blockly.Blocks['steeringCenter'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/steeringCenter.png", 150, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#8ec21f");
		this.setTooltip('');
	}
};

Blockly.Blocks['greenLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/greenLED.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'greenLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['redLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/redLED.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'redLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['blueLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/blueLED.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'blueLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['yellowLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/yellowLED.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'yellowLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['offLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/offLED.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'offLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['leftturn_light_flash'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftturn_light.gif", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'leftturn_light_flash'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['leftturn_light_off'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftturn_light_off.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'leftturn_light_off'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['leftturn_light_on'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftturn_light.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'leftturn_light_on'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};
Blockly.Blocks['rightturn_light_flash'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightturn_light.gif", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'rightturn_light_flash'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['rightturn_light_off'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightturn_light_off.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'rightturn_light_off'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['rightturn_light_on'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightturn_light.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'rightturn_light_on'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['rear_light'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/backlight.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'rear_light_on'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['rear_light_off'] = {
	init: function() {
		linkage(); //1
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/backlight_off.png", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'rear_light_off'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
};

Blockly.Blocks['pan_clockwise'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/pan2.png", 100, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#e835e6");
		this.setTooltip('');
	}
};

Blockly.Blocks['pan_counterclockwise'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/pan1.png", 100, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#e835e6");
		this.setTooltip('');
	}
};

Blockly.Blocks['tilt_up'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/tilt2.png", 100, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#e835e6");
		this.setTooltip('');
	}
};

Blockly.Blocks['tilt_down'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/tilt1.png", 100, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#e835e6");
		this.setTooltip('');
	}
};

Blockly.Blocks['cam_init'] = {
	init: function() {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/cam_init.png", 100, 100, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#e835e6");
		this.setTooltip('');
	}
};

Blockly.Blocks['movement_img_dropdown'] = { //emm
	/**
	 * Demo block for image changing.
	 * @this Blockly.Block
	 */
	init: function() {
		var options = [
			[Blockly.ZEROWORKSHOP_MOVEMETN_LEFT, '../../media/ZeroWorkshop/ZW_leftturn.png'],
			[Blockly.ZEROWORKSHOP_MOVEMETN_RIGHT, '../../media/ZeroWorkshop/ZW_rightturn.png'],
			[Blockly.ZEROWORKSHOP_MOVEMETN_FORWARD, '../../media/ZeroWorkshop/ZW_forward.png'],
			[Blockly.ZEROWORKSHOP_MOVEMETN_REVERSE, '../../media/ZeroWorkshop/ZW_reverse.png'],
			[Blockly.ZEROWORKSHOP_MOVEMETN_STOP, '../../media/ZeroWorkshop/ZW_brake.png']
		];
		var dropdown = new Blockly.FieldDropdown(options,
			function(newOp) {
				this.sourceBlock_.getField('IMAGE').setValue(newOp);

			});
		this.appendDummyInput()
			.appendField(dropdown, 'Movement')
			.appendField(new Blockly.FieldImage('', 100, 100, '*'), 'IMAGE');
		this.getField('IMAGE').EDITABLE = true;
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#8ec21f");
	}
};
Blockly.Blocks['play_note'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(new Blockly.FieldDropdown([
				["A0", "a0"],
				["A#0", "as0"],
				["B0", "b0"],
				["C1", "c1"],
				["C#1", "cs1"],
				["D1", "d1"],
				["D#1", "ds1"],
				["E1", "e1"],
				["F1", "f1"],
				["F#1", "fs1"],
				["G1", "g1"],
				["G#1", "gs1"],
				["A1", "a1"],
				["A#1", "as1"],
				["B1", "b1"],
				["C2", "c2"],
				["C#2", "cs2"],
				["D2", "d2"],
				["D#2", "ds2"],
				["E2", "e2"],
				["F2", "f2"],
				["F#2", "fs2"],
				["G2", "g2"],
				["G#2", "gs2"],
				["A2", "a2"],
				["A#2", "as2"],
				["B2", "b2"],
				["C3", "c3"],
				["C#3", "cs3"],
				["D3", "d3"],
				["D#3", "ds3"],
				["E3", "e3"],
				["F3", "f3"],
				["F#3", "fs4"],
				["G3", "g3"],
				["G#3", "gs3"],
				["A3", "a3"],
				["A#3", "as3"],
				["B3", "b3"],
				["C4", "c4"],
				["C#4", "cs4"],
				["D4", "d4"],
				["D#4", "ds4"],
				["E4", "e4"],
				["F4", "f4"],
				["F#4", "fs2"],
				["G4", "g4"],
				["G#4", "gs4"],
				["A4", "a4"],
				["A#4", "as4"],
				["B4", "b1"],
				["C5", "c5"],
				["C#5", "cs5"],
				["D5", "d5"],
				["D#5", "ds5"],
				["E5", "e5"],
				["F5", "f5"],
				["F#5", "fs5"],
				["G5", "g5"],
				["G#5", "gs5"],
				["A5", "a5"],
				["A#5", "as5"],
				["B5", "b5"],
				["C6", "c6"],
				["C#6", "cs6"],
				["D6", "d6"],
				["D#6", "ds6"],
				["E6", "e6"],
				["F6", "f6"],
				["F#6", "fs6"],
				["G6", "g6"],
				["G#6", "gs6"],
				["A6", "a6"],
				["A#6", "as6"],
				["B6", "b6"],
				["C7", "c7"],
				["C#7", "cs7"],
				["D7", "d7"],
				["D#7", "ds7"],
				["E7", "e7"],
				["F7", "f7"],
				["F#7", "fs7"],
				["G7", "g7"],
				["G#7", "gs7"],
				["A7", "a7"],
				["A#7", "as7"],
				["B7", "b7"],
				["C8", "c8"],
				["C#8", "cs8"],
				["D8", "d8"],
				["D#8", "ds8"]
			]), "varNote")
			.appendField(new Blockly.FieldDropdown([
				["1", "wholeNote"],
				["1/2", "halfNote"],
				["1/4", "quaterNote"],
				["1/8", "eighthNote"],
				["1/16", "sixteenthNote"]
			]), "rythem")
			.appendField(new Blockly.FieldDropdown([
				["x1", "meters_x1"],
				["x2", "meters_x2"],
				["x3", "meters_x3"],
				["x4", "meters_x4"]
			]), "meters_length").appendField(new Blockly.FieldLabel('', 'play_note'));
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/pianokey.png", 150, 80, "*"))
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#bf2761");
		this.setTooltip('');
	}
};

Blockly.Blocks['play_song'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PLAYNUM)
			.appendField(new Blockly.FieldDropdown([
				["1", "SONG_1"],
				["2", "SONG_2"],
				["3", "SONG_3"],
				["4", "SONG_4"],
				["5", "SONG_5"]
			]), "songName")
			.appendField(Blockly.ZEROWORKSHOP_PLAYSONG);
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/playnote.png", 136, 80, "*")).appendField(new Blockly.FieldLabel('', 'play_song'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#bf2761");
		this.setTooltip('');
	}
};

Blockly.Blocks['control_if_gamepad'] = { //myong
	/**
	 * Block for if/elseif/else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		var options = [
			['UP', '../../media/ZeroWorkshop/ps2_Lup.png'],
			['LEFT', '../../media/ZeroWorkshop/ps2_Lleft.png'],
			['DOWN', '../../media/ZeroWorkshop/ps2_Ldown.png'],
			['RIGHT', '../../media/ZeroWorkshop/ps2_Lright.png'],
			['TRIANGLE', '../../media/ZeroWorkshop/ps2_Rtriangle.png'],
			['SQUARE', '../../media/ZeroWorkshop/ps2_Rsquare.png'],
			['CROSS', '../../media/ZeroWorkshop/ps2_Rcross.png'],
			['CIRCLE', '../../media/ZeroWorkshop/ps2_Rcircle.png']
		];

		var dropdown0 = new Blockly.FieldDropdown(options,
			function(newOp) {
				this.sourceBlock_.getField('IMAGE_0').setValue(newOp);

			});

		//this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PS2_MSG)
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/PS2_controller.png", 50, 50, "*"));

		this.appendDummyInput('IF0')
			//.setCheck([Boolean,Number])
			.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_IF)
			.appendField(dropdown0, 'Movement_0')
			.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
			.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_0');

		this.getField('IMAGE_0').EDITABLE = true;
		this.appendStatementInput('DO0')
			.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setMutator(new Blockly.Mutator(['control_if_elseif_gamepad',
			'control_if_else_gamepad'
		]));
		// Assign 'this' to a variable for use in the tooltip closure below.
		var thisBlock = this;
		this.setTooltip(function() {
			if(!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
			} else if(!thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
			} else if(thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
			} else if(thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
			}
			return '';
		});
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
	},
	/**
	 * Create XML to represent the number of else-if and else inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		if(!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if(this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
			container.setAttribute('try', true);
		}
		for(var i = 0; i < this.elseifCount_; i++) {
			var parameter = document.createElement('sel');
			parameter.setAttribute('button', this.getFieldValue('Movement_' + this.elseifCount_));
			container.appendChild(parameter);
		}
		if(this.elseCount_) {
			container.setAttribute('else', 1);
		}
		return container;
	},
	/**
	 * Parse XML to restore the else-if and else inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {

		var new_options = [
			['UP', '../../media/ZeroWorkshop/ps2_Lup.png'],
			['LEFT', '../../media/ZeroWorkshop/ps2_Lleft.png'],
			['DOWN', '../../media/ZeroWorkshop/ps2_Ldown.png'],
			['RIGHT', '../../media/ZeroWorkshop/ps2_Lright.png'],
			['TRIANGLE', '../../media/ZeroWorkshop/ps2_Rtriangle.png'],
			['SQUARE', '../../media/ZeroWorkshop/ps2_Rsquare.png'],
			['CROSS', '../../media/ZeroWorkshop/ps2_Rcross.png'],
			['CIRCLE', '../../media/ZeroWorkshop/ps2_Rcircle.png']
		];

		var img_sel = new Array("../../media/ZeroWorkshop/ZW_leftturn.jpg",
			"../../media/ZeroWorkshop/ZW_rightturn.jpg",
			"../../media/ZeroWorkshop/ZW_forward.jpg",
			"../../media/ZeroWorkshop/ZW_reverse.jpg",
			"../../media/ZeroWorkshop/ZW_brake.jpg");

		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
		var dropdown = new Array(this.elseifCount_);

		//var img_name = new Array(this.elseifCount_);
		var pad_list; // = new Array(this.elseifCount_);

		/*
		for (var i = 0; i < this.elseifCount_; i++) {


		var img_name = 'IMAGE_' + i;
		img_name='IMAGE_' + (i + 1);
		pad_list = 'Movement_' + (i + 1);



		//dropdown[i] = new Blockly.FieldDropdown(new_options);



		dropdown[i] = new Blockly.FieldDropdown(new_options,
		function(newOp) {
		this.sourceBlock_.getField(img_name).setValue(newOp);

		});


		this.appendValueInput('IF' + (i + 1))
		.setCheck([Boolean,Number])
		.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF)
		.appendField(dropdown[i], pad_list)
		.appendField(new Blockly.FieldImage('', 100, 100, '*'), img_name);
		//.appendField(new Blockly.FieldImage(img_sel[i], 100, 100, '*'));


		this.getField(img_name).EDITABLE = true;


		this.appendStatementInput('DO' + i)
		.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}
		*/

		if(this.elseifCount_ == 1) {
			dropdown[0] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 1).setValue(newOp);
				});

			this.appendValueInput('IF' + 1)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSEIF)
				.appendField(dropdown[0], 'Movement_' + 1)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 1);
			this.getField('IMAGE_' + 1).EDITABLE = true;

			this.appendStatementInput('DO1')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}

		if(this.elseifCount_ == 2) {
			dropdown[0] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 1).setValue(newOp);
				});

			this.appendValueInput('IF' + 1)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSEIF)
				.appendField(dropdown[0], 'Movement_' + 1)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 1);
			this.getField('IMAGE_' + 1).EDITABLE = true;

			this.appendStatementInput('DO1')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[1] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 2).setValue(newOp);
				});
			this.appendValueInput('IF' + 2)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSEIF)
				.appendField(dropdown[1], 'Movement_' + 2)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 2);
			this.getField('IMAGE_' + 2).EDITABLE = true;

			this.appendStatementInput('DO2')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}

		if(this.elseifCount_ == 3) {
			dropdown[0] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 1).setValue(newOp);
				});

			this.appendValueInput('IF' + 1)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[0], 'Movement_' + 1)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 1);
			this.getField('IMAGE_' + 1).EDITABLE = true;

			this.appendStatementInput('DO1')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[1] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 2).setValue(newOp);
				});
			this.appendValueInput('IF' + 2)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[1], 'Movement_' + 2)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 2);
			this.getField('IMAGE_' + 2).EDITABLE = true;

			this.appendStatementInput('DO2')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[2] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 3).setValue(newOp);
				});
			this.appendValueInput('IF' + 3)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[2], 'Movement_' + 3)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 3);
			this.getField('IMAGE_' + 3).EDITABLE = true;

			this.appendStatementInput('DO3')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}

		if(this.elseifCount_ == 4) {
			dropdown[0] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 1).setValue(newOp);
				});

			this.appendValueInput('IF' + 1)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[0], 'Movement_' + 1)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 1);
			this.getField('IMAGE_' + 1).EDITABLE = true;

			this.appendStatementInput('DO1')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[1] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 2).setValue(newOp);
				});
			this.appendValueInput('IF' + 2)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[1], 'Movement_' + 2)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 2);
			this.getField('IMAGE_' + 2).EDITABLE = true;

			this.appendStatementInput('DO2')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[2] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 3).setValue(newOp);
				});
			this.appendValueInput('IF' + 3)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[2], 'Movement_' + 3)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 3);
			this.getField('IMAGE_' + 3).EDITABLE = true;

			this.appendStatementInput('DO3')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

			dropdown[3] = new Blockly.FieldDropdown(new_options,
				function(newOp) {
					this.sourceBlock_.getField('IMAGE_' + 4).setValue(newOp);
				});
			this.appendValueInput('IF' + 4)
				.setCheck([Boolean, Number])
				.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF)
				.appendField(dropdown[3], 'Movement_' + 4)
				.appendField(Blockly.ZEROWORKSHOP_PS2_BUTTON)
				.appendField(new Blockly.FieldImage('', 150, 150, '*'), 'IMAGE_' + 4);
			this.getField('IMAGE_' + 4).EDITABLE = true;

			this.appendStatementInput('DO4')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}

		if(this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
		}
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function(workspace) {
		var containerBlock = Blockly.Block.obtain(workspace, 'control_if_if_gamepad');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK').connection;
		for(var i = 1; i <= this.elseifCount_; i++) {
			var elseifBlock = Blockly.Block.obtain(workspace, 'control_if_elseif_gamepad');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if(this.elseCount_) {
			var elseBlock = Blockly.Block.obtain(workspace, 'control_if_else_gamepad');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function(containerBlock) {
		// Disconnect the else input blocks and remove the inputs.
		if(this.elseCount_) {
			this.removeInput('ELSE');
		}
		this.elseCount_ = 0;
		// Disconnect all the elseif input blocks and remove the inputs.
		for(var i = this.elseifCount_; i > 0; i--) {
			this.removeInput('IF' + i);
			this.removeInput('DO' + i);
		}
		this.elseifCount_ = 0;
		// Rebuild the block's optional inputs.
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_if_elseif_gamepad':
					this.elseifCount_++;
					var ifInput = this.appendValueInput('IF' + this.elseifCount_)
						.setCheck([Boolean, Number])
						.appendField(Blockly.ZEROWORKSHOP_PS2_ELSEIF);
					var doInput = this.appendStatementInput('DO' + this.elseifCount_);
					doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
					// Reconnect any child blocks.
					if(clauseBlock.valueConnection_) {
						ifInput.connection.connect(clauseBlock.valueConnection_);
					}
					if(clauseBlock.statementConnection_) {
						doInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				case 'control_if_else_gamepad':
					this.elseCount_++;
					var elseInput = this.appendStatementInput('ELSE');
					elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
					// Reconnect any child blocks.
					if(clauseBlock.statementConnection_) {
						elseInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function(containerBlock) {
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 1;
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_if_elseif_gamepad':
					var inputIf = this.getInput('IF' + i);
					var inputDo = this.getInput('DO' + i);
					clauseBlock.valueConnection_ =
						inputIf && inputIf.connection.targetConnection;
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					i++;
					break;
				case 'control_if_else_gamepad':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	}
};

Blockly.Blocks['control_if_if_gamepad'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSEIF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_if_elseif_gamepad'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_if_else_gamepad'] = {
	/**
	 * Mutator block for else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PS2_PAD_ELSE);
		this.setPreviousStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_IRsensor_if'] = { //红外线
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		linkage();
		this.setColour("#29aadf");

		//this.appendDummyInput()
		//	.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_MSG);
		//.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IRsensor.png', 100, 100, '*'));

		this.appendDummyInput('IF_IR0')
			.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR)
			.appendField(new Blockly.FieldDropdown([
				["IR1", "IR_IN1"],
				["IR2", "IR_IN2"],
				["IR3", "IR_IN3"],
				["IR4", "IR_IN4"]
			]), "IR_Input0")
			.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_OBSTACLE);
		this.appendDummyInput()
			.appendField("                ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IR_sensor.png', 60, 60, '*')).appendField(new Blockly.FieldLabel('', 'control_IRsensor_if'));

		this.appendStatementInput('DO_IR0').appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);;
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.contextMenu = false;

		this.setMutator(new Blockly.Mutator(['control_IRsensor_if_elseif',
			'control_IRsensor_if_else'
		]));
		// Assign 'this' to a variable for use in the tooltip closure below.
		var thisBlock = this;
		this.setTooltip(function() {
			if(!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
			} else if(!thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
			} else if(thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
			} else if(thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
			}
			return '';
		});
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
	},
	/**
	 * Create XML to represent the number of else-if and else inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		if(!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if(this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
		}
		if(this.elseCount_) {
			container.setAttribute('else', 1);
		}
		return container;
	},
	/**
	 * Parse XML to restore the else-if and else inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
		for(var i = 1; i <= this.elseifCount_; i++) {
			this.appendDummyInput('IF_IR' + i)
				.appendField(Blockly.ZEROWORKSHOP_IF_SENSOR_IFELSE)
				.appendField(new Blockly.FieldDropdown([
					["IR1", "IR_IN1"],
					["IR2", "IR_IN2"],
					["IR3", "IR_IN3"],
					["IR4", "IR_IN4"]
				]), 'IR_Input' + i)
				.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_OBSTACLE);
			//.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IR_sensor.png', 100, 100, '*'));
			//this.appendDummyInput()
			//    .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
			this.appendStatementInput('DO_IR' + i)
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}
		if(this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
		}
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function(workspace) {
		var containerBlock = Blockly.Block.obtain(workspace, 'control_IRsensor_if_if');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK').connection;
		for(var i = 1; i <= this.elseifCount_; i++) {
			var elseifBlock = Blockly.Block.obtain(workspace, 'control_IRsensor_if_elseif');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if(this.elseCount_) {
			var elseBlock = Blockly.Block.obtain(workspace, 'control_IRsensor_if_else');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function(containerBlock) {
		// Disconnect the else input blocks and remove the inputs.
		if(this.elseCount_) {
			this.removeInput('ELSE');
		}
		this.elseCount_ = 0;
		// Disconnect all the elseif input blocks and remove the inputs.
		for(var i = this.elseifCount_; i > 0; i--) {
			this.removeInput('IF_IR' + i);
			this.removeInput('DO_IR' + i);
		}
		this.elseifCount_ = 0;
		// Rebuild the block's optional inputs.
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_IRsensor_if_elseif':
					this.elseifCount_++;
					var ifInput = this.appendValueInput('IF_IR' + this.elseifCount_)
						//.setCheck([Boolean,Number])
						.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
					var doInput = this.appendStatementInput('DO_IR' + this.elseifCount_);
					doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
					// Reconnect any child blocks.
					if(clauseBlock.valueConnection_) {
						ifInput.connection.connect(clauseBlock.valueConnection_);
					}
					if(clauseBlock.statementConnection_) {
						doInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				case 'control_IRsensor_if_else':
					this.elseCount_++;
					var elseInput = this.appendStatementInput('ELSE');
					elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
					// Reconnect any child blocks.
					if(clauseBlock.statementConnection_) {
						elseInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function(containerBlock) {
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 1;
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_IRsensor_if_elseif':
					var inputIf = this.getInput('IF_IR' + i);
					var inputDo = this.getInput('DO_IR' + i);
					clauseBlock.valueConnection_ =
						inputIf && inputIf.connection.targetConnection;
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					i++;
					break;
				case 'control_IRsensor_if_else':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	}
};

Blockly.Blocks['control_IRsensor_if_if'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_IRsensor_if_elseif'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_IRsensor_if_else'] = {
	/**
	 * Mutator block for else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
		this.setPreviousStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
		this.contextMenu = false;
	}
};
Blockly.Blocks['control_PS2_if_if'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_PS2_if_elseif'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_PS2_if_else'] = {
	/**
	 * Mutator block for else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
		this.setPreviousStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
		this.contextMenu = false;
	}
};
//only
Blockly.Blocks['control_PS2_if'] = { //my
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");

		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_PS2_MSG);

		this.appendDummyInput('IF_PS2_0')
			.appendField("            ")
			.appendField(new Blockly.FieldLabel('', 'aaa'))
			.appendField('L1')
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'L1' + 0)
			.appendField("                                  ")
			.appendField('R1')
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'R1' + 0);
		this.appendDummyInput()
			.appendField("            ")
			.appendField('L2')
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'L2' + 0)
			.appendField("                                  ")
			.appendField('R2')
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'R2' + 0);
		this.appendDummyInput()
			.appendField("                  ")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'UP' + 0)
			.appendField("                                         ")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'TRIANGLE' + 0);
		this.appendDummyInput()
			.appendField("              ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/up.png', 40, 40, '*'))
			.appendField("                                 ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/triangle.png', 40, 40, '*'));
		this.appendDummyInput()
			.appendField(" ")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'LEFT' + 0)
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/left.png', 40, 40, '*'))
			.appendField("      ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/right.png', 40, 40, '*'))
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'RIGHT' + 0)
			.appendField("     ")

			.appendField(new Blockly.FieldCheckbox("FALSE"), 'SQUARE' + 0)
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/square.png', 40, 40, '*'))
			.appendField("         ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/circle.png', 40, 40, '*'))
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'CIRCLE' + 0);

		this.appendDummyInput()
			.appendField("              ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/down.png', 40, 40, '*'))
			.appendField("                                 ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/cross.png', 40, 40, '*'));

		this.appendDummyInput()
			.appendField("                  ")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'DOWN' + 0)
			.appendField("   ")
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/select.png', 40, 40, '*'))
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'SELECT' + 0)
			.appendField("")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'START' + 0)
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/start.png', 40, 40, '*'))
			.appendField("    ")
			.appendField(new Blockly.FieldCheckbox("FALSE"), 'CROSS' + 0);

		this.appendStatementInput('DO_PS2_0')
			.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.contextMenu = false;

		this.setMutator(new Blockly.Mutator(['control_PS2_if_elseif',
			'control_PS2_if_else'
		]));
		// Assign 'this' to a variable for use in the tooltip closure below.
		var thisBlock = this;
		this.setTooltip(function() {
			if(!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
			} else if(!thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
			} else if(thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
			} else if(thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
			}
			return '';
		});
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
	},
	/**
	 * Create XML to represent the number of else-if and else inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		if(!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if(this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
		}
		if(this.elseCount_) {
			container.setAttribute('else', 1);
		}
		return container;
	},
	/**
	 * Parse XML to restore the else-if and else inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
		for(var i = 1; i <= this.elseifCount_; i++) {
			this.appendDummyInput('IF_PS2_' + i)
				.appendField("      ")
				.appendField('L1')
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'L1' + i)
				.appendField("                          ")
				.appendField('R1')
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'R1' + i);
			this.appendDummyInput()
				.appendField("      ")
				.appendField('L2')
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'L2' + i)
				.appendField("                          ")
				.appendField('R2')
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'R2' + i);
			this.appendDummyInput()
				.appendField("            ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'UP' + i)
				.appendField("                                 ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'TRIANGLE' + i);
			this.appendDummyInput()
				.appendField("          ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/up.png', 20, 20, '*'))
				.appendField("                             ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/triangle.png', 20, 20, '*'));
			this.appendDummyInput()
				.appendField(" ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'LEFT' + i)
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/left.png', 20, 20, '*'))
				.appendField("  ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/right.png', 20, 20, '*'))
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'RIGHT' + i)
				.appendField("           ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'SQUARE' + i)
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/square.png', 20, 20, '*'))
				.appendField("   ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/circle.png', 20, 20, '*'))
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'CIRCLE' + i);

			this.appendDummyInput()
				.appendField("          ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/down.png', 20, 20, '*'))
				.appendField("                             ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/cross.png', 20, 20, '*'));

			this.appendDummyInput()
				.appendField("            ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'DOWN' + i)
				.appendField("    ")
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/select.png', 20, 20, '*'))
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'SELECT' + i)
				.appendField("")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'START' + i)
				.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/start.png', 20, 20, '*'))
				.appendField("    ")
				.appendField(new Blockly.FieldCheckbox("FALSE"), 'CROSS' + i);
			this.appendStatementInput('DO_PS2_' + i)
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}
		if(this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
		}
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function(workspace) {
		var containerBlock = Blockly.Block.obtain(workspace, 'control_PS2_if_if');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK').connection;
		for(var i = 1; i <= this.elseifCount_; i++) {
			var elseifBlock = Blockly.Block.obtain(workspace, 'control_PS2_if_elseif');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if(this.elseCount_) {
			var elseBlock = Blockly.Block.obtain(workspace, 'control_PS2_if_else');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function(containerBlock) {
		// Disconnect the else input blocks and remove the inputs.
		if(this.elseCount_) {
			this.removeInput('ELSE');
		}
		this.elseCount_ = 0;
		// Disconnect all the elseif input blocks and remove the inputs.
		for(var i = this.elseifCount_; i > 0; i--) {
			this.removeInput('IF_PS2_' + i);
			this.removeInput('DO_PS2_' + i);
		}
		this.elseifCount_ = 0;
		// Rebuild the block's optional inputs.
		var clauseBlock = containerBlock.getInputTargetBlock('STACK'); //获取块
		while(clauseBlock) { //如果块存在
			switch(clauseBlock.type) { //判断块的类型
				case 'control_PS2_if_elseif':
					this.elseifCount_++;

					var ifInput = this.appendDummyInput('IF_PS2_' + this.elseifCount_)
						.appendField("         ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'UP' + this.elseifCount_)
						.appendField("                             ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'TRIANGLE' + this.elseifCount_);
					this.appendDummyInput()
						.appendField(" ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'LEFT' + this.elseifCount_)
						.appendField("           ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'RIGHT' + this.elseifCount_)
						.appendField("            ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'SQUARE' + this.elseifCount_)
						.appendField("           ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'CIRCLE' + this.elseifCount_);
					this.appendDummyInput()
						.appendField("         ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'DOWN' + this.elseifCount_)
						.appendField("        ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'SELECT' + this.elseifCount_)
						.appendField("  ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'START' + this.elseifCount_)
						.appendField("        ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'CROSS' + this.elseifCount_);
					this.appendDummyInput();
					this.appendDummyInput()
						.appendField("      ")
						.appendField('L1')
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'L1' + this.elseifCount_)
						.appendField("                          ")
						.appendField('R1')
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'R1' + this.elseifCount_);
					this.appendDummyInput()
						.appendField("      ")
						.appendField('L2')
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'L2' + this.elseifCount_)
						.appendField("                          ")
						.appendField('R2')
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'R2' + this.elseifCount_);
					this.appendDummyInput()
						.appendField("            ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'UP' + this.elseifCount_)
						.appendField("                                 ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'TRIANGLE' + this.elseifCount_);
					this.appendDummyInput()
						.appendField("          ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/up.png', 20, 20, '*'))
						.appendField("                             ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/triangle.png', 20, 20, '*'));
					this.appendDummyInput()
						.appendField(" ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'LEFT' + this.elseifCount_)
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/left.png', 20, 20, '*'))
						.appendField("  ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/right.png', 20, 20, '*'))
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'RIGHT' + this.elseifCount_)
						.appendField("           ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'SQUARE' + this.elseifCount_)
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/square.png', 20, 20, '*'))
						.appendField("   ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/circle.png', 20, 20, '*'))
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'CIRCLE' + this.elseifCount_);

					this.appendDummyInput()
						.appendField("          ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/down.png', 20, 20, '*'))
						.appendField("                             ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/cross.png', 20, 20, '*'));

					this.appendDummyInput()
						.appendField("            ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'DOWN' + this.elseifCount_)
						.appendField("    ")
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/select.png', 20, 20, '*'))
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'SELECT' + this.elseifCount_)
						.appendField("")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'START' + this.elseifCount_)
						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/start.png', 20, 20, '*'))
						.appendField("    ")
						.appendField(new Blockly.FieldCheckbox("FALSE"), 'CROSS' + this.elseifCount_);

					var doInput = this.appendStatementInput('DO_PS2_' + this.elseifCount_);
					doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
					// Reconnect any child blocks.
					if(clauseBlock.valueConnection_) {
						ifInput.connection.connect(clauseBlock.valueConnection_);
					}
					if(clauseBlock.statementConnection_) {
						doInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				case 'control_PS2_if_else':
					this.elseCount_++;
					var elseInput = this.appendStatementInput('ELSE');
					elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
					// Reconnect any child blocks.
					if(clauseBlock.statementConnection_) {
						elseInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function(containerBlock) {
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 1;
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_PS2_if_elseif':
					var inputIf = this.getInput('IF_PS2_' + i);
					var inputDo = this.getInput('DO_PS2_' + i);
					//					clauseBlock.valueConnection_ =
					//						inputIf && inputIf.connection.targetConnection;
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					i++;
					break;
				case 'control_PS2_if_else':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	}
};

Blockly.Blocks['control_IR_if'] = { //red外
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");

		this.appendDummyInput()
			.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_MSG);
		//.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IRsensor.png', 100, 100, '*'));

		this.appendDummyInput('IF_IR0')
			.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR)
			.appendField(new Blockly.FieldDropdown([
				["IR1", "IR_IN1"],
				["IR2", "IR_IN2"],
				["IR3", "IR_IN3"],
				["IR4", "IR_IN4"]
			]), "IR_Input0")
			.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_OBSTACLE)
			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IR_sensor.png', 100, 100, '*'));

		this.appendStatementInput('DO_IR0');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.contextMenu = false;

		this.setMutator(new Blockly.Mutator(['control_IR_if_elseif',
			'control_IR_if_else'
		]));
		// Assign 'this' to a variable for use in the tooltip closure below.
		var thisBlock = this;
		this.setTooltip(function() {
			if(!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
			} else if(!thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
			} else if(thisBlock.elseifCount_ && !thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
			} else if(thisBlock.elseifCount_ && thisBlock.elseCount_) {
				return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
			}
			return '';
		});
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
	},
	/**
	 * Create XML to represent the number of else-if and else inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		if(!this.elseifCount_ && !this.elseCount_) {
			return null;
		}
		var container = document.createElement('mutation');
		if(this.elseifCount_) {
			container.setAttribute('elseif', this.elseifCount_);
		}
		if(this.elseCount_) {
			container.setAttribute('else', 1);
		}
		return container;
	},
	/**
	 * Parse XML to restore the else-if and else inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
		for(var i = 1; i <= this.elseifCount_; i++) {
			this.appendDummyInput('IF_IR' + i)
				.appendField(Blockly.ZEROWORKSHOP_IF_SENSOR_IFELSE)
				.appendField(new Blockly.FieldDropdown([
					["IR1", "IR_IN1"],
					["IR2", "IR_IN2"],
					["IR3", "IR_IN3"],
					["IR4", "IR_IN4"]
				]), 'IR_Input' + i)
				.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_OBSTACLE);

			this.appendStatementInput('DO_IR' + i)
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
		}
		if(this.elseCount_) {
			this.appendStatementInput('ELSE')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
		}
	},
	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function(workspace) {
		var containerBlock = Blockly.Block.obtain(workspace, 'control_IR_if_if');
		containerBlock.initSvg();
		var connection = containerBlock.getInput('STACK').connection;
		for(var i = 1; i <= this.elseifCount_; i++) {
			var elseifBlock = Blockly.Block.obtain(workspace, 'control_IR_if_elseif');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}
		if(this.elseCount_) {
			var elseBlock = Blockly.Block.obtain(workspace, 'control_IR_if_else');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}
		return containerBlock;
	},
	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function(containerBlock) { //主块连接如果域块元素
		// Disconnect the else input blocks and remove the inputs.
		if(this.elseCount_) {
			this.removeInput('ELSE');
		}
		this.elseCount_ = 0;
		// Disconnect all the elseif input blocks and remove the inputs.
		for(var i = this.elseifCount_; i > 0; i--) {
			this.removeInput('IF_IR' + i);
			this.removeInput('DO_IR' + i);
		}
		this.elseifCount_ = 0;
		// Rebuild the block's optional inputs.
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_IR_if_elseif':
					this.elseifCount_++;
					//				var ifInput = this.appendValueInput('IF_IR' + this.elseifCount_)
					//				.setCheck([Boolean,Number])
					//				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);

					var ifInput = this.appendDummyInput('IF_IR' + this.elseifCount_)
						.appendField(Blockly.ZEROWORKSHOP_IF_SENSOR_IFELSE)
						.appendField(new Blockly.FieldDropdown([
							["IR1", "IR_IN1"],
							["IR2", "IR_IN2"],
							["IR3", "IR_IN3"],
							["IR4", "IR_IN4"]
						]), 'IR_Input' + this.elseifCount_)
						.appendField(Blockly.ZEROWORKSHOP_IR_SENSOR_OBSTACLE);

					var doInput = this.appendStatementInput('DO_IR' + this.elseifCount_);
					doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
					// Reconnect any child blocks.
					if(clauseBlock.valueConnection_) {
						ifInput.connection.connect(clauseBlock.valueConnection_);
					}
					if(clauseBlock.statementConnection_) {
						doInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				case 'control_IR_if_else':
					this.elseCount_++;
					var elseInput = this.appendStatementInput('ELSE');
					elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
					// Reconnect any child blocks.
					if(clauseBlock.statementConnection_) {
						elseInput.connection.connect(clauseBlock.statementConnection_);
					}
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	},
	/**
	 * Store pointers to any connected child blocks.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	saveConnections: function(containerBlock) {
		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
		var i = 1;
		while(clauseBlock) {
			switch(clauseBlock.type) {
				case 'control_IR_if_elseif':
					var inputIf = this.getInput('IF_IR' + i);
					var inputDo = this.getInput('DO_IR' + i);
					//				clauseBlock.valueConnection_ =
					//				inputIf && inputIf.connection.targetConnection;
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					i++;
					break;
				case 'control_IR_if_else':
					var inputDo = this.getInput('ELSE');
					clauseBlock.statementConnection_ =
						inputDo && inputDo.connection.targetConnection;
					break;
				default:
					throw 'Unknown block type.';
			}
			clauseBlock = clauseBlock.nextConnection &&
				clauseBlock.nextConnection.targetBlock();
		}
	}
};

Blockly.Blocks['control_IR_if_if'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_IR_if_elseif'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_IR_if_else'] = {
	/**
	 * Mutator block for else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
		this.setPreviousStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
		this.contextMenu = false;
	}
};

//Blockly.Blocks['control_Button_if'] = {
//	/**
//	* Mutator block for if container.
//	* @this Blockly.Block
//	*/
//	init: function() {
//		this.setColour("#29aadf");
//
//		this.appendDummyInput()
//		.appendField(Blockly.ZEROWORKSHOP_BUTTON_MSG);
//		//.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/IRsensor.png', 100, 100, '*'));
//
//		this.appendDummyInput('IF_Button0')
//		.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR)
//		.appendField(new Blockly.FieldDropdown([["A1", "BT1"], ["A2", "BT2"], ["A3", "BT3"], ["A4", "BT4"]]), "Button_Input0")
//		.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
//		.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/on.png', 50, 50, '*'));
//		
//		this.appendStatementInput('DO_Button0');
//		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
//		this.setPreviousStatement(true, null);
//		this.setNextStatement(true, null);
//		this.contextMenu = false;
//
//		this.setMutator(new Blockly.Mutator(['control_Button_if_elseif',
//		'control_Button_if_else']));
//		// Assign 'this' to a variable for use in the tooltip closure below.
//		var thisBlock = this;
//		this.setTooltip(function() {
//			if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
//				return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
//			} else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
//				return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
//			} else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
//				return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
//			} else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
//				return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
//			}
//			return '';
//		});
//		this.elseifCount_ = 0;
//		this.elseCount_ = 0;
//	},
//	/**
//	* Create XML to represent the number of else-if and else inputs.
//	* @return {Element} XML storage element.
//	* @this Blockly.Block
//	*/
//	mutationToDom: function() {
//		if (!this.elseifCount_ && !this.elseCount_) {
//			return null;
//		}
//		var container = document.createElement('mutation');
//		if (this.elseifCount_) {
//			container.setAttribute('elseif', this.elseifCount_);
//		}
//		if (this.elseCount_) {
//			container.setAttribute('else', 1);
//		}
//		return container;
//	},
//	/**
//	* Parse XML to restore the else-if and else inputs.
//	* @param {!Element} xmlElement XML storage element.
//	* @this Blockly.Block
//	*/
//	domToMutation: function(xmlElement) {
//		this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
//		this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
//		for (var i = 1; i <= this.elseifCount_; i++) {
//  this.appendDummyInput('IF_Button' + i)
//			.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
//			.appendField(new Blockly.FieldDropdown([["Button1", "BT1"], ["Button2", "BT2"], ["Button3", "BT3"], ["Button4", "BT4"]]), 'Button_Input'+i)
//			.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
//			.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/on.png', 50, 50, '*'));
//
//			this.appendStatementInput('DO_Button' + i)
//			    .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
//		}
//		if (this.elseCount_) {
//			this.appendStatementInput('ELSE')
//			.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
//		}
//	},
//	/**
//	* Populate the mutator's dialog with this block's components.
//	* @param {!Blockly.Workspace} workspace Mutator's workspace.
//	* @return {!Blockly.Block} Root block in mutator.
//	* @this Blockly.Block
//	*/
//	decompose: function(workspace) {
//		var containerBlock = Blockly.Block.obtain(workspace, 'control_Button_if_if');
//		containerBlock.initSvg();
//		var connection = containerBlock.getInput('STACK').connection;
//		for (var i = 1; i <= this.elseifCount_; i++) {
//			var elseifBlock = Blockly.Block.obtain(workspace, 'control_Button_if_elseif');
//			elseifBlock.initSvg();
//			connection.connect(elseifBlock.previousConnection);
//			connection = elseifBlock.nextConnection;
//		}
//		if (this.elseCount_) {
//			var elseBlock = Blockly.Block.obtain(workspace, 'control_Button_if_else');
//			elseBlock.initSvg();
//			connection.connect(elseBlock.previousConnection);
//		}
//		return containerBlock;
//	},
//	/**
//	* Reconfigure this block based on the mutator dialog's components.
//	* @param {!Blockly.Block} containerBlock Root block in mutator.
//	* @this Blockly.Block
//	*/
//	compose: function(containerBlock) {
//		// Disconnect the else input blocks and remove the inputs.
//		if (this.elseCount_) {
//			this.removeInput('ELSE');
//		}
//		this.elseCount_ = 0;
//		// Disconnect all the elseif input blocks and remove the inputs.
//		for (var i = this.elseifCount_; i > 0; i--) {
//			this.removeInput('IF_Button_' + i);
//			this.removeInput('DO_Button_' + i);
//		}
//		this.elseifCount_ = 0;
//		// Rebuild the block's optional inputs.
//		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
//		while (clauseBlock) {
//			switch (clauseBlock.type) {
//				case 'control_Button_if_elseif':
//				this.elseifCount_++;
////				var ifInput = this.appendValueInput('IF_Button_' + this.elseifCount_)
////				.setCheck([Boolean,Number])
////				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
//						var ifInput =
//						this.appendValueInput('IF_Button_' + this.elseifCount_)
//						.appendField(Blockly.ZEROWORKSHOP_BUTTON_SENSOR_IFELSE)
//						.appendField(new Blockly.FieldDropdown([
//							["Button1", "BT1"],
//							["Button2", "BT2"],
//							["Button3", "BT3"],
//							["Button4", "BT4"]
//						]), 'Button_Input' + this.elseifCount_)
//						.appendField(Blockly.ZEROWORKSHOP_BUTTON_PRESSED)
//						.appendField(new Blockly.FieldImage('../../media/ZeroWorkshop/on.png', 50, 50, '*'));
//				var doInput = this.appendStatementInput('DO_Button_' + this.elseifCount_);
//				doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
//				// Reconnect any child blocks.
//				if (clauseBlock.valueConnection_) {
//					ifInput.connection.connect(clauseBlock.valueConnection_);
//				}
//				if (clauseBlock.statementConnection_) {
//					doInput.connection.connect(clauseBlock.statementConnection_);
//				}
//				break;
//				case 'control_Button_if_else':
//				this.elseCount_++;
//				var elseInput = this.appendStatementInput('ELSE');
//				elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
//				// Reconnect any child blocks.
//				if (clauseBlock.statementConnection_) {
//					elseInput.connection.connect(clauseBlock.statementConnection_);
//				}
//				break;
//				default:
//				throw 'Unknown block type.';
//			}
//			clauseBlock = clauseBlock.nextConnection &&
//			clauseBlock.nextConnection.targetBlock();
//		}
//	},
//	/**
//	* Store pointers to any connected child blocks.
//	* @param {!Blockly.Block} containerBlock Root block in mutator.
//	* @this Blockly.Block
//	*/
//	saveConnections: function(containerBlock) {
//		var clauseBlock = containerBlock.getInputTargetBlock('STACK');
//		var i = 1;
//		while (clauseBlock) {
//			switch (clauseBlock.type) {
//				case 'control_Button_if_elseif':
//				var inputIf = this.getInput('IF_Button_' + i);
//				var inputDo = this.getInput('DO_Button_' + i);
//				clauseBlock.valueConnection_ =
//				inputIf && inputIf.connection.targetConnection;
//				clauseBlock.statementConnection_ =
//				inputDo && inputDo.connection.targetConnection;
//				i++;
//				break;
//				case 'control_Button_if_else':
//				var inputDo = this.getInput('ELSE');
//				clauseBlock.statementConnection_ =
//				inputDo && inputDo.connection.targetConnection;
//				break;
//				default:
//				throw 'Unknown block type.';
//			}
//			clauseBlock = clauseBlock.nextConnection &&
//			clauseBlock.nextConnection.targetBlock();
//		}
//	}};

Blockly.Blocks['control_Button_if_if'] = {
	/**
	 * Mutator block for if container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
		this.appendStatementInput('STACK');
		this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_Button_if_elseif'] = {
	/**
	 * Mutator bolck for else-if condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['control_Button_if_else'] = {
	/**
	 * Mutator block for else condition.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour("#29aadf");
		this.appendDummyInput()
			.appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
		this.setPreviousStatement(true);
		this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['MotorControl'] = {
	init: function() {
		this.appendDummyInput().appendField('马达控制')

			.appendField(new Blockly.FieldDropdown([
				["M1", "1"],
				["M2", "2"],
				["M3", "3"],
				["M4", "4"]
			]), "MotorName")
			.appendField(new Blockly.FieldDropdown([
				["顺时针", "FORWARD"],
				["逆时针", "BACKWARD"],
				["停止", "STOP"]
			]), "RunningStatus").appendField(',速度（0~255之间）为：').appendField(new Blockly.FieldTextInput('255'),'speedValue');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour('#0078D7');
		this.setTooltip('');
	}
};
Blockly.Blocks['MotorControlLT'] = {
	init: function() {
		this.appendDummyInput().appendField('马达控制')

			.appendField(new Blockly.FieldDropdown([
				["M1", "1"],
				["M2", "2"],
				["M3", "3"],
				["M4", "4"]
			]), "MotorName")
			.appendField(new Blockly.FieldDropdown([
				["逆时针", "FORWARD"],
				["顺时针", "BACKWARD"],
				["停止", "STOP"]
			]), "RunningStatus").appendField(',速度（0~255之间）为：').appendField(new Blockly.FieldTextInput('255'),'speedValue');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour('#0078D7');
		this.setTooltip('');
	}
};

Blockly.Blocks['ServoControl'] = {
	init: function() {
		this.appendDummyInput().appendField('每次舵机').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "1"],
				["ZW_B2", "2"],
				["ZW_B3", "3"],
				["ZW_B4", "4"]
			]), "ServoName")
			.appendField('变化角度（-10~10）增加：').appendField(new Blockly.FieldTextInput('0'),'angleValue')
			.appendField(',直到角度到达').appendField(new Blockly.FieldTextInput('0'),'maxValue');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		this.setTooltip('');
	}
};
Blockly.Blocks['ServoTurnto'] = {
	init: function() {
		this.appendDummyInput().appendField('设置舵机').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "1"],
				["ZW_B2", "2"],
				["ZW_B3", "3"],
				["ZW_B4", "4"]
			]), "ServoName")
			.appendField('旋转到(0~180)：').appendField(new Blockly.FieldTextInput('0'),'Servoangle');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		this.setTooltip('');
	}
};

Blockly.Blocks['ServoOrigin'] = {
	init: function() {
		this.appendDummyInput().appendField('设置舵机').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "1"],
				["ZW_B2", "2"],
				["ZW_B3", "3"],
				["ZW_B4", "4"]
			]), "ServoName").appendField('的初始角度(0~180)为:').appendField(new Blockly.FieldTextInput('0'),'servoOrigin');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		this.setTooltip('');
	}
};
Blockly.Blocks['chooseServo'] = {
	init: function() {
		this.appendValueInput('VALUE').appendField('舵机').appendField(new Blockly.FieldDropdown([
				["B1", "1"],
				["B2", "2"],
				["B3", "3"],
				["B4", "4"]
			]), "ServoName");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour('#3AE215');
		this.setTooltip('');
	}
};
Blockly.Blocks['servoSpeed'] = {
	init: function() {
		this.appendDummyInput().appendField('旋转速度为').appendField(new Blockly.FieldTextInput('0'),'servoSpeed');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};
Blockly.Blocks['servoInit'] = {
	init: function() {
		this.appendDummyInput().appendField('初始角度为').appendField(new Blockly.FieldTextInput('0'),'servorOriginAngle');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};
Blockly.Blocks['servoRotate'] = {
	init: function() {
		this.appendDummyInput().appendField('旋转到').appendField(new Blockly.FieldTextInput('0'),'servorAngle');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};
Blockly.Blocks['servoRotate_t5'] = {
	init: function() {
		this.appendValueInput('Servot5').appendField('旋转到');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};
Blockly.Blocks['servoIncrementPro'] = {
	init: function() {
		this.appendDummyInput().appendField('每次按下旋转').appendField(new Blockly.FieldTextInput('0'),'incrementAnglePro').appendField('度,直到').appendField(new Blockly.FieldTextInput('0'),'limit').appendField('度');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};

Blockly.Blocks['servoIncrement'] = {
	init: function() {
		this.appendDummyInput().appendField('每次按下旋转').appendField(new Blockly.FieldTextInput('0'),'incrementAngle').appendField('度');
		this.setColour('#3AE215');
		this.setOutput(true);
		this.setTooltip('');
	}
};

Blockly.Blocks['Score'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/basketS.png", 23, 25, ""))
			.appendField(Blockly.Msg.SCOREONE)
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/scores.png", 23, 25, ""))
			.appendField(Blockly.Msg.SCORETWO)
			.appendField(new Blockly.FieldDropdown([
				["1", "1"],
				["2", "2"]
			]), 'score').appendField(Blockly.Msg.SCORETHREE).appendField(new Blockly.FieldLabel('', 'Score'))
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#3EC1CC");
		this.setTooltip('');
	}
};

Blockly.Blocks['basketSpeed'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.BASKETSPEEDONEONE)
			.appendField(new Blockly.FieldTextInput('4'), 'noMoveLimit')
			.appendField(Blockly.Msg.BASKETSPEEDONETWO);
		this.appendDummyInput().appendField(Blockly.Msg.BASKETSPEEDONEONE)
			.appendField(new Blockly.FieldTextInput('8'), 'slowMoveLimit')
			.appendField(Blockly.Msg.BASKETSPEEDTWOTWO);
		this.appendDummyInput()
			.appendField(Blockly.Msg.BASKETSPEEDONEONE)
			.appendField(new Blockly.FieldTextInput('20'), 'fastMoveLimit')
			.appendField(Blockly.Msg.BASKETSPEEDTHREETWO);

		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/basket.gif", 270, 220, ""));
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'basketSpeed'))
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#3EC1CC");
		this.setTooltip('');
	},
	onchange: function() {
		if(!this.workspace) {
			// Block has been deleted.
			return;
		}
		var legal = false;

		var noMoveLimit = parseInt(this.getFieldValue('noMoveLimit'));
		var slowMoveLimit = parseInt(this.getFieldValue('slowMoveLimit'));
		var fastMoveLimit = parseInt(this.getFieldValue('fastMoveLimit'));
		if(noMoveLimit >= slowMoveLimit || noMoveLimit >= fastMoveLimit || slowMoveLimit >= fastMoveLimit || noMoveLimit > 28 || slowMoveLimit > 28 || fastMoveLimit > 28 || noMoveLimit < 0 || slowMoveLimit < 0 || fastMoveLimit < 0) {

		} else {
			legal = true;
		}

		if(legal) {
			this.setWarningText(null);
		} else {
			this.setWarningText('请重新设置正确的分数值!');
		}
	}
};

Blockly.Blocks['catHandle'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.CATWVAING);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/handle.gif", 100, 100, ""));
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'catHandle'))
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
}
Blockly.Blocks['catSound'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.CATCALLING);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catSound.gif", 100, 100, ""));
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'catSound'))
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('');
	}
}

Blockly.Blocks['scanningGoForward'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField(Blockly.Msg.SCANNINGGOFORWARD);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/dinosaur.gif", 170, 100, ""));
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'scanningGoForward'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#FFE600");
		this.setTooltip('');
	}
}

Blockly.Blocks['obstacleGoBack'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('', 'changeBlack')).appendField(Blockly.Msg.OBSTACLEGOBACKONE)
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/dg.svg", 20, 20, ""))
			.appendField(new Blockly.FieldLabel('', 'changeBlack'))
			.appendField(Blockly.Msg.OBSTACLEGOBACKTWO)
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/mt.svg", 20, 20, ""))
			.appendField(new Blockly.FieldLabel('', 'changeBlack'))
			.appendField(Blockly.Msg.OBSTACLEGOBACKTHREE)
			.appendField(new Blockly.FieldLabel('', 'obstacleGoBack'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#FFE600");
		this.setTooltip('');
	}
}

Blockly.Blocks['firstBtn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.LEFTGO).appendField(new Blockly.FieldLabel('', 'firstBtn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#4B53D7");
		this.setTooltip('');
	}
}

Blockly.Blocks['secondBtn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.RIGHTGO).appendField(new Blockly.FieldLabel('', 'secondBtn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#4B53D7");
		this.setTooltip('');
	}
}

Blockly.Blocks['backBtn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.PRESSBACK).appendField(new Blockly.FieldLabel('', 'backBtn'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#4B53D7");
		this.setTooltip('');
	}
}

Blockly.Blocks['hammerKnock'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.PRESSFIGHT);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/fight.png", 170, 100, "")).appendField(new Blockly.FieldLabel('', 'hammerKnock'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#4B53D7");
		this.setTooltip('');
	}
}

Blockly.Blocks['numberLives'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(Blockly.Msg.LIFEPARTONE).appendField(new Blockly.FieldDropdown([
			["1", "1"],
			["3", "3"],
			["5", "5"]
		]), 'number').appendField(Blockly.Msg.LIFEPARTTWO);
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/loseControl.png", 240, 140, "")).appendField(new Blockly.FieldLabel('', 'numberLives'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#4B53D7");
		this.setTooltip('');
	}
}

Blockly.Blocks['policeLight'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('有').appendField(new Blockly.FieldDropdown([
			["2", "2"],
			["4", "4"],
			["6", "6"],
			["8", "8"],
			["10", "10"]
		]), 'number').appendField('个警灯');
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/police.gif", 150, 100, "")).appendField(new Blockly.FieldLabel('', 'policeLight'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#040308");
		this.setTooltip('');
	}
}

Blockly.Blocks['yellowLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('选择').appendField(new Blockly.FieldDropdown([
				["B1", "1"],
				["B2", "2"],
				["B3", "3"],
				["B4", "4"]
			]), "lampName").appendField('灯亮');
			this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lightturnoff.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'yellowLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['offLED'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('选择').appendField(new Blockly.FieldDropdown([
				["B1", "1"],
				["B2", "2"],
				["B3", "3"],
				["B4", "4"]
			]), "lampNameOff").appendField('灯灭');
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lightturnon.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'offLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};


Blockly.Blocks['lampOn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('机车').appendField(new Blockly.FieldDropdown([
				["红", "1"],
				["绿", "2"],
				["蓝", "3"],
				["黄", "4"]
			]), "lampName").appendField('灯亮');
			this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampOn.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'yellowLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['lampOff'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('     机车灯熄灭');
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/lampOff.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'offLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Blockly.Blocks['shovelUp'] = {
	init: function() {
		this.appendDummyInput().appendField('     车铲向上');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/shovelUp.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['shovelDown'] = {
	init: function() {
		this.appendDummyInput().appendField('     车铲向下');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/shovelDown.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['armUp'] = {
	init: function() {
		this.appendDummyInput().appendField('铲车手臂提升');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/armUp.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['armDown'] = {
	init: function() {
		this.appendDummyInput().appendField('铲车手臂下降');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/armDown.png",100,65,""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#017DC7");
		this.setTooltip('');
	}
};

Blockly.Blocks['forkliftLampOn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('    铲车前灯亮');
		this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/forkliftLampOn.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'yellowLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['forkliftLampOff'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('   铲车前灯熄灭');
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/forkliftLampOff.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'offLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['forkliftTopLampOn'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('    铲车顶灯亮');
			this.appendDummyInput().appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/forkliftTopLampOn.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'yellowLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['forkliftTopLampOff'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('    铲车顶灯熄灭');
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/forkliftLampOff.png", 100, 80, "")).appendField(new Blockly.FieldLabel('', 'offLED'));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#7030a0");
		this.setTooltip('');
	}
};

Blockly.Blocks['volume'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('循环播放').appendField(new Blockly.FieldDropdown([
				["履带", "1"],
				["开心笑", "2"],
				["背景音乐", "3"],
				["哇哦", "4"],
				["小动作", "5"],
				["早安", "6"],
				["狗叫声","7"],
				["欢迎光临","8"],
				["欢迎下次光临","9"],
				["世界那么大我想去看看","10"],
				["欢乐跳舞音乐","11"],
				["快乐跳舞音乐","12"]
			]), "adress").appendField('的声音');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setColour("#EE3FD3");
		this.setTooltip('on A1 & A2 pins!');
	}
};
Blockly.Blocks['volumeOnlyOnce'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('播放一次').appendField(new Blockly.FieldDropdown([
				["履带", "1"],
				["开心笑", "2"],
				["背景音乐", "3"],
				["哇哦", "4"],
				["小动作", "5"],
				["早安", "6"],
				["狗叫声","7"],
				["欢迎光临","8"],
				["欢迎下次光临","9"],
				["世界那么大我想去看看","10"],
				["欢乐跳舞音乐","11"],
				["快乐跳舞音乐","12"]
			]), "adress").appendField('的声音');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setColour("#EE3FD3");
		this.setTooltip('on A1 & A2 pins!');
	}
};


Blockly.Blocks['pause'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('暂停播放').appendField(new Blockly.FieldDropdown([
				["履带", "1"],
				["开心笑", "2"],
				["背景音乐", "3"],
				["哇哦", "4"],
				["小动作", "5"],
				["早安", "6"],
				["狗叫声","7"],
				["欢迎光临","8"],
				["欢迎下次光临","9"],
				["世界那么大我想去看看","10"],
				["欢乐跳舞音乐","11"],
				["快乐跳舞音乐","12"]
			]), "adress").appendField('语音');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setColour("#EE3FD3");
		this.setTooltip('');
	}
};

Blockly.Blocks['playFileInFolder'] = {
	init: function() {
		linkage();
		/*
		this.appendDummyInput()
		    .appendField('播放文件夹')
		    .appendField(new Blockly.FieldTextInput('1'), "folderName")
		    .appendField('中')
		    .appendField(new Blockly.FieldTextInput('1'), "fileName")
		    .appendField('声音文件');
		*/
	 
		this.appendValueInput("folderName", Number)
		    .setCheck(Number)
		    .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('播放文件夹');
    
    this.appendDummyInput()
		    .appendField('中');  
		
		this.appendValueInput("fileName", Number)
		    .setCheck(Number);
		    
		
    this.appendDummyInput().appendField('.mp3声音文件');       
       
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setInputsInline(true);
		this.setColour("#EE3FD3");
		this.setTooltip('');
	}
};

Blockly.Blocks['playWeight'] = {
	init: function() {
		linkage();

		
		this.appendValueInput("WeightVar", Number)
		    .setCheck(Number)
		    .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('语音播报: 当前重量是');
    
    this.appendDummyInput()
		    .appendField('克');  
		        
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#EE3FD3");
		this.setTooltip('');
	}
};

Blockly.Blocks['setVolume'] = {
	init: function() {
		linkage();
		
		this.appendValueInput("volumeVar", Number)
		    .setCheck(Number)
		    .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('音量设置到');
    
    this.appendDummyInput()
		    .appendField('(0~30的整数)');  
		        
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#EE3FD3");
		this.setTooltip('');
	}
};
Blockly.Blocks['infrared_sensor'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('左红外线传感器').appendField(new Blockly.FieldDropdown([
			['或者','1'],
			['和','2']
		]),"relation").appendField(new Blockly.FieldLabel('','changeBlack')).appendField('者右红外线传感器的值在').appendField(new Blockly.FieldTextInput("0"),'infrared_min').appendField(new Blockly.FieldLabel('','changeBlack')).appendField("到")
			.appendField(new Blockly.FieldTextInput("0"),'infrared_max').appendField(new Blockly.FieldLabel('','changeBlack')).appendField("之间时");
		this.setOutput(true,null);
		this.setColour("#F4B5A1");
		this.setTooltip('on A3 & A4 pins!');
	}
};


Blockly.Blocks['temperature'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('左温度传感器的值').appendField(new Blockly.FieldDropdown([
			['或者','1'],
			['和','2']
		]),"relation").appendField(new Blockly.FieldLabel('','changeBlack')).appendField('右温度传感器的值在').appendField(new Blockly.FieldTextInput('0'),'min').appendField(new Blockly.FieldLabel('','changeBlack')).appendField('到').appendField(new Blockly.FieldTextInput('0'),'max').appendField(new Blockly.FieldLabel('','changeBlack')).appendField('摄氏度之间时');
		this.setOutput(true);
		this.setColour("#F4B5A1");
		this.setTooltip('on A1 & A2 pins!');
	}
};


Blockly.Blocks['ultrasonic_sensor'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('超声波传感器的值在').appendField(new Blockly.FieldTextInput('0'),'min').appendField(new Blockly.FieldLabel('','changeBlack')).appendField('和').appendField(new Blockly.FieldTextInput('0'),'max').appendField(new Blockly.FieldLabel('','changeBlack')).appendField('之间时');
		this.setOutput(true);
		this.setColour("#F4B5A1");
		this.setTooltip('on A3 pins!');
	}
};



Blockly.Blocks['custom_lamp'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField("将").appendField(new Blockly.FieldDropdown([
			["B1","1"],
			["B2","2"],
			["B3","3"],
			["B4","4"]
		]),"lampPin").appendField(new Blockly.FieldLabel('','changeBlack')).appendField('位置上').appendField(new Blockly.FieldTextInput('0'),"lampNumber").appendField(new Blockly.FieldLabel('','changeBlack')).appendField("个RGB灯设置为").appendField(new Blockly.FieldDropdown([
			["红光",'1'],
			["绿光",'2'],
			["蓝光",'3'],
			["黄光",'4'],
			["白光",'5'],
			["熄灭",'6']
		]),"lampColor");
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setColour("#F4EA2A");
		this.setTooltip('');
	}
};

Blockly.Blocks['optional_LED'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField(new Blockly.FieldDropdown([
			["点亮","1"],
			["关闭","2"]
		]),"state").appendField(new Blockly.FieldDropdown([
			["B1","1"],
			["B2","2"],
			["B3","3"],
			["B4","4"]
		]),"lampPin").appendField(new Blockly.FieldLabel('','changeBlack')).appendField("位置上的LED灯");
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setColour("#F4EA2A");
		this.setTooltip('');
	}
};

Blockly.Blocks['wagTheTail'] = {
	init: function() {
		this.appendDummyInput().appendField('小狗摇尾巴');
		this.setColour('#3AE215');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};

Blockly.Blocks['dance'] = {
	init: function() {
		this.appendDummyInput().appendField('瓦力跳舞');
		this.setColour('#3AE215');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};

Blockly.Blocks['danceStop'] = {
	init: function() {
		this.appendDummyInput().appendField('瓦力停止跳舞');
		this.setColour('#3AE215');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};


Blockly.Blocks['RemoteControlButton'] = {
	init: function() {
		linkage();
		this.appendValueInput("VALUE").appendField('按住').appendField(new Blockly.FieldDropdown([
			['上','1'],
			['下','2'],
			['左','3'],
			['右','4'],
			['三角','5'],
			['X','6'],
			['方块','7'],
			['⚪','8'],
			['L1','9'],
			['L2','10'],
			['R1','11'],
			['R2','12'],
			['START','13'],
			['SELECT','14']
		]),"buttonID").appendField('键').appendField(new Blockly.FieldDropdown([
			['或者','1'],
			['和','2']
		]),"relation");
		this.setOutput(true);
		this.setColour("#B3A7D3");
	}
};

Blockly.Blocks['RemoteControlButton_t5'] = {
	init: function() {
		linkage();
		this.appendValueInput("VALUE").appendField('按住').appendField(new Blockly.FieldDropdown([
			['上','1'],
			['下','2'],
			['左','3'],
			['右','4'],
			['三角','5'],
			['X','6'],
			['方块','7'],
			['⚪','8'],
			['L1','9'],
			['L2','10'],
			['R1','11'],
			['R2','12'],
			['START','13'],
			['SELECT','14']
		]),"buttonID").appendField('键').appendField(new Blockly.FieldDropdown([
			['或者','1'],
			['和','2']
		]),"relation");
		this.setOutput(true);
		this.setColour("#7C83A7");
	}
};

Blockly.Blocks['RemoteControlButtonLast'] = {
	init: function() {
		linkage();
		
		this.appendDummyInput().appendField('按住').appendField(new Blockly.FieldDropdown([
			['上','1'],
			['下','2'],
			['左','3'],
			['右','4'],
			['三角','5'],
			['叉','6'],
			['方块','7'],
			['圆','8'],
			['L1','9'],
			['L2','10'],
			['R1','11'],
			['R2','12'],
			['START','13'],
			['SELECT','14']
		]),"buttonID").appendField('键');
		this.setOutput(true);
		this.setColour("#B3A7D3");
	}
};

Blockly.Blocks['RemoteControlButtonLast_t5'] = {
	init: function() {
		linkage();
		
		this.appendDummyInput().appendField('按住').appendField(new Blockly.FieldDropdown([
			['上','1'],
			['下','2'],
			['左','3'],
			['右','4'],
			['三角','5'],
			['叉','6'],
			['方块','7'],
			['圆','8'],
			['L1','9'],
			['L2','10'],
			['R1','11'],
			['R2','12'],
			['START','13'],
			['SELECT','14']
		]),"buttonID").appendField('键');
		this.setOutput(true);
		this.setColour("#7C83A7");
	}
};


Blockly.Blocks['followLine'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('启动巡线模块');
		this.setColour('#F4B5A1');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};

Blockly.Blocks['followLine_speed'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('设置巡线小车的速度为').appendField(new Blockly.FieldTextInput('200'),'speed').appendField(new Blockly.FieldLabel('','changeBlack')).appendField(',巡查路线颜色为').appendField(new Blockly.FieldDropdown([
			['黑','1'],
			['白','2']
		]),"lineColor");
		this.setColour('#F4B5A1');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};
Blockly.Blocks['followLine_verification'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('巡线小车传感器校准');
		this.setColour('#F4B5A1');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};
Blockly.Blocks['followLine_traversal'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('巡线小车第一次遍历巡路线');
		this.setColour('#F4B5A1');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};
Blockly.Blocks['followLine_finishLine'] = {
	init: function() {
		this.appendDummyInput().appendField(new Blockly.FieldLabel('','changeBlack')).appendField('按下start后直接到达目的地！');
		this.setColour('#F4B5A1');
		this.setPreviousStatement(true,null);
		this.setNextStatement(true,null);
		this.setTooltip('');
	}
};

Blockly.Blocks['control_condition'] = {
	init: function() {
		this.appendDummyInput().appendField('遍历巡线成功');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setOutput(true, null);
		this.setColour("#B3A7D3");
		this.setTooltip('');
	}
};

Blockly.Blocks['infrared_sensor_single'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('红外线传感器').appendField(new Blockly.FieldDropdown([
				["A1", "1"],
				["A2", "2"],
				["A3", "3"],
				["A4", "4"]
			]), "infraredPin").appendField('的值');
		this.setOutput(true,null);
		this.setColour("#384D9E");
		this.setTooltip('');
	}
};
Blockly.Blocks['pressureTransducer'] = {
	init: function() {
		this.appendDummyInput().appendField('压力传感器的值');
		this.setOutput(true,null);
		this.setColour("#384D9E");
		this.setTooltip('');
	}
}

Blockly.Blocks['MotorControlTime'] = {
	init: function() {
		this.appendDummyInput().appendField('马达控制')

			.appendField(new Blockly.FieldDropdown([
				["M1", "1"],
				["M2", "2"],
				["M3", "3"],
				["M4", "4"]
			]), "MotorName")
			.appendField(new Blockly.FieldDropdown([
				["顺时针", "FORWARD"],
				["逆时针", "BACKWARD"],
				["停止", "STOP"]
			]), "RunningStatus").appendField(',速度（0~255之间）为：').appendField(new Blockly.FieldTextInput('255'),'speedValue')
			.appendField(',旋转').appendField(new Blockly.FieldTextInput('3'),'timeValue').appendField('秒');

		//.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/catch.png", 150, 80, ""));
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour('#0078D7');
		this.setTooltip('');
	}
};

Blockly.Blocks['motor_speed_fillings'] = {
	init: function() {
		this.appendValueInput("speed",Number).appendField('马达控制')
			.appendField(new Blockly.FieldDropdown([
				["M1", "1"],
				["M2", "2"],
				["M3", "3"],
				["M4", "4"]
			]), "MotorName")
			.appendField(new Blockly.FieldDropdown([
				["顺时针", "BACKWARD"],
				["逆时针", "FORWARD"],
				["停止", "STOP"]
			]), "RunningStatus").appendField(',速度（0~255之间）为：').setCheck(Number);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		this.setTooltip('');
	}
};
Blockly.Blocks['voiceNumber'] = {
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendValueInput('VALUE').appendField('BUSY').appendField(new Blockly.FieldDropdown([
			["ZW_A1", "1"],
			["ZW_A2", "2"],
			["ZW_A3", "3"],
			["ZW_A4", "4"]
		]), 'pinOne').appendField('SDA').appendField(new Blockly.FieldDropdown([
			["ZW_A2", "2"],
			["ZW_A1", "1"],
			["ZW_A3", "3"],
			["ZW_A4", "4"]
		]), 'pinSec').appendField("执行 voiceNumber 参数");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};
Blockly.Blocks['voiceWord'] = {
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendValueInput('VALUE').appendField('BUSY').appendField(new Blockly.FieldDropdown([
			["ZW_A1", "1"],
			["ZW_A2", "2"],
			["ZW_A3", "3"],
			["ZW_A4", "4"]
		]), 'pinOne').appendField('SDA').appendField(new Blockly.FieldDropdown([
			["ZW_A2", "2"],
			["ZW_A1", "1"],
			["ZW_A3", "3"],
			["ZW_A4", "4"]
		]), 'pinSec').appendField("执行 voiceWord 参数");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.Blocks['MultipleMotorSet'] = {
	init: function() {
		this.appendDummyInput().appendField('马达控制')
			.appendField('M1').appendField(new Blockly.FieldTextInput('0'),'m1Speed').appendField(',')
			.appendField('M2').appendField(new Blockly.FieldTextInput('0'),'m2Speed').appendField(',')
			.appendField('M3').appendField(new Blockly.FieldTextInput('0'),'m3Speed').appendField(',')
			.appendField('M4').appendField(new Blockly.FieldTextInput('0'),'m4Speed')
			.appendField(',时间').appendField(new Blockly.FieldTextInput('0'),'timeValue').appendField('秒');

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#20C997");
		this.setTooltip('');
	}
};

Blockly.Blocks['MultipleServoSet'] = {
	init: function() {
		this.appendDummyInput()
			.appendField('伺服控制  B1以速度').appendField(new Blockly.FieldTextInput('0'),'b1s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'b1r').appendField('角度')
			this.appendDummyInput().appendField('                B2以速度').appendField(new Blockly.FieldTextInput('0'),'b2s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'b2r').appendField('角度')
			this.appendDummyInput().appendField('                B3以速度').appendField(new Blockly.FieldTextInput('0'),'b3s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'b3r').appendField('角度')
			this.appendDummyInput().appendField('                B4以速度').appendField(new Blockly.FieldTextInput('0'),'b4s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'b4r').appendField('角度')
			this.appendDummyInput().appendField('                A1以速度').appendField(new Blockly.FieldTextInput('0'),'a1s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'a1r').appendField('角度')
			this.appendDummyInput().appendField('                A2以速度').appendField(new Blockly.FieldTextInput('0'),'a2s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'a2r').appendField('角度')
			this.appendDummyInput().appendField('                A3以速度').appendField(new Blockly.FieldTextInput('0'),'a3s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'a3r').appendField('角度')
			this.appendDummyInput().appendField('                A4以速度').appendField(new Blockly.FieldTextInput('0'),'a4s').appendField('直接转到').appendField(new Blockly.FieldTextInput('0'),'a4r').appendField('角度')

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('速度档范围1~10，角度范围0~180');
	}
};

Blockly.Blocks['MultipleServoSetPD'] = {
	init: function() {
		this.appendDummyInput()
			.appendField('按住按钮,伺服控制  B1以速度').appendField(new Blockly.FieldTextInput('0'),'b1s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'b1r').appendField('角度')
			this.appendDummyInput().appendField('                              B2以速度').appendField(new Blockly.FieldTextInput('0'),'b2s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'b2r').appendField('角度')
			this.appendDummyInput().appendField('                              B3以速度').appendField(new Blockly.FieldTextInput('0'),'b3s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'b3r').appendField('角度')
			this.appendDummyInput().appendField('                              B4以速度').appendField(new Blockly.FieldTextInput('0'),'b4s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'b4r').appendField('角度')
			this.appendDummyInput().appendField('                              A1以速度').appendField(new Blockly.FieldTextInput('0'),'a1s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'a1r').appendField('角度')
			this.appendDummyInput().appendField('                              A2以速度').appendField(new Blockly.FieldTextInput('0'),'a2s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'a2r').appendField('角度')
			this.appendDummyInput().appendField('                              A3以速度').appendField(new Blockly.FieldTextInput('0'),'a3s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'a3r').appendField('角度')
			this.appendDummyInput().appendField('                              A4以速度').appendField(new Blockly.FieldTextInput('0'),'a4s').appendField('转向').appendField(new Blockly.FieldTextInput('0'),'a4r').appendField('角度')

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#0D4366");
		this.setTooltip('速度档范围1~10，角度范围0~180');
	}
};

Blockly.Blocks['ultrasonic_sensor_sbt'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('超声波传感器').appendField(new Blockly.FieldDropdown([
			["ZW_A1","ZW_A1"],
			["ZW_A2","ZW_A2"],
			["ZW_A3","ZW_A3"],
			["ZW_A4","ZW_A4"]
		]),"pin").appendField('检测到的距离值在').appendField(new Blockly.FieldTextInput(''),'min').appendField('cm和').appendField(new Blockly.FieldTextInput(''),'max').appendField('cm范围之间时');
		this.setOutput(true);
		this.setColour("#7C83A7");
		this.setTooltip('判断超声波检测的距离是否在此范围内,返回是或否（超声波传感器检测距离范围0-100cm）');
	}
};

Blockly.Blocks['ultrasonic_sensor_value_sbt'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('超声波传感器').appendField(new Blockly.FieldDropdown([
			["ZW_A1","ZW_A1"],
			["ZW_A2","ZW_A2"],
			["ZW_A3","ZW_A3"],
			["ZW_A4","ZW_A4"]
		]),"pin").appendField('检测到的距离值');
		this.setOutput(true);
		this.setColour("#7C83A7");
		this.setTooltip('返回超声波检测到的距离值(超声波传感器检测距离范围0-100cm)');
	}
};

Blockly.Blocks['infrared_sensor_sbt'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('红外线传感器').appendField(new Blockly.FieldDropdown([
				["ZW_A1", "1"],
				["ZW_A2", "2"],
				["ZW_A3", "3"],
				["ZW_A4", "4"]
			]), "infraredPin").appendField('返回的模拟值在').appendField(new Blockly.FieldTextInput(""),'infrared_min').appendField("和")
			.appendField(new Blockly.FieldTextInput(""),'infrared_max').appendField("之间时");
		this.setOutput(true,null);
		this.setColour("#7C83A7");
		this.setTooltip('红外线传感器返回的模拟值约0到900,值越大距离越远,超过范围表示检测不到物体');
	}
};

Blockly.Blocks['infrared_sensor_value_sbt'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('红外线传感器').appendField(new Blockly.FieldDropdown([
				["ZW_A1", "1"],
				["ZW_A2", "2"],
				["ZW_A3", "3"],
				["ZW_A4", "4"]
			]), "infraredPin").appendField('的值');
		this.setOutput(true,null);
		this.setColour("#7C83A7");
		this.setTooltip('红外线传感器返回的模拟值约0到900,值越大距离越远,超过范围表示检测不到物体');
	}
};


Blockly.Blocks['temperature_sbt'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('温度传感器').appendField(new Blockly.FieldDropdown([
				["ZW_A1", "ZW_A1"],
				["ZW_A2", "ZW_A2"],
				["ZW_A3", "ZW_A3"],
				["ZW_A4", "ZW_A4"]
			]), "Pin").appendField('的值在').appendField(new Blockly.FieldTextInput(''),'min').appendField('和').appendField(new Blockly.FieldTextInput(''),'max').appendField('摄氏度之间时');
		this.setOutput(true);
		this.setColour("#7C83A7");
		this.setTooltip('');
	}
};

Blockly.Blocks['temperature_value_sbt'] = {
	init: function() {
		
		this.appendDummyInput().appendField('温度传感器').appendField(new Blockly.FieldDropdown([
				["ZW_A1", "ZW_A1"],
				["ZW_A2", "ZW_A2"],
				["ZW_A3", "ZW_A3"],
				["ZW_A4", "ZW_A4"]
			]), "Pin").appendField('的值');
		this.setOutput(true);
		this.setColour("#7C83A7");
		this.setTooltip('');
	}
};

Blockly.Blocks['TongChuangAuto'] = {
	init: function() {

		this.appendDummyInput().appendField('自动模式参数设置(舵机驱动机械爪):');
		this.appendDummyInput().appendField('机械臂底部舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "armLowerServo").appendField('  待机角度').appendField(new Blockly.FieldTextInput('0'),'armLowerServoInitPos').appendField('度').appendField('  抓取角度').appendField(new Blockly.FieldTextInput('0'),'armLowerServoCatchPos').appendField('度');
    
    
		this.appendDummyInput().appendField('机械臂上部舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "armHigherServo").appendField('  待机角度').appendField(new Blockly.FieldTextInput('0'),'armHigherServoInitPos').appendField('度').appendField('  抓取角度').appendField(new Blockly.FieldTextInput('0'),'armHigherServoCatchPos').appendField('度');
		
		this.appendDummyInput().appendField('机械爪舵机         ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "handServo").appendField('  张开角度').appendField(new Blockly.FieldTextInput('0'),'handServoOpenPos').appendField('度').appendField('  闭合角度').appendField(new Blockly.FieldTextInput('0'),'handServoClosePos').appendField('度');
		
		this.appendDummyInput().appendField('红外线扫描舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "headServo").appendField('  中间角度').appendField(new Blockly.FieldTextInput('0'),'headServoMidPos').appendField('度').appendField('  左右范围').appendField(new Blockly.FieldTextInput('0'),'headServoRange').appendField('度');
					
		this.appendDummyInput().appendField('允许自动识别抓取  ').appendField(new Blockly.FieldTextInput('60'),'userDefined_grabTime').appendField('秒');
    
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(200);
		this.setTooltip('设置自动阶段参数');
	}
};

Blockly.Blocks['TongChuangAutoMotorClaw'] = {
	init: function() {

		this.appendDummyInput().appendField('自动模式参数设置(电机机驱动机械爪):');
		this.appendDummyInput().appendField('机械臂底部舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "armLowerServo").appendField('  待机角度').appendField(new Blockly.FieldTextInput('0'),'armLowerServoInitPos').appendField('度').appendField('  抓取角度').appendField(new Blockly.FieldTextInput('0'),'armLowerServoCatchPos').appendField('度');
    
    
		this.appendDummyInput().appendField('机械臂上部舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "armHigherServo").appendField('  待机角度').appendField(new Blockly.FieldTextInput('0'),'armHigherServoInitPos').appendField('度').appendField('  抓取角度').appendField(new Blockly.FieldTextInput('0'),'armHigherServoCatchPos').appendField('度');
		
		this.appendDummyInput().appendField('红外线扫描舵机  ').appendField(new Blockly.FieldDropdown([
				["ZW_B1", "ZW_B1"],
				["ZW_B2", "ZW_B2"],
				["ZW_B3", "ZW_B3"],
				["ZW_B4", "ZW_B4"]
			]), "headServo").appendField('  中间角度').appendField(new Blockly.FieldTextInput('0'),'headServoMidPos').appendField('度').appendField('  左右范围').appendField(new Blockly.FieldTextInput('0'),'headServoRange').appendField('度');
					
		this.appendDummyInput().appendField('允许自动识别抓取  ').appendField(new Blockly.FieldTextInput('60'),'userDefined_grabTime').appendField('秒');
		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(200);
		this.setTooltip('设置自动阶段参数');
	}
};

Blockly.Blocks['readColorSensor'] = {
	init: function() {
		linkage();
		this.appendDummyInput().appendField('读取颜色传感器RGB读值');
				
		this.setColour("#7C163E");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);		
	}
};

Blockly.Blocks['readColorSensorValue'] = {
	init: function() {
		linkage();
		this.appendDummyInput()
		    .appendField('RGB')
		    .appendField(new Blockly.FieldDropdown([
				["R", "RGB_red"],
				["G", "RGB_green"],
				["B", "RGB_blue"]
			]), "RGB_Value").appendField('读值');
		this.setOutput(true,null);
		
		this.setColour("#7C163E");
		

	}
};

var rgb_block_color = 100;
Blockly.Blocks.RGB_color_seclet = {
    init: function () {
      this.setColour(rgb_block_color);
      this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldColour("ff0000"), "COLOR");
      this.setInputsInline(true);
      this.setOutput(true, Number);
      this.setTooltip(Blockly.OLED_DRAW_PIXE_TOOLTIP);
    }
  };

  Blockly.Blocks.RGB_color_rgb = {
    init: function () {
      this.setColour(rgb_block_color);
      this.appendValueInput("R")
      .setCheck(Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.MIXLY_RGB_R);
      this.appendValueInput("G")
      .setCheck(Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.MIXLY_RGB_G);
      this.appendValueInput("B")
      .setCheck(Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.MIXLY_RGB_B);
      this.setInputsInline(true);
      this.setOutput(true);
      this.setTooltip('');
    }
  };

//RGB
Blockly.Blocks.display_rgb_init = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("LEDCOUNT")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_RGB_COUNT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.display_rgb_Brightness = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("Brightness")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_BRIGHTNESS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setFieldValue("ZW_A1", "PIN");
  }
};


Blockly.Blocks.display_rgb = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("_LED_")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_RGB_NUM);
    this.appendDummyInput("")
    .appendField(Blockly.Msg.HTML_COLOUR);
    this.appendValueInput("COLOR", Number)
    .setCheck(Number);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.display_rgb_show = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB_SHOW)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

var DISPLAY_RAINBOW_TYPE = [
[Blockly.MIXLY_RGB_DISPLAY_RAINBOW_TYPE_1, "normal"],
[Blockly.MIXLY_RGB_DISPLAY_RAINBOW_TYPE_2, "change"]
];


Blockly.Blocks.display_rgb_rainbow1 = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("WAIT")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_RGBdisplay_rgb_rainbow1);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.display_rgb_rainbow2 = {
  init: function () {
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("WAIT")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_RGBdisplay_rgb_rainbow2);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.display_rgb_rainbow3 = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("")
    .appendField(new Blockly.FieldDropdown(DISPLAY_RAINBOW_TYPE), "TYPE");
    this.appendValueInput("rainbow_color")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField(Blockly.MIXLY_RGB_display_rgb_rainbow3);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.display_rainbow_stream = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("WAIT")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField("流水彩虹灯切换时间");
    this.setInputsInline(true);
    this.appendDummyInput("")
    .appendField("毫秒");
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};


Blockly.Blocks.display_theaterChase_rainbow_stream = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_RGB)
    .appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"],
							["ZW_B1", "ZW_B1"],
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"],
							["ZW_B4", "ZW_B4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("WAIT")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField("剧院彩虹灯间隔");
    this.setInputsInline(true);
    this.appendDummyInput("")
    .appendField("毫秒");
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};



Blockly.Blocks.password = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField("按键")
    //.appendField(Blockly.MIXLY_PIN)
    //.appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(new Blockly.FieldDropdown([
							["ZW_A1", "ZW_A1"],
							["ZW_A2", "ZW_A2"],
							["ZW_A3", "ZW_A3"],
							["ZW_A4", "ZW_A4"]
						]), 'PIN')
    .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("VALUE")
    .setCheck(Number)
    .setAlign(Blockly.ALIGN_RIGHT)
    .appendField("对应密码字符");
    this.setInputsInline(true);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setFieldValue("ZW_A1", "PIN");
  }
};

Blockly.Blocks.setpassword = {
  init: function () {
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
    .appendField("设置密码为:");
    
    this.appendDummyInput("WAIT")
     .appendField("对应密码字符");
    this.setInputsInline(true);


    this.appendDummyInput()
      .appendField(Blockly.beatlePlaysong)
      .appendField(new Blockly.FieldTextInput('453'),'passwd');	
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

  }
};

Blockly.Blocks.checkpassword = {
  init: function () {

  this.setColour(rgb_block_color);
  
  this.appendDummyInput("")
		  .appendField("密码验证返回值", "RGB_Value");
		    
	this.setOutput(true,null);
  
  
    

  }
};

Blockly.Blocks.resetpasswordinput = {
  init: function () {
  
    this.setColour(rgb_block_color);
    this.appendDummyInput("")
        .appendField("撤销输入");
    
    
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

  }
};

Blockly.Blocks.ZWinout_analog_write = {
  init: function() {
    this.setColour(20);
    /*
	  this.appendValueInput("PIN", Number)
        .appendField(Blockly.MIXLY_ANALOGWRITE_PIN)
        .setCheck(Number);
    this.appendValueInput("NUM", Number)
        .appendField(Blockly.MIXLY_VALUE2)
        .setCheck(Number);
    this.setInputsInline(true);
    */
    this.appendDummyInput("")
	      .appendField(Blockly.MIXLY_ANALOGWRITE_PIN)
        .appendField(new Blockly.FieldDropdown([
							["ZW_B2", "ZW_B2"],
							["ZW_B3", "ZW_B3"]
						]), 'PIN')
				.appendField(Blockly.MIXLY_VALUE2)
				.appendField('(0~255之间):');
		this.appendValueInput("VALUE")
    .setCheck(Number);
    this.setInputsInline(true);
				
				//.appendField(new Blockly.FieldTextInput('0'),'analogValue');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.MIXLY_TOOLTIP_INOUT_ANALOG_WRITE);
  }
};