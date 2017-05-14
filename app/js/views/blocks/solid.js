var Solid = function( parent, block ) {
	this.parent = parent;
	this.block = block;


	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.noStroke();
	rect.fill = '#000000';

	this.group = this.parent.parent.two.makeGroup( rect );
}

Solid.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Solid.prototype.step = function() {

};

module.exports = Solid;