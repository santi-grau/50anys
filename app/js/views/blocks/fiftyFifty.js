var FiftyFifty = function( parent, block ) {
	this.parent = parent;
	this.block = block;
	this.animate = this.block.a;

	if( this.block.w == this.block.h ) this.count = 0;
	else this.count = 1;

	this.growing = true;

	var outline = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	outline.linewidth = this.parent.lineWidth;

	this.group = this.parent.parent.two.makeGroup( outline );

	this.ps = [
		new Two.Anchor(this.block.x, this.block.y),
		new Two.Anchor(this.block.x + Math.min( this.block.w, this.block.h ), this.block.y ),
		new Two.Anchor(this.block.x + Math.min( this.block.w, this.block.h ), this.block.y + Math.min( this.block.w, this.block.h ) * this.count ),
		new Two.Anchor(this.block.x, this.block.y + Math.min( this.block.w, this.block.h ) * this.count )
	];

	this.rect2 = new Two.Path(this.ps, true, false, false);

	this.rect2.linewidth = this.parent.lineWidth;
	this.rect2.fill = '#000000';

	this.group.add( this.rect2 );
}

FiftyFifty.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group );
}

FiftyFifty.prototype.switch = function( val ){
	var mods = Math.max( this.block.w, this.block.h ) /  Math.min( this.block.w, this.block.h );
	var count;
	if( mods == 1 ) count = 1 - this.count;
	else {
		if( this.growing ){
			if( this.count < mods ){
				count = this.count + 1;
			} else if( this.count == mods ){
				this.growing = false;
				count = this.count - 1;
			}
		} else {
			if( this.count > 1 ){
				count = this.count - 1;
			} else if( this.count == 1 ){
				this.growing = true;
				count = this.count + 1;
			}
		}
	}
	TweenMax.to( this, 0.8, { paused : !this.animate, count : count, ease : new Ease( BezierEasing( 0.25, 0.1, 0.25, 1.0 ) ) } );
}

FiftyFifty.prototype.step = function() {
	if( this.animate && !this.switchInterval ) {
		this.switch();
		this.switchInterval = setInterval( this.switch.bind(this), 2000 );
	}
	if( !this.animate && this.switchInterval ) clearInterval( this.switchInterval );

	if( this.block.w == this.block.h || this.block.w < this.block.h ) this.ps[2].y = this.ps[3].y = this.block.y + Math.min( this.block.w, this.block.h ) * this.count;
	if( this.block.h < this.block.w ) this.ps[1].x = this.ps[2].x = this.block.x + Math.min( this.block.w, this.block.h ) * this.count;
	
};

module.exports = FiftyFifty;