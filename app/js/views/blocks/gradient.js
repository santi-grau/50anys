var Gradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;
	this.scale = 0.7;

	var stops = [ 0, this.block.h / 2, 0, -this.block.h / 2 ];
	if( this.block.w > this.block.h ) stops = [ -this.block.w / 2, 0, this.block.w / 2, 0 ];

	this.gradientValue2 = 60;

	this.linearGradient = this.parent.parent.two.makeLinearGradient(
		stops[0],stops[1],stops[2],stops[3],
		new Two.Stop(0, 'rgba(0,0,0,1)'),
		new Two.Stop(1, 'rgba('+this.gradientValue2+','+this.gradientValue2+','+this.gradientValue2+',1)')
	);

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = 4;
	rect.fill = this.linearGradient;

	this.group = this.parent.parent.two.makeGroup( rect );
	
	this.px = 0;
	
	this.tween = TweenMax.to( this, 0.8, { paused : !this.animate, px : this.gradientValue2, repeat : Infinity, yoyo : true, onRepeat: this.onRepeat.bind(this), repeatDelay : (Math.random() + 0.5), ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

Gradient.prototype.onRepeat = function( val ){
	if(!this.animate) this.tween.pause();
}

Gradient.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

Gradient.prototype.step = function() {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.linearGradient.stops[0].color = 'rgba(' + Math.floor(this.px) + ',' + Math.floor(this.px) + ',' + Math.floor(this.px) + ',1)';
	this.linearGradient.stops[1].color = 'rgba(' + Math.floor(this.gradientValue2-this.px) + ',' + Math.floor(this.gradientValue2-this.px) + ',' + Math.floor(this.gradientValue2-this.px) + ',1)';
};

module.exports = Gradient;