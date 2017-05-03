var Empty = function( parent, block ) {
	this.parent = parent;

	var rect = this.parent.two.makeRectangle( block.x + block.w / 2, block.y + block.h / 2, block.w, block.h );
	rect.linewidth = 1;

	this.group = this.parent.two.makeGroup( rect );
}

module.exports = Empty;