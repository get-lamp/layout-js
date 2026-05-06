const {Rectangle} = require('./structs'); 

const DISPLAY_BLOCK = 0;
const DISPLAY_INLINE_BLOCK = 1;

const ALIGN_TOP = 0;
const ALIGN_CENTER = 1;
const ALIGN_BOTTOM = 2;
const ALIGN_LEFT = 3;
const ALIGN_RIGHT = 4;

const STACK_TOP = 5;
const STACK_BOTTOM = 6;
const STACK_LEFT = 7;
const STACK_RIGHT = 8;


class Grid{

	/**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
	constructor(args){

		args = args || {};

		this._x = args.x || 0;
		this._y = args.y || 0;

		this.xAlign = args.xAlign || ALIGN_LEFT;
		this.yAlign = args.yAlign || ALIGN_TOP;

		this._stackBox = {
			top: new Rectangle(),
			right: new Rectangle(),
			bottom: new Rectangle(),
			left: new Rectangle()
		}

		this._width = args.width || null;
		this._height = args.height || null;
		this._parent = args.parent || null;
		this._children = [];
		this._owner = null;
		this._display = args.display || DISPLAY_BLOCK;

		this.uid = this.constructor.name + '_' + Grid.uid++;
	}

	/**
     * Convert a string containing two comma-separated numbers into a point.
     * @param {string} str - The string containing two comma-separated numbers.
     * @return {Point} A Point object.
     */
	static get DISPLAY_BLOCK(){
		return DISPLAY_BLOCK;
	}

	static get DISPLAY_INLINE_BLOCK(){
		return DISPLAY_INLINE_BLOCK;
	}

	// align constants
	static get ALIGN_CENTER(){
		return ALIGN_CENTER;
	}

	static get ALIGN_TOP(){
		return ALIGN_TOP;
	}

	static get ALIGN_BOTTOM(){
		return ALIGN_BOTTOM;
	}

	static get ALIGN_LEFT(){
		return ALIGN_LEFT;
	}

	static get ALIGN_RIGHT(){
		return ALIGN_RIGHT;
	}

	// stacking constants
	static get STACK_TOP(){
		return STACK_TOP;
	}

	static get STACK_RIGHT(){
		return STACK_RIGHT;
	}

	static get STACK_BOTTOM(){
		return STACK_BOTTOM;
	}

	static get STACK_LEFT(){
		return STACK_LEFT;
	}

	static isRelativeValue(value){
		return value && value.indexOf && value.indexOf('r') == 0;
	}

	static getRelativeValue(value){
		return value.split('r')[1];
	}

	get owner(){
		return this._owner;
	}

	set owner(owner){
		
		this._owner = owner;

		if(!owner.blueprint)
			owner.blueprint = this;

		return this; 
	}

	get display(){
		return this._display;
	}

	set display(value){
		this._display = value;
		return this;
	}

	get x(){

		if(this.parent){
			switch(this.xAlign){
				
				case ALIGN_RIGHT:
					return this.parent.edges.right - this.width + this._x;
					break;
				case ALIGN_CENTER:
					return this.parent.center.x - (this.width/2) + this._x;
					break;
				case ALIGN_LEFT:
					break
			}
		}

		return this._x + (this.parent ? this.parent.x : 0);
	}

	set x(value){
		this._x = value;
		return this;
	}

	get y(){

		if(this.parent){

			switch(this.yAlign){
				case ALIGN_BOTTOM:
					return this.parent.edges.bottom - this.height + this._y;
					break
				case ALIGN_CENTER:
					return this.parent.center.y - (this.height/2) + this._y;
					break;
				case ALIGN_TOP:
					break;
			}
		}

		return this._y + (this.parent ? this.parent.y : 0);
	}

	/**
     * Get the y value.
     * @return {number} The y value.
     */
	updateStackX(child){
		
		switch(child.xAlign){

			case STACK_LEFT:
				child.x = this.stackBox.left.width + child._x;
				this.stackBox.left.width += child.width;
				break;
			case STACK_RIGHT:
				child.x = this.width - this.stackBox.right.width - child.width + child._x;
				this.stackBox.right.width += child.width;
				break;
		}

		return this;
	}

	updateStackY(child){

		switch(child.yAlign){
		
			case STACK_TOP:
				child.y = this.stackBox.top.height + child._y;
				this.stackBox.top.height += child.height;
				break;
			case STACK_BOTTOM:
				child.y = this.height - this.stackBox.bottom.height - child.height + child._y;
				this.stackBox.bottom.height += child.height;
				break;
		}

		return this;
	}

