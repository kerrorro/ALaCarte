import { CrossFade, Push, Flip, TimeTravel } from 'transition';
import { FieldScrollerBehavior, FieldLabelBehavior } from 'field';
import { BackArrow, ForwardArrow, Header, Footer } from "navigation";
import { priceScreen } from "price_breakdown";
import { calorieScreen, calorieDetailsScreen } from "calorie_breakdown";
import { itemSearchScreen, LocationCircle } from "item_search";
import KEYBOARD from './keyboard';
import Pins from "pins";

let remotePins;
let navHierarchy = ["1"];


/****** DATA ******/
// Polled cart items from device pin
let cartContents = [];

// Item database associating item "RFID"s with nutritional and price information
let itemInfo = {
  0: { name: "Banana", calories: 10, type: "Produce", subtype: "Fruit", price: 0.10 },
  1: { name: "Chocolate Chip Cookies", calories: 150, type: "Sweets", subtype: "Cookies", price: 2.99 },
  2: { name: "Whole Wheat Bread", calories: 128, type: "Grains", subtype: "Bread", price: 3.99 },
  3: { name: "Ground Beef", calories: 155, type: "Meats", subtype: "Beef", price: 5.00 },
  4: { name: "Apple", calories: 30, type: "Produce", subtype: "Fruit", price: 0.50 },
  5: { name: "Milk", calories: 110, type: "Dairy", subtype: "Milk", price: 3.29 },
}

/*** USER INPUT & DEVICE VARIABLES ***/
var deviceURL = "";
var userNum;
var userBudget;
var subtotalPrice = 0;
var totalPrice = 0;
var tax = 0.09;
var totalCalories = 0;
var averageCalories = 0;
let grayColor = '#828282';
var validResponse1 = false;
var validResponse2 = false;

var nutritionDetailType;
var nutritionDetailPercent;

/**** DEVICE DETECTION HANDLERS ****/
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

/***** STYLES *****/
let h1style = new Style({ font: "bold 45px Open Sans", color: grayColor });
let h2style = new Style({ font: "30px Open Sans", color: grayColor });
let h3style = new Style({ font: "20px Open Sans", color: "#BDBDBD" });



