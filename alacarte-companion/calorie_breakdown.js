let grayColor = '#828282';
let peachColor = '#FFAC8B';
let redColor = '#E94363'
let tealColor = '#68E1F4'
let purpleColor = '#664266'
let orangeColor = '#FFC273';

let percentageStyle = new Style({
   color: 'black', font: '16px', horizontal: 'center', vertical: 'middle',
});
let categoryStyle = new Style({
   color: 'black', font: '16px', horizontal: 'right', vertical: 'middle',
});
let categoryDetailsHeaderStyleLeft = new Style({
   color: "white", font: '18px', horizontal: "left", vertical: 'middle',
});
let categoryDetailsHeaderStyleRight = new Style({
   color: "white", font: '18px', horizontal: "right", vertical: 'middle',
});
let productDetailsStyleLeft = new Style({
   color: "black", font: '18px', horizontal: "left", vertical: 'middle',
});
let productDetailsStyleRight = new Style({
   color: "black", font: '18px', horizontal: "right", vertical: 'middle',
});
let categoryTotalTitleStyle = new Style({
   color: '#828282', font: '32px', horizontal: 'center', vertical: 'middle',
});

let whiteSkin = new Skin({fill: "white"});
let blackSkin = new Skin({fill: "black"});

let forwardTexture = new Texture("assets/forward.png");
let forwardSkin = new Skin({
	height: 31, width: 19,
	texture: forwardTexture,
	variants: 19
});
var ForwardArrow = Container.template($ => ({
	right: 0, height: 25, width: 19, name: "forward",
	skin: forwardSkin, variant: 1,
	active: true,
}));


let CategoryColumnBar = Container.template($ => {
	var barWidth = ($.percentage / 100) * 305;

	return (
		{ left: 0, width: barWidth, top: 5, height: 8, skin: new Skin({fill: $.fill}) }
	)
});


let percentageLabelStyle = new Style({
   color: grayColor, font: 'bold 35px', horizontal: "left", vertical: 'middle',
});
let foodGroupTitleLabelStyle = new Style({
   color: grayColor, font: '20px bold', horizontal: "left", vertical: 'middle',
});
let FoodGroupLabels = Line.template($ => {
	return ({
		left: 0, right: 0, top: 0,
		contents: [
			new Label({left: 0, top: 0, height: 40}, null, percentageLabelStyle, $.percentage + "%"),
			new Label({left: 10, right: 0, top: 0, height: 40}, null, foodGroupTitleLabelStyle, $.name.charAt(0).toLowerCase() + $.name.slice(1)),
			new ForwardArrow
		]
	})
});


/* Food Group Info - Params: name (string), percentage (number), fill (string) */
let FoodGroupInfo = Column.template($ => {

	return ({
		left: 15, right: 15, top: 12, height: 70, active: true, name: $.name,
		contents: [
			new FoodGroupLabels($),
			new CategoryColumnBar($),
			new Container({left: 0, right: 0, top: 15, height: 1, skin: blackSkin}), // Line Breaker
		],
		behavior: Behavior({
			onTouchEnded(categoryLine) {
				trace(categoryLine.name + " Category Selected\n");
				application.distribute("transitionToScreen", {to: "calorieDetailsScreen", type: categoryLine.name});
			}
		})
	})
});


/* Visual Bar for the top of the screen */
let CategoryVisualBar = Line.template($ => {
	return ({
		left: 15, right: 15, top: 8, height: 30,
		contents: [
			new Container({left: 0, width: ($.produce / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: peachColor})}),
			new Container({left: 0, width: ($.sweets / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: redColor})}),
			new Container({left: 0, width: ($.grains / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: tealColor})}),
			new Container({left: 0, width: ($.meats / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: purpleColor})}),
			new Container({left: 0, width: ($.dairy / 100) * 290, top: 10, bottom: 10, skin: new Skin({fill: orangeColor})})
		]
	})
});

export var calorieScreen = Column.template($ => {

	// Loop through all cart data items and find total calories and
	// total calories for each food group
	var items = $.cartData.items;
	var totalCal = 0;
	var calories = {"Produce": 0, "Sweets": 0, "Grains": 0, "Meats": 0, "Dairy": 0}
	for (var item of items) {
		var itemInfo = $.itemInfo[item];
		totalCal += itemInfo.calories
		calories[itemInfo.type] += itemInfo.calories
	}

	// Set percentage for each food group
	var sweetsPercent = Math.round((calories["Sweets"] / totalCal) * 100);
	var producePercent = Math.round((calories["Produce"] / totalCal) * 100);
	var dairyPercent = Math.round((calories["Dairy"] / totalCal) * 100);
	var meatsPercent = Math.round((calories["Meats"] / totalCal) * 100);
	var grainsPercent = Math.round((calories["Grains"] / totalCal) * 100);

	return ({
	   left: 0, right: 0, top: 0, bottom: 0, name: "calorieScreen", skin: new Skin({fill: "#fcfcfd"}),
	   contents: [
		  new Label({left: 0, right: 0, top: 20, height: 20}, null, categoryTotalTitleStyle, "Total"), // Title Label
	   	  new CategoryVisualBar({produce: producePercent, sweets: sweetsPercent, grains: grainsPercent, meats: meatsPercent, dairy: dairyPercent}),
	   	  new Container({left: 15, right: 15, top: 10, height: 1, skin: blackSkin}), // Line Breaker
	      new FoodGroupInfo({name: "Produce", percentage: producePercent, fill: peachColor}),
	      new FoodGroupInfo({name: "Sweets", percentage: sweetsPercent, fill: redColor}),
	      new FoodGroupInfo({name: "Grains", percentage: grainsPercent, fill: tealColor}),
	      new FoodGroupInfo({name: "Meats", percentage: meatsPercent, fill: purpleColor}),
	      new FoodGroupInfo({name: "Dairy", percentage: dairyPercent, fill: orangeColor}),
	   ]
	})
});

let calorieDetailsHeader = Line.template($ => ({
	left: 10, right: 10, top: 15, height: 30, skin: blackSkin,
	contents: [
		new Label({left: 10, width: 80, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleLeft, "Product"),
		new Label({left: 10, right: 10, top: 10, bottom: 10}, blackSkin, categoryDetailsHeaderStyleRight, "Calories Per Serving"),
	]
}));


/* DETAILS SCREEN */
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
	   left: 0, right: 0, top: 0, bottom: 0, 
	   contents: contents
	});
});