var a = -1;
var twice = -1;
var z = 0;

var aggregate = [];
var oldHeight = 62;


Blockly.Blocks['zeroPS2'] = {//遥控器

	init: function() {
		

		
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
		var scale = 1;
		z = a;
		console.log('start_a:'+a);
		this.appendDummyInput('IF0')
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/complete.png", 350*scale, 300*scale, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover0'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/upDark.png", 60*scale, 60*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/downDark.png", 60*scale, 60*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/leftDark.png", 60*scale, 60*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/rightDark.png", 60*scale, 60*scale, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover00'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/TriangleDark.png", 50*scale, 50*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/×Dark.png", 50*scale, 50*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/SquareDark.png", 50*scale, 50*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/roundDark.png", 50*scale, 50*scale, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover000'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56*scale, 46*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56*scale, 46*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56*scale, 46*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/xBD.png", 56*scale, 46*scale, ""))
			.appendField(new Blockly.FieldLabel('', z + 'cover0000'))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/selectDark.png", 25*scale, 25*scale, ""))
			.appendField(new Blockly.FieldImage("../../media/ZeroWorkshop/startDark.png", 25*scale, 25*scale, ""))
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
				[Blockly.BPS2_pressLogicalAnd, "&&"],
				[Blockly.BPS2_pressLogicalOr, "||"]
			]), "andOr");
    this.setOutput(true, Boolean);	
		
		this.setColour('#f4436d');
		this.setMutator(new Blockly.Mutator());
		this.elseifCount_ = 0;
		this.elseCount_ = 0;
		//		console.log('init')
		reSetCheckbox(z);
	}

};