import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import {
    SystemKeyboard
} from 'keyboard';

var hllStyle = new Style({ font:"20px Chalkduster", color:"black", horizontal:"center", vertical:"top" });
let headerSkin = new Skin({fill: "#3DAFB8"})
let header = new Container({
	left: 0, right: 0, top: 0, height: 60,
	skin: headerSkin,
	contents: [new Label({ style: hllStyle, string: "A La Carte" })]
})

let locationImg = new Texture("assets/location.png");
let mapImg = new Texture("assets/store_map.png");

let locationSkin = new Skin({ width: 10, height: 10, texture: locationImg, variants: 10});
let mapSkin = new Skin({ width: 280, height: 180, texture: mapImg });

let locationDict = {
	"bread": { row: 12, col: 1 },
	"chicken": { row: 1, col: 24 },
	"ketchup": { row: 5, col: 12, offset: "right" },
	"avocado": { row: 11, col: 26 },
	"pasta": { row: 10, col: 16 , offset: "left" }
}


export var LocationCircle = Container.template($ => ({
	top: $.top, left: $.left, height: 10, width: 10,
	skin: locationSkin, variant: 0, active: true,
	interval: 500,
	behavior: Behavior({
		onCreate(circle){
			circle.start();
		},
		onTimeChanged(circle){
			circle.variant == 0 ? circle.variant = 1 : circle.variant = 0;
		},
		
	})
}));


let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, fill: 'white', stroke: 'gray' });
let fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let fieldHintStyle = new Style({ color: '#aaa', font: '20px Calibri', horizontal: 'middle',
    vertical: 'middle', left: 0, right: 0, top: 0, bottom: 0 });
let whiteSkin = new Skin({ fill: "white" });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });


var input;
let EnterButton = Container.template($ => ({ skin: new Skin({fill: "blue"}),
	height: 100, width: 200, active: true,
	behavior: Behavior({
		onTouchEnded(container){
			container.container.container.map.distribute("drawLocation", input);
		}
	})	
}));
let MyField = Container.template($ => ({ 
	top: 5, 
    width: 150, height: 30, skin: nameInputSkin, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, 
            Behavior: 
            	FieldScrollerBehavior,clip: true, 
            contents: [
                Label($, { 
                    top: 0, bottom: 0, skin: fieldLabelSkin, 
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            trace(data.name+"\n");
                            input = data.name;
                        }
                    },
                }),
                Label($, {
                    left: 2, right: 2, top: 2, bottom: 2, style: fieldHintStyle,
                    string: "Search for a food", name: "hint"
                }),
            ]
        })
    ]
}));

let Map = Container.template($ => ({
	name: "map", left: 0, right: 0, top: 0, bottom: 0, active: true,
	contents: [
		new Container({ skin: mapSkin, height: 180, width: 280, left: 20, right: 20, top: 0 }),
	],
	behavior: Behavior({
		onCreate(container){
		},
		drawLocation(container, input){
			try{
				var top = locationDict[input].row * 10;
				switch(locationDict[input].offset){
					case "right":
						var left = 25 + locationDict[input].col * 10;	
						break;
					case "left":
						var left = 15 + locationDict[input].col * 10;
						break;
					default:
						var left = 20 + locationDict[input].col * 10;
				}
				trace("TOP: " + top + "    LEFT: " + left + "\n");
				container.add(new LocationCircle({top: top, left: left}));
			} catch (err){
				trace("ERROR: " + err + "\n");
				if(err.name == "TypeError"){ trace("We don't sell " + input + "\n");}
			}
			
		}
	})
}));

let InputLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [new MyField({name:""}), new EnterButton]
}))

export var itemSearchScreen = Column.template($ => ({    name: "itemSearchScreen", left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }),    contents: [      //Label($, { left: 0, right: 0, style: hugeLabelStyle, string: $.transitionNumber, }),
      new Map,
      new InputLine   ],}));