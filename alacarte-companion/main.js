import {
    CrossFade,
    Push,
    Flip,
    TimeTravel
} from 'transition';
import { Header, Footer } from "navigation";
import { priceScreen } from "price_breakdown";
import { calorieScreen, calorieDetailsScreen } from "calorie_breakdown";
import { itemSearchScreen, LocationCircle } from "item_search";
import KEYBOARD from './keyboard';
import Pins from "pins";
let remotePins;
var deviceURL = "";

/************************************/
/**** DEVICE DETECTION HANDLERS ****/
/***********************************/
Handler.bind("/discover", Behavior({
    onInvoke: function(handler, message){
    	trace("Device connected\n");
        deviceURL = JSON.parse(message.requestText).url;
    }
}));

Handler.bind("/forget", Behavior({
    onInvoke: function(handler, message){
        deviceURL = "";
    }
}));


// Hardwire Data For Now
let cartData = {
	items: [0, 1, 2, 3, 4], // array of item ids; use itemInfo dictionary for more info
	location: "Unsure what to put here -- Caroline might know better"
}

// item id -> nutitional info
// add more info as needed
let itemInfo = {
	0: { name: "Banana", calories: 10, type: "Produce", subtype: "Fruit" },
	1: { name: "Chocolate Chip Cookies", calories: 150, type: "Sweets", subtype: "Cookies" },
	2: { name: "Whole Wheat Bread", calories: 128, type: "Grains", subtype: "Bread" },
	3: { name: "Ground Beef", calories: 155, type: "Meats", subtype: "Beef" },
	4: { name: "Apple", calories: 30, type: "Produce", subtype: "Fruit" },
}

var hllStyle = new Style({ font:"20px", color:"black", horizontal:"center", vertical:"middle", top: 0 });
var hllStyleWhite = new Style({ font:"20px", color:"white", horizontal:"center", vertical:"middle", top: 0 });

let forwardTexture = new Texture("assets/forward.png");
let forwardSkin = new Skin({
	height: 31, width: 19,
	texture: forwardTexture,
	variants: 19
});
var ForwardArrow = Container.template($ => ({
	width: 20, right: 10, height: 25, width: 19, name: "forward",
	skin: forwardSkin, variant: 1,
	active: true,
}));

let HomeScreenLink = Label.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, active: false, name: $.toScreen,
	string: $.string, style: hllStyleWhite,
}));

let HomeScreenItem = Line.template($ => ({
	left: 15, right: 15, top: 10, height: 70, active: true, name: $.toScreen,
	skin: new Skin({fill: $.color}),
	contents: [
		new HomeScreenLink($),
		new ForwardArrow
	],
	behavior: Behavior({
		onTouchEnded(container) {
			application.distribute("transitionToScreen", {to: container.name});
		},
	})
}));


let HomeScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({fill: "white"}), active: true, name: "home",
	contents: [		
		new HomeScreenItem({toScreen:"itemSearchScreen", string: "Search For An Item", color: "blue"}),
		new HomeScreenItem({toScreen: "priceScreen", string: "My Cart Total", color: "red"}),
		new HomeScreenItem({toScreen: "calorieScreen", string: "Calorie Breakdown", color: "green"}),
	],
}));

application.behavior = Behavior({

	onDisplayed(application) {
        application.discover("p3-device");
    },
    
    onQuit(application) {
        application.forget("p3-device");
    },
    
    onLaunch(application) {
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share-alacarte") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                    application.distribute("onListening");
                    remotePins.repeat("/cartData/read", 1000, result => {          				trace("COMPANION: " + result + "\n");			        }); 
                }
            }, 
            connectionDesc => {
                if (connectionDesc.name == "pins-share") {
                    trace("Disconnected from remote pins\n");
                    remotePins = undefined;
                }
            }
        );
    },

	transitionToScreen: function(container, params) {
		let toScreen;
		var pushDirection = "left";
		if (params.back) {
			pushDirection = "right";
			navHierarchy.pop();	
		}
		var prevScreen = navHierarchy[navHierarchy.length - 1];
		if (params.back) {
			navHierarchy[navHierarchy.length - 1];
		}
		trace(prevScreen + "\n")
    	switch(params.to){
    		case "priceScreen":
    			navHierarchy.push("priceScreen");
    			toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen, footer: "Back", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
    			break;
    		case "calorieScreen":
    			navHierarchy.push("calorieScreen");
    			toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({itemInfo, cartData}), footer: "Back", prevScreen: prevScreen });
    			break;
    		case "calorieDetailsScreen":
	    		toScreen = new AppContainer({ header: params.type + " Breakdown", screen: new calorieDetailsScreen({itemInfo, cartData, type: params.type}), footer: "Back", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
	    		break;
    		case "itemSearchScreen":
    			toScreen = new AppContainer({ header: "Store Map", screen: new itemSearchScreen, footer: "Back", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
    			break;
    		case "checkout":
    			toScreen = new AppContainer({ header: "Checkout", screen: new Container({left:0, right:0, top:0, bottom: 0, skin: new Skin({fill: "orange"})}), footer: "Back", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
    			break;
    		default: // Default is transition to HomeScreen (triggered when pressing back button)
    			toScreen = new AppContainer({ header: "A La Carte", screen: new HomeScreen, footer: "Checkout", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
    			pushDirection = "right";
    	}
    	// Runs transition on AppContainer (which contains Header, CurrentScreen, and Footer)
    	application.run(new Push(), container.first, toScreen, { direction: pushDirection, duration: 500 });
	}
})

let CurrentScreen = Container.template($ => ({
	left: 0, right: 0, top: 60, bottom: 60, name: "currentScreen",
	contents: [$.screen]
}))

let AppContainer = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: "appContainer",
	skin: new Skin({fill: "white"}), active: true,
	contents: [
		new CurrentScreen({ screen: $.screen }), 
		new Header({ string: $.header }), 
		new Footer({ name: $.footer, prevScreen: $.prevScreen })
	],
}))

let navHierarchy = ["home"]

application.add(new AppContainer({ header: "A La Carte", screen: new HomeScreen, footer: "Checkout" }));
