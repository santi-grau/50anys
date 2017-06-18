var Gradient = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	this.name = 'Gradient';

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
	rect.linewidth = this.parent.lineWidth;
	rect.fill = this.linearGradient;

	this.parent.parent.two.scene.remove(this.linearGradient)
	
	this.group = this.parent.parent.two.makeGroup( rect );
	
	this.px = 0;
	
	this.tween = TweenMax.to( this, 0.8, { paused : !this.animate, px : this.gradientValue2, repeat : Infinity, yoyo : true, onRepeat: this.onRepeat.bind(this), repeatDelay : (Math.random() + 0.5), ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

Gradient.prototype.onRepeat = function( val ){
	if(!this.animate) this.tween.pause();
}

Gradient.prototype.exportPDF = function( block, doc, scale, strokeWidth, patterns ){
	doc.lineJoin('miter');
	var d = [ 0, block.h, 0, 0 ];
	if( block.w > block.h ) d = [ 0, 0, block.w, 0 ];
	var grad = doc.linearGradient(d[0], d[1], d[2], d[3]);
	grad.stop(0, '#000000').stop(0.5, '#000000').stop(1, '#444444')

	doc.save().translate( block.x, block.y ).rect( 0, 0, block.w, block.h ).lineWidth(strokeWidth).fillAndStroke(grad, '#000000').restore();
}

Gradient.prototype.step = function() {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.linearGradient.stops[0].color = 'rgba(' + Math.floor(this.px) + ',' + Math.floor(this.px) + ',' + Math.floor(this.px) + ',1)';
	this.linearGradient.stops[1].color = 'rgba(' + Math.floor(this.gradientValue2-this.px) + ',' + Math.floor(this.gradientValue2-this.px) + ',' + Math.floor(this.gradientValue2-this.px) + ',1)';
};

module.exports = Gradient;