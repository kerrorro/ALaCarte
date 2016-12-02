import { ForwardArrow, BackArrow } from 'navigation';

Handler.bind("/setTimeout", {
  onInvoke: function(handler, message){
    handler.wait(message.requestObject.duration);
  }
});

let setTimeout = function(callback, duration, callbackArgs) {
  new MessageWithObject("/setTimeout", {duration}).invoke().then(() => {
    if (callback) callback(callbackArgs);
  });
}
var sweetsPercent = 0;
var producePercent = 0;
var dairyPercent = 0;
var meatsPercent = 0;
var grainsPercent = 0;

let grayColor = '#828282';
let peachColor = '#FFAC8B';
let redColor = '#E94363'
let tealColor = '#68E1F4'
let purpleColor = '#664266'
let orangeColor = '#FFC273';

let headingStyle = new Style({
   color: grayColor, font: 'bold 20px Open Sans', horizontal: 'center', vertical: 'middle',
});
let percentageStyle = new Style({
   color: grayColor, font: '16px Open Sans', horizontal: 'center', vertical: 'middle',
});
let categoryStyle = new Style({
   color: grayColor, font: '16px Open Sans', horizontal: 'right', vertical: 'middle',
});
let categoryDetailsHeaderStyleLeft = new Style({
   color: "white", font: '18px Open Sans', horizontal: "left", vertical: 'middle',
});
let categoryDetailsHeaderStyleRight = new Style({
   color: "white", font: '18px Open Sans', horizontal: "right", vertical: 'middle',
});
let productDetailsStyleLeft = new Style({
   color: grayColor, font: '30px Open Sans', horizontal: "left", vertical: 'middle',
});
let productDetailsStyleRight = new Style({
   color: grayColor, font: '20px Open Sans', horizontal: "right", vertical: 'bottom',
});
let categoryTotalTitleStyle = new Style({
   color: grayColor, font: 'bold 28px Open Sans', horizontal: 'center', vertical: 'middle',
});
let calorieDetailsCanvasMainStyle = new Style({
   color: grayColor, font: 'bold 40px Open Sans', horizontal: "middle", vertical: 'middle',
});

let whiteSkin = new Skin({fill: "white"});
let graySkin = new Skin({fill: "#D7D7D7"});

var animator = function($) {
  if ($.container.width >= $.width) {
    return;
  } else {
    $.container.sizeBy(2, 0);
    setTimeout(animator, $.time, $);
  }
}

let CategoryColumnBar = Container.template($ => {
  var barWidth = ($.percentage / 100) * 305;

  return (
    { 
      left: 0, width: barWidth, top: 5, height: 8, skin: new Skin({fill: $.fill}),
      behavior: Behavior({
        barWidth: barWidth,
        onCreate(container) {
          //container.sizeBy(0, 0);
          //setTimeout(animator, 10, {time: 10, width: this.barWidth, container: container});
        }
      })
    }
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
			new ForwardArrow({top: 0, bottom: 0, name: "4" + $.name + "%" + $.percentage })
		]
	})
});


/* Food Group Info - Params: name (string), percentage (number), fill (string) */
let FoodGroupInfo = Column.template($ => {

  return ({
    left: 0, right: 0, top: 0, height: 70, active: true, name: $.name,
    contents: [
      new FoodGroupLabels($),
      new CategoryColumnBar($),
      new Container({left: 0, right: 0, top: 5, height: 1, skin: graySkin}), // Line Breaker
    ],
    behavior: Behavior({
      percentage: $.percentage,
      onTouchEnded(categoryLine) {
        application.first.delegate("transitionToScreen", {to: "nutritionDetails", type: categoryLine.name, percentage: this.percentage});
      }
    })
  })
});

let FoodGroupInfoLayer = Layer.template($ => {
  return({
    left: 15, right: 15, top: 12, height: 70, active: true, subPixel: true,
    contents: [
      new FoodGroupInfo($)
    ],
    behavior: Behavior({
      onCreate: function(layer, data) {
        layer.subPixel = true;
        layer.opacity = 0;
        layer.interval = 8;
        layer.blocking = false;
        layer.translation = {y: 600, x: 0};
        setTimeout((obj) => {
          layer.start()
        }, $.delay, {layer})
      },
      onTimeChanged: function(layer) {
        if (layer.opacity > 0.95) {
          layer.opacity = 1;
          layer.translation = {x: 0, y: 0}
          layer.stop();
          return;
        }
        layer.opacity = layer.opacity + 0.025;
        layer.translation = {x: 0, y: layer.translation.y - 15}
      }
    })
  })
})


let CategoryVisualBarSubBar = Container.template($ => {
  return({
    left: 0, width: $.width, top: 10, bottom: 10, skin: new Skin({fill: $.color})
  })
})
/* Visual Bar for the top of the screen */
let CategoryVisualBar = Line.template($ => {
  return ({
    left: 15, right: 15, top: 8, height: 30,
    contents: [
      new CategoryVisualBarSubBar({width: ($.produce / 100) * 345, color: peachColor}),
      new CategoryVisualBarSubBar({width: ($.sweets / 100) * 345, color: redColor}),
      new CategoryVisualBarSubBar({width: ($.grains / 100) * 345, color: tealColor}),
      new CategoryVisualBarSubBar({width: ($.meats / 100) * 345, color: purpleColor}),
      new CategoryVisualBarSubBar({width: ($.dairy / 100) * 345, color: orangeColor}),
    ]
  })
});

export var calorieScreen = Column.template($ => {

  // Loop through all cart data items and find total calories and
  // total calories for each food group
  var items = $.cartData;
  var totalCal = 0;
  var calories = {"Produce": 0, "Sweets": 0, "Grains": 0, "Meats": 0, "Dairy": 0}
  for (var item of items) {
    var itemInfo = $.itemInfo[item];
    totalCal += itemInfo.calories
    calories[itemInfo.type] += itemInfo.calories
  }

  // Set percentage for each food group
  if ($.cartData.length != 0){
  	sweetsPercent = Math.round((calories["Sweets"] / totalCal) * 100);
  	producePercent = Math.round((calories["Produce"] / totalCal) * 100);
  	dairyPercent = Math.round((calories["Dairy"] / totalCal) * 100);
  	meatsPercent = Math.round((calories["Meats"] / totalCal) * 100);
  	grainsPercent = Math.round((calories["Grains"] / totalCal) * 100);
  }

  return ({
     left: 0, right: 0, top: 0, bottom: 0, name: "calorieScreen", skin: new Skin({fill: "#fcfcfd"}),
     contents: [
      new Label({left: 0, right: 0, top: 20, height: 30}, null, categoryTotalTitleStyle, "Per serving calorie total: " + totalCal), // Title Label
      new CategoryVisualBar({produce: producePercent, sweets: sweetsPercent, grains: grainsPercent, meats: meatsPercent, dairy: dairyPercent}),
      new Container({left: 15, right: 15, top: 10, height: 1, skin: graySkin}), // Line Breaker
      new FoodGroupInfoLayer({name: "Produce", percentage: producePercent, fill: peachColor, delay: 0*100}),
      new FoodGroupInfoLayer({name: "Sweets", percentage: sweetsPercent, fill: redColor, delay: 1.5*100}),
      new FoodGroupInfoLayer({name: "Grains", percentage: grainsPercent, fill: tealColor, delay: 3*100}),
      new FoodGroupInfoLayer({name: "Meats", percentage: meatsPercent, fill: purpleColor, delay: 4.5*100}),
      new FoodGroupInfoLayer({name: "Dairy", percentage: dairyPercent, fill: orangeColor, delay: 6*100}),
     ]
  })
});

let calorieDetailsCanvas = Canvas.template($ => ({
  left: 0, right: 0, top: 0, bottom: 0,
  behavior: Behavior({
    percentage: $.percentage,
    onDisplaying(canvas) {  
      let yellow = "#FFC273";
      let gray = "#e0e0e0"
      let total = (this.percentage / 100) * 2*Math.PI;
      let ctx = canvas.getContext("2d");
      trace(ctx + "\n");
      ctx.lineWidth = 8;

      if ($.percentage >= 25) {
        ctx.beginPath();
        ctx.strokeStyle = yellow;
        let remaining = ((this.percentage - 25) / 100) * 2*Math.PI;
        ctx.arc(188, 75, 55, 0, remaining);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = yellow;
        ctx.arc(188, 75, 55, 1.5708*3, total + (1.5708 * 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 75, 55, remaining, 1.5708*3);
        ctx.stroke();
      } else {

        ctx.beginPath();
        ctx.strokeStyle = yellow;
        ctx.arc(188, 75, 55, 1.5708*3, total + (1.5708 * 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 75, 55, 0, 1.5708*3);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gray;
        ctx.arc(188, 75, 55, total + (1.5708 * 3), 2*Math.PI);
        ctx.stroke();
      }
    }
  })
}));

let calorieDetailsHeader = Container.template($ => {
  return({
    left: 0, right: 0, top: 0, height: 150,
    contents: [
      new BackArrow({left: 20, top: 55, name: "5"}),
      new calorieDetailsCanvas($),
      new Label({left: 0, right: 0, top: 0, bottom: 0}, null, calorieDetailsCanvasMainStyle, $.percentage + "%"),
    ]
  })
})

/* DETAILS SCREEN */
let productDetailsLine = Line.template($ => ({
  left: 0, right: 0, top: 0, height: 30,
  contents: [
    new Label({left: 50, top: 0, bottom: 0}, null, productDetailsStyleLeft, $.productCalories),
    new Label({left: 0, right: 30, top: 0, bottom: 0}, null, productDetailsStyleRight, $.productName),
  ]
}));

let productDetailHeadings = Line.template($ => ({
	left: 0 , right: 0, top: 0,
	contents: [
		new Label({left: 40, string: "Calories per serving", style: headingStyle}),
		new Label({left: 10, right: 10, string: "Cart Item", style: headingStyle})
	]
}));

let productDetailsColumn = Column.template($ => ({
  left: 15, right: 15, top: 5,
  contents: [
    new productDetailsLine($),
    new Container({left: 0, right: 0, top: 5, height: 1, skin: graySkin})
  ]
}));

export var calorieDetailsScreen = Column.template($ => {

  var contents = [
    new calorieDetailsHeader({percentage: $.percentage}),
    new productDetailHeadings,
    new Container({left: 15, right: 15, top: 5, height: 1, skin: graySkin}), // Line Breaker
  ]
  var items = $.cartData;
  for (var item of items) {
    var itemInfo = $.itemInfo[item];
    if (itemInfo.type == $.type) {
      contents.push(new productDetailsColumn({productName: itemInfo.name, productCalories: itemInfo.calories}));
    }
  }

  return ({
     left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
     contents: contents
     })
  });
});