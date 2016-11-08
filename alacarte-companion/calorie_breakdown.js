let percentageStyle = new Style({    color: 'black', font: '16px', horizontal: 'center', vertical: 'middle', });
let categoryStyle = new Style({    color: 'black', font: '16px', horizontal: 'right', vertical: 'middle', });
let categoryDetailsHeaderStyleLeft = new Style({    color: "white", font: '18px', horizontal: "left", vertical: 'middle', });
let categoryDetailsHeaderStyleRight = new Style({    color: "white", font: '18px', horizontal: "right", vertical: 'middle', });
let productDetailsStyleLeft = new Style({    color: "black", font: '18px', horizontal: "left", vertical: 'middle', });
let productDetailsStyleRight = new Style({    color: "black", font: '18px', horizontal: "right", vertical: 'middle', });

let whiteSkin = new Skin({fill: "white"});
let blackSkin = new Skin({fill: "black"});

let forwardTexture = new Texture("assets/forward.png");
let forwardSkin = new Skin({
	height: 31, width: 19,
	texture: forwardTexture,
	variants: 19
});
var ForwardArrow = Container.template($ => ({
	left: 5, height: 25, width: 19, name: "forward",
	skin: forwardSkin, variant: 1,
	active: true,
}));

let DataBar = Container.template($ => {

	var barWidth = ($.percentage / 100) * 155;
	
	return (
		{ left: 0, width: barWidth, top: 10, bottom: 10, skin: new Skin({fill: $.fill}) }
	)
});

let CategoryLine = Line.template($ => {
		
	return ({
		left: 15, right: 15, top: 8, height: 50, active: true, name: $.name,
		contents: [
			new DataBar($),
			new Label({left: 0, width: 50, top: 10, bottom: 10}, whiteSkin, percentageStyle, $.percentage + "%"),
			new Label({left: 5, right: 0, top: 10, bottom: 10}, whiteSkin, categoryStyle, $.name),
			new ForwardArrow
		],
		behavior: Behavior({
			onTouchEnded(categoryLine) {
				trace(categoryLine.name + " Category Selected\n");
				application.distribute("transitionToScreen", {to: "calorieDetailsScreen", type: categoryLine.name});
			}
		})
	})
});

let CategoryVisualBar = Line.template($ => {
	return ({
		left: 15, right: 15, top: 8, height: 50,
		contents: [
			new Container({left: 0, width: ($.produce / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: "blue"})}),
			new Container({left: 0, width: ($.sweets / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: "red"})}),
			new Container({left: 0, width: ($.grains / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: "orange"})}),
			new Container({left: 0, width: ($.meats / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: "green"})}),
			new Container({left: 0, width: ($.dairy / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: "purple"})})
		]
	})
});
export var calorieScreen = Column.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, name: "calorieScreen",   contents: [
   	  new CategoryVisualBar({produce: 20, sweets: 30, grains: 12, meats: 13, dairy: 25}),
   	  new Container({left: 15, right: 15, top: 5,height: 1, skin: blackSkin}),      new CategoryLine({name: "Produce", percentage: 20, fill: "blue"}),
      new CategoryLine({name: "Sweets", percentage: 30, fill: "red"}),
      new CategoryLine({name: "Grains", percentage: 12, fill: "orange"}),
      new CategoryLine({name: "Meats", percentage: 13, fill: "green"}),
      new CategoryLine({name: "Dairy", percentage: 25, fill: "purple"}),   ]}));

let calorieDetailsHeader = Line.template($ => ({
	left: 15, right: 15, top: 15, height: 30, skin: blackSkin,
	contents: [
		new Label({left: 10, width: 80, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleLeft, "Product"),
		new Label({left: 10, right: 10, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleRight, "Calories Per Serving"),
	]
}));

let productDetailsLine = Line.template($ => ({
	left: 15, right: 15, top: 15, height: 30,
	contents: [
		new Label({left: 10, width: 80, top: 10, bottom: 10}, null, productDetailsStyleLeft, $.productName),
		new Label({left: 10, right: 10, top: 10, bottom: 10}, null, productDetailsStyleRight, $.productCalories),
	]
}));

export var calorieDetailsScreen = Column.template($ => ({
   left: 0, right: 0, top: 0, bottom: 0,    contents: [
      new calorieDetailsHeader(),
      new productDetailsLine({productName: "Banana", productCalories: 30}),
      new productDetailsLine({productName: "Banana", productCalories: 30}),
      new productDetailsLine({productName: "Banana", productCalories: 30}),   ]
}))