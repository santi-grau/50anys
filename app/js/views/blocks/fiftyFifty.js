var FiftyFifty = function( parent, block ) {
	this.parent = parent;

	this.props = {
		div : .5
	}

	this.group = this.parent.two.makeGroup();

		
	var rect = this.parent.two.makeRectangle( 0, 0, block.w, block.h );
	rect.linewidth = 1;
	rect.noFill();

	if( block.w > block.h ){
		var rect2 = this.parent.two.makeRectangle( -block.w / 4 , 0, block.w / 2, block.h );
	} else {
		var rect2 = this.parent.two.makeRectangle( 0, block.h / 4, block.w, block.h / 2 );
	}

	rect.fill = '#000000'

	this.group.add( rect, rect2 );

	
}

FiftyFifty.prototype.step = function() {

};

module.exports = FiftyFifty;