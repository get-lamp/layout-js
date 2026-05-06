const PIXI = require('pixi.js');
const {Grid} = require('./grid');
const {Component, Blueprint} = require('./component');


var renderer = PIXI.autoDetectRenderer({
    height: 512,
    width: 512,
    antialias: false, 
    transparent: true, 
    resolution: 1
});


// initialize blueprints
var BoxBlueprint = new Blueprint({display: Grid.DISPLAY_INLINE_BLOCK, height: 400});
var DrawerBlueprint = new Blueprint({height: 50, width: 200, yAlign: Grid.STACK_BOTTOM});
var DrawerBlueprint2 = new Blueprint({height: 50, width: 200, yAlign: Grid.STACK_BOTTOM});
var DrawerBlueprint3 = new Blueprint({height: 50, width: 200, yAlign: Grid.STACK_BOTTOM});
var DrawerBlueprint4 = new Blueprint({height: 50, width: 200, yAlign: Grid.STACK_BOTTOM});

var ThingsBlueprint = new Blueprint({height: 10, width: 10, display: Grid.DISPLAY_INLINE_BLOCK, 			xAlign: Grid.STACK_RIGHT});
var MoreThingsBlueprint = new Blueprint({height: 20, width: 20, display: Grid.DISPLAY_INLINE_BLOCK, 		xAlign: Grid.STACK_RIGHT});
var EvenMoreThingsBlueprint = new Blueprint({height: 30, width: 30, display: Grid.DISPLAY_INLINE_BLOCK, 	xAlign: Grid.STACK_LEFT});
var YetMoreThingsBlueprint = new Blueprint({height: 40, width: 40, display: Grid.DISPLAY_INLINE_BLOCK, 		xAlign: Grid.STACK_LEFT, yAlign: Grid.ALIGN_CENTER});
var MoreAndMoreThingsBlueprint = new Blueprint({ 
	height: 50, 
	width: 50, 
	display: Grid.DISPLAY_INLINE_BLOCK, 
	xAlign: Grid.STACK_RIGHT, 
	yAlign: Grid.STACK_BOTTOM
});

// create graphics, associate blueprints
var box = new Component(BoxBlueprint);

var things = new Component(ThingsBlueprint);
var moreThings = new Component(MoreThingsBlueprint);
var evenMoreThings = new Component(EvenMoreThingsBlueprint);
var yetMoreThings = new Component(YetMoreThingsBlueprint);
var moreAndMoreThings = new Component(MoreAndMoreThingsBlueprint);

var drawer = new Component(DrawerBlueprint);
var drawer2 = new Component(DrawerBlueprint2);
var drawer3 = new Component(DrawerBlueprint3);
var drawer4 = new Component(DrawerBlueprint4);

drawer.addComponent([things, moreThings, evenMoreThings, yetMoreThings, moreAndMoreThings]);
box.addComponent(drawer);
box.addComponent(drawer2);
box.addComponent(drawer3);
box.addComponent(drawer4);


// render
box.build();


renderer.render(box.getGraphics());

document.getElementById('main').appendChild(renderer.view);