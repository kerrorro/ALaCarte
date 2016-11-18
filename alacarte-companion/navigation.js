import {    CrossFade,    Push,    Flip,    TimeTravel} from 'transition';

let headerStyle = new Style({ font:"30px Quicksand", color:"white", horizontal:"center", vertical:"top" });
let headerSkin = new Skin({ fill: "#5886E4"});
let footerSkin = new Skin({ fill: "white" });

let navTexture = new Texture("assets/navBar.png");
let navSkin = new Skin({
	height: 60, width: 90,
	texture: navTexture,
	states: 60, variants: 90
});

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

let LineBreak = Container.template($ => ({
	left: 0, right: 0, top: 0, height: 2,
	skin: new Skin({fill: "#D7D7D7"})
}))

var NavButton = Content.template($ => ({
	left: 0, bottom: 8,
	height: 60, width: 90, state: $.state, 
	name: $.name, active: true, skin: navSkin,
	behavior: navBehavior
}));

var NavContainer = Line.template($ => ({
	top: 0, bottom: 0, 
	contents: [new NavButton({ name: "overview", state: 1 }), new NavButton({ name: "cost"}), new NavButton({ name: "nutrition"}), new NavButton({ name: "search"}) ]
}))


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