var Switch = function( parent, block ) {
	this.parent = parent;

	this.props = {
		div : .1
	}

	this.group = this.parent.two.makeGroup();

		
	var rect = this.parent.two.makeRectangle( 0, 0, block.w, block.h );
	rect.linewidth = 1;
	rect.noFill();

	rect.fill = '#ffffff';
	

	if( block.w > block.h ){
		var rect2 = this.parent.two.makeRectangle( -block.w / 2 + block.w * this.props.div / 2 + 2.5, 0, block.w * this.props.div, block.h - 5 );
	} else {
		var rect2 = this.parent.two.makeRectangle( 0, -block.h / 2 + block.h * this.props.div / 2 + 2.5 , block.w - 5, block.h * this.props.div );
	}

	rect2.fill = '#000000';
	rect2.noStroke();

	this.group.add( rect, rect2 );

	
}

Switch.prototype.step = function() {

};

module.exports = Switch;