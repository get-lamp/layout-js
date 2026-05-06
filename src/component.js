const PIXI = require('pixi.js');
const {Grid} = require('./grid');
const random = require('./random');

class Blueprint extends Grid{

}


class Component {

	constructor(blueprint, args){
	
		args = args || {};
		this.blueprint = blueprint || null;
		this._components = [];
		this._parent = null;
		this.container = new PIXI.Container();
	}

	get components(){
		return this._components;
	}

	addComponent(components){

		if(Object.prototype.toString.call( components ) !== '[object Array]' )
			components = [components];
		
		for(var i in components){
			components[i].parent = this;
			//components[i].blueprint.parent = this.blueprint;
			this._components.push(components[i]);
		}

		return this;
	}

	get parent(){
		return this._parent;
	}

	set parent(parent){
		// associate component blueprint to this blueprint
		this.blueprint.parent = parent.blueprint;
		this._parent = parent;
	}

	get blueprint(){
		return this._blueprint;
	}

	set blueprint(blueprint){
		
		this._blueprint = blueprint;
		
		if(!blueprint.owner)
			blueprint.owner = this;
		
		return this;
	}

	getGraphics(){
		return this.container;
	}

	build(){

		var p = this.blueprint;
		var g = new PIXI.Graphics();
		g.beginFill(random.randHex());
		g.drawRect(p.x, p.y, p.width, p.height);
		g.endFill();
		this.container.addChild(g);

		for(var i in this.components){
			this.container.addChild(this.components[i].build());
		}

		return this.container;
	}

	addChild(child){
		return this.container.addChild(child);
	}

	removeChild(child){
		return this.container.removeChild(child);
	}
}

exports.Blueprint = Blueprint;
exports.Component = Component;