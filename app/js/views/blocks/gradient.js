var Gradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.scale = 0.7;

	var stops = [ 0, this.block.h / 2, 0, -this.block.h / 2 ];
	if( this.block.w > this.block.h ) stops = [ -this.block.w / 2, 0, this.block.w / 2, 0 ];

	var linearGradient = this.parent.parent.two.makeLinearGradient(
		stops[0],stops[1],stops[2],stops[3],
		new Two.Stop(0, '#000000'),
		new Two.Stop(1, '#444444')
	);

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = 1;
	rect.fill = linearGradient;

	this.group = this.parent.parent.two.makeGroup( rect );
}

Gradient.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Gradient.prototype.step = function() {

};

module.exports = Gradient;