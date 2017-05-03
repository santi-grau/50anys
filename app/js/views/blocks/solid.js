var Solid = function( parent, block ) {
	this.parent = parent;

	var rect = this.parent.two.makeRectangle(0, 0, block.w, block.h );
	rect.noStroke();
	rect.fill = '#000000';

	this.group = this.parent.two.makeGroup( rect );
}

module.exports = Solid;