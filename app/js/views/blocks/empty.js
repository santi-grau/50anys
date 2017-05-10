var Empty = function( parent, block ) {
	this.parent = parent;

	var rect = this.parent.two.makeRectangle( 0, 0, block.w, block.h );
	rect.linewidth = 1;

	this.group = this.parent.two.makeGroup( rect );
}

Empty.prototype.animate = function( val ){

}

Empty.prototype.step = function() {

};

module.exports = Empty;