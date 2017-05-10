var Tunel = function( parent, block ) {
	this.parent = parent;

	this.props = {
		spacing : 4
	}

	this.group = this.parent.two.makeGroup();

	var maxSquares = Math.min( block.w, block.h ) / this.props.spacing;

	for( var i = 0 ; i < maxSquares ; i++ ){
		
		var rect = this.parent.two.makeRectangle( 0, 0, block.w - this.props.spacing * i, block.h - this.props.spacing * i );
		rect.linewidth = 1;
		rect.noFill();
		this.group.add( rect );
	}
	
}

Tunel.prototype.step = function() {

};

module.exports = Tunel;