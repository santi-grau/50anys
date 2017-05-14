var Bigx = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = 1;

	var line1 = this.parent.parent.two.makeLine( this.block.x, this.block.y, this.block.x + this.block.w, this.block.y + this.block.h );
	var line2 = this.parent.parent.two.makeLine( this.block.x + this.block.w, this.block.y, this.block.x, this.block.y + this.block.h );
	line1.linewidth = 0.5;
	line2.linewidth = 0.5;
	this.group = this.parent.parent.two.makeGroup( rect, line1, line2 );
}
Bigx.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Bigx.prototype.step = function( time ) {
	
};

module.exports = Bigx;