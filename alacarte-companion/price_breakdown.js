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
let hugeLabelStyle = new Style({    color: 'black', font: 'bold 125px', horizontal: 'center', vertical: 'middle', });
let itemStyle = new Style({    color: 'black', font: 'bold 15px', horizontal: 'left', vertical: 'middle', });
let itemStyleRight = new Style({    color: 'black', font: 'bold 15px', horizontal: 'right', vertical: 'middle', });
let titleStyle = new Style({ font: "20px", color: "white", horizonal: "middle" });
let titleStyleLeft = new Style({ font: "20px", color: "white", horizontal: 'left' });
let titleStyleRight = new Style({ font: "20px", color: "white", horizontal: 'right' });
export var priceScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }),    contents: [
   			   			VerticalScroller($, { active: true, top: 60, bottom: 110, left: 0, right: 0, contents:[				new contentToScrollVertically,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),   			]}),
   			
   			new topContainer({skin: darkGraySkin}),
   			
   			new bottomContainer({skin: darkGraySkin})            ]}));

var topContainer = Container.template($ => ({     left: 0, right: 0, top: 0, height: 60,     skin: $.skin, contents: [
    	new Label({ left: 15, top: 0, bottom: 0, height:50, string: "Product", style: titleStyle}),
	    new Label({ right: 0, left: 150, top: 0, bottom: 0, height:50, string: "Price before tax",style: titleStyle}),
    ]}));

let bottomContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [
		new Label({ left: 15, right: 0, top: 0, bottom: 0, string: $.name, style: titleStyleLeft}),
		new Label({ right: 15, top: 0, bottom: 0,  width: 80, string: $.amount, style: titleStyleRight}),
	]
}));

var bottomContainer = Column.template($ => ({     left: 0, right: 0, top: 250, bottom: 0,     skin: $.skin, contents: [
    	new bottomContainerLine({name: "Subtotal", amount: "$12.20"}),
    	new bottomContainerLine({name: "Tax", amount: "$1.22"}),
    	new bottomContainerLine({name: "Total", amount: "$13.42"}),
    ]}));

let itemPriceLine = Line.template($ => ({
	left: 0, top: 0, right: 0,
	contents: [
		new Label({ left: 15, right: 0, top: 0, bottom: 0, height:50, string: $.name, style: itemStyle}),
		new Label({ right: 15, top: 0, bottom: 0, height:50, width: 50, string: $.price, style: itemStyleRight}),
	]
}));
var contentToScrollVertically = Column.template($ => ({     top: 0, left: 0, right: 0,     contents: [
    	new itemPriceLine({name: "Banana", price: "$0.10"}),
    	new itemPriceLine({name: "Chocolate Chip Cookies", price: "$2.10"}),
    	new itemPriceLine({name: "Whole Wheat Bread", price: "$4.50"}),
    	new itemPriceLine({name: "Ground Beef", price: "$5.00"}),
    	new itemPriceLine({name: "Apple", price: "$0.50"}),    ]}));let darkGraySkin = new Skin({ fill: "#202020" });var scrollerExample = new priceScreen({ contentToScrollVertically });