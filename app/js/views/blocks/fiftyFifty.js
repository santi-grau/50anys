var FiftyFifty = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.props = {
		div : .9
	}
	this.group = this.parent.parent.two.makeGroup();

		
	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, block.w, block.h );
	rect.linewidth = 1;
	rect.noFill();

	if( block.w > block.h ){
		var rect2 = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2 - block.w / 4 , this.block.y + this.block.h / 2, block.w / 2, block.h );
	} else {
		var rect2 = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2 + block.h / 4, block.w, block.h / 2 );
	}

	rect.fill = '#000000'

	this.group.add( rect, rect2 );
}

FiftyFifty.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

FiftyFifty.prototype.step = function() {

};

module.exports = FiftyFifty;