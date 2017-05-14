var ShadowBars = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;


	this.group = this.parent.parent.two.makeGroup( );

	this.countInc = 0.9;

	for( var i = 0 ; i < Math.max( this.block.h, this.block.w ) ; i+=3 ){
		if( this.block.h > this.block.w ){
			var line = this.parent.parent.two.makeLine( this.block.x, this.block.y + this.block.h - i, this.block.x + this.block.w * this.countInc, this.block.y + this.block.h - i );
		} else {
			var line = this.parent.parent.two.makeLine( this.block.x + i, this.block.y + this.block.h, this.block.x + i, this.block.y + this.block.h - this.block.h * this.countInc );
		}
		this.countInc *= 0.9;
		this.group.add(line);
	}

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.linewidth = 1;
	rect.noFill();

	this.group.add(rect);

}
ShadowBars.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

ShadowBars.prototype.step = function( time ) {
	
};

module.exports = ShadowBars;