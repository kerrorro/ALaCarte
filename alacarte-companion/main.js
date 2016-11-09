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

var hllStyle = new Style({ font:"20px", color:"black", horizontal:"center", vertical:"top", top: 10 });

let HomeScreenLink = Label.template($ => ({
	left: 0, right: 0, top: 0, height: 30, active: true, name: $.toScreen,
	string: $.string, style: hllStyle,
	behavior: Behavior({
		onTouchEnded(container) {
			application.distribute("transitionToScreen", {to: container.name});
		},
	})
}));


let HomeScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({fill: "white"}), active: true, name: "home",
	contents: [		
		new HomeScreenLink({toScreen:"itemSearchScreen", string: "Search For An Item"}),
		new HomeScreenLink({toScreen: "priceScreen", string: "My Cart Total"}),
		new HomeScreenLink({toScreen: "calorieScreen", string: "Calorie Breakdown"}),
	],
}));

application.behavior = Behavior({

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
	left: 0, right: 0, top: 0, bottom: 0, name: "currentScreen",
	contents: [$.screen]
}))

let AppContainer = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: "appContainer",
	skin: new Skin({fill: "white"}), active: true,
	contents: [new Header({ name: $.header }), new CurrentScreen({ screen: $.screen }), new Footer({ name: $.footer, prevScreen: $.prevScreen })],
	behavior: Behavior({
		onTouchEnded(container){
		//	KEYBOARD.hide();
		},
	})
}))

let navHierarchy = ["home"]

application.add(new AppContainer({ header: "A La Carte", screen: new HomeScreen, footer: "Checkout" }));

