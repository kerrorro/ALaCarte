import {    CrossFade,    Push,    Flip,    TimeTravel} from 'transition';
import { Header, Footer } from "navigation";
import { priceScreen } from "price_breakdown";
import { calorieScreen } from "calorie_breakdown";
import { itemSearchScreen, LocationCircle } from "item_search";
import KEYBOARD from './keyboard';

var hllStyle = new Style({ font:"20px Chalkduster", color:"black", horizontal:"center", vertical:"top" });

let HomeScreenLink = Label.template($ => ({
	left: 0, right: 0, top: 0, height: 30, active: true, name: $.toScreen,
	string: $.string, style: hllStyle,
	behavior: Behavior({
		onTouchEnded(container) {
			application.distribute("transitionToScreen", container.name);
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

	transitionToScreen: function(container, value) {
		let toScreen;
		let pushDirection = "left";
    	switch(value){
    		case "priceScreen":
    			toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen, footer: "Back" });
    			//new priceScreen({ fillColor: "blue", transitionNumber: 1 });
    			break;
    		case "calorieScreen":
    			toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({ fillColor: "red", transitionNumber: "2" }), footer: "Back" });
    			//toScreen = new calorieScreen({ fillColor: "red", transitionNumber: 2 });
    			break;
    		case "itemSearchScreen":
    			toScreen = new AppContainer({ header: "Store Map", screen: new itemSearchScreen, footer: "Back" });
    			break;
    			//toScreen = new itemSearchScreen;
    		case "checkout":
    			toScreen = new AppContainer({ header: "Checkout", screen: new Container({left:0, right:0, top:0, bottom: 0, skin: new Skin({fill: "orange"})}), footer: "Back" });
    			break;
    		default: // Default is transition to HomeScreen (triggered when pressing back button)
    			toScreen = new AppContainer({ header: "A La Carte", screen: new HomeScreen, footer: "Checkout" });
    			pushDirection = "right";
    	}
    	// Runs transition on AppContainer (which contains Header, CurrentScreen, and Footer)
    	application.run(new Push(), container.first, toScreen, { direction: pushDirection, duration: 500 });
	}})

let CurrentScreen = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, 
	contents: [$.screen]
}))

let AppContainer = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: new Skin({fill: "white"}), active: true,
	contents: [new Header({ name: $.header }), new CurrentScreen({ screen: $.screen }), new Footer({ name: $.footer })],
	behavior: Behavior({
		onTouchEnded(container){
		//	KEYBOARD.hide();
		},
	})
}))


application.add(new AppContainer({ header: "A La Carte", screen: new HomeScreen, footer: "Checkout" }));

