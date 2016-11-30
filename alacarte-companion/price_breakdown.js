import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'scroller';

var fontColor = "#828282";

let hugeLabelStyle = new Style({ 
   color: 'black', font: 'bold 125px', horizontal: 'center', vertical: 'middle', 
});
let itemStyle = new Style({ 
   color: fontColor, font: '20px Open Sans', horizontal: 'left', vertical: 'middle', 
});
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
var graySkin = new Skin({fill: "#D7D7D7"});
let darkGraySkin = new Skin({ fill: "#202020" });
let whiteSkin = new Skin({fill: "white"});

export var priceScreen = Container.template($ => {
	
	var scrollContents = [];
	var subtotal = 0;
    for (var itemID of $.cartData) {
    	let info = $.itemInfo[itemID];
    	var skin;
    	subtotal += info.price;
    	switch(info.type) {
    		case "Produce":
    			skin = peachSkin;
    			break;
    		case "Sweets":
    			skin = redSkin;
    			break;
    		case "Grains":
    			skin = lightblueSkin;
    			break;
    		case "Meats":
    			skin = purpleSkin;
    			break;
    		case "Dairy":
    			skin = yellowSkin;
    			break;
    		default: 
    			skin = blueSkin;
    	}
    	scrollContents.push(new itemPriceLine({skin: skin, name: info.name, price: "$" + info.price.toFixed(2)}));
    	scrollContents.push(new seperateLine());
    }
    
    let tax = subtotal * 0.09;
    let total = subtotal + tax;
	
	return({ 
	   left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: "white" }), 
	   contents: [
	   			
	   			VerticalScroller($, { active: true, top: 15, bottom: 245, left: 0, right: 0, contents:[
					new contentToScrollVertically({contents: scrollContents}),
	                VerticalScrollbar(), 
	                TopScrollerShadow(), 
	                BottomScrollerShadow(),
	   			]}),
	   			
	   			new topContainer({skin: whiteSkin}),
	   			
	   			new bottomContainer({skin: whiteSkin, subtotal: subtotal, tax: tax, total: total})         
	   ]
	  })
});



let bottomContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [
		new Label({ left: 155, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 80, string: "$" + $.amount.toFixed(2), style: checkoutpriceStyle}),
	]
}));

let taxContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [
		new Label({ left: 190, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 80, string: "$" + $.amount.toFixed(2), style: checkoutpriceStyle}),
	]
}));

let totalContainerLine = Line.template($ => ({
	left: 0, top: 0, right: 0, bottom: 0,
	contents: [
		new Label({ left: 155, right: 0, top: 0, bottom: 0, string: $.name, style: checkoutStyle}),
		new Label({ right: 45, top: 0, bottom: 0,  width: 110, string: "$" + $.amount.toFixed(2), style: totalpriceStyle}),
	]
}));

// dummy container
var topContainer = Column.template($ => ({ 
    left: 0, right: 0, top: 0, height: 15,
    skin: $.skin, 
    contents: [
    ]
}));


var bottomContainer = Column.template($ => ({ 
    left: 0, right: 0, top: 350, bottom: 74, 
    skin: $.skin, contents: [
    	new bottomContainerLine({name: "Subtotal", amount: $.subtotal}),
    	new taxContainerLine({name: "Tax", amount: $.tax}),
    	new totalContainerLine({name: "Total", amount: $.total}),
    ]
}));

let itemPriceLine = Line.template($ => ({
	left: 0, top: 0, right: 0,
	contents: [
		new Container({width:7, height: 43, left:15, skin: $.skin}),
		new Label({left: 10, top: 0, bottom: 0, height:43, width: 80, string: $.price, style: priceStyle}),
		new Label({right: 0, top: 0, bottom: 0, height:43, string: $.name, style: itemStyle}),
	]
}));

let seperateLine = Container.template($ => ({
	width:344, left:15, height: 1, skin: graySkin,
}));

var contentToScrollVertically = Column.template($ => {
    return({
    	top: 0, left: 0, right: 0, 
	    contents: $.contents
	});
});