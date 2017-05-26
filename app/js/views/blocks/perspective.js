var Perspective = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;
	this.inc = 0.2;

	this.tri1 = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x + this.block.w, this.block.y),
		new Two.Anchor(this.block.x + this.block.w, this.block.y + Math.min(this.block.h,this.block.w) * this.inc),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + Math.min(this.block.h,this.block.w) * this.inc)
	];
	this.tri2 = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x, this.block.y + this.block.h ),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + this.block.h ),
		new Two.Anchor(this.block.x + Math.min(this.block.h,this.block.w) * this.inc, this.block.y + Math.min(this.block.h,this.block.w) * this.inc)
	];


	var tri1 = new Two.Path(this.tri1, true, false, false);
	var tri2 = new Two.Path(this.tri2, true, false, false);

	var w = this.block.w;
	var h = this.block.h;
	

	tri1.fill = '#323232';
	tri2.fill = '#B8BABC';

	var rect = this.parent.parent.two.makeRectangle( this.block.x + w / 2, this.block.y + h / 2 , w, h );
	rect.noStroke();
	rect.fill = '#ffffff';

	var rect2 = this.parent.parent.two.makeRectangle( this.block.x + w / 2, this.block.y + h / 2 , w, h );
	rect2.linewidth = this.parent.lineWidth;
	rect2.noFill();

	this.group = this.parent.parent.two.makeGroup( rect, tri1, tri2, rect2  );

	this.tween = TweenMax.to( this, 0.8, { paused : !this.animate, inc : 0.6, repeat : Infinity, yoyo : true, onRepeat: this.onRepeat.bind(this), repeatDelay : 0.8, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );

}
Perspective.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Perspective.prototype.onRepeat = function(){
	if(!this.animate) this.tween.pause();
	this.px = 0.2;
}

Perspective.prototype.step = function( time ) {
	if( this.animate && this.tween.paused ) this.tween.play();
	this.tri1[2].y = this.block.y + Math.min(this.block.h,this.block.w) * this.inc;
	this.tri1[3].x = this.tri2[3].x = this.block.x + Math.min(this.block.h,this.block.w) * this.inc;
	this.tri1[3].y = this.tri2[3].y = this.block.y + Math.min(this.block.h,this.block.w) * this.inc;

	this.tri2[2].x = this.block.x + Math.min(this.block.h,this.block.w) * this.inc;
};

module.exports = Perspective;