/***** PICTURES, TEXTURES, AND SKINS *****/
let headerSkin = new Skin({ fill: "#5886E4"});
let mainLogoImg = new Picture({ top: 0, width: 252, height: 261, url: "assets/mainLogo.png"});
let invalidTexture = new Texture("assets/invalidInputs.png");
let invalidSkin = new Skin({ width: 328, height: 45, texture: invalidTexture, variants: 328 });
let loginTexture = new Texture("assets/loginButton.png");
let loginSkin = new Skin({ width: 328, height: 44, texture: loginTexture, variants: 328 });
let checkoutTexture = new Texture("assets/checkoutButton.png");
let checkoutSkin = new Skin({ width: 291, height: 47, texture: checkoutTexture, variants: 291 });
let whiteSkin = new Skin({fill: "white"});
let nameInputSkin = new Skin({ borders: { left: 1, right: 1, top: 1, bottom: 1 }, fill: '#65779D', stroke: 'transparent' });
let fieldStyle = new Style({ color: '#FFFFFF', font: 'bold 24px Open Sans', horizontal: 'middle',
  vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldHintStyle = new Style({ color: "#E0E0E0", font: 'bold 15px Quicksand', horizontal: 'middle',
  vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#FFFFFF', '#acd473'] });
let checkoutCategoryFont = new Style({ color: grayColor, font: '24px Quicksand', horizontal: 'middle',
  vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let checkoutSubValueFont = new Style({ color: grayColor, font: 'bold 35px Open Sans', horizontal: 'middle',
  vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let checkoutTotalValueFont = new Style({ color: "#FFAC8B", font: 'bold 45px Open Sans', horizontal: 'middle',
  vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });




/****** LOGIN SCREEN COMPONENTS ******/
// Fade transition for error and update content.
var Fade = function() {
    Transition.call(this, 250);
};
Fade.prototype = Object.create(Transition.prototype, {
    onBegin: { value: 
        function(container, oldContent, newContent) {
            container.add(newContent);
            this.layer = new Layer;
            this.layer.attach(newContent);
        }
    },
    onEnd: { value: 
        function(feedbackCont, oldContent, newContent) {
            feedbackCont.remove(oldContent);
        }
    },
    onStep: { value: 
        function(fraction) {
            this.layer.opacity = fraction;
        }
    },
});

let InvalidInput = Container.template($ => ({ width: 328, height: 45, skin: invalidSkin, variant: $.variant }));

let FeedbackContainer = Container.template($ => ({
	top: $.top, width: 328, height: 45, name: "feedbackContainer",
	contents: [new Container({ left: 0, right: 0, top: 0, bottom: 0, skin: headerSkin })],
	behavior: Behavior({
		printError(container, variant){
			container.run(new Fade, container.first, new InvalidInput({ variant: variant }));
	   	  	// Waits 1.5 sec before calling onComplete to remove the error message
	   	  	container.wait(1500);
   		},
   	 	onComplete(container){
   	  		// Removes the error after wait time
   	  		container.run(new Fade, container.first, new Container({ left: 0, right: 0, top: 0, bottom: 0, skin: headerSkin }));                    		
   	 	},
	})
}));

let LoginButton = Container.template($ => ({ 
	top: $.top, width: 328, height: 44, variant: 0, 
	skin: loginSkin, active: true,
	behavior: Behavior({
		onTouchBegan: function(button){
			button.variant = 1;
		},
		onTouchEnded: function(button){
			button.variant = 0;
			button.container.distribute("checkInfo", "login");
		},
	})
}));

let BottomContainer = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, name: "bottomContainer", 
	contents: [new FeedbackContainer({ top: 5 }), new InputContainer]
}));

let InputContainer = Column.template($ => ({
	left: 20, right: 20, top: 5, bottom: 100, name: "inputContainer",
	contents: [
		new InputField({ name: "", field: "field1", hint: "CUSTOMER PHONE #" }),
		new InputField({ name: "", field: "field2", hint: "TODAY'S BUDGET" }),
		new LoginButton({ top: 10 })
	]
}));

let InputField = Container.template($ => ({ 
	left: 0, right: 0, top: 10, height: 45, name: $.name,
    skin: nameInputSkin, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, name: $.field, 
            Behavior: 
            	FieldScrollerBehavior,clip: true, 
            contents: [
                Label($, { 
                    top: 0, bottom: 0, skin: fieldLabelSkin, 
                    style: fieldStyle, name: "field",
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (label.string.length == 0);
                        }
                        checkInfo(label, callback){
                        	// Storing user info
                        	if(label.container.name == "field1"){
                        		userNum = label.string;
                        		trace("USER NUM: "+userNum + '\n');
                        	}
                        	if (label.container.name == "field2"){
                        		userBudget = parseFloat(label.string);
                        		trace("USER BUDGET: "+ userBudget + '\n');
                        	}
                        	
                        	// Regex for phone number or price respectively
                        	if (label.container.name == "field1") { validResponse1 = /^\d{10}$/g.test(label.string); }
                        	if (label.container.name == "field2") { validResponse2 = /^\d+.?\d{0,2}$/g.test(label.string) && label.string != "0"; }
                        	
                        	// ".distribute" will call for both fields. runResponse used to prevent duplicate calls
                        	var runResponse;
                        	label.container.name == "field2" ? runResponse = true : runResponse = false;
                        	if (runResponse) {
                        		var feedbackContainer = application.appContainer.currentScreen.loginScreen.bottomContainer.feedbackContainer;
	                        	if (!validResponse1 || !validResponse2){
	                        		if (!validResponse1 && !validResponse2){
	                        			feedbackContainer.delegate("printError", 0);
	                        		}
	                        		else if (!validResponse1){
	                        			feedbackContainer.delegate("printError", 1);
	                        		} else {
	                        			feedbackContainer.delegate("printError", 2);
	                        		}
	                        	} else {
	                        		trace("valid inputs \n");
	                        		application.distribute(callback);
	                       		}
                        		
                        	}
                        }
                    },
                }),
                Label($, {
                    left: 2, right: 2, top: 2, bottom: 2, style: fieldHintStyle,
                    string: $.hint , name: "hint"
                }),
            ]
        })
    ]
}));

let LoginScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: headerSkin, name: "loginScreen",
	contents:[
		mainLogoImg,
		new BottomContainer
	],
	behavior: Behavior({
		onTouchEnded: function(container){
			container.focus();
		}
	})
}));


/****** OVERVIEW SCREEN COMPONENTS ******/
let priceDetailsCanvas = Canvas.template($ => ({
	left: 0, right: 0, top: 10, bottom: 0,	behavior: Behavior({
		onCreate(canvas){
    		this.percentage = $.percentage;
  		},
  		onDisplaying(canvas) {
    		this.onDraw(canvas)
  		},
  		onUpdate(canvas){
    		this.percentage = totalPrice * 100 / userBudget;
    		this.onDraw(canvas);
  		},
  		onDraw(canvas){
    		let yellow = "#FFAC8B";
    		let red = "#E94363";
    		let gray = "#e0e0e0";
    		let total = (this.percentage / 100) * 2*Math.PI;
  			let ctx = canvas.getContext("2d");
    		ctx.lineWidth = 12;

    		if (this.percentage >= 100) {
      			ctx.beginPath();
     			ctx.strokeStyle = red;
      			ctx.arc(188,125,75,0,2*Math.PI);
      			ctx.stroke();
    		}
    		else if (this.percentage > 25) {
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

let priceDetails = Container.template($ => ({
  top: 0, bottom: 0, left:0, right: 0,
  contents: [
    new Label({ name: "totalPrice", top: 0, bottom: 0, string: "$" + totalPrice.toFixed(2), style: h1style }),
    new Label({ top: 50, bottom: 0, left: 50, right: 0, string: "/ $" + userBudget, style: h3style })
  ]
}));

let CostOverview = Container.template($ => ({
  left: 0, right: 0, top: 0, height: 265,
  contents: [
    new priceDetailsCanvas($),
    new priceDetails
  ],
  behavior: Behavior({
    onUpdate(container){
    	trace("updating price UI \n");
    	container.run(new Fade, container.last, new priceDetails);
    }
  })
}));

let CurrentCalorieContainer = Container.template($ => ({top: 10, left: 0, right: 0, contents: new Label({name: "calorieCount", top: 10, string: averageCalories.toFixed(2), style: h1style })}));

let CalorieOverview = Column.template($ => ({
  left: 0, right: 0, top: 0, bottom: 20,
  contents: [
    new CurrentCalorieContainer,
    new Label({top: 0, string: "average calories", style: h2style }),
    new Label({top: 0, string: "per serving", style: h3style })
  ],
  behavior: Behavior({
    onUpdate(container){
    	trace("updating calorie UI \n");
     	container.first.run(new Fade, container.first.first, new Label({name: "calorieCount", top: 10, string: averageCalories.toFixed(2), style: h1style }) );
    }
  })
}));


let CheckoutButton = Content.template($ => ({
	width: 291, height: 47, bottom: 125,  
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

let CheckoutPriceLine = Line.template($ => ({
	right: 0, top: 0, bottom: 0,
	contents: [
		new Label({ right: 0, bottom: 10, string: $.title, style: checkoutCategoryFont}),
		new Label({ left: 15, bottom: 5, string: $.amount, style: $.amountStyle})
	]
}));

let CheckoutScreen = Column.template($ => ({
	left: 0, right: 0, top: 0, bottom: 75, active: true, name: "checkout",
	contents: [
		new Line({left: 0, right: 0, top: 0, height: 200, 
			contents: [
				new BackArrow({ top: 0, bottom: 0, left: 20, name: navHierarchy[0] }),
				new Column({left: 0, right: 20, top: 0, bottom: 10, contents: [
					new CheckoutPriceLine({title: "Subtotal", amount: "$" + subtotalPrice.toFixed(2), amountStyle: checkoutSubValueFont}),
					new CheckoutPriceLine({title: "Tax", amount: "$" + (tax*subtotalPrice).toFixed(2), amountStyle: checkoutSubValueFont}),
					new CheckoutPriceLine({title: "Total", amount: "$" + totalPrice.toFixed(2), amountStyle: checkoutTotalValueFont})
				]}) 
			]}),
		new Container({left: 0, right: 0, top: 5, bottom: 5, contents: [new Picture ({ width: 200, height: 200, aspect: "fit", url: "assets/example_qr.png"})]}),
		new Text({left: 60, right: 60, top: 5, bottom: 5, string: "Proceed to check out and show this code to a cashier.", style: checkoutCategoryFont })
	],
}));


let OverviewScreen = Column.template($ => ({
  left: 0, right: 0, top: 0, bottom: 0, active: true, name: "overview",
  contents: [
    new CostOverview({percentage: totalPrice * 100 / userBudget }),
    new CalorieOverview,
    new CheckoutButton
  ]
}));


application.behavior = Behavior({
	onDisplayed(application) {
        application.discover("alacarte-device");
    },
    onQuit(application) {
        application.forget("alacarte-device");
    }, 
    onLaunch(application) {
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share-alacarte") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                    application.distribute("onListening");
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
    onListening(application){
    	remotePins.repeat("/cartData/read", 1000, result => {	
    		if ("[" + cartContents.join() + "]" != result){
    			cartContents = JSON.parse(result);
    			application.delegate("onUpdate");	
    		}
		});
    },
    onUpdate(application){
    	trace("Updating app values \n");
    	// Update stored calorie values
    	var itemCalories = itemInfo[cartContents[cartContents.length - 1]].calories;
	 	totalCalories += itemCalories;
	  	trace("TOTAL CALORIES: " + totalCalories + " ||  AVERAGE CALORIES: " + averageCalories + "\n");
		averageCalories = totalCalories*1.0/cartContents.length;
		
		// Update stored price values
    	var itemPrice = itemInfo[cartContents[cartContents.length - 1]].price;
	 	subtotalPrice += itemPrice;
	  	totalPrice = subtotalPrice * (1 + tax);
	  	trace("TOTAL PRICE: " + totalPrice + "\n\n");
	  	
	  	// Updates overview user interface with newly stored values
	  	application.appContainer.distribute("onUpdate");
    }
})

// Holds main content
let CurrentScreen = Container.template($ => ({
  left: 0, right: 0, top: 70, bottom: 0, name: "currentScreen", skin: whiteSkin,
  contents: [$.screen]
}))

// Main app container
let AppContainer = Container.template($ => ({
  left: 0, right: 0, top: 0, bottom: 0, name: "appContainer",
  skin: whiteSkin, active: true,
  contents: [
    new CurrentScreen({ screen: $.screen }), 
    new Header({ string: $.header }), 

  ],
  behavior: Behavior({
    login: function(container) {
      var toScreen = new AppContainer({ header: "A La Carte", screen: new OverviewScreen });
      application.run(new CrossFade(), application.first, toScreen, { duration: 500 });
      application.add(new Footer);
    },
    transitionToScreen: function(container, params) {
      let toScreen;
      switch(params.to){
        case "cost":
          navHierarchy.unshift("3");
          toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen({itemInfo: itemInfo, cartData: cartContents})});
          toScreen.name = "cost";
          break;
        case "nutrition":
          navHierarchy.unshift("4");
          toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({itemInfo: itemInfo, cartData: cartContents}) });
          break;
        case "nutritionDetails":
          navHierarchy.unshift("5");
          nutritionDetailType = params.type;
          nutritionDetailPercent = params.percentage;
          toScreen = new AppContainer({ header: params.type + " Breakdown", screen: new calorieDetailsScreen({itemInfo: itemInfo, cartData: cartContents, type: params.type, percentage: params.percentage})});
          break;
        case "search":
          navHierarchy.unshift("6");
          toScreen = new AppContainer({ header: "Product Search", screen: new itemSearchScreen });
          break;
        case "checkout":
          navHierarchy.unshift("2");
          toScreen = new AppContainer({ header: "Checkout", screen: new CheckoutScreen });
          break;
        default: // Default is transition to OverviewScreen (triggered when pressing back button)
          navHierarchy.unshift("1");
          toScreen = new AppContainer({ header: "A La Carte", screen: new OverviewScreen });
      }
  
      // Runs transition on AppContainer (which contains Header and CurrentScreen)
      var prevScreenNum = navHierarchy.pop();
      var currentScreenNum = navHierarchy[0];
      var pushDirection;
      //trace("CurrentScreen: " + currentScreenNum + "   PreviousScreen: " + prevScreenNum + "\n");
      currentScreenNum > prevScreenNum ? pushDirection = "left" : pushDirection = "right";
      container.run(new Push(), container.first, toScreen, { duration: 500, direction: pushDirection });
    },
    onUpdate: function(container){
    	// Crossfade update new cart info on breakdown pages
    	if (navHierarchy[0] == "2" || navHierarchy[0] == "3" || navHierarchy[0] == "4" || navHierarchy[0] == "5"){
    		let toScreen;
    		switch (navHierarchy[0]){
    			case "2": 	// Checkout
    				toScreen = new AppContainer({ header: "Checkout", screen: new CheckoutScreen });
    				break;
    			case "3":	// Cost
    				toScreen = new AppContainer({ header: "Price Breakdown", screen: new priceScreen({itemInfo: itemInfo, cartData: cartContents})});
    				break;
    			case "4":	// Nutrition
    				toScreen = new AppContainer({ header: "Calorie Breakdown", screen: new calorieScreen({itemInfo: itemInfo, cartData: cartContents}) });
    				break;
    				
    			case "5":	// Nutrition Details
    				// Only update screen if already on the same type screen
    				var addedItemType = itemInfo[cartContents[cartContents.length - 1]].type;
    				if (addedItemType == nutritionDetailType){
    					toScreen = new AppContainer({ header: nutritionDetailType + " Breakdown", screen: new calorieDetailsScreen({itemInfo: itemInfo, cartData: cartContents, type: nutritionDetailType, percentage: nutritionDetailPercent})});
    				}
    				break;
    		}
    		if (toScreen != undefined){
    			container.run(new CrossFade(), container.first, toScreen, { duration: 500 });
    		}
    	}
    }
  })

}))

application.add(new AppContainer({ header: "", screen: new LoginScreen }));

