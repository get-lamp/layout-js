const random = require('./random');

class Rectangle{

	constructor(x, y, width, height, color){
		this.x 		= x || 0;
		this.y 		= y || 0;
		this.height = height || 0;
		this.width 	= width || 0;
		this.color 	= color;
	}
}

class Partition{

	constructor(args){

		args = args || {};

		this._slots = this.randomize(args.min || 1, args.max || 3);
		this._size = args.size || 0;
		this._payload = Array(this.slots.length);
		this._symmetric = false;

		if(args.unitSize)
			this.unitSize = args.unitSize;
	}

	randomize(min, max){

		min = min || 1;
		max = max || 5;

		for(var i=0, partitionSize=1, slotCount=random.randInt(min, max), slots = new Array(slotCount); i < slotCount; i++) 
			slots[i] = partitionSize;

		return slots;
	}

	get symmetric(){
		return this._symmetric;
	}

	set symmetric(value){
		this._symmetric = value;
		return this;
	}

	get length(){
		return this._slots.length;
	}

	get slots(){
		return this._slots;
	}

	set slots(value){
		this._slots = value;
		return this;
	}

	get size(){
		return this._size;
	}

	set size(value){
		this._size = value;
		return this;
	}

	get units(){
		return this.slots.reduce((a, b) => a + b, 0);
	}

	get unitSize(){
		return Math.ceil(this.size / this.units);
	}

	set unitSize(value){
		this._size = this.units * value;
	}

	get slotsAreEqual(){
		var n = this.slots[0];
		for(var i in this.slots)
			if(this.slots[i] != n)
				return false;
		return true;
	}

	get data(){
		return this._payload;
	}

	set data(data){
		this._payload = data;
		return this;
	}

	getSlotData(slot){
		return this._payload[slot];
	}

	setSlotData(slot, data){
		this._payload[slot] = data;
		return this;
	}

	getSlot(slot){
		return this._slots[slot];
	}

	getSlotSizeRatio(slot){
		return this.slots[slot];
	}

	getSlotSize(slot){
		return this.getSlotSizeRatio(slot) * this.unitSize;
	}

	largestSlotIndex(){
		var largest= 0;

		if(this.slotsAreEqual)
			return -1;

		for(var i=0; i < this.slots.length; i++)
		    if(this.slots[i] > this.slots[largest])
		        largest = i;

 		return largest;
	}
}

var Matrix = function(width, height, callback){
 
	if(!callback){
		callback = function(x,y){
			return null;
		}
	}

	var matrix = new Array(height);

	for(var y=0; y < height; y++){

		matrix[y] = new Array(width);

		for(var x=0; x < width; x++){
			matrix[y][x] = callback(x,y);
		}
	}

	return matrix;
}

exports.Matrix = Matrix;
exports.Partition = Partition;
exports.Rectangle = Rectangle;
