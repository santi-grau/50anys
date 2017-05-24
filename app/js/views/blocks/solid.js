var Solid = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.timeStep = Math.random();

	this.rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	this.rect.linewidth = this.parent.lineWidth;
	this.rect.fill = '#000000';

	this.group = this.parent.parent.two.makeGroup( this.rect );
}

Solid.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Solid.prototype.step = function( time ) {
	this.timeStep += 0.01;
	// this.rect.fill = 'rgba( 0, 0, 0,' + ( Math.cos( this.timeStep ) / 2 + 0.5 ) + ')';
};

module.exports = Solid;