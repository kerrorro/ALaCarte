import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import KEYBOARD from './keyboard';

let feedbackStyle = new Style({ font: "30px Open Sans", color: "#828282" });
let itemStyle = new Style({ font: "24px Open Sans", color: "#828282" });
let locationStyle = new Style({ font: "18px Quicksand", color: "#828282" });

let locationImg = new Texture("assets/location.png");
let mapImg = new Texture("assets/store_map.png");
let searchImg = new Texture("assets/searchIcon.png");

let locationSkin = new Skin({ width: 15, height: 15, texture: locationImg, variants: 15});
let mapSkin = new Skin({ width: 337, height: 220, texture: mapImg });
let searchSkin = new Skin({ width: 30, height: 30, texture: searchImg, variants: 30 });

let locationDict = {
	"bread": { area: "Bakery", row: 12, col: 1 },
	"chicken": { area: "Seafood/Meat", row: 1, col: 24 },
	"ketchup": { area: 4, row: 5, col: 12, offset: "right" },
	"avocado": { area: "Produce", row: 11, col: 26 },
	"pasta": { area: 6, row: 10, col: 16 , offset: "left" }
}

var userInput = []

var circleCount = 0;
export var LocationCircle = Container.template($ => ({
	top: $.top, left: $.left, height: 15, width: 15,
	name: $.name, skin: locationSkin, variant: 0, active: true,
	interval: 300,
	behavior: Behavior({
		onCreate(circle){
			circleCount++;
			circle.start();
		},
		onTimeChanged(circle){
			circle.variant == 0 ? circle.variant = 1 : circle.variant = 0;
		},
		clearLocation(circle){
			circleCount--;
			trace("removing circle \n");
			circle.container.remove(circle);
		},
		inactivateCircle(circle){
			trace("inactivating circle \n");
			circle.stop();
			circle.variant = 1;
		}
	})
}));


let nameInputSkin = new Skin({ borders: { left: 1, right: 1, top: 1, bottom: 1 }, fill: 'white', stroke: '#828282' });
let fieldStyle = new Style({ color: '#828282', font: 'bold 24px Open Sans', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldHintStyle = new Style({ color: "#BDBDBD", font: '20px Open Sans', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let whiteSkin = new Skin({ fill: "white" });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });


var input;
let EnterButton = Container.template($ => ({ 
	height: 30, width: 30, left: 10, right: 25,
	skin: searchSkin, active: true,
	contents: [],
	behavior: Behavior({
		onTouchEnded(container){
			if(container.variant == 1){
				container.variant = 0;
				container.container.container.map.distribute("drawLocation", input);
				container.container.first.distribute("onEnter");
			}
			container.focus();
		},
		toggleHighlight(container, state){
			state == true ? container.variant = 1 : container.variant = 0;
		}
	})	
}));
let MyField = Container.template($ => ({ 
	top: 5, left: 20, bottom: 5, name: "myfield",
    width: 300, height: 30, skin: nameInputSkin, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, 
            Behavior: 
            	FieldScrollerBehavior,clip: true, 
            contents: [
                Label($, { 
                    top: 0, bottom: 0, skin: fieldLabelSkin, 
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                        	var highlightSearch;
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            label.container.hint.visible == true ? highlightSearch = false : highlightSearch = true;
                            label.container.container.container.distribute("toggleHighlight", highlightSearch); 
                            input = data.name;
                        }
                    },
                }),
                Label($, {
                    left: 2, right: 2, top: 2, bottom: 2, style: fieldHintStyle,
                    string: "Product Name", name: "hint"
                }),
            ]
        })
    ]
}));
let displayingError;
let Map = Container.template($ => ({
	name: "map", left: 0, right: 0, top: 50,  active: true, 
	contents: [
		new Container({ skin: mapSkin, left: 0, right: 0, top: 0, bottom: 0, }),
	],
	behavior: Behavior({
		onTouchEnded(container){
			container.focus();
		},
		drawLocation(container, input){
			input = input.trim();
			
			if (displayingError){ application.distribute("removeError"); }
			try{
				if (!(userInput.includes(input))){
					userInput.push(input);
					var top = locationDict[input].row * 12;
					displayingError = false;
					switch(locationDict[input].offset){
						case "right":
							var left = 25 + locationDict[input].col * 12;	
							break;
						case "left":
							var left = 10 + locationDict[input].col * 12;
							break;
						default:
							var left = 20 + locationDict[input].col * 12;
					}
					// Inactive blinking previous circles
					for(var i = 0; i < userInput.length - 1; i++) { application.distribute("inactivateCircle"); }
					container.add(new LocationCircle({ name: input, top: top, left: left}));
					// Update the list
					container.container.last.delegate("updateList", { item: input, area : locationDict[input].area });
				}
			} catch (err){
				trace("ERROR: " + err + "\n");
				if(err.name == "TypeError"){ 
					application.distribute("printError", "We don't sell " + input);
					
					//while(circleCount > 0) { application.distribute("clearLocation"); }
					displayingError = true;
				}
			}
			
		}
	})
}));

let InputLine = Line.template($ => ({
	left: 0, left: 0, top: 10, height: 40, 
	contents: [new MyField({name:""}), new EnterButton]
}))

let ItemLine = Line.template($ => ({
	left: 0, right: 0, top: 0, active: true,
	contents: [
		new LocationCircle({ name: "active", top: 0, left: 0 }),
		new Label({ string: $.item, style: itemStyle })
	],
	behavior: Behavior($ => ({
		onCreate: function(container){
			trace($.area + "\n");
			trace($.item + "\n");
			var string;
			if(typeof $.area === "string"){
				string = $.area;
			} else {
				string = "Aisle {%$.area}";
			}
			container.add(new Label({ string: string, style: locationStyle }))
		}
	}))
}))

let ItemList = Container.template($ => ({
	left: 10, right: 10, top: 5, active: true,
	behavior: Behavior({
		updateList: function(listContainer){
			listContainer.add(new ItemLine());
		}
	})
}))


export var itemSearchScreen = Column.template($ => ({    name: "itemSearchScreen", left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }),    contents: [
      new Map,
      new InputLine,
      new ItemList   ],
   behavior: Behavior({
   	  printError(container, errorMsg){
   	  	container.last.add(new Label({ style: feedbackStyle, string: errorMsg}));
   	  },
   	  removeError(container){
   	  	container.last.remove(container.last.last);
   	  }
   })}));