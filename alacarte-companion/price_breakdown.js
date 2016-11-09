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

let itemStyle = new Style({    color: 'black', font: 'bold 15px', horizontal: 'center', vertical: 'middle', });export var priceScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }),    contents: [
   			   			VerticalScroller($, { active: true, top: 60, bottom: 60, contents:[				new contentToScrollVertically,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),   			]}),
   			
   			new topContainer({skin: darkGraySkin}),
   			
   			new bottomContainer({skin: darkGraySkin})            ]}));

var topContainer = Container.template($ => ({     left: 0, right: 0, top: 0, height: 60,     skin: $.skin, contents: [
    	new Label({ left: 15, top: 0, bottom: 0, height:50, string: "Product",style: titleStyle}),
	    new Label({ right: 0, left: 150, top: 0, bottom: 0, height:50, string: "Price before tax",style: titleStyle}),
    ]}));

var bottomContainer = Column.template($ => ({     left: 0, right: 0, top: 250, bottom: 0,     skin: $.skin, contents: [
    	new Label({ left: 15, top: 0, bottom: 0, height:0, string: "Subtotal",style: titleStyle}),
  		new Label({ left: 15, top: 0, bottom: 0, height:0, string: "Tax",style: titleStyle}),
  		new Label({ left: 15, top: 0, bottom: 0, height:0, string: "Total",style: titleStyle}),
    
    ]}));
var contentToScrollVertically = Column.template($ => ({     top: 0, left: 0, right: 0,     contents: [
		new Label({ left: 15, top: 0, bottom: 0, height: 0, height:50, string: "Banana",style: itemStyle}),
		new Label({ left: 15, top: 0, bottom: 0, height: 0, height:50, string: "Chocolate Chip Cookies",style: itemStyle}),
		new Label({ left: 15, top: 0, bottom: 0, height: 0, height:50, string: "Whole Wheat Bread",style: itemStyle}),
		new Label({ left: 15, top: 0, bottom: 0, height: 0, height:50, string: "Ground Beef",style: itemStyle}),
		new Label({ left: 15, top: 0, bottom: 0, height: 0, height:50, string: "Apple",style: itemStyle}),    ]}));let darkGraySkin = new Skin({ fill: "#202020" });let titleStyle = new Style({ font: "20px", color: "white" });var scrollerExample = new priceScreen({ contentToScrollVertically });