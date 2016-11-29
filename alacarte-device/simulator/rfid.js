//@module
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');      
var PinsSimulators = require('PinsSimulators');

var AddBehavior = function(content, data, dictionary) {
    Behavior.call(this, content, data, dictionary);
}
AddBehavior.prototype = Object.create(Behavior.prototype, {
    onCreate: { value: 
        function(column, data) {
              buttonContainer = new ButtonContainer(data);
              column.partContentsContainer.add(radioGroup);
             // column.partContentsContainer.add(buttonContainer);
        }
    }
});

var whiteSkin = new Skin({fill: "white"});

var MyRadioGroup = BUTTONS.RadioGroup.template(function($){ return {
    top: 50, bottom: 50, left: 50, right: 50,
    behavior: Object.create(BUTTONS.RadioGroupBehavior.prototype, {
        onRadioButtonSelected: {value: function(buttonName){
        	this.value = buttonName;
    	}},
    	getValue: { value: function(buttonName) {
    		return this.value;
        }},
    })
}});

var radioGroup = new MyRadioGroup({buttonNames: "null,banana,chocolate chip cookies,whole wheat bread,ground beef,apple,milk"});
var twoColorSkin = exports.twoColorSkin = new Skin({ fill: ['#FFAC8B', '#FA8354'], });
var labelStyle = exports.labelStyle = new Style({ 
    color: 'white', font: '20px', horizontal: 'null', vertical: 'null', 
});
var ButtonContainer = exports.ButtonContainer = Container.template(function($) { return { 
    left: 0, right: 0, top: 0, height: 100, 
    contents: [
        Container($, { width: 180, height: 40, active: true, skin: twoColorSkin, name: 'button', 
            behavior: Object.create(ButtonContainerBehavior.prototype), 
            contents: [
                Label($, { left: 0, right: 0, top: 0, bottom: 0, style: labelStyle, 
                string: 'Add item to cart', }),
            ]
        })
    ]
}});

var ButtonContainerBehavior = function(content, data, dictionary) {
    Behavior.call(this, content, data, dictionary);
}
ButtonContainerBehavior.prototype = Object.create(Behavior.prototype, {
    onTouchBegan: { value: 
        function(container, id, x, y, ticks) {
            container.state = 1;
        },
    },
    onTouchEnded: { value: 
        function(container, id, x, y, ticks) {
            container.state = 0;
        },
    }
});

// BLL API
var configure = exports.configure = function(configuration) {
    var data = {
        behavior: AddBehavior,            
        header: { 
            label: "Cart Input",         
            name: "Simulated item addition",         
            iconVariant: PinsSimulators.SENSOR_BUTTON 
        }
    };
    this.pinsSimulator = shell.delegate("addSimulatorPart", data);
    value = 0;
}

var close = exports.close = function() {
    shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

var read = exports.read = function() {
	return radioGroup.delegate("getValue");
}

exports.pins = {

};