var TRANSITIONS = require("transitions");
var cartPin = require("simulator/bll");
import Pins from "pins";
var currentScreen;
let myPins;
let itemInfo = {
	0: "Banana",
	1: "Chocolate Chip Cookies",
	2: "Whole Wheat Bread",
	3: "Ground Beef",
	4: "Apple"
}

let logoUrl = "assets/logo.png";
let readyUrl = "assets/ready.png";
let errorUrl = "assets/error.png";
let abzFont = new Style({ font: "24px ABeeZee", color: "white" });
let logo = new Picture({ height: 106, top: 0, bottom: 30, url: "assets/logo.png" });
let connectionError = new Picture({ height: 19, top:100, bottom: 0, url: "assets/error.png" });
let pinsReady = new Picture({ height: 25, top: 100, bottom: 0, url: "assets/ready.png" });
let icons = new Texture("assets/food_icons.png");
let iconSkin = new Skin({
	height: 80, width: 80,
	texture: icons,
	variants: 80
});
let IconContainer = Container.template($ => ({
	top: 0, bottom: 50, height: 80, width: 80,
	skin: iconSkin,
	variant: $.variant,
}));
let StringContainer = Container.template($ => ({
	top: 50, bottom: 0,
	contents: [Label($, {style: abzFont, string: $.string})]
}));
/*
let MainContainer = Column.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0,
    skin: new Skin({ fill: $.backgroundColor }),
    contents: $.content
}));*/
/************************************/
/***********   HANDLERS   ***********/
/***********************************/


let AnimationContainer = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: $.name,
	skin: new Skin({ fill: "white" }),
	contents: [new FoodTitle({ string: $.name })]
}))

let FoodTitle = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 45,
	skin: new Skin({ fill: "#B3FFFFFF" }),
	contents: [new Label({ style: abzFont, string: $.string })]
}))

/* Default screen if pin connection successful */
var currentScreen = new Container({     
	top: 0, bottom: 0, left: 0, right: 0,
    skin: new Skin({ fill: "white" }),
    contents: [
    	new AnimationContainer({ name: "" }),
    	//new FoodTitle,
    	new Picture({ height: 25, top: 75, url: readyUrl }),			
    	new Picture({ height: 106, bottom: 10, url: logoUrl }), 
        
    ]
});
            				
class AppBehavior extends Behavior {
    onQuit(application) {
        application.shared = false;
    }
    onLaunch(application) {
    	application.shared = true;
    	
        Pins.configure({
        	nfc: {
        		require: "PN532",
        		pins: {
        			data: { sda: 27, clock: 29 }
        			}
        	},   
        },  success => {
            if (success) {            	
            	Pins.share("ws", {zeroconf: true, name: "pins-share"});
            	var foodColumn = new Column({ left: 0, right: 0, top: 0, bottom: 0 })
            	application.add(foodColumn);
            	for (var item in itemInfo){
            		//cartPin.write(itemInfo[item]);	
            		foodColumn.add(new Label({top: 20, style: abzFont, string: itemInfo[item] }));
            	}
            	
            } else {
            	currentScreen = new MainContainer({ 
            						content: [
            							new Picture($, { height: 19, top: 100, bottom: 0, url: errorUrl }),
            							new Picture($, { height: 106, top: 0, bottom: 30, url: logoUrl })],
            							 
            						backgroundColor: "#E8F9E0" })
            	application.add(currentScreen);
            }
        });
    }
}
application.behavior = new AppBehavior();