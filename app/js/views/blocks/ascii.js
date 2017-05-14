var Ascii = function( parent, block ) {
	this.parent = parent;
	this.block = block;

	this.inc = 0.3;

	console.log('ascii');

	var rect = this.parent.parent.two.makeRectangle( this.block.x + this.block.w / 2, this.block.y + this.block.h / 2, this.block.w, this.block.h );
	rect.fill = '#000000';
	rect.noStroke();

	this.group = this.parent.parent.two.makeGroup( rect );

	var lineHeight = Math.min( this.block.w, this.block.h ) / 6;
	console.log(lineHeight);
	var totalLines = this.block.h / lineHeight;

	for( var i = 1 ; i < totalLines ; i++ ){
		var w = (this.parent.parent.simplexNoise.noise2D(0,i) + 1) / 2;
		if( w < 0.3 ) w = 0;
		w *= ( this.block.w - lineHeight );

		var rect = this.parent.parent.two.makeRectangle( this.block.x + lineHeight / 2 + w / 2, this.block.y + lineHeight * i, w, lineHeight * 0.8 );
		rect.noStroke();
		rect.fill = '#ffffff';

		this.group.add(rect);
	}



}
Ascii.prototype.destroy = function( val ){
	this.parent.parent.two.remove( this.group )
}

Ascii.prototype.step = function( time ) {
	
};

module.exports = Ascii;