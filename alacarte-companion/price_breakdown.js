import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';

let hugeLabelStyle = new Style({    color: 'black', font: 'bold 125px', horizontal: 'center', vertical: 'middle', });export var priceScreen = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0, skin: new Skin({ fill: $.fillColor }),    contents: [
                $.contentToScrollVertically,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),      Label($, { left: 0, right: 0, style: hugeLabelStyle, string: $.transitionNumber, }),   ]}));

let contentToScrollVertically = new Column({     top: 0, left: 0, right: 0,     contents: [        ['#1ACC45', '#79FFBF', '#FF6F3A', '#998060', '#CC7E1A'].map(color =>             new Container({ top: 0, height: 120, left: 0, right: 0,             skin: new Skin({ fill: color }) }))    ]});

let darkGraySkin = new Skin({ fill: "#202020" });let titleStyle = new Style({ font: "20px", color: "white" });

let MainContainer = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    contents: [        VerticalScroller($, {             active: true, top: 25, bottom: 0,            contents: [                $.contentToScrollVertically,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),        new Container({             top: 0, height: 25, left: 0, right: 0, skin: darkGraySkin,             style: titleStyle,             contents: [                new Label({ string: "Vertical Scroller Example" }),            ]        })    ]}));

let scrollerExample = new MainContainer({ contentToScrollVertically });application.add(scrollerExample);