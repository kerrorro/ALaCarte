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
export var calorieScreen = Column.template($ => {

	var items = $.cartData.items;
	var totalCal = 0;
	var calories = {"Produce": 0, "Sweets": 0, "Grains": 0, "Meats": 0, "Dairy": 0}
	for (var item of items) {
		var itemInfo = $.itemInfo[item];
		totalCal += itemInfo.calories
		calories[itemInfo.type] += itemInfo.calories
	}
	
	var sweetsPercent = Math.round((calories["Sweets"] / totalCal) * 100);
	var producePercent = Math.round((calories["Produce"] / totalCal) * 100);
	var dairyPercent = Math.round((calories["Dairy"] / totalCal) * 100);
	var meatsPercent = Math.round((calories["Meats"] / totalCal) * 100);
	var grainsPercent = Math.round((calories["Grains"] / totalCal) * 100);

	return ({	   left: 0, right: 0, top: 0, bottom: 0, name: "calorieScreen",	   contents: [
	   	  new CategoryVisualBar({produce: producePercent, sweets: sweetsPercent, grains: grainsPercent, meats: meatsPercent, dairy: dairyPercent}),
	   	  new Container({left: 15, right: 15, top: 5,height: 1, skin: blackSkin}),	      new CategoryLine({name: "Produce", percentage: producePercent, fill: "blue"}),
	      new CategoryLine({name: "Sweets", percentage: sweetsPercent, fill: "red"}),
	      new CategoryLine({name: "Grains", percentage: grainsPercent, fill: "orange"}),
	      new CategoryLine({name: "Meats", percentage: meatsPercent, fill: "green"}),
	      new CategoryLine({name: "Dairy", percentage: dairyPercent, fill: "purple"}),	   ]
	})});

let calorieDetailsHeader = Line.template($ => ({
	left: 10, right: 10, top: 15, height: 30, skin: blackSkin,
	contents: [
		new Label({left: 10, width: 80, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleLeft, "Product"),
		new Label({left: 10, right: 10, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleRight, "Calories Per Serving"),
	]
}));

let productDetailsLine = Line.template($ => ({
	left: 15, right: 15, top: 15, height: 30,
	contents: [
		new Label({left: 10, right: 10, top: 10, bottom: 10}, null, productDetailsStyleLeft, $.productName),
		new Label({left: 10, width: 30, top: 10, bottom: 10}, null, productDetailsStyleRight, $.productCalories),
	]
}));

export var calorieDetailsScreen = Column.template($ => {
	
	var contents = [new calorieDetailsHeader()]
	var items = $.cartData.items;
	for (var item of items) {
		var itemInfo = $.itemInfo[item];
		if (itemInfo.type == $.type) {
			contents.push(new productDetailsLine({productName: itemInfo.name, productCalories: itemInfo.calories}));
		}
	}
	
	return ({
	   left: 0, right: 0, top: 0, bottom: 0, 	   contents: contents
	});
});