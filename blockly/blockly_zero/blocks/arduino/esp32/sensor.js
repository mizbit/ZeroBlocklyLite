'use strict';

goog.provide('Blockly.Blocks.sensor');
goog.require('Blockly.Blocks');
Blockly.Blocks.sensor.HUE = 40;
//ESP32片内霍尔传感器值
Blockly.Blocks['ESP32_hallRead'] = {
  init: function() {
    this.appendDummyInput()
    .appendField(Blockly.ESP32_HALL);
    this.setOutput(true, null);
    this.setColour(Blockly.Blocks.sensor.HUE);
    this.setTooltip();
    this.setHelpUrl("");
}
};

//ESP32片内温度传感器值
Blockly.Blocks['ESP32_temprature'] = {
  init: function() {
    this.appendDummyInput()
    .appendField(Blockly.ESP32_TEMP);
    this.setOutput(true, null);
    this.setColour(Blockly.Blocks.sensor.HUE);
    this.setTooltip();
    this.setHelpUrl("");
}
};