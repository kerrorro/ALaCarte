import {
    CrossFade,
    Push,
    Flip,
    TimeTravel
} from 'transition';
import { BackArrow, ForwardArrow, Header, Footer } from "navigation";
import { priceScreen } from "price_breakdown";
import { calorieScreen, calorieDetailsScreen } from "calorie_breakdown";
import { itemSearchScreen, LocationCircle } from "item_search";
import KEYBOARD from './keyboard';
import Pins from "pins";
let remotePins;
var deviceURL = "";

let grayColor = '#828282';

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
	items: [0, 1, 2, 3, 4, 5, 1, 1, 2], // array of item ids; use itemInfo dictionary for more info
	location: "Unsure what to put here -- Caroline might know better"
}

// item id -> nutitional info
// add more info as needed
let itemInfo = {
	0: { name: "Banana", calories: 10, type: "Produce", subtype: "Fruit", price: 0.10 },
	1: { name: "Chocolate Chip Cookies", calories: 150, type: "Sweets", subtype: "Cookies", price: 2.99 },
	2: { name: "Whole Wheat Bread", calories: 128, type: "Grains", subtype: "Bread", price: 3.99 },
	3: { name: "Ground Beef", calories: 155, type: "Meats", subtype: "Beef", price: 5.00 },
	4: { name: "Apple", calories: 30, type: "Produce", subtype: "Fruit", price: 0.50 },
	5: { name: "Milk", calories: 110, type: "Dairy", subtype: "Milk", price: 3.29 },
}

let CostOverview = Content.template($ => ({}));
let CalorieOverview = Content.template($ => ({}));

let checkoutTexture = new Texture("assets/checkoutButton.png");
let checkoutSkin = new Skin({
	width: 291, height: 47,
	texture: checkoutTexture,
	variants: 291
});

let CheckoutButton = Content.template($ => ({
	width: 291, height: 47, top: 0, bottom: 0,
	skin: checkoutSkin, variant: 0,
	active: true, 
	behavior: Behavior({
		onTouchBegan: function(button){
			button.variant = 1;
		},
		onTouchEnded: function(button){
			button.variant = 0;
			application.first.delegate("transitionToScreen", { to: "checkout" });
		}
	})
}));

let CheckoutScreen = Line.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: "checkout",
	contents: [new BackArrow({ name: navHierarchy[0] })],
	
}));

let priceDetailsCanvas = Canvas.template($ => ({
  left: 0, right: 0, top: 0, bottom: 0,
  behavior: Behavior({
    percentage: $.percentage,
    onDisplaying(canvas) {
      let yellow = "#FFAC8B";
      let gray = "#e0e0e0"
      let total = (this.percentage / 100) * 2*Math.PI;
      let ctx = canvas.getContext("2d");
      ctx.lineWidth = 12;

      if ($.percentage > 25) {
        ctx.beginPath();
        ctx.strokeStyle = yellow;
        let remaining = ((this.percentage - 25) / 100) * 2*Math.PI;
        ctx.arc(188, 125, 75, 0, remaining);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = yellow;
        ctx.arc(188, 125, 75, 1.5708*3, total + (1.5708 * 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 125, 75, remaining, 1.5708*3);
        ctx.stroke();
      } else {

        ctx.beginPath();
        ctx.strokeStyle = yellow;
        ctx.arc(188, 125, 75, 1.5708*3, total + (1.5708 * 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 125, 75, 0, 1.5708*3);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 125, 75, total + (1.5708 * 3), 2*Math.PI);
        ctx.stroke();
      }
    }
  })
}));
let priceDetailsCanvasMainStyle = new Style({
   color: grayColor, font: 'bold 40px', horizontal: "middle", vertical: 'middle',
});
let priceDetailsCanvasSubStyle = new Style({
   color: grayColor, font: '20px', horizontal: "middle", vertical: 'middle',
});
let priceDetailsHeader = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 250,
	contents: [
		new priceDetailsCanvas($),
        new Label({left: 0, right: 0, top: 0, bottom: 0}, null, priceDetailsCanvasMainStyle, $.total),
        new Label({left: 50, right: 0, top: 60, bottom: 0}, null, priceDetailsCanvasSubStyle, "/ $150"),
	]
}))

let OverviewScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, active: true, name: "overview",
	contents: [
		new priceDetailsHeader({percentage: "60", total: "$80.48"}),
		new CheckoutButton
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
	skin: new Skin({fill: "white"}), active: true,
	contents: [
		new CurrentScreen({ screen: $.screen }), 
		new Header({ string: $.header }), 

	],
	behavior: Behavior({
		transitionToScreen: function(container, params) {
			let toScreen;
	    	switch(params.to){
	    		case "cost":
	    			navHierarchy.unshift("3");
	    			toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen({itemInfo, cartData}), itemInfo: itemInfo, cartData: cartData });
	    			toScreen.name = "cost";
	    			break;
	    		case "nutrition":
	    			navHierarchy.unshift("4");
	    			toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({itemInfo, cartData}) });
	    			break;
	    		case "nutritionDetails":
	    			navHierarchy.unshift("5");
		    		toScreen = new AppContainer({ header: params.type + " Breakdown", screen: new calorieDetailsScreen({itemInfo, cartData, type: params.type, percentage: params.percentage}), itemInfo: itemInfo, cartData: cartData });
		    		break;
	    		case "search":
	    			navHierarchy.unshift("6");
	    			toScreen = new AppContainer({ header: "Product Search", screen: new itemSearchScreen, itemInfo: itemInfo, cartData: cartData });
	    			break;
	    		case "checkout":
	    			navHierarchy.unshift("2");
	    			toScreen = new AppContainer({ header: "Checkout", screen: new CheckoutScreen, itemInfo: itemInfo, cartData: cartData });
	    			break;
	    		default: // Default is transition to OverviewScreen (triggered when pressing back button)
	    			navHierarchy.unshift("1");
	    			toScreen = new AppContainer({ header: "A La Carte", screen: new OverviewScreen, itemInfo: itemInfo, cartData: cartData });
	    	}
	
	    	// Runs transition on AppContainer (which contains Header and CurrentScreen)
	    	var prevScreenNum = navHierarchy.pop();
	    	var currentScreenNum = navHierarchy[0];
	    	var pushDirection;
	    	//trace("CurrentScreen: " + currentScreenNum + "   PreviousScreen: " + prevScreenNum + "\n");
	    	currentScreenNum > prevScreenNum ? pushDirection = "left" : pushDirection = "right";
	    	container.run(new Push(), container.first, toScreen, { duration: 500, direction: pushDirection });
		}
	})

}))

let navHierarchy = ["1"]

application.add(new AppContainer({ header: "A La Carte", screen: new OverviewScreen }));
application.add(new Footer);
application.skin = new Skin({fill: 'white'});
