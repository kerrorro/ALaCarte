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
	items: [0, 1, 2, 3, 4, 5], // array of item ids; use itemInfo dictionary for more info
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
	5: { name: "Milk", calories: 110, type: "Dairy", subtype: "Milk" },
}

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




let OverviewScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({fill: "white"}), active: true, name: "overview",
	contents: [		

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
                    remotePins.repeat("/cartData/read", 1000, result => {
          				trace("COMPANION: " + result + "\n");
			        }); 
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
})

let CurrentScreen = Container.template($ => ({
	left: 0, right: 0, top: 70, bottom: 0, name: "currentScreen",
	contents: [$.screen]
}))

let AppContainer = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: "appContainer",
	skin: new Skin({fill: "#D7D7D7"}), active: true,
	contents: [
		new CurrentScreen({ screen: $.screen }), 
		new Header({ string: $.header }), 

	],
	behavior: Behavior({
		transitionToScreen: function(container, params) {
			let toScreen;
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
	    		case "cost":
	    			navHierarchy.push("priceScreen");
	    			toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen, prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
	    			break;
	    		case "nutrition":
	    			navHierarchy.push("calorieScreen");
	    			toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({itemInfo, cartData}), prevScreen: prevScreen });
	    			break;
	    		case "calorieDetailsScreen":
		    		toScreen = new AppContainer({ header: params.type + " Breakdown", screen: new calorieDetailsScreen({itemInfo, cartData, type: params.type}),  prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
		    		break;
	    		case "search":
	    			toScreen = new AppContainer({ header: "Product Search", screen: new itemSearchScreen,  prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
	    			break;
	    		case "checkout":
	    			toScreen = new AppContainer({ header: "Checkout", screen: new Container({left:0, right:0, top:0, bottom: 0, skin: new Skin({fill: "orange"})}),  prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });
	    			break;
	    		default: // Default is transition to OverviewScreen (triggered when pressing back button)
	    			toScreen = new AppContainer({ header: "A La Carte", screen: new OverviewScreen, footer: "Checkout", prevScreen: prevScreen, itemInfo: itemInfo, cartData: cartData });

	    	}
	
	    	// Runs transition on AppContainer (which contains Header and CurrentScreen)
	    	container.run(new CrossFade(), container.first, toScreen, { duration: 500 });
	
		}
	})

}))

let navHierarchy = ["overview"]

application.add(new AppContainer({ header: "A La Carte", screen: new OverviewScreen }));
application.add(new Footer);
