import {    CrossFade,    Push,    Flip,    TimeTravel} from 'transition';

let headerStyle = new Style({ font:"30px Quicksand", color:"white", horizontal:"center", vertical:"top" });

/********* TEXTURES ********/
let navTexture = new Texture("assets/navBar.png");
let forwardTexture = new Texture("assets/forward.png");
let backTexture = new Texture("assets/back.png");


/********* SKINS ********/
let headerSkin = new Skin({ fill: "#5886E4"});
let footerSkin = new Skin({ fill: "white" });
let navSkin = new Skin({
	height: 60, width: 90,
	texture: navTexture,
	states: 60, variants: 90
});

let forwardSkin = new Skin({
	height: 40, width: 20,
	texture: forwardTexture,
	variants: 20
});
let backSkin = new Skin({
 	height: 40, width: 20,
 	texture: backTexture,
 	variants: 20
});


/********* BEHAVIORS ********/
let arrowBehavior = Behavior({
	onTouchBegan: function(arrow){
		arrow.variant = 0;
	},
	onTouchEnded: function(arrow){
		trace("ARROW NAME: " + arrow.name + "\n");
		arrow.variant = 1;
		var toScreen;
		var type;
		switch(arrow.name.charAt(0)){
			case "2": 	// checkout screen --> overview screen
				toScreen = "overview";
				break;
			case "4":		// nutrition screen --> corresponding nutritionDetails screen
				toScreen = "nutritionDetails"
				type = arrow.name.slice(1);
				break;
			case "5":		// nutritionDetails screen --> nutrition screen
				toScreen = "nutrition"
		}
		application.first.delegate("transitionToScreen", { to: toScreen, type: type });
	}
})


let navBehavior = Behavior({
	onCreate: function(nav){
		switch (nav.name){
			case "overview":
				nav.variant = 0;
				break;
			case "cost":
				nav.variant = 1;
				break;
			case "nutrition":
				nav.variant = 2;
				break;
			case "search":
				nav.variant = 3;
		}
	},
	onTouchEnded: function(nav){
		if (nav.state != 1){
			// Switch states of the other nav to inactive
			nav.container.distribute("onInactivate");
			// Switch state of pressed nav button to active
			nav.state = 1;
			// Nav buttons are named after the screen they link to
			application.first.delegate("transitionToScreen", { to: nav.name,  });
		}
	},
	onInactivate: function(nav){
		nav.state = 0;
	}
})

/***** EXPORT COMPONENTS ******/
let LineBreak = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 2,
	skin: new Skin({fill: "#D7D7D7"})
}));

var NavButton = Content.template($ => ({
	left: 0, bottom: 8,
	height: 60, width: 90, state: $.state, 
	name: $.name, active: true, skin: navSkin,
	behavior: navBehavior
}));

var NavContainer = Line.template($ => ({
	top: 0, bottom: 0, 
	contents: [new NavButton({ name: "overview", state: 1 }), new NavButton({ name: "cost"}), new NavButton({ name: "nutrition"}), new NavButton({ name: "search"}) ]
}));

/************************************/
/****			EXPORTS 		****/
/***********************************/

export var Header = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 70,
	skin: headerSkin, 
	name: $.name,
	contents: [new Label({ style: headerStyle, string: $.string})]
}));


export var Footer = Column.template($ => ({
	left: 0, right: 0, bottom: 0, height: 74, name: "footer", active: true,
	skin: footerSkin, 
	contents: [new LineBreak, new NavContainer],
}));

/***** ARROWS *****/
// name should be navHierarchy[0] from main screen -- arrows named after the currently displayed screenexport var ForwardArrow = Container.template($ => ({
	width: 20, height: 40, name: $.name,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom, 
	skin: forwardSkin, variant: 1,
	active: true,
	behavior: arrowBehavior
}));

export var BackArrow = Container.template($ => ({
	width: 20, height: 40, name: $.name,
	left: $.left, right: $.right, top: $.top, bottom: $.bottom, 
	skin: backSkin, variant: 1,
	active: true,
	behavior: arrowBehavior
}));
