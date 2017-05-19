var Tunel = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.props = {
		spacing : 10
	}

	this.group = this.parent.parent.two.makeGroup();

	var maxSquares = Math.min( this.block.w, this.block.h ) / this.props.spacing;

	for( var i = 0 ; i < maxSquares ; i++ ){
		
		var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w - this.props.spacing * i, this.block.h - this.props.spacing * i );
		rect.linewidth = 1;
		rect.noFill();
		this.group.add( rect );
	}
	
}

Tunel.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Tunel.prototype.step = function() {

};

module.exports = Tunel;