import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';
import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';
import KEYBOARD from './keyboard';

let feedbackStyle = new Style({ font: "30px Open Sans", color: "white" });
let itemStyle = new Style({ font: "bold 24px Open Sans", color: "#828282" });
let itemStyleTouch = new Style({ font: "bold 24px Open Sans", color: "#E94363" });
let locationStyle = new Style({ font: "18px Quicksand", color: "#828282", horizontal: "right" });
let locationStyleTouch = new Style({ font: "18px Quicksand", color: "#E94363", horizontal: "right" });

let locationImg = new Texture("assets/location.png");
let mapImg = new Texture("assets/store_map.png");
let searchImg = new Texture("assets/searchIcon.png");
let clearImg = new Texture("assets/clearButton.png");

let feedbackSkin = new Skin({ fill: "#E94363" });
let locationSkin = new Skin({ width: 15, height: 15, texture: locationImg, variants: 15 });
let mapSkin = new Skin({ width: 337, height: 220, texture: mapImg });
let clearButtonSkin = new Skin({ width: 101, height: 33, texture: clearImg, variants: 101 });
let searchSkin = new Skin({ width: 30, height: 30, texture: searchImg, variants: 30 });
let whiteSkin = new Skin({ fill: "white" });

let nameInputSkin = new Skin({ borders: { left: 1, right: 1, top: 1, bottom: 1 }, fill: 'white', stroke: '#828282' });
let fieldStyle = new Style({ color: '#828282', font: 'bold 24px Open Sans', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldHintStyle = new Style({ color: "#BDBDBD", font: '20px Open Sans', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });

let locationDict = {
	"bread": { area: "Bakery", row: 12, col: 1 },
	"chicken": { area: "Seafood/Meat", row: 1, col: 24 },
	"ketchup": { area: 4, row: 5, col: 12, offset: "right" },
	"avocado": { area: "Produce", row: 11, col: 26 },
	"pasta": { area: 6, row: 10, col: 16 , offset: "left" }
}

var userInput = []

// Fade transition for the error message.
var Fade = function() {
    Transition.call(this, 250);
};
Fade.prototype = Object.create(Transition.prototype, {
    onBegin: { value: 
        function(feedbackCont, oldFeedback, newFeedback) {
            feedbackCont.add(newFeedback);
            this.layer = new Layer;
            this.layer.attach(newFeedback);
        }
    },
    onEnd: { value: 
        function(feedbackCont, oldFeedback, newFeedback) {
            feedbackCont.remove(oldFeedback);
        }
    },
    onStep: { value: 
        function(fraction) {
            this.layer.opacity = fraction;
        }
    },
});

// Location Circles can either be on map or on list
var mapCircleCount = 0;
export var LocationCircle = Container.template($ => ({
	top: $.top, left: $.left, height: 15, width: 15,
	name: $.name, skin: locationSkin, variant: 0, active: true,
	interval: 300, // Interval for onTimeChanged (blinking)
	behavior: Behavior({
		onCreate(circle){
			if (circle.name != "listCircle"){ 
				mapCircleCount++;
				circle.start(); 
			}
		},
		onTimeChanged(circle){
			circle.variant == 0 ? circle.variant = 1 : circle.variant = 0;
		},
		clearLocation(circle){
			if (circle.name != "listCircle"){
				mapCircleCount--;
				circle.container.remove(circle);
			}
		},
		inactivateCircle(circle){ 	// Upon new location addition:
			// Stops blinking
			circle.stop();
			if(circle.name == "listCircle" && circle.visible){
				// Hides old list circles and sets to red color
				circle.variant = 0;
				circle.visible = false;
			} else {
			// Map circles set to peach color
				circle.variant = 1;
			}
		},
		switchCircle(circle, foodStr){		// Starts blinking of selection and hides other circles
			if (circle.name == "listCircle"){
				circle.variant = 0;
				circle.visible = false;
			} else {
				circle.name == foodStr ? circle.start() : circle.stop();
				circle.name == foodStr ? circle.variant = 0 : circle.variant = 1;
			}
			
		}
	})
}));



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
				container.container.myField.distribute("onEnter");
			}
			container.focus();
		},
		toggleHighlight(container, state){
			state == true ? container.variant = 1 : container.variant = 0;
		}
	})	
}));
let MyField = Container.template($ => ({ 
	top: 5, left: 20, bottom: 5, name: "myField",
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

let InputLine = Line.template($ => ({
	left: 0, left: 0, top: 280, height: 50, skin: whiteSkin,
	contents: [new MyField({name: ""}), new EnterButton]
}))


let Map = Container.template($ => ({
	name: "map", left: 0, right: 0, top: 50,  active: true, skin: whiteSkin,
	contents: [
		new Container({ skin: mapSkin, left: 0, right: 0, top: 10, bottom: 0, }),
	],
	behavior: Behavior({
		onTouchEnded(container){
			container.focus();
		},
		drawLocation(container, input){
			input = input.trim().toLowerCase();
			try{
				if (!(userInput.includes(input))){
					userInput.push(input);
					var top = 10 + locationDict[input].row * 12;
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
					container.container.scroller.itemList.delegate("updateList", { item: input, area : locationDict[input].area });
				}
			} catch (err){
				trace("ERROR: " + err + "\n");
				if(err.name == "TypeError"){ 
					application.distribute("printError", "Sorry, we don't sell " + input);
				}
			}
			
		}
	})
}));


let ItemLine = Line.template($ => ({
	left: 0, right: 0, top: 0, active: true,
	contents: [
		new LocationCircle({ left: 25, name: "listCircle" }),
		new Label({ name: "food", string: $.item, style: itemStyle, left: 30 })
	],
	behavior: Behavior({
		onCreate: function(container){
			trace($.area + "\n");
			trace($.item + "\n");
			var string;
			if(typeof $.area === "string"){
				string = $.area;
			} else {
				string = "Aisle " + $.area;
			}
			container.add(new Label({ name: "location", string: string, style: locationStyle, left: 0, right: 30 }));
		},
		onTouchBegan: function(container){
			container.food.style = itemStyleTouch;
			container.location.style = locationStyleTouch;
		},
		onTouchCancelled: function(container){
			container.food.style = itemStyle;
			container.location.style = locationStyle;
		},
		onTouchEnded: function(container){
			container.food.style = itemStyle;
			container.location.style = locationStyle;
			application.distribute("switchCircle", container.food.string);
			container.listCircle.visible = true;	// Show clicked list circle
		}
	})
}))

let ItemList = Column.template($ => ({
	left: 20, right: 20, top: 5, active: true, name: "itemList", 
	behavior: Behavior({
		onTouchEnded: function(container){
			container.focus();
		},
		updateList: function(listContainer, params){
			trace(listContainer.name + "\n");
			if (mapCircleCount == 1) { listContainer.add(new ItemLine(params)); }
			else { listContainer.insert(new ItemLine(params), listContainer.first); }
		}
	})
}))

let FeedbackLine = Container.template($ => ({ left: 0, right: 0, top: 0, bottom: 0, skin: $.skin }));

let ClearButton = Container.template($ => ({ 
	width: 101, height: 33,
	skin: clearButtonSkin, active: true, variant: 0,
	behavior: Behavior({
		onTouchBegan: function(button){
			button.variant = 1;
		},
		onTouchEnded: function(button){
			button.variant = 0;
			button.container.container.delegate("onClearSearch");
		}
	})
}));

let BottomContainer = Container.template($ => ({
	left: 0, right: 0, bottom: 74, height: 55, skin: whiteSkin,
	contents: [new ClearButton]
}));



export var itemSearchScreen = Container.template($ => ({    name: "search", left: 0, right: 0, top: 0, bottom: 0,     contents: [
   		VerticalScroller($, { name: "scroller", active: true, top: 330, left: 0, right: 0, 
      		contents: [ new ItemList,
      					VerticalScrollbar(),
      					TopScrollerShadow(),
      					BottomScrollerShadow()] }),
   	  new Container({ name: "feedbackCont", left: 0, right: 0, top: 0, height: 50, contents: new FeedbackLine({ skin: whiteSkin })}),
      new Map,
      new InputLine,
      new BottomContainer   ],
   behavior: Behavior({
   	  	printError(container, errorMsg){
	   	  	var oldFeedback = container.feedbackCont.first;
	   	  	container.feedbackCont.run(new Fade, oldFeedback, new FeedbackLine({ skin: feedbackSkin }));
	   	  	// Waits 1 sec before calling onComplete to remove the error message
	   	  	container.wait(1500);
	   	  	container.feedbackCont.last.add(new Label({ style: feedbackStyle, string: errorMsg}));
   		  },
   	 	onComplete(container){
   	  		// Removes the error after wait time
   	  		container.feedbackCont.run(new Fade, container.feedbackCont.first, new FeedbackLine({ skin: whiteSkin }));
   	 	},
   	 	onClearSearch(container){
   			while(mapCircleCount > 0) { application.distribute("clearLocation"); }
   			container.scroller.itemList.empty();
   			userInput = [];
   	 	}
   })}));

