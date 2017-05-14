var Offset = function( parent, block ) {
	this.parent = parent;

	this.props = {
		amount : .5
	}

	this.group = this.parent.two.makeGroup();

	var rect = this.parent.two.makeRectangle( 0, 0, block.w, block.h );
	rect.linewidth = 1;
	rect.noFill();
	
	var line1 = this.parent.two.makeLine(-block.w/2, -block.h/2, block.w/2, block.h/2);
	var line2 = this.parent.two.makeLine(-block.w/2, block.h/2, block.w/2, -block.h/2);

	var rect2 = this.parent.two.makeRectangle( 0, 0, block.w * this.props.amount, block.h * this.props.amount );
	rect2.fill = '#000000';

	this.group.add( rect, line1, line2, rect2 );
	

	
}

Offset.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}


Offset.prototype.step = function() {

};

module.exports = Offset;