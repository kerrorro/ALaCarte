var TRANSITIONS = require("transitions");
var cartPin = require("simulator/bll");
import Pins from "pins";
let myPins;

/*********** HANDLERS *************/
Handler.bind("/onLogin", Behavior({
    onInvoke: function(handler, message){
		application.remove(application.waitingScreen);
    }
}));	

/*********** DATA *************/
// Cart items stored as their "RFID" values to be polled for by the companion app
let cartContents = []

// Associates input item to its item ID/"RFID"
let itemRFIDs = {
	"banana": 0,
	"chocolate chip cookies": 1,
	"whole wheat bread": 2,
	"ground beef": 3,
	"apple": 4,
	"milk": 5,
}		

	
		
/*********** ASSETS *************/
let logoUrl = "assets/logo.png";
let readyUrl = "assets/ready.png";
let errorUrl = "assets/error.png";
let abzFont = new Style({ font: "24px ABeeZee", color: "white" });
let cartItemsFont = new Style({ font: "16px ABeeZee", color: "white" });
let logo = new Picture({ height: 106, top: 0, bottom: 30, url: "assets/logo.png" });
let connectionError = new Picture({ height: 19, top:100, bottom: 0, url: "assets/error.png" });
let pinsReady = new Picture({ height: 25, top: 100, bottom: 0, url: "assets/ready.png" });
let waitingImg = new Picture({ height: 250, width: 250, top: 0, bottom: 0, url: "assets/waiting.png" });
let whiteSkin = new Skin({fill: "white"});
let peachSkin = new Skin({fill: "#FFAC8B"});
let blueSkin = new Skin({fill: "#5886E4"});
var twoColorSkin = new Skin({ fill: ['#FFAC8B', '#FA8354'], });
var labelStyle = new Style({ color: 'white', font: '20px', horizontal: 'null', vertical: 'null' });



/*********** BEHAVIORS AND TRANSITIONS ******************/
// Writes RFIDs associated with selected item to BLL
var ButtonContainerBehavior = Behavior({
	onTouchBegan: function(container, id, x, y, ticks) {
    	container.state = 1;
    },
    onTouchEnded: function(container, id, x, y, ticks) {
    	container.state = 0;
    	// Read pin (radio group) item input
    	Pins.invoke("/itemData/read", function(result){
    		if(itemRFIDs[result] != undefined){
    			cartContents.push(itemRFIDs[result]);
    			// Write RFID of item input to cart data pin for polling from companion app
    			Pins.invoke("/cartData/write", JSON.stringify(cartContents));
    			application.distribute("onItemAdded", result);
    		}
		})

    }
})
var Fade = function() {
    Transition.call(this, 200);
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
        	this.layer.detach(newContent);
            feedbackCont.remove(oldContent);
            if (newContent.name == "blank"){
            	newContent.skin = new Skin({fill: "transparent" });
            }
        }
    },
    onStep: { value: 
        function(fraction) {
            this.layer.opacity = fraction;
        }
    },
});

/***************** CONTAINERS ********************/
var CartItemsContainer = Container.template($ => ({
	left: 0, right: 0, bottom: 0, height: 120, name: "cartItems", skin: new Skin({fill: "transparent"}), active: true, 
	contents: [
		new Text({ left: 0, right: 0, bottom: 3, top: 3, string: "", style: cartItemsFont})
	],
	behavior: Behavior({
		onItemAdded(container, item){
			if(cartContents.length == 1){
				container.skin = blueSkin;
				container.first.string += item;
			} else {
				container.first.string += ", " + item; 
			}
			
		}
	})
}))

var ButtonContainer = Container.template($ => ({ 
    left: 0, right: 0, top: 0, height: 100, name: "button",
    contents: [
        Container($, { width: 180, height: 40, active: true, skin: twoColorSkin, name: 'button', 
            behavior: ButtonContainerBehavior, 
            contents: [
                Label($, { left: 0, right: 0, top: 0, bottom: 0, style: abzFont, 
                string: 'Add item', }),
            ]
        })
    ]
}));

var AddedItemContainer = Container.template($ => ({
	left: 0, right: 0, top: 0, bottom: 0, skin: $.skin, name: $.name, 
	contents: [ new Label({string: $.string, style: abzFont}) ]
}))

var TransitionContainer = Container.template($ => ({
	left: 0, right: 0, top: 80, height: 40, name: "transitionCont", 
	contents: [
		new AddedItemContainer($)
	],
	behavior: Behavior({
		onItemAdded(container, item){
			container.run(new Fade, container.blank, new AddedItemContainer({name: "addedItem", string: "Added " + item, skin: blueSkin}));
			container.wait(1000);  // Runs onComplete transition after wait time	  
   		},
   	 	onComplete(container){
   	  		// Removes the message after wait time
   	  		container.run(new Fade, container.addedItem, new AddedItemContainer({name: "blank", skin: whiteSkin, string: "" }));
   	 	},
	})
}))



/* Default screen if pin connection successful */
var currentScreen = new Container({
  top: 0, bottom: 0, left: 0, right: 0, name: "currentScreen",
  skin: whiteSkin,
  contents: [
    new ButtonContainer,
    new Picture({ height: 25, top: 90, url: readyUrl }),
    new TransitionContainer({name: "blank", string: ""}),
    new Picture({ height: 106, bottom: 10, url: logoUrl }),
    new CartItemsContainer

  ]
});

var waitingScreen = new Container({
	left: 0, right: 0, top: 0, bottom: 0, name: "waitingScreen", skin: blueSkin,
	contents: [new Text({bottom: 20, vertical: "middle", height: 150, width: 150, string: "Download the A La Carte app and log in.", style: abzFont})]
});

class AppBehavior extends Behavior {
  onQuit(application) {
    application.shared = false;
  }
  onLaunch(application) {
    application.shared = true;
    Pins.configure({
    	itemData: {
    		require: "rfid",
    		pins: {}
    	},
      	cartData: {
       		require: "bll",
        	pins: {}
      },

    }, success => {
      if (success) {
        application.add(currentScreen);
        application.add(waitingScreen);
        Pins.share("ws", {zeroconf: true, name: "pins-share-alacarte"});
      } else {
        currentScreen = new MainContainer({
          content: [
            new Picture($, { height: 19, top: 100, bottom: 0, url: errorUrl }),
            new Picture($, { height: 106, top: 0, bottom: 30, url: logoUrl })
          ],
          backgroundColor: "#E8F9E0"
        })
        application.add(currentScreen);
      }
    });
  }
}
application.behavior = new AppBehavior();
