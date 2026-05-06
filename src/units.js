const Units = {
	man: {
		maxWidth: 19,
		maxHeight: 58,
		minWidth: 13,
		minHeight: 48
	}
}

Object.defineProperty(Units.man, 'average', {
    get: function() {
        return {
        	width: 14,
        	height: (this.maxHeight + this.minHeight) / 2
        };
    }
});

exports.Units = Units;