import {    CrossFade,    Push,    Flip,    TimeTravel} from 'transition';

let h1Style = new Style({ font:"20px", color:"black", horizontal:"center", vertical:"top" });
let barSkin = new Skin({fill: "#3DAFB8"})
let backTexture = new Texture("assets/back.png");
let forwardTexture = new Texture("assets/forward.png");

let backSkin = new Skin({
	height: 31, width: 19,
	texture: backTexture,
	variants: 19
});
let forwardSkin = new Skin({
	height: 31, width: 19,
	texture: forwardTexture,
	variants: 19
});


let navBehavior = Behavior({
	onTouchBegan(button){
		button.variant = 1;
	},
	onTouchEnded(button){
		var toFooter;
		button.variant = 0;
		button.name == "back" ? toFooter = "back" : toFooter = "checkout";
		trace(toFooter + "\n");
		application.distribute("transitionToScreen", toFooter);
	}	
})


var BackArrow = Container.template( $ => ({
	left: 20, height: 31, width: 19, name: "back",
	skin: backSkin, variant: 0,
	active: true,
	behavior: navBehavior
}));
var ForwardArrow = Container.template($ => ({
	left: 20, height: 31, width: 19, name: "forward",
	skin: forwardSkin, variant: 0,
	active: true,
	behavior: navBehavior
}));

export var Header = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 60, name: "header",
	skin: barSkin, name: $.name,
	contents: [new Label({ style: h1Style, string: $.name })]
}));


export var Footer = Line.template($ => ({
	left: 0, right: 0, bottom: 0, height: 60, name: "footer", active: true,
	skin: barSkin, name: $.name,
	contents: [],
	behavior: Behavior({
	
		prevScreen: $.prevScreen,
		
		onCreate(container){
			if (container.name == "Back"){
				container.add(new BackArrow);
				container.add(new Label({ left: 10, style: h1Style, string: "Back" }));
			}
			if (container.name == "Checkout"){
				container.add(new Label({ left: 20, style: h1Style, string: "Checkout" }));
				container.add(new ForwardArrow);
			}
		},
		
		onTouchEnded(container) {
			application.distribute("transitionToScreen", this.prevScreen);
		}
	})
}));