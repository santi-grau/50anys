var Empty = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = 1;

	this.group = this.parent.parent.two.makeGroup( rect );
}
Empty.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Empty.prototype.animate = function( val ){

}

Empty.prototype.step = function( time ) {
	
};

module.exports = Empty;