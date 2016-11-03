import {    CrossFade,    Push,    Flip,    TimeTravel} from 'transition';

import { priceScreen } from "price_breakdown";
import { calorieScreen } from "calorie_breakdown";

let homeScreenLink = Label.template($ => ({
	left: 0, right: 0, top: 0, height: 30, active: true, name: $.toScreen,
	string: $.string, style: hllStyle,
	behavior: Behavior({
		onTouchEnded(container) {
			container.bubble("tansitionToScreen", container.name);
		},
	})
}));

var hllStyle = new Style({ font:"20px Chalkduster", color:"black", horizontal:"center", vertical:"top" });
let HomeContainer = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({fill: "white"}), active: false,
	contents: [
		new homeScreenLink({toScreen: "priceScreen", string: "My Cart Total"}),
		new homeScreenLink({toScreen: "calorieScreen", string: "Calorie Breakdown"}),
	],
}));

application.behavior = Behavior({    onTimeChanged: function(container) {        container.bubble( "onTriggerTransition" );    },    tansitionToScreen: function(container, value) {
    	let toScreen;
    	if (value == "priceScreen") {
	    	toScreen = new priceScreen({ 	            fillColor: "blue", 	            transitionNumber: 1	        });
    	}
    	if (value == "calorieScreen") {
	    	toScreen = new calorieScreen({ 	            fillColor: "red", 	            transitionNumber: 2	        });
    	}
    	container.run(new CrossFade(), container.first, toScreen, { duration: 500 });    },})

application.add(new HomeContainer());