	set y(value){
		this._y = value;
		return this;
	}

	get xAlign(){
		return this._xAlign;
	}

	set xAlign(align){
		this._xAlign = align;
		return this;
	}

	get yAlign(){
		return this._yAlign;
	}

	set yAlign(align){
		this._yAlign = align;
		return this;
	}

	get stackBox(){
		return this._stackBox;
	}

	get contentWidth(){
		var width = 0;
		for(var i in this.children){
			var childrenWidth = this.children[i].x + this.children[i].width;
			if(childrenWidth > width)
				width = childrenWidth;
		}

		return width;
	}

	get contentHeight(){
		var height = 0;
		for(var i in this.children){
			var childrenHeight = this.children[i].y + this.children[i].height;
			if(childrenHeight > height)
				height = childrenHeight;
		}

		return height;
	}

	get width(){

		if(this._width !== null){
			// value is set
				
			if(Grid.isRelativeValue(this._width)){
				// value is relative

				if(this.display == DISPLAY_BLOCK){
					// is a block container

					if(this.parent && this.parent.width){
						// has parent and parent has width
						return Grid.getRelativeValue(this._width) * this.parent.width;
					}
					else return 0;

				}
				else if(this.display == DISPLAY_INLINE_BLOCK){

					console.log('RELATIVE INLINE');
					console.log(Grid.getRelativeValue(this._width));
					// is an inline-block container
					return Grid.getRelativeValue(this._width) * this.contentWidth;
				}
				else
					throw('Unsupported display behavior ' + this.display);
			}
			else
				return this._width; // is an absolute value
		}
		else {
			// value is not set
			if(this.display == DISPLAY_BLOCK){
				// is a block container

				if(this.parent && this.parent.width){
					// has parent and parent has width
					return this.parent.width;
				}
				else return 0;

			}
			else if(this.display == DISPLAY_INLINE_BLOCK){
				// is an inline-block container
				return this.contentWidth;
			}
			else
				throw('Unsupported display behavior ' + this.display);
		}		
	}

	set width(value){
		this._width = value;
		return this; 
	}

	get height(){

		if(this._height !== null){
			// value is set
				
			if(Grid.isRelativeValue(this._height)){
				// value is relative

				if(this.display == DISPLAY_BLOCK){
					// is a block container

					if(this.parent && this.parent.height){
						// has parent and parent has height
						return Grid.getRelativeValue(this._height) * this.parent.height;
					}
					else return 0;

				}
				else if(this.display == DISPLAY_INLINE_BLOCK){
					// is an inline-block container
					return Grid.getRelativeValue(this._height) * this.contentHeight;
				}
				else
					throw('Unsupported display behavior ' + this.display);
			}
			else
				return this._height; // is an absolute value
		}
		else {
			// value is not set
			if(this.display == DISPLAY_BLOCK){
				// is a block container

				if(this.parent && this.parent.height){
					// has parent and parent has height
					return this.parent.height;
				}
				else return 0;

			}
			else if(this.display == DISPLAY_INLINE_BLOCK){
				// is an inline-block container
				return this.contentHeight;
			}
			else
				throw('Unsupported display behavior ' + this.display);
		}		
	}

	set height(value){
		this._height = value;
		return this; 
	}

	get parent(){
		return this._parent;
	}

	set parent(parent){
		this._parent = parent; 
		this._parent.addChild(this);
		return this;
	}

	get children()
	{
		return this._children;
	}

	addChild(child){

		if(child.parent.uid != this.uid)
			child.parent = this;

		this._children.push(child);

		// handle stacking children
		if(child.xAlign == STACK_LEFT || child.xAlign == STACK_RIGHT){
			
			// if container hasn't a defined height, calculations can be made easier stacking from the top with the same results
			if(this._width == null)
				child.xAlign = STACK_LEFT;

			this.updateStackX(child);
		}

		if(child.yAlign == STACK_TOP || child.yAlign == STACK_BOTTOM){
			
			// if container hasn't a defined height, calculations can be made easier stacking from the top with the same results
			if(this._height == null)
				child.yAlign = STACK_TOP;
			
			this.updateStackY(child);
		}
	}

	addChildren(children){
		this._children.concat(children);
	}

	get center(){
		return { x: this.x + (this.width) / 2, y: this.y + (this.height) / 2 }
	}

	get edges(){
		return {left: this.x, top: this.y, right: this.x + this.width, bottom: this.y + this.height};
	}
}

Grid.uid = 0;

exports.Grid = Grid;
