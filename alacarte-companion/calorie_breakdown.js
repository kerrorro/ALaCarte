let hugeLabelStyle = new Style({    color: 'black', font: 'bold 25px', horizontal: 'center', vertical: 'middle', });

let blackSkin = new Skin({fill: "black"});

let CategoryLine = Line.template($ => ({
	left: 10, right: 10, top: 5, height: 70, skin: blackSkin,
	contents: [
		new Label($, { left: 0, right: 0, style: hugeLabelStyle, string: $.name, }),
	]
}));
export var calorieScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: $.fillColor }),    contents: [      new CategoryLine({name: "Produce"}),
      new CategoryLine({name: "Produce"}),
      new CategoryLine({name: "Produce"}),
      new CategoryLine({name: "Produce"}),
      new CategoryLine({name: "Produce"}),   ]}));