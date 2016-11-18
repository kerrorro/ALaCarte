import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';

// Hardwire Data For Now
let cartData = {
	items: [0, 1, 2, 3, 4], // array of item ids; use itemInfo dictionary for more info
	location: "Unsure what to put here -- Caroline might know better"
}

// item id -> nutitional info
// add more info as needed
let itemInfo = {
	0: { name: "Banana", calories: 10, type: "Produce", subtype: "Fruit" },
	1: { name: "Chocolate Chip Cookies", calories: 150, type: "Sweets", subtype: "Cookies" },
	2: { name: "Whole Wheat Bread", calories: 128, type: "Grains", subtype: "Bread" },
	3: { name: "Ground Beef", calories: 155, type: "Meats", subtype: "Beef" },
	4: { name: "Apple", calories: 30, type: "Produce", subtype: "Fruit" },
}
var fontColor = "#828282";
let hugeLabelStyle = new Style({    color: 'black', font: 'bold 125px', horizontal: 'center', vertical: 'middle', });
let itemStyle = new Style({    color: fontColor, font: '20px Open Sans', horizontal: 'left', vertical: 'middle', });
let priceStyle = new Style({
	color: fontColor, font: 'bold 29px Open Sans', horizontal: 'left', vertical: 'middle', 

});
let checkoutStyle = new Style({
	color: fontColor, font: '18px Quicksand', horizontal: 'left', vertical: 'middle', 

});
let checkoutpriceStyle = new Style({
	color: fontColor, font: 'bold 25px Open Sans', horizontal: 'left', vertical: 'middle', 
});

let totalpriceStyle = new Style({
	color: "#FFAC8B", font: 'bold 35px Open Sans', horizontal: 'left', vertical: 'middle', 
});




// color skins
var blueSkin = new Skin({ fill:"#5886E4" });
var peachSkin = new Skin({ fill: "#FFAC8B"});
var redSkin = new Skin( {fill : "#E94363"});
var lightblueSkin = new Skin({fill : "#68E1F4"});
var purpleSkin = new Skin({fill: "#664266"});
var yellowSkin = new Skin({ fill: "#FFC273"});
var blackSkin = new Skin({fill: "#828282"});
let darkGraySkin = new Skin({ fill: "#202020" });
let whiteSkin = new Skin({fill: "white"});


export var priceScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }),    contents: [
   			   			VerticalScroller($, { active: true, top: 15, bottom: 90, left: 0, right: 0, contents:[				new contentToScrollVertically,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),   			]}),
   			
   			
   			
 
   			
   			new topContainer({skin: whiteSkin}),
   			
 
   			
   			new bottomContainer({skin: whiteSkin})            ]}));



let bottomContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [

		new Label({ left: 155, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 80, string: $.amount, style: checkoutpriceStyle}),
	]
}));

let taxContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [

		new Label({ left: 190, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 80, string: $.amount, style: checkoutpriceStyle}),
	]
}));

let totalContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [

		new Label({ left: 155, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 110, string: $.amount, style: totalpriceStyle}),
	]
}));

// dummy container
var topContainer = Column.template($ => ({     left: 0, right: 0, top: 0, height: 15,    skin: $.skin, contents: [

    ]}));


var bottomContainer = Column.template($ => ({     left: 0, right: 0, top: 350, bottom: 74,     skin: $.skin, contents: [
    	new bottomContainerLine({name: "Subtotal", amount: "$12.20"}),
    	new taxContainerLine({name: "Tax", amount: "$1.22"}),
    	new totalContainerLine({name: "Total", amount: "$13.42"}),
    ]}));

let itemPriceLine = Line.template($ => ({
	left: 0, top: 0, right: 0,
	contents: [
		new Container({width:7, height: 43, left:15, skin: $.skin}),
		new Label({left: 10, top: 0, bottom: 0, height:43, width: 80, string: $.price, style: priceStyle}),
		new Label({right: 0, top: 0, bottom: 0, height:43, string: $.name, style: itemStyle}),
		
	]
}));

let seperateLine = Container.template($ => ({
	width:344, left:15, height: 1, skin: blackSkin,
}));
var contentToScrollVertically = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [
    	new itemPriceLine({skin:blueSkin ,name: "Banana", price: "$0.10"}),
    	new seperateLine(),
    	new itemPriceLine({skin:peachSkin ,name: "Chocolate Chip Cookies", price: "$2.10"}),
		new seperateLine(),
    	new itemPriceLine({skin:redSkin ,name: "Whole Wheat Bread", price: "$4.50"}),
    	new seperateLine(),
    	new itemPriceLine({skin:lightblueSkin ,name: "Ground Beef", price: "$5.00"}),
    	new seperateLine(),
    	new itemPriceLine({skin:purpleSkin ,name: "Apple", price: "$0.50"}),
    ]}));var scrollerExample = new priceScreen({ contentToScrollVertically });