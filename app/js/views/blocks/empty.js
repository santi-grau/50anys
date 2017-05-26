var Empty = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.linewidth = this.parent.lineWidth;

	this.group = this.parent.parent.two.makeGroup( this.rect );
}
Empty.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Empty.prototype.step = function( time ) {
	
};

module.exports = Empty;