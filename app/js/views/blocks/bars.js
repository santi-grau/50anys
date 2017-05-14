var Bars = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;

	console.log('Bars');

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.fill = '#000000';
	rect.noStroke();

	this.group = this.parent.parent.two.makeGroup( rect );

	var blockWidth = Math.min( this.block.w, this.block.h ) / 6;
	var hbars = this.block.w / blockWidth;
	var vbars = this.block.h / blockWidth;

	for( var i = hbars ; i > 0 ; i-- ){
		for( var j = 0 ; j < vbars ; j++ ){
			var r = this.parent.parent.two.makeRectangle( this.block.x + blockWidth * i, this.block.y + blockWidth * j, blockWidth, blockWidth );

			this.group.add( r );
		}
	}
	console.log(hbars,vbars)

}
Bars.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Bars.prototype.step = function( time ) {
	
};

module.exports = Bars;