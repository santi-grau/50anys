var ColorGradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.scale = 0.7;
	this.colCount = 1;

	this.pairs = [ [ [ 255, 68, 68 ], [ 68, 68, 255 ] ], [ [ 68, 68, 255 ], [ 68, 255, 68 ] ], [ [ 68, 255, 68 ], [ 255, 68, 68 ] ] ];
	this.c1 = { r : this.pairs[0][0][0], g : this.pairs[0][0][1], b : this.pairs[0][0][2] };
	this.c2 = { r : this.pairs[0][1][0], g : this.pairs[0][1][1], b : this.pairs[0][1][2] };

	var stops = [ 0, this.block.h / 2, 0, -this.block.h / 2 ];
	if( this.block.w > this.block.h ) stops = [ -this.block.w / 2, 0, this.block.w / 2, 0 ];

	this.linearGradient = this.parent.parent.two.makeLinearGradient(
		stops[0],stops[1],stops[2],stops[3],
		new Two.Stop(0, 'rgba('+this.c1.r+','+this.c1.g+','+this.c1.b+',1)'),
		new Two.Stop(1, 'rgba('+this.c2.r+','+this.c2.g+','+this.c2.b+',1)')
	);

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = this.parent.lineWidth;
	rect.fill = this.linearGradient;

	this.group = this.parent.parent.two.makeGroup( rect );
}

ColorGradient.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

ColorGradient.prototype.switchColor = function(){
	( this.colCount < 2 ) ? this.colCount++ : this.colCount = 0;
	TweenMax.to( this.c1, 0.8, { paused : !this.animate, r : this.pairs[this.colCount][0][0], g : this.pairs[this.colCount][0][1], b : this.pairs[this.colCount][0][2], ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
	TweenMax.to( this.c2, 0.8, { paused : !this.animate, r : this.pairs[this.colCount][1][0], g : this.pairs[this.colCount][1][1], b : this.pairs[this.colCount][1][2], ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

ColorGradient.prototype.step = function() {
	if( this.animate && !this.switchInterval ) this.switchInterval = setInterval( this.switchColor.bind(this), 1000 );
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );
	this.linearGradient.stops[0].color = 'rgba('+Math.round(this.c1.r)+','+Math.round(this.c1.g)+','+Math.round(this.c1.b)+',1)';
	this.linearGradient.stops[1].color = 'rgba('+Math.round(this.c2.r)+','+Math.round(this.c2.g)+','+Math.round(this.c2.b)+',1)';
};

module.exports = ColorGradient